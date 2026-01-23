// src/data/personas.ts
import { PERSONAS_20_25 } from './personas_20_25';

export type Gender = '男' | '女' | '不限';

export type Interest =
  | '运动'
  | '追星'
  | '宠物'
  | '旅游'
  | '理财'
  | '游戏'
  | '学习'
  | '美妆';

export type HookCategory = '欲望钩' | '焦虑钩' | '情感钩' | '解压钩' | '刺激钩';

export type PersonaTemplate = {
  id: string;
  name: string;

  // ✅ 人物标签
  ageMin: number;
  ageMax: number;
  gender: Gender;
  coreHook: HookCategory;

  avatar?: string;

  // 展示信息
  lifeStage: string;
  emotion: string;
  hookRanking: string[];
  trapPaths: string[];

  /**
   * ✅ 视频筛选策略（关键）
   * - count：每次抽几条（固定 5）
   * - allowedHookCategories：可选，限制钩子类型（更可控）
   * - preferInterests：可选，抽取时更偏向兴趣匹配（但不强制）
   */
  videoPolicy?: {
    count: number; // 默认 5
    allowedHookCategories?: HookCategory[];
    preferInterests?: Interest[];
  };
};

/**
 * ✅ PERSONAS（全年龄段覆盖）
 * - 20–25 用 PERSONAS_20_25 细分（每岁多张卡）
 * - 其它年龄段用“现实向兜底段”覆盖（每段一个兜底）
 *
 * 注意：你现在不再在 persona 里塞 baseVideos / interestOverrides
 * 统一从 video_library.ts 里按 tags 抽取。
 */
export const PERSONAS: PersonaTemplate[] = [
  // =========================================================
  // ✅ 20–25 细分库：从外部导入
  // =========================================================
  ...PERSONAS_20_25,

  // =========================================================
  // 15–17：高中阶段（不限男女兜底）
  // =========================================================
  {
    id: 'teen_15_17_all',
    name: '15-17青少年样本',
    ageMin: 15,
    ageMax: 17,
    gender: '不限',
    coreHook: '焦虑钩',
    avatar: '/avatars/teen_15_17.png',
    lifeStage: '学业压力期：成绩、同伴比较、家长期望',
    emotion: '害怕被否定 + 害怕落后',
    hookRanking: ['焦虑钩-教育/考试', '情感钩-同伴关系', '解压钩-沉浸'],
    trapPaths: ['考试焦虑→刷方法→短暂缓解→继续刷→更焦虑'],
    videoPolicy: {
      count: 5,
      allowedHookCategories: ['焦虑钩', '情感钩', '解压钩', '刺激钩'],
      preferInterests: ['学习', '追星', '游戏']
    }
  },

  // =========================================================
  // 18–22 学生兜底（涵盖 18，且不是“严格18”）
  // =========================================================
  {
    id: 'student_18_22_all',
    name: '18-22学生兜底样本',
    ageMin: 18,
    ageMax: 22,
    gender: '不限',
    coreHook: '解压钩',
    avatar: '/avatars/student_18_22.png',
    lifeStage: '在校阶段，碎片时间多，夜间更活跃',
    emotion: '无聊 + 轻焦虑 + 即时满足偏好',
    hookRanking: ['解压钩-吃播/ASMR', '刺激钩-挑战', '情感钩-共鸣'],
    trapPaths: ['无聊→吃播/ASMR→停留→连刷→时间消失'],
    videoPolicy: {
      count: 5,
      allowedHookCategories: ['解压钩', '刺激钩', '情感钩', '焦虑钩'],
      preferInterests: ['游戏', '追星', '学习']
    }
  },

  // =========================================================
  // 18–30 男性兜底
  // =========================================================
  {
    id: 'male_18_30',
    name: '18-30男性兜底样本',
    ageMin: 18,
    ageMax: 30,
    gender: '男',
    coreHook: '刺激钩',
    avatar: '/avatars/m_18_30.png',
    lifeStage: '线上娱乐高频期，刺激偏好更强',
    emotion: '即时满足 + 竞争心',
    hookRanking: ['刺激钩-挑战', '欲望钩-擦边', '解压钩-猎奇'],
    trapPaths: ['刺激→停留→升级刺激→更难抽离'],
    videoPolicy: {
      count: 5,
      allowedHookCategories: ['刺激钩', '欲望钩', '解压钩', '焦虑钩'],
      preferInterests: ['游戏', '理财', '运动']
    }
  },

  // =========================================================
  // 18–35 女性兜底
  // =========================================================
  {
    id: 'female_18_35',
    name: '18-35女性兜底样本',
    ageMin: 18,
    ageMax: 35,
    gender: '女',
    coreHook: '欲望钩',
    avatar: '/avatars/f_18_35.png',
    lifeStage: '形象与关系高关注期，社交比较强',
    emotion: '被评价焦虑 + 渴望被认可',
    hookRanking: ['欲望钩-外貌提升', '情感钩-婚恋关系', '焦虑钩-身材/健康'],
    trapPaths: ['对比→改善→继续看→更焦虑'],
    videoPolicy: {
      count: 5,
      allowedHookCategories: ['欲望钩', '情感钩', '焦虑钩', '解压钩'],
      preferInterests: ['美妆', '旅游', '追星']
    }
  },

  // =========================================================
  // 25–35 新打工人（不限男女兜底）
  // =========================================================
  {
    id: 'worker_25_35_all',
    name: '25-35新打工人样本',
    ageMin: 25,
    ageMax: 35,
    gender: '不限',
    coreHook: '焦虑钩',
    avatar: '/avatars/worker_25_35.png',
    lifeStage: '职业发展期，压力集中爆发',
    emotion: '不确定性恐惧 + 同龄对比',
    hookRanking: ['焦虑钩-经济/职业', '焦虑钩-健康', '情感钩-对比'],
    trapPaths: ['焦虑→自查→求方法→继续刷'],
    videoPolicy: {
      count: 5,
      allowedHookCategories: ['焦虑钩', '情感钩', '解压钩'],
      preferInterests: ['理财', '运动']
    }
  },

  // =========================================================
  // 28–40 女性（婚恋/育儿/家庭冲突兜底）
  // =========================================================
  {
    id: 'female_28_40',
    name: '28-40女性样本',
    ageMin: 28,
    ageMax: 40,
    gender: '女',
    coreHook: '焦虑钩',
    avatar: '/avatars/f_28_40.png',
    lifeStage: '婚恋/育儿/事业三线并行',
    emotion: '被评价焦虑 + 家庭责任压力',
    hookRanking: ['焦虑钩-教育/家庭', '情感钩-婚恋关系', '焦虑钩-健康'],
    trapPaths: ['鸡娃→对比→焦虑→继续刷求方法'],
    videoPolicy: {
      count: 5,
      allowedHookCategories: ['焦虑钩', '情感钩', '解压钩'],
      preferInterests: ['学习', '旅游']
    }
  },

  // =========================================================
  // 35–50 男性（房贷/中年危机兜底）
  // =========================================================
  {
    id: 'male_35_50',
    name: '35-50男性样本',
    ageMin: 35,
    ageMax: 50,
    gender: '男',
    coreHook: '焦虑钩',
    avatar: '/avatars/m_35_50.png',
    lifeStage: '家庭与职业双压期',
    emotion: '失去控制感 + 责任焦虑',
    hookRanking: ['焦虑钩-经济/职业', '焦虑钩-教育/家庭', '解压钩-猎奇'],
    trapPaths: ['危机内容→自我代入→寻找出口→继续刷'],
    videoPolicy: {
      count: 5,
      allowedHookCategories: ['焦虑钩', '解压钩', '欲望钩', '情感钩'],
      preferInterests: ['理财', '运动']
    }
  },

  // =========================================================
  // 50–70 女性（养生+家庭兜底）
  // =========================================================
  {
    id: 'female_50_70',
    name: '50-70女性样本',
    ageMin: 50,
    ageMax: 70,
    gender: '女',
    coreHook: '焦虑钩',
    avatar: '/avatars/f_60.png',
    lifeStage: '更关注健康与家庭关系',
    emotion: '健康不确定 + 家庭牵挂',
    hookRanking: ['焦虑钩-健康', '焦虑钩-家庭', '情感钩-怀旧'],
    trapPaths: ['养生→恐慌→自查→继续刷'],
    videoPolicy: {
      count: 5,
      allowedHookCategories: ['焦虑钩', '情感钩', '解压钩'],
      preferInterests: ['旅游']
    }
  },

  // =========================================================
  // 60–75 银发（不限男女兜底）
  // =========================================================
  {
    id: 'silver_60_75_all',
    name: '银发兜底样本',
    ageMin: 60,
    ageMax: 75,
    gender: '不限',
    coreHook: '情感钩',
    avatar: '/avatars/silver_60_75.png',
    lifeStage: '更关注身体、情感回忆与社会秩序',
    emotion: '对衰老与失去的敏感',
    hookRanking: ['情感钩-怀旧', '焦虑钩-健康', '情感钩-正能量'],
    trapPaths: ['怀旧→情绪波动→继续刷→更沉浸'],
    videoPolicy: {
      count: 5,
      allowedHookCategories: ['情感钩', '焦虑钩', '解压钩'],
      preferInterests: ['旅游']
    }
  }
];
