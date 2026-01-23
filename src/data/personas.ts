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

  // ✅（新增）人物兴趣标签：作为“软偏好”
  interests?: Interest[];

  // ✅（新增）讲座“典型结构”的强偏好视频ID（必须存在于 video_library）
  preferredVideoIds?: string[];

  // ✅（新增）不想出现的子类（例如你不想出现“擦边/暴恐”等）
  excludeHookSubCategories?: string[];

  /**
   * ✅ 视频筛选策略（关键）
   * - count：每次抽几条（固定5条）
   * - allowedHookCategories：限制钩子类型（强约束）
   * - preferInterests：抽取时更偏向兴趣匹配（软偏好）
   * - allowGeneric：是否允许“无兴趣标签”的通用视频进入候选池
   */
  videoPolicy?: {
    count: number;
    allowedHookCategories?: Array<'欲望钩' | '焦虑钩' | '情感钩' | '解压钩' | '刺激钩'>;
    preferInterests?: Interest[];
    allowGeneric?: boolean;
  };
};

/**
 * ✅ 总人物库：20-25 继续细分；其它年龄段用“区间兜底”
 * ⚠️ 重点：不要再出现 “18岁严格” 这种写法；用区间覆盖即可（例如 18-22 / 18-30）
 */
export const PERSONAS: PersonaTemplate[] = [
  // ✅ 20-25 细分
  ...PERSONAS_20_25,

  // ✅ 示例：18-22 学生兜底（区间覆盖，包含18）
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
    interests: ['游戏', '学习', '追星', '美妆'],
    videoPolicy: {
      count: 5,
      allowedHookCategories: ['解压钩', '刺激钩', '情感钩', '焦虑钩'],
      preferInterests: ['学习', '游戏'],
      allowGeneric: true
    }
  },

  // 你可以继续补其它年龄段区间兜底...
];
