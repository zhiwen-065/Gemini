import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type } from '@google/genai';

// --- Types & Constants ---

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

interface Persona {
  id: string;
  name: string;
  gender: string;
  age: number;
  lifeStage: string;
  emotion: string;
  hookRanking: string[];
  trapPaths: string[];
  avatarUrl: string;
  videos: Video[];
  isLoading?: boolean;
}

interface Video {
  id: string;
  title: string;
  caption: string;
  hookCategory: string;
  hookSubCategory: string;
  pushLogic: string;
  imageUrl: string;
}

type AppStep = 'welcome' | 'input' | 'dashboard';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function callWithRetry(fn: () => Promise<any>, maxRetries = 3): Promise<any> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const isRetryable = err.status === 500 || err.status === 429 || String(err.message).includes('Rpc failed');
      if (isRetryable && i < maxRetries - 1) {
        await sleep(1000 * (i + 1));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// --- App Component ---

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('welcome');
  const [loading, setLoading] = useState(false); // Only for the very first load
  const [formData, setFormData] = useState({ gender: '男', age: 25, interests: '' });
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [activePersonaId, setActivePersonaId] = useState<string | null>(null);
  const [zoomCardId, setZoomCardId] = useState<string | null>(null);
  const [revealedLogicId, setRevealedLogicId] = useState<string | null>(null);
  const [showInputModal, setShowInputModal] = useState(false);

  const feedRef = useRef<HTMLDivElement>(null);
  const activePersona = personas.find(p => p.id === activePersonaId);

  const startGeneration = async () => {
    const isFirst = personas.length === 0;
    const tempId = Date.now().toString();
    
    // UI state transition
    if (isFirst) {
      setLoading(true);
    } else {
      setShowInputModal(false);
      setStep('dashboard');
    }

    // Add placeholder persona
    const placeholder: Persona = {
      id: tempId,
      name: '同步中...',
      gender: formData.gender,
      age: formData.age,
      lifeStage: '计算中',
      emotion: '...',
      hookRanking: [],
      trapPaths: [],
      avatarUrl: '',
      videos: [],
      isLoading: true
    };
    setPersonas(prev => [placeholder, ...prev]);
    setActivePersonaId(tempId);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

    try {
      // 1. Generate Persona and Video Plan
      const textResponse = await callWithRetry(() => ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `你是一个核心算法推流引擎。请为一个${formData.age}岁的${formData.gender}，兴趣包含“${formData.interests || '大众'}”的用户生成画像。
        
        【分发逻辑】：
        - 必须根据其性别与年龄推断其人生困境（如：35岁男性的职场与房贷焦虑、20岁女性的容貌与恋爱渴求）。
        - 优先级：人生阶段痛点 > 兴趣标签。
        - 严格基于以下钩子分类生成5条视频流：
        ${HOOK_TAXONOMY}
        
        【JSON要求】：
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
              "visualPrompt": "用于绘图的英文视觉描述",
              "hookCategory": "大类",
              "hookSubCategory": "子类",
              "pushLogic": "为何针对该年龄/性别的困境推送此视频"
            }
          ]
        }`,
        config: { responseMimeType: 'application/json' }
      }));
      
      const res = JSON.parse(textResponse.text || '{}');
      
      // 2. Generate All Images (Avatar + 5 Videos)
      const avatarPromise = callWithRetry(() => ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: `A realistic cinematic portrait of a ${formData.age} year old ${formData.gender} for social media profile, highly detailed.`
      }));

      const videoPromises = res.videoList.map((v: any) => 
        callWithRetry(() => ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: `Still from a viral mobile short video: ${v.visualPrompt}. Cinematic, high contrast, 9:16 vertical ratio.`
        }))
      );

      const [avatarResp, ...videoResps] = await Promise.all([avatarPromise, ...videoPromises]);

      const getBase64 = (resp: any) => {
        const part = resp.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
        return part ? `data:image/png;base64,${part.inlineData.data}` : '';
      };

      const finalVideos: Video[] = res.videoList.map((v: any, idx: number) => ({
        id: `${tempId}-${idx}`,
        title: v.title,
        caption: v.caption,
        hookCategory: v.hookCategory,
        hookSubCategory: v.hookSubCategory,
        pushLogic: v.pushLogic,
        imageUrl: getBase64(videoResps[idx])
      }));

      const completePersona: Persona = {
        id: tempId,
        name: res.name,
        lifeStage: res.lifeStage,
        emotion: res.emotion,
        hookRanking: res.hookRanking,
        trapPaths: res.trapPaths,
        gender: formData.gender,
        age: formData.age,
        avatarUrl: getBase64(avatarResp),
        videos: finalVideos,
        isLoading: false
      };

      setPersonas(prev => prev.map(p => p.id === tempId ? completePersona : p));
      setStep('dashboard');
    } catch (err) {
      setPersonas(prev => prev.filter(p => p.id !== tempId));
      alert('连接异常，算法加载失败。');
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (dir: 'up' | 'down') => {
    if (feedRef.current) {
      const h = feedRef.current.clientHeight;
      feedRef.current.scrollBy({ top: dir === 'down' ? h : -h, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-screen bg-black text-zinc-100 flex flex-col font-sans overflow-hidden select-none">
      {/* Loading (Only First) */}
      {loading && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-[10px] font-black tracking-[0.5em] text-red-500 uppercase animate-pulse">Initializing Neural Engine</p>
        </div>
      )}

      {/* Welcome Step */}
      {step === 'welcome' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-12 animate-in fade-in duration-1000">
          <div className="text-center space-y-2">
            <h1 className="text-8xl font-black italic tracking-tighter bg-gradient-to-b from-white to-zinc-800 bg-clip-text text-transparent">ALGO</h1>
            <p className="text-[9px] tracking-[0.8em] text-zinc-600 font-bold uppercase pl-3">Short-Video Simulator</p>
          </div>
          <button onClick={() => setStep('input')} className="w-full max-w-xs py-6 bg-white text-black font-black rounded-full text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">启动模拟器</button>
        </div>
      )}

      {/* Initial Input (Not Modal) */}
      {step === 'input' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in slide-in-from-bottom-10">
          <div className="w-full max-w-sm glass p-10 rounded-[40px] space-y-10">
            <h2 className="text-2xl font-black italic">目标特征设定</h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                {['男', '女'].map(g => (
                  <button key={g} onClick={() => setFormData(p => ({...p, gender: g}))} className={`flex-1 py-4 rounded-2xl border-2 font-black transition-all ${formData.gender === g ? 'bg-red-600 border-red-600' : 'border-zinc-800 text-zinc-600'}`}>{g}</button>
                ))}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase text-zinc-500">年龄: <span className="text-red-500 text-lg italic">{formData.age}</span></div>
                <input type="range" min="15" max="75" value={formData.age} onChange={e => setFormData(p => ({...p, age: parseInt(e.target.value)}))} className="w-full accent-red-600" />
              </div>
              <input type="text" placeholder="输入核心兴趣..." value={formData.interests} onChange={e => setFormData(p => ({...p, interests: e.target.value}))} onKeyDown={e => e.key === 'Enter' && startGeneration()} className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl px-6 py-4 text-sm outline-none focus:border-red-600 transition-all" />
              <button onClick={startGeneration} className="w-full py-5 bg-red-600 rounded-full font-black text-xs uppercase tracking-widest shadow-xl">生成首个画像</button>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard */}
      {step === 'dashboard' && (
        <div className="flex-1 flex flex-col h-full relative">
          {/* Header (Very Compact) */}
          <div className="px-4 py-4 border-b border-white/5 bg-black/60 backdrop-blur-3xl z-50">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-black italic tracking-tighter">ALGO</h1>
              <div className="flex gap-3">
                <button onClick={() => setShowInputModal(true)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-lg">+</button>
                <button onClick={() => setStep('welcome')} className="text-[9px] opacity-30 hover:opacity-100 uppercase font-black">Quit</button>
              </div>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {personas.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => !p.isLoading && setActivePersonaId(p.id)} 
                  className={`relative flex-shrink-0 w-14 h-20 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${activePersonaId === p.id ? 'border-red-600 scale-105' : 'border-transparent opacity-40'}`}
                >
                  {p.isLoading ? (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <>
                      <img src={p.avatarUrl} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20"></div>
                      <button onClick={(e) => { e.stopPropagation(); setZoomCardId(p.id); }} className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-[8px]">👁️</button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Feed */}
          <div ref={feedRef} className="flex-1 overflow-y-auto snap-y snap-mandatory no-scrollbar bg-black">
            {activePersona && !activePersona.isLoading ? (
              activePersona.videos.map((v, i) => (
                <div key={v.id} className="h-full w-full snap-start relative flex flex-col justify-end p-6 pb-12 overflow-hidden">
                  <div className="absolute inset-0">
                    {v.imageUrl ? <img src={v.imageUrl} className="w-full h-full object-cover opacity-70" /> : <div className="w-full h-full bg-zinc-900 animate-pulse"></div>}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/95"></div>
                  </div>
                  
                  <div className="relative z-10 space-y-3 max-w-[80%] animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-black bg-red-600 px-1.5 py-0.5 rounded tracking-tighter italic">ALGO-{i+1}</span>
                       <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">#{v.hookSubCategory}</span>
                    </div>
                    <h4 className="text-3xl font-black italic tracking-tighter leading-none">{v.title}</h4>
                    <p className="text-sm text-zinc-100 leading-snug font-medium pr-8">{v.caption}</p>
                  </div>

                  {/* Sidebar Interaction */}
                  <div className="absolute right-4 bottom-12 flex flex-col gap-6 items-center z-20">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl backdrop-blur-xl">❤️</div>
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl backdrop-blur-xl">💬</div>
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl backdrop-blur-xl">⭐</div>
                    
                    <button 
                      onClick={() => setRevealedLogicId(revealedLogicId === v.id ? null : v.id)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl backdrop-blur-xl border-2 transition-all ${revealedLogicId === v.id ? 'bg-red-600 border-red-400 scale-110' : 'bg-black/40 border-white/5'}`}
                    >
                      🧠
                    </button>
                  </div>

                  {/* Up/Down Floating Nav */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 opacity-30 hover:opacity-100 transition-opacity">
                    <button onClick={() => handleScroll('up')} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">▲</button>
                    <button onClick={() => handleScroll('down')} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">▼</button>
                  </div>

                  {/* Logic Overlay */}
                  {revealedLogicId === v.id && (
                    <div className="absolute inset-x-6 bottom-36 z-40 animate-in zoom-in-95 duration-200" onClick={() => setRevealedLogicId(null)}>
                      <div className="glass p-6 rounded-[32px] border-red-500/30 shadow-[0_0_50px_rgba(220,38,38,0.2)]">
                        <div className="flex items-center gap-2 mb-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>
                           <h5 className="text-[10px] font-black text-red-500 uppercase tracking-widest">Neural Logic Trace</h5>
                        </div>
                        <p className="text-xs text-zinc-200 leading-relaxed italic font-medium">“{v.pushLogic}”</p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-800 text-[10px] font-black uppercase tracking-[0.5em]">载入神经网络流...</div>
            )}
          </div>
        </div>
      )}

      {/* Input Modal */}
      {showInputModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm" onClick={() => setShowInputModal(false)}>
          <div className="w-full max-w-xs glass p-10 rounded-[40px] space-y-8 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-black italic">新增特征锚点</h3>
            <div className="space-y-6">
              <div className="flex gap-2">
                {['男', '女'].map(g => (
                  <button key={g} onClick={() => setFormData(p => ({...p, gender: g}))} className={`flex-1 py-3 rounded-xl border-2 font-black transition-all text-xs ${formData.gender === g ? 'bg-red-600 border-red-600' : 'border-zinc-800 text-zinc-600'}`}>{g}</button>
                ))}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-black uppercase text-zinc-500">年龄: <span className="text-red-500">{formData.age}</span></div>
                <input type="range" min="15" max="75" value={formData.age} onChange={e => setFormData(p => ({...p, age: parseInt(e.target.value)}))} className="w-full accent-red-600" />
              </div>
              <input type="text" placeholder="兴趣点..." value={formData.interests} onChange={e => setFormData(p => ({...p, interests: e.target.value}))} className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-xl px-4 py-3 text-xs outline-none" />
              <button onClick={startGeneration} className="w-full py-4 bg-red-600 rounded-full font-black text-xs uppercase tracking-widest">确认分发</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Card Modal */}
      {zoomCardId && personas.find(p => p.id === zoomCardId) && (() => {
        const p = personas.find(p => p.id === zoomCardId)!;
        return (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl" onClick={() => setZoomCardId(null)}>
            <div className="w-full max-w-xs glass rounded-[40px] p-8 space-y-8 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <img src={p.avatarUrl} className="w-14 h-14 rounded-full border-2 border-red-600 p-0.5 object-cover" />
                <div>
                  <h3 className="text-xl font-black italic">@{p.name}</h3>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase">{p.age}岁 | {p.gender}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">人设阶段锚点</p>
                  <div className="text-[11px] font-bold text-red-500 bg-red-500/5 p-3 rounded-2xl border border-red-500/10 italic leading-relaxed">{p.lifeStage}</div>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">深层共鸣弱点</p>
                  <p className="text-xs text-zinc-400 font-medium italic leading-relaxed">“{p.emotion}”</p>
                </div>
              </div>
              <button onClick={() => setZoomCardId(null)} className="w-full py-4 bg-zinc-100 text-black font-black rounded-full text-[10px] uppercase">关闭档案</button>
            </div>
          </div>
        );
      })()}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        input[type=range] { appearance: none; background: #27272a; height: 4px; border-radius: 2px; }
        input[type=range]::-webkit-slider-thumb { appearance: none; height: 16px; width: 16px; border-radius: 50%; background: #dc2626; cursor: pointer; }
      `}</style>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
