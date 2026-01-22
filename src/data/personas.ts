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
  hookCategory: string;
  hookSubCategory: string;
  pushLogic: string;
  image?: string;
};

export type PersonaTemplate = {
  id: string;
  name: string;
  ageMin: number;
  ageMax: number;
  gender: Gender;
  coreHook: string;
  avatar?: string;
  lifeStage: string;
  emotion: string;
  hookRanking: string[];
  trapPaths: string[];
  baseVideos: VideoItem[];
  interestOverrides?: Partial<
    Record<Interest, { replace: Array<{ index: number; video: VideoItem }> }>
  >;
};

export const PERSONAS: PersonaTemplate[] = [
  /* ===============================
   * 18–22 大学生（吃播 / 情绪 / 解压）
   * =============================== */
  {
    id: 'student_18_22_all',
    name: '大学生样本',
    ageMin: 18,
    ageMax: 22,
    gender: '不限',
    coreHook: '解压钩',
    lifeStage: '在校阶段，时间碎片化，情绪波动大',
    emotion: '无聊 + 轻度焦虑 + 即时满足偏好',
    hookRanking: ['解压钩-沉浸体验', '刺激钩-感官刺激', '情感钩-群体共鸣'],
    trapPaths: ['无聊→吃播/ASMR→停留→连续刷→时间感消失'],
    baseVideos: [
      {
        id: 'student-eat',
        title: '🍜 深夜食堂：这口下去太爽了',
        caption: '“宿舍已经饿疯了…”',
        hookCategory: '解压钩',
        hookSubCategory: 'ASMR/吃播',
        pushLogic: '大学生夜间活跃，吃播能迅速提升停留与完播。',
        image: '/videos/student_eat.png'
      },
      {
        id: 'student-asmr',
        title: '🎧 戴上耳机，这声音太治愈',
        caption: '“大脑被按摩了。”',
        hookCategory: '解压钩',
        hookSubCategory: '沉浸体验',
        pushLogic: 'ASMR 能在低认知负荷下延长使用时长。',
        image: '/videos/student_asmr.png'
      },
      {
        id: 'student-campus',
        title: '🏫 别人的大学 VS 我的大学',
        caption: '“说多了都是泪。”',
        hookCategory: '情感钩',
        hookSubCategory: '经典共鸣',
        pushLogic: '群体对比容易引发评论互动。',
        image: '/videos/student_campus.png'
      },
      {
        id: 'student-game',
        title: '🎮 这操作你能做到吗？',
        caption: '“手残党慎入。”',
        hookCategory: '刺激钩',
        hookSubCategory: '感官刺激',
        pushLogic: '挑战类内容适合学生群体的即时兴奋需求。',
        image: '/videos/student_game.png'
      },
      {
        id: 'student-future',
        title: '😶 大学毕业后真的会更好吗？',
        caption: '“突然开始焦虑。”',
        hookCategory: '焦虑钩',
        hookSubCategory: '未来不确定',
        pushLogic: '在解压流中插入轻焦虑，形成情绪对比。',
        image: '/videos/student_future.png'
      }
    ]
  },

  /* ===============================
   * 22–35 城市新打工人（焦虑）
   * =============================== */
  {
    id: 'anx_22_35_all',
    name: '城市焦虑样本',
    ageMin: 22,
    ageMax: 35,
    gender: '不限',
    coreHook: '焦虑钩',
    lifeStage: '毕业/入职/跳槽期，面临收入不确定',
    emotion: '落后恐惧 + 未来失控',
    hookRanking: ['焦虑钩-经济', '焦虑钩-健康', '解压钩'],
    trapPaths: ['焦虑→自查→寻找方案→继续刷'],
    baseVideos: [
      {
        id: 'job',
        title: '😰 今年找工作有多难？',
        caption: '“投简历投麻了。”',
        hookCategory: '焦虑钩',
        hookSubCategory: '经济/职业',
        pushLogic: '该年龄段对就业极度敏感。',
      },
      {
        id: 'rent',
        title: '🏠 房租又涨了',
        caption: '“工资追不上房租。”',
        hookCategory: '焦虑钩',
        hookSubCategory: '生存压力',
        pushLogic: '生活成本焦虑提升互动。',
      },
      {
        id: 'health',
        title: '⚠️ 这些症状别忽视',
        caption: '“你中招了吗？”',
        hookCategory: '焦虑钩',
        hookSubCategory: '健康恐惧',
        pushLogic: '健康不确定性制造恐慌。',
      },
      {
        id: 'asmr',
        title: '🫧 ASMR 放松一下',
        caption: '“先别想那么多。”',
        hookCategory: '解压钩',
        hookSubCategory: '沉浸体验',
        pushLogic: '焦虑后的情绪缓冲。',
      },
      {
        id: 'compare',
        title: '🥲 同龄人都混得比你好',
        caption: '“只有我在原地。”',
        hookCategory: '情感钩',
        hookSubCategory: '自我对比',
        pushLogic: '对比叙事强化停留。',
      }
    ]
  },

  /* ===============================
   * 50–65 男性（健康 / 家庭 / 传统）
   * =============================== */
  {
    id: 'health_50_65_male',
    name: '55岁男性样本',
    ageMin: 50,
    ageMax: 65,
    gender: '男',
    coreHook: '焦虑钩',
    lifeStage: '中老年阶段：健康风险 + 代际议题',
    emotion: '对疾病与家庭评价的焦虑',
    hookRanking: ['焦虑钩-健康', '焦虑钩-家庭', '情感钩'],
    trapPaths: ['疾病信号→自我代入→反复刷→焦虑放大'],
    baseVideos: [
      {
        id: 'old-health',
        title: '⚠️ 这种症状可能是大病前兆',
        caption: '“很多人忽视了…”',
        hookCategory: '焦虑钩',
        hookSubCategory: '健康恐惧',
        pushLogic: '50+人群对重大疾病高度敏感。',
      },
      {
        id: 'old-check',
        title: '🧬 体检报告这项要注意',
        caption: '“医生不会明说的事。”',
        hookCategory: '焦虑钩',
        hookSubCategory: '健康恐惧',
        pushLogic: '体检解读内容提升收藏。',
      },
      {
        id: 'family',
        title: '🏠 子女不结婚是不孝吗？',
        caption: '“老一辈和年轻人吵翻了。”',
        hookCategory: '焦虑钩',
        hookSubCategory: '教育/家庭',
        pushLogic: '代际冲突激发评论。',
      },
      {
        id: 'nation',
        title: '🇨🇳 这段历史看得人热血',
        caption: '“情绪被托住了。”',
        hookCategory: '情感钩',
        hookSubCategory: '爱国情绪',
        pushLogic: '宏大叙事提供情绪补偿。',
      },
      {
        id: 'case',
        title: '🕵️ 真实案件细节曝光',
        caption: '“越看越停不下。”',
        hookCategory: '解压钩',
        hookSubCategory: '猎奇案件',
        pushLogic: '猎奇转移注意力。',
      }
    ],
    interestOverrides: {
      运动: {
        replace: [
          {
            index: 3,
            video: {
              id: 'taichi',
              title: '☯️ 太极：55岁也不晚',
              caption: '“慢下来，身体会感谢你。”',
              hookCategory: '解压钩',
              hookSubCategory: '运动/养生',
              pushLogic: '运动兴趣用于包装健康焦虑。',
            }
          }
        ]
      }
    }
  }
];
