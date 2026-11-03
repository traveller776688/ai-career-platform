/* ============================================================
 * AI 专业生涯规划 — 核心框架 (main.js)
 * APP 命名空间:路由/主题/存储/图表工具/弹窗/总览页
 * ============================================================ */
'use strict';

const APP = window.APP || {};
window.APP = APP;

/* ---------- 状态与存储 ---------- */
APP.state = { page: 'dashboard' };
APP.pages = {};
APP.charts = [];
APP.cur = null;

APP.store = {
  get(k, d) { try { const v = localStorage.getItem('aipc_' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('aipc_' + k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem('aipc_' + k); } catch (e) {} }
};

/* ---------- 主题(图表色板遵循参考调色板:浅色阶/暗色阶,均已通过校验) ---------- */
APP.isDark = (function () {
  try {
    const saved = localStorage.getItem('aipc_theme');
    const attr = document.documentElement.getAttribute('data-theme');
    if (saved === 'dark' || saved === 'light') return saved === 'dark';
    if (attr === 'dark' || attr === 'light') return attr === 'dark';
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return false;
  } catch (e) {}
  return true; /* 深色优先 */
})();

APP.palette = function () {
  return APP.isDark ? {
    ink1: '#f0efec', ink2: '#c3c2b7', muted: '#898781',
    grid: '#2c2c2a', axis: '#383835', surface: '#161b2e',
    series: ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300', '#9085e9', '#e66767'],
    up: '#e66767', down: '#0ca30c', flat: '#c3c2b7',
    ramp: ['#0d366b', '#104281', '#184f95', '#1c5cab', '#256abf', '#2a78d6', '#3987e5', '#5598e7', '#6da7ec', '#86b6ef', '#9ec5f4', '#b7d3f6', '#cde2fb'],
    wash: 'rgba(57,135,229,0.10)', ring: 'rgba(255,255,255,0.10)'
  } : {
    ink1: '#0b0b0b', ink2: '#52514e', muted: '#898781',
    grid: '#e1e0d9', axis: '#c3c2b7', surface: '#ffffff',
    series: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#6250d6', '#e34948'],
    up: '#e34948', down: '#006300', flat: '#898781',
    ramp: ['#cde2fb', '#b7d3f6', '#9ec5f4', '#86b6ef', '#6da7ec', '#5598e7', '#3987e5', '#2a78d6', '#256abf', '#1c5cab', '#184f95', '#104281', '#0d366b'],
    wash: 'rgba(42,120,214,0.10)', ring: 'rgba(11,11,11,0.10)'
  };
};

APP.theme = {
  apply() {
    document.documentElement.setAttribute('data-theme', APP.isDark ? 'dark' : 'light');
    try { localStorage.setItem('aipc_theme', APP.isDark ? 'dark' : 'light'); } catch (e) {}
  },
  toggle() {
    APP.isDark = !APP.isDark;
    APP.theme.apply();
    APP.go(APP.state.page); /* 重建当前页图表以应用新色板 */
  }
};

/* ---------- 工具函数 ---------- */
APP.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

APP.fmt = {
  pct(x, d) { d = d == null ? 2 : d; return (x >= 0 ? '+' : '') + x.toFixed(d) + '%'; },
  num(x, d) { d = d == null ? 2 : d; return Number(x).toFixed(d); },
  price(x, cur) { return (cur || '') + (x < 10 ? Number(x).toFixed(3) : Number(x).toFixed(2)); },
  date(d) { d = d || new Date(); const p = n => String(n).padStart(2, '0'); return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); },
  today() { return APP.fmt.date(new Date()); }
};

/* 迷你折线 SVG */
APP.spark = function (arr, w, h, color, fill) {
  w = w || 90; h = h || 26;
  if (!arr || arr.length < 2) return '';
  const min = Math.min.apply(null, arr), max = Math.max.apply(null, arr);
  const span = (max - min) || 1;
  const pts = arr.map((v, i) => (i / (arr.length - 1) * (w - 2) + 1).toFixed(1) + ',' + (h - 2 - (v - min) / span * (h - 4)).toFixed(1)).join(' ');
  let area = '';
  if (fill) area = '<polygon points="1,' + (h - 1) + ' ' + pts + ' ' + (w - 1) + ',' + (h - 1) + '" fill="' + fill + '"/>';
  return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true">' + area +
    '<polyline points="' + pts + '" fill="none" stroke="' + color + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>';
};

/* ---------- 图表工具 ---------- */
APP.mkChart = function (el, opt) {
  if (!window.echarts) { el.innerHTML = '<div class="chart-missing">📊 图表组件未加载(本地库缺失且网络不可用)</div>'; return null; }
  const c = echarts.init(el);
  c.setOption(opt);
  APP.charts.push(c);
  return c;
};
APP.disposeCharts = function () {
  APP.charts.forEach(c => { try { c.dispose(); } catch (e) {} });
  APP.charts = [];
};

/* ECharts 通用片段(墨色/轴线/网格遵循规范:1px 实线、弱化网格) */
APP.chartFrag = function () {
  const P = APP.palette();
  return {
    textStyle: { color: P.ink2 },
    grid: { left: 10, right: 14, top: 34, bottom: 8, containLabel: true },
    axisStyle: {
      axisLine: { lineStyle: { color: P.axis, width: 1 } },
      axisTick: { show: false },
      axisLabel: { color: P.muted, fontSize: 11 },
      splitLine: { lineStyle: { color: P.grid, width: 1 } }
    },
    tooltipStyle: {
      backgroundColor: P.surface,
      borderColor: P.ring,
      borderWidth: 1,
      textStyle: { color: P.ink1, fontSize: 12 },
      extraCssText: 'box-shadow:0 6px 20px rgba(0,0,0,.18);border-radius:8px;'
    },
    legendStyle: {
      textStyle: { color: P.ink2, fontSize: 12 },
      itemWidth: 16, itemHeight: 2, icon: 'rect'
    }
  };
};

/* ---------- 提示与确认 ---------- */
APP.toast = function (msg, type) {
  const t = document.getElementById('toast');
  if (!t) return;
  const icons = { info: 'ℹ️', success: '✅', warn: '⚠️', error: '❌' };
  t.innerHTML = '<span>' + (icons[type || 'info'] || 'ℹ️') + '</span><span>' + APP.esc(msg) + '</span>';
  t.className = 'show ' + (type || 'info');
  clearTimeout(APP._toastT);
  APP._toastT = setTimeout(() => { t.className = ''; }, 2800);
};

APP.confirm = function (msg, danger) {
  return new Promise(resolve => {
    const m = document.getElementById('modal');
    document.getElementById('modal-text').textContent = msg;
    const ok = document.getElementById('modal-ok');
    ok.className = danger ? 'btn danger' : 'btn primary';
    ok.textContent = danger ? '确认执行' : '确认';
    m.classList.add('show');
    APP._modalResolve = resolve;
  });
};

/* ---------- 路由 ---------- */
APP.pagemeta = {
  dashboard: { title: '总览', sub: '你的 AI 生涯驾驶舱:今天该关注什么', icon: '🚀' },
  quiz:      { title: '职业测评', sub: '18 道题,找到最适合你的 AI 职业方向', icon: '🎯' },
  market:    { title: '行业脉搏', sub: 'AI 行业股票与热点关注实时变动', icon: '📈' },
  degree:    { title: '学历决策', sub: '要不要读硕?要不要读博?用数据说话', icon: '🎓' },
  plan:      { title: '阶段规划', sub: '从大一到大四/研三/博五的详细日程表', icon: '🗺️' },
  growth:    { title: '成长工具', sub: '打卡日历 · 技能树 · 模拟面试', icon: '🌱' },
  resources: { title: '资源库', sub: '学习资源 · 竞赛日历,按图索骥', icon: '📚' },
  report:    { title: '我的报告', sub: '测评与规划成果汇总,可打印可导出', icon: '📄' }
};

APP.registerPage = function (id, mod) { APP.pages[id] = mod; };

APP.go = function (id) {
  if (!APP.pagemeta[id]) id = 'dashboard';
  APP.state.page = id;
  document.querySelectorAll('.page').forEach(s => s.classList.remove('active'));
  const sec = document.getElementById('page-' + id);
  if (sec) sec.classList.add('active');
  document.querySelectorAll('#nav a').forEach(a => a.classList.toggle('active', a.dataset.nav === id));
  const meta = APP.pagemeta[id];
  document.getElementById('pageTitle').textContent = meta.icon + ' ' + meta.title;
  document.getElementById('pageSub').textContent = meta.sub;
  if (APP.cur && APP.cur.unmount) { try { APP.cur.unmount(); } catch (e) { console.warn(e); } }
  APP.disposeCharts();
  APP.cur = APP.pages[id] || null;
  if (APP.cur && APP.cur.mount) { try { APP.cur.mount(sec); } catch (e) { console.error('mount error:', e && e.stack ? e.stack : e); } }
  window.scrollTo(0, 0);
};

/* ---------- 导航角标 ---------- */
APP.updateBadges = function () {
  const q = document.getElementById('badge-quiz');
  const d = document.getElementById('badge-degree');
  const g = document.getElementById('badge-growth');
  if (q) q.style.display = APP.store.get('quiz') ? '' : 'none';
  if (d) d.style.display = APP.store.get('degree') ? '' : 'none';
  if (g) {
    const days = APP.store.get('checkin', []);
    g.style.display = days.indexOf(APP.fmt.today()) >= 0 ? '' : 'none';
  }
};

/* ---------- 通用 HTML 片段 ---------- */
APP.tag = (txt, cls) => '<span class="tag ' + (cls || '') + '">' + APP.esc(txt) + '</span>';
APP.bar = (pct, cls) => '<div class="hbar"><div class="hbar-fill ' + (cls || '') + '" style="width:' + Math.max(0, Math.min(100, pct)) + '%"></div></div>';

/* ============================================================
 * 总览页
 * ============================================================ */
APP.registerPage('dashboard', {
  mount(sec) {
    const P = APP.palette();
    const quiz = APP.store.get('quiz');
    const degree = APP.store.get('degree');
    const checkins = APP.store.get('checkin', []);
    const h = new Date().getHours();
    const greet = h < 6 ? '夜深了' : h < 12 ? '早上好' : h < 14 ? '中午好' : h < 18 ? '下午好' : '晚上好';
    const q = DATA.quotes[Math.floor(Date.now() / 86400000) % DATA.quotes.length];
    const today = APP.fmt.today();
    const streak = (function () {
      let s = 0; const d = new Date();
      if (checkins.indexOf(APP.fmt.date(d)) < 0) d.setDate(d.getDate() - 1);
      while (checkins.indexOf(APP.fmt.date(d)) >= 0) { s++; d.setDate(d.getDate() - 1); }
      return s;
    })();
    const top = quiz && quiz.top3 && quiz.top3[0] ? DATA.careers.find(c => c.id === quiz.top3[0].id) : null;
    const rec = degree ? degree.rec : null;
    const degreeName = { job: '本科直接就业', profMsc: '专业硕士 → 就业', acadMsc: '学术硕士 → 就业/深造', phd: '博士(研究路线)' };

    const tile = (icon, label, value, sub, click) =>
      '<div class="stat' + (click ? ' clickable' : '') + '"' + (click ? ' data-go="' + click + '"' : '') + '>' +
      '<div class="stat-ic">' + icon + '</div><div class="stat-lab">' + label + '</div>' +
      '<div class="stat-val">' + value + '</div><div class="stat-sub">' + sub + '</div></div>';

    const skillProg = window.APP.growth && APP.growth.skillProgress ? APP.growth.skillProgress() : null;
    const planProg = window.APP.plan && APP.plan.overallProgress ? APP.plan.overallProgress() : null;
    const nextStep = window.APP.plan && APP.plan.nextStep ? APP.plan.nextStep() : null;

    sec.innerHTML =
      '<div class="hero">' +
        '<div class="hero-txt"><div class="hero-greet">' + greet + ',未来的 AI 工程师 👋</div>' +
        '<div class="hero-quote">" ' + APP.esc(q) + ' "</div></div>' +
        '<div class="hero-fig"><div class="hero-lab">AI 行业综合指数 <span class="hero-src">仿真</span></div>' +
        '<div class="hero-val" id="dash-idx">—</div>' +
        '<div class="hero-delta" id="dash-idx-d">—</div></div>' +
      '</div>' +
      '<div class="grid g4">' +
        tile('🎯', '职业测评', quiz ? top.icon + ' ' + top.name : '未完成', quiz ? '匹配度 ' + quiz.top3[0].match + '%' : '18 题 · 约 5 分钟', 'quiz') +
        tile('🔥', '连续打卡', streak + ' 天', checkins.indexOf(today) >= 0 ? '今日已打卡' : '今日未打卡', 'growth') +
        tile('🌳', '技能树进度', skillProg ? skillProg.pct + '%' : '未选择职业', skillProg ? skillProg.done + '/' + skillProg.total + ' 节点' : '测评后可自动匹配', 'growth') +
        tile('🗺️', '路线图进度', planProg ? planProg.pct + '%' : '未开始', planProg ? '已完成 ' + planProg.done + '/' + planProg.total + ' 项' : '含详细阶段日程', 'plan') +
      '</div>' +
      '<div class="grid g2">' +
        '<div class="card"><div class="card-t">今日 AI 热点 <span class="live">● 实时波动</span></div><div id="dash-topics"></div></div>' +
        '<div class="card"><div class="card-t">AI 行业综合指数走势 <span class="card-src">仿真行情</span></div><div id="dash-idx-chart" style="height:210px"></div></div>' +
      '</div>' +
      '<div class="grid g2">' +
        '<div class="card"><div class="card-t">学历决策</div>' +
          (rec ? '<div class="rec-badge" data-go="degree">' + degreeName[rec] + ' <span class="rec-conf">置信度 ' + degree.conf + '%</span></div><p class="rec-desc">' + APP.esc(degree.why[0] || '') + '</p><button class="btn ghost sm" data-go="degree">查看完整决策报告 →</button>'
               : '<p class="muted">还没做学历决策评估?10 道题帮你算清楚硕博账。</p><button class="btn primary sm" data-go="degree">开始评估 →</button>') +
        '</div>' +
        '<div class="card"><div class="card-t">路线图下一步</div>' +
          (nextStep ? '<div class="rec-badge">' + APP.esc(nextStep.stage) + '</div><p class="rec-desc">' + APP.esc(nextStep.text) + '</p><button class="btn ghost sm" data-go="plan">打开阶段规划 →</button>'
                    : '<p class="muted">完成测评后,自动生成你的专属阶段日程表。</p><button class="btn primary sm" data-go="plan">查看通用路线图 →</button>') +
        '</div>' +
      '</div>' +
      '<div class="quick">' +
        '<div class="qk" data-go="quiz"><span class="qk-ic">🎯</span><b>职业测评</b><p>18 题定位你的 AI 职业方向</p></div>' +
        '<div class="qk" data-go="market"><span class="qk-ic">📈</span><b>行业脉搏</b><p>股票 + 热点的实时动态</p></div>' +
        '<div class="qk" data-go="degree"><span class="qk-ic">🎓</span><b>学历决策</b><p>硕 / 博 / 就业,算一笔明白账</p></div>' +
        '<div class="qk" data-go="plan"><span class="qk-ic">🗺️</span><b>阶段规划</b><p>大一到大四的详细日程表</p></div>' +
      '</div>' +
      '<p class="foot-note">💡 ' + APP.esc(DATA.marketNote) + '</p>';

    sec.querySelectorAll('[data-go]').forEach(el => {
      el.addEventListener('click', () => APP.go(el.dataset.go));
    });

    /* 指数走势迷你图(数据来自行情引擎) */
    const el = document.getElementById('dash-idx-chart');
    if (el) {
      APP.market.dashChart = APP.mkChart(el, {
        animation: false,
        tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'cross', label: { backgroundColor: P.ink1, color: P.surface } } }, APP.chartFrag().tooltipStyle),
        xAxis: { type: 'category', boundaryGap: false, data: [], ...APP.chartFrag().axisStyle, splitLine: { show: false } },
        yAxis: { type: 'value', scale: true, ...APP.chartFrag().axisStyle },
        series: [{ type: 'line', name: '综合指数', data: [], showSymbol: false, smooth: false,
          lineStyle: { width: 2, color: P.series[0] }, areaStyle: { color: P.wash }, itemStyle: { color: P.series[0] } }]
      });
    }
    if (APP.market) APP.market.paintDashboard();
    APP.updateBadges();
  },
  unmount() { APP.market.dashChart = null; }
});

/* ---------- 全局事件 ---------- */
window.addEventListener('DOMContentLoaded', function () {
  APP.theme.apply();
  /* 导航 */
  document.querySelectorAll('#nav a').forEach(a => {
    a.addEventListener('click', () => APP.go(a.dataset.nav));
  });
  document.getElementById('btnTheme').addEventListener('click', () => APP.theme.toggle());
  /* 弹窗 */
  document.getElementById('modal-cancel').addEventListener('click', () => { document.getElementById('modal').classList.remove('show'); if (APP._modalResolve) APP._modalResolve(false); });
  document.getElementById('modal-ok').addEventListener('click', () => { document.getElementById('modal').classList.remove('show'); if (APP._modalResolve) APP._modalResolve(true); });
  document.getElementById('modal').addEventListener('click', e => { if (e.target.id === 'modal') { e.currentTarget.classList.remove('show'); if (APP._modalResolve) APP._modalResolve(false); } });
  /* 窗口缩放重绘图表 */
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => APP.charts.forEach(c => { try { c.resize(); } catch (e) {} }), 150); });
  /* 行情引擎启动 */
  if (APP.market) { APP.market.init(); APP.market.start(); }
  /* 首屏(支持 #hash 深链接) */
  const initial = location.hash.replace('#', '');
  APP.go(APP.pagemeta[initial] ? initial : 'dashboard');
  APP.updateBadges();
  window.addEventListener('hashchange', () => {
    const h = location.hash.replace('#', '');
    if (APP.pagemeta[h]) APP.go(h);
  });
});

window.addEventListener('beforeunload', () => { if (APP.market) APP.market.save(); });
