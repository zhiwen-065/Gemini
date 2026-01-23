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
   * ✅ 视频筛选策略（关键）
   * - count：每次抽几条（你说固定5条）
   * - allowedHooks：可选，限制钩子类型（更可控）
   * - preferInterests：可选，抽取时更偏向兴趣匹配（但不强制）
   */
  videoPolicy?: {
    count: number; // 默认 5
    allowedHookCategories?: Array<'欲望钩' | '焦虑钩' | '情感钩' | '解压钩' | '刺激钩'>;
    preferInterests?: Interest[];
  };
};
