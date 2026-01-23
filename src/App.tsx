import React, { useMemo, useRef, useState } from 'react';
import './App.css';

import { PERSONAS, type Gender, type Interest, type PersonaTemplate } from './data/personas';
import type { VideoItem } from './data/video_library';

import { generateFeedForPersona } from './logic/reco';
import { drawPersona } from './lib/drawPersona';

type Phase = 'setup' | 'loading' | 'feed';

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

function formatCount(n: number) {
  if (n < 1000) return String(n);
  if (n < 10000) return (n / 1000).toFixed(1) + 'k';
  return (n / 10000).toFixed(1) + 'w';
}

function seededRng(seed: number) {
  // 简单可复现随机：mulberry32
  return function () {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function App() {
  // ========= Setup inputs =========
  const [ageInput, setAgeInput] = useState<number>(20);
  const [genderInput, setGenderInput] = useState<Gender>('女');
  const [interestInput, setInterestInput] = useState<Interest | ''>('');

  // ========= Runtime state =========
  const [phase, setPhase] = useState<Phase>('setup');
  const [persona, setPersona] = useState<PersonaTemplate | null>(null);
  const [feed, setFeed] = useState<VideoItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // UI states for “actions”
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [counts, setCounts] = useState<Record<string, { like: number; comment: number; save: number }>>({});

  const containerRef = useRef<HTMLDivElement | null>(null);

  const interests: Interest[] = useMemo(
    () => ['运动', '追星', '宠物', '旅游', '理财', '游戏', '学习', '美妆'],
    []
  );

  const genders: Gender[] = useMemo(() => ['男', '女', '不限'], []);

  // ========= helpers =========
  const initCountsIfNeeded = (videos: VideoItem[], rng: () => number) => {
    setCounts(prev => {
      const next = { ...prev };
      for (const v of videos) {
        if (!next[v.id]) {
          // 初始化一些像“抖音”的数
          const base = Math.floor(rng() * 8000) + 80;
          next[v.id] = {
            like: base + Math.floor(rng() * 9000),
            comment: Math.floor(rng() * 2000),
            save: Math.floor(rng() * 1500),
          };
        }
      }
      return next;
    });
  };

  const scrollToIndex = (idx: number) => {
    const el = containerRef.current;
    if (!el) return;
    const target = el.querySelector<HTMLDivElement>(`[data-index="${idx}"]`);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const buildFeed = (p: PersonaTemplate, seed: number) => {
    const rng = seededRng(seed);
    const videos = generateFeedForPersona(p, {
      age: ageInput,
      interest: interestInput ? (interestInput as Interest) : undefined,
      rng,
    });
    initCountsIfNeeded(videos, rng);
    setFeed(videos);
    setActiveIndex(0);
    // reset action state for new feed (可选：你也可以保留)
    setLiked({});
    setSaved({});
    // scroll to first
    setTimeout(() => scrollToIndex(0), 50);
  };

  const enterFeed = (p: PersonaTemplate, seed: number) => {
    setPhase('loading');
    setPersona(p);

    // 你想要“加载完成后开始刷”，给一点加载动画时间
    setTimeout(() => {
      buildFeed(p, seed);
      setPhase('feed');
    }, 650);
  };

  const pickPersonaAndEnter = () => {
    const p = drawPersona(PERSONAS, {
      age: ageInput,
      gender: genderInput,
      interest: interestInput ? (interestInput as Interest) : undefined,
    });
    // seed 让你每次“抽一个 persona + 生成 5 条”更像随机
    const seed = Date.now() % 1000000000;
    enterFeed(p, seed);
  };

  const refreshSamePersona = () => {
    if (!persona) return;
    const seed = Date.now() % 1000000000;
    setPhase('loading');
    setTimeout(() => {
      buildFeed(persona, seed);
      setPhase('feed');
    }, 450);
  };

  const refreshNewPersona = () => {
    const p = drawPersona(PERSONAS, {
      age: ageInput,
      gender: genderInput,
      interest: interestInput ? (interestInput as Interest) : undefined,
    });
    const seed = Date.now() % 1000000000;
    enterFeed(p, seed);
  };

  const backToSetup = () => {
    setPhase('setup');
    setPersona(null);
    setFeed([]);
    setActiveIndex(0);
  };

  const onScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    // 找离顶部最近的 card
    const cards = Array.from(el.querySelectorAll<HTMLDivElement>('.tt-card'));
    let bestIdx = 0;
    let bestDist = Infinity;
    for (const c of cards) {
      const idx = Number(c.dataset.index || 0);
      const rect = c.getBoundingClientRect();
      const dist = Math.abs(rect.top); // 离顶部距离
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = idx;
      }
    }
    setActiveIndex(clamp(bestIdx, 0, Math.max(0, feed.length - 1)));
  };

  const toggleLike = (v: VideoItem) => {
    setLiked(prev => {
      const next = !prev[v.id];
      setCounts(c => ({
        ...c,
        [v.id]: {
          ...c[v.id],
          like: (c[v.id]?.like ?? 0) + (next ? 1 : -1),
        },
      }));
      return { ...prev, [v.id]: next };
    });
  };

  const toggleSave = (v: VideoItem) => {
    setSaved(prev => {
      const next = !prev[v.id];
      setCounts(c => ({
        ...c,
        [v.id]: {
          ...c[v.id],
          save: (c[v.id]?.save ?? 0) + (next ? 1 : -1),
        },
      }));
      return { ...prev, [v.id]: next };
    });
  };

  // ========= RENDER =========
  return (
    <div className="tt-root">
      {/* 顶部栏：无论哪个阶段都显示（feed 时更像产品） */}
      <div className="tt-topbar">
        <div className="tt-topbar-left">
          <div className="tt-chip">
            年龄
            <input
              className="tt-age"
              type="number"
              value={ageInput}
              onChange={e => setAgeInput(clamp(Number(e.target.value || 0), 15, 75))}
            />
          </div>

          <select className="tt-select" value={genderInput} onChange={e => setGenderInput(e.target.value as Gender)}>
            {genders.map(g => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <select className="tt-select" value={interestInput} onChange={e => setInterestInput(e.target.value as any)}>
            <option value="">(不选兴趣)</option>
            {interests.map(i => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        <div className="tt-topbar-right">
          {phase === 'setup' && (
            <button className="tt-btn primary" onClick={pickPersonaAndEnter}>
              抽一个 Persona + 生成 5 条视频
            </button>
          )}

          {phase !== 'setup' && (
            <>
              <button className="tt-btn" onClick={backToSetup}>
                返回人物设定
              </button>
              <button className="tt-btn" onClick={refreshSamePersona}>
                只刷新 5 条（同 Persona）
              </button>
              <button className="tt-btn primary" onClick={refreshNewPersona}>
                换 Persona + 刷新 5 条
              </button>
            </>
          )}
        </div>
      </div>

      {/* 主体 */}
      {phase === 'setup' && (
        <div className="tt-setup">
          <div className="tt-setup-card">
            <div className="tt-title">人物设定</div>
            <div className="tt-sub">
              先设定年龄/性别/兴趣 → 抽 Persona → 加载完成后进入刷短视频（每次固定 5 条，随机抽取）
            </div>

            <div className="tt-row">
              <div className="tt-field">
                <div className="tt-label">年龄</div>
                <input
                  className="tt-input"
                  type="number"
                  value={ageInput}
                  onChange={e => setAgeInput(clamp(Number(e.target.value || 0), 15, 75))}
                />
              </div>

              <div className="tt-field">
                <div className="tt-label">性别</div>
                <select className="tt-input" value={genderInput} onChange={e => setGenderInput(e.target.value as Gender)}>
                  {genders.map(g => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div className="tt-field">
                <div className="tt-label">兴趣（可选）</div>
                <select className="tt-input" value={interestInput} onChange={e => setInterestInput(e.target.value as any)}>
                  <option value="">不选</option>
                  {interests.map(i => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="tt-actions">
              <button className="tt-btn primary big" onClick={pickPersonaAndEnter}>
                开始 → 加载 → 刷短视频
              </button>
            </div>

            <div className="tt-hint">
              说明：你设为 20 岁时，会同时命中：
              <ul>
                <li>20–25 库里 “严格 20 岁” 的 persona（细分）</li>
                <li>以及全库里 “覆盖到 20 岁的年龄段 persona”（兜底）</li>
              </ul>
              抽卡概率由 <code>drawPersona()</code> 决定。
            </div>
          </div>
        </div>
      )}

      {phase === 'loading' && (
        <div className="tt-loading">
          <div className="tt-spinner" />
          <div className="tt-loading-text">加载中…（模拟内容分发/排序）</div>
          {persona && (
            <div className="tt-loading-sub">
              当前 Persona：<b>{persona.name}</b> ｜核心钩子：<b>{persona.coreHook}</b>
            </div>
          )}
        </div>
      )}

      {phase === 'feed' && persona && (
        <div className="tt-feed" ref={containerRef} onScroll={onScroll}>
          {/* 顶部悬浮：当前 persona 说明 */}
          <div className="tt-feed-header">
            <div className="tt-feed-header-left">
              <div className="tt-persona-name">{persona.name}</div>
              <div className="tt-persona-meta">
                年龄 {ageInput} ｜ 性别 {genderInput} ｜ 兴趣 {interestInput || '未选择'}
              </div>
            </div>

            <div className="tt-feed-header-right">
              <div className="tt-index">
                {activeIndex + 1}/{feed.length}
              </div>
            </div>
          </div>

          {feed.map((v, idx) => {
            const c = counts[v.id] || { like: 0, comment: 0, save: 0 };
            const isLiked = !!liked[v.id];
            const isSaved = !!saved[v.id];

            return (
              <div className="tt-card" key={v.id} data-index={idx}>
                {/* “视频画面”区域：这里用图片模拟（你也可以换成 video 标签） */}
                <div className="tt-video">
                  {v.image ? (
                    <img className="tt-video-img" src={v.image} alt={v.title} />
                  ) : (
                    <div className="tt-video-placeholder">
                      <div className="tt-video-ph-title">{v.title}</div>
                      <div className="tt-video-ph-sub">（未配置 image，用占位模拟视频画面）</div>
                    </div>
                  )}

                  {/* 右侧：点赞/评论/收藏 */}
                  <div className="tt-side">
                    <button
                      className={`tt-side-btn ${isLiked ? 'on' : ''}`}
                      onClick={() => toggleLike(v)}
                      aria-label="like"
                    >
                      <div className="tt-ico">❤️</div>
                      <div className="tt-num">{formatCount(c.like)}</div>
                    </button>

                    <button className="tt-side-btn" onClick={() => alert('演示：打开评论面板（你可以替换成 Drawer）')}>
                      <div className="tt-ico">💬</div>
                      <div className="tt-num">{formatCount(c.comment)}</div>
                    </button>

                    <button
                      className={`tt-side-btn ${isSaved ? 'on' : ''}`}
                      onClick={() => toggleSave(v)}
                      aria-label="save"
                    >
                      <div className="tt-ico">⭐</div>
                      <div className="tt-num">{formatCount(c.save)}</div>
                    </button>
                  </div>

                  {/* 底部：文案信息（标题 + caption） */}
                  <div className="tt-caption">
                    <div className="tt-caption-title">{v.title}</div>
                    <div className="tt-caption-sub">{v.caption}</div>
                  </div>
                </div>

                {/* 详情：钩子 + 为什么推送给我 */}
                <div className="tt-detail">
                  <div className="tt-detail-row">
                    <span className="tt-badge">{v.hookCategory}</span>
                    <span className="tt-badge subtle">{v.hookSubCategory}</span>
                  </div>

                  <div className="tt-detail-title">为什么推送给我？</div>
                  <div className="tt-detail-text">{v.pushLogic}</div>

                  <div className="tt-persona-detail">
                    <div className="tt-persona-detail-title">你现在的人物画像（本轮）</div>
                    <div className="tt-persona-grid">
                      <div>
                        <div className="tt-k">人生阶段</div>
                        <div className="tt-v">{persona.lifeStage}</div>
                      </div>
                      <div>
                        <div className="tt-k">情绪底色</div>
                        <div className="tt-v">{persona.emotion}</div>
                      </div>
                      <div>
                        <div className="tt-k">钩子排序</div>
                        <div className="tt-v">{persona.hookRanking.join(' / ')}</div>
                      </div>
                      <div>
                        <div className="tt-k">成瘾路径</div>
                        <div className="tt-v">{persona.trapPaths.join(' / ')}</div>
                      </div>
                    </div>
                  </div>

                  <div className="tt-tip">
                    继续下滑进入下一条（滚轮/触控）。这是“短视频刷屏”的最小闭环演示。
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
