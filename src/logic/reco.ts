// src/logic/reco.ts
import type { PersonaTemplate, Gender, Interest } from '../data/personas';
import { VIDEO_LIBRARY_ALL, type VideoItem } from '../data/video_library';

const genderMatch = (personaGender: Gender, videoGenders: Gender[]) => {
  if (videoGenders.includes('不限')) return true;
  if (personaGender === '不限') return true;
  return videoGenders.includes(personaGender);
};

const ageMatch = (age: number, v: VideoItem) =>
  age >= v.tags.ageMin && age <= v.tags.ageMax;

const interestMatch = (interest: Interest | undefined, v: VideoItem) => {
  if (!interest) return true; // 没选兴趣，就不限制
  if (!v.tags.interests || v.tags.interests.length === 0) return true; // 视频无兴趣标签，视为可通用
  return v.tags.interests.includes(interest);
};

const shuffle = <T,>(arr: T[], rng = Math.random) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const uniquePick = <T,>(arr: T[], n: number) => arr.slice(0, n);

/**
 * ✅ 给某个 persona 生成 5 条视频
 * - 强约束：年龄、性别、allowedHookCategories（若配置）
 * - 软偏好：interest（若传入），persona.videoPolicy.preferInterests（加权）
 * - 不够 5 条会自动放宽：先放宽 interest，再放宽 hook
 */
export function generateFeedForPersona(
  persona: PersonaTemplate,
  options: {
    age: number;                 // 当前人物具体年龄（例如 20）
    interest?: Interest;         // 当前选择的兴趣（可选）
    rng?: () => number;          // 可传入种子随机，方便演示可复现
  }
): VideoItem[] {
  const { age, interest, rng = Math.random } = options;
  const count = persona.videoPolicy?.count ?? 5;

  // 1) 基础过滤：年龄+性别
  let candidates = VIDEO_LIBRARY_ALL.filter(v => ageMatch(age, v) && genderMatch(persona.gender, v.tags.genders));

  // 2) 钩子限制（可选）
  const allowedHooks = persona.videoPolicy?.allowedHookCategories;
  if (allowedHooks && allowedHooks.length > 0) {
    candidates = candidates.filter(v => allowedHooks.includes(v.hookCategory));
  }

  // 3) 兴趣软匹配：优先把兴趣匹配的视频放前面（但不绝对）
  const preferInterests = persona.videoPolicy?.preferInterests ?? [];
  const scored = candidates
    .map(v => {
      let score = 0;

      // 用户选的兴趣：强加分
      if (interest && v.tags.interests?.includes(interest)) score += 100;

      // persona 偏好兴趣：中等加分
      for (const pi of preferInterests) {
        if (v.tags.interests?.includes(pi)) score += 20;
      }

      // 同时也允许“无兴趣标签”的通用视频
      if (!v.tags.interests || v.tags.interests.length === 0) score += 5;

      return { v, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(x => x.v);

  // 4) 先按兴趣过滤一次（更贴人群），不够再放宽
  let pool = scored.filter(v => interestMatch(interest, v));
  if (pool.length < count) pool = scored; // 放宽：不强制兴趣

  // 5) 随机 + 去重抽取
  let picked = uniquePick(shuffle(pool, rng), count);

  // 6) 兜底：如果还不够（理论上很少），放宽 hook 限制
  if (picked.length < count) {
    const relaxed = VIDEO_LIBRARY_ALL.filter(
      v => ageMatch(age, v) && genderMatch(persona.gender, v.tags.genders)
    );
    const remain = count - picked.length;
    const more = uniquePick(shuffle(relaxed.filter(v => !picked.some(p => p.id === v.id)), rng), remain);
    picked = [...picked, ...more];
  }

  return picked;
}
