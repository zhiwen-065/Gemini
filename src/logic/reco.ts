// src/logic/reco.ts
import type { PersonaTemplate, Gender, Interest } from '../data/personas';
import { VIDEO_LIBRARY_ALL, type VideoItem } from '../data/video_library';

const genderMatch = (personaGender: Gender, videoGenders: Gender[]) => {
  if (videoGenders.includes('不限')) return true;
  if (personaGender === '不限') return true;
  return videoGenders.includes(personaGender);
};

const ageMatch = (age: number, v: VideoItem) => age >= v.tags.ageMin && age <= v.tags.ageMax;

const interestMatch = (interest: Interest | undefined, v: VideoItem) => {
  if (!interest) return true; // 没选兴趣，就不限制
  if (!v.tags.interests || v.tags.interests.length === 0) return true; // 视频无兴趣标签=通用
  return v.tags.interests.includes(interest);
};

const shuffle = <T,>(arr: T[], rng: () => number) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const uniquePick = (arr: VideoItem[], n: number) => {
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

type Scored = { v: VideoItem; score: number };

const scoreCandidates = (
  candidates: VideoItem[],
  args: {
    interest?: Interest;
    preferInterests: Interest[];
    coreHook?: PersonaTemplate['coreHook'];
  }
): VideoItem[] => {
  const { interest, preferInterests, coreHook } = args;

  const scored: Scored[] = candidates.map((v: VideoItem) => {
    let score = 0;

    // 1) persona 核心钩子：加权（让内容风格更像 persona）
    if (coreHook && v.hookCategory === coreHook) score += 40;

    // 2) 用户当前选的兴趣：强加分
    if (interest && v.tags.interests?.includes(interest)) score += 100;

    // 3) persona 偏好兴趣：中等加分
    for (const pi of preferInterests) {
      if (v.tags.interests?.includes(pi)) score += 20;
    }

    // 4) 通用视频略微加分（避免全被兴趣视频垄断）
    if (!v.tags.interests || v.tags.interests.length === 0) score += 5;

    return { v, score };
  });

  // 分数相同也保持随机性：不在这里 shuffle，后面会在池子里 shuffle
  scored.sort((a, b) => b.score - a.score);
  return scored.map((x: Scored) => x.v);
};

/**
 * ✅ 给某个 persona 生成 count 条视频（默认 5）
 * - 强约束：年龄、性别、allowedHookCategories（若配置）
 * - 软偏好：interest（若传入），preferInterests，coreHook
 * - 不够：先放宽兴趣，再放宽 hook，再放宽到“同年龄同性别全部”
 */
export function generateFeedForPersona(
  persona: PersonaTemplate,
  options: {
    age: number; // 当前人物具体年龄（例如 20）
    interest?: Interest;
    rng?: () => number;
  }
): VideoItem[] {
  const { age, interest, rng = Math.random } = options;
  const count = persona.videoPolicy?.count ?? 5;

  // 1) 基础过滤：年龄 + 性别（强约束）
  const baseCandidates = VIDEO_LIBRARY_ALL.filter(
    (v: VideoItem) => ageMatch(age, v) && genderMatch(persona.gender, v.tags.genders)
  );

  // 2) hook 限制（强约束，若配置）
  const allowedHooks = persona.videoPolicy?.allowedHookCategories;
  const hookCandidates =
    allowedHooks && allowedHooks.length > 0
      ? baseCandidates.filter((v: VideoItem) => allowedHooks.includes(v.hookCategory))
      : baseCandidates;

  // 3) 排序：按兴趣/偏好/coreHook 打分
  const preferInterests = persona.videoPolicy?.preferInterests ?? [];
  const ranked = scoreCandidates(hookCandidates, {
    interest,
    preferInterests,
    coreHook: persona.coreHook
  });

  // 4) 先按兴趣过滤（更贴人群），不够再放宽（只放宽兴趣，不放宽 hook）
  let pool = ranked.filter((v: VideoItem) => interestMatch(interest, v));
  if (pool.length < count) pool = ranked;

  // 5) 随机抽取 + 去重
  let picked = uniquePick(shuffle(pool, rng), count);

  // 6) 如果还不够：放宽 hook（回到 baseCandidates，但仍按兴趣打分）
  if (picked.length < count) {
    const rankedRelaxHook = scoreCandidates(baseCandidates, {
      interest,
      preferInterests,
      coreHook: persona.coreHook
    });

    const remain = count - picked.length;
    const extraPool = rankedRelaxHook.filter((v: VideoItem) => !picked.some((p: VideoItem) => p.id === v.id));

    const extra = uniquePick(shuffle(extraPool, rng), remain);
    picked = [...picked, ...extra];
  }

  // 7) 兜底：如果仍不够（极少发生），直接从全库找同年龄同性别补齐
  if (picked.length < count) {
    const fallback = VIDEO_LIBRARY_ALL.filter(
      (v: VideoItem) => ageMatch(age, v) && genderMatch(persona.gender, v.tags.genders)
    ).filter((v: VideoItem) => !picked.some((p: VideoItem) => p.id === v.id));

    const remain = count - picked.length;
    const extra = uniquePick(shuffle(fallback, rng), remain);
    picked = [...picked, ...extra];
  }

  return picked;
}
