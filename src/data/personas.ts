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

export type PersonaTemplate = {
  id: string;
  name: string;

  // ✅ 人物标签
  ageMin: number;
  ageMax: number;
  gender: Gender;
  coreHook: string;

  avatar?: string;

  // 展示信息
  lifeStage: string;
  emotion: string;
  hookRanking: string[];
  trapPaths: string[];

  /**
   * ✅ NEW 1：人物“兴趣标签”（用于匹配 video_library 的 tags）
   * - 可空：不写表示不强制兴趣
   * - reco.ts 可以把它当做：优先/加权
   */
  interests?: Interest[];

  /**
   * ✅ NEW 2：讲座“典型5条结构”的偏好视频id（不写死feed）
   * - reco.ts 可以对这些id加分，让它们更容易被抽到
   */
  preferredVideoIds?: string[];

  /**
   * ✅ NEW 3：排除项（可选）
   * - 比如你不希望青少年刷到擦边、或某些persona不出猎奇
   */
  excludeHookSubCategories?: string[]; // e.g. ['性吸引力/擦边']

  /**
   * ✅ 视频筛选策略（关键）
   */
  videoPolicy?: {
    count: number; // 默认 5
    allowedHookCategories?: Array<'欲望钩' | '焦虑钩' | '情感钩' | '解压钩' | '刺激钩'>;

    // ✅ preferInterests 你已经有了，保留
    preferInterests?: Interest[];

    /**
     * ✅ NEW 4：是否允许“兜底视频”
     * - 你说“视频可能同时出现在不同年龄/性别”
     * - 那就需要一个 "不限人群" 的通用池
     */
    allowGeneric?: boolean; // 默认 true
  };
};


/**
 * ✅ 总人物库：
 * - 20–25 仍从外部细分导入（你继续扩）
 * - 其他年龄段只做“范围覆盖”，不再出现“严格18岁”
 *   （但要保证范围包含18）
 */
export const PERSONAS: PersonaTemplate[] = [
  ...PERSONAS_20_25,

  // ✅ 15–20 青少年/新生（覆盖到18/19/20）
  {
    id: 'p_15_20_student',
    name: '15-20学生样本（覆盖18）',
    ageMin: 15,
    ageMax: 20,
    gender: '不限',
    coreHook: '焦虑钩',
    avatar: '/avatars/teen_15_20.png',
    lifeStage: '学业压力期：考试、同伴比较、家长期望',
    emotion: '害怕被否定 + 害怕落后',
    hookRanking: ['焦虑钩-教育/考试', '情感钩-同伴关系', '解压钩-沉浸'],
    trapPaths: ['考试焦虑→刷方法→短暂缓解→继续刷→更焦虑'],
    videoPolicy: {
      count: 5,
      allowedHookCategories: ['焦虑钩', '情感钩', '解压钩', '刺激钩'],
      preferInterests: ['学习', '游戏', '追星']
    }
  },

  // ✅ 18–24 学生兜底（覆盖20）
  {
    id: 'p_18_24_student',
    name: '18-24学生兜底（覆盖20）',
    ageMin: 18,
    ageMax: 24,
    gender: '不限',
    coreHook: '解压钩',
    avatar: '/avatars/student_18_24.png',
    lifeStage: '在校阶段，碎片时间多，夜间更活跃',
    emotion: '无聊 + 轻焦虑 + 即时满足偏好',
    hookRanking: ['解压钩-吃播/ASMR', '刺激钩-挑战', '情感钩-共鸣'],
    trapPaths: ['无聊→吃播/ASMR→停留→连刷→时间消失'],
    videoPolicy: {
      count: 5,
      allowedHookCategories: ['解压钩', '刺激钩', '情感钩', '焦虑钩'],
      preferInterests: ['学习', '游戏', '美妆', '追星']
    }
  },

  // ✅ 18–30 男性兜底（覆盖20）
  {
    id: 'p_18_30_male',
    name: '18-30男性兜底（覆盖20）',
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

  // ✅ 18–35 女性兜底（覆盖20）
  {
    id: 'p_18_35_female',
    name: '18-35女性兜底（覆盖20）',
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
      preferInterests: ['美妆', '旅游', '追星', '理财']
    }
  },

  // ✅ 25–35 打工人兜底
  {
    id: 'p_25_35_worker',
    name: '25-35新打工人',
    ageMin: 25,
    ageMax: 35,
    gender: '不限',
    coreHook: '焦虑钩',
    avatar: '/avatars/worker_25_35.png',
    lifeStage: '职业发展期，压力集中爆发',
    emotion: '不确定性恐惧 + 同龄对比',
    hookRanking: ['焦虑钩-经济/职业', '焦虑钩-健康', '情感钩-对比'],
    trapPaths: ['焦虑→自查→求方法→继续刷'],
    videoPolicy: { count: 5 }
  }
];
