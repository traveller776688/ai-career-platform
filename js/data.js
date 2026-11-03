/* ============================================================
 * AI 专业生涯规划 — 静态数据中心 (data.js)
 * 全部职业/题库/行情/路线图/技能树/资源数据集中在此
 * ============================================================ */
'use strict';

const DATA = {

  /* ---------- 测评维度 ---------- */
  dims: [
    { id: 'theory', name: '理论功底', icon: '📐', desc: '数学、算法与底层原理的钻研深度' },
    { id: 'eng',    name: '工程能力', icon: '⚙️', desc: '写代码、搭系统、把想法落地的能力' },
    { id: 'data',   name: '数据直觉', icon: '📊', desc: '从数据中发现问题、挖掘洞察的敏感度' },
    { id: 'creat',  name: '研究创新', icon: '💡', desc: '探索未知、提出新方法、发论文的潜质' },
    { id: 'comm',   name: '沟通表达', icon: '🗣️', desc: '讲清楚复杂问题、协作与影响他人' },
    { id: 'biz',    name: '商业思维', icon: '🏙️', desc: '理解用户需求、商业模式与市场' }
  ],

  /* ---------- 职业库（13个AI相关职业） ---------- */
  /* profile 各维度 0-10；salary 单位：万元/年总包（一线城市参考）；needDegree: 1=本科可入 2=硕士优先 3=博士门槛 */
  careers: [
    {
      id: 'ml', name: '算法工程师', en: 'ML Engineer', icon: '🧠',
      tagline: 'AI 岗位的绝对主力,把模型变成产品',
      desc: '负责搜索推荐、风控、CV/NLP 等业务场景的模型开发与优化,是互联网大厂 HC 最多的 AI 岗位。要求扎实的机器学习功底 + 过硬的数据结构与代码能力,是多数 AI 专业学生的第一选择。',
      profile: { theory: 3, eng: 5, data: 4, creat: 3, comm: 2, biz: 2 },
      salary: { bsc: [18, 30], msc: [28, 55], phd: [45, 90] },
      needDegree: 2, demand: 88, growth: 80,
      suggest: {
        bsc: '本科 + 竞赛/强项目可冲中小厂算法岗',
        msc: '主流路径：名校硕士 + 大厂实习是标配',
        phd: '博士冲头部大厂核心算法/研究岗'
      },
      tips: [
        { stage: 'b3', text: '数学建模竞赛对算法岗简历加成明显,大二就值得认真参加' },
        { stage: 'b5', text: '专精方向推荐搜广推/风控/大模型算法,这三类 HC 最多' },
        { stage: 'b6', text: '暑期实习前刷完《剑指Offer》+ LeetCode 高频 300 题,笔试基本稳' },
        { stage: 'b7', text: '秋招算法岗 = 手撕代码 + 八股 + 项目深挖,提前 3 个月系统准备' }
      ]
    },
    {
      id: 'llm', name: '大模型应用工程师', en: 'LLM App Engineer', icon: '🤖',
      tagline: '当前最火的赛道,把大模型用出花来',
      desc: '基于大语言模型开发 Agent、RAG 检索增强、智能助手等应用,是 2025 年以来增长最猛的岗位。门槛相对友好:不需要发明模型,但要懂模型边界、会 Prompt/微调/部署,能快速交付可用产品。',
      profile: { theory: 2, eng: 4, data: 2, creat: 4, comm: 2, biz: 3 },
      salary: { bsc: [20, 35], msc: [30, 60], phd: [50, 100] },
      needDegree: 2, demand: 96, growth: 98,
      suggest: {
        bsc: '动手能力强 + 有可演示项目即可入场',
        msc: '应用爆发期,硕士性价比很高',
        phd: '前沿 Agent/多智能体方向值得深耕'
      },
      tips: [
        { stage: 'b3', text: '大一下学期即可用 API 做聊天机器人玩具,积累可视化作品' },
        { stage: 'b5', text: '动手做 Agent/RAG 项目,自己部署一个 AI 应用比任何证书都管用' },
        { stage: 'b7', text: '大模型应用岗笔试重工程实践,准备 1-2 个可演示的完整项目' }
      ]
    },
    {
      id: 'ds', name: '数据科学家', en: 'Data Scientist', icon: '📈',
      tagline: '用数据讲故事,用统计做决策',
      desc: '通过统计建模、实验设计与业务分析驱动增长与决策,在电商、金融、互联网公司需求稳定。需要极强的数据直觉与业务理解,沟通能力同样重要——你的结论要能说服业务方。',
      profile: { theory: 3, eng: 3, data: 5, creat: 3, comm: 3, biz: 3 },
      salary: { bsc: [20, 32], msc: [30, 50], phd: [50, 90] },
      needDegree: 2, demand: 78, growth: 68,
      suggest: {
        bsc: '从数据分析实习起步,业务感比学历重要',
        msc: '统计学/CS 硕士是主流配置',
        phd: '因果推断/科学计算等高端岗位需要'
      },
      tips: [
        { stage: 'b3', text: '数模/统计类竞赛是数据科学对口比赛,认真打一次' },
        { stage: 'b5', text: 'SQL 刷到极致 + AB 实验方法论,是数据科学面试的核心' },
        { stage: 'b6', text: '数据分析实习门槛较低,大一暑假即可开始,尽早积累业务感' }
      ]
    },
    {
      id: 'nlp', name: 'NLP 工程师', en: 'NLP Engineer', icon: '💬',
      tagline: '让机器理解语言,大模型时代的排头兵',
      desc: '专注文本理解与生成,从搜索引擎、智能客服到大模型训练对齐。大模型兴起后 NLP 边界大幅扩展,岗位向"大模型算法"融合,要求理论功底扎实,对 Transformer 系结构如数家珍。',
      profile: { theory: 4, eng: 4, data: 3, creat: 3, comm: 2, biz: 2 },
      salary: { bsc: [18, 30], msc: [30, 55], phd: [45, 90] },
      needDegree: 2, demand: 74, growth: 70,
      suggest: {
        bsc: '纯 NLP 岗 HC 少,建议读硕',
        msc: 'NLP 并入大模型方向,硕士是主流',
        phd: '多模态/对齐等前沿岗位欢迎博士'
      },
      tips: [
        { stage: 'b4', text: '大三前完成 NLP 经典任务实战:文本分类/序列标注/机器翻译' },
        { stage: 'b5', text: '精读 Transformer/BERT/GPT 经典论文并复现,面试必问' },
        { stage: 'b7', text: '大模型方向 NLP 岗要求微调/对齐经验,毕业设计选相关课题' }
      ]
    },
    {
      id: 'cv', name: '计算机视觉工程师', en: 'CV Engineer', icon: '👁️',
      tagline: '让机器看懂世界,落地场景最丰富',
      desc: '覆盖图像分类、检测、分割、生成,落地于安防、医疗影像、工业质检、自动驾驶等场景。CV 是 AI 最成熟的领域之一,竞争也最激烈,项目实战与顶会论文至少要占一样。',
      profile: { theory: 4, eng: 4, data: 3, creat: 3, comm: 2, biz: 2 },
      salary: { bsc: [18, 30], msc: [30, 55], phd: [45, 90] },
      needDegree: 2, demand: 68, growth: 52,
      suggest: {
        bsc: '竞争激烈,建议深造',
        msc: '工业检测/安防等应用岗充足',
        phd: '自动驾驶/具身等前沿岗位吃香'
      },
      tips: [
        { stage: 'b4', text: '完成目标检测/图像分割项目,吃透 YOLO 系列代码' },
        { stage: 'b5', text: '扩散模型/多模态是当下 CV 热点,项目尽量往这靠' },
        { stage: 'b7', text: 'CV 岗竞争激烈,顶会论文或大赛奖牌至少占一样' }
      ]
    },
    {
      id: 'robot', name: '具身智能/机器人算法', en: 'Embodied AI', icon: '🦾',
      tagline: 'AI 的下一个爆发点:让智能走出屏幕',
      desc: '融合强化学习、模仿学习与控制论,训练机器人完成真实世界操作,是人形机器人热潮的核心岗位。数学要求高(最优控制、概率机器人学),同时需要极强的动手实验能力。',
      profile: { theory: 5, eng: 4, data: 3, creat: 4, comm: 2, biz: 2 },
      salary: { bsc: [18, 30], msc: [32, 60], phd: [50, 100] },
      needDegree: 2, demand: 90, growth: 96,
      suggest: {
        bsc: '动手强可入硬件/集成岗',
        msc: '算法岗主流要求硕士',
        phd: '具身智能算法前沿,博士非常吃香'
      },
      tips: [
        { stage: 'b4', text: '自学 ROS + 仿真,做一个自己的小车/机械臂项目' },
        { stage: 'b5', text: '具身智能岗重 RL + 模仿学习,数学要补足最优控制' },
        { stage: 'b7', text: '机器人公司秋招看动手能力,准备一个实机演示视频' }
      ]
    },
    {
      id: 'researcher', name: 'AI 研究科学家', en: 'Research Scientist', icon: '🔬',
      tagline: '定义问题的人:把 AI 的边界向外推',
      desc: '在高校、顶尖研究院(智源/上海AI实验室)或大厂 AI Lab 从事前沿研究,以发表顶会论文为核心产出。门槛最高:通常要求名校博士 + 顶会一作,但回报也是天花板级别的。',
      profile: { theory: 5, eng: 2, data: 3, creat: 5, comm: 2, biz: 1 },
      salary: { bsc: [0, 0], msc: [35, 60], phd: [60, 120] },
      needDegree: 3, demand: 62, growth: 66,
      suggest: {
        bsc: '基本不可行,先读研',
        msc: '可做工业界研究助理/实习研究员',
        phd: '标准路径,直博优先'
      },
      tips: [
        { stage: 'b4', text: '大二就进实验室,越早接触科研越好' },
        { stage: 'b5', text: '争取本科生科研训练 + 一作论文,这是直博/推免的核心筹码' },
        { stage: 'b7', text: '目标读博:提前联系导师,套磁前读完该组近 3 年论文' }
      ]
    },
    {
      id: 'ad', name: '自动驾驶算法工程师', en: 'Autonomous Driving', icon: '🚗',
      tagline: 'AI 最硬核的落地场景之一',
      desc: '覆盖感知、定位建图、规划控制全链路,公司集中在头部新势力与 Robotaxi 企业。要求 C++ 功底扎实、系统思维强,行业受商业化节奏影响有波动,建议保留 Plan B。',
      profile: { theory: 4, eng: 5, data: 3, creat: 2, comm: 2, biz: 2 },
      salary: { bsc: [18, 28], msc: [30, 55], phd: [45, 90] },
      needDegree: 2, demand: 64, growth: 55,
      suggest: {
        bsc: '嵌入式/集成岗可入',
        msc: '感知算法主流路径',
        phd: '端到端/大模型车方向欢迎博士'
      },
      tips: [
        { stage: 'b4', text: '参加智能车竞赛/ROS 小车项目,积累感知算法实战' },
        { stage: 'b5', text: '自动驾驶校招看重 C++ 功底与 SLAM/规划项目' },
        { stage: 'b7', text: '行业波动较大,同时准备机器人/算法岗做 Plan B' }
      ]
    },
    {
      id: 'mlops', name: 'MLOps/平台工程师', en: 'MLOps Engineer', icon: '🏗️',
      tagline: '给 AI 修路的人:训练与推理基础设施',
      desc: '构建机器学习平台、分布式训练与模型服务系统,让算法工程师高效工作。学历门槛相对友好,更看重工程能力与系统设计,适合喜欢基础设施、不想卷论文的同学。',
      profile: { theory: 2, eng: 5, data: 3, creat: 2, comm: 2, biz: 2 },
      salary: { bsc: [20, 38], msc: [28, 50], phd: [40, 70] },
      needDegree: 1, demand: 76, growth: 78,
      suggest: {
        bsc: '门槛友好,工程能力优先',
        msc: '平台团队偏爱硕士',
        phd: '少数,不必要'
      },
      tips: [
        { stage: 'b3', text: 'Linux/Git/Docker 这些工程基本功要提前打扎实' },
        { stage: 'b5', text: '亲手搭一次训练/推理全流程,从数据处理到模型上线' },
        { stage: 'b7', text: 'MLOps 岗面试重系统设计,准备一个端到端平台项目' }
      ]
    },
    {
      id: 'pm', name: 'AI 产品经理', en: 'AI Product Manager', icon: '📱',
      tagline: 'AI 产品的定义者,技术与用户的翻译官',
      desc: '定义 AI 产品方向、拆解用户需求、推动算法与工程团队落地,是"懂技术的产品人"。不需要最深的算法功底,但需要技术判断力 + 商业嗅觉 + 极强的沟通能力。',
      profile: { theory: 1, eng: 1, data: 2, creat: 3, comm: 5, biz: 5 },
      salary: { bsc: [18, 35], msc: [25, 45], phd: [30, 55] },
      needDegree: 1, demand: 84, growth: 86,
      suggest: {
        bsc: '学历要求低,项目/实习说话',
        msc: '技术背景是加分项',
        phd: '极少,不必要'
      },
      tips: [
        { stage: 'b3', text: '加入学生组织做负责人,锻炼沟通与项目管理' },
        { stage: 'b5', text: 'AI PM 实习看重数据分析 + 竞品拆解,尽早积累作品' },
        { stage: 'b7', text: 'AI PM 校招少而精,准备一份产品分析报告作为作品集' }
      ]
    },
    {
      id: 'de', name: '数据工程师', en: 'Data Engineer', icon: '🗄️',
      tagline: '数据管道的建筑师,AI 的粮草官',
      desc: '搭建数据仓库、实时计算管道与数据治理体系,是"AI 公司最不缺人但永远缺好人的岗位"。重 SQL、分布式计算与工程严谨性,学历门槛友好,稳定性强。',
      profile: { theory: 2, eng: 4, data: 4, creat: 1, comm: 2, biz: 2 },
      salary: { bsc: [18, 32], msc: [25, 45], phd: [35, 60] },
      needDegree: 1, demand: 74, growth: 62,
      suggest: {
        bsc: '完全可行,SQL 硬实力',
        msc: '大数据平台岗更优',
        phd: '不必要'
      },
      tips: [
        { stage: 'b3', text: 'SQL 是数据工程师吃饭的家伙,刷到炉火纯青' },
        { stage: 'b5', text: '学 Hadoop/Spark/Flink,做一个完整数仓项目' },
        { stage: 'b7', text: '数据工程岗面试重 SQL 手写 + 数据管道设计题' }
      ]
    },
    {
      id: 'safety', name: 'AI 安全与对齐', en: 'AI Safety & Alignment', icon: '🛡️',
      tagline: '让强大的 AI 值得信赖,新兴蓝海方向',
      desc: '研究大模型的安全评估、对齐训练与红队测试,或负责 AI 合规治理。随着各国监管收紧,岗位需求快速增长,而人才供给严重不足——入行早,竞争小,天花板高。',
      profile: { theory: 4, eng: 3, data: 3, creat: 4, comm: 2, biz: 2 },
      salary: { bsc: [18, 28], msc: [28, 50], phd: [50, 100] },
      needDegree: 2, demand: 70, growth: 94,
      suggest: {
        bsc: '入门难,建议读硕',
        msc: '对齐/评估岗硕士起步',
        phd: '前沿对齐研究需要博士'
      },
      tips: [
        { stage: 'b4', text: '读 AI 安全论文(对齐/红队),参加 CTF 积累安全底子' },
        { stage: 'b5', text: '做模型安全评估/越狱攻击项目,领域新、竞争小' },
        { stage: 'b7', text: 'AI 安全岗多要求硕士以上,保研/考研提前规划' }
      ]
    },
    {
      id: 'sa', name: 'AI 解决方案架构师', en: 'Solution Architect', icon: '🎯',
      tagline: '技术与商业的桥梁,客户心中的专家',
      desc: '面向政企客户设计 AI 落地方案,负责售前交流、架构设计与项目交付,常见于云厂商与 AI 独角兽。要求技术广度 + 行业认知 + 顶级沟通能力,出差较多但成长极快。',
      profile: { theory: 3, eng: 3, data: 2, creat: 2, comm: 4, biz: 4 },
      salary: { bsc: [20, 38], msc: [28, 50], phd: [35, 60] },
      needDegree: 1, demand: 72, growth: 74,
      suggest: {
        bsc: '技术 + 表达,本科可入',
        msc: '云大厂售前偏爱硕士',
        phd: '不必要'
      },
      tips: [
        { stage: 'b3', text: '练习把技术讲给非技术人听,参加演讲/辩论类社团' },
        { stage: 'b5', text: '考云厂商认证(阿里云/AWS),积累架构动手能力' },
        { stage: 'b7', text: '解决方案岗看重行业认知,秋招前系统研究 2-3 个行业' }
      ]
    }
  ],

  /* ---------- 职业测评问卷（18题,每题选项带维度加权） ---------- */
  quiz: [
    {
      q: '深夜,你遇到一道高难度数学证明题,你的第一反应是?',
      options: [
        { t: '兴奋起来,不啃下来睡不着', d: { theory: 3, creat: 1 } },
        { t: '想能不能写程序暴力验证/画图找规律', d: { eng: 2, data: 1 } },
        { t: '找找有没有现成解法套路背下来', d: { eng: 1 } },
        { t: '先放着,想想它到底有什么用', d: { biz: 2 } }
      ]
    },
    {
      q: '写代码时,你最享受哪种状态?',
      options: [
        { t: '把一段复杂逻辑重构得优雅漂亮', d: { eng: 3 } },
        { t: '快速调包拼出一个能跑的原型', d: { eng: 1, biz: 1 } },
        { t: '想清楚算法复杂度再动手', d: { theory: 2, eng: 1 } },
        { t: '其实我不太爱写代码,更爱聊想法', d: { comm: 2, biz: 1 } }
      ]
    },
    {
      q: '你训练的模型效果不好,你的第一反应是?',
      options: [
        { t: '换更大的模型、上更多算力试试', d: { eng: 2 } },
        { t: '从损失函数和数据分布上找数学原因', d: { theory: 2, data: 1 } },
        { t: '先查数据标注与质量有没有问题', d: { data: 2 } },
        { t: '先搞清楚这个模型到底要解决什么业务问题', d: { biz: 2, comm: 1 } }
      ]
    },
    {
      q: '面对一份原始数据,你的直觉是?',
      options: [
        { t: '迫不及待想看看里面藏着什么故事', d: { data: 3 } },
        { t: '先写脚本清洗,把管道搭起来', d: { eng: 2, data: 1 } },
        { t: '建模、预测、验证假设', d: { theory: 1, data: 2 } },
        { t: '做成好看的图表,讲给别人听', d: { comm: 2, data: 1 } }
      ]
    },
    {
      q: '小组课程设计里,你通常扮演什么角色?',
      options: [
        { t: '核心算法/代码的实现者', d: { eng: 3 } },
        { t: '组织分工、写文档、上台答辩', d: { comm: 3 } },
        { t: '出点子、定方向的那个人', d: { creat: 2, biz: 1 } },
        { t: '找数据、做实验、出图表', d: { data: 2 } }
      ]
    },
    {
      q: '关于读论文,你最接近哪种状态?',
      options: [
        { t: '主动追最新的顶会论文,还动手复现', d: { creat: 3, theory: 1 } },
        { t: '需要解决问题时才去查', d: { eng: 1, biz: 1 } },
        { t: '更喜欢看视频课和技术博客', d: { eng: 1 } },
        { t: '爱看行业分析报告,不爱看公式', d: { biz: 2 } }
      ]
    },
    {
      q: '你理想中的成就感来自?',
      options: [
        { t: '发表论文、被学术同行认可', d: { creat: 2, theory: 1 } },
        { t: '攻克一个公认的技术难题', d: { theory: 2, eng: 1 } },
        { t: '自己做的产品被很多人使用', d: { biz: 2, eng: 1 } },
        { t: '当众讲清楚复杂问题并获得认可', d: { comm: 2 } }
      ]
    },
    {
      q: '面对"没人做过、不知道能不能成"的任务,你会?',
      options: [
        { t: '更兴奋,未知才有意思', d: { creat: 3 } },
        { t: '有点慌,希望任务定义得清晰些', d: { eng: 1, biz: 1 } },
        { t: '先做起来,边做边调整', d: { eng: 1, creat: 1 } }
      ]
    },
    {
      q: '自评一下你的数学功底与兴趣?',
      options: [
        { t: '数学是我的强项,越学越有意思', d: { theory: 3 } },
        { t: '够用就行,能用起来最重要', d: { eng: 2 } },
        { t: '偏弱,能躲就躲', d: { comm: 1, biz: 1 } }
      ]
    },
    {
      q: '写作与表达这件事,对你来说?',
      options: [
        { t: '喜欢写技术博客/讲义,享受把想法讲清楚', d: { comm: 2, creat: 1 } },
        { t: '是任务,不算痛苦也不算享受', d: { eng: 1 } },
        { t: '一想到写报告就头疼,更喜欢动手做', d: { eng: 2 } }
      ]
    },
    {
      q: '你对机器人/硬件/具身智能的态度?',
      options: [
        { t: '超感兴趣,想亲手让机器动起来', d: { creat: 2, eng: 2 } },
        { t: '有兴趣,但只想做软件层面', d: { eng: 1 } },
        { t: '无感,更喜欢纯算法和数据', d: { theory: 1, data: 1 } }
      ]
    },
    {
      q: '关于 AI 安全、伦理与对齐话题,你?',
      options: [
        { t: '非常关心,认为这是 AI 最重要的问题', d: { creat: 2, theory: 1 } },
        { t: '会关注政策法规,但不深入技术', d: { biz: 1 } },
        { t: '觉得离自己很远,先做好手上的事', d: { eng: 1 } }
      ]
    },
    {
      q: '竞赛/比赛这件事,你的经历更接近?',
      options: [
        { t: '拿过奖,乐在其中', d: { theory: 1, eng: 2 } },
        { t: '没拿过奖,但喜欢折腾题目', d: { eng: 1, creat: 1 } },
        { t: '没参加过,更喜欢做自己的项目', d: { creat: 1, biz: 1 } }
      ]
    },
    {
      q: '和用户/客户打交道,对你来说?',
      options: [
        { t: '喜欢,听懂人话比技术本身更难', d: { comm: 3, biz: 1 } },
        { t: '可以,但我更想专注写代码', d: { eng: 2 } },
        { t: '能躲就躲,我只想和机器对话', d: { eng: 1, creat: 1 } }
      ]
    },
    {
      q: '看到一个爆火的新 AI 应用,你的第一反应?',
      options: [
        { t: '研究它的商业模式,为什么能赚钱', d: { biz: 3 } },
        { t: '拆解它的技术架构,想想自己能不能复刻', d: { eng: 2, creat: 1 } },
        { t: '试用后挑毛病,想更好的点子', d: { creat: 2 } },
        { t: '无感,继续专注自己的方向', d: { theory: 1 } }
      ]
    },
    {
      q: '哪种工作状态让你最投入?',
      options: [
        { t: '沉浸式推导公式/读论文,一抬头几小时过去了', d: { theory: 3 } },
        { t: '调试代码/搭系统,进入心流', d: { eng: 3 } },
        { t: '分析数据找规律,发现惊喜', d: { data: 3 } },
        { t: '和人讨论碰撞出火花', d: { comm: 2, creat: 1 } }
      ]
    },
    {
      q: '遇到重复性劳动,你会?',
      options: [
        { t: '写脚本自动化它', d: { eng: 2, data: 1 } },
        { t: '忍着做完,保证不出错', d: { eng: 1 } },
        { t: '想办法把流程优化掉/交给别人', d: { biz: 1, comm: 1 } }
      ]
    },
    {
      q: '你此刻对学历的打算是?',
      options: [
        { t: '想读博,往研究深处走', d: { creat: 2, theory: 2 } },
        { t: '读个硕士,增强就业竞争力', d: { eng: 1, biz: 1 } },
        { t: '本科毕业先工作,不想再读书', d: { biz: 2, eng: 1 } },
        { t: '还没想好,来这个平台就是想搞清楚', d: {} }
      ]
    }
  ],

  /* ---------- 学历决策问卷（10题,正向=科研倾向,负向=就业倾向） ---------- */
  degreeQ: [
    { q: '你对"研究"这件事本身的兴趣?', f: 'research',
      options: [
        { t: '很强,不研究就难受', s: 3 },
        { t: '有兴趣,但不想全职研究', s: 1 },
        { t: '一般,更爱做出能用的东西', s: -2 },
        { t: '排斥,研究太枯燥了', s: -3 }
      ] },
    { q: '你能接受"三五年只研究一个问题,且可能没有结果"吗?', f: 'time',
      options: [
        { t: '能,探索过程本身就值得', s: 3 },
        { t: '勉强,希望过程中有可见产出', s: -1 },
        { t: '不能,我需要及时反馈', s: -3 }
      ] },
    { q: '你更想成为哪种人?', f: 'career',
      options: [
        { t: '学术圈顶尖学者', s: 3 },
        { t: '大厂核心技术专家', s: 1 },
        { t: '技术+业务复合管理者', s: -2 },
        { t: '创业者/自由职业者', s: -3 }
      ] },
    { q: '家庭经济条件与时间压力?', f: 'econ',
      options: [
        { t: '无压力,可安心深造', s: 2 },
        { t: '一般,希望尽快有收入', s: -2 },
        { t: '压力大,必须尽快工作', s: -3 }
      ] },
    { q: '你的 GPA / 成绩基础?', f: 'academic',
      options: [
        { t: '专业前 10%', s: 2 },
        { t: '中上水平', s: 1 },
        { t: '中等', s: -1 },
        { t: '一般', s: -2 }
      ] },
    { q: '你已经拥有的"硬通货"(论文/大奖/开源项目)?', f: 'academic',
      options: [
        { t: '有顶会论文或国家级奖项', s: 3 },
        { t: '有比赛奖项/好项目', s: 1 },
        { t: '有一些课程项目', s: -1 },
        { t: '几乎没有', s: -2 }
      ] },
    { q: '你对"发论文"这件事?', f: 'research',
      options: [
        { t: '期待,想体验学术发表', s: 2 },
        { t: '当任务完成就行', s: -1 },
        { t: '有点畏惧', s: -2 }
      ] },
    { q: '你目标岗位对学历的要求(可参考职业测评结果)?', f: 'career',
      options: [
        { t: '研究型岗位,博士是门槛', s: 3 },
        { t: '算法岗,硕士是基本盘', s: 1 },
        { t: '工程/产品岗,本科也能进', s: -2 }
      ] },
    { q: '你对年龄/人生节奏的敏感度?', f: 'time',
      options: [
        { t: '完全无所谓,晚几年工作没关系', s: 1 },
        { t: '有点在意,不想 30 岁才工作', s: -2 },
        { t: '很在意,想早点工作成家', s: -3 }
      ] },
    { q: '家人/伴侣对你的期待?', f: 'econ',
      options: [
        { t: '支持深造,不催', s: 2 },
        { t: '无所谓,尊重我的选择', s: 0 },
        { t: '希望早点工作稳定', s: -2 }
      ] }
  ],

  /* ---------- 学历路径与 ROI 参考 ---------- */
  degreePaths: [
    { id: 'job', name: '本科直接就业', icon: '🎓', years: 0, start: 20, five: 105, ceiling: 60,
      desc: '起步最早,抢到行业红利期;但研究岗基本无缘,学历天花板明显' },
    { id: 'msc', name: '硕士就业', icon: '🎓', years: 3, start: 32, five: 150, ceiling: 100,
      desc: 'AI 主流路径,性价比最高;算法岗基本盘,进可攻退可守' },
    { id: 'phd', name: '博士(研究/工业)', icon: '🔬', years: 6, start: 55, five: 180, ceiling: 200,
      desc: '时间成本最高,但打开研究岗天花板;前提是真心热爱研究' }
  ],

  /* ---------- 学历决策常见误区 ---------- */
  myths: [
    { t: '"读博是因为找不到工作才读的"',
      a: '事实:博士训练的是"自己定义问题并解决"的能力,顶尖研究院与大模型团队的门槛就是博士。但读博动机必须是热爱研究本身,否则过程会非常痛苦。' },
    { t: '"硕士一定比本科工资高"',
      a: '事实:平均起薪确实更高,但要把 2-3 年时间成本 + 学费计入;优秀的本科生通过三年工作经验,可能比刚毕业的硕士收入更高。' },
    { t: '"做 AI 必须读博"',
      a: '事实:算法工程/大模型应用/产品岗,硕士甚至本科 + 强项目即可入场;只有研究科学家、前沿研究院岗位才真正需要博士。' },
    { t: '"出国读研一定比国内好"',
      a: '事实:国内大厂实习资源、导师项目、生活成本各有优势。应看目标岗位与导师水平,而不是盲目出国——很多国内大厂核心团队国内硕更吃得开。' },
    { t: '"先工作再读研会落后"',
      a: '事实:带着真实问题读研的人目标更清晰,硕博阶段产出往往更高效;工作一两年再深造是常见且明智的路径。' },
    { t: '"AI 热潮会过去,现在入行已经晚了"',
      a: '事实:AI 已成为基础设施,人才需求长期存在。但岗位结构在变——应用型、复合型人才需求上升。选对方向 + 持续学习,任何时候入场都不晚。' }
  ],

  /* ---------- 行情仿真:AI 行业股票池（基准价=参考价,仿真引擎在其上随机游走） ---------- */
  stocks: [
    { code: 'NVDA', name: '英伟达', market: 'US', cur: '$', base: 130, vol: 0.009, sector: 'chip' },
    { code: 'AMD', name: '超威半导体', market: 'US', cur: '$', base: 160, vol: 0.012, sector: 'chip' },
    { code: 'TSM', name: '台积电', market: 'US', cur: '$', base: 190, vol: 0.007, sector: 'chip' },
    { code: 'AVGO', name: '博通', market: 'US', cur: '$', base: 175, vol: 0.010, sector: 'chip' },
    { code: 'MSFT', name: '微软', market: 'US', cur: '$', base: 430, vol: 0.005, sector: 'compute' },
    { code: 'GOOGL', name: '谷歌', market: 'US', cur: '$', base: 185, vol: 0.007, sector: 'compute' },
    { code: 'META', name: 'Meta', market: 'US', cur: '$', base: 560, vol: 0.008, sector: 'compute' },
    { code: 'TSLA', name: '特斯拉', market: 'US', cur: '$', base: 260, vol: 0.014, sector: 'auto' },
    { code: 'PLTR', name: 'Palantir', market: 'US', cur: '$', base: 45, vol: 0.016, sector: 'app' },
    { code: '寒武纪', name: '寒武纪', market: 'CN', cur: '¥', base: 620, vol: 0.018, sector: 'chip' },
    { code: '海光信息', name: '海光信息', market: 'CN', cur: '¥', base: 135, vol: 0.016, sector: 'chip' },
    { code: '中际旭创', name: '中际旭创', market: 'CN', cur: '¥', base: 145, vol: 0.014, sector: 'optical' },
    { code: '工业富联', name: '工业富联', market: 'CN', cur: '¥', base: 22, vol: 0.012, sector: 'compute' },
    { code: '浪潮信息', name: '浪潮信息', market: 'CN', cur: '¥', base: 45, vol: 0.014, sector: 'compute' },
    { code: '中科曙光', name: '中科曙光', market: 'CN', cur: '¥', base: 62, vol: 0.015, sector: 'compute' },
    { code: '科大讯飞', name: '科大讯飞', market: 'CN', cur: '¥', base: 52, vol: 0.013, sector: 'app' },
    { code: '商汤-W', name: '商汤-W', market: 'HK', cur: 'HK$', base: 1.7, vol: 0.020, sector: 'app' }
  ],

  sectors: [
    { id: 'chip', name: 'AI 芯片', icon: '🔲' },
    { id: 'compute', name: '算力基建', icon: '🖥️' },
    { id: 'optical', name: '光模块', icon: '💡' },
    { id: 'app', name: '大模型与应用', icon: '🤖' },
    { id: 'auto', name: '智能驾驶', icon: '🚗' }
  ],

  /* ---------- AI 行业热点（初始热度,仿真引擎实时波动） ---------- */
  topics: [
    { name: 'AI Agent 商用落地加速', tag: '大模型', heat: 96 },
    { name: '大模型推理成本持续下降', tag: '大模型', heat: 93 },
    { name: '具身智能/人形机器人量产潮', tag: '机器人', heat: 91 },
    { name: '世界模型成为新竞赛焦点', tag: '前沿研究', heat: 88 },
    { name: '视频生成模型全面开花', tag: '多模态', heat: 85 },
    { name: '端侧 AI(手机/PC)加速渗透', tag: '应用', heat: 82 },
    { name: '国产算力芯片崛起', tag: '芯片', heat: 90 },
    { name: 'AI 芯片出口管制博弈', tag: '政策', heat: 86 },
    { name: 'Robotaxi 规模化商业运营', tag: '自动驾驶', heat: 78 },
    { name: 'AI 编程助手进入主流研发流程', tag: '应用', heat: 84 },
    { name: '多模态大模型统一感知与推理', tag: '前沿研究', heat: 80 },
    { name: 'AI 安全与对齐监管升温', tag: '政策', heat: 76 },
    { name: 'AI for Science 获顶级关注', tag: '前沿研究', heat: 74 },
    { name: '智算中心建设热潮', tag: '算力', heat: 79 }
  ],

  /* ---------- 阶段规划路线图 ---------- */
  roadmap: {
    bsc: {
      name: '本科四年路线', icon: '🎓', years: '大一 → 大四',
      stages: [
        { id: 'b1', name: '大一上', title: '适应与奠基', goal: '打好数学与编程地基,融入专业圈子',
          courses: ['高等数学(上)', '线性代数', 'C 语言程序设计', '大学英语', '计算机导论', '加入 ACM/技术社团'],
          comps: [], milestones: ['完成第一个小项目(贪吃蛇/个人主页)', '开通 GitHub 并开始提交', '认识 3 位优秀的学长学姐'] },
        { id: 'b2', name: '大一下', title: '算法入门', goal: '数据结构与算法 + Python 入门,坚持刷题',
          courses: ['高等数学(下)', '概率论与数理统计', '离散数学', 'Python 程序设计', '数据结构与算法(提前自学)'],
          comps: ['蓝桥杯省赛(试水)', '校内程序设计竞赛'], milestones: ['LeetCode 完成 50 题', 'GitHub 累计 100 次提交', '用 Python 写一个爬虫/小工具'] },
        { id: 'b3', name: '大二上', title: '机器学习启航', goal: '完成第一个机器学习项目',
          courses: ['数据结构', '计算机组成原理', '数据库系统', '机器学习(吴恩达课程)', '数学建模'],
          comps: ['全国大学生数学建模竞赛', '蓝桥杯国赛'], milestones: ['Kaggle 入门项目(Titanic/房价)', '掌握 NumPy/Pandas/Matplotlib', '开始写技术博客'] },
        { id: 'b4', name: '大二下', title: '深度学习与方向初探', goal: '进实验室,初识科研',
          courses: ['操作系统', '计算机网络', '深度学习(动手学深度学习)', '最优化方法', '数据可视化'],
          comps: ['美国大学生数学建模竞赛', '天池新人赛'], milestones: ['复现 2 篇经典论文', '联系导师进入实验室', '争取暑期小厂实习'] },
        { id: 'b5', name: '大三上', title: '方向专精', goal: '结合职业测评选定方向并做出硬成果',
          courses: ['机器学习进阶', 'NLP/CV/RL(按方向选)', '分布式系统', '论文精读(顶会)'],
          comps: ['CCF 大数据与智能大赛', 'Kaggle 冲牌'], milestones: ['确定职业方向(参考本平台测评)', '打磨 1 个高质量项目', 'LeetCode 完成 200 题'] },
        { id: 'b6', name: '大三下', title: '实习与升学决策', goal: '暑期实习定生死,升学就业做抉择',
          courses: ['专业选修', '英语六级/雅思托福', '面试算法强化'],
          comps: ['大厂笔试/面试实战'], milestones: ['3-4 月集中投递暑期实习', '拿到实习 Offer', '6 月做出保研/考研/就业决策'] },
        { id: 'b7', name: '大四上', title: '秋招与升学双线作战', goal: '秋招/保研/考研,多线并行',
          courses: ['毕业论文开题', '秋招笔试面试冲刺'],
          comps: ['秋招(7-10月)', '保研推免(9月)', '考研报名(10月)'], milestones: ['LeetCode 完成 300 题', '拿到 1-3 个 Offer / 推免资格', '复盘求职过程'] },
        { id: 'b8', name: '大四下', title: '毕业与衔接', goal: '完美收官,提前衔接下一阶段',
          courses: ['毕业设计(结合职业方向)', '毕业实习'],
          comps: [], milestones: ['完成优秀毕业设计', '毕业旅行', '提前进组读文献 / 入职准备'] }
      ]
    },
    msc: {
      name: '硕士三年路线', icon: '📚', years: '研一 → 研三',
      stages: [
        { id: 'm1', name: '研一上', title: '筑基', goal: '课程 + 组会 + 论文复现',
          courses: ['高级机器学习', '凸优化', '方向基础课', '学术英语'],
          comps: [], milestones: ['复现 2 篇论文', '确定研究/工程方向', '坚持每周组会汇报'] },
        { id: 'm2', name: '研一下', title: '出成果', goal: '第一篇论文 / 核心项目里程碑',
          courses: ['方向选修课', '论文写作课'],
          comps: ['企业赛道竞赛(天池/CCF)', '暑期实习面试准备'], milestones: ['第一篇论文投稿 / 核心项目完成', '3-4 月投递暑期实习'] },
        { id: 'm3', name: '研二上', title: '冲刺', goal: '核心成果 + 大厂实习',
          courses: ['以科研/实习为主'],
          comps: [], milestones: ['顶会投稿', '大厂实习(争取转正)', '关注秋招动态'] },
        { id: 'm4', name: '研二下', title: '成果收割', goal: '论文 + 实习双丰收',
          courses: [],
          comps: [], milestones: ['实习转正 / 暑期实习', '完善简历与作品集', '论文发表'] },
        { id: 'm5', name: '研三上', title: '秋招决战', goal: '全面出击拿 Offer',
          courses: ['毕业论文开题'],
          comps: ['秋招(7-10月)'], milestones: ['笔试面试冲刺', '多个 Offer 对比选择'] },
        { id: 'm6', name: '研三下', title: '毕业收官', goal: '论文 + 入职',
          courses: [],
          comps: [], milestones: ['毕业论文与答辩', '毕业旅行', '入职准备'] }
      ]
    },
    phd: {
      name: '博士五年路线', icon: '🔬', years: '博一 → 博五',
      stages: [
        { id: 'd1', name: '博一', title: '方向与阅读', goal: '泛读 100 篇、精读 20 篇',
          courses: ['高级专业课程', '学术写作'],
          comps: [], milestones: ['确定研究方向', '复现 baseline', '与导师对齐目标'] },
        { id: 'd2', name: '博二', title: '第一篇论文', goal: '找到核心问题并产出',
          courses: [],
          comps: [], milestones: ['第一篇论文(会议/workshop)', '参加学术会议', '中期考核'] },
        { id: 'd3', name: '博三', title: '顶会冲刺', goal: '产出高峰期',
          courses: [],
          comps: [], milestones: ['顶会论文发表', '工业实验室实习(可选)', '确定毕业去向(教职/工业界)'] },
        { id: 'd4', name: '博四', title: '成熟期', goal: '2-3 篇顶会,构建学术网络',
          courses: [],
          comps: [], milestones: ['出国交流(可选)', '教职/Research 岗面试准备', '积累学术人脉'] },
        { id: 'd5', name: '博五', title: '毕业', goal: '论文 + 去向落定',
          courses: [],
          comps: [], milestones: ['毕业论文与答辩', '教职/工业界 Offer', '学术生涯开启'] }
      ]
    }
  },

  /* ---------- 技能树 ---------- */
  skills: {
    common: [
      { id: 's_la', name: '线性代数', desc: '矩阵、特征值、SVD——一切 ML 的数学地基', cat: '数学' },
      { id: 's_pr', name: '概率论与统计', desc: '分布、估计、假设检验——读懂模型的必修课', cat: '数学' },
      { id: 's_op', name: '最优化方法', desc: '梯度下降、凸优化——训练模型的核心引擎', cat: '数学' },
      { id: 's_in', name: '信息论初步', desc: '熵、KL 散度——理解损失函数本质', cat: '数学' },
      { id: 's_py', name: 'Python', desc: 'AI 行业的通用语言,必备工具', cat: '编程' },
      { id: 's_cpp', name: 'C++ 基础', desc: '高性能推理与自动驾驶岗位的敲门砖', cat: '编程' },
      { id: 's_ds', name: '数据结构与算法', desc: '面试手撕代码的硬通货', cat: '编程' },
      { id: 's_eng', name: '工程化能力', desc: 'Git / Linux / Docker / CI——职业程序员的标配', cat: '编程' },
      { id: 's_ml', name: '经典机器学习', desc: '回归/树模型/SVM/聚类,地基中的地基', cat: '机器学习' },
      { id: 's_dl', name: '深度学习与 PyTorch', desc: '从全连接网络到 Transformer,亲手训练', cat: '机器学习' },
      { id: 's_llm', name: '大模型基础', desc: 'Transformer/预训练/微调/推理,时代必修', cat: '机器学习' },
      { id: 's_en', name: '英语文献阅读', desc: '前沿论文都是英文的,没有捷径', cat: '软技能' },
      { id: 's_wr', name: '论文/技术写作', desc: '把成果讲清楚,是复利最高的能力', cat: '软技能' },
      { id: 's_tk', name: '演讲与表达', desc: '答辩、汇报、面试,表达即影响力', cat: '软技能' }
    ],
    byCareer: {
      ml:      [ { id: 'x_mo', name: '模型优化与推理加速', desc: '量化/剪枝/蒸馏/推理引擎', cat: '专项' }, { id: 'x_ms', name: 'ML 系统设计', desc: '特征平台/在线学习/AB 实验', cat: '专项' } ],
      llm:     [ { id: 'x_pm', name: 'Prompt 工程', desc: '结构化提示、少样本、思维链', cat: '专项' }, { id: 'x_ra', name: 'RAG 与 Agent', desc: '检索增强、工具调用、多智能体', cat: '专项' }, { id: 'x_ft', name: '微调(LoRA/SFT)', desc: '低成本适配大模型', cat: '专项' } ],
      ds:      [ { id: 'x_sq', name: 'SQL 与数据仓库', desc: '取数与建模的基本功', cat: '专项' }, { id: 'x_ab', name: '因果推断与 AB 实验', desc: '数据科学的皇冠技能', cat: '专项' } ],
      nlp:     [ { id: 'x_ns', name: '序列模型', desc: 'RNN/Attention 到 Transformer 演进', cat: '专项' }, { id: 'x_al', name: '大模型训练与对齐', desc: 'SFT/RLHF/DPO', cat: '专项' } ],
      cv:      [ { id: 'x_cd', name: '检测与分割', desc: 'YOLO/Mask R-CNN 等主流框架', cat: '专项' }, { id: 'x_dm', name: '扩散模型', desc: 'Stable Diffusion 及其原理', cat: '专项' } ],
      robot:   [ { id: 'x_ct', name: '控制理论', desc: 'PID/状态空间/最优控制', cat: '专项' }, { id: 'x_ros', name: 'ROS 与仿真', desc: 'Gazebo/Isaac 环境实战', cat: '专项' }, { id: 'x_rl', name: '强化学习', desc: 'PPO/SAC/模仿学习', cat: '专项' } ],
      researcher: [ { id: 'x_pr2', name: '数学证明能力', desc: '读得懂、写得出严谨推导', cat: '专项' }, { id: 'x_rc', name: '论文复现与批判阅读', desc: '快速吃透一篇论文', cat: '专项' }, { id: 'x_ow', name: '开放问题建模', desc: '把模糊想法变成可研究的问题', cat: '专项' } ],
      ad:      [ { id: 'x_pc', name: '感知(检测/跟踪)', desc: '点云/图像多模态感知', cat: '专项' }, { id: 'x_lm', name: '定位与建图', desc: 'SLAM 基础', cat: '专项' }, { id: 'x_pp', name: '规划与控制', desc: '轨迹规划/MPC', cat: '专项' } ],
      mlops:   [ { id: 'x_k8', name: 'Kubernetes', desc: '容器编排与云原生', cat: '专项' }, { id: 'x_dt', name: '分布式训练', desc: 'DDP/DeepSpeed/多机多卡', cat: '专项' }, { id: 'x_sv', name: '模型服务与监控', desc: '推理延迟/成本/漂移监控', cat: '专项' } ],
      pm:      [ { id: 'x_prd', name: '需求分析与 PRD', desc: '把用户语言翻译成产品语言', cat: '专项' }, { id: 'x_pt', name: '原型设计', desc: 'Figma/快速验证想法', cat: '专项' }, { id: 'x_pj', name: '项目管理', desc: '排期/协同/交付', cat: '专项' } ],
      de:      [ { id: 'x_sp', name: 'Spark/Flink', desc: '分布式数据处理', cat: '专项' }, { id: 'x_pp2', name: '数据管道与调度', desc: 'Airflow 等调度系统', cat: '专项' } ],
      safety:  [ { id: 'x_rt', name: '红队与对抗测试', desc: '越狱/投毒/攻防', cat: '专项' }, { id: 'x_al2', name: '对齐理论', desc: 'RLHF/宪法AI/可解释性', cat: '专项' } ],
      sa:      [ { id: 'x_ar', name: '系统架构设计', desc: '高可用/可扩展架构', cat: '专项' }, { id: 'x_cl', name: '云平台实践', desc: 'AWS/阿里云/华为云', cat: '专项' } ]
    }
  },

  /* ---------- 学习资源库 ---------- */
  resources: [
    { cat: '数学基础', icon: '📐', items: [
      { name: '3Blue1Brown 视频', desc: '用动画讲透线性代数、微积分与神经网络直觉', url: 'https://www.3blue1brown.com' },
      { name: 'MIT 线性代数 18.06', desc: '经典中的经典,配合 3B1B 食用', url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/' },
      { name: '可汗学院数学', desc: '补基础的高效路径,碎片时间刷', url: 'https://www.khanacademy.org/math' }
    ] },
    { cat: '机器学习', icon: '🧠', items: [
      { name: '吴恩达《机器学习》', desc: '所有人的 ML 第一课', url: 'https://www.coursera.org/learn/machine-learning' },
      { name: '李宏毅机器学习', desc: '中文授课天花板,生动有趣', url: 'https://speech.ee.ntu.edu.tw/~hylee/ml/2023-spring.php' },
      { name: '斯坦福 CS229', desc: '数学最扎实的 ML 课程,进阶必学', url: 'https://cs229.stanford.edu' },
      { name: '《机器学习》周志华', desc: '中文"西瓜书",国内教材首选', url: 'https://cs.nju.edu.cn/zhouzh/zhouzh.files/publication/MLbook2016.htm' }
    ] },
    { cat: '深度学习', icon: '🌊', items: [
      { name: '动手学深度学习', desc: 'PyTorch 版 d2l,边学边写代码', url: 'https://zh.d2l.ai' },
      { name: '李沐 B 站主页', desc: '论文精读系列,顶会论文入门神器', url: 'https://space.bilibili.com/1567748478' },
      { name: 'fast.ai', desc: '从零到训练出模型,强调动手', url: 'https://www.fast.ai' },
      { name: '斯坦福 CS231n', desc: '计算机视觉经典课程', url: 'https://cs231n.stanford.edu' }
    ] },
    { cat: '大模型', icon: '🤖', items: [
      { name: 'Hugging Face', desc: '模型/数据集/竞赛的大本营', url: 'https://huggingface.co' },
      { name: 'LLM Course', desc: '系统的大模型学习路线图(GitHub)', url: 'https://github.com/mlabonne/llm-course' },
      { name: '《神经网络与深度学习》邱锡鹏', desc: '中文"蒲公英书",大模型理论必读', url: 'https://nndl.github.io' },
      { name: 'DeepLearning.AI', desc: '吴恩达的大模型系列短课', url: 'https://www.deeplearning.ai' }
    ] },
    { cat: '论文科研', icon: '📄', items: [
      { name: 'arXiv', desc: '所有前沿论文的第一手来源', url: 'https://arxiv.org' },
      { name: 'Papers with Code', desc: '论文+代码+排行榜,复现神器', url: 'https://paperswithcode.com' },
      { name: 'Semantic Scholar', desc: 'AI 驱动的文献检索与引用图谱', url: 'https://www.semanticscholar.org' },
      { name: 'Google Scholar', desc: '追踪作者与引用,学术必备', url: 'https://scholar.google.com' }
    ] },
    { cat: '竞赛实战', icon: '🏆', items: [
      { name: 'Kaggle', desc: '全球最大数据科学竞赛平台', url: 'https://www.kaggle.com' },
      { name: '天池大赛', desc: '阿里旗下,国内赛事最丰富', url: 'https://tianchi.aliyun.com' },
      { name: 'LeetCode', desc: '算法刷题与笔试模拟', url: 'https://leetcode.cn' },
      { name: 'CCF 竞赛', desc: '学会背书的高质量比赛', url: 'https://ccf.org.cn' }
    ] },
    { cat: '行业社区', icon: '🌐', items: [
      { name: 'GitHub', desc: '代码即简历,保持活跃提交', url: 'https://github.com' },
      { name: '机器之心', desc: 'AI 行业深度报道', url: 'https://www.jiqizhixin.com' },
      { name: '量子位', desc: '追踪 AI 大事件', url: 'https://www.qbitai.com' },
      { name: '知乎 AI 话题', desc: '求职经验与行业讨论', url: 'https://www.zhihu.com' }
    ] },
    { cat: '求职面试', icon: '💼', items: [
      { name: '牛客网', desc: '面经/笔试题库/内推集中地', url: 'https://www.nowcoder.com' },
      { name: '力扣热题 100', desc: '面试高频题,刷透再说', url: 'https://leetcode.cn' },
      { name: 'BOSS 直聘', desc: '看岗位 JD 反推学习计划', url: 'https://www.zhipin.com' },
      { name: '掘金社区', desc: '大量真实面经与复盘', url: 'https://juejin.cn' }
    ] }
  ],

  /* ---------- 竞赛日历 ---------- */
  comps: [
    { month: '2月', name: '美国大学生数学建模竞赛(MCM/ICM)', org: '国际', stage: '大一+' },
    { month: '3-4月', name: '蓝桥杯省赛/国赛', org: '工信部', stage: '大二+' },
    { month: '4月', name: '团体程序设计天梯赛', org: '教育部', stage: '大二+' },
    { month: '4-5月', name: '"挑战杯"课外学术科技作品竞赛', org: '团中央', stage: '大二+' },
    { month: '5-10月', name: '"互联网+"大学生创新创业大赛', org: '教育部', stage: '大三+' },
    { month: '9月', name: '全国大学生数学建模竞赛(CUMCM)', org: '中工学会', stage: '大二+' },
    { month: '9-10月', name: '全国大学生数学竞赛', org: '中数会', stage: '大一+' },
    { month: '10-12月', name: 'CCF 大数据与计算智能大赛(BDCI)', org: 'CCF', stage: '大三+' },
    { month: '12月', name: 'ICPC/CCPC 区域赛', org: '国际', stage: '大二+' },
    { month: '全年', name: 'Kaggle 竞赛(冲牌)', org: '国际', stage: '大三' },
    { month: '全年', name: '天池/飞桨大模型应用赛', org: '企业', stage: '大三' },
    { month: '每周', name: 'LeetCode 周赛', org: 'LeetCode', stage: '大一+' }
  ],

  /* ---------- 模拟面试题库 ---------- */
  interview: [
    { cat: 'ML基础', q: '什么是过拟合?如何缓解?', hint: '现象:训练集好、测试集差。缓解:正则化(L1/L2)、早停、数据增强、降参/降维、Dropout;用验证集监控' },
    { cat: 'ML基础', q: '偏差与方差的权衡(Bias-Variance Tradeoff)?', hint: '欠拟合=高偏差,过拟合=高方差;总误差=偏差²+方差+噪声;如何诊断与调整模型复杂度' },
    { cat: 'ML基础', q: '为什么会出现梯度消失/爆炸?如何解决?', hint: '链式法则连乘导致;解决:激活函数选择(ReLU)、归一化、残差连接、梯度裁剪' },
    { cat: 'ML基础', q: 'BatchNorm 的原理与作用?', hint: '对每层输入归一化,稳定分布;加速收敛、允许更大学习率;小 batch 问题;BN/LN 对比' },
    { cat: 'ML基础', q: '常见损失函数与适用场景?', hint: 'MSE(回归)、交叉熵(分类)、Hinge(SVM)、Focal(不平衡);联系激活函数与梯度' },
    { cat: 'ML基础', q: '数据不平衡怎么处理?', hint: '重采样(过/欠)、代价敏感权重、Focal Loss、SMOTE;评价指标改用 F1/AUC' },
    { cat: '深度学习', q: 'Transformer 结构与自注意力机制?', hint: 'QKV 计算、多头注意力、位置编码、残差+LN;复杂度 O(n²) 与改进' },
    { cat: '深度学习', q: 'CNN 为什么能提取图像特征?池化的作用?', hint: '局部感受野、权值共享、平移不变性;池化降维、增大感受野、防过拟合' },
    { cat: '深度学习', q: 'SGD 与 Adam 的区别?如何选择?', hint: '动量与自适应学习率;Adam 收敛快、SGD 泛化可能更好;大模型常用 AdamW' },
    { cat: '深度学习', q: 'Dropout 的原理?训练与推理有何差异?', hint: '随机失活=隐式集成;推理时缩放或 inverted dropout;位置选择' },
    { cat: '深度学习', q: '什么是知识蒸馏?量化与剪枝?', hint: '教师-学生模型、软标签;INT8/FP16 量化;结构化/非结构化剪枝' },
    { cat: '深度学习', q: '如何评估模型好坏?常用指标?', hint: '准确率/F1/AUC/困惑度;结合业务指标;线上 AB 实验验证' },
    { cat: '大模型', q: '大模型为什么会产生"幻觉"?如何缓解?', hint: '训练数据噪声、解码策略、知识边界;缓解:RAG、事实核查、温度调整、约束生成' },
    { cat: '大模型', q: 'RAG 的完整流程?向量检索原理?', hint: '切分→嵌入→召回→重排→生成;embedding 相似度、混合检索、上下文窗口管理' },
    { cat: '大模型', q: 'LoRA 微调的原理?与全参微调的区别?', hint: '低秩分解旁路、可插拔、省显存;SFT/RLHF 流程;何时用全参' },
    { cat: '大模型', q: '大模型推理加速有哪些手段?', hint: 'KV Cache、量化、投机采样、批处理、vLLM 等推理框架;延迟与吞吐权衡' },
    { cat: '大模型', q: 'PPO 在 RLHF 中的作用?', hint: '策略梯度方法;奖励模型给分、PPO 优化策略;与 DPO 的对比' },
    { cat: '工程实践', q: '介绍一下你最得意的项目(STAR 法)?', hint: '背景/任务/行动/结果;量化成果;讲清难点与你的取舍;准备追问' },
    { cat: '工程实践', q: '模型上线需要哪些环节?', hint: '数据管道→训练→评估→部署→监控→回滚;灰度发布;线上/线下一致性' },
    { cat: '工程实践', q: '线上模型效果下降,如何排查?', hint: '数据漂移、特征变更、上游问题;日志对比、AB 对照、监控告警' },
    { cat: '工程实践', q: 'Python 性能优化的经验?', hint: '向量化代替循环、生成器、多进程/GIL、Profiling 定位瓶颈' },
    { cat: '产品业务', q: '如果让你设计一个 AI 功能,你的思路?', hint: '用户痛点→可行性→成功指标→MVP→迭代;技术判断力与成本意识' },
    { cat: '产品业务', q: '你如何看待 AI 行业未来 5 年?', hint: '结合趋势独立思考(Agent/具身/端侧);与自身定位结合;展示信息广度' },
    { cat: '行为面试', q: '讲一次失败经历,你学到了什么?', hint: '真实具体;复盘方法论;体现成长性而非卖惨' }
  ],

  /* ---------- 每日箴言 ---------- */
  quotes: [
    '种一棵树最好的时间是十年前,其次是现在。',
    'AI 行业不缺聪明人,缺的是坚持到底的聪明人。',
    '方向比努力重要——选方向之前,先了解自己。',
    '复利效应不只属于投资,也属于每天刷 10 道题的你。',
    '论文读得慢没关系,日拱一卒,功不唐捐。',
    '实习不是打工,是用最小成本试错你的职业方向。',
    '大模型时代,会提问的人比会背答案的人走得远。',
    '别用战术上的勤奋,掩盖战略上的懒惰。'
  ],

  salaryNote: '薪资为 2025-2026 届校招公开报道的参考区间(总包,一线城市),仅作参考。',
  marketNote: '行情数据由内置仿真引擎基于参考基准价随机游走生成,仅用于学习演示,不构成投资建议。可点击"尝试获取真实行情"接入公开数据源。'
};
