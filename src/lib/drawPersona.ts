import type { Gender, PersonaTemplate } from '../data/personas';

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function drawPersona(params: {
  age: number;
  gender: Gender; // '男'|'女'
  templates: PersonaTemplate[];
  /** 是否强制重抽（用于“重抽”按钮） */
  forceRedraw?: boolean;
}) {
  const { age, gender, templates, forceRedraw } = params;

  const key = `algo_draw:${age}:${gender}`;
  if (!forceRedraw) {
    const savedId = localStorage.getItem(key);
    if (savedId) {
      const hit = templates.find((t) => t.id === savedId);
      if (hit) return hit;
    }
  }

  const candidates = templates.filter((t) => {
    const ageOk = age >= t.ageMin && age <= t.ageMax;
    const genderOk = t.gender === '不限' || t.gender === gender;
    return ageOk && genderOk;
  });

  if (candidates.length === 0) return null;

  // 稳定随机：同(年龄,性别)生成一个随机序列
  const rng = mulberry32(hashSeed(`${age}:${gender}:seed`));
  const idx = Math.floor(rng() * candidates.length);
  const chosen = candidates[idx];

  localStorage.setItem(key, chosen.id);
  return chosen;
}
