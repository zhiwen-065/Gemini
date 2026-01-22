import React, { useMemo, useRef, useState } from 'react';
import { PERSONAS, type Gender, type Interest, type PersonaTemplate, type VideoItem } from './data/personas';
import { INTERESTS } from './data/interests';

type AppStep = 'welcome' | 'input' | 'dashboard';

function matchPersona(age: number, gender: Gender): PersonaTemplate | null {
  const candidates = PERSONAS.filter((p) => {
    const ageOk = age >= p.ageMin && age <= p.ageMax;
    const genderOk = p.gender === '不限' || p.gender === gender;
    return ageOk && genderOk;
  });

  // 简单策略：优先返回“更窄年龄段”的 persona（更像精准分发）
  candidates.sort((a, b) => (a.ageMax - a.ageMin) - (b.ageMax - b.ageMin));
  return candidates[0] || null;
}

function randomBg(seed: string) {
  const n = Array.from(seed).reduce((a, c) => a + c.charCodeAt(0), 0);
  const h1 = n % 360;
  const h2 = (h1 + 40 + (n % 70)) % 360;
  return `linear-gradient(135deg, hsla(${h1}, 90%, 55%, 0.55), hsla(${h2}, 90%, 55%, 0.15))`;
}

function buildFeed(p: PersonaTemplate, interests: Interest[]): VideoItem[] {
  const videos = [...p.baseVideos];

  // 每个兴趣最多替换 1-2 条（按 persona 配置）
  for (const it of interests) {
    const rule = p.interestOverrides?.[it];
    if (!rule) continue;
    for (const r of rule.replace) {
      if (r.index >= 0 && r.index < videos.length) {
        videos[r.index] = r.video;
      }
    }
  }
  return videos.slice(0, 5);
}

export default function App() {
  const [step, setStep] = useState<AppStep>('welcome');
  const [form, setForm] = useState<{ gender: Gender; age: number; interests: Interest[] }>({
    gender: '男',
    age: 25,
    interests: []
  });

  const [activePersona, setActivePersona] = useState<PersonaTemplate | null>(null);
  const [feed, setFeed] = useState<VideoItem[]>([]);
  const [revealedLogicId, setRevealedLogicId] = useState<string | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  const personaPreview = useMemo(() => matchPersona(form.age, form.gender), [form.age, form.gender]);

  const start = () => {
    const p = matchPersona(form.age, form.gender);
    if (!p) {
      alert('没有匹配到人物库，请先在 src/data/personas.ts 增加覆盖范围。');
      return;
    }
    setActivePersona(p);
    setFeed(buildFeed(p, form.interests));
    setStep('dashboard');
  };

  const toggleInterest = (it: Interest) => {
    setForm((prev) => {
      const has = prev.interests.includes(it);
      const next = has ? prev.interests.filter((x) => x !== it) : [...prev.interests, it];
      return { ...prev, interests: next };
    });
  };

  const handleScroll = (dir: 'up' | 'down') => {
    if (!feedRef.current) return;
    const h = feedRef.current.clientHeight;
    feedRef.current.scrollBy({ top: dir === 'down' ? h : -h, behavior: 'smooth' });
  };

  return (
    <div style={{ height: '100vh', background: '#000', color: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Welcome */}
      {step === 'welcome' && (
        <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: 24 }}>
          <div style={{ textAlign: 'center', maxWidth: 520 }}>
            <div style={{ fontSize: 84, fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.05em' }}>ALGO</div>
            <div style={{ marginTop: 10, opacity: 0.6, letterSpacing: '0.5em', fontSize: 10, fontWeight: 900, textTransform: 'uppercase' }}>
              Hook-Based Feed Simulator
            </div>

            <div style={{ marginTop: 18, opacity: 0.55, fontSize: 13, lineHeight: 1.6 }}>
              这不是“你的人生”，这是算法为你生成的<strong>情绪路径</strong>。<br />
              你刷到的内容，不等于事实。
            </div>

            <button className="btn btn-primary" style={{ marginTop: 22, width: 320, padding: 18 }} onClick={() => setStep('input')}>
              启动模拟器
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      {step === 'input' && (
        <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: 24 }}>
          <div className="glass" style={{ width: 'min(520px, 92vw)', borderRadius: 28, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontSize: 22, fontWeight: 900, fontStyle: 'italic' }}>人物设定</div>
              <button className="btn btn-ghost" style={{ padding: '10px 14px', fontSize: 10 }} onClick={() => setStep('welcome')}>
                Back
              </button>
            </div>

            {/* gender */}
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              {(['男', '女'] as const).map((g) => (
                <button
                  key={g}
                  className="btn"
                  style={{
                    flex: 1,
                    padding: 12,
                    background: form.gender === g ? 'var(--red)' : 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    color: form.gender === g ? '#fff' : 'rgba(255,255,255,0.7)',
                    fontWeight: 900,
                    letterSpacing: '0.2em'
                  }}
                  onClick={() => setForm((p) => ({ ...p, gender: g }))}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* age */}
            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.7, fontSize: 11, fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                年龄 <span style={{ color: '#ef4444', fontSize: 18, fontStyle: 'italic', letterSpacing: 0 }}>{form.age}</span>
              </div>
              <input
                type="range"
                min={15}
                max={75}
                value={form.age}
                onChange={(e) => setForm((p) => ({ ...p, age: Number(e.target.value) }))}
                style={{ width: '100%', marginTop: 10 }}
              />
            </div>

            {/* interests */}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 900, opacity: 0.7, marginBottom: 8 }}>兴趣爱好（可多选）</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {INTERESTS.map((it) => {
                  const on = form.interests.includes(it);
                  return (
                    <button
                      key={it}
                      className="btn"
                      style={{
                        padding: '10px 12px',
                        borderRadius: 14,
                        background: on ? 'rgba(220,38,38,0.85)' : 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.10)',
                        color: '#fff',
                        fontWeight: 900,
                        fontSize: 12,
                        cursor: 'pointer'
                      }}
                      onClick={() => toggleInterest(it)}
                    >
                      {it}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* preview */}
            <div style={{ marginTop: 14, padding: 12, borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: 11, fontWeight: 900, opacity: 0.65, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                匹配到的人物（预览）
              </div>
              <div style={{ marginTop: 8, fontSize: 14, fontWeight: 900 }}>
                {personaPreview ? `@${personaPreview.name}（${personaPreview.coreHook}）` : '未覆盖（去 personas.ts 增加）'}
              </div>
              {personaPreview && (
                <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7, lineHeight: 1.5 }}>
                  {personaPreview.lifeStage}
                </div>
              )}
            </div>

            <button className="btn btn-primary" style={{ marginTop: 14, width: '100%', padding: 16 }} onClick={start}>
              开始刷视频
            </button>
          </div>
        </div>
      )}

      {/* Dashboard */}
      {step === 'dashboard' && activePersona && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* header */}
          <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(14px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 900, fontStyle: 'italic' }}>ALGO</div>
                <div style={{ fontSize: 12, opacity: 0.65, marginTop: 4 }}>
                  @{activePersona.name} · {form.age}岁 · {form.gender} · 兴趣：{form.interests.length ? form.interests.join('、') : '无'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-ghost" style={{ padding: '10px 14px', fontSize: 10 }} onClick={() => setStep('input')}>
                  重新设定
                </button>
              </div>
            </div>
          </div>

          {/* feed */}
          <div ref={feedRef} className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', scrollSnapType: 'y mandatory' }}>
            {feed.map((v, i) => (
              <section
                key={v.id}
                style={{
                  height: '100%',
                  minHeight: 'calc(100vh - 88px)',
                  position: 'relative',
                  scrollSnapAlign: 'start',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: 18,
                  background: v.image ? `url(${v.image}) center/cover no-repeat` : randomBg(v.id)
                }}
              >
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.92))' }} />

                <div style={{ position: 'relative', zIndex: 2, maxWidth: 560, paddingBottom: 36 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                    <span className="badge">ALGO-{i + 1}</span>
                    <span className="pill">#{v.hookSubCategory}</span>
                    <span className="pill">{v.hookCategory}</span>
                  </div>

                  <div style={{ fontSize: 42, fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.04em', lineHeight: 1.0 }}>
                    {v.title}
                  </div>
                  <div style={{ marginTop: 10, fontSize: 15, lineHeight: 1.5, color: 'rgba(255,255,255,0.88)', fontWeight: 600 }}>
                    {v.caption}
                  </div>
                </div>

                {/* side */}
                <div style={{ position: 'absolute', right: 12, bottom: 76, zIndex: 3, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {['❤️', '💬', '⭐'].map((x) => (
                    <div key={x} className="glass" style={{ width: 48, height: 48, borderRadius: 999, display: 'grid', placeItems: 'center', fontSize: 20 }}>
                      {x}
                    </div>
                  ))}

                  <button
                    className="glass"
                    onClick={() => setRevealedLogicId(revealedLogicId === v.id ? null : v.id)}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 999,
                      border: revealedLogicId === v.id ? '1px solid rgba(220,38,38,0.9)' : '1px solid rgba(255,255,255,0.10)',
                      background: revealedLogicId === v.id ? 'rgba(220,38,38,0.85)' : 'rgba(255,255,255,0.06)',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: 20
                    }}
                    title="显示推送逻辑"
                  >
                    🧠
                  </button>
                </div>

                {/* up/down */}
                <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 3, display: 'flex', flexDirection: 'column', gap: 8, opacity: 0.5 }}>
                  <button className="glass" style={{ width: 34, height: 34, borderRadius: 999, cursor: 'pointer' }} onClick={() => handleScroll('up')}>
                    ▲
                  </button>
                  <button className="glass" style={{ width: 34, height: 34, borderRadius: 999, cursor: 'pointer' }} onClick={() => handleScroll('down')}>
                    ▼
                  </button>
                </div>

                {/* logic overlay */}
                {revealedLogicId === v.id && (
                  <div
                    onClick={() => setRevealedLogicId(null)}
                    className="glass"
                    style={{
                      position: 'absolute',
                      left: 18,
                      right: 76,
                      bottom: 140,
                      zIndex: 4,
                      padding: 16,
                      borderRadius: 22,
                      border: '1px solid rgba(220,38,38,0.25)',
                      boxShadow: '0 0 40px rgba(220,38,38,0.12)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 99, background: 'var(--red)' }} />
                      <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#ef4444' }}>
                        Neural Logic Trace
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.88)', fontStyle: 'italic', lineHeight: 1.5 }}>
                      “{v.pushLogic}”
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
