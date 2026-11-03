/* ============================================================
 * AI 专业生涯规划 — 阶段规划路线图 (plan.js)
 * 按本科/硕士/博士阶段渲染日程表,勾选进度存本地,联动职业建议
 * ============================================================ */
'use strict';

APP.plan = {
  path: APP.store.get('plan_path', 'bsc'),

  itemId(stageId, kind, i) { return 'plan_' + stageId + '_' + kind + '_' + i; },

  checked() { return APP.store.get('plan_checked', {}); },

  toggle(id, on) {
    const c = this.checked();
    if (on) c[id] = true; else delete c[id];
    APP.store.set('plan_checked', c);
  },

  /* 全路径统计 */
  overallProgress() {
    const path = DATA.roadmap[this.path] || DATA.roadmap.bsc;
    const c = this.checked();
    let total = 0, done = 0;
    path.stages.forEach(st => {
      st.courses.forEach((x, i) => { total++; if (c[this.itemId(st.id, 'c', i)]) done++; });
      st.milestones.forEach((x, i) => { total++; if (c[this.itemId(st.id, 'm', i)]) done++; });
    });
    return { pct: total ? Math.round(done / total * 100) : 0, done, total };
  },

  /* 下一步未完成项 */
  nextStep() {
    const path = DATA.roadmap[this.path] || DATA.roadmap.bsc;
    const c = this.checked();
    for (const st of path.stages) {
      for (let i = 0; i < st.courses.length; i++) if (!c[this.itemId(st.id, 'c', i)]) return { stage: st.name + ' · ' + st.title, text: '课程: ' + st.courses[i] };
      for (let i = 0; i < st.milestones.length; i++) if (!c[this.itemId(st.id, 'm', i)]) return { stage: st.name + ' · ' + st.title, text: '里程碑: ' + st.milestones[i] };
    }
    return { stage: path.stages[path.stages.length - 1].name, text: '🎉 全部完成!按下一阶段(读研/入职)继续推进' };
  }
};

APP.registerPage('plan', {
  mount(sec) {
    const quiz = APP.store.get('quiz');
    const top = quiz && quiz.top3 && quiz.top3[0] ? DATA.careers.find(c => c.id === quiz.top3[0].id) : null;
    const degree = APP.store.get('degree');

    /* 学历决策联动:自动推荐路径 */
    let suggest = '';
    if (degree) {
      suggest = degree.rec === 'phd' ? 'phd' : (degree.rec === 'job' ? 'bsc' : 'msc');
    }
    const paths = [
      { id: 'bsc', name: '🎓 本科四年', range: '大一 → 大四' },
      { id: 'msc', name: '📚 硕士三年', range: '研一 → 研三' },
      { id: 'phd', name: '🔬 博士五年', range: '博一 → 博五' }
    ];
    const prog = APP.plan.overallProgress();

    sec.innerHTML =
      '<div class="filter-row">' +
        paths.map(p => '<button class="btn ' + (APP.plan.path === p.id ? 'primary' : 'ghost') + ' sm path-btn" data-path="' + p.id + '">' + p.name +
          (suggest === p.id ? ' <span class="mini-badge">推荐</span>' : '') + '</button>').join('') +
        '<span class="muted sm">' + (paths.find(p => p.id === APP.plan.path) || paths[0]).range + '</span>' +
      '</div>' +
      (top ? '<div class="banner">⭐ 已按你的测评结果(「' + top.icon + ' ' + top.name + '」)注入专属建议,在对应阶段以黄框显示</div>' : '') +
      '<div class="card plan-sum"><div class="sum-left"><b>总进度</b><span class="sum-num">' + prog.pct + '%</span></div>' +
        '<div class="sum-right"><div class="hbar hbar-lg"><div class="hbar-fill" style="width:' + prog.pct + '%"></div></div>' +
        '<span class="muted sm">已完成 ' + prog.done + ' / ' + prog.total + ' 项 · 数据保存在本地</span></div></div>' +
      '<div class="timeline" id="plan-timeline"></div>' +
      '<p class="foot-note">路线图基于公开的 AI 专业培养方案与校招时间线整理;勾选进度仅保存在本机浏览器。</p>';

    sec.querySelectorAll('.path-btn').forEach(b => b.addEventListener('click', () => {
      APP.plan.path = b.dataset.path;
      APP.store.set('plan_path', APP.plan.path);
      this.mount(sec);
    }));

    this.renderTimeline(sec);
  },

  renderTimeline(sec) {
    const path = DATA.roadmap[APP.plan.path] || DATA.roadmap.bsc;
    const c = APP.plan.checked();
    const quiz = APP.store.get('quiz');
    const top = quiz && quiz.top3 && quiz.top3[0] ? DATA.careers.find(x => x.id === quiz.top3[0].id) : null;
    const box = document.getElementById('plan-timeline');
    if (!box) return;

    box.innerHTML = path.stages.map((st, si) => {
      const items = [];
      st.courses.forEach((x, i) => {
        const id = APP.plan.itemId(st.id, 'c', i);
        items.push('<label class="task"><input type="checkbox" data-id="' + id + '"' + (c[id] ? ' checked' : '') + '><span>📘 ' + APP.esc(x) + '</span></label>');
      });
      st.milestones.forEach((x, i) => {
        const id = APP.plan.itemId(st.id, 'm', i);
        items.push('<label class="task"><input type="checkbox" data-id="' + id + '"' + (c[id] ? ' checked' : '') + '><span>🎯 ' + APP.esc(x) + '</span></label>');
      });
      const tips = top && top.tips ? top.tips.filter(t => t.stage === st.id) : [];
      const total = st.courses.length + st.milestones.length;
      const done = st.courses.filter((x, i) => c[APP.plan.itemId(st.id, 'c', i)]).length + st.milestones.filter((x, i) => c[APP.plan.itemId(st.id, 'm', i)]).length;
      return '<div class="tl-item">' +
        '<div class="tl-dot' + (done === total && total > 0 ? ' done' : '') + '">' + (si + 1) + '</div>' +
        '<div class="card tl-card">' +
          '<div class="tl-head"><b>' + st.name + '</b><span class="tl-title">' + st.title + '</span>' +
          '<span class="tl-prog">' + done + '/' + total + '</span></div>' +
          '<p class="tl-goal">🎯 阶段目标:' + APP.esc(st.goal) + '</p>' +
          '<div class="tl-tasks">' + items.join('') + '</div>' +
          (st.comps && st.comps.length ? '<div class="tl-comps">' + st.comps.map(x => APP.tag('🏆 ' + x)).join('') + '</div>' : '') +
          (tips.length ? tips.map(t => '<div class="tl-tip">⭐ 专属建议:' + APP.esc(t.text) + '</div>').join('') : '') +
        '</div></div>';
    }).join('');

    box.querySelectorAll('input[type=checkbox]').forEach(cb => {
      cb.addEventListener('change', () => {
        APP.plan.toggle(cb.dataset.id, cb.checked);
        /* 更新本阶段与总进度显示(重渲染) */
        this.renderTimeline(sec);
      });
    });
  },

  unmount() {}
});
