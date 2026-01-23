// src/data/video_library.ts
import type { Gender, Interest, HookCategory } from './personas';

export type VideoItem = {
  id: string;
  title: string;
  caption: string;
  hookCategory: HookCategory;
  hookSubCategory: string;
  pushLogic: string;
  image?: string;

  tags: {
    ageMin: number;
    ageMax: number;
    genders: Gender[];          // ['男'|'女'|'不限']
    interests?: Interest[];     // 可选：为空=通用
  };
};

const V = (x: VideoItem) => x;

export const VIDEO_LIBRARY_ALL: VideoItem[] = [
  // =========================================================
  // 15–17（通用）
  // =========================================================
  V({
    id: 'teen_exam_1',
    title: '📚 这题90%的人都做错了',
    caption: '“别再靠死记硬背。”',
    hookCategory: '焦虑钩',
    hookSubCategory: '教育/考试',
    pushLogic: '15-17对“考试对错”高度敏感，错题/方法论收藏与复刷强。',
    image: '/videos/teen_exam.png',
    tags: { ageMin: 15, ageMax: 17, genders: ['不限'], interests: ['学习'] }
  }),
  V({
    id: 'teen_rank_1',
    title: '😵 成绩一掉，我就开始自责',
    caption: '“只有我不行吗？”',
    hookCategory: '情感钩',
    hookSubCategory: '同伴比较',
    pushLogic: '同伴比较触发代入与评论倾诉。',
    image: '/videos/teen_rank.png',
    tags: { ageMin: 15, ageMax: 17, genders: ['不限'], interests: ['学习'] }
  }),
  V({
    id: 'teen_parent_1',
    title: '👨‍👩‍👧 家长一句话我破防了',
    caption: '“你怎么就不争气？”',
    hookCategory: '焦虑钩',
    hookSubCategory: '代际冲突',
    pushLogic: '代际冲突提高评论对立与停留。',
    image: '/videos/teen_parent.png',
    tags: { ageMin: 15, ageMax: 17, genders: ['不限'] }
  }),
  V({
    id: 'teen_asmr_1',
    title: '🎧 3分钟白噪音：先把心稳住',
    caption: '“别崩。”',
    hookCategory: '解压钩',
    hookSubCategory: '沉浸体验',
    pushLogic: '焦虑流插入缓释内容，延长使用时长。',
    image: '/videos/teen_asmr.png',
    tags: { ageMin: 15, ageMax: 17, genders: ['不限'] }
  }),
  V({
    id: 'teen_game_1',
    title: '🎮 这个操作你能复刻吗？',
    caption: '“手残党慎入。”',
    hookCategory: '刺激钩',
    hookSubCategory: '游戏高能',
    pushLogic: '高能剪辑提升完播与点赞。',
    image: '/videos/interest_game.png',
    tags: { ageMin: 15, ageMax: 17, genders: ['不限'], interests: ['游戏'] }
  }),

  // =========================================================
  // 18–22 学生（通用）
  // =========================================================
  V({
    id: 'stu_eat_1',
    title: '🍜 深夜吃播：这一口太爽了',
    caption: '“宿舍已经饿疯了…”',
    hookCategory: '解压钩',
    hookSubCategory: 'ASMR/吃播',
    pushLogic: '学生夜间活跃，吃播低负荷强满足，完播与连刷高。',
    image: '/videos/stu_eat.png',
    tags: { ageMin: 18, ageMax: 22, genders: ['不限'] }
  }),
  V({
    id: 'stu_asmr_1',
    title: '🎧 戴上耳机：这声音太治愈',
    caption: '“大脑像被按摩。”',
    hookCategory: '解压钩',
    hookSubCategory: '沉浸体验',
    pushLogic: 'ASMR 易形成沉浸回路。',
    image: '/videos/stu_asmr.png',
    tags: { ageMin: 18, ageMax: 22, genders: ['不限'] }
  }),
  V({
    id: 'stu_campus_1',
    title: '🏫 别人的大学 VS 我的大学',
    caption: '“说多了都是泪。”',
    hookCategory: '情感钩',
    hookSubCategory: '经典共鸣',
    pushLogic: '群体共鸣促进评论自嘲，停留更长。',
    image: '/videos/stu_campus.png',
    tags: { ageMin: 18, ageMax: 22, genders: ['不限'] }
  }),
  V({
    id: 'stu_challenge_1',
    title: '🎯 30秒挑战：你能坚持到第几关？',
    caption: '“停不下来…”',
    hookCategory: '刺激钩',
    hookSubCategory: '挑战/冒险',
    pushLogic: '挑战类内容驱动连刷。',
    image: '/videos/stu_challenge.png',
    tags: { ageMin: 18, ageMax: 22, genders: ['不限'] }
  }),
  V({
    id: 'stu_future_1',
    title: '😶 大学毕业后真的会更好吗？',
    caption: '“突然开始焦虑。”',
    hookCategory: '焦虑钩',
    hookSubCategory: '就业/未来',
    pushLogic: '解压流插入轻焦虑制造落差，提升停留。',
    image: '/videos/stu_future.png',
    tags: { ageMin: 18, ageMax: 22, genders: ['不限'], interests: ['学习'] }
  }),

  // =========================================================
  // 20–25 细分视频（大量样本，保证抽取够用）
  // =========================================================
  // 20 女：社交/宿舍/变美/追星
  V({
    id: '20f_social_1',
    title: '🥹 “我是不是不够会聊天？”',
    caption: '“为什么别人都很合群…”',
    hookCategory: '情感钩',
    hookSubCategory: '社交共鸣',
    pushLogic: '20岁社交敏感，代入强；评论区倾诉拉高互动。',
    image: '/videos/20/20f_social_1.png',
    tags: { ageMin: 20, ageMax: 20, genders: ['女'] }
  }),
  V({
    id: '20f_social_2',
    title: '💬 3句开场白，让你不尬聊',
    caption: '“照着说就行。”',
    hookCategory: '解压钩',
    hookSubCategory: '方法论/技巧',
    pushLogic: '可执行技巧让人收藏复刷。',
    image: '/videos/20/20f_social_2.png',
    tags: { ageMin: 20, ageMax: 20, genders: ['女'], interests: ['学习'] }
  }),
  V({
    id: '20f_food_1',
    title: '🍜 食堂隐藏吃法：别再只会点这个',
    caption: '“宿舍要冲！”',
    hookCategory: '解压钩',
    hookSubCategory: '吃播/校园日常',
    pushLogic: '校园吃播低门槛强满足，完播高。',
    image: '/videos/20/20f_food_1.png',
    tags: { ageMin: 20, ageMax: 20, genders: ['女'] }
  }),
  V({
    id: '20f_look_1',
    title: '💄 新手妆容：一眼变“很会”',
    caption: '“上课也能用。”',
    hookCategory: '欲望钩',
    hookSubCategory: '外貌提升',
    pushLogic: '外貌提升内容天然高收藏。',
    image: '/videos/20/20f_look_1.png',
    tags: { ageMin: 20, ageMax: 20, genders: ['女'], interests: ['美妆'] }
  }),
  V({
    id: '20f_idol_1',
    title: '✨ 爱豆校园风穿搭复刻',
    caption: '“同款氛围感来了。”',
    hookCategory: '情感钩',
    hookSubCategory: '追星沉浸',
    pushLogic: '追星同款复刻复刷率更高。',
    image: '/videos/20/20f_idol_1.png',
    tags: { ageMin: 20, ageMax: 22, genders: ['女'], interests: ['追星'] }
  }),
  V({
    id: '20f_dorm_1',
    title: '🛏️ 宿舍晚安vlog：今天就这样吧',
    caption: '“你也辛苦了。”',
    hookCategory: '解压钩',
    hookSubCategory: '沉浸体验',
    pushLogic: '陪伴感内容延长停留。',
    image: '/videos/20/20f_dorm_1.png',
    tags: { ageMin: 20, ageMax: 22, genders: ['女'] }
  }),
  V({
    id: '20f_pet_1',
    title: '🐱 宿舍云吸猫：它真的太会治愈了',
    caption: '“看完心软。”',
    hookCategory: '解压钩',
    hookSubCategory: '治愈日常',
    pushLogic: '治愈系更容易长停留。',
    image: '/videos/20/20f_pet_1.png',
    tags: { ageMin: 18, ageMax: 25, genders: ['女', '不限'], interests: ['宠物'] }
  }),

  // 20 男：游戏/外设/挑战/健康补刀
  V({
    id: '20m_game_1',
    title: '🎮 新手上分：这波意识你学会了吗',
    caption: '“我悟了。”',
    hookCategory: '刺激钩',
    hookSubCategory: '游戏高能',
    pushLogic: '高光+教学剪辑完播高。',
    image: '/videos/20/20m_game_1.png',
    tags: { ageMin: 20, ageMax: 21, genders: ['男'], interests: ['游戏'] }
  }),
  V({
    id: '20m_game_2',
    title: '⚡ 你敢打这个挑战吗？输了别怪我',
    caption: '“不服再来一把。”',
    hookCategory: '刺激钩',
    hookSubCategory: '挑战/冒险',
    pushLogic: '挑战机制驱动停留。',
    image: '/videos/20/20m_game_2.png',
    tags: { ageMin: 20, ageMax: 23, genders: ['男'], interests: ['游戏'] }
  }),
  V({
    id: '20m_gear_1',
    title: '🖱️ 外设避坑：别再买智商税',
    caption: '“买对真的不一样。”',
    hookCategory: '欲望钩',
    hookSubCategory: '装备欲望',
    pushLogic: '装备种草促进收藏与购买意愿。',
    image: '/videos/20/20m_game_4.png',
    tags: { ageMin: 18, ageMax: 30, genders: ['男'], interests: ['游戏'] }
  }),
  V({
    id: '20m_health_1',
    title: '😵 熬夜打游戏的代价…你真的扛得住？',
    caption: '“我不敢看。”',
    hookCategory: '焦虑钩',
    hookSubCategory: '健康恐惧',
    pushLogic: '刺激流里插健康恐惧，形成闭环。',
    image: '/videos/20/20m_game_5.png',
    tags: { ageMin: 18, ageMax: 30, genders: ['男'] }
  }),
  V({
    id: '20m_sport_1',
    title: '🏀 大学男生最容易练出来的身材：这样做',
    caption: '“别瞎练。”',
    hookCategory: '刺激钩',
    hookSubCategory: '运动挑战',
    pushLogic: '运动挑战更容易点赞。',
    image: '/videos/20/20m_sport_1.png',
    tags: { ageMin: 18, ageMax: 30, genders: ['男'], interests: ['运动'] }
  }),

  // 21：男女各类
  V({
    id: '21m_study_1',
    title: '⏱️ 学不进去？你可能是方法错了',
    caption: '“不是你懒。”',
    hookCategory: '焦虑钩',
    hookSubCategory: '效率焦虑',
    pushLogic: '“你做错了”制造不确定性，促复刷。',
    image: '/videos/21/21m_study_1.png',
    tags: { ageMin: 20, ageMax: 24, genders: ['男', '不限'], interests: ['学习'] }
  }),
  V({
    id: '21m_path_1',
    title: '🧭 “保研还是去大厂？”我真的选不出来',
    caption: '“信息差太恐怖。”',
    hookCategory: '焦虑钩',
    hookSubCategory: '职业路径',
    pushLogic: '路径焦虑内容高停留。',
    image: '/videos/21/21m_study_2.png',
    tags: { ageMin: 20, ageMax: 25, genders: ['男', '不限'], interests: ['学习'] }
  }),
  V({
    id: '21f_body_1',
    title: '✨ 这套“显瘦拍照姿势”太绝了',
    caption: '“腿立刻变长。”',
    hookCategory: '欲望钩',
    hookSubCategory: '外貌提升',
    pushLogic: '立竿见影技巧收藏强。',
    image: '/videos/21/21f_body_1.png',
    tags: { ageMin: 18, ageMax: 30, genders: ['女'], interests: ['美妆'] }
  }),
  V({
    id: '21f_body_2',
    title: '🍵 “轻断食”真的安全吗？别被带节奏',
    caption: '“看完我慌了。”',
    hookCategory: '焦虑钩',
    hookSubCategory: '健康恐惧',
    pushLogic: '风险不确定性促反复观看。',
    image: '/videos/21/21f_body_2.png',
    tags: { ageMin: 18, ageMax: 35, genders: ['女'] }
  }),

  // 22：考研/春招/毕业焦虑
  V({
    id: '22f_kaoyan_1',
    title: '📚 考研倒计时：你现在该做什么',
    caption: '“别再假努力。”',
    hookCategory: '焦虑钩',
    hookSubCategory: '教育/考试',
    pushLogic: '考研方法论高收藏。',
    image: '/videos/22/22f_k_1.png',
    tags: { ageMin: 21, ageMax: 23, genders: ['女', '不限'], interests: ['学习'] }
  }),
  V({
    id: '22f_job_1',
    title: '😰 春招投递：我被拒麻了',
    caption: '“到底哪里不对？”',
    hookCategory: '焦虑钩',
    hookSubCategory: '就业/实习',
    pushLogic: '拒信敏感，停留与评论高。',
    image: '/videos/22/22f_j_1.png',
    tags: { ageMin: 21, ageMax: 24, genders: ['女', '不限'], interests: ['学习'] }
  }),
  V({
    id: '22m_path_1',
    title: '🧭 “考公还是去大厂？”我真的选不出来',
    caption: '“每条路都像陷阱。”',
    hookCategory: '焦虑钩',
    hookSubCategory: '职业路径',
    pushLogic: '毕业选择焦虑强代入。',
    image: '/videos/22/22m_path_1.png',
    tags: { ageMin: 21, ageMax: 24, genders: ['男', '不限'], interests: ['学习'] }
  }),

  // 23：研一/异地实习
  V({
    id: '23f_city_1',
    title: '🚇 实习通勤2小时，我快碎了',
    caption: '“每天像被掏空。”',
    hookCategory: '焦虑钩',
    hookSubCategory: '城市生存',
    pushLogic: '通勤痛点强共鸣。',
    image: '/videos/23/23f_city_1.png',
    tags: { ageMin: 22, ageMax: 26, genders: ['女', '不限'], interests: ['旅游'] }
  }),
  V({
    id: '23m_skill_1',
    title: '📌 “不会这些=没竞争力？”我开始慌了',
    caption: '“信息差太狠。”',
    hookCategory: '焦虑钩',
    hookSubCategory: '就业/技能',
    pushLogic: '门槛话术制造焦虑，促收藏复刷。',
    image: '/videos/23/23m_1.png',
    tags: { ageMin: 22, ageMax: 27, genders: ['男', '不限'], interests: ['学习'] }
  }),

  // 24：秋招/论文/租房
  V({
    id: '24m_autumn_1',
    title: '📉 秋招形势：今年更难了？',
    caption: '“我开始慌了。”',
    hookCategory: '焦虑钩',
    hookSubCategory: '就业/秋招',
    pushLogic: '窗口期危机叙事提高停留。',
    image: '/videos/24/24m_1.png',
    tags: { ageMin: 23, ageMax: 25, genders: ['男', '不限'], interests: ['学习'] }
  }),
  V({
    id: '24f_thesis_1',
    title: '📝 论文写不动？你不是一个人',
    caption: '“我真的要崩。”',
    hookCategory: '情感钩',
    hookSubCategory: '共鸣倾诉',
    pushLogic: '共鸣倾诉引导评论抱团。',
    image: '/videos/24/24f_1.png',
    tags: { ageMin: 23, ageMax: 26, genders: ['女', '不限'], interests: ['学习'] }
  }),

  // 25：新人职场
  V({
    id: '25f_new_1',
    title: '😰 第一份工作最怕的不是累，是被否定',
    caption: '“我每天都在装懂。”',
    hookCategory: '焦虑钩',
    hookSubCategory: '职场适应',
    pushLogic: '新人期对评价敏感，攻略复刷强。',
    image: '/videos/25/25f_1.png',
    tags: { ageMin: 24, ageMax: 27, genders: ['女', '不限'] }
  }),
  V({
    id: '25m_perf_1',
    title: '📉 试用期最危险的不是不会，是不会“汇报”',
    caption: '“我懂了。”',
    hookCategory: '焦虑钩',
    hookSubCategory: '职场适应',
    pushLogic: '汇报话术类内容收藏复刷强。',
    image: '/videos/25/25m_1.png',
    tags: { ageMin: 24, ageMax: 28, genders: ['男', '不限'] }
  }),

  // =========================================================
  // 25–35 职场兜底
  // =========================================================
  V({
    id: 'w_layoff_1',
    title: '📉 裁员名单出来了…',
    caption: '“下一轮会轮到我吗？”',
    hookCategory: '焦虑钩',
    hookSubCategory: '裁员危机',
    pushLogic: '25-35 对裁员敏感，危机叙事提高停留与收藏。',
    image: '/videos/w_layoff.png',
    tags: { ageMin: 25, ageMax: 35, genders: ['不限'] }
  }),
  V({
    id: 'w_salary_1',
    title: '💼 工资谈判：别再被压价了',
    caption: '“原来我亏这么多。”',
    hookCategory: '焦虑钩',
    hookSubCategory: '经济/职业',
    pushLogic: '解决方案类内容收藏高。',
    image: '/videos/w_salary.png',
    tags: { ageMin: 25, ageMax: 35, genders: ['不限'], interests: ['理财'] }
  }),
  V({
    id: 'w_health_1',
    title: '⚠️ 熬夜的代价比你想的大',
    caption: '“别等身体报警。”',
    hookCategory: '焦虑钩',
    hookSubCategory: '健康恐惧',
    pushLogic: '身体报警触发恐慌与自查。',
    image: '/videos/w_health.png',
    tags: { ageMin: 25, ageMax: 40, genders: ['不限'] }
  }),

  // =========================================================
  // 18–30 男兜底（刺激/欲望/猎奇）
  // =========================================================
  V({
    id: 'm_edge_1',
    title: '🔥 这也太会了吧…',
    caption: '“别眨眼。”',
    hookCategory: '欲望钩',
    hookSubCategory: '性吸引力/擦边',
    pushLogic: '18+男性对擦边停留更长，算法放大完播高的视频。',
    image: '/videos/m_edge.png',
    tags: { ageMin: 18, ageMax: 30, genders: ['男'] }
  }),
  V({
    id: 'm_curious_1',
    title: '🕵️ 你绝对想不到真相是…',
    caption: '“评论区吵翻了。”',
    hookCategory: '解压钩',
    hookSubCategory: '奇闻异事',
    pushLogic: '猎奇反转驱动停留与评论。',
    image: '/videos/m_curious.png',
    tags: { ageMin: 18, ageMax: 35, genders: ['男', '不限'] }
  }),
  V({
    id: 'm_myth_1',
    title: '💸 30天从0到1？别被骗了…',
    caption: '“越缺钱越容易信。”',
    hookCategory: '欲望钩',
    hookSubCategory: '致富神话',
    pushLogic: '逆袭叙事制造希望与焦虑交织。',
    image: '/videos/m_myth.png',
    tags: { ageMin: 18, ageMax: 40, genders: ['男', '不限'], interests: ['理财'] }
  }),

  // =========================================================
  // 18–35 女兜底（美妆/关系/健康）
  // =========================================================
  V({
    id: 'f_makeup_1',
    title: '💄 显贵妆：10分钟变高级',
    caption: '“这步别省，会直接土。”',
    hookCategory: '欲望钩',
    hookSubCategory: '外貌提升',
    pushLogic: '教程类利于收藏与复刷。',
    image: '/videos/f_makeup.png',
    tags: { ageMin: 18, ageMax: 35, genders: ['女'], interests: ['美妆'] }
  }),
  V({
    id: 'f_love_1',
    title: '💔 他不回你消息的真实原因…',
    caption: '“别再自我PUA了。”',
    hookCategory: '情感钩',
    hookSubCategory: '婚恋关系',
    pushLogic: '关系内容触发代入与倾诉。',
    image: '/videos/f_love.png',
    tags: { ageMin: 18, ageMax: 40, genders: ['女'] }
  }),
  V({
    id: 'f_body_1',
    title: '🔥 7天瘦腰：睡前这组必做',
    caption: '“坚持就是变美。”',
    hookCategory: '焦虑钩',
    hookSubCategory: '身材焦虑',
    pushLogic: '短期承诺激发希望+焦虑。',
    image: '/videos/f_body.png',
    tags: { ageMin: 18, ageMax: 35, genders: ['女'], interests: ['运动'] }
  }),

  // =========================================================
  // 35–50 男（房贷/危机）
  // =========================================================
  V({
    id: 'm_mortgage_1',
    title: '🏠 房贷到期那天，我失眠了',
    caption: '“压力把人压扁。”',
    hookCategory: '焦虑钩',
    hookSubCategory: '房贷压力',
    pushLogic: '35+男性对房贷与现金流高度敏感。',
    image: '/videos/m_mortgage.png',
    tags: { ageMin: 35, ageMax: 50, genders: ['男', '不限'], interests: ['理财'] }
  }),
  V({
    id: 'm_35crisis_1',
    title: '📉 35岁危机真的存在吗？',
    caption: '“看完更慌了。”',
    hookCategory: '焦虑钩',
    hookSubCategory: '经济/职业',
    pushLogic: '年龄危机话题易引发共鸣与评论。',
    image: '/videos/m_35crisis.png',
    tags: { ageMin: 35, ageMax: 50, genders: ['男', '不限'] }
  }),

  // =========================================================
  // 50–70 女（养生/家庭）
  // =========================================================
  V({
    id: 'f60_health_1',
    title: '⚠️ 女人过了50，这个指标最关键',
    caption: '“别等出事才后悔。”',
    hookCategory: '焦虑钩',
    hookSubCategory: '健康恐惧',
    pushLogic: '50+女性对指标与疾病信号敏感。',
    image: '/videos/f60_health.png',
    tags: { ageMin: 50, ageMax: 70, genders: ['女', '不限'] }
  }),
  V({
    id: 'f60_family_1',
    title: '👵 带孙子到底该不该收钱？',
    caption: '“评论区吵炸了。”',
    hookCategory: '焦虑钩',
    hookSubCategory: '家庭冲突',
    pushLogic: '家庭伦理争议提升评论对立与停留。',
    image: '/videos/f60_family.png',
    tags: { ageMin: 50, ageMax: 70, genders: ['女', '不限'] }
  }),

  // =========================================================
  // 60–75 银发（怀旧/健康）
  // =========================================================
  V({
    id: 'silver_nostalgia_1',
    title: '📼 老照片修复：一秒回到从前',
    caption: '“看完眼眶湿了。”',
    hookCategory: '情感钩',
    hookSubCategory: '经典怀旧',
    pushLogic: '银发对回忆内容停留更长。',
    image: '/videos/silver_nostalgia.png',
    tags: { ageMin: 60, ageMax: 75, genders: ['不限'] }
  }),
  V({
    id: 'silver_health_1',
    title: '⚠️ 这3个动作伤膝盖，很多人天天做',
    caption: '“赶紧改！”',
    hookCategory: '焦虑钩',
    hookSubCategory: '健康恐惧',
    pushLogic: '用“你做错了”制造不确定性，促收藏与转发。',
    image: '/videos/silver_health.png',
    tags: { ageMin: 60, ageMax: 75, genders: ['不限'] }
  })
];
