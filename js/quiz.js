/* ============================================================
 * AI 专业生涯规划 — 职业测评 + 学历决策 (quiz.js)
 * ============================================================ */
'use strict';

/* ---------------- 测评打分引擎 ---------------- */
APP.quizEngine = {
  compute(answers) {
    const raw = {}, max = {};
    DATA.dims.forEach(d => { raw[d.id] = 0; max[d.id] = 0; });
    DATA.quiz.forEach((item, qi) => {
      item.options.forEach(opt => {
        Object.keys(opt.d || {}).forEach(k => { max[k] = Math.max(max[k], opt.d[k]); });
      });
    });
    answers.forEach((ai, qi) => {
      if (ai == null || ai < 0) return;
      const d = DATA.quiz[qi].options[ai].d || {};
      Object.keys(d).forEach(k => { raw[k] += d[k]; });
    });
    const dims = {};
    DATA.dims.forEach(d => { dims[d.id] = +(10 * raw[d.id] / (max[d.id] || 1)).toFixed(1); });
    /* 余弦相似度 → 映射到 55-99 匹配度 */
    const scores = DATA.careers.map(c => {
      let s = 0;
      DATA.dims.forEach(d => { s += dims[d.id] * c.profile[d.id]; });
      return { id: c.id, s };
    });
    const lo = Math.min.apply(null, scores.map(x => x.s));
    const hi = Math.max.apply(null, scores.map(x => x.s));
    const span = (hi - lo) || 1;
    const list = scores.map(x => {
      const match = Math.round(55 + 44 * (x.s - lo) / span);
      return { id: x.id, match };
    }).sort((a, b) => b.match - a.match);
    return { dims, list };
  }
};

/* ============================================================
 * 职业测评页
 * ============================================================ */
APP.registerPage('quiz', {
  state: { idx: 0, answers: [] },

  mount(sec) {
    const saved = APP.store.get('quiz');
    if (!saved) this.renderIntro(sec); else this.renderResult(sec, saved);
  },

  renderIntro(sec) {
    sec.innerHTML =
      '<div class="card intro">' +
        '<div class="intro-hero">🎯</div>' +
        '<h2>AI 职业方向测评</h2>' +
        '<p class="intro-p">18 道情景题,从 <b>理论功底 · 工程能力 · 数据直觉 · 研究创新 · 沟通表达 · 商业思维</b> 六个维度为你画像,匹配 13 个 AI 相关职业。</p>' +
        '<div class="grid g3">' + DATA.dims.map(d =>
          '<div class="dim-card"><div class="dim-ic">' + d.icon + '</div><b>' + d.name + '</b><p>' + d.desc + '</p></div>').join('') +
        '</div>' +
        '<p class="muted sm">约 5 分钟 · 结果保存在本地 · 可随时重新测评</p>' +
        '<button class="btn primary lg" id="quiz-start">开始测评 →</button>' +
      '</div>';
    sec.querySelector('#quiz-start').addEventListener('click', () => this.start(sec));
  },

  start(sec) {
    this.state = { idx: 0, answers: [] };
    this.renderQuestion(sec);
  },

  renderQuestion(sec) {
    const st = this.state, item = DATA.quiz[st.idx];
    sec.innerHTML =
      '<div class="quiz-wrap">' +
        '<div class="quiz-prog"><div class="quiz-prog-fill" style="width:' + (st.idx / DATA.quiz.length * 100) + '%"></div></div>' +
        '<div class="quiz-meta">第 <b>' + (st.idx + 1) + '</b> / ' + DATA.quiz.length + ' 题' +
        (st.idx > 0 ? '<button class="btn ghost sm" id="quiz-back">← 上一题</button>' : '') + '</div>' +
        '<div class="card quiz-card"><h2 class="quiz-q">' + APP.esc(item.q) + '</h2>' +
        '<div class="quiz-opts">' + item.options.map((o, i) =>
          '<button class="quiz-opt" data-i="' + i + '"><span class="qo-key">' + String.fromCharCode(65 + i) + '</span><span>' + APP.esc(o.t) + '</span></button>').join('') +
        '</div></div></div>';
    sec.querySelectorAll('.quiz-opt').forEach(b => {
      b.addEventListener('click', () => {
        const i = +b.dataset.i;
        st.answers[st.idx] = i;
        b.classList.add('picked');
        setTimeout(() => {
          if (st.idx < DATA.quiz.length - 1) { st.idx++; this.renderQuestion(sec); }
          else { const res = APP.quizEngine.compute(st.answers); APP.store.set('quiz', { dims: res.dims, list: res.list, top3: res.list.slice(0, 3), date: APP.fmt.today() }); this.renderResult(sec, APP.store.get('quiz')); APP.updateBadges(); }
        }, 220);
      });
    });
    const back = sec.querySelector('#quiz-back');
    if (back) back.addEventListener('click', () => { if (st.idx > 0) { st.idx--; this.renderQuestion(sec); } });
  },

  renderResult(sec, saved) {
    const P = APP.palette();
    const top3 = saved.top3.map(x => { const c = DATA.careers.find(c => c.id === x.id); return Object.assign({ c }, x); });
    const top = top3[0];
    const full = saved.dims;
    const needDegree = { 1: '本科可入', 2: '硕士优先', 3: '博士门槛' };
    const sal = top.c.salary.msc[0] ? top.c.salary.msc[0] + '-' + top.c.salary.msc[1] + ' 万' : '—';
    const deg = top.c.needDegree === 1 ? 'bsc' : top.c.needDegree === 2 ? 'msc' : 'phd';

    sec.innerHTML =
      '<div class="res-hero card">' +
        '<div class="res-top">' +
          '<div class="res-ic">' + top.c.icon + '</div>' +
          '<div class="res-info"><div class="res-tag">最适合你的 AI 职业</div>' +
          '<h2>' + top.c.name + ' <span class="en">' + top.c.en + '</span></h2>' +
          '<p class="res-tagline">' + top.c.tagline + '</p>' +
          '<div class="res-actions"><button class="btn primary" data-go="plan">🗺️ 生成专属路线图</button>' +
          '<button class="btn ghost" data-go="degree">🎓 看学历建议</button>' +
          '<button class="btn ghost" data-go="report">📄 导出报告</button></div>' +
          '</div>' +
          '<div class="res-match"><div class="rm-num">' + top.match + '<small>%</small></div><div class="rm-lab">匹配度</div></div>' +
        '</div>' +
        '<div class="res-grid">' +
          '<div class="res-desc"><p>' + top.c.desc + '</p>' +
          '<div class="res-rows">' +
            '<div><span>💰 薪资参考(硕)</span><b>' + sal + '</b></div>' +
            '<div><span>🎓 学历门槛</span><b>' + needDegree[top.c.needDegree] + '</b></div>' +
            '<div><span>🔥 岗位热度</span>' + APP.bar(top.c.demand, 'warm') + '<b class="inline">' + top.c.demand + '</b></div>' +
            '<div><span>🚀 增长趋势</span>' + APP.bar(top.c.growth, 'cool') + '<b class="inline">' + top.c.growth + '</b></div>' +
          '</div></div>' +
          '<div id="quiz-radar" style="height:300px"></div>' +
        '</div>' +
      '</div>' +
      '<div class="grid g2">' +
        top3.slice(1).map(x =>
          '<div class="card res-card2">' +
            '<div class="rc2-head"><span class="rc2-ic">' + x.c.icon + '</span><b>' + x.c.name + '</b>' +
            '<span class="rc2-match">' + x.match + '%</span></div>' +
            '<p class="muted sm">' + x.c.tagline + '</p>' +
            '<div class="rc2-foot"><span>🎓 ' + needDegree[x.c.needDegree] + '</span><span>💰 硕士 ' + (x.c.salary.msc[0] || '—') + '-' + (x.c.salary.msc[1] || '—') + ' 万</span></div>' +
          '</div>').join('') +
      '</div>' +
      '<div class="card">' +
        '<div class="card-t">13 个 AI 职业完整匹配排名 <button class="btn ghost sm" id="quiz-again">↻ 重新测评</button></div>' +
        '<table class="tbl"><thead><tr><th>#</th><th>职业</th><th>匹配度</th><th>学历</th><th>热度</th><th>硕士薪资(万/年)</th></tr></thead><tbody>' +
        saved.list.map((x, i) => {
          const c = DATA.careers.find(cc => cc.id === x.id);
          return '<tr' + (i < 3 ? ' class="top3"' : '') + '><td>' + (i + 1) + '</td><td><span class="c-ic">' + c.icon + '</span> ' + c.name + '</td>' +
            '<td><div class="match-cell"><div class="hbar hbar-sm"><div class="hbar-fill" style="width:' + (x.match - 55) / 44 * 100 + '%"></div></div><b>' + x.match + '%</b></div></td>' +
            '<td>' + needDegree[c.needDegree] + '</td><td>' + c.demand + '</td><td>' + (c.salary.msc[0] || '—') + '-' + (c.salary.msc[1] || '—') + '</td></tr>';
        }).join('') + '</tbody></table>' +
      '</div>' +
      '<p class="foot-note">测评结果为兴趣与能力画像的启发式匹配,仅供规划参考;岗位数据为公开信息整理。</p>';

    /* 重新测评按钮 */
    const again = sec.querySelector('#quiz-again');
    if (again) again.addEventListener('click', async () => {
      if (await APP.confirm('重新测评将覆盖当前结果,确定吗?')) this.renderIntro(sec);
    });
    sec.querySelectorAll('[data-go]').forEach(el => el.addEventListener('click', () => APP.go(el.dataset.go)));

    /* 雷达图:你的画像 vs 第一职业 */
    const radar = document.getElementById('quiz-radar');
    if (radar) {
      const F = APP.chartFrag();
      APP.mkChart(radar, {
        tooltip: F.tooltipStyle,
        legend: Object.assign({ data: ['你的画像', top.c.name] }, F.legendStyle),
        radar: {
          indicator: DATA.dims.map(d => ({ name: d.name, max: 10 })),
          radius: '68%',
          axisName: { color: P.ink2, fontSize: 12 },
          splitLine: { lineStyle: { color: P.grid, width: 1 } },
          splitArea: { show: false },
          axisLine: { lineStyle: { color: P.grid, width: 1 } }
        },
        series: [{
          type: 'radar',
          data: [
            { value: DATA.dims.map(d => full[d.id]), name: '你的画像',
              lineStyle: { width: 2, color: P.series[0] }, areaStyle: { color: P.wash },
              itemStyle: { color: P.series[0] }, symbolSize: 4 },
            { value: DATA.dims.map(d => top.c.profile[d.id]), name: top.c.name,
              lineStyle: { width: 2, color: P.series[1], type: 'solid' }, areaStyle: { color: 'rgba(0,0,0,0)' },
              itemStyle: { color: P.series[1] }, symbolSize: 4 }
          ]
        }]
      });
    }
    APP.updateBadges();
  },

  unmount() {}
});

/* ============================================================
 * 学历决策页
 * ============================================================ */
APP.degreeEngine = {
  compute(answers) {
    const qs = DATA.degreeQ;
    let pos = 0, neg = 0, maxP = 0, maxN = 0;
    const fac = { research: [0, 0], academic: [0, 0], career: [0, 0], time: [0, 0], econ: [0, 0] };
    qs.forEach((item, qi) => {
      const s = answers[qi] == null ? 0 : item.options[answers[qi]].s;
      if (s > 0) { pos += s; maxP += item.options.reduce((m, o) => Math.max(m, o.s), 0); }
      else { neg += -s; maxN += item.options.reduce((m, o) => Math.max(m, -o.s), 0); }
      const f = fac[item.f];
      f[0] += (s > 0 ? s : 0); f[1] += (s < 0 ? -s : 0);
    });
    const rScore = Math.round(100 * pos / (maxP || 1));
    const pScore = Math.round(100 * neg / (maxN || 1));
    const fPct = {};
    ['research', 'academic', 'career', 'time', 'econ'].forEach(k => {
      const total = qs.filter(x => x.f === k).reduce((m, x) => m + x.options.reduce((mm, o) => Math.max(mm, Math.abs(o.s)), 0), 0);
      fPct[k] = Math.round(100 * fac[k][0] / (total || 1));
    });
    /* 就业导向/时间敏感/经济压力 用反向值(负分占比) */
    fPct.career = Math.round(100 * fac.career[1] / (qs.filter(x => x.f === 'career').reduce((m, x) => m + x.options.reduce((mm, o) => Math.max(mm, -o.s), 0), 0) || 1));
    fPct.time = Math.round(100 * fac.time[1] / (qs.filter(x => x.f === 'time').reduce((m, x) => m + x.options.reduce((mm, o) => Math.max(mm, -o.s), 0), 0) || 1));
    fPct.econ = Math.round(100 * fac.econ[1] / (qs.filter(x => x.f === 'econ').reduce((m, x) => m + x.options.reduce((mm, o) => Math.max(mm, -o.s), 0), 0) || 1));
    return { rScore, pScore, fPct };
  },

  decide(r, quiz) {
    const why = [], pros = [], cons = [];
    let rec = 'profMsc';
    let score = 0;

    const career = quiz && quiz.top3 && quiz.top3[0] ? DATA.careers.find(c => c.id === quiz.top3[0].id) : null;
    if (career) {
      if (career.needDegree === 3) { score += 30; why.push('你的职业方向「' + career.name + '」以博士为门槛(如研究科学家/AI Lab),想走这条路建议直博。'); }
      else if (career.needDegree === 2) { score += 8; why.push('「' + career.name + '」主流要求硕士学历,读硕是最稳的路径。'); }
      else { score -= 12; why.push('「' + career.name + '」本科即可入场,工作经验比学历更值钱。'); }
    }
    if (r.rScore >= 75) { score += 16; why.push('你对研究本身兴趣很强(' + r.rScore + '分),具备读博的核心内驱力。'); }
    else if (r.rScore >= 50) { score += 4; }
    else { score -= 10; why.push('科研兴趣偏弱(' + r.rScore + '分),读博大概率会很煎熬,建议慎重。'); }
    if (r.fPct.academic >= 60) { score += 8; why.push('你的成绩与"硬通货"基础不错,升学筹码充足。'); }
    if (r.fPct.econ >= 70) { score -= 14; why.push('经济压力较大,先就业积累再考虑深造是理性选择。'); }
    if (r.fPct.time >= 70) { score -= 8; why.push('你对时间节奏比较敏感,博士 5-6 年的周期需要三思。'); }
    if (r.pScore >= 65) { score -= 6; }

    if (score >= 18) rec = 'phd';
    else if (score >= -12) rec = (r.rScore >= 62 || score >= 6) ? 'acadMsc' : 'profMsc';
    else rec = 'job';

    /* 置信度 */
    let conf = Math.round(Math.min(95, Math.max(55, 62 + Math.abs(score) * 1.1)));

    const name = { job: '本科直接就业', profMsc: '专业硕士 → 就业', acadMsc: '学术硕士 → 就业/深造', phd: '博士(研究路线)' }[rec];
    const icon = { job: '💼', profMsc: '🎓', acadMsc: '📖', phd: '🔬' }[rec];

    const prosAll = {
      job: ['最早进入行业,吃满 AI 红利期', '零学费成本,直接积累 3 年工作经验与薪资', '工程/产品类岗位完全够用,晋升看能力不卡学历', '保留读研选项:工作 1-2 年后深造目标更清晰'],
      profMsc: ['算法岗主流学历,进可攻退可守', '多 2-3 年缓冲期,补足实习与项目短板', '起薪与天花板普遍高于本科', '校招通道更宽,研究岗以外的岗位全覆盖'],
      acadMsc: ['为读博留好跳板,读不下去可就业', '接触科研方法论,保底算法岗', '奖学金覆盖学费的可能性高'],
      phd: ['打开研究岗天花板:研究院/AI Lab/教职', '长期复利最高,行业稀缺性极强', '5-6 年深度训练,定义问题能力是硬壁垒', '毕业即专家,起薪与职级双高']
    };
    const consAll = {
      job: ['错过校招学历红利,部分大厂算法岗简历关难过', '研究类岗位基本无缘', '行业下行期本科竞争力最先承压'],
      profMsc: ['2-3 年时间成本 + 学费', '若导师放养、方向不对,容易空转', '内卷严重,普通院校硕士性价比打折'],
      acadMsc: ['科研成果不足则不如专硕务实', '延毕风险与科研压力并存'],
      phd: ['5-6 年时间成本,期间收入极低', '毕业难度大,对心理韧性要求高', '方向选错沉没成本巨大', '学术圈岗位竞争同样激烈']
    };
    pros.push.apply(pros, prosAll[rec]);
    cons.push.apply(cons, consAll[rec]);

    return { rec, conf, why: why.slice(0, 3), pros, cons, name, icon };
  }
};

APP.registerPage('degree', {
  state: { idx: 0, answers: [] },

  mount(sec) {
    const saved = APP.store.get('degree');
    if (!saved) this.renderIntro(sec); else this.renderResult(sec, saved);
  },

  renderIntro(sec) {
    sec.innerHTML =
      '<div class="card intro">' +
        '<div class="intro-hero">🎓</div>' +
        '<h2>硕 / 博 / 就业 决策评估</h2>' +
        '<p class="intro-p">10 道题,从<b>科研兴趣 · 学术潜力 · 就业导向 · 时间敏感 · 经济压力</b>五个维度,结合你的职业测评结果,给出学历路径建议。</p>' +
        '<div class="grid g3">' + DATA.degreePaths.map(p =>
          '<div class="dim-card"><div class="dim-ic">' + p.icon + '</div><b>' + p.name + '</b>' +
          '<p>时间成本 ' + p.years + ' 年 · 起薪约 ' + p.start + ' 万/年</p><p class="sm muted">' + p.desc + '</p></div>').join('') +
        '</div>' +
        '<p class="muted sm">约 3 分钟 · 结果结合职业测评联动 · 可重新评估</p>' +
        '<button class="btn primary lg" id="deg-start">开始评估 →</button>' +
      '</div>';
    sec.querySelector('#deg-start').addEventListener('click', () => this.start(sec));
  },

  start(sec) {
    this.state = { idx: 0, answers: [] };
    this.renderQuestion(sec);
  },

  renderQuestion(sec) {
    const st = this.state, item = DATA.degreeQ[st.idx];
    sec.innerHTML =
      '<div class="quiz-wrap">' +
        '<div class="quiz-prog"><div class="quiz-prog-fill" style="width:' + (st.idx / DATA.degreeQ.length * 100) + '%"></div></div>' +
        '<div class="quiz-meta">第 <b>' + (st.idx + 1) + '</b> / ' + DATA.degreeQ.length + ' 题' +
        (st.idx > 0 ? '<button class="btn ghost sm" id="deg-back">← 上一题</button>' : '') + '</div>' +
        '<div class="card quiz-card"><h2 class="quiz-q">' + APP.esc(item.q) + '</h2>' +
        '<div class="quiz-opts">' + item.options.map((o, i) =>
          '<button class="quiz-opt" data-i="' + i + '"><span class="qo-key">' + String.fromCharCode(65 + i) + '</span><span>' + APP.esc(o.t) + '</span></button>').join('') +
        '</div></div></div>';
    sec.querySelectorAll('.quiz-opt').forEach(b => {
      b.addEventListener('click', () => {
        st.answers[st.idx] = +b.dataset.i;
        b.classList.add('picked');
        setTimeout(() => {
          if (st.idx < DATA.degreeQ.length - 1) { st.idx++; this.renderQuestion(sec); }
          else {
            const r = APP.degreeEngine.compute(st.answers);
            const quiz = APP.store.get('quiz');
            const d = APP.degreeEngine.decide(r, quiz);
            APP.store.set('degree', Object.assign({ r }, d, { date: APP.fmt.today() }));
            this.renderResult(sec, APP.store.get('degree'));
            APP.updateBadges();
          }
        }, 220);
      });
    });
    const back = sec.querySelector('#deg-back');
    if (back) back.addEventListener('click', () => { if (st.idx > 0) { st.idx--; this.renderQuestion(sec); } });
  },

  renderResult(sec, saved) {
    const P = APP.palette();
    const f = saved.r.fPct;
    sec.innerHTML =
      '<div class="res-hero card">' +
        '<div class="res-top">' +
          '<div class="res-ic">' + saved.icon + '</div>' +
          '<div class="res-info"><div class="res-tag">学历路径建议</div>' +
          '<h2>' + saved.name + ' <span class="en">置信度 ' + saved.conf + '%</span></h2>' +
          '<div class="res-actions"><button class="btn primary" data-go="plan">🗺️ 查看阶段规划</button>' +
          '<button class="btn ghost" data-go="quiz">🎯 回顾职业测评</button>' +
          '<button class="btn ghost" data-go="report">📄 导出报告</button></div></div>' +
          '<div class="res-match"><div class="rm-num">' + saved.conf + '<small>%</small></div><div class="rm-lab">置信度</div></div>' +
        '</div>' +
        '<div class="res-grid">' +
          '<div class="res-desc"><div class="res-tag">决策依据</div><ul class="why-list">' +
            saved.why.map(w => '<li>' + APP.esc(w) + '</li>').join('') +
          '</ul></div>' +
          '<div id="deg-radar" style="height:300px"></div>' +
        '</div>' +
      '</div>' +
      '<div class="grid g2">' +
        '<div class="card"><div class="card-t">✅ 这个选择的优势</div><ul class="why-list">' + saved.pros.map(x => '<li>' + APP.esc(x) + '</li>').join('') + '</ul></div>' +
        '<div class="card"><div class="card-t">⚠️ 代价与风险</div><ul class="why-list warn">' + saved.cons.map(x => '<li>' + APP.esc(x) + '</li>').join('') + '</ul></div>' +
      '</div>' +
      '<div class="grid g2">' +
        '<div class="card"><div class="card-t">三条路径 ROI 对比 <span class="card-src">参考数据(万元)</span></div>' +
          '<div id="deg-roi" style="height:280px"></div>' +
          '<table class="tbl sm-tbl"><thead><tr><th>路径</th><th>时间成本</th><th>起薪</th><th>5年累计</th><th>天花板</th></tr></thead><tbody>' +
          DATA.degreePaths.map(p => '<tr><td>' + p.name + '</td><td>' + p.years + ' 年</td><td>' + p.start + '</td><td>' + p.five + '</td><td>' + p.ceiling + '+</td></tr>').join('') +
          '</tbody></table></div>' +
        '<div class="card"><div class="card-t">你的决策矩阵定位</div><div id="deg-matrix" style="height:280px"></div>' +
          '<p class="muted sm">横轴=就业导向,纵轴=科研兴趣。右上:科研与工业两栖(博士);右下:应用路线(硕士);左上:学术路线(博士);左下:先就业再定。</p></div>' +
      '</div>' +
      '<div class="card"><div class="card-t">常见误区澄清 <button class="btn ghost sm" id="deg-again">↻ 重新评估</button></div>' +
        '<div class="myth-list">' + DATA.myths.map((m, i) =>
          '<details class="myth"><summary>' + APP.esc(m.t) + '</summary><p>' + APP.esc(m.a) + '</p></details>').join('') +
      '</div></div>' +
      '<p class="foot-note">学历决策是多目标优化问题,本评估提供参考框架;最终决定请结合家庭、导师机会与个人志向。</p>';

    const again = sec.querySelector('#deg-again');
    if (again) again.addEventListener('click', async () => {
      if (await APP.confirm('重新评估将覆盖当前结果,确定吗?')) this.renderIntro(sec);
    });
    sec.querySelectorAll('[data-go]').forEach(el => el.addEventListener('click', () => APP.go(el.dataset.go)));

    /* 因子雷达 */
    const rad = document.getElementById('deg-radar');
    if (rad) {
      const F = APP.chartFrag();
      APP.mkChart(rad, {
        tooltip: F.tooltipStyle,
        radar: {
          indicator: [
            { name: '科研兴趣', max: 100 }, { name: '学术潜力', max: 100 }, { name: '就业导向', max: 100 },
            { name: '时间敏感', max: 100 }, { name: '经济压力', max: 100 }
          ],
          radius: '68%',
          axisName: { color: P.ink2, fontSize: 12 },
          splitLine: { lineStyle: { color: P.grid, width: 1 } },
          splitArea: { show: false },
          axisLine: { lineStyle: { color: P.grid, width: 1 } }
        },
        series: [{
          type: 'radar',
          data: [{ value: [f.research, f.academic, f.career, f.time, f.econ], name: '你的因子画像',
            lineStyle: { width: 2, color: P.series[0] }, areaStyle: { color: P.wash }, itemStyle: { color: P.series[0] }, symbolSize: 4 }]
        }]
      });
    }

    /* ROI 对比柱状图 */
    const roi = document.getElementById('deg-roi');
    if (roi) {
      const F = APP.chartFrag();
      const mkBar = (name, data, color) => ({
        name, type: 'bar', data, barMaxWidth: 18,
        itemStyle: { color, borderColor: P.surface, borderWidth: 2, borderRadius: [4, 4, 0, 0] }
      });
      APP.mkChart(roi, {
        tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'shadow' } }, F.tooltipStyle),
        legend: Object.assign({ data: ['起薪(万/年)', '5年累计(万)', '天花板(万/年)'] }, F.legendStyle),
        xAxis: Object.assign({ type: 'category', data: DATA.degreePaths.map(p => p.name) }, F.axisStyle, { splitLine: { show: false } }),
        yAxis: Object.assign({ type: 'value', name: '万元' }, F.axisStyle),
        series: [
          mkBar('起薪(万/年)', DATA.degreePaths.map(p => p.start), P.series[0]),
          mkBar('5年累计(万)', DATA.degreePaths.map(p => p.five), P.series[1]),
          mkBar('天花板(万/年)', DATA.degreePaths.map(p => p.ceiling), P.series[2])
        ]
      });
    }

    /* 决策矩阵散点(单点,无分类身份问题) */
    const mx = document.getElementById('deg-matrix');
    if (mx) {
      const F = APP.chartFrag();
      const zone = 'rgba(148,163,184,0.07)';
      APP.mkChart(mx, {
        tooltip: Object.assign({ trigger: 'item', formatter: p => p.name + '<br/>就业导向 ' + p.value[0] + ' · 科研兴趣 ' + p.value[1] }, F.tooltipStyle),
        grid: { left: 10, right: 16, top: 20, bottom: 8, containLabel: true },
        xAxis: Object.assign({ type: 'value', name: '就业导向 →', min: 0, max: 100, splitLine: { show: false } }, F.axisStyle),
        yAxis: Object.assign({ type: 'value', name: '科研兴趣 →', min: 0, max: 100 }, F.axisStyle),
        series: [{
          type: 'scatter',
          symbolSize: 22,
          data: [{ value: [f.career, f.research], name: '你', itemStyle: { color: P.series[0], borderColor: P.surface, borderWidth: 2 } }],
          markArea: {
            silent: true,
            data: [
              [{ coord: [50, 50] }, { coord: [100, 100] }, { itemStyle: { color: zone }, label: { show: true, position: 'insideTopRight', color: P.muted, fontSize: 10, formatter: '两栖·博士' } }],
              [{ coord: [0, 50] }, { coord: [50, 100] }, { itemStyle: { color: zone }, label: { show: true, position: 'insideTopLeft', color: P.muted, fontSize: 10, formatter: '学术·博士' } }],
              [{ coord: [50, 0] }, { coord: [100, 50] }, { itemStyle: { color: zone }, label: { show: true, position: 'insideBottomRight', color: P.muted, fontSize: 10, formatter: '应用·硕士' } }],
              [{ coord: [0, 0] }, { coord: [50, 50] }, { itemStyle: { color: zone }, label: { show: true, position: 'insideBottomLeft', color: P.muted, fontSize: 10, formatter: '就业先行' } }]
            ]
          }
        }]
      });
    }
    APP.updateBadges();
  },

  unmount() {}
});
