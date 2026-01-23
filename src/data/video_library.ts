// src/data/video_library.ts
import type { Gender, Interest } from './personas';

export type HookCategory = '欲望钩' | '焦虑钩' | '情感钩' | '解压钩' | '刺激钩';

export type VideoItem = {
  id: string;
  title: string;
  caption: string;
  hookCategory: HookCategory;
  hookSubCategory: string;
  pushLogic: string;
  image?: string;

  // ✅ 关键：标签
  tags: {
    ageMin: number;          // 视频适配最低年龄
    ageMax: number;          // 视频适配最高年龄
    genders: Gender[];       // ['男'] / ['女'] / ['不限'] / ['男','女']
    interests?: Interest[];  // 可选：适配兴趣
  };

  // ✅ 可选：属于哪个子库（方便你讲座展示“20-25细分库”）
  source?: 'global' | '20_25';
};

// 小工具：写视频更快
const V = (x: VideoItem) => x;

/**
 * ✅ 全局视频库（覆盖 18–75+）
 * 只要 tags.ageMin/ageMax 覆盖到某年龄段，就可以被抽到
 */
export const VIDEO_LIBRARY_GLOBAL: VideoItem[] = [
  V({
    id: 'teen-exam',
    title: '📚 这题90%的人都做错了',
    caption: '“别再靠死记硬背。”',
    hookCategory: '焦虑钩',
    hookSubCategory: '教育/考试',
    pushLogic: '对“考试对错”高度敏感，错题/方法论内容收藏与复刷强。',
    image: '/videos/teen_exam.png',
    tags: { ageMin: 15, ageMax: 20, genders: ['不限'], interests: ['学习'] },
    source: 'global'
  }),

  V({
    id: 'stu-eat',
    title: '🍜 深夜吃播：这一口太爽了',
    caption: '“宿舍已经饿疯了…”',
    hookCategory: '解压钩',
    hookSubCategory: 'ASMR/吃播',
    pushLogic: '夜间低认知负荷、强满足，提升完播与连刷。',
    image: '/videos/stu_eat.png',
    tags: { ageMin: 18, ageMax: 24, genders: ['不限'] },
    source: 'global'
  }),

  V({
    id: 'm-game',
    title: '🎮 这波反杀太离谱了',
    caption: '“你敢信？”',
    hookCategory: '刺激钩',
    hookSubCategory: '游戏高能',
    pushLogic: '高能剪辑+反转，完播率高，容易连刷。',
    image: '/videos/m_game.png',
    tags: { ageMin: 18, ageMax: 30, genders: ['男'], interests: ['游戏'] },
    source: 'global'
  }),

  V({
    id: 'f-makeup',
    title: '💄 显贵妆：10分钟变高级',
    caption: '“这步别省，会直接土。”',
    hookCategory: '欲望钩',
    hookSubCategory: '外貌提升',
    pushLogic: '教程类利于收藏与复刷。',
    image: '/videos/f_makeup.png',
    tags: { ageMin: 18, ageMax: 35, genders: ['女'], interests: ['美妆'] },
    source: 'global'
  }),

  V({
    id: 'm30-commute',
    title: '🚇 早高峰把人磨没了',
    caption: '“我已经没有情绪了。”',
    hookCategory: '焦虑钩',
    hookSubCategory: '城市生存',
    pushLogic: '通勤消耗强共鸣，停留与评论高。',
    image: '/videos/m30_commute.png',
    tags: { ageMin: 25, ageMax: 35, genders: ['男'] },
    source: 'global'
  }),

  // ✅ 你可以继续把原来的 baseVideos 全部搬进来，只要补 tags 即可
];

/**
 * ✅ 20–25 专属视频库（你讲座重点）
 * 注意：这不是“人物库”，只是视频库的一个子集
 */
export const VIDEO_LIBRARY_20_25: VideoItem[] = [
  V({
    id: '20m_game_1',
    title: '🎮 新手上分：这波意识你学会了吗',
    caption: '“我悟了。”',
    hookCategory: '刺激钩',
    hookSubCategory: '游戏高能',
    pushLogic: '游戏高光与教学剪辑完播高，强适配男大学生。',
    image: '/videos/20/20m_game_1.png',
    tags: { ageMin: 20, ageMax: 20, genders: ['男'], interests: ['游戏'] },
    source: '20_25'
  }),

  V({
    id: '20f_social_2',
    title: '💬 3句开场白，让你不尬聊',
    caption: '“照着说就行。”',
    hookCategory: '解压钩',
    hookSubCategory: '方法论/技巧',
    pushLogic: '可执行技巧让人收藏复刷；越焦虑越爱找模板。',
    image: '/videos/20/20f_social_2.png',
    tags: { ageMin: 20, ageMax: 20, genders: ['女'], interests: ['学习'] },
    source: '20_25'
  }),

  V({
    id: '21f_body_4',
    title: '💄 伪素颜：看起来像天生好看',
    caption: '“上课也能用。”',
    hookCategory: '欲望钩',
    hookSubCategory: '美妆种草',
    pushLogic: '伪素颜贴校园场景，复刷收藏高。',
    image: '/videos/21/21f_body_4.png',
    tags: { ageMin: 21, ageMax: 21, genders: ['女'], interests: ['美妆'] },
    source: '20_25'
  }),

  // ✅ 继续把 personas_20_25.ts 里的 vid(...) 全部搬进来即可
];

/** 合并总视频库（抽取时用这个） */
export const VIDEO_LIBRARY_ALL: VideoItem[] = [
  ...VIDEO_LIBRARY_20_25,
  ...VIDEO_LIBRARY_GLOBAL
];
