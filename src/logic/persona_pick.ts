// src/logic/persona_pick.ts
import type { Gender, PersonaTemplate } from '../data/personas';
import { PERSONAS } from '../data/personas';

const genderMatch = (personaGender: Gender, wanted: Gender) => {
  if (wanted === '不限') return true;
  if (personaGender === '不限') return true;
  return personaGender === wanted;
};

export function pickPersona(options: {
  age: number;
  gender: Gender;
  rng?: () => number;
}): PersonaTemplate {
  const { age, gender, rng = Math.random } = options;

  const candidates = PERSONAS.filter((p: PersonaTemplate) => {
    const ageOk = age >= p.ageMin && age <= p.ageMax;
    const genderOk = genderMatch(p.gender, gender);
    return ageOk && genderOk;
  });

  // ✅ 优先更细分（年龄跨度更小）
  const sorted = [...candidates].sort((a: PersonaTemplate, b: PersonaTemplate) => {
    const spanA = a.ageMax - a.ageMin;
    const spanB = b.ageMax - b.ageMin;
    return spanA - spanB;
  });

  // 取最细的一档（例如 span=0 的全部）
  const bestSpan = sorted.length ? sorted[0].ageMax - sorted[0].ageMin : 999;
  const best = sorted.filter((p: PersonaTemplate) => p.ageMax - p.ageMin === bestSpan);

  if (best.length === 0) {
    // 极端兜底：返回第一个
    return PERSONAS[0];
  }

  const idx = Math.floor(rng() * best.length);
  return best[idx];
}
