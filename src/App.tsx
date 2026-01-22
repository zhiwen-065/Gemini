import React, { useMemo, useRef, useState } from 'react';

const HOOK_TAXONOMY = `
DESIRE HOOK (欲望)
- Sexual attraction (颜值/幻想/擦边)
- Film & TV erotic edges (影视撩拨)
- Relationship myths (致富神话/圈层跨越)

ANXIETY HOOK (焦虑)
- Economy / career (就业/失业/房贷压力)
- Education / family (教育鸡娃/代际冲突)
- Health panic (亚健康/猝死/疾病信号)

EMOTIONAL HOOK (情感)
- Nostalgia (怀旧共鸣/时代眼泪)
- Positive energy (社会温情/弱势群体)
- Nationalism (宏大叙事/集体荣誉)

RELIEF HOOK (解压)
- Curiosity (奇闻异事/罪案细节)
- Film & TV explanation (快节奏解说)
- Immersive experiences (沉浸式ASMR/深夜食堂)

STIMULATION HOOK (刺激)
- Sensory extremes (官能冲击)
- Challenges / adventure (极限挑战/风险博弈)
`;

type AppStep = 'welcome' | 'input' | 'dashboard';

type Video = {
  id: string;
  title: string;
  caption: string;
  hookCategory: string;
  hookSubCategory: string;
  pushLogic: string;
};

type Persona = {
  id: string;
  name: string;
  gender: string;
  age: number;
  lifeStage: string;
  emotion: string;
  hookRanking: string[];
  trapPaths: string[];
  videos: Video[];
  isLoading?: boolean;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function callWithRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let last: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (e: any) {
      last = e;
      const msg = String(e?.message || '');
      const retryable = e?.status === 429 || e?.status === 500 || msg.includes('Rpc failed');
      if (retryable && i < maxRetries - 1) {
        await sleep(800 * (i + 1));
        continue;
      }
      throw e;
    }
  }
  throw last;
}

function randomBg(seed: string) {
  // 一个简单的“占位封面背景”生成器（稳定、无图片 API）
  const n = Array.from(seed).reduce((a, c) => a + c.charCodeAt(0), 0);
  const h1 = n % 360;
  const h2 = (h1 + 40 + (n % 70)) % 360;
  return `linear-gradient(135deg, hsla(${h1}, 90%, 55%, 0.55), hsla(${h2}, 90%, 55%, 0.15))`;
}

export default function App() {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;

  const [step, setStep] = useState<AppStep>('welcome');
  const [loading, setLoading] = useState(false); // first time only
  const [formData, setFormData] = useState({ gender: '男', age: 25, interests: '' });

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [activePersonaId, setActivePersonaId] = useState<string | null>(null);
  const [showInputModal, setShowInputModal] = useState(false);
  const [revealedLogicId, setRevealedLogicId] = useState<string | null>(null);

  const feedRef = useRef<HTMLDivElement>(null);
  const activePersona = useMemo(
    () => personas.find((p) => p.id === activePersonaId),
    [personas, activePersonaId]
  );

  const startGeneration = async () => {
    if (!apiKey) {
      alert('缺少 VITE_GEMINI_API_KEY。请在 Vercel Environment Variables 里添加后重新部署。');
      return;
    }

    const isFirst = personas.length === 0;
    const tempId = String(Date.now());

    if (isFirst) setLoading(true);
    else {
      setShowInputModal(false);
      setStep('dashboard');
    }

    const placeholder: Persona = {
      id: tempId,
      name: '同步中...',
      gender: formData.gender,
      age: formData.age,
      lifeStage: '计算中',
      emotion: '...',
      hookRanking: [],
      trapPaths: [],
      videos: [],
      isLoading: true
    };

    setPersonas((prev) => [placeholder, ...prev]);
    setActivePersonaId(tempId);

    const ai = new GoogleGenAI({ apiKey });

    try {
      const textResponse = await callWithRetry(() =>
        ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `你是一个核心算法推流引擎。请为一个${formData.age}岁的${formData.gender}，兴趣包含“${formData.interests || '大众'}”的用户生成画像。

【分发逻辑】：
- 必须根据其性别与年龄推断其人生困境（如：35岁男性的职场与房贷焦虑、20岁女性的容貌与恋爱渴求）。
- 优先级：人生阶段痛点 > 兴趣标签。
- 严格基于以下钩子分类生成5条视频流：
${HOOK_TAXONOMY}

【JSON要求】（只输出JSON，不要额外文字）：
{
  "name": "极具代入感的短视频ID",
  "lifeStage": "一句话描述人生阶段困境",
  "emotion": "核心心理防线弱点",
  "hookRanking": ["前三个主要钩子"],
  "trapPaths": ["转化闭环逻辑"],
  "videoList": [
    {
      "title": "爆款标题(含表情包)",
      "caption": "短视频常见配文（引起共鸣的短句）",
      "hookCategory": "大类",
      "hookSubCategory": "子类",
      "pushLogic": "为何针对该年龄/性别的困境推送此视频"
    }
  ]
}`,
          config: { responseMimeType: 'application/json' }
        })
      );

      const res = JSON.parse((textResponse as any).text || '{}');

      const videos: Video[] = (res.videoList || []).slice(0, 5).map((v: any, idx: number) => ({
        id: `${tempId}-${idx}`,
        title: v.title,
        caption: v.caption,
        hookCategory: v.hookCategory,
        hookSubCategory: v.hookSubCategory,
        pushLogic: v.pushLogic
      }));

      const complete: Persona = {
        id: tempId,
        name: res.name || 'unknown_user',
        lifeStage: res.lifeStage || '',
        emotion: res.emotion || '',
        hookRanking: res.hookRanking || [],
        trapPaths: res.trapPaths || [],
        gender: formData.gender,
        age: formData.age,
        videos,
        isLoading: false
      };

      setPersonas((prev) => prev.map((p) => (p.id === tempId ? complete : p)));
      setStep('dashboard');
    } catch (e) {
      console.error(e);
      setPersonas((prev) => prev.filter((p) => p.id !== tempId));
      alert('连接异常，算法加载失败（可能是 quota / key / 网络）。');
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (dir: 'up' | 'down') => {
    if (!feedRef.current) return;
    const h = feedRef.current.clientHeight;
    feedRef.current.scrollBy({ top: dir === 'down' ? h : -h, behavior: 'smooth' });
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* First-load full screen */}
      {loading && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
          <div className="spin" style={{ width: 64, height: 64, borderWidth: 4, marginBottom: 18 }} />
          <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.5em', color: '#ef4444', textTransform: 'uppercase', opacity: 0.9 }}>
            Initializing Neural Engine
          </div>
        </div>
      )}

      {/* Welcome */}
      {step === 'welcome' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 28, gap: 18 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 88, fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.05em', lineHeight: 0.95, opacity: 0.95 }}>
              ALGO
            </div>
            <div style={{ fontSize: 10, letterSpacing: '0.8em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontWeight: 800, paddingLeft: 10 }}>
              Short-Video Simulator
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: 320, padding: 20 }} onClick={() => setStep('input')}>
            启动模拟器
          </button>

          <div style={{ width: 320, fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
            {apiKey ? '✅ 已检测到 VITE_GEMINI_API_KEY' : '⚠️ 未检测到 VITE_GEMINI_API_KEY（部署到 Vercel 后需配置）'}
          </div>
        </div>
      )}

      {/* Input */}
      {step === 'input' && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 22 }}>
          <div className="glass" style={{ width: 'min(420px, 92vw)', borderRadius: 34, padding: 26 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 22, fontWeight: 900, fontStyle: 'italic' }}>目标特征设定</div>
              <button className="btn btn-ghost" style={{ padding: '10px 14px', fontSize: 10 }} onClick={() => setStep('welcome')}>
                Back
              </button>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              {(['男', '女'] as const).map((g) => (
                <button
                  key={g}
                  className="btn"
                  style={{
                    flex: 1,
                    background: formData.gender === g ? 'var(--red)' : 'rgba(255,255,255,0.06)',
                    color: formData.gender === g ? '#fff' : 'rgba(255,255,255,0.55)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    padding: 14,
                    letterSpacing: '0.2em'
                  }}
                  onClick={() => setFormData((p) => ({ ...p, gender: g }))}
                >
                  {g}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                年龄 <span style={{ color: '#ef4444', fontStyle: 'italic', fontSize: 18, letterSpacing: 0 }}>{formData.age}</span>
              </div>
              <input
                type="range"
                min={15}
                max={75}
                value={formData.age}
                onChange={(e) => setFormData((p) => ({ ...p, age: Number(e.target.value) }))}
                style={{ width: '100%', marginTop: 10 }}
              />
            </div>

            <input
              className="input"
              placeholder="输入核心兴趣（可空）..."
              value={formData.interests}
              onChange={(e) => setFormData((p) => ({ ...p, interests: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && startGeneration()}
            />

            <div style={{ marginTop: 14 }}>
              <button className="btn btn-primary" style={{ width: '100%', padding: 18 }} onClick={startGeneration}>
                生成首个画像
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard */}
      {step === 'dashboard' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* Header */}
          <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(14px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 20, fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.03em' }}>ALGO</div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <button className="btn btn-ghost" style={{ padding: '10px 14px', fontSize: 10 }} onClick={() => setShowInputModal(true)}>
                  + 新增
                </button>
                <button className="btn btn-ghost" style={{ padding: '10px 14px', fontSize: 10, opacity: 0.75 }} onClick={() => setStep('welcome')}>
                  Quit
                </button>
              </div>
            </div>

            <div className="no-scrollbar" style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6 }}>
              {personas.map((p) => (
                <button
                  key={p.id}
                  onClick={() => !p.isLoading && setActivePersonaId(p.id)}
                  className="glass"
                  style={{
                    width: 78,
                    height: 54,
                    borderRadius: 18,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    padding: '10px 10px',
                    opacity: activePersonaId === p.id ? 1 : 0.55,
                    border: activePersonaId === p.id ? '1px solid rgba(220,38,38,0.9)' : '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer'
                  }}
                >
                  {p.isLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="spin" />
                      <div style={{ fontSize: 11, fontWeight: 900, opacity: 0.8 }}>同步中</div>
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: 12, fontWeight: 900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                        @{p.name}
                      </div>
                      <div style={{ fontSize: 10, opacity: 0.5, fontWeight: 800 }}>{p.age}岁 · {p.gender}</div>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Feed */}
          <div ref={feedRef} className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', scrollSnapType: 'y mandatory' }}>
            {activePersona && !activePersona.isLoading ? (
              activePersona.videos.map((v, i) => (
                <section
                  key={v.id}
                  style={{
                    height: '100%',
                    minHeight: 'calc(100vh - 110px)',
                    position: 'relative',
                    scrollSnapAlign: 'start',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: 18,
                    background: randomBg(v.id)
                  }}
                >
                  {/* bottom shade */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.92))' }} />

                  <div style={{ position: 'relative', zIndex: 2, maxWidth: 520, paddingBottom: 36 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                      <span className="badge">ALGO-{i + 1}</span>
                      <span className="pill">#{v.hookSubCategory}</span>
                    </div>

                    <div style={{ fontSize: 42, fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.04em', lineHeight: 1.0 }}>
                      {v.title}
                    </div>
                    <div style={{ marginTop: 10, fontSize: 15, lineHeight: 1.5, color: 'rgba(255,255,255,0.88)', fontWeight: 600 }}>
                      {v.caption}
                    </div>
                  </div>

                  {/* side buttons */}
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
                        width: 48, height: 48, borderRadius: 999, border: revealedLogicId === v.id ? '1px solid rgba(220,38,38,0.9)' : '1px solid rgba(255,255,255,0.10)',
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
                    <button className="glass" style={{ width: 34, height: 34, borderRadius: 999, cursor: 'pointer' }} onClick={() => handleScroll('up')}>▲</button>
                    <button className="glass" style={{ width: 34, height: 34, borderRadius: 999, cursor: 'pointer' }} onClick={() => handleScroll('down')}>▼</button>
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
              ))
            ) : (
              <div style={{ height: '100%', minHeight: 'calc(100vh - 110px)', display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,0.25)', fontWeight: 900, letterSpacing: '0.5em', textTransform: 'uppercase', fontSize: 10 }}>
                载入神经网络流...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add persona modal */}
      {showInputModal && (
        <div
          onClick={() => setShowInputModal(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 160, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', display: 'grid', placeItems: 'center', padding: 18 }}
        >
          <div className="glass" onClick={(e) => e.stopPropagation()} style={{ width: 'min(420px, 92vw)', borderRadius: 26, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <div style={{ fontSize: 18, fontWeight: 900, fontStyle: 'italic' }}>新增特征锚点</div>
              <button className="btn btn-ghost" style={{ padding: '10px 14px', fontSize: 10 }} onClick={() => setShowInputModal(false)}>
                Close
              </button>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              {(['男', '女'] as const).map((g) => (
                <button
                  key={g}
                  className="btn"
                  style={{
                    flex: 1,
                    background: formData.gender === g ? 'var(--red)' : 'rgba(255,255,255,0.06)',
                    color: formData.gender === g ? '#fff' : 'rgba(255,255,255,0.55)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    padding: 12,
                    letterSpacing: '0.2em'
                  }}
                  onClick={() => setFormData((p) => ({ ...p, gender: g }))}
                >
                  {g}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                年龄 <span style={{ color: '#ef4444', fontStyle: 'italic', fontSize: 18, letterSpacing: 0 }}>{formData.age}</span>
              </div>
              <input
                type="range"
                min={15}
                max={75}
                value={formData.age}
                onChange={(e) => setFormData((p) => ({ ...p, age: Number(e.target.value) }))}
                style={{ width: '100%', marginTop: 10 }}
              />
            </div>

            <input
              className="input"
              placeholder="兴趣点（可空）..."
              value={formData.interests}
              onChange={(e) => setFormData((p) => ({ ...p, interests: e.target.value }))}
            />

            <div style={{ marginTop: 12 }}>
              <button className="btn btn-primary" style={{ width: '100%', padding: 16 }} onClick={startGeneration}>
                确认分发
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
