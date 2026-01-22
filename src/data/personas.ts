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

export type VideoItem = {
  id: string;
  title: string;
  caption: string;
  hookCategory: string;     // 大类：欲望/焦虑/情感/解压/刺激
  hookSubCategory: string;  // 子类：就业/房贷/擦边等
  pushLogic: string;
  image?: string;           // 可选：/videos/xxx.png
};

export type PersonaTemplate = {
  id: string;
  name: string;
  ageMin: number;
  ageMax: number;
  gender: Gender;           // '不限' 表示不限男女
  coreHook: string;         // 主要钩子
  avatar?: string;          // 可选：/avatars/xxx.png
  lifeStage: string;
  emotion: string;
  hookRanking: string[];
  trapPaths: string[];

  // 固定的 5 条基础视频（你说的“固定不变”）
  baseVideos: VideoItem[];

  // 兴趣覆盖：最多替换 1-2 条（按 index 替换 baseVideos 的某一条）
  interestOverrides?: Partial<Record<Interest, { replace: Array<{ index: number; video: VideoItem }> }>>;
};

// =========================
// 你的人物库从这里开始写
// 先给你 2 个模板示例，你可以继续照抄加更多
// =========================
export const PERSONAS: PersonaTemplate[] = [
  {
    id: 'anx_22_35_all',
    name: '城市焦虑样本',
    ageMin: 22,
    ageMax: 35,
    gender: '不限',
    coreHook: '焦虑钩',
    avatar: '/avatars/anx_22_35.png',
    lifeStage: '毕业/入职/跳槽期，面临收入不确定与城市生存压力',
    emotion: '对“落后同龄人”的恐惧 + 对未来失控感',
    hookRanking: ['焦虑钩-经济/职业', '焦虑钩-健康恐惧', '解压钩-沉浸体验'],
    trapPaths: ['焦虑内容→自我对比→寻求“解决方案”→继续刷→加剧焦虑'],
    baseVideos: [
      {
        id: 'anx-job',
        title: '😰 今年找工作到底有多难？',
        caption: '“投了200份简历，我开始怀疑人生…”',
        hookCategory: '焦虑钩',
        hookSubCategory: '经济/职业',
        pushLogic: '22-35普遍面临求职/跳槽/裁员压力，算法用“群体共鸣”提高停留与评论。',
        image: '/videos/anx_job.png'
      },
      {
        id: 'anx-rent',
        title: '🏠 房租又涨了，我该回老家吗？',
        caption: '“每个月一半工资交给房东…”',
        hookCategory: '焦虑钩',
        hookSubCategory: '经济/职业',
        pushLogic: '城市新打工人对住房开支敏感，房租/房贷类内容能触发强情绪与转发。',
        image: '/videos/anx_rent.png'
      },
      {
        id: 'anx-health',
        title: '⚠️ 这些信号说明你已经“亚健康”了',
        caption: '“熬夜=慢性自毁？”',
        hookCategory: '焦虑钩',
        hookSubCategory: '健康恐惧',
        pushLogic: '用“疾病信号”制造不确定性，刺激收藏/关注以获取“自救方法”。',
        image: '/videos/anx_health.png'
      },
      {
        id: 'relief-asmr',
        title: '🫧 3分钟ASMR：让大脑安静下来',
        caption: '“把烦恼按下暂停键。”',
        hookCategory: '解压钩',
        hookSubCategory: '沉浸体验',
        pushLogic: '焦虑后给一点“缓释”，形成情绪闭环，延长使用时长。',
        image: '/videos/relief_asmr.png'
      },
      {
        id: 'emo-compare',
        title: '🥲 同龄人都年薪30万了，我还在…',
        caption: '“你也在偷偷对比吗？”',
        hookCategory: '情感钩',
        hookSubCategory: '经典怀旧/自我叙事',
        pushLogic: '对比叙事极易引发评论区自曝与争论，提升互动。',
        image: '/videos/emo_compare.png'
      }
    ],
    interestOverrides: {
      运动: {
        replace: [
          {
            index: 3,
            video: {
              id: 'sport-relief',
              title: '🏃‍♀️ 跑步真的能缓解焦虑吗？',
              caption: '“今天先把心跳找回来。”',
              hookCategory: '解压钩',
              hookSubCategory: '沉浸体验',
              pushLogic: '兴趣标签“运动”会被用来包装解压内容，让你觉得“这对我有用”。',
              image: '/videos/interest_sport.png'
            }
          }
        ]
      },
      宠物: {
        replace: [
          {
            index: 3,
            video: {
              id: 'pet-relief',
              title: '🐶 下班回家，它真的在等你',
              caption: '“被治愈的那一秒，什么都值了。”',
              hookCategory: '解压钩',
              hookSubCategory: '沉浸体验',
              pushLogic: '宠物兴趣会把解压内容换成“治愈系”，但仍是同一套情绪闭环。',
              image: '/videos/interest_pet.png'
            }
          }
        ]
      }
    }
  },

  {
    id: 'desire_18_35_male',
    name: '欲望钩样本（男性向）',
    ageMin: 18,
    ageMax: 35,
    gender: '男',
    coreHook: '欲望钩',
    avatar: '/avatars/desire_m_18_35.png',
    lifeStage: '高频线上娱乐消费期，情绪刺激偏好强',
    emotion: '即时满足偏好 + 对“稀缺机会”的幻想',
    hookRanking: ['欲望钩-性吸引力', '刺激钩-官能刺激', '解压钩-猎奇'],
    trapPaths: ['刺激开场→停留→连续推荐→更强刺激→难以抽离'],
    baseVideos: [
      {
        id: 'desire-edge',
        title: '🔥 这也太会了吧…',
        caption: '“别眨眼，后面更离谱。”',
        hookCategory: '欲望钩',
        hookSubCategory: '性吸引力/擦边',
        pushLogic: '18+男性对擦边/暗示内容停留更长，算法优先放大高完播内容。',
        image: '/videos/desire_edge.png'
      },
      {
        id: 'desire-tv',
        title: '🎬 影视名场面：这段谁顶得住？',
        caption: '“氛围感直接拉满。”',
        hookCategory: '欲望钩',
        hookSubCategory: '影视撩拨',
        pushLogic: '影视片段天然强节奏，容易形成连续刷屏。',
        image: '/videos/desire_tv.png'
      },
      {
        id: 'stim-sense',
        title: '⚡ 这声效+画面…太刺激了',
        caption: '“听觉/视觉双重暴击。”',
        hookCategory: '刺激钩',
        hookSubCategory: '官能刺激',
        pushLogic: '官能刺激内容提升即时兴奋度，促使连刷。',
        image: '/videos/stim_sense.png'
      },
      {
        id: 'relief-curious',
        title: '🕵️‍♂️ 你绝对想不到真相是…',
        caption: '“评论区吵翻了。”',
        hookCategory: '解压钩',
        hookSubCategory: '奇观猎奇',
        pushLogic: '猎奇+反转可显著提升完播率与评论互动。',
        image: '/videos/relief_curious.png'
      },
      {
        id: 'anx-myth',
        title: '💸 90天从0到1？别被骗了…',
        caption: '“越缺钱越容易信。”',
        hookCategory: '欲望钩',
        hookSubCategory: '暴富逆袭/致富神话',
        pushLogic: '用“逆袭叙事”制造希望与焦虑交织，让人持续寻找答案。',
        image: '/videos/desire_money.png'
      }
    ]
  }
];
