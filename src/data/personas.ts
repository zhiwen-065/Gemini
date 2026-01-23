// =======================
// 基础类型定义
// =======================
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

// 小工具，方便写视频
const V = (v: VideoItem) => v;

// =======================
// 人物库（整合版）
// =======================
export const PERSONAS: PersonaTemplate[] = [

  /* =====================================================
   * 18岁 · 女 · 追星（高确定性）
   * ===================================================== */
  {
    id: 'f18_idol',
    name: '18岁女·追星派',
    ageMin: 18,
    ageMax: 18,
    gender: '女',
    coreHook: '情感钩',
    lifeStage: '高中毕业/大学初期，情绪寄托强',
    emotion: '被理解的渴望 + 群体归属感',
    hookRanking: ['情感钩-追星', '欲望钩-外貌', '解压钩-沉浸'],
    trapPaths: ['情绪投入→直拍/物料→连刷→情感绑定'],
    baseVideos: [
      V({ id:'18f-1', title:'✨ 今天这段直拍太神了', caption:'“这一眼谁顶得住？”', hookCategory:'情感钩', hookSubCategory:'追星沉浸', pushLogic:'18岁女性追星粘性极高，直拍完播率高。', image:'/videos/18f_idol1.png' }),
      V({ id:'18f-2', title:'💌 他说这句话的时候我哭了', caption:'“原来他懂我们。”', hookCategory:'情感钩', hookSubCategory:'情绪共鸣', pushLogic:'情绪共鸣强化身份认同。', image:'/videos/18f_idol2.png' }),
      V({ id:'18f-3', title:'💄 爱豆同款妆容拆解', caption:'“一步步照着来。”', hookCategory:'欲望钩', hookSubCategory:'外貌提升', pushLogic:'同款妆容种草转化高。', image:'/videos/18f_makeup.png' }),
      V({ id:'18f-4', title:'🎧 这个BGM一响我就知道了', caption:'“自动循环。”', hookCategory:'解压钩', hookSubCategory:'沉浸体验', pushLogic:'音乐沉浸延长使用时长。', image:'/videos/18f_music.png' }),
      V({ id:'18f-5', title:'📱 你也每天都在等新物料吗', caption:'“像在等更新人生。”', hookCategory:'情感钩', hookSubCategory:'群体共鸣', pushLogic:'持续关注形成习惯。', image:'/videos/18f_wait.png' })
    ]
  },

  /* =====================================================
   * 20岁 · 男 · 电竞
   * ===================================================== */
  {
    id: 'm20_esports',
    name: '20岁男·电竞派',
    ageMin: 20,
    ageMax: 20,
    gender: '男',
    coreHook: '刺激钩',
    lifeStage: '大学低年级，高刺激偏好',
    emotion: '胜负欲 + 即时反馈依赖',
    hookRanking: ['刺激钩-游戏', '解压钩-猎奇', '焦虑钩-健康'],
    trapPaths: ['高能→连刷→更高能→停不下来'],
    baseVideos: [
      V({ id:'20m-1', title:'🎮 这波操作你能复刻吗？', caption:'“手速拉满。”', hookCategory:'刺激钩', hookSubCategory:'游戏高能', pushLogic:'高能剪辑完播率极高。', image:'/videos/20m_game1.png' }),
      V({ id:'20m-2', title:'⚡ 排位一局比一局刺激', caption:'“赢了根本睡不着。”', hookCategory:'刺激钩', hookSubCategory:'竞技刺激', pushLogic:'竞技胜负制造强情绪。', image:'/videos/20m_game2.png' }),
      V({ id:'20m-3', title:'🕵️ 你绝对想不到结局', caption:'“反转太狠。”', hookCategory:'解压钩', hookSubCategory:'猎奇反转', pushLogic:'转移注意力，延长使用。', image:'/videos/20m_curious.png' }),
      V({ id:'20m-4', title:'💸 游戏主播真的很赚钱吗？', caption:'“我也想试试。”', hookCategory:'欲望钩', hookSubCategory:'致富幻想', pushLogic:'年轻男性易被“可能性”吸引。', image:'/videos/20m_myth.png' }),
      V({ id:'20m-5', title:'⚠️ 熬夜对身体的影响', caption:'“但我停不下。”', hookCategory:'焦虑钩', hookSubCategory:'健康恐惧', pushLogic:'在刺激后插入焦虑，形成闭环。', image:'/videos/20m_health.png' })
    ]
  },

  /* =====================================================
   * 22岁 · 女 · 大四（考研 / 春招随机）
   * ===================================================== */
  {
    id: 'f22_kaoyan',
    name: '22岁女·大四考研派',
    ageMin: 22,
    ageMax: 22,
    gender: '女',
    coreHook: '焦虑钩',
    lifeStage: '大四备考期',
    emotion: '害怕失败',
    hookRanking: ['焦虑钩-教育', '解压钩', '情感钩'],
    trapPaths: ['焦虑→方法论→更多焦虑'],
    baseVideos: [
      V({ id:'22f-1', title:'📚 考研倒计时你慌了吗', caption:'“我已经开始失眠。”', hookCategory:'焦虑钩', hookSubCategory:'教育/考试', pushLogic:'考试焦虑极强。', image:'/videos/22f_ky1.png' }),
      V({ id:'22f-2', title:'📝 真题这样刷才不白费', caption:'“90%的人方法错了。”', hookCategory:'焦虑钩', hookSubCategory:'方法论', pushLogic:'制造不确定性。', image:'/videos/22f_ky2.png' }),
      V({ id:'22f-3', title:'🥲 我每天学12小时还是很慌', caption:'“你也是吗？”', hookCategory:'情感钩', hookSubCategory:'共鸣', pushLogic:'评论区自曝。', image:'/videos/22f_ky3.png' }),
      V({ id:'22f-4', title:'🫧 白噪音稳住心态', caption:'“先别崩。”', hookCategory:'解压钩', hookSubCategory:'沉浸', pushLogic:'情绪缓释。', image:'/videos/22f_relief.png' }),
      V({ id:'22f-5', title:'⚠️ 熬夜记忆力真的会掉', caption:'“但我停不下。”', hookCategory:'焦虑钩', hookSubCategory:'健康', pushLogic:'焦虑叠加。', image:'/videos/22f_health.png' })
    ]
  },

  /* =====================================================
   * 25岁 · 女 · 研究生毕业
   * ===================================================== */
  {
    id: 'f25_master_grad',
    name: '25岁女·研毕入职派',
    ageMin: 25,
    ageMax: 25,
    gender: '女',
    coreHook: '焦虑钩',
    lifeStage: '研究生毕业/刚入职',
    emotion: '怕犯错 + 怕被否定',
    hookRanking: ['焦虑钩-职场', '情感钩-对比', '解压钩'],
    trapPaths: ['焦虑→刷攻略→继续焦虑'],
    baseVideos: [
      V({ id:'25f-1', title:'😰 第一份工作每天都很慌', caption:'“我是不是不适合职场？”', hookCategory:'焦虑钩', hookSubCategory:'职场适应', pushLogic:'新人期评价焦虑高。', image:'/videos/25f_work.png' }),
      V({ id:'25f-2', title:'📌 新人最容易踩的坑', caption:'“我已经中招了。”', hookCategory:'焦虑钩', hookSubCategory:'职场生存', pushLogic:'避坑内容收藏高。', image:'/videos/25f_pitfall.png' }),
      V({ id:'25f-3', title:'🏠 租房通勤把我榨干', caption:'“大城市好难。”', hookCategory:'焦虑钩', hookSubCategory:'城市生存', pushLogic:'北上广深共鸣。', image:'/videos/25f_city.png' }),
      V({ id:'25f-4', title:'🥲 同龄人都升职加薪了', caption:'“只有我还在原地。”', hookCategory:'情感钩', hookSubCategory:'同龄对比', pushLogic:'对比叙事。', image:'/videos/25f_compare.png' }),
      V({ id:'25f-5', title:'🫧 10分钟治愈时间', caption:'“先把情绪放下。”', hookCategory:'解压钩', hookSubCategory:'治愈', pushLogic:'情绪补偿。', image:'/videos/25f_relief.png' })
    ]
  },

  /* =====================================================
   * 30岁 · 男 · 北漂打工人
   * ===================================================== */
  {
    id: 'm30_beipiao',
    name: '30岁男·北漂打工人',
    ageMin: 28,
    ageMax: 32,
    gender: '男',
    coreHook: '焦虑钩',
    lifeStage: '职场瓶颈期',
    emotion: '中年提前焦虑',
    hookRanking: ['焦虑钩-职业', '焦虑钩-房租', '情感钩'],
    trapPaths: ['焦虑→比较→继续刷'],
    baseVideos: [
      V({ id:'30m-1', title:'📉 30岁还没稳定是不是失败', caption:'“我开始怀疑自己。”', hookCategory:'焦虑钩', hookSubCategory:'中年危机', pushLogic:'年龄节点焦虑。', image:'/videos/30m_age.png' }),
      V({ id:'30m-2', title:'🏠 北漂房租又涨了', caption:'“工资追不上。”', hookCategory:'焦虑钩', hookSubCategory:'生存压力', pushLogic:'生存成本焦虑。', image:'/videos/30m_rent.png' }),
      V({ id:'30m-3', title:'😶 同龄人都混得比你好', caption:'“我是不是该回老家？”', hookCategory:'情感钩', hookSubCategory:'同龄对比', pushLogic:'对比叙事。', image:'/videos/30m_compare.png' }),
      V({ id:'30m-4', title:'🫧 下班后只想放空', caption:'“什么都不想干。”', hookCategory:'解压钩', hookSubCategory:'沉浸', pushLogic:'疲惫后的补偿。', image:'/videos/30m_relief.png' }),
      V({ id:'30m-5', title:'⚠️ 你真的还能熬夜吗', caption:'“身体开始抗议。”', hookCategory:'焦虑钩', hookSubCategory:'健康', pushLogic:'健康焦虑插入。', image:'/videos/30m_health.png' })
    ]
  },

  /* =====================================================
   * 40岁 · 女 · 二胎妈妈
   * ===================================================== */
  {
    id: 'f40_two_kids',
    name: '40岁女·二胎妈妈',
    ageMin: 38,
    ageMax: 42,
    gender: '女',
    coreHook: '焦虑钩',
    lifeStage: '家庭责任高峰期',
    emotion: '疲惫 + 自责',
    hookRanking: ['焦虑钩-教育', '焦虑钩-健康', '情感钩'],
    trapPaths: ['焦虑→刷经验→更焦虑'],
    baseVideos: [
      V({ id:'40f-1', title:'📚 二胎家庭到底怎么教', caption:'“我每天都在反思。”', hookCategory:'焦虑钩', hookSubCategory:'教育/鸡娃', pushLogic:'育儿焦虑。', image:'/videos/40f_kid.png' }),
      V({ id:'40f-2', title:'⚠️ 女性40+这些信号别忽视', caption:'“身体真的在变。”', hookCategory:'焦虑钩', hookSubCategory:'健康恐惧', pushLogic:'更年期相关焦虑。', image:'/videos/40f_health.png' }),
      V({ id:'40f-3', title:'🥲 我是不是把自己弄丢了', caption:'“只剩下妈妈身份。”', hookCategory:'情感钩', hookSubCategory:'自我认同', pushLogic:'身份共鸣。', image:'/videos/40f_identity.png' }),
      V({ id:'40f-4', title:'🇨🇳 这一段看得人想哭', caption:'“集体记忆。”', hookCategory:'情感钩', hookSubCategory:'爱国叙事', pushLogic:'情绪托底。', image:'/videos/40f_nation.png' }),
      V({ id:'40f-5', title:'🫧 夜深了才属于自己', caption:'“终于安静。”', hookCategory:'解压钩', hookSubCategory:'沉浸', pushLogic:'情绪补偿。', image:'/videos/40f_relief.png' })
    ]
  },

  /* =====================================================
   * 45岁 · 男 · 创业失败
   * ===================================================== */
  {
    id: 'm45_failed_startup',
    name: '45岁男·创业失败者',
    ageMin: 43,
    ageMax: 47,
    gender: '男',
    coreHook: '焦虑钩',
    lifeStage: '事业受挫/转型期',
    emotion: '失控感 + 自尊受损',
    hookRanking: ['焦虑钩-经济', '情感钩-怀旧', '欲望钩-翻盘幻想'],
    trapPaths: ['失败回顾→寻找翻盘→继续刷'],
    baseVideos: [
      V({ id:'45m-1', title:'📉 创业失败后你会怎么办', caption:'“没人教过我。”', hookCategory:'焦虑钩', hookSubCategory:'经济/失败', pushLogic:'失败经历强共鸣。', image:'/videos/45m_fail.png' }),
      V({ id:'45m-2', title:'💸 中年翻盘还有机会吗', caption:'“我不甘心。”', hookCategory:'欲望钩', hookSubCategory:'逆袭幻想', pushLogic:'用希望抵消挫败。', image:'/videos/45m_revenge.png' }),
      V({ id:'45m-3', title:'🕰️ 那些年我们都相信过的事', caption:'“时代真的变了。”', hookCategory:'情感钩', hookSubCategory:'怀旧', pushLogic:'怀旧情绪降低防御。', image:'/videos/45m_old.png' }),
      V({ id:'45m-4', title:'⚠️ 中年男性的健康警告', caption:'“别硬扛了。”', hookCategory:'焦虑钩', hookSubCategory:'健康恐惧', pushLogic:'健康风险叠加焦虑。', image:'/videos/45m_health.png' }),
      V({ id:'45m-5', title:'🫧 深夜刷到停不下', caption:'“不想面对现实。”', hookCategory:'解压钩', hookSubCategory:'逃避沉浸', pushLogic:'逃避型刷屏。', image:'/videos/45m_relief.png' })
    ]
  }

];
