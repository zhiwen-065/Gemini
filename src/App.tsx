import React, { useMemo, useRef, useState } from 'react';
import { PERSONAS, type Gender, type Interest, type PersonaTemplate, type VideoItem } from './data/personas';
import { drawPersona } from './lib/drawPersona';

/** =========
 * 1) 兴趣视频“储备池”
 * - 每个兴趣：男/女各 5 条（你后续可以继续扩充）
 * - 用于：当 persona 没写 interestOverrides 时，仍能替换 1-2 条
 * ========= */
type InterestPool = Record<Interest, { 男: VideoItem[]; 女: VideoItem[] }>;

const INTEREST_POOL: InterestPool = {
  运动: {
    男: [
      v('sport_m_1', '🏋️ 增肌新手：这3个动作别乱练', '“练对比练狠更重要。”', '解压钩', '运动解压', '用“运动”包装成自我改善出口，减少退出但延长停留。', '/videos/interest/sport_m_1.png'),
      v('sport_m_2', '🥊 拳击入门：30秒燃起来', '“压力太大就打出来。”', '刺激钩', '挑战/冒险', '男性更偏好对抗/挑战型运动内容，点赞互动高。', '/videos/interest/sport_m_2.png'),
      v('sport_m_3', '🏃 夜跑vlog：把焦虑跑掉一点', '“至少我能控制呼吸。”', '解压钩', '沉浸体验', '情绪高压时给“可执行出口”，让人继续刷而不是退出。', '/videos/interest/sport_m_3.png'),
      v('sport_m_4', '🧘 拉伸放松：久坐救命', '“腰不疼了人也不烦了。”', '解压钩', '沉浸体验', '久坐/通勤人群会被“身体舒适”诱导停留与收藏。', '/videos/interest/sport_m_4.png'),
      v('sport_m_5', '⚽ 你能连续颠球多少个？', '“我不信你能忍住不试。”', '刺激钩', '挑战/冒险', '挑战类天然“我也要试”，促使连刷与互动。', '/videos/interest/sport_m_5.png')
    ],
    女: [
      v('sport_f_1', '💃 零基础舞蹈：跟练3分钟就出汗', '“今天先动起来。”', '解压钩', '沉浸体验', '女性运动内容更常与舞蹈/跟练绑定，完播率高。', '/videos/interest/sport_f_1.png'),
      v('sport_f_2', '🧘‍♀️ 体态改善：圆肩驼背救回来', '“显瘦的关键在体态。”', '欲望钩', '外貌提升', '运动兴趣常被转译成“体态=变美”，更容易收藏。', '/videos/interest/sport_f_2.png'),
      v('sport_f_3', '☯️ 太极入门：适合长期坚持的运动', '“练的是气血也是心态。”', '解压钩', '沉浸体验', '用“温和可坚持”降低门槛，增强停留。', '/videos/interest/sport_f_3.png'),
      v('sport_f_4', '🥋 跆拳道体验：女生也可以很帅', '“打出去那一下太爽。”', '刺激钩', '挑战/冒险', '把运动做成“爽感”，提升点赞与分享。', '/videos/interest/sport_f_4.png'),
      v('sport_f_5', '🏃‍♀️ 跑步前后这样做，膝盖更舒服', '“别硬跑。”', '焦虑钩', '健康恐惧', '用“伤害风险”制造不确定性，刺激收藏与复刷。', '/videos/interest/sport_f_5.png')
    ]
  },

  追星: {
    男: [
      v('idol_m_1', '🎤 现场直拍：这段状态太稳', '“我循环了十遍。”', '情感钩', '追星沉浸', '追星兴趣=高复刷内容，形成时间黑洞。', '/videos/interest/idol_m_1.png'),
      v('idol_m_2', '🧢 同款穿搭：一眼少年感', '“原来这么搭。”', '欲望钩', '外貌提升', '把追星转成“同款”，促进收藏与购买。', '/videos/interest/idol_m_2.png'),
      v('idol_m_3', '🎬 名场面混剪：一秒入坑', '“氛围感拉满。”', '情感钩', '沉浸体验', '混剪节奏强，适合连刷。', '/videos/interest/idol_m_3.png'),
      v('idol_m_4', '📣 饭圈热议：这次谁对谁错？', '“评论区要炸。”', '情感钩', '群体对立', '对立话题提升互动与停留。', '/videos/interest/idol_m_4.png'),
      v('idol_m_5', '✨ 应援制作：这样做更出片', '“成就感太强。”', '解压钩', '沉浸制作', '参与感内容延长使用时长。', '/videos/interest/idol_m_5.png')
    ],
    女: [
      v('idol_f_1', '✨ 直拍封神：这一秒我破防了', '“我真的要哭。”', '情感钩', '追星沉浸', '高复刷直拍+情绪波动，形成粘性。', '/videos/interest/idol_f_1.png'),
      v('idol_f_2', '📸 站姐修图：氛围感拉满', '“这就是生产力。”', '解压钩', '沉浸制作', '制作类内容带来参与感与时间消耗。', '/videos/interest/idol_f_2.png'),
      v('idol_f_3', '💄 追星妆：清透但很“会”', '“见面会必备。”', '欲望钩', '外貌提升', '同款妆容提升收藏与复刷。', '/videos/interest/idol_f_3.png'),
      v('idol_f_4', '📣 饭圈大瓜：你站谁？', '“吵翻了。”', '刺激钩', '冲突/对立', '冲突内容驱动评论对战。', '/videos/interest/idol_f_4.png'),
      v('idol_f_5', '🌙 粉丝故事：追光的人也会累', '“看完破防。”', '情感钩', '共鸣倾诉', '共鸣叙事让人停留与倾诉。', '/videos/interest/idol_f_5.png')
    ]
  },

  宠物: {
    男: [
      v('pet_m_1', '🐶 下班回家，它真的在等你', '“被治愈的一秒。”', '解压钩', '治愈日常', '用治愈替代退出，延长使用。', '/videos/interest/pet_m_1.png'),
      v('pet_m_2', '🐱 猫咪奇怪行为大揭秘', '“原来它在想这个？”', '解压钩', '猎奇好奇', '好奇心让人连刷同类解释。', '/videos/interest/pet_m_2.png'),
      v('pet_m_3', '🧼 养宠必备：这3个坑别踩', '“新手一定要看。”', '焦虑钩', '责任焦虑', '责任焦虑驱动收藏与复刷。', '/videos/interest/pet_m_3.png'),
      v('pet_m_4', '🐕 训犬：一个口令就有效', '“原来这么简单。”', '解压钩', '方法论', '方法论带来“可控感”，增强粘性。', '/videos/interest/pet_m_4.png'),
      v('pet_m_5', '🦜 这只鸟太会整活了', '“笑出声。”', '解压钩', '轻松搞笑', '情绪补偿型内容让人继续刷。', '/videos/interest/pet_m_5.png')
    ],
    女: [
      v('pet_f_1', '🐶 它一叫我就心软了', '“我真的不行了。”', '解压钩', '治愈日常', '治愈系更易触发收藏与分享。', '/videos/interest/pet_f_1.png'),
      v('pet_f_2', '🐾 养宠花销清单：真的会越养越贵', '“我不敢算。”', '焦虑钩', '责任焦虑', '把可爱转成花销焦虑，形成闭环。', '/videos/interest/pet_f_2.png'),
      v('pet_f_3', '🐱 猫咪陪睡vlog：今天不焦虑了', '“它就是我的药。”', '解压钩', '沉浸体验', '沉浸式日常拉长停留。', '/videos/interest/pet_f_3.png'),
      v('pet_f_4', '🧴 宠物清洁：这样做不伤皮肤', '“别乱洗。”', '焦虑钩', '健康恐惧', '用“风险”刺激收藏。', '/videos/interest/pet_f_4.png'),
      v('pet_f_5', '🐶 “它懂我”瞬间合集', '“我哭了。”', '情感钩', '共鸣', '情感共鸣增强粘性。', '/videos/interest/pet_f_5.png')
    ]
  },

  旅游: {
    男: [
      v('travel_m_1', '🧳 低预算城市周末：说走就走', '“别等有空才出发。”', '解压钩', '旅行治愈', '用“逃离感”替代退出。', '/videos/interest/travel_m_1.png'),
      v('travel_m_2', '🏞️ 徒步入门：这条路线新手友好', '“爬完爽。”', '刺激钩', '挑战/冒险', '挑战与风景组合更易点赞。', '/videos/interest/travel_m_2.png'),
      v('travel_m_3', '🚗 自驾避坑：这点没做会崩', '“血泪教训。”', '焦虑钩', '风险恐惧', '“避坑”结构促进收藏。', '/videos/interest/travel_m_3.png'),
      v('travel_m_4', '🍢 旅行必吃：这家真的别错过', '“看饿了。”', '解压钩', '吃播/美食', '旅行美食内容完播强。', '/videos/interest/travel_m_4.png'),
      v('travel_m_5', '📸 拍照构图：一学就会', '“原来这么拍。”', '解压钩', '教程', '教程类易复刷。', '/videos/interest/travel_m_5.png')
    ],
    女: [
      v('travel_f_1', '🧳 女生独旅：安全清单别忘了', '“看完安心了。”', '焦虑钩', '安全恐惧', '用安全焦虑制造停留与收藏。', '/videos/interest/travel_f_1.png'),
      v('travel_f_2', '🌊 海边vlog：这一秒像重启', '“我活过来了。”', '解压钩', '旅行治愈', '治愈型内容延长时长。', '/videos/interest/travel_f_2.png'),
      v('travel_f_3', '📸 氛围感拍照：这样站就很出片', '“别再尴尬摆拍。”', '欲望钩', '外貌提升', '用“出片”绑定自我呈现欲。', '/videos/interest/travel_f_3.png'),
      v('travel_f_4', '🍰 旅行甜品地图：这家必须去', '“我立刻收藏。”', '解压钩', '吃播/美食', '收藏驱动复刷。', '/videos/interest/travel_f_4.png'),
      v('travel_f_5', '🗺️ 轻松行程：不赶路也不浪费', '“这才叫旅行。”', '解压钩', '教程', '可执行攻略提升停留。', '/videos/interest/travel_f_5.png')
    ]
  },

  理财: {
    男: [
      v('fin_m_1', '📉 现金流断了怎么办？先做这3步', '“别先崩。”', '焦虑钩', '财务焦虑', '财务不确定性会强烈驱动停留与收藏。', '/videos/interest/fin_m_1.png'),
      v('fin_m_2', '💳 信用卡/网贷：这坑别踩', '“越滚越大。”', '焦虑钩', '债务恐惧', '债务恐惧刺激自查与复刷。', '/videos/interest/fin_m_2.png'),
      v('fin_m_3', '🧾 30天记账：钱到底去哪了？', '“我不敢看。”', '焦虑钩', '失控感', '让你“回到自己身上”，更容易沉浸。', '/videos/interest/fin_m_3.png'),
      v('fin_m_4', '📌 买基金前先搞懂这件事', '“别当韭菜。”', '焦虑钩', '风险恐惧', '风险叙事增强停留。', '/videos/interest/fin_m_4.png'),
      v('fin_m_5', '💡 低成本理财：先把这步做好', '“不求暴富求不慌。”', '解压钩', '稳定感', '用稳定感当情绪托底，增强粘性。', '/videos/interest/fin_m_5.png')
    ],
    女: [
      v('fin_f_1', '📉 月光族自救：这步先做', '“不敢再乱花了。”', '焦虑钩', '财务焦虑', '消费→焦虑→补救→继续刷形成闭环。', '/videos/interest/fin_f_1.png'),
      v('fin_f_2', '🧾 记账模板：一键看懂消费黑洞', '“我原来花在这…”', '焦虑钩', '失控感', '模板类内容高收藏复刷。', '/videos/interest/fin_f_2.png'),
      v('fin_f_3', '💡 攒钱挑战：30天可视化进度', '“看着数字变大很爽。”', '刺激钩', '挑战/冒险', '挑战机制驱动每日回访。', '/videos/interest/fin_f_3.png'),
      v('fin_f_4', '📌 投资前：先把风险写在纸上', '“别靠运气。”', '焦虑钩', '风险恐惧', '风险恐惧增强停留。', '/videos/interest/fin_f_4.png'),
      v('fin_f_5', '🛍️ “精致省钱”：怎么买才不焦虑', '“我只是不想亏。”', '欲望钩', '品质/占便宜', '把理财转成“更会买”，更贴现实。',
        '/videos/interest/fin_f_5.png'
      )
    ]
  },

  游戏: {
    男: [
      v('game_m_1', '🎮 今日高光：这波反应太离谱', '“太顶了。”', '刺激钩', '游戏高能', '游戏高光剪辑完播高。', '/videos/interest/game_m_1.png'),
      v('game_m_2', '⚡ 段位挑战：你敢打吗？', '“失败一次就上头。”', '刺激钩', '挑战/冒险', '挑战叙事驱动连刷。', '/videos/interest/game_m_2.png'),
      v('game_m_3', '🖱️ 外设推荐：提升手感的关键', '“装备党狂喜。”', '欲望钩', '装备欲望', '种草促进收藏与购买。', '/videos/interest/game_m_3.png'),
      v('game_m_4', '😵 熬夜打排位的代价', '“别等身体报警。”', '焦虑钩', '健康恐惧', '在刺激流里插焦虑，形成闭环。', '/videos/interest/game_m_4.png'),
      v('game_m_5', '🕵️ 游戏圈大瓜：真相是…', '“评论区吵翻。”', '解压钩', '猎奇好奇', '好奇心驱动连刷。', '/videos/interest/game_m_5.png')
    ],
    女: [
      v('game_f_1', '🎮 女生也能上分：这套思路太好用', '“原来不是我菜。”', '解压钩', '方法论', '方法论带来可控感，促进收藏。', '/videos/interest/game_f_1.png'),
      v('game_f_2', '✨ 游戏皮肤测评：这套太好看了', '“狠狠爱住。”', '欲望钩', '外观欲望', '外观与审美提升停留。', '/videos/interest/game_f_2.png'),
      v('game_f_3', '⚡ 上分挑战：今天必须赢回来', '“我不信我不行。”', '刺激钩', '挑战/冒险', '挑战驱动连刷。', '/videos/interest/game_f_3.png'),
      v('game_f_4', '🧠 游戏思维：为什么你总输在这', '“懂了。”', '焦虑钩', '自我怀疑', '用“你做错了”制造不确定性。', '/videos/interest/game_f_4.png'),
      v('game_f_5', '🕵️ 游戏圈奇闻：你绝对想不到', '“太离谱了。”', '解压钩', '猎奇好奇', '猎奇反转促进停留。', '/videos/interest/game_f_5.png')
    ]
  },

  学习: {
    男: [
      v('study_m_1', '📚 3天速成：别再假努力', '“立刻能用。”', '焦虑钩', '教育/考试', '速成承诺驱动收藏与复刷。', '/videos/interest/study_m_1.png'),
      v('study_m_2', '🧠 记忆法：背不下来是方法错了', '“原来如此。”', '焦虑钩', '效率焦虑', '“你做错了”制造不确定性，促使复刷。', '/videos/interest/study_m_2.png'),
      v('study_m_3', '⏱️ 番茄钟：用这套就能专注', '“今天不摆烂。”', '解压钩', '方法论', '可执行工具提高粘性。', '/videos/interest/study_m_3.png'),
      v('study_m_4', '📌 面试/简历：这点不写就亏了', '“我后悔没早看。”', '焦虑钩', '就业/面试', '就业焦虑促进收藏。', '/videos/interest/study_m_4.png'),
      v('study_m_5', '😵 熬夜学习反而更差？', '“我被说中了。”', '焦虑钩', '健康恐惧', '健康恐惧作为补刀增强停留。', '/videos/interest/study_m_5.png')
    ],
    女: [
      v('study_f_1', '📚 学习vlog：我这样逼自己不崩', '“先稳住。”', '解压钩', '沉浸体验', '学习沉浸内容更适合长时停留。', '/videos/interest/study_f_1.png'),
      v('study_f_2', '🧠 复习计划：这样排不焦虑', '“一看就会。”', '焦虑钩', '教育/考试', '计划=确定性，促使收藏。', '/videos/interest/study_f_2.png'),
      v('study_f_3', '⏱️ 拖延自救：这招太狠', '“立刻能做。”', '焦虑钩', '效率焦虑', '效率焦虑驱动复刷。', '/videos/interest/study_f_3.png'),
      v('study_f_4', '📌 论文/作业：老师最吃这一套', '“我懂了。”', '焦虑钩', '教育/考试', '技巧类高收藏。', '/videos/interest/study_f_4.png'),
      v('study_f_5', '🫧 白噪音：把心稳住再学习', '“别崩。”', '解压钩', '沉浸体验', '缓释内容延长刷屏。',
        '/videos/interest/study_f_5.png'
      )
    ]
  },

  美妆: {
    男: [
      v('beauty_m_1', '🧴 男士护肤：这一步别省', '“你看起来会更精神。”', '欲望钩', '外貌提升', '用“更精神/更体面”触发自我呈现欲。', '/videos/interest/beauty_m_1.png'),
      v('beauty_m_2', '💇 发型避坑：剪完立刻变帅', '“关键是这句沟通。”', '欲望钩', '外貌提升', '可执行建议促收藏。', '/videos/interest/beauty_m_2.png'),
      v('beauty_m_3', '👔 穿搭：这样搭不显油腻', '“一看就会。”', '欲望钩', '外貌提升', '穿搭内容强收藏。', '/videos/interest/beauty_m_3.png'),
      v('beauty_m_4', '⚠️ 你脸出油不是“天生”', '“先自查这点。”', '焦虑钩', '健康恐惧', '用“问题化”增强停留。', '/videos/interest/beauty_m_4.png'),
      v('beauty_m_5', '🧼 清洁误区：越洗越糟', '“我被说中了。”', '焦虑钩', '健康恐惧', '误区类促复刷。', '/videos/interest/beauty_m_5.png')
    ],
    女: [
      v('beauty_f_1', '💄 显贵妆：10分钟变高级', '“这步别省。”', '欲望钩', '外貌提升', '教程类收藏复刷强。', '/videos/interest/beauty_f_1.png'),
      v('beauty_f_2', '✨ 气色伪素颜：越看越像天生好看', '“太适合上课/上班。”', '欲望钩', '外貌提升', '低成本提升更贴现实。', '/videos/interest/beauty_f_2.png'),
      v('beauty_f_3', '🧴 护肤：这类产品别乱叠', '“越叠越烂脸。”', '焦虑钩', '健康恐惧', '烂脸恐惧驱动停留与收藏。', '/videos/interest/beauty_f_3.png'),
      v('beauty_f_4', '👗 穿搭：这样穿显瘦显高', '“拍照绝了。”', '欲望钩', '外貌提升', '出片欲增强收藏。', '/videos/interest/beauty_f_4.png'),
      v('beauty_f_5', '⚠️ 爆痘不是上火：先排查这点', '“看完立刻想自查。”', '焦虑钩', '健康恐惧', '自查行为让你继续刷相关内容。', '/videos/interest/beauty_f_5.png')
    ]
  }
};

// -------- 工具：快速造 VideoItem --------
function v(
  id: string,
  title: string,
  caption: string,
  hookCategory: string,
  hookSubCategory: string,
  pushLogic: string,
  image?: string
): VideoItem {
  return { id, title, caption, hookCategory, hookSubCategory, pushLogic, image };
}

// 稳定随机（同一 persona + interest + index 会一致）
function hashSeed(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// -------- 2) 应用“兴趣替换 1–2 条” --------
function applyInterests(params: {
  persona: PersonaTemplate;
  gender: Gender;
  interests: Interest[];
}): VideoItem[] {
  const { persona, gender, interests } = params;
  const base = persona.baseVideos.map((x) => ({ ...x }));

  if (!interests.length) return base;

  // 我们最多替换 2 条（你说的 1-2 条）
  // 优先替换 index=3、4（通常是“出口/补偿位”，不会破坏主线钩子）
  const targetSlots = [3, 4];

  // 稳定：同 persona + interests 组合，替换结果保持一致
  const seed = hashSeed(`${persona.id}:${gender}:${interests.join('|')}`);
  const rng = mulberry32(seed);

  // 选 1 或 2 条：用随机但稳定
  const replaceCount = interests.length === 1 ? 1 : (rng() < 0.65 ? 2 : 1);

  // 从用户选的兴趣里，挑 replaceCount 个（稳定乱序）
  const picked = [...interests].sort(() => rng() - 0.5).slice(0, replaceCount);

  picked.forEach((interest, i) => {
    const slot = targetSlots[i] ?? targetSlots[targetSlots.length - 1];

    // (A) persona 自己写了 interestOverrides：最高优先
    const ov = persona.interestOverrides?.[interest]?.replace;
    if (ov && ov.length) {
      // 如果 persona 覆盖里指定了 index，就按它来；否则用我们的 slot
      const chosen = ov[Math.floor(rng() * ov.length)];
      const index = typeof chosen.index === 'number' ? chosen.index : slot;
      base[index] = { ...chosen.video, id: `${persona.id}:${interest}:${chosen.video.id}` };
      return;
    }

    // (B) fallback：全局兴趣池（每个兴趣 5 条，男女不同）
    const pool = INTEREST_POOL[interest]?.[gender === '男' ? '男' : '女'];
    if (!pool || !pool.length) return;

    const pickedVideo = pool[Math.floor(rng() * pool.length)];
    base[slot] = { ...pickedVideo, id: `${persona.id}:${interest}:${pickedVideo.id}` };
  });

  return base;
}

// -------- 3) UI 小工具 --------
function randomBg(seed: string) {
  const n = Array.from(seed).reduce((a, c) => a + c.charCodeAt(0), 0);
  const h1 = n % 360;
  const h2 = (h1 + 40 + (n % 70)) % 360;
  return `linear-gradient(135deg, hsla(${h1}, 90%, 55%, 0.45), hsla(${h2}, 90%, 55%, 0.10))`;
}

type Step = 'welcome' | 'setup' | 'feed';

type SessionPersona = {
  template: PersonaTemplate;
  videos: VideoItem[];
  interests: Interest[];
};

const ALL_INTERESTS: Interest[] = ['运动', '追星', '宠物', '旅游', '理财', '游戏', '学习', '美妆'];

export default function App() {
  const [step, setStep] = useState<Step>('welcome');

  const [gender, setGender] = useState<Gender>('女');
  const [age, setAge] = useState<number>(22);
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);

  const [session, setSession] = useState<SessionPersona | null>(null);
  const [revealedLogicId, setRevealedLogicId] = useState<string | null>(null);

  const feedRef = useRef<HTMLDivElement>(null);

  const personaCardTitle = useMemo(() => {
    if (!session) return '';
    // 初始不展示 lifeStage / emotion 等“困境词”
    // 这里只显示一个“卡牌名”
    return session.template.name;
  }, [session]);

  const startFeed = (opts?: { forceRedraw?: boolean }) => {
    const chosen = drawPersona({
      age,
      gender,
      templates: PERSONAS,
      forceRedraw: !!opts?.forceRedraw
    });

    if (!chosen) {
      alert('没有找到匹配的人物卡（请检查 PERSONAS 年龄覆盖）。');
      return;
    }

    const videos = applyInterests({
      persona: chosen,
      gender,
      interests: selectedInterests
    });

    setSession({
      template: chosen,
      videos,
      interests: selectedInterests
    });
    setRevealedLogicId(null);
    setStep('feed');
  };

  const toggleInterest = (x: Interest) => {
    setSelectedInterests((prev) => {
      const has = prev.includes(x);
      if (has) return prev.filter((t) => t !== x);
      // 你也可以限制最多选2个（更贴现实），这里先允许多选，但最终只替换1-2条
      return [...prev, x];
    });
  };

  const handleScroll = (dir: 'up' | 'down') => {
    if (!feedRef.current) return;
    const h = feedRef.current.clientHeight;
    feedRef.current.scrollBy({ top: dir === 'down' ? h : -h, behavior: 'smooth' });
  };

  return (
    <div style={{ height: '100vh', background: '#000', color: 'rgba(255,255,255,0.92)', overflow: 'hidden' }}>
      {/* ====== Welcome ====== */}
      {step === 'welcome' && (
        <div style={{ height: '100%', display: 'grid', placeItems: 'center', padding: 22 }}>
          <div style={{ width: 'min(520px, 92vw)' }}>
            <div style={{ fontSize: 84, fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.05em', lineHeight: 0.95 }}>
              ALGO
            </div>
            <div style={{ marginTop: 6, fontSize: 11, letterSpacing: '0.7em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontWeight: 800 }}>
              Short-Video Simulator
            </div>

            <div style={{ marginTop: 18, color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.7 }}>
              你只需要输入「年龄 + 性别」，系统会<strong>抽一张人物牌</strong>，然后从这个人物的视角开始刷短视频。
              <br />
              可选兴趣会在 5 条里“插入 1–2 条”，让你更容易相信：<em>“这就是我爱看的”</em>。
            </div>

            <button
              onClick={() => setStep('setup')}
              style={btnPrimary({ width: 240, marginTop: 20 })}
            >
              开始设定
            </button>
          </div>
        </div>
      )}

      {/* ====== Setup ====== */}
      {step === 'setup' && (
        <div style={{ height: '100%', display: 'grid', placeItems: 'center', padding: 18 }}>
          <div style={glass({ width: 'min(640px, 94vw)', borderRadius: 28, padding: 18 })}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ fontSize: 20, fontWeight: 900, fontStyle: 'italic' }}>初始化设定</div>
              <button onClick={() => setStep('welcome')} style={btnGhost()}>返回</button>
            </div>

            {/* gender */}
            <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
              {(['男', '女'] as Gender[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  style={{
                    ...btn(),
                    flex: 1,
                    background: gender === g ? 'rgba(239,68,68,0.85)' : 'rgba(255,255,255,0.06)',
                    border: gender === g ? '1px solid rgba(239,68,68,0.9)' : '1px solid rgba(255,255,255,0.10)',
                    color: gender === g ? '#fff' : 'rgba(255,255,255,0.75)',
                    fontWeight: 900,
                    letterSpacing: '0.2em'
                  }}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* age */}
            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                年龄
                <span style={{ color: '#ef4444', fontStyle: 'italic', fontSize: 18, letterSpacing: 0 }}>{age}</span>
              </div>
              <input
                type="range"
                min={15}
                max={75}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                style={{ width: '100%', marginTop: 10 }}
              />
              <div style={{ marginTop: 6, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                只输入年龄与性别，系统会随机抽到一个“同龄不同命运”的人物卡。
              </div>
            </div>

            {/* interests */}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>
                可选兴趣（多选）
              </div>

              <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {ALL_INTERESTS.map((x) => {
                  const active = selectedInterests.includes(x);
                  return (
                    <button
                      key={x}
                      onClick={() => toggleInterest(x)}
                      style={{
                        ...pill(),
                        background: active ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.06)',
                        border: active ? '1px solid rgba(239,68,68,0.45)' : '1px solid rgba(255,255,255,0.10)',
                        color: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.70)',
                        fontWeight: 800
                      }}
                    >
                      {active ? '✓ ' : ''}
                      {x}
                    </button>
                  );
                })}
              </div>

              <div style={{ marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
                你选的兴趣不会决定主线钩子，只会在 5 条里替换 1–2 条，让推荐看起来更“懂你”。
              </div>
            </div>

            <div style={{ marginTop: 16, display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button onClick={() => { setSelectedInterests([]); }} style={btnGhost()}>
                清空兴趣
              </button>

              <button onClick={() => startFeed()} style={btnPrimary()}>
                抽卡并开始刷
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== Feed ====== */}
      {step === 'feed' && session && (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* header */}
          <div
            style={{
              padding: '12px 14px 10px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(14px)',
              position: 'relative',
              zIndex: 10
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, fontStyle: 'italic' }}>ALGO</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
                  视角：<span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 800 }}>{personaCardTitle}</span>
                  <span style={{ marginLeft: 8, opacity: 0.6 }}>{age}岁 · {gender}</span>
                  {session.interests.length > 0 && (
                    <span style={{ marginLeft: 10, opacity: 0.6 }}>
                      兴趣：{session.interests.join(' / ')}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => startFeed({ forceRedraw: true })}
                  style={btnGhost()}
                  title="换一个同龄不同命运的人设"
                >
                  🔄 重抽人物
                </button>
                <button
                  onClick={() => setStep('setup')}
                  style={btnGhost()}
                >
                  改设定
                </button>
              </div>
            </div>
          </div>

          {/* feed */}
          <div ref={feedRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', scrollSnapType: 'y mandatory' }}>
            {session.videos.map((vid, i) => (
              <section
                key={vid.id}
                style={{
                  height: 'calc(100vh - 78px)',
                  scrollSnapAlign: 'start',
                  position: 'relative',
                  background: vid.image
                    ? `linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.92)), url(${vid.image}) center/cover no-repeat`
                    : randomBg(vid.id),
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: 16
                }}
              >
                {/* bottom shade */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.08), rgba(0,0,0,0.94))' }} />

                {/* main text */}
                <div style={{ position: 'relative', zIndex: 2, maxWidth: 640, paddingBottom: 40 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                    <span style={badge()}>ALGO-{i + 1}</span>
                    <span style={pillSmall()}>#{vid.hookSubCategory}</span>
                  </div>

                  <div style={{ fontSize: 40, fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.04em', lineHeight: 1.02 }}>
                    {vid.title}
                  </div>
                  <div style={{ marginTop: 10, fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.88)', fontWeight: 600 }}>
                    {vid.caption}
                  </div>
                </div>

                {/* side buttons */}
                <div style={{ position: 'absolute', right: 12, bottom: 72, zIndex: 3, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {['❤️', '💬', '⭐'].map((x) => (
                    <div key={x} style={circleBtn()}>{x}</div>
                  ))}

                  <button
                    onClick={() => setRevealedLogicId(revealedLogicId === vid.id ? null : vid.id)}
                    style={{
                      ...circleBtn(),
                      cursor: 'pointer',
                      border: revealedLogicId === vid.id ? '1px solid rgba(239,68,68,0.85)' : '1px solid rgba(255,255,255,0.10)',
                      background: revealedLogicId === vid.id ? 'rgba(239,68,68,0.78)' : 'rgba(255,255,255,0.06)'
                    }}
                    title="为什么推给你"
                  >
                    🧠
                  </button>
                </div>

                {/* up/down */}
                <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 3, display: 'flex', flexDirection: 'column', gap: 8, opacity: 0.55 }}>
                  <button style={miniCircle()} onClick={() => handleScroll('up')}>▲</button>
                  <button style={miniCircle()} onClick={() => handleScroll('down')}>▼</button>
                </div>

                {/* logic overlay */}
                {revealedLogicId === vid.id && (
                  <div
                    onClick={() => setRevealedLogicId(null)}
                    style={{
                      ...glass({}),
                      position: 'absolute',
                      left: 14,
                      right: 76,
                      bottom: 140,
                      zIndex: 4,
                      padding: 14,
                      borderRadius: 20,
                      border: '1px solid rgba(239,68,68,0.25)',
                      boxShadow: '0 0 40px rgba(239,68,68,0.12)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 99, background: 'rgba(239,68,68,0.95)' }} />
                      <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#ef4444' }}>
                        WHY YOU SEE THIS
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                      <span style={pillTiny()}>{vid.hookCategory}</span>
                      <span style={pillTiny()}>#{vid.hookSubCategory}</span>
                    </div>

                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.90)', lineHeight: 1.6, fontStyle: 'italic' }}>
                      “{vid.pushLogic}”
                    </div>

                    <div style={{ marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                      提醒：你看到的不是“你有问题”，而是“内容在用钩子抓你的注意力”。你不需要恐慌。
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      )}

      {/* ====== global styles (range) ====== */}
      <style>{`
        input[type=range] { appearance: none; background: #27272a; height: 4px; border-radius: 2px; }
        input[type=range]::-webkit-slider-thumb { appearance: none; height: 16px; width: 16px; border-radius: 50%; background: #ef4444; cursor: pointer; }
      `}</style>
    </div>
  );
}

/** ====== UI helpers ====== */
function glass(extra: React.CSSProperties) {
  return {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    backdropFilter: 'blur(14px)',
    ...extra
  };
}

function btn(): React.CSSProperties {
  return {
    padding: '12px 14px',
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.85)',
    cursor: 'pointer'
  };
}

function btnPrimary(extra: React.CSSProperties = {}): React.CSSProperties {
  return {
    ...btn(),
    background: 'rgba(239,68,68,0.88)',
    border: '1px solid rgba(239,68,68,0.95)',
    color: '#fff',
    fontWeight: 900,
    letterSpacing: '0.12em',
    padding: '14px 16px',
    ...extra
  };
}

function btnGhost(): React.CSSProperties {
  return {
    ...btn(),
    background: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.78)',
    fontSize: 12,
    fontWeight: 800
  };
}

function pill(): React.CSSProperties {
  return {
    padding: '10px 12px',
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'rgba(255,255,255,0.06)',
    cursor: 'pointer',
    fontSize: 13
  };
}

function pillSmall(): React.CSSProperties {
  return {
    padding: '6px 10px',
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(0,0,0,0.35)',
    fontSize: 12,
    color: 'rgba(255,255,255,0.78)',
    fontWeight: 800
  };
}

function pillTiny(): React.CSSProperties {
  return {
    padding: '4px 8px',
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    fontSize: 11,
    color: 'rgba(255,255,255,0.78)',
    fontWeight: 800
  };
}

function badge(): React.CSSProperties {
  return {
    fontSize: 11,
    fontWeight: 900,
    fontStyle: 'italic',
    background: 'rgba(239,68,68,0.90)',
    border: '1px solid rgba(239,68,68,0.95)',
    padding: '4px 8px',
    borderRadius: 10
  };
}

function circleBtn(): React.CSSProperties {
  return {
    width: 48,
    height: 48,
    borderRadius: 999,
    display: 'grid',
    placeItems: 'center',
    fontSize: 20,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.10)',
    backdropFilter: 'blur(10px)'
  };
}

function miniCircle(): React.CSSProperties {
  return {
    width: 34,
    height: 34,
    borderRadius: 999,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.10)',
    color: 'rgba(255,255,255,0.85)',
    cursor: 'pointer'
  };
}
