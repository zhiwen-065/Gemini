// src/logic/reco.ts
import type { PersonaTemplate, Gender, Interest } from '../data/personas';
import { VIDEO_LIBRARY_ALL, type VideoItem } from '../data/video_library';

/**
 * ✅ 规则说明（你要的效果）：
 * 1) 强约束：年龄、性别、allowedHookCategories（如果配置了）
 * 2) 软偏好（加权，不强制）：
 *    - 用户当前选择的 interest（最强）
 *    - persona.interests（人物自带兴趣，中强）
 *    - persona.videoPolicy.preferInterests（策略偏好，中）
 *    - persona.preferredVideoIds（讲座“典型5条结构”的偏好，最强）
 * 3) 排除项：persona.excludeHookSubCategories（如果配置了）
 * 4) allowGeneric：
 *    - true：允许 tags.interests 为空的“通用视频”进入候选池
 *    - false：默认不把“通用视频”放进候选池（但兜底时仍可能进来）
 * 5) 退化兜底（不够 count 时）：
 *    - A：放宽兴趣（不再要求兴趣匹配）
 *    - B：放宽 hook（不再要求 allowedHookCategories）
 *    - C：最后只保年龄+性别（保证永远返回 count 条且不重复）
 */

// ------------------------------
// 基础匹配
// ------------------------------
const genderMatch = (personaGender: Gender, videoGenders: Gender[]) => {
  if (videoGenders.includes('不限')) return true;
  if (personaGender === '不限') return true;
  return videoGenders.includes(personaGender);
};

const ageMatch = (age: number, v: VideoItem) =>
  age >= v.tags.ageMin && age <= v.tags.ageMax;

const hookAllowed = (persona: PersonaTemplate, v: VideoItem) => {
  const allowedHooks = persona.videoPolicy?.allowedHookCategories;
  if (!allowedHooks || allowedHooks.length === 0) return true;
  return allowedHooks.includes(v.hookCategory as any);
};

const notExcluded = (persona: PersonaTemplate, v: VideoItem) => {
  const excluded = persona.excludeHookSubCategories;
  if (!excluded || excluded.length === 0) return true;
  return !excluded.includes(v.hookSubCategory);
};

const isGenericVideo = (v: VideoItem) =>
  !v.tags.interests || v.tags.interests.length === 0;

// ------------------------------
// 随机 & 抽样工具
// ------------------------------
const shuffle = <T,>(arr: T[], rng = Math.random) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const takeDistinctById = (arr: VideoItem[], n: number) => {
  const seen = new Set<string>();
  const out: VideoItem[] = [];
  for (const v of arr) {
    if (seen.has(v.id)) continue;
    seen.add(v.id);
    out.push(v);
    if (out.length >= n) break;
  }
  return out;
};

// ------------------------------
// 打分（核心）
// ------------------------------
function scoreVideo(params: {
  persona: PersonaTemplate;
  video: VideoItem;
  pickedInterest?: Interest;
}): number {
  const { persona, video, pickedInterest } = params;

  const preferredIds = new Set(persona.preferredVideoIds ?? []);
  const personaInterests = new Set(persona.interests ?? []);
  const preferInterests = new Set(persona.videoPolicy?.preferInterests ?? []);
  const tagsInterests = video.tags.interests ?? [];

  let score = 0;

  // ✅ 1) 讲座“典型结构”强偏好：命中 preferredVideoIds 的视频更容易被抽到
  if (preferredIds.has(video.id)) score += 260;

  // ✅ 2) 用户当前兴趣：最强加分
  if (pickedInterest && tagsInterests.includes(pickedInterest)) score += 180;

  // ✅ 3) persona 自带兴趣：中强加分
  for (const it of tagsInterests) {
    if (personaInterests.has(it)) score += 60;
  }

  // ✅ 4) videoPolicy 偏好兴趣：中等加分
  for (const it of tagsInterests) {
    if (preferInterests.has(it)) score += 25;
  }

  // ✅ 5) 通用视频：给一点点分（是否允许由 allowGeneric 控制候选池）
  if (isGenericVideo(video)) score += 6;

  // ✅ 6) 轻微随机扰动：防止每次结果完全固定（同分也随机）
  score += Math.random() * 10;

  return score;
}

// ------------------------------
// 软兴趣过滤（用于“更贴人群”的第一轮）
// ------------------------------
const interestMatchSoft = (pickedInterest: Interest | undefined, v: VideoItem) => {
  if (!pickedInterest) return true;
  // 无兴趣标签：视为“可通用”，不阻拦
  if (isGenericVideo(v)) return true;
  return (v.tags.interests ?? []).includes(pickedInterest);
};

// ------------------------------
// 主函数
// ------------------------------
export function generateFeedForPersona(
  persona: PersonaTemplate,
  options: {
    age: number;                 // 当前人物具体年龄（例如 20）
    interest?: Interest;         // 当前选择的兴趣（可选）
    rng?: () => number;          // 可传入种子随机，方便演示可复现
  }
): VideoItem[] {
  const { age, interest: pickedInterest, rng = Math.random } = options;
  const count = persona.videoPolicy?.count ?? 5;
  const allowGeneric = persona.videoPolicy?.allowGeneric ?? true;

  // 0) 基础池：年龄+性别
  const basePool = VIDEO_LIBRARY_ALL.filter(
    v => ageMatch(age, v) && genderMatch(persona.gender, v.tags.genders)
  );

  // 1) 应用排除项（始终强约束）
  const baseNotExcluded = basePool.filter(v => notExcluded(persona, v));

  // 2) 候选池（默认强约束 hook；同时根据 allowGeneric 决定是否纳入通用视频）
  const strictCandidates = baseNotExcluded
    .filter(v => hookAllowed(persona, v))
    .filter(v => allowGeneric ? true : !isGenericVideo(v));

  // 3) 打分排序（偏好 + 兴趣 + 随机扰动）
  const scoredStrict = strictCandidates
    .map(v => ({ v, score: scoreVideo({ persona, video: v, pickedInterest }) }))
    .sort((a, b) => b.score - a.score)
    .map(x => x.v);

  // 4) 第一轮：偏向“兴趣更贴”的池（但不绝对）
  //    - 这里用 soft match：兴趣不匹配的也不是完全剔除（因为后面还会退化）
  let pool = scoredStrict.filter(v => interestMatchSoft(pickedInterest, v));

  // 若第一轮太少，放宽兴趣（回到 scoredStrict）
  if (pool.length < count) pool = scoredStrict;

  // 5) 抽取：为了“既随机又偏好”，我们做一个“分层随机”
  //    - 从高分段多抽一些，同时保证每次不同
  const tier1 = pool.slice(0, Math.max(10, count * 3));
  const tier2 = pool.slice(Math.max(10, count * 3), Math.max(30, count * 8));
  const tier3 = pool.slice(Math.max(30, count * 8));

  const need1 = Math.min(count, Math.max(2, Math.floor(count * 0.6))); // 5条时≈3条
  const need2 = Math.min(count - need1, Math.max(1, Math.floor(count * 0.3))); // ≈1条
  const need3 = count - need1 - need2; // 剩余

  let picked: VideoItem[] = [];

  picked = picked.concat(takeDistinctById(shuffle(tier1, rng), need1));
  picked = picked.concat(
    takeDistinctById(
      shuffle(tier2.filter(v => !picked.some(p => p.id === v.id)), rng),
      need2
    )
  );
  picked = picked.concat(
    takeDistinctById(
      shuffle(tier3.filter(v => !picked.some(p => p.id === v.id)), rng),
      need3
    )
  );

  picked = takeDistinctById(picked, count);

  // 6) 兜底退化 A：放宽 hook（但仍保留排除项、allowGeneric控制）
  if (picked.length < count) {
    const relaxedHook = baseNotExcluded
      .filter(v => allowGeneric ? true : !isGenericVideo(v));

    const scoredRelaxedHook = relaxedHook
      .map(v => ({ v, score: scoreVideo({ persona, video: v, pickedInterest }) }))
      .sort((a, b) => b.score - a.score)
      .map(x => x.v);

    const remain = count - picked.length;
    const more = takeDistinctById(
      shuffle(scoredRelaxedHook.filter(v => !picked.some(p => p.id === v.id)), rng),
      remain
    );
    picked = takeDistinctById([...picked, ...more], count);
  }

  // 7) 兜底退化 B：最后只保年龄+性别（仍然不重复，且仍尊重排除项）
  if (picked.length < count) {
    const lastResort = baseNotExcluded;

    const remain = count - picked.length;
    const more = takeDistinctById(
      shuffle(lastResort.filter(v => !picked.some(p => p.id === v.id)), rng),
      remain
    );
    picked = takeDistinctById([...picked, ...more], count);
  }

  return picked;
}
