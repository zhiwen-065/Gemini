import { PERSONAS_20_25 } from './personas_20_25';

export const PERSONAS: PersonaTemplate[] = [
  ...PERSONAS_20_25,
  // ...你原来的其它年龄段 personas
];

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
  hookCategory: string; // 欲望钩/焦虑钩/情感钩/解压钩/刺激钩
  hookSubCategory: string; // 子类：吃播/健康恐惧/婚恋/房贷/擦边等
  pushLogic: string; // 点“为什么推送给我？”展示
  image?: string; // 可选：/videos/xxx.png（你之后自己放图）
};

export type PersonaTemplate = {
  id: string;
  name: string;
  ageMin: number;
  ageMax: number;
  gender: Gender; // '不限' 表示不限男女
  coreHook: string;
  avatar?: string;
  lifeStage: string;
  emotion: string;
  hookRanking: string[];
  trapPaths: string[];

  // 固定的 5 条基础视频（人物主线）
  baseVideos: VideoItem[];

  // 兴趣覆盖：最多替换 1-2 条
  interestOverrides?: Partial<
    Record<Interest, { replace: Array<{ index: number; video: VideoItem }> }>
  >;
};

const V = (x: VideoItem) => x; // 小工具：让你写起来更整齐

export const PERSONAS: PersonaTemplate[] = [
  /* =========================================================
   * 18–22 大学生（不限男女）：吃播 / ASMR / 校园梗 / 轻焦虑
   * ========================================================= */
  {
    id: 'student_18_22_all',
    name: '大学生样本',
    ageMin: 18,
    ageMax: 22,
    gender: '不限',
    coreHook: '解压钩',
    avatar: '/avatars/student_18_22.png',
    lifeStage: '在校阶段，碎片时间多，夜间更活跃',
    emotion: '无聊 + 轻焦虑 + 即时满足偏好',
    hookRanking: ['解压钩-吃播/ASMR', '刺激钩-挑战', '情感钩-共鸣'],
    trapPaths: ['无聊→吃播/ASMR→停留→连刷→时间消失'],
    baseVideos: [
      V({
        id: 'stu-eat',
        title: '🍜 深夜吃播：这一口太爽了',
        caption: '“宿舍已经饿疯了…”',
        hookCategory: '解压钩',
        hookSubCategory: 'ASMR/吃播',
        pushLogic: '大学生夜间活跃，吃播低认知负荷、强满足，提升完播与连刷。',
        image: '/videos/stu_eat.png'
      }),
      V({
        id: 'stu-asmr',
        title: '🎧 戴上耳机：这声音太治愈',
        caption: '“大脑像被按摩。”',
        hookCategory: '解压钩',
        hookSubCategory: '沉浸体验',
        pushLogic: 'ASMR 容易形成“沉浸—放空—继续刷”的节奏回路。',
        image: '/videos/stu_asmr.png'
      }),
      V({
        id: 'stu-campus',
        title: '🏫 别人的大学 VS 我的大学',
        caption: '“说多了都是泪。”',
        hookCategory: '情感钩',
        hookSubCategory: '经典共鸣',
        pushLogic: '群体共鸣内容促进评论区自嘲与互动，停留更长。',
        image: '/videos/stu_campus.png'
      }),
      V({
        id: 'stu-challenge',
        title: '🎯 30秒挑战：你能坚持到第几关？',
        caption: '“停不下来…”',
        hookCategory: '刺激钩',
        hookSubCategory: '挑战/冒险',
        pushLogic: '挑战类内容用“下一条更刺激”驱动连刷。',
        image: '/videos/stu_challenge.png'
      }),
      V({
        id: 'stu-future',
        title: '😶 大学毕业后真的会更好吗？',
        caption: '“突然开始焦虑。”',
        hookCategory: '焦虑钩',
        hookSubCategory: '就业/未来',
        pushLogic: '在解压流中插入轻焦虑，制造“情绪落差”，提升停留与转发。',
        image: '/videos/stu_future.png'
      })
    ],
    interestOverrides: {
      学习: {
        replace: [
          {
            index: 3,
            video: V({
              id: 'stu-study',
              title: '📚 期末速成：3天背完一学期',
              caption: '“不学会后悔。”',
              hookCategory: '焦虑钩',
              hookSubCategory: '教育/考试',
              pushLogic: '学习兴趣会把部分内容替换成“速成焦虑”，让你觉得‘这对我有用’。',
              image: '/videos/interest_study.png'
            })
          }
        ]
      },
      游戏: {
        replace: [
          {
            index: 3,
            video: V({
              id: 'stu-game',
              title: '🎮 这个操作你能复刻吗？',
              caption: '“手残党慎入。”',
              hookCategory: '刺激钩',
              hookSubCategory: '游戏高能',
              pushLogic: '游戏兴趣会强化高能剪辑，提升完播与点赞。',
              image: '/videos/interest_game.png'
            })
          }
        ]
      }
    }
  },

  /* =========================================================
   * 18–25 女性：美妆/恋爱/身材管理/轻焦虑（更贴现实）
   * ========================================================= */
  {
    id: 'female_18_25',
    name: '18-25女性样本',
    ageMin: 18,
    ageMax: 25,
    gender: '女',
    coreHook: '欲望钩',
    avatar: '/avatars/f_18_25.png',
    lifeStage: '形象与关系探索期，社交比较强',
    emotion: '被评价焦虑 + 渴望被认可',
    hookRanking: ['欲望钩-颜值', '情感钩-婚恋', '焦虑钩-身材/皮肤'],
    trapPaths: ['对比→改善→继续看→更焦虑'],
    baseVideos: [
      V({
        id: 'f-makeup',
        title: '💄 “显贵妆”教程：10分钟变高级',
        caption: '“这步别省，会直接土。”',
        hookCategory: '欲望钩',
        hookSubCategory: '颜值擦边/外貌提升',
        pushLogic: '18-25女性对外貌提升强敏感，教程类利于收藏与复刷。',
        image: '/videos/f_makeup.png'
      }),
      V({
        id: 'f-body',
        title: '🔥 7天瘦腰：睡前这组必做',
        caption: '“坚持就是变美。”',
        hookCategory: '焦虑钩',
        hookSubCategory: '身材焦虑',
        pushLogic: '用“短期承诺”激发希望+焦虑，推动连续观看与保存。',
        image: '/videos/f_body.png'
      }),
      V({
        id: 'f-love',
        title: '💔 他不回你消息的真实原因…',
        caption: '“别再自我PUA了。”',
        hookCategory: '情感钩',
        hookSubCategory: '婚恋关系',
        pushLogic: '关系内容能触发强代入与评论倾诉，提高互动。',
        image: '/videos/f_love.png'
      }),
      V({
        id: 'f-skin',
        title: '⚠️ 皮肤爆痘不是“上火”这么简单',
        caption: '“快自查！”',
        hookCategory: '焦虑钩',
        hookSubCategory: '健康/皮肤恐慌',
        pushLogic: '用“身体信号”制造不确定性，驱动收藏与关注。',
        image: '/videos/f_skin.png'
      }),
      V({
        id: 'f-coffee',
        title: '🧋 这杯喝了像在奖励自己',
        caption: '“情绪被哄好了。”',
        hookCategory: '解压钩',
        hookSubCategory: '沉浸/日常治愈',
        pushLogic: '治愈日常为高刺激内容“降温”，延长时长。',
        image: '/videos/f_heal.png'
      })
    ],
    interestOverrides: {
      追星: {
        replace: [
          {
            index: 4,
            video: V({
              id: 'f-idol',
              title: '✨ 爱豆直拍：这段状态封神',
              caption: '“我反复看了十遍。”',
              hookCategory: '情感钩',
              hookSubCategory: '追星沉浸',
              pushLogic: '追星兴趣会替换治愈内容为“高复刷直拍”，增强粘性。',
              image: '/videos/interest_idol.png'
            })
          }
        ]
      },
      美妆: {
        replace: [
          {
            index: 0,
            video: V({
              id: 'f-makeup-2',
              title: '💋 最适合素颜的口红色号',
              caption: '“黄皮直接显白。”',
              hookCategory: '欲望钩',
              hookSubCategory: '外貌提升',
              pushLogic: '美妆兴趣会把第一条做成“立刻能用”的种草内容，促使收藏。',
              image: '/videos/interest_makeup.png'
            })
          }
        ]
      }
    }
  },

  /* =========================================================
   * 18–30 男性：游戏/挑战/擦边/暴富神话（现实常见）
   * ========================================================= */
  {
    id: 'male_18_30',
    name: '18-30男性样本',
    ageMin: 18,
    ageMax: 30,
    gender: '男',
    coreHook: '刺激钩',
    avatar: '/avatars/m_18_30.png',
    lifeStage: '线上娱乐高频期，刺激偏好更强',
    emotion: '即时满足 + 竞争心',
    hookRanking: ['刺激钩-挑战', '欲望钩-擦边', '解压钩-猎奇'],
    trapPaths: ['刺激→停留→升级刺激→更难抽离'],
    baseVideos: [
      V({
        id: 'm-game',
        title: '🎮 这波反杀太离谱了',
        caption: '“你敢信？”',
        hookCategory: '刺激钩',
        hookSubCategory: '游戏高能',
        pushLogic: '高能剪辑+反转，完播率高，容易连刷。',
        image: '/videos/m_game.png'
      }),
      V({
        id: 'm-edge',
        title: '🔥 这也太会了吧…',
        caption: '“别眨眼。”',
        hookCategory: '欲望钩',
        hookSubCategory: '性吸引力/擦边',
        pushLogic: '18+男性对擦边停留更长，算法优先放大完播高的视频。',
        image: '/videos/m_edge.png'
      }),
      V({
        id: 'm-curious',
        title: '🕵️ 你绝对想不到真相是…',
        caption: '“评论区吵翻了。”',
        hookCategory: '解压钩',
        hookSubCategory: '奇闻异事',
        pushLogic: '猎奇+反转驱动停留与评论。',
        image: '/videos/m_curious.png'
      }),
      V({
        id: 'm-myth',
        title: '💸 30天从0到1？别被骗了…',
        caption: '“越缺钱越容易信。”',
        hookCategory: '欲望钩',
        hookSubCategory: '致富神话',
        pushLogic: '用“逆袭叙事”制造希望与焦虑交织，促使持续刷。',
        image: '/videos/m_myth.png'
      }),
      V({
        id: 'm-challenge',
        title: '⚡ 你敢试这个挑战吗？',
        caption: '“失败一次就上头。”',
        hookCategory: '刺激钩',
        hookSubCategory: '挑战/冒险',
        pushLogic: '挑战叙事天然“下一条更刺激”，形成连刷。',
        image: '/videos/m_challenge.png'
      })
    ],
    interestOverrides: {
      运动: {
        replace: [
          {
            index: 4,
            video: V({
              id: 'm-sport',
              title: '🏋️ 练这个动作，爆发力直接起飞',
              caption: '“你也试试。”',
              hookCategory: '刺激钩',
              hookSubCategory: '运动挑战',
              pushLogic: '运动兴趣会把挑战内容替换成运动挑战，但仍是刺激钩主线。',
              image: '/videos/interest_sport.png'
            })
          }
        ]
      },
      理财: {
        replace: [
          {
            index: 3,
            video: V({
              id: 'm-fin',
              title: '📈 这3个理财坑，别再踩了',
              caption: '“越看越焦虑。”',
              hookCategory: '焦虑钩',
              hookSubCategory: '财务焦虑',
              pushLogic: '理财兴趣会把“致富神话”换成“风险恐吓”，同样抓焦虑。',
              image: '/videos/interest_finance.png'
            })
          }
        ]
      }
    }
  },

  /* =========================================================
   * 25–35 城市新打工人：就业/裁员/房租/健康（不限男女）
   * ========================================================= */
  {
    id: 'worker_25_35_all',
    name: '新打工人样本',
    ageMin: 25,
    ageMax: 35,
    gender: '不限',
    coreHook: '焦虑钩',
    avatar: '/avatars/worker_25_35.png',
    lifeStage: '职业发展期，压力集中爆发',
    emotion: '不确定性恐惧 + 同龄对比',
    hookRanking: ['焦虑钩-经济/职业', '焦虑钩-健康', '情感钩-对比'],
    trapPaths: ['焦虑→自查→求方法→继续刷'],
    baseVideos: [
      V({
        id: 'w-layoff',
        title: '📉 裁员名单出来了…',
        caption: '“下一轮会轮到我吗？”',
        hookCategory: '焦虑钩',
        hookSubCategory: '裁员危机',
        pushLogic: '25-35对裁员最敏感，危机叙事提高停留与收藏。',
        image: '/videos/w_layoff.png'
      }),
      V({
        id: 'w-salary',
        title: '💼 工资谈判：别再被压价了',
        caption: '“原来我亏这么多。”',
        hookCategory: '焦虑钩',
        hookSubCategory: '经济/职业',
        pushLogic: '“解决方案”内容让人觉得有用，提升收藏与关注。',
        image: '/videos/w_salary.png'
      }),
      V({
        id: 'w-rent',
        title: '🏠 房租又涨，我该回老家吗？',
        caption: '“每月一半工资交房东。”',
        hookCategory: '焦虑钩',
        hookSubCategory: '生存压力',
        pushLogic: '城市生存成本议题易引发共鸣与转发。',
        image: '/videos/w_rent.png'
      }),
      V({
        id: 'w-health',
        title: '⚠️ 熬夜的代价比你想的大',
        caption: '“别等身体报警。”',
        hookCategory: '焦虑钩',
        hookSubCategory: '健康恐惧',
        pushLogic: '用“身体报警”触发不确定性与恐慌，促使自查。',
        image: '/videos/w_health.png'
      }),
      V({
        id: 'w-compare',
        title: '🥲 同龄人都年薪30万了…',
        caption: '“只有我在原地。”',
        hookCategory: '情感钩',
        hookSubCategory: '自我对比',
        pushLogic: '对比叙事让人停留、评论倾诉。',
        image: '/videos/w_compare.png'
      })
    ],
    interestOverrides: {
      宠物: {
        replace: [
          {
            index: 4,
            video: V({
              id: 'w-pet',
              title: '🐱 下班回家，它真的在等你',
              caption: '“那一秒我不想再卷了。”',
              hookCategory: '解压钩',
              hookSubCategory: '治愈/宠物',
              pushLogic: '宠物兴趣把最后一条变成治愈内容，给焦虑一个“缓释出口”。',
              image: '/videos/interest_pet.png'
            })
          }
        ]
      },
      旅游: {
        replace: [
          {
            index: 4,
            video: V({
              id: 'w-travel',
              title: '✈️ 逃离一周：这条路线太治愈',
              caption: '“人真的会被大自然修复。”',
              hookCategory: '解压钩',
              hookSubCategory: '旅行治愈',
              pushLogic: '旅游兴趣常用于替换情绪出口内容，但主线仍是职业焦虑。',
              image: '/videos/interest_travel.png'
            })
          }
        ]
      }
    }
  },

  /* =========================================================
   * 28–40 女性：婚恋/育儿/家庭冲突/健康（现实常见）
   * ========================================================= */
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
    baseVideos: [
      V({
        id: 'f-kid',
        title: '📚 小学这一步没抓住，后面全崩',
        caption: '“你家孩子跟上了吗？”',
        hookCategory: '焦虑钩',
        hookSubCategory: '教育/家庭',
        pushLogic: '28-40女性常被“鸡娃焦虑”击中，强收藏与转发。',
        image: '/videos/f_kid.png'
      }),
      V({
        id: 'f-marriage',
        title: '💔 婚姻里最痛的不是出轨，是…',
        caption: '“看完沉默了。”',
        hookCategory: '情感钩',
        hookSubCategory: '婚恋关系',
        pushLogic: '关系叙事引发代入、评论倾诉。',
        image: '/videos/f_marriage.png'
      }),
      V({
        id: 'f-family',
        title: '😤 婆媳/代际冲突：到底谁有理？',
        caption: '“评论区要炸了。”',
        hookCategory: '焦虑钩',
        hookSubCategory: '家庭冲突',
        pushLogic: '对立话题提升评论与停留。',
        image: '/videos/f_family.png'
      }),
      V({
        id: 'f-health',
        title: '⚠️ 女性体检这项很关键',
        caption: '“别等出事才后悔。”',
        hookCategory: '焦虑钩',
        hookSubCategory: '健康恐惧',
        pushLogic: '健康恐惧内容触发自我代入与焦虑循环。',
        image: '/videos/f_health.png'
      }),
      V({
        id: 'f-relief',
        title: '🫖 10分钟：把情绪放下',
        caption: '“先照顾自己。”',
        hookCategory: '解压钩',
        hookSubCategory: '治愈/放松',
        pushLogic: '在焦虑流中插入“治愈出口”，让你更愿意继续刷。',
        image: '/videos/f_relief.png'
      })
    ],
    interestOverrides: {
      美妆: {
        replace: [
          {
            index: 4,
            video: V({
              id: 'f-makeup2',
              title: '💄 通勤显气色：一支口红搞定',
              caption: '“忙也要看起来精神。”',
              hookCategory: '欲望钩',
              hookSubCategory: '外貌提升',
              pushLogic: '美妆兴趣常被用作“自我补偿型内容”，替换治愈出口。',
              image: '/videos/interest_makeup.png'
            })
          }
        ]
      },
      理财: {
        replace: [
          {
            index: 0,
            video: V({
              id: 'f-fin',
              title: '💰 家庭资产怎么配才安全？',
              caption: '“看完更焦虑但停不下。”',
              hookCategory: '焦虑钩',
              hookSubCategory: '家庭财务焦虑',
              pushLogic: '理财兴趣会把教育焦虑替换成资产焦虑，但抓的还是不确定性。',
              image: '/videos/interest_finance.png'
            })
          }
        ]
      }
    }
  },

  /* =========================================================
   * 35–50 男性：房贷/中年危机/裁员/家庭责任
   * ========================================================= */
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
    baseVideos: [
      V({
        id: 'm-mortgage',
        title: '🏠 房贷到期那天，我失眠了',
        caption: '“压力把人压扁。”',
        hookCategory: '焦虑钩',
        hookSubCategory: '房贷压力',
        pushLogic: '35+男性对房贷与现金流高度敏感。',
        image: '/videos/m_mortgage.png'
      }),
      V({
        id: 'm-layoff',
        title: '📉 35岁危机真的存在吗？',
        caption: '“看完更慌了。”',
        hookCategory: '焦虑钩',
        hookSubCategory: '经济/职业',
        pushLogic: '“年龄危机”话题易引发强共鸣与评论。',
        image: '/videos/m_35crisis.png'
      }),
      V({
        id: 'm-kid',
        title: '📚 孩子成绩掉了，我急疯了',
        caption: '“家长比孩子更焦虑。”',
        hookCategory: '焦虑钩',
        hookSubCategory: '教育/家庭',
        pushLogic: '家庭责任议题强化情绪投入。',
        image: '/videos/m_kid.png'
      }),
      V({
        id: 'm-health',
        title: '⚠️ 中年最怕的不是累，是这4个信号',
        caption: '“别硬扛。”',
        hookCategory: '焦虑钩',
        hookSubCategory: '健康恐惧',
        pushLogic: '健康恐惧与责任焦虑叠加，提升停留。',
        image: '/videos/m_health.png'
      }),
      V({
        id: 'm-case',
        title: '🕵️ 真实案件：细思极恐',
        caption: '“越看越上头。”',
        hookCategory: '解压钩',
        hookSubCategory: '猎奇案件',
        pushLogic: '猎奇为高压人群提供“转移注意力”的出口。',
        image: '/videos/m_case.png'
      })
    ],
    interestOverrides: {
      运动: {
        replace: [
          {
            index: 4,
            video: V({
              id: 'm-run',
              title: '🏃 中年跑步：先把心肺救回来',
              caption: '“跑完那一刻很轻。”',
              hookCategory: '解压钩',
              hookSubCategory: '运动解压',
              pushLogic: '运动兴趣会把出口内容替换成运动，但主线仍是中年焦虑。',
              image: '/videos/interest_run.png'
            })
          }
        ]
      },
      理财: {
        replace: [
          {
            index: 0,
            video: V({
              id: 'm-fin2',
              title: '📉 现金流断了怎么办？这3步保命',
              caption: '“先别慌。”',
              hookCategory: '焦虑钩',
              hookSubCategory: '财务焦虑',
              pushLogic: '理财兴趣会强化现金流恐惧与对策内容，提高收藏。',
              image: '/videos/interest_cashflow.png'
            })
          }
        ]
      }
    }
  },

  /* =========================================================
   * 50–65 男性：重大疾病/体检/家庭伦理/爱国叙事
   * ========================================================= */
  {
    id: 'health_50_65_male',
    name: '50-65男性样本',
    ageMin: 50,
    ageMax: 65,
    gender: '男',
    coreHook: '焦虑钩',
    avatar: '/avatars/health_55_m.png',
    lifeStage: '中老年阶段：健康风险 + 代际议题',
    emotion: '对疾病与家庭评价的焦虑',
    hookRanking: ['焦虑钩-健康', '焦虑钩-教育/家庭', '情感钩-宏大叙事'],
    trapPaths: ['疾病信号→自我代入→反复刷→焦虑放大'],
    baseVideos: [
      V({
        id: 'old-health',
        title: '⚠️ 这种症状可能是大病前兆',
        caption: '“很多人忽视了…”',
        hookCategory: '焦虑钩',
        hookSubCategory: '健康恐惧',
        pushLogic: '50+对“重大疾病信号”高度敏感，算法用不确定性提高停留。',
        image: '/videos/old_health.png'
      }),
      V({
        id: 'old-check',
        title: '🧬 体检报告这项要注意',
        caption: '“医生不会明说的事。”',
        hookCategory: '焦虑钩',
        hookSubCategory: '体检恐慌',
        pushLogic: '体检解读促使收藏与复刷，对照自身报告。',
        image: '/videos/old_check.png'
      }),
      V({
        id: 'old-family',
        title: '🏠 子女不结婚=不孝？评论区吵翻',
        caption: '“老一辈的执念？”',
        hookCategory: '焦虑钩',
        hookSubCategory: '教育/家庭',
        pushLogic: '代际对立促进评论爆发，停留更长。',
        image: '/videos/old_family.png'
      }),
      V({
        id: 'old-nation',
        title: '🇨🇳 这段历史看得人热血沸腾',
        caption: '“情绪被托住了。”',
        hookCategory: '情感钩',
        hookSubCategory: '爱国情绪',
        pushLogic: '宏大叙事提供情绪补偿，在焦虑间隙增强粘性。',
        image: '/videos/old_nation.png'
      }),
      V({
        id: 'old-case',
        title: '🕵️ 真实案件细节曝光',
        caption: '“越看越停不下。”',
        hookCategory: '解压钩',
        hookSubCategory: '猎奇案件',
        pushLogic: '猎奇为焦虑提供短暂逃避，形成循环。',
        image: '/videos/old_case.png'
      })
    ],
    interestOverrides: {
      运动: {
        replace: [
          {
            index: 3,
            video: V({
              id: 'old-taichi',
              title: '☯️ 太极：适合50+的低冲击运动',
              caption: '“练的是气血，也是心态。”',
              hookCategory: '解压钩',
              hookSubCategory: '运动/养生',
              pushLogic: '运动兴趣会把部分内容替换成养生运动，但健康焦虑主线仍在。',
              image: '/videos/interest_taichi.png'
            })
          }
        ]
      }
    }
  },

  /* =========================================================
   * 50–70 女性：养生/家庭/孙辈/健康（现实常见）
   * ========================================================= */
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
    hookRanking: ['焦虑钩-健康', '焦虑钩-教育/家庭', '情感钩-怀旧'],
    trapPaths: ['养生→恐慌→自查→继续刷'],
    baseVideos: [
      V({
        id: 'f60-health',
        title: '⚠️ 女人过了50，这个指标最关键',
        caption: '“别等出事才后悔。”',
        hookCategory: '焦虑钩',
        hookSubCategory: '健康恐惧',
        pushLogic: '50+女性对身体指标与疾病信号敏感，易形成自查与复刷。',
        image: '/videos/f60_health.png'
      }),
      V({
        id: 'f60-food',
        title: '🥣 这一碗养生汤，很多人做错了',
        caption: '“别乱补！”',
        hookCategory: '焦虑钩',
        hookSubCategory: '养生恐慌',
        pushLogic: '“你做错了”式内容制造不确定性，驱动停留与收藏。',
        image: '/videos/f60_food.png'
      }),
      V({
        id: 'f60-family',
        title: '👵 带孙子到底该不该收钱？',
        caption: '“评论区吵炸了。”',
        hookCategory: '焦虑钩',
        hookSubCategory: '家庭冲突',
        pushLogic: '家庭伦理争议提升评论对立与停留。',
        image: '/videos/f60_family.png'
      }),
      V({
        id: 'f60-nostalgia',
        title: '📼 那些年的老歌一响，我就想哭',
        caption: '“一秒回到年轻。”',
        hookCategory: '情感钩',
        hookSubCategory: '经典怀旧',
        pushLogic: '怀旧内容为焦虑提供情绪补偿，增强粘性。',
        image: '/videos/f60_nostalgia.png'
      }),
      V({
        id: 'f60-tv',
        title: '📺 这部老剧台词太扎心了',
        caption: '“越看越有味道。”',
        hookCategory: '情感钩',
        hookSubCategory: '经典怀旧',
        pushLogic: '熟悉内容降低认知成本，适合长时停留。',
        image: '/videos/f60_tv.png'
      })
    ],
    interestOverrides: {
      旅游: {
        replace: [
          {
            index: 4,
            video: V({
              id: 'f60-travel',
              title: '🧳 退休旅行：这条线路太舒服',
              caption: '“慢慢走，慢慢看。”',
              hookCategory: '解压钩',
              hookSubCategory: '旅行治愈',
              pushLogic: '旅游兴趣会把部分怀旧替换成旅行治愈，仍保留健康/家庭主线。',
              image: '/videos/interest_travel.png'
            })
          }
        ]
      },
      宠物: {
        replace: [
          {
            index: 4,
            video: V({
              id: 'f60-pet',
              title: '🐶 它陪你到老的那一刻…',
              caption: '“眼泪绷不住。”',
              hookCategory: '情感钩',
              hookSubCategory: '治愈/宠物',
              pushLogic: '宠物兴趣会把末尾内容替换成治愈泪点，提高停留。',
              image: '/videos/interest_pet2.png'
            })
          }
        ]
      }
    }
  },

  /* =========================================================
   * 县域 20–35（不限男女）：相亲/逆袭/便宜好物/工作焦虑
   * ========================================================= */
  {
    id: 'county_20_35_all',
    name: '县域新消费者样本',
    ageMin: 20,
    ageMax: 35,
    gender: '不限',
    coreHook: '焦虑钩',
    avatar: '/avatars/county_20_35.png',
    lifeStage: '收入压力 + 社会评价 + 相亲/婚恋议题',
    emotion: '被比较 + 逆袭渴望',
    hookRanking: ['焦虑钩-经济/职业', '欲望钩-致富神话', '情感钩-婚恋'],
    trapPaths: ['逆袭→幻想→继续刷→更焦虑'],
    baseVideos: [
      V({
        id: 'county-job',
        title: '💼 小城工作到底值不值？',
        caption: '“出去还是留下？”',
        hookCategory: '焦虑钩',
        hookSubCategory: '经济/职业',
        pushLogic: '县域人群对“去留选择”敏感，易引发讨论。',
        image: '/videos/county_job.png'
      }),
      V({
        id: 'county-love',
        title: '💍 相亲翻车现场：太真实了',
        caption: '“条件谈着谈着就变味。”',
        hookCategory: '情感钩',
        hookSubCategory: '婚恋关系',
        pushLogic: '相亲内容强代入，评论区故事多。',
        image: '/videos/county_love.png'
      }),
      V({
        id: 'county-deal',
        title: '🛒 这个便宜好物真的不踩雷',
        caption: '“省钱又体面。”',
        hookCategory: '解压钩',
        hookSubCategory: '生活技巧/省钱',
        pushLogic: '省钱技巧降低决策成本，提升收藏。',
        image: '/videos/county_deal.png'
      }),
      V({
        id: 'county-myth',
        title: '💸 逆袭故事：他凭什么一年买房？',
        caption: '“你也可以？”',
        hookCategory: '欲望钩',
        hookSubCategory: '致富神话',
        pushLogic: '逆袭叙事制造希望与焦虑交织，促使持续刷。',
        image: '/videos/county_myth.png'
      }),
      V({
        id: 'county-hot',
        title: '🔥 热门社会话题：谁对谁错？',
        caption: '“评论区吵翻。”',
        hookCategory: '情感钩',
        hookSubCategory: '对立议题',
        pushLogic: '对立议题提高评论互动，延长停留。',
        image: '/videos/county_hot.png'
      })
    ],
    interestOverrides: {
      理财: {
        replace: [
          {
            index: 2,
            video: V({
              id: 'county-fin',
              title: '📉 存钱真的有用吗？这3步最关键',
              caption: '“越看越想开始。”',
              hookCategory: '焦虑钩',
              hookSubCategory: '财务焦虑',
              pushLogic: '理财兴趣会把省钱内容升级为资产焦虑与对策内容。',
              image: '/videos/interest_finance.png'
            })
          }
        ]
      },
      旅游: {
        replace: [
          {
            index: 2,
            video: V({
              id: 'county-travel',
              title: '🚄 低预算旅行：两天一夜太爽了',
              caption: '“花小钱也能开心。”',
              hookCategory: '解压钩',
              hookSubCategory: '旅行治愈',
              pushLogic: '旅游兴趣会把省钱内容替换成“低预算旅行”，仍是解压出口。',
              image: '/videos/interest_travel.png'
            })
          }
        ]
      }
    }
  },

  /* =========================================================
   * 银发 60–75（不限男女）：怀旧/健康/社会温情/宏大叙事
   * ========================================================= */
  {
    id: 'silver_60_75_all',
    name: '银发乐活样本',
    ageMin: 60,
    ageMax: 75,
    gender: '不限',
    coreHook: '情感钩',
    avatar: '/avatars/silver_60_75.png',
    lifeStage: '更关注身体、情感回忆与社会秩序',
    emotion: '对衰老与失去的敏感',
    hookRanking: ['情感钩-怀旧', '焦虑钩-健康', '情感钩-正能量'],
    trapPaths: ['怀旧→情绪波动→继续刷→更沉浸'],
    baseVideos: [
      V({
        id: 'silver-nostalgia',
        title: '📼 老照片修复：一秒回到从前',
        caption: '“看完眼眶湿了。”',
        hookCategory: '情感钩',
        hookSubCategory: '经典怀旧',
        pushLogic: '银发人群对回忆内容停留更长，易产生情绪共鸣。',
        image: '/videos/silver_nostalgia.png'
      }),
      V({
        id: 'silver-health',
        title: '⚠️ 这3个动作伤膝盖，很多人天天做',
        caption: '“赶紧改！”',
        hookCategory: '焦虑钩',
        hookSubCategory: '健康恐惧',
        pushLogic: '用“你做错了”制造不确定性，促使收藏与转发。',
        image: '/videos/silver_health.png'
      }),
      V({
        id: 'silver-warm',
        title: '❤️ 这一幕太暖了…',
        caption: '“人间值得。”',
        hookCategory: '情感钩',
        hookSubCategory: '正能量/温情',
        pushLogic: '温情内容提供情绪补偿，提升分享。',
        image: '/videos/silver_warm.png'
      }),
      V({
        id: 'silver-nation',
        title: '🇨🇳 这段讲得太提气',
        caption: '“看得心里踏实。”',
        hookCategory: '情感钩',
        hookSubCategory: '宏大叙事/集体荣誉',
        pushLogic: '宏大叙事提供稳定感，增强粘性。',
        image: '/videos/silver_nation.png'
      }),
      V({
        id: 'silver-tv',
        title: '📺 老剧片段：台词太扎心',
        caption: '“越品越有味。”',
        hookCategory: '情感钩',
        hookSubCategory: '经典怀旧',
        pushLogic: '熟悉内容更易长时停留。',
        image: '/videos/silver_tv.png'
      })
    ],
    interestOverrides: {
      旅游: {
        replace: [
          {
            index: 4,
            video: V({
              id: 'silver-travel',
              title: '🧳 轻松旅行：慢慢走慢慢看',
              caption: '“舒服最重要。”',
              hookCategory: '解压钩',
              hookSubCategory: '旅行治愈',
              pushLogic: '旅游兴趣会用“轻松旅行”替换怀旧尾部内容作为情绪出口。',
              image: '/videos/interest_travel.png'
            })
          }
        ]
      },
      运动: {
        replace: [
          {
            index: 4,
            video: V({
              id: 'silver-walk',
              title: '🚶 走路这样走，才是真的养生',
              caption: '“姿势决定效果。”',
              hookCategory: '焦虑钩',
              hookSubCategory: '养生运动',
              pushLogic: '运动兴趣会把末尾替换成养生运动内容，仍会夹带健康恐惧。',
              image: '/videos/interest_walk.png'
            })
          }
        ]
      }
    }
  }
];
