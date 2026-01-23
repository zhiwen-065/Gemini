// src/logic/persona_pick.ts
import type { PersonaTemplate, Gender } from '../data/personas';
import { PERSONAS } from '../data/personas';

const genderCompatible = (personaGender: Gender, inputGender: Gender) => {
  // inputGender 代表你想“生成的是男/女/不限用户”
  if (inputGender === '不限') return true;
  if (personaGender === '不限') return true;
  return personaGender === inputGender;
};

export function getCandidatePersonas(params: {
  age: number;           // 例如 20
  gender?: Gender;       // 例如 '男' | '女' | '不限'
}) {
  const { age, gender = '不限' } = params;

  return PERSONAS.filter(p => {
    const ageOk = age >= p.ageMin && age <= p.ageMax;
    const genderOk = genderCompatible(p.gender, gender);
    return ageOk && genderOk;
  });
}

/**
 * ✅ 如果你希望“优先选中更精确的人物”
 * - 比如 20岁：优先 ageMin=20 ageMax=20 的 persona
 * - 其次才是覆盖范围更大的 persona
 */
export function pickPersonaForUser(params: {
  age: number;
  gender?: Gender;
  rng?: () => number;
}): PersonaTemplate | null {
  const { age, gender = '不限', rng = Math.random } = params;
  const candidates = getCandidatePersonas({ age, gender });

  if (candidates.length === 0) return null;

  const exact = candidates.filter(p => p.ageMin === age && p.ageMax === age);
  const pool = exact.length > 0 ? exact : candidates;

  const idx = Math.floor(rng() * pool.length);
  return pool[idx];
}
