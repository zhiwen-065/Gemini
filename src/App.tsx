// src/logic/reco.ts
import type { PersonaTemplate, Gender, Interest } from '../data/personas';
import { VIDEO_LIBRARY_ALL, type VideoItem } from '../data/video_library';

/**
 * 性别匹配：
 * - 视频 tags.genders 里有 '不限' => 任何 persona 都能看
 * - persona 是 '不限' => 男女都能看
 * - 否则要求包含 persona.gender
 */
const genderMatch = (personaGender: Gender, videoGenders: Gender[]) => {
  if (videoGenders.includes('不限')) return true;
  if (personaGender === '不限') return true;
  return videoGenders.includes(personaGender);
};

/** 年龄匹配：用当前 persona 的具体 age 去匹配 video.tags.ageMin~ageMax */
const ageMatch = (age: number, v: VideoItem) =>
  age >= v.tags.ageMin && age <= v.tags.ageMax;

/**
 * 兴趣匹配（软约束）：
 * - 没选兴趣 => 不限制
 * - 视频没兴趣标签（空/undefined）=> 视为通用可匹配
 * - 否则要求包含该兴趣
 */
const interestMatch = (interest: Interest | undefined, v: VideoItem) => {
  if (!interest) return true;
  const tags = v.tags.interests;
  if (!tags || tags.length === 0) return true;
  return tags.includes(interest);
};

const shuffle = <T,>(arr: T[], rng: () => number = Math.random) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const uniquePick = <T,>(arr: T[], n: number) => arr.slice(0, Math.max(0, n));

/**
 * ✅ 给某个 persona 生成视频流
 * - 强约束：年龄、性别、allowedHookCategories（若配置）
 * - 软偏好：interest（若传入），persona.videoPolicy.preferInterests（加权）
 * - 不够 count 条会自动放宽：先放宽 interest，再放宽 hook
 */
export function generateFeedForPersona(
  persona: PersonaTemplate,
  options: {
    age: number;        // 当前人物具体年龄（例如 20）
    interest?: Interest; // 当前选择的兴趣（可选）
    rng?: () => number;  // 可传入种子随机，方便演示可复现
  }
): VideoItem[] {
  const { age, interest, rng = Math.random } = options;
  const count = persona.videoPolicy?.count ?? 5;

  // 1) 基础过滤：年龄 + 性别（强约束）
  let candidates = VIDEO_LIBRARY_ALL.filter(
    v => ageMatch(age, v) && genderMatch(persona.gender, v.tags.genders)
  );

  // 2) 钩子限制（强约束，可选）
  const allowedHooks = persona.videoPolicy?.allowedHookCategories;
  if (allowedHooks && allowedHooks.length > 0) {
    // 注意：VideoItem.hookCategory 可能是 string，这里做 includes 判断即可
    candidates = candidates.filter(v => allowedHooks.includes(v.hookCategory as any));
  }

  // 3) 兴趣软匹配：打分排序（偏好强的排前面）
  const preferInterests = persona.videoPolicy?.preferInterests ?? [];
  const scored = candidates
    .map(v => {
      let score = 0;

      // 用户当前兴趣：强加分
      if (interest && v.tags.interests?.includes(interest)) score += 100;

      // persona 偏好兴趣：中等加分
      for (const pi of preferInterests) {
        if (v.tags.interests?.includes(pi)) score += 20;
      }

      // 通用视频（无兴趣标签）给一点点分，避免全被兴趣视频挤掉
      if (!v.tags.interests || v.tags.interests.length === 0) score += 5;

      return { v, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(x => x.v);

  // 4) 先按兴趣做一次“更贴合”的筛选，不够再放宽（不强制兴趣）
  let pool = scored.filter(v => interestMatch(interest, v));
  if (pool.length < count) pool = scored;

  // 5) 随机抽取 count 条（同一个 video 不会重复，因为库里本身 id 唯一；这里仍按 slice）
  let picked = uniquePick(shuffle(pool, rng), count);

  // 6) 兜底：如果还不够（通常是视频库太小/钩子限制太严）
  //    放宽 hook 限制（但仍保留年龄+性别强约束）
  if (picked.length < count) {
    const relaxed = VIDEO_LIBRARY_ALL.filter(
      v => ageMatch(age, v) && genderMatch(persona.gender, v.tags.genders)
    );

    const remain = count - picked.length;
    const more = uniquePick(
      shuffle(relaxed.filter(v => !picked.some(p => p.id === v.id)), rng),
      remain
    );
    picked = [...picked, ...more];
  }

  return picked;
}
