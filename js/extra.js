/* ============================================================
 * AI 专业生涯规划 — 成长工具/资源库/我的报告 (extra.js)
 * ============================================================ */
'use strict';

/* ================= 成长工具页 ================= */
APP.growth = {
  tab: 'checkin',

  /* 技能树进度(供总览页调用) */
  skillProgress() {
    const career = APP.store.get('skill_career', '') || (APP.store.get('quiz') && APP.store.get('quiz').top3[0].id) || 'ml';
    const levels = APP.store.get('skills', {})[career] || {};
    const nodes = DATA.skills.common.concat(DATA.skills.byCareer[career] || []);
    let done = 0, total = nodes.length * 3;
    nodes.forEach(n => { done += levels[n.id] || 0; });
    return { pct: total ? Math.round(done / total * 100) : 0, done, total };
  }
};

APP.registerPage('growth', {
  mount(sec) {
    sec.innerHTML =
      '<div class="filter-row">' +
        '<button class="btn ' + (APP.growth.tab === 'checkin' ? 'primary' : 'ghost') + ' sm gt-btn" data-t="checkin">📅 打卡日历</button>' +
        '<button class="btn ' + (APP.growth.tab === 'skills' ? 'primary' : 'ghost') + ' sm gt-btn" data-t="skills">🌳 技能树</button>' +
        '<button class="btn ' + (APP.growth.tab === 'interview' ? 'primary' : 'ghost') + ' sm gt-btn" data-t="interview">🎤 模拟面试</button>' +
      '</div><div id="growth-body"></div>';
    sec.querySelectorAll('.gt-btn').forEach(b => b.addEventListener('click', () => {
      APP.growth.tab = b.dataset.t;
      sec.querySelectorAll('.gt-btn').forEach(x => x.classList.remove('primary'));
      b.classList.add('primary');
      this.render(sec);
    }));
    this.render(sec);
  },

  render(sec) {
    const body = sec.querySelector('#growth-body');
    if (APP.growth.tab === 'checkin') this.renderCheckin(body);
    else if (APP.growth.tab === 'skills') this.renderSkills(body);
    else this.renderInterview(body);
  },

  /* ---------- 打卡日历(GitHub 风格) ---------- */
  renderCheckin(body) {
    const days = APP.store.get('checkin', []);
    const today = APP.fmt.today();
    /* 最近 26 周 */
    const now = new Date();
    const start = new Date(now); start.setDate(now.getDate() - 25 * 7);
    start.setDate(start.getDate() - start.getDay()); /* 对齐到周日 */
    const cells = [];
    let total = 0;
    for (let i = 0; i < 26 * 7; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);
      const key = APP.fmt.date(d);
      const on = days.indexOf(key) >= 0;
      if (on) total++;
      const isToday = key === today;
      const future = key > today;
      cells.push('<div class="heat-cell' + (on ? ' on' : '') + (isToday ? ' today' : '') + (future ? ' fut' : '') + '" data-k="' + key + '" title="' + key + (on ? ' · 已打卡' : '') + '"></div>');
    }
    let streak = 0, longest = 0, cur = 0;
    for (let i = 0; i < 26 * 7; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);
      if (days.indexOf(APP.fmt.date(d)) >= 0) { cur++; longest = Math.max(longest, cur); } else cur = 0;
    }
    let s = 0; const dd = new Date();
    if (days.indexOf(APP.fmt.date(dd)) < 0) dd.setDate(dd.getDate() - 1);
    while (days.indexOf(APP.fmt.date(dd)) >= 0) { s++; dd.setDate(dd.getDate() - 1); }
    streak = s;
    const doneToday = days.indexOf(today) >= 0;

    body.innerHTML =
      '<div class="card"><div class="card-t">学习打卡热力图 <span class="card-src">最近 26 周 · 点击"今日"打卡</span></div>' +
      '<div class="heat-stats">' +
        '<div class="stat"><div class="stat-lab">总打卡</div><div class="stat-val">' + total + ' 天</div></div>' +
        '<div class="stat"><div class="stat-lab">连续打卡</div><div class="stat-val">' + streak + ' 天</div></div>' +
        '<div class="stat"><div class="stat-lab">最长纪录</div><div class="stat-val">' + longest + ' 天</div></div>' +
        '<div class="stat"><div class="stat-lab">今日</div><div class="stat-val">' + (doneToday ? '已打卡 ✅' : '未打卡') + '</div></div>' +
        '<button class="btn ' + (doneToday ? 'ghost' : 'primary') + ' sm" id="checkin-btn">' + (doneToday ? '取消今日打卡' : '📌 今日打卡') + '</button>' +
      '</div>' +
      '<div class="heat-wrap"><div class="heat-week">' + ['日', '一', '二', '三', '四', '五', '六'].map(x => '<span>' + x + '</span>').join('') + '</div>' +
      '<div class="heat-grid">' + cells.join('') + '</div></div>' +
      '<div class="heat-legend"><span>少</span><i class="hl0"></i><i class="hl1"></i><span>多</span></div>' +
      '<p class="muted sm">💡 打卡数据保存在本机浏览器;连续打卡是复利,断一天只扣心态不扣数据。</p></div>';

    const btn = body.querySelector('#checkin-btn');
    btn.addEventListener('click', () => {
      let arr = APP.store.get('checkin', []);
      const idx = arr.indexOf(today);
      if (idx >= 0) arr.splice(idx, 1); else arr.push(today);
      APP.store.set('checkin', arr);
      APP.updateBadges();
      this.renderCheckin(body);
      APP.toast(idx >= 0 ? '已取消今日打卡' : '打卡成功,继续保持! 🔥', 'success');
    });
    /* 点击今日格也可打卡 */
    body.querySelectorAll('.heat-cell').forEach(el => {
      el.addEventListener('click', () => {
        if (el.dataset.k === today) btn.click();
        else if (el.dataset.k < today) {
          let arr = APP.store.get('checkin', []);
          const i = arr.indexOf(el.dataset.k);
          if (i >= 0) { arr.splice(i, 1); APP.toast('已取消 ' + el.dataset.k + ' 的打卡', 'info'); }
          else { arr.push(el.dataset.k); APP.toast('补打卡 ' + el.dataset.k + ' ✓', 'success'); }
          APP.store.set('checkin', arr);
          this.renderCheckin(body);
        }
      });
    });
  },

  /* ---------- 技能树 ---------- */
  renderSkills(body) {
    const quiz = APP.store.get('quiz');
    const savedCareer = APP.store.get('skill_career', '');
    const career = savedCareer || (quiz && quiz.top3[0].id) || 'ml';
    const levels = APP.store.get('skills', {})[career] || {};
    const nodes = DATA.skills.common.concat(DATA.skills.byCareer[career] || []);
    const cats = {};
    nodes.forEach(n => { (cats[n.cat] = cats[n.cat] || []).push(n); });
    const prog = APP.growth.skillProgress();

    body.innerHTML =
      '<div class="card"><div class="card-t">技能树 <span class="card-src">点击圆点提升等级:0 未学 → 3 精通</span>' +
        '<select id="skill-sel" class="sel">' + DATA.careers.map(c => '<option value="' + c.id + '"' + (c.id === career ? ' selected' : '') + '>' + c.icon + ' ' + c.name + '</option>').join('') + '</select></div>' +
        '<div class="skill-top"><div class="ring" style="--p:' + prog.pct + '"><span>' + prog.pct + '%</span></div>' +
        '<div><b>总体掌握度</b><p class="muted sm">已升 ' + prog.done + ' 级 / 共 ' + prog.total + ' 级(每次点击提升 1 级)</p>' +
        (quiz ? '<p class="muted sm">当前职业来自你的测评结果「' + (DATA.careers.find(c => c.id === career) || {}).name + '」,可切换查看其他职业的技能树</p>' : '') +
        '</div></div>' +
        Object.keys(cats).map(cat => '<div class="skill-cat">' + APP.tag(cat, 'cat-tag') +
          '<div class="skill-grid">' + cats[cat].map(n => {
            const lv = levels[n.id] || 0;
            return '<div class="skill-node" data-id="' + n.id + '"><div class="sn-name">' + n.name + '<span class="sn-lv">' + ['未学', '了解', '熟练', '精通'][lv] + '</span></div>' +
              '<p class="sn-desc">' + APP.esc(n.desc) + '</p>' +
              '<div class="sn-dots">' + [0, 1, 2].map(i => '<i data-lv="' + (i + 1) + '" class="' + (lv > i ? 'on' : '') + '"></i>').join('') + '</div></div>';
          }).join('') + '</div></div>').join('') +
      '</div>';

    body.querySelector('#skill-sel').addEventListener('change', e => {
      APP.store.set('skill_career', e.target.value);
      this.renderSkills(body);
    });
    body.querySelectorAll('.skill-node').forEach(nodeEl => {
      nodeEl.querySelectorAll('.sn-dots i').forEach(dot => {
        dot.addEventListener('click', () => {
          const lv = +dot.dataset.lv;
          const careerNow = APP.store.get('skill_career', '') || (quiz && quiz.top3[0].id) || 'ml';
          const all = APP.store.get('skills', {});
          const cur = (all[careerNow] = all[careerNow] || {});
          cur[nodeEl.dataset.id] = cur[nodeEl.dataset.id] === lv ? lv - 1 : lv;
          APP.store.set('skills', all);
          this.renderSkills(body);
        });
      });
    });
  },

  /* ---------- 模拟面试 ---------- */
  renderInterview(body) {
    const mastered = APP.store.get('interview', {});
    const cats = ['全部'].concat(Array.from(new Set(DATA.interview.map(x => x.cat))));
    const cat = this._icat || '全部';
    const list = cat === '全部' ? DATA.interview : DATA.interview.filter(x => x.cat === cat);
    const done = DATA.interview.filter(x => mastered[x.q]).length;

    body.innerHTML =
      '<div class="card"><div class="card-t">AI 面试题库 <span class="card-src">点击卡片翻转查看答题思路</span>' +
        '<span class="iv-prog">已掌握 ' + done + '/' + DATA.interview.length + '</span></div>' +
        '<div class="filter-row">' + cats.map(c => '<button class="btn ' + (c === cat ? 'primary' : 'ghost') + ' sm icat-btn" data-c="' + c + '">' + c + '</button>').join('') +
        '<button class="btn ghost sm" id="iv-rand">🎲 随机抽一题</button></div>' +
        '<div class="iv-grid">' + list.map((x, i) =>
          '<div class="iv-card' + (mastered[x.q] ? ' mastered' : '') + '" data-i="' + i + '">' +
            '<div class="iv-front"><span class="iv-cat">' + x.cat + '</span><p>' + APP.esc(x.q) + '</p><span class="iv-flip">点击查看思路 ↻</span></div>' +
            '<div class="iv-back"><p class="iv-hint">' + APP.esc(x.hint) + '</p><button class="btn sm ' + (mastered[x.q] ? 'primary' : 'ghost') + ' iv-ok">' + (mastered[x.q] ? '★ 已掌握' : '☆ 标记掌握') + '</button></div>' +
          '</div>').join('') +
      '</div></div>';

    body.querySelectorAll('.icat-btn').forEach(b => b.addEventListener('click', () => {
      this._icat = b.dataset.c;
      this.renderInterview(body);
    }));
    const rand = body.querySelector('#iv-rand');
    if (rand) rand.addEventListener('click', () => {
      const pick = Math.floor(Math.random() * list.length);
      const card = body.querySelectorAll('.iv-card')[pick];
      if (card) { card.classList.add('flip'); card.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    });
    body.querySelectorAll('.iv-card').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('.iv-ok')) return;
        card.classList.toggle('flip');
      });
      const ok = card.querySelector('.iv-ok');
      ok.addEventListener('click', e => {
        e.stopPropagation();
        const listNow = cat === '全部' ? DATA.interview : DATA.interview.filter(x => x.cat === cat);
        const x = listNow[+card.dataset.i];
        const m = APP.store.get('interview', {});
        if (m[x.q]) delete m[x.q]; else m[x.q] = true;
        APP.store.set('interview', m);
        this.renderInterview(body);
      });
    });
  },

  unmount() {}
});

/* ================= 资源库页 ================= */
APP.registerPage('resources', {
  tab: 'res',
  cat: '全部',

  mount(sec) {
    sec.innerHTML =
      '<div class="filter-row">' +
        '<button class="btn ' + (this.tab === 'res' ? 'primary' : 'ghost') + ' sm rt-btn" data-t="res">📚 学习资源</button>' +
        '<button class="btn ' + (this.tab === 'comp' ? 'primary' : 'ghost') + ' sm rt-btn" data-t="comp">🏆 竞赛日历</button>' +
      '</div><div id="res-body"></div>';
    sec.querySelectorAll('.rt-btn').forEach(b => b.addEventListener('click', () => {
      this.tab = b.dataset.t;
      sec.querySelectorAll('.rt-btn').forEach(x => x.classList.remove('primary'));
      b.classList.add('primary');
      this.render(sec);
    }));
    this.render(sec);
  },

  render(sec) {
    const body = sec.querySelector('#res-body');
    if (this.tab === 'res') {
      const cats = ['全部'].concat(DATA.resources.map(r => r.cat));
      const list = this.cat === '全部' ? DATA.resources : DATA.resources.filter(r => r.cat === this.cat);
      body.innerHTML =
        '<div class="filter-row">' + cats.map(c => '<button class="btn ' + (c === this.cat ? 'primary' : 'ghost') + ' sm rcat-btn" data-c="' + c + '">' + c + '</button>').join('') + '</div>' +
        list.map(r => '<div class="card res-cat"><div class="card-t">' + r.icon + ' ' + r.cat + '</div>' +
          '<div class="res-grid">' + r.items.map(x =>
            '<a class="res-item" href="' + x.url + '" target="_blank" rel="noopener"><b>' + APP.esc(x.name) + '</b><p>' + APP.esc(x.desc) + '</p><span class="res-go">打开 ↗</span></a>').join('') +
          '</div></div>').join('') +
        '<p class="foot-note">资源均为公开免费内容,外链将在新标签页打开。</p>';
      body.querySelectorAll('.rcat-btn').forEach(b => b.addEventListener('click', () => {
        this.cat = b.dataset.c;
        this.render(sec);
      }));
    } else {
      body.innerHTML =
        '<div class="card"><div class="card-t">全年竞赛日历 <span class="card-src">按月份排列 · 建议参赛年级仅供参考</span></div>' +
        '<div class="comp-list">' + DATA.comps.map(c =>
          '<div class="comp-row"><div class="comp-month">' + c.month + '</div>' +
          '<div class="comp-info"><b>' + APP.esc(c.name) + '</b><p>' + APP.esc(c.org) + '</p></div>' +
          APP.tag('适合 ' + c.stage) + '</div>').join('') +
        '</div>' +
        '<p class="muted sm" style="margin-top:12px">💡 建议节奏:大一蓝桥/数学竞赛热身 → 大二数模/天梯赛冲奖 → 大三 Kaggle/BDCI 攒硬通货 → 大四专注升学与秋招。</p></div>';
    }
  },

  unmount() {}
});

/* ================= 我的报告页 ================= */
APP.registerPage('report', {
  mount(sec) {
    const quiz = APP.store.get('quiz');
    const degree = APP.store.get('degree');
    const checkins = APP.store.get('checkin', []);
    const prog = APP.plan.overallProgress();
    const degreeName = { job: '本科直接就业', profMsc: '专业硕士 → 就业', acadMsc: '学术硕士 → 就业/深造', phd: '博士(研究路线)' };
    const top = quiz && quiz.top3 ? quiz.top3.map(x => { const c = DATA.careers.find(c => c.id === x.id); return { c, match: x.match }; }) : null;

    sec.innerHTML =
      '<div class="report-actions no-print">' +
        (window.ARTIFACT_MODE ? '<p class="muted sm" style="align-self:center">📋 在线版:数据保存在你当前浏览器;打印/导出文件请使用桌面版</p>'
          : '<button class="btn primary" id="rp-print">🖨️ 打印 / 存为 PDF</button>') +
        '<button class="btn ghost" id="rp-json">' + (window.ARTIFACT_MODE ? '📋 复制 JSON' : '⬇️ 导出 JSON') + '</button>' +
        '<button class="btn danger" id="rp-reset">🗑️ 清空全部数据</button>' +
      '</div>' +
      '<div class="report-doc" id="report-doc">' +
        '<div class="rp-head"><h1>🎓 AI 专业生涯规划 · 个人规划报告</h1>' +
        '<p>生成时间:' + new Date().toLocaleString('zh-CN') + ' · 数据来源:本机浏览器本地存储</p></div>' +
        '<div class="rp-sec"><h2>一、职业测评结果</h2>' +
          (top ? '<div class="rp-top3">' + top.map((x, i) =>
            '<div class="rp-job"><span class="rp-rank">' + (i + 1) + '</span><span>' + x.c.icon + ' ' + x.c.name + '</span><b>' + x.match + '%</b><p>' + x.c.tagline + '</p></div>').join('') + '</div>' +
            '<p class="rp-tip">推荐路径:' + top[0].c.suggest.msc + '</p>'
          : '<p class="muted">尚未完成职业测评 — 前往「职业测评」页完成 18 道题。</p>') +
        '</div>' +
        '<div class="rp-sec"><h2>二、学历决策</h2>' +
          (degree ? '<p><b>建议:' + degree.name + '</b>(置信度 ' + degree.conf + '%)</p><ul>' + degree.why.map(x => '<li>' + APP.esc(x) + '</li>').join('') + '</ul>' +
            '<p class="rp-tip">优势:' + degree.pros.slice(0, 2).join(';') + '</p>' +
            '<p class="rp-tip warn">风险:' + degree.cons.slice(0, 2).join(';') + '</p>'
          : '<p class="muted">尚未完成学历决策评估。</p>') +
        '</div>' +
        '<div class="rp-sec"><h2>三、阶段规划进度</h2>' +
          '<p>当前路线:' + (DATA.roadmap[APP.plan.path] || DATA.roadmap.bsc).name + ' · 总进度 <b>' + prog.pct + '%</b>(已完成 ' + prog.done + '/' + prog.total + ' 项)</p>' +
          '<p class="rp-tip">下一步:' + APP.esc(APP.plan.nextStep().stage + ' — ' + APP.plan.nextStep().text) + '</p>' +
        '</div>' +
        '<div class="rp-sec"><h2>四、成长数据</h2>' +
          '<p>累计打卡 <b>' + checkins.length + '</b> 天 · 技能树掌握度 <b>' + APP.growth.skillProgress().pct + '%</b></p>' +
        '</div>' +
        '<div class="rp-sec"><h2>五、行业快照(生成时)</h2>' +
          (APP.market && APP.market.idx && APP.market.idx.length ? '<p>AI 行业综合指数 <b>' + APP.fmt.num(APP.market.idx[APP.market.idx.length - 1], 2) + '</b>(' + APP.fmt.pct(APP.market.idxChg) + ')</p>' +
            '<p class="rp-tip">热点 Top3:' + APP.market.topics.slice().sort((a, b) => b.heat - a.heat).slice(0, 3).map(t => t.name).join(';') + '</p>' : '<p class="muted">行情引擎未运行。</p>') +
        '</div>' +
        '<p class="rp-foot">本报告由「AI 专业生涯规划」生成,测评与行情数据仅供参考,不构成任何决策或投资建议。</p>' +
      '</div>';

    const printBtn = sec.querySelector('#rp-print');
    if (printBtn) printBtn.addEventListener('click', () => window.print());
    sec.querySelector('#rp-json').addEventListener('click', () => {
      const data = {
        exported: new Date().toISOString(),
        quiz, degree,
        plan_path: APP.plan.path, plan_checked: APP.store.get('plan_checked', {}),
        checkins, skills: APP.store.get('skills', {}), interview: APP.store.get('interview', {})
      };
      if (window.ARTIFACT_MODE) {
        const text = JSON.stringify(data, null, 2);
        try {
          navigator.clipboard.writeText(text).then(
            () => APP.toast('已复制 JSON 报告到剪贴板', 'success'),
            () => APP.toast('复制失败,请手动选择文本', 'warn')
          );
        } catch (e) { APP.toast('复制失败,请手动选择文本', 'warn'); }
        return;
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'AI专业生涯规划-报告-' + APP.fmt.today() + '.json';
      a.click();
      APP.toast('已导出 JSON 报告', 'success');
    });
    sec.querySelector('#rp-reset').addEventListener('click', async () => {
      if (await APP.confirm('将清空测评/学历/路线图/打卡等全部本地数据,不可恢复。确定?', true)) {
        Object.keys(localStorage).filter(k => k.indexOf('aipc_') === 0).forEach(k => localStorage.removeItem(k));
        APP.toast('已清空全部数据,重新开始吧 🚀', 'success');
        APP.go('dashboard');
        APP.updateBadges();
      }
    });
  },

  unmount() {}
});
