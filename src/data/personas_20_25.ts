// src/data/personas_20_25.ts
import type { PersonaTemplate, Interest } from './personas';

const policy = (p: {
  count?: number;
  allowed?: PersonaTemplate['videoPolicy']['allowedHookCategories'];
  prefer?: Interest[];
}): PersonaTemplate['videoPolicy'] => ({
  count: p.count ?? 5,
  allowedHookCategories: p.allowed,
  preferInterests: p.prefer ?? []
});

/**
 * ✅ 20–25 细分库（每岁至少 3 张卡）
 * - 只定义人物画像 + videoPolicy
 * - 视频统一从 video_library.ts 根据 tags 筛选
 */
export const PERSONAS_20_25: PersonaTemplate[] = [
  // =========================================================
  // 20岁（3张）
  // =========================================================
  {
    id: 'p20_f_campus_social',
    name: '20岁女·校园社交派',
    ageMin: 20,
    ageMax: 20,
    gender: '女',
    coreHook: '情感钩',
    avatar: '/avatars/20f_social.png',
    lifeStage: '刚适应大学，社交圈扩张期',
    emotion: '怕落单 + 想被喜欢',
    hookRanking: ['情感钩-社交共鸣', '欲望钩-外貌提升', '解压钩-吃播日常'],
    trapPaths: ['社交不安→刷技巧→对比自己→再刷“更有效方法”→更不安'],
    videoPolicy: policy({
      allowed: ['情感钩', '欲望钩', '解压钩', '焦虑钩'],
      prefer: ['追星', '美妆', '旅游']
    })
  },
  {
    id: 'p20_f_dorm_daily',
    name: '20岁女·宿舍日常派',
    ageMin: 20,
    ageMax: 20,
    gender: '女',
    coreHook: '解压钩',
    avatar: '/avatars/20f_dorm.png',
    lifeStage: '宿舍生活为主，喜欢轻松内容与陪伴感',
    emotion: '需要被陪着 + 不想太累',
    hookRanking: ['解压钩-校园日常', '情感钩-共鸣倾诉', '欲望钩-轻变美'],
    trapPaths: ['无聊→刷日常→产生陪伴→再刷同类→时间感消失'],
    videoPolicy: policy({
      allowed: ['解压钩', '情感钩', '欲望钩', '刺激钩'],
      prefer: ['宠物', '美妆', '追星']
    })
  },
  {
    id: 'p20_m_freshman_game',
    name: '20岁男·大一新鲜派',
    ageMin: 20,
    ageMax: 20,
    gender: '男',
    coreHook: '刺激钩',
    avatar: '/avatars/20m_game.png',
    lifeStage: '大学新鲜期：社交+游戏+数码兴趣抬头',
    emotion: '想赢 + 想被认可',
    hookRanking: ['刺激钩-游戏高能', '解压钩-猎奇', '欲望钩-数码装备'],
    trapPaths: ['高能刺激→停留→更强刺激→再看装备/技巧→继续刷'],
    videoPolicy: policy({
      allowed: ['刺激钩', '解压钩', '欲望钩', '焦虑钩'],
      prefer: ['游戏', '运动', '理财']
    })
  },

  // =========================================================
  // 21岁（3张）
  // =========================================================
  {
    id: 'p21_m_esports',
    name: '21岁男·游戏电竞派',
    ageMin: 21,
    ageMax: 21,
    gender: '男',
    coreHook: '刺激钩',
    avatar: '/avatars/21m_esports.png',
    lifeStage: '学习压力上来但想要快速刺激',
    emotion: '上头 + 胜负欲',
    hookRanking: ['刺激钩-游戏高能', '解压钩-猎奇', '欲望钩-致富神话'],
    trapPaths: ['高能→停留→更高能→沉迷→焦虑补刀→继续刷求补偿'],
    videoPolicy: policy({
      allowed: ['刺激钩', '解压钩', '欲望钩', '焦虑钩'],
      prefer: ['游戏', '运动', '理财']
    })
  },
  {
    id: 'p21_f_body_anxiety',
    name: '21岁女·身材焦虑派',
    ageMin: 21,
    ageMax: 21,
    gender: '女',
    coreHook: '欲望钩',
    avatar: '/avatars/21f_body.png',
    lifeStage: '开始在意“好看/瘦/氛围感”，社交展示增加',
    emotion: '怕不够好看 + 讨好型努力',
    hookRanking: ['欲望钩-外貌提升', '焦虑钩-健康恐惧', '情感钩-对比共鸣'],
    trapPaths: ['变美内容→对比→更想变美→身体焦虑→继续刷'],
    videoPolicy: policy({
      allowed: ['欲望钩', '焦虑钩', '情感钩', '解压钩'],
      prefer: ['美妆', '运动', '追星']
    })
  },
  {
    id: 'p21_m_study_switch',
    name: '21岁男·开始卷学派',
    ageMin: 21,
    ageMax: 21,
    gender: '男',
    coreHook: '焦虑钩',
    avatar: '/avatars/21m_study.png',
    lifeStage: '绩点/竞赛/保研信息开始影响选择',
    emotion: '怕掉队 + 需要确定性',
    hookRanking: ['焦虑钩-教育/效率', '焦虑钩-职业路径', '解压钩-猎奇'],
    trapPaths: ['效率焦虑→刷方法→更焦虑→继续刷→睡前补偿猎奇'],
    videoPolicy: policy({
      allowed: ['焦虑钩', '解压钩', '情感钩'],
      prefer: ['学习', '理财']
    })
  },

  // =========================================================
  // 22岁（3张）
  // =========================================================
  {
    id: 'p22_f_kaoyan',
    name: '22岁女·大四考研派',
    ageMin: 22,
    ageMax: 22,
    gender: '女',
    coreHook: '焦虑钩',
    avatar: '/avatars/22f_kaoyan.png',
    lifeStage: '大四备考，时间紧迫',
    emotion: '害怕失败 + 自我怀疑',
    hookRanking: ['焦虑钩-教育/考试', '解压钩-沉浸', '情感钩-共鸣'],
    trapPaths: ['焦虑→方法论→更焦虑→缓释→继续刷'],
    videoPolicy: policy({
      allowed: ['焦虑钩', '解压钩', '情感钩'],
      prefer: ['学习', '追星']
    })
  },
  {
    id: 'p22_f_chunzhao',
    name: '22岁女·大四春招派',
    ageMin: 22,
    ageMax: 22,
    gender: '女',
    coreHook: '焦虑钩',
    avatar: '/avatars/22f_job.png',
    lifeStage: '春招/实习转正压力',
    emotion: '害怕落后同龄人',
    hookRanking: ['焦虑钩-就业', '情感钩-对比', '解压钩-吃播补偿'],
    trapPaths: ['拒信→刷经验→更焦虑→吃播补偿→继续刷'],
    videoPolicy: policy({
      allowed: ['焦虑钩', '情感钩', '解压钩'],
      prefer: ['学习', '美妆']
    })
  },
  {
    id: 'p22_m_grad_pressure',
    name: '22岁男·毕业去向焦虑派',
    ageMin: 22,
    ageMax: 22,
    gender: '男',
    coreHook: '焦虑钩',
    avatar: '/avatars/22m_path.png',
    lifeStage: '毕业抉择：考研/就业/考公摇摆',
    emotion: '怕选错路 + 怕浪费一年',
    hookRanking: ['焦虑钩-职业路径', '焦虑钩-就业/面试', '解压钩-猎奇'],
    trapPaths: ['路径焦虑→刷比较→更焦虑→刷面试题→睡前猎奇补偿'],
    videoPolicy: policy({
      allowed: ['焦虑钩', '解压钩', '欲望钩'],
      prefer: ['学习', '理财', '游戏']
    })
  },

  // =========================================================
  // 23岁（3张）
  // =========================================================
  {
    id: 'p23_f_master_info_gap',
    name: '23岁女·研一信息差派',
    ageMin: 23,
    ageMax: 23,
    gender: '女',
    coreHook: '焦虑钩',
    avatar: '/avatars/23f_master.png',
    lifeStage: '研一：实习/方向选择，担心走错路',
    emotion: '信息差恐惧 + 不确定性',
    hookRanking: ['焦虑钩-职业路径', '焦虑钩-实习求职', '情感钩-对比'],
    trapPaths: ['信息焦虑→刷攻略→更焦虑→对比→继续刷'],
    videoPolicy: policy({
      allowed: ['焦虑钩', '情感钩', '解压钩', '欲望钩'],
      prefer: ['学习', '美妆']
    })
  },
  {
    id: 'p23_m_master_skills',
    name: '23岁男·研一技能焦虑派',
    ageMin: 23,
    ageMax: 23,
    gender: '男',
    coreHook: '焦虑钩',
    avatar: '/avatars/23m_skill.png',
    lifeStage: '研一：技能补齐窗口期，担心落后',
    emotion: '怕“能力不够” + 怕错过机会',
    hookRanking: ['焦虑钩-就业/技能', '焦虑钩-效率', '解压钩-猎奇'],
    trapPaths: ['技能焦虑→刷教程→更焦虑→再刷→深夜猎奇补偿'],
    videoPolicy: policy({
      allowed: ['焦虑钩', '解压钩', '欲望钩'],
      prefer: ['学习', '理财', '游戏']
    })
  },
  {
    id: 'p23_f_city_intern_life',
    name: '23岁女·外地实习生活派',
    ageMin: 23,
    ageMax: 23,
    gender: '女',
    coreHook: '焦虑钩',
    avatar: '/avatars/23f_city.png',
    lifeStage: '异地实习：通勤/租房/社交断层',
    emotion: '孤独 + 怕撑不下去',
    hookRanking: ['焦虑钩-城市生存', '情感钩-孤独共鸣', '解压钩-吃播'],
    trapPaths: ['城市疲惫→刷共鸣→更难受→吃播补偿→继续刷'],
    videoPolicy: policy({
      allowed: ['焦虑钩', '情感钩', '解压钩'],
      prefer: ['旅游', '美妆']
    })
  },

  // =========================================================
  // 24岁（3张）
  // =========================================================
  {
    id: 'p24_m_master_job',
    name: '24岁男·研二求职派',
    ageMin: 24,
    ageMax: 24,
    gender: '男',
    coreHook: '焦虑钩',
    avatar: '/avatars/24m_job.png',
    lifeStage: '研二：论文+实习+秋招三线压力',
    emotion: '时间不够 + 怕错过窗口期',
    hookRanking: ['焦虑钩-就业/秋招', '焦虑钩-效率', '解压钩-猎奇'],
    trapPaths: ['焦虑→刷方法→更焦虑→猎奇补偿→继续刷'],
    videoPolicy: policy({
      allowed: ['焦虑钩', '解压钩', '欲望钩'],
      prefer: ['学习', '理财']
    })
  },
  {
    id: 'p24_f_thesis_breakdown',
    name: '24岁女·研二论文崩溃派',
    ageMin: 24,
    ageMax: 24,
    gender: '女',
    coreHook: '焦虑钩',
    avatar: '/avatars/24f_thesis.png',
    lifeStage: '研二：论文/实验/导师压力叠加',
    emotion: '自我怀疑 + 害怕被否定',
    hookRanking: ['焦虑钩-教育/论文', '情感钩-共鸣倾诉', '解压钩-沉浸'],
    trapPaths: ['被否定→刷方法→更焦虑→共鸣→继续刷'],
    videoPolicy: policy({
      allowed: ['焦虑钩', '情感钩', '解压钩', '欲望钩'],
      prefer: ['学习', '美妆']
    })
  },
  {
    id: 'p24_m_city_rent',
    name: '24岁男·实习北漂通勤派',
    ageMin: 24,
    ageMax: 24,
    gender: '男',
    coreHook: '焦虑钩',
    avatar: '/avatars/24m_city.png',
    lifeStage: '实习/工作试水：租房+通勤+现金流',
    emotion: '疲惫 + 失控感',
    hookRanking: ['焦虑钩-城市生存', '焦虑钩-财务', '解压钩-吃播'],
    trapPaths: ['通勤疲惫→刷共鸣→更疲惫→吃播补偿→继续刷'],
    videoPolicy: policy({
      allowed: ['焦虑钩', '解压钩', '情感钩'],
      prefer: ['理财', '旅游']
    })
  },

  // =========================================================
  // 25岁（3张）
  // =========================================================
  {
    id: 'p25_f_newhire',
    name: '25岁女·研毕入职派',
    ageMin: 25,
    ageMax: 25,
    gender: '女',
    coreHook: '焦虑钩',
    avatar: '/avatars/25f_new.png',
    lifeStage: '研毕刚入职：适应期+绩效压力',
    emotion: '怕犯错 + 怕不被认可',
    hookRanking: ['焦虑钩-职场适应', '情感钩-同龄对比', '解压钩-治愈'],
    trapPaths: ['犯错恐惧→刷避坑→更怕→对比同龄→继续刷'],
    videoPolicy: policy({
      allowed: ['焦虑钩', '情感钩', '解压钩', '欲望钩'],
      prefer: ['美妆', '理财']
    })
  },
  {
    id: 'p25_m_newhire_perf',
    name: '25岁男·新人绩效派',
    ageMin: 25,
    ageMax: 25,
    gender: '男',
    coreHook: '焦虑钩',
    avatar: '/avatars/25m_perf.png',
    lifeStage: '刚入职：KPI/汇报/试用期压力',
    emotion: '怕被淘汰 + 需要掌控感',
    hookRanking: ['焦虑钩-职场适应', '焦虑钩-财务', '解压钩-猎奇'],
    trapPaths: ['绩效焦虑→刷话术→更焦虑→猎奇补偿→继续刷'],
    videoPolicy: policy({
      allowed: ['焦虑钩', '解压钩', '欲望钩'],
      prefer: ['理财', '游戏', '运动']
    })
  },
  {
    id: 'p25_f_city_single',
    name: '25岁女·大城市独居派',
    ageMin: 25,
    ageMax: 25,
    gender: '女',
    coreHook: '情感钩',
    avatar: '/avatars/25f_solo.png',
    lifeStage: '工作初期：独居/社交断层/情绪波动',
    emotion: '孤独 + 自我价值感不稳',
    hookRanking: ['情感钩-孤独共鸣', '焦虑钩-城市生存', '解压钩-治愈'],
    trapPaths: ['孤独→刷共鸣→更孤独→治愈补偿→继续刷'],
    videoPolicy: policy({
      allowed: ['情感钩', '焦虑钩', '解压钩', '欲望钩'],
      prefer: ['美妆', '旅游', '宠物']
    })
  }
];
