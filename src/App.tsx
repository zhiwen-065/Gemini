// src/App.tsx
import React, { useMemo, useState } from 'react';
import { PERSONAS, type Gender, type Interest, type PersonaTemplate } from './data/personas';
import { VIDEO_LIBRARY_ALL, type VideoItem } from './data/video_library';
import { pickPersona } from './logic/persona_pick';
import { generateFeedForPersona } from './logic/reco';

const INTERESTS: Interest[] = ['运动', '追星', '宠物', '旅游', '理财', '游戏', '学习', '美妆'];
const GENDERS: Gender[] = ['女', '男', '不限'];

export default function App() {
  const [age, setAge] = useState<number>(20);
  const [gender, setGender] = useState<Gender>('女');
  const [interest, setInterest] = useState<Interest | ''>('');

  const [persona, setPersona] = useState<PersonaTemplate>(() =>
    pickPersona({ age: 20, gender: '女' })
  );
  const [feed, setFeed] = useState<VideoItem[]>(() =>
    generateFeedForPersona(persona, { age: 20, interest: undefined })
  );

  const matchedPersonaCount = useMemo(() => {
    return PERSONAS.filter((p: PersonaTemplate) => age >= p.ageMin && age <= p.ageMax).length;
  }, [age]);

  const regeneratePersona = () => {
    const p = pickPersona({ age, gender });
    setPersona(p);
    const f = generateFeedForPersona(p, { age, interest: interest || undefined });
    setFeed(f);
  };

  const regenerateFeedOnly = () => {
    const f = generateFeedForPersona(persona, { age, interest: interest || undefined });
    setFeed(f);
  };

  return (
    <div style={{ padding: 16, fontFamily: 'system-ui, -apple-system' }}>
      <h2 style={{ marginBottom: 8 }}>Persona + Video Library Demo（可 build 版）</h2>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <label>
          年龄：
          <input
            type="number"
            value={age}
            min={15}
            max={75}
            onChange={(e) => setAge(Number(e.target.value))}
            style={{ width: 80, marginLeft: 6 }}
          />
        </label>

        <label>
          性别：
          <select value={gender} onChange={(e) => setGender(e.target.value as Gender)} style={{ marginLeft: 6 }}>
            {GENDERS.map((g: Gender) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>

        <label>
          兴趣：
          <select
            value={interest}
            onChange={(e) => setInterest(e.target.value as Interest | '')}
            style={{ marginLeft: 6 }}
          >
            <option value="">（不选）</option>
            {INTERESTS.map((it: Interest) => (
              <option key={it} value={it}>
                {it}
              </option>
            ))}
          </select>
        </label>

        <button onClick={regeneratePersona} style={{ padding: '6px 10px' }}>
          抽一个 Persona + 生成 5 条视频
        </button>

        <button onClick={regenerateFeedOnly} style={{ padding: '6px 10px' }}>
          只刷新 5 条视频（同 Persona）
        </button>
      </div>

      <div style={{ marginTop: 8, opacity: 0.8 }}>
        当前年龄命中的 Persona 卡数：{matchedPersonaCount}（包含 20–25 细分 + 大段兜底）
      </div>

      <hr style={{ margin: '16px 0' }} />

      <h3 style={{ marginBottom: 8 }}>当前 Persona</h3>
      <div style={{ border: '1px solid #ddd', borderRadius: 12, padding: 12 }}>
        <div style={{ fontWeight: 700 }}>{persona.name}</div>
        <div style={{ marginTop: 6, display: 'grid', gap: 4 }}>
          <div>
            标签：{persona.ageMin}-{persona.ageMax} / {persona.gender} / 核心钩子：{persona.coreHook}
          </div>
          <div>阶段：{persona.lifeStage}</div>
          <div>情绪：{persona.emotion}</div>
          <div>钩子排序：{persona.hookRanking.join(' / ')}</div>
          <div>陷阱路径：{persona.trapPaths.join(' | ')}</div>
          <div style={{ opacity: 0.85 }}>
            videoPolicy：
            {JSON.stringify(persona.videoPolicy ?? { count: 5 }, null, 2)}
          </div>
        </div>
      </div>

      <hr style={{ margin: '16px 0' }} />

      <h3 style={{ marginBottom: 8 }}>推荐视频（随机抽取 5 条）</h3>
      <div style={{ display: 'grid', gap: 10 }}>
        {feed.map((v: VideoItem) => (
          <div key={v.id} style={{ border: '1px solid #eee', borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 700 }}>
              {v.title} <span style={{ opacity: 0.7, fontWeight: 400 }}>({v.hookCategory}/{v.hookSubCategory})</span>
            </div>
            <div style={{ marginTop: 6, opacity: 0.9 }}>{v.caption}</div>
            <div style={{ marginTop: 8, fontSize: 12, opacity: 0.85 }}>
              为什么推：{v.pushLogic}
            </div>
            <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>
              tags：age {v.tags.ageMin}-{v.tags.ageMax} / genders {v.tags.genders.join(',')}
              {v.tags.interests?.length ? ` / interests ${v.tags.interests.join(',')}` : ' / interests 通用'}
            </div>
          </div>
        ))}
      </div>

      <hr style={{ margin: '16px 0' }} />

      <details>
        <summary>（可选）查看当前视频库总量</summary>
        <div style={{ marginTop: 8 }}>VIDEO_LIBRARY_ALL: {VIDEO_LIBRARY_ALL.length} 条</div>
      </details>
    </div>
  );
}
