import type { PersonaTemplate } from './personas';

const V = (x: any) => x;

export const PERSONAS_20_25: PersonaTemplate[] = [
  /* ===================== 20岁：大一/大二：新鲜感+社交+外貌 ===================== */
  {
    id: 'f20_campus_social',
    name: '20岁女·校园社交派',
    ageMin: 20,
    ageMax: 20,
    gender: '女',
    coreHook: '情感钩',
    lifeStage: '刚适应大学，社交圈扩张期',
    emotion: '怕落单 + 想被喜欢',
    hookRanking: ['情感钩-婚恋/社交', '欲望钩-外貌提升', '解压钩-吃播'],
    trapPaths: ['社交焦虑→看技巧→对比→继续刷'],
    baseVideos: [
      V({ id:'20f-1', title:'🥹 “我是不是不够会聊天？”', caption:'“为什么别人都很合群…”', hookCategory:'情感钩', hookSubCategory:'社交共鸣', pushLogic:'20岁社交敏感，代入强，评论区倾诉多。', image:'/videos/20f_social.png' }),
      V({ id:'20f-2', title:'💄 新手妆容：一眼变“很会”', caption:'“照着做就行。”', hookCategory:'欲望钩', hookSubCategory:'外貌提升', pushLogic:'外貌提升内容高收藏，高复刷。', image:'/videos/20f_makeup.png' }),
      V({ id:'20f-3', title:'🍜 食堂隐藏吃法：别再只会点这个', caption:'“宿舍要冲！”', hookCategory:'解压钩', hookSubCategory:'吃播/日常', pushLogic:'校园吃播低门槛强满足，完播高。', image:'/videos/20f_food.png' }),
      V({ id:'20f-4', title:'📱 你也在半夜刷到停不下吗？', caption:'“我只是想放松一下。”', hookCategory:'解压钩', hookSubCategory:'沉浸体验', pushLogic:'用“共鸣”巩固习惯，延长时长。', image:'/videos/20f_scroll.png' }),
      V({ id:'20f-5', title:'🔥 这套穿搭显高显瘦', caption:'“拍照绝了。”', hookCategory:'欲望钩', hookSubCategory:'外貌提升', pushLogic:'穿搭内容触发即时行动与收藏。', image:'/videos/20f_outfit.png' })
    ],
    interestOverrides: {
      追星: {
        replace: [
          { index: 3, video: V({ id:'20f-idol', title:'✨ 爱豆校园风穿搭复刻', caption:'“同款氛围感来了。”', hookCategory:'情感钩', hookSubCategory:'追星沉浸', pushLogic:'追星兴趣会把沉浸内容换成直拍/同款复刻，复刷率更高。', image:'/videos/interest_idol.png' }) }
        ]
      },
      美妆: {
        replace: [
          { index: 4, video: V({ id:'20f-makeup2', title:'💋 适合学生党的平价底妆', caption:'“不贵但很像贵的。”', hookCategory:'欲望钩', hookSubCategory:'美妆种草', pushLogic:'美妆兴趣强化“平价替代”，更像真实分发。', image:'/videos/interest_makeup.png' }) }
        ]
      }
    }
  },

  /* ===================== 21岁：大二/大三：开始分化：学习or玩乐or身材 ===================== */
  {
    id: 'm21_esports',
    name: '21岁男·游戏电竞派',
    ageMin: 21,
    ageMax: 21,
    gender: '男',
    coreHook: '刺激钩',
    lifeStage: '学习压力上来但想要快速刺激',
    emotion: '上头 + 胜负欲',
    hookRanking: ['刺激钩-游戏高能', '解压钩-猎奇', '欲望钩-暴富神话'],
    trapPaths: ['高能→停留→更高能→沉迷'],
    baseVideos: [
      V({ id:'21m-1', title:'🎮 这波操作直接封神', caption:'“手速拉满。”', hookCategory:'刺激钩', hookSubCategory:'游戏高能', pushLogic:'电竞高能剪辑完播率高，适合21岁男性。', image:'/videos/21m_game.png' }),
      V({ id:'21m-2', title:'⚡ 你敢挑战这个段位吗？', caption:'“失败一次就上头。”', hookCategory:'刺激钩', hookSubCategory:'挑战/冒险', pushLogic:'挑战叙事驱动连刷。', image:'/videos/21m_challenge.png' }),
      V({ id:'21m-3', title:'🕵️ 你绝对想不到真相是…', caption:'“评论区吵翻。”', hookCategory:'解压钩', hookSubCategory:'猎奇反转', pushLogic:'猎奇反转提升停留和评论。', image:'/videos/21m_curious.png' }),
      V({ id:'21m-4', title:'💸 “副业月入过万”？别信太快', caption:'“但我还是想试…”', hookCategory:'欲望钩', hookSubCategory:'致富神话', pushLogic:'用希望钩住，再用焦虑留住。', image:'/videos/21m_myth.png' }),
      V({ id:'21m-5', title:'😵 熬夜的代价你想不到', caption:'“但我改不了…”', hookCategory:'焦虑钩', hookSubCategory:'健康恐惧', pushLogic:'在刺激流里插入健康恐惧，形成焦虑闭环。', image:'/videos/21m_health.png' })
    ],
    interestOverrides: {
      游戏: {
        replace: [
          { index: 3, video: V({ id:'21m-gear', title:'🖱️ 这套外设让你反应快一截', caption:'“装备党狂喜。”', hookCategory:'欲望钩', hookSubCategory:'装备欲望', pushLogic:'游戏兴趣会把副业神话换成装备种草，依然是欲望钩。', image:'/videos/interest_gear.png' }) }
        ]
      },
      运动: {
        replace: [
          { index: 4, video: V({ id:'21m-gym', title:'🏋️ 练这个动作，状态直接起飞', caption:'“一周见效？”', hookCategory:'刺激钩', hookSubCategory:'运动挑战', pushLogic:'运动兴趣把健康恐惧换成健身挑战，更容易点赞。', image:'/videos/interest_sport.png' }) }
        ]
      }
    }
  },

  /* ===================== 22岁：大四：考研/春招二选一（同龄抽卡） ===================== */
  {
    id: 'f22_kaoyan',
    name: '22岁女·大四考研派',
    ageMin: 22,
    ageMax: 22,
    gender: '女',
    coreHook: '焦虑钩',
    lifeStage: '大四备考，时间紧迫',
    emotion: '害怕失败 + 自我怀疑',
    hookRanking: ['焦虑钩-教育/考试', '解压钩-沉浸', '情感钩-共鸣'],
    trapPaths: ['焦虑→方法论→更多焦虑→继续刷'],
    baseVideos: [
      V({ id:'22f-1', title:'📚 考研倒计时：你现在该做什么', caption:'“别再假努力。”', hookCategory:'焦虑钩', hookSubCategory:'教育/考试', pushLogic:'22岁考研群体对“方法论”强依赖，收藏率高。', image:'/videos/22f_kaoyan1.png' }),
      V({ id:'22f-2', title:'📝 真题这样刷，效率翻倍', caption:'“90%的人用错方法。”', hookCategory:'焦虑钩', hookSubCategory:'教育/考试', pushLogic:'“你做错了”制造不确定性，促使反复观看。', image:'/videos/22f_kaoyan2.png' }),
      V({ id:'22f-3', title:'🥲 我每天学12小时还是很慌', caption:'“你也是吗？”', hookCategory:'情感钩', hookSubCategory:'共鸣倾诉', pushLogic:'共鸣内容引发评论自曝与抱团。', image:'/videos/22f_kaoyan3.png' }),
      V({ id:'22f-4', title:'🫧 3分钟白噪音：把心稳住', caption:'“别崩。”', hookCategory:'解压钩', hookSubCategory:'沉浸体验', pushLogic:'焦虑后给缓释，反而更容易继续刷。', image:'/videos/22f_relief.png' }),
      V({ id:'22f-5', title:'⚠️ 熬夜会让记忆力崩掉', caption:'“但我停不下…”', hookCategory:'焦虑钩', hookSubCategory:'健康恐惧', pushLogic:'考试焦虑叠加健康恐惧，形成闭环。', image:'/videos/22f_health.png' })
    ]
  },
  {
    id: 'f22_chunzhao',
    name: '22岁女·大四春招派',
    ageMin: 22,
    ageMax: 22,
    gender: '女',
    coreHook: '焦虑钩',
    lifeStage: '春招/实习转正压力',
    emotion: '害怕落后同龄人',
    hookRanking: ['焦虑钩-就业', '情感钩-对比', '解压钩-吃播'],
    trapPaths: ['焦虑→刷经验→更焦虑→继续刷'],
    baseVideos: [
      V({ id:'22fJ-1', title:'😰 春招投递：我被拒麻了', caption:'“到底哪里不对？”', hookCategory:'焦虑钩', hookSubCategory:'就业/实习', pushLogic:'22岁毕业求职对拒信极敏感，停留与评论高。', image:'/videos/22f_job1.png' }),
      V({ id:'22fJ-2', title:'🧠 面试必问：你答对了吗？', caption:'“别再踩坑。”', hookCategory:'焦虑钩', hookSubCategory:'就业/面试', pushLogic:'“解决方案”内容促进收藏与复刷。', image:'/videos/22f_job2.png' }),
      V({ id:'22fJ-3', title:'🥲 同学都拿offer了，我还在…', caption:'“我是不是太差了？”', hookCategory:'情感钩', hookSubCategory:'同龄对比', pushLogic:'对比叙事引发自曝与安慰，互动强。', image:'/videos/22f_job3.png' }),
      V({ id:'22fJ-4', title:'🍜 深夜吃播：边看边焦虑', caption:'“我就是停不下来。”', hookCategory:'解压钩', hookSubCategory:'吃播/情绪补偿', pushLogic:'情绪补偿型吃播降低压力，但延长刷时长。', image:'/videos/22f_job4.png' }),
      V({ id:'22fJ-5', title:'⚠️ 这3个身体信号别忽视', caption:'“焦虑真的会反噬。”', hookCategory:'焦虑钩', hookSubCategory:'健康恐惧', pushLogic:'就业压力叠加健康恐惧，形成循环。', image:'/videos/22f_job5.png' })
    ]
  },

  /* ===================== 23岁：研究生一年级：信息差/实习/容貌与关系继续存在 ===================== */
  {
    id: 'f23_master1',
    name: '23岁女·研一信息差派',
    ageMin: 23,
    ageMax: 23,
    gender: '女',
    coreHook: '焦虑钩',
    lifeStage: '研一：实习/方向选择，担心走错路',
    emotion: '信息差恐惧 + 不确定性',
    hookRanking: ['焦虑钩-职业路径', '解压钩-沉浸', '欲望钩-外貌提升'],
    trapPaths: ['信息焦虑→刷攻略→更焦虑→继续刷'],
    baseVideos: [
      V({ id:'23f-1', title:'🧭 研一最怕的不是忙，是走错方向', caption:'“你选对了吗？”', hookCategory:'焦虑钩', hookSubCategory:'职业路径', pushLogic:'研一对“方向选择”焦虑高，攻略类内容复刷强。', image:'/videos/23f_path.png' }),
      V({ id:'23f-2', title:'💼 这类实习最值：不做会后悔', caption:'“别只看title。”', hookCategory:'焦虑钩', hookSubCategory:'实习/求职', pushLogic:'用“错过就亏”刺激收藏与转发。', image:'/videos/23f_intern.png' }),
      V({ id:'23f-3', title:'💄 研究生也要精致：低成本变好看', caption:'“开会不怯场。”', hookCategory:'欲望钩', hookSubCategory:'外貌提升', pushLogic:'外貌提升作为“自我补偿”，提升粘性。', image:'/videos/23f_makeup.png' }),
      V({ id:'23f-4', title:'🫧 白噪音：把心稳住再干活', caption:'“别崩。”', hookCategory:'解压钩', hookSubCategory:'沉浸体验', pushLogic:'学习/科研压力后插入缓释内容，延长时长。', image:'/videos/23f_noise.png' }),
      V({ id:'23f-5', title:'😶 同龄人都在赚钱，我还在读书', caption:'“我是不是落后了？”', hookCategory:'情感钩', hookSubCategory:'同龄对比', pushLogic:'对比叙事极易引发评论区自曝。', image:'/videos/23f_compare.png' })
    ]
  },

  /* ===================== 24岁：研二/研三：毕业焦虑+论文+求职 ===================== */
  {
    id: 'm24_master2_job',
    name: '24岁男·研二求职派',
    ageMin: 24,
    ageMax: 24,
    gender: '男',
    coreHook: '焦虑钩',
    lifeStage: '研二：论文+实习+秋招三线压力',
    emotion: '时间不够 + 害怕错过窗口期',
    hookRanking: ['焦虑钩-就业', '焦虑钩-效率', '解压钩-猎奇'],
    trapPaths: ['焦虑→刷方法→更焦虑→继续刷'],
    baseVideos: [
      V({ id:'24m-1', title:'📉 秋招形势：今年更难了？', caption:'“我开始慌了。”', hookCategory:'焦虑钩', hookSubCategory:'就业/秋招', pushLogic:'24岁求职窗口期强，危机叙事提升停留。', image:'/videos/24m_job.png' }),
      V({ id:'24m-2', title:'🧠 面试算法：这题你会吗？', caption:'“别硬背。”', hookCategory:'焦虑钩', hookSubCategory:'就业/面试', pushLogic:'技能题促使反复观看与收藏。', image:'/videos/24m_interview.png' }),
      V({ id:'24m-3', title:'⏱️ 论文拖延怎么办？这招太狠', caption:'“立刻能用。”', hookCategory:'焦虑钩', hookSubCategory:'效率/自律焦虑', pushLogic:'“效率解决方案”让人觉得有用，从而继续刷。', image:'/videos/24m_thesis.png' }),
      V({ id:'24m-4', title:'🕵️ 你绝对想不到真相是…', caption:'“越看越上头。”', hookCategory:'解压钩', hookSubCategory:'猎奇反转', pushLogic:'高压人群需要转移注意力，猎奇是出口。', image:'/videos/24m_curious.png' }),
      V({ id:'24m-5', title:'⚠️ 熬夜会让你更焦虑', caption:'“但我改不了…”', hookCategory:'焦虑钩', hookSubCategory:'健康恐惧', pushLogic:'高压+健康恐惧形成闭环。', image:'/videos/24m_health.png' })
    ]
  },

  /* ===================== 25岁：研究生毕业/刚入职：第一份工作焦虑+城市生存 ===================== */
  {
    id: 'f25_newhire',
    name: '25岁女·研毕入职派',
    ageMin: 25,
    ageMax: 25,
    gender: '女',
    coreHook: '焦虑钩',
    lifeStage: '研毕刚入职：适应期+绩效压力',
    emotion: '怕犯错 + 怕不被认可',
    hookRanking: ['焦虑钩-职业', '情感钩-同龄对比', '解压钩-治愈'],
    trapPaths: ['焦虑→刷攻略→更焦虑→继续刷'],
    baseVideos: [
      V({ id:'25f-1', title:'😰 第一份工作最怕的不是累，是被否定', caption:'“我每天都在装懂。”', hookCategory:'焦虑钩', hookSubCategory:'职场适应', pushLogic:'25岁入职期对评价敏感，职场攻略复刷强。', image:'/videos/25f_work.png' }),
      V({ id:'25f-2', title:'📌 新人避坑：这3件事别做', caption:'“我后悔了。”', hookCategory:'焦虑钩', hookSubCategory:'职场生存', pushLogic:'“避坑”结构天然利于收藏。', image:'/videos/25f_pitfall.png' }),
      V({ id:'25f-3', title:'🏠 租房/通勤把我榨干了', caption:'“大城市真的难。”', hookCategory:'焦虑钩', hookSubCategory:'城市生存',
      pushLogic:'城市生存压力强共鸣，易引发评论对比。', image:'/videos/25f_city.png' }),
      V({ id:'25f-4', title:'🥲 同龄人都升职加薪了…', caption:'“只有我在原地。”', hookCategory:'情感钩', hookSubCategory:'同龄对比', pushLogic:'对比叙事放大不安全感，增强停留。', image:'/videos/25f_compare.png' }),
      V({ id:'25f-5', title:'🫧 10分钟：把情绪放下', caption:'“先稳住自己。”', hookCategory:'解压钩', hookSubCategory:'治愈放松', pushLogic:'给一个情绪出口让你继续刷，而不是退出。', image:'/videos/25f_relief.png' })
    ]
  }
];
