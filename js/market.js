/* ============================================================
 * AI 专业生涯规划 — 行业脉搏 (market.js)
 * 行情引擎:基础随机游走仿真(可切换真实数据源),热点热度波动
 * ============================================================ */
'use strict';

/* 确定性伪随机数(按股票代码播种,每次加载行情形态一致) */
function mulberry(seed) {
  let a = 0;
  for (let i = 0; i < seed.length; i++) a = (a * 31 + seed.charCodeAt(i)) >>> 0;
  a += 0x6D2B79F5;
  return function () {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

APP.market = {
  stocks: null, topics: null, timer: null, running: false, tickCount: 0,
  selected: 'NVDA', range: 240, dashChart: null, mainChart: null, treemapChart: null,

  /* ---------- 初始化 ---------- */
  init() {
    const last = APP.store.get('market_last');
    const sameDay = last && last.date === APP.fmt.today();
    this.stocks = {};
    DATA.stocks.forEach(st => {
      const rnd = mulberry(st.code + '_' + APP.fmt.today());
      let p;
      let prevClose;
      if (sameDay && last.map[st.code]) { p = last.map[st.code].p; prevClose = last.map[st.code].pc; }
      else { prevClose = +(st.base * (1 + (rnd() - 0.5) * 0.02)).toFixed(2); p = prevClose; }
      const hist = [], times = [];
      const n = 240;
      for (let i = 0; i < n; i++) {
        hist.push(+p.toFixed(2));
        times.push(new Date(Date.now() - (n - i) * 2500));
        p = Math.max(0.01, p * (1 + (rnd() - 0.5) * st.vol * 3));
      }
      this.stocks[st.code] = { ...st, price: hist[n - 1], prevClose, hist, times, chg: (hist[n - 1] / prevClose - 1) * 100 };
    });
    this.topics = DATA.topics.map(t => {
      const rnd = mulberry(t.name);
      const trend = [];
      let h = t.heat;
      for (let i = 0; i < 40; i++) { h = Math.min(99, Math.max(30, h + (rnd() - 0.5) * 8)); trend.push(Math.round(h)); }
      return { ...t, heat: trend[39], trend };
    });
    this.idx = [];
    this.rebuildIndex(240);
  },

  rebuildIndex(n) {
    this.idx = [];
    let v = 1000;
    for (let i = 0; i < n; i++) {
      let avg = 0;
      DATA.stocks.forEach(st => { const s = this.stocks[st.code]; avg += (s.hist[i] / s.prevClose - 1) * 100; });
      avg /= DATA.stocks.length;
      v = 1000 * (1 + avg / 100);
      this.idx.push(+v.toFixed(2));
    }
    this.idxChg = (this.idx[this.idx.length - 1] / 1000 - 1) * 100;
  },

  /* ---------- 引擎心跳 ---------- */
  start() {
    if (this.running) return;
    this.running = true;
    this.timer = setInterval(() => this.tick(), 2500);
  },
  stop() { this.running = false; clearInterval(this.timer); },
  toggle() { this.running ? this.stop() : this.start(); return this.running; },

  tick() {
    if (document.hidden) return;
    this.tickCount++;
    let avg = 0;
    DATA.stocks.forEach(st => {
      const s = this.stocks[st.code];
      const rnd = Math.random();
      s.price = Math.max(0.01, s.price * (1 + (rnd - 0.5) * st.vol * 3.4));
      s.hist.push(+s.price.toFixed(2));
      s.times.push(new Date());
      if (s.hist.length > 360) { s.hist.shift(); s.times.shift(); }
      s.chg = (s.price / s.prevClose - 1) * 100;
      avg += s.chg;
    });
    avg /= DATA.stocks.length;
    this.idx.push(+(1000 * (1 + avg / 100)).toFixed(2));
    if (this.idx.length > 360) this.idx.shift();
    this.idxChg = (this.idx[this.idx.length - 1] / 1000 - 1) * 100;
    this.topics.forEach(t => {
      t.heat = Math.min(99, Math.max(30, t.heat + (Math.random() - 0.5) * 7));
      t.trend.push(Math.round(t.heat));
      if (t.trend.length > 40) t.trend.shift();
    });
    this.paint();
  },

  /* ---------- 渲染 ---------- */
  paint() {
    if (APP.state.page === 'dashboard') this.paintDashboard();
    else if (APP.state.page === 'market') this.paintMarket();
  },

  paintDashboard() {
    const v = document.getElementById('dash-idx');
    if (v) {
      v.textContent = APP.fmt.num(this.idx[this.idx.length - 1], 2);
      const d = document.getElementById('dash-idx-d');
      const up = this.idxChg >= 0;
      d.innerHTML = '<span class="' + (up ? 'up' : 'down') + '">' + (up ? '▲' : '▼') + ' ' + APP.fmt.pct(this.idxChg) + '</span> 今日';
    }
    const tl = document.getElementById('dash-topics');
    if (tl) {
      const top = this.topics.slice().sort((a, b) => b.heat - a.heat).slice(0, 5);
      tl.innerHTML = top.map((t, i) =>
        '<div class="dash-topic"><span class="dt-rank">' + (i + 1) + '</span><span class="dt-name">' + APP.esc(t.name) + '</span>' +
        '<span class="dt-tag">' + APP.esc(t.tag) + '</span><span class="dt-heat">' + t.heat + '°</span>' +
        '<div class="hbar"><div class="hbar-fill" style="width:' + t.heat + '%"></div></div></div>').join('');
    }
    if (this.dashChart) {
      const P = APP.palette();
      this.dashChart.setOption({
        xAxis: { data: this.timesLabel(120) },
        series: [{ data: this.idx.slice(-120) }]
      });
      void P;
    }
  },

  timesLabel(n) {
    const arr = [];
    for (let i = n - 1; i >= 0; i--) {
      const t = new Date(Date.now() - i * 2500);
      arr.push(String(t.getHours()).padStart(2, '0') + ':' + String(t.getMinutes()).padStart(2, '0') + ':' + String(t.getSeconds()).padStart(2, '0'));
    }
    return arr;
  },

  /* ---------- 行业脉搏页 ---------- */
  mount(sec) {
    const P = APP.palette();
    sec.innerHTML =
      '<div class="filter-row">' +
        '<button class="btn ghost sm" id="mk-pause">⏸ 暂停</button>' +
        '<button class="btn ghost sm" id="mk-reset">↻ 重置仿真</button>' +
        '<button class="btn ghost sm" id="mk-real">🌐 尝试获取真实行情</button>' +
        '<span class="live">● 实时仿真中</span>' +
      '</div>' +
      '<div class="grid g4" id="mk-kpi"></div>' +
      '<div class="grid mk-main">' +
        '<div class="card mk-chart-card"><div class="card-t" id="mk-sel-name">— <span class="en" id="mk-sel-code"></span>' +
          '<span class="mk-range">' +
            '<button class="rg" data-n="60">1分钟</button><button class="rg active" data-n="240">10分钟</button><button class="rg" data-n="360">全天</button>' +
          '</span></div>' +
          '<div class="mk-price-line"><span class="mk-price" id="mk-price">—</span><span class="up" id="mk-chg">—</span></div>' +
          '<div id="mk-chart" style="height:300px"></div></div>' +
        '<div class="card"><div class="card-t">板块热力(涨幅着色)</div><div id="mk-tree" style="height:380px"></div>' +
          '<p class="muted sm">🟥 涨 · 🟩 跌 · 面积≈板块热度;点击可查看板块个股</p></div>' +
      '</div>' +
      '<div class="card"><div class="card-t">AI 股票池 <span class="card-src">点击行切换主图</span></div>' +
        '<div class="tbl-scroll"><table class="tbl" id="mk-tbl"><thead><tr><th>股票</th><th>现价</th><th>涨跌幅</th><th>走势</th><th>板块</th></tr></thead><tbody>' +
        DATA.stocks.map(st => '<tr id="mk-row-' + st.code + '" data-code="' + st.code + '">' +
          '<td><b>' + st.name + '</b> <span class="en muted">' + st.code + '</span></td>' +
          '<td class="tnum" id="p-' + st.code + '">—</td>' +
          '<td class="tnum" id="c-' + st.code + '">—</td>' +
          '<td id="s-' + st.code + '"></td>' +
          '<td>' + APP.tag(DATA.sectors.find(x => x.id === st.sector).name) + '</td></tr>').join('') +
        '</tbody></table></div></div>' +
      '<div class="grid g2">' +
        '<div class="card"><div class="card-t">AI 热点关注 <span class="live">● 实时波动</span></div><div id="mk-cloud"></div></div>' +
        '<div class="card"><div class="card-t">热度榜 Top 8</div><div id="mk-hot"></div></div>' +
      '</div>' +
      '<p class="foot-note">💡 ' + APP.esc(DATA.marketNote) + '</p>';

    /* 控制按钮 */
    const pause = sec.querySelector('#mk-pause');
    const live = sec.querySelector('.live');
    pause.addEventListener('click', () => {
      const on = APP.market.toggle();
      pause.textContent = on ? '⏸ 暂停' : '▶ 恢复';
      live.style.display = on ? '' : 'none';
    });
    sec.querySelector('#mk-reset').addEventListener('click', async () => {
      if (await APP.confirm('重置后行情从基准价重新仿真,确定吗?')) {
        APP.store.del('market_last');
        APP.market.init();
        APP.market.renderAll();
        APP.toast('已重置仿真行情', 'success');
      }
    });
    sec.querySelector('#mk-real').addEventListener('click', () => this.tryReal());

    /* 区间切换 */
    sec.querySelectorAll('.rg').forEach(b => b.addEventListener('click', () => {
      sec.querySelectorAll('.rg').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      APP.market.range = +b.dataset.n;
      APP.market.renderChart();
    }));

    /* 表格行选择 */
    sec.querySelectorAll('#mk-tbl tbody tr').forEach(tr => tr.addEventListener('click', () => {
      APP.market.selected = tr.dataset.code;
      sec.querySelectorAll('#mk-tbl tbody tr').forEach(x => x.classList.remove('sel'));
      tr.classList.add('sel');
      APP.market.renderChart();
    }));
    const first = sec.querySelector('#mk-row-' + APP.market.selected);
    if (first) first.classList.add('sel');

    /* 板块点击联动 */
    APP.market.buildCharts(sec);
    APP.market.paintMarket(true);
  },

  unmount() {
    APP.market.mainChart = null; APP.market.treemapChart = null; APP.market._treeSec = null;
  },

  buildCharts(sec) {
    const P = APP.palette();
    const F = APP.chartFrag();
    const main = document.getElementById('mk-chart');
    if (main) {
      this.mainChart = APP.mkChart(main, {
        animation: false,
        tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'cross', label: { backgroundColor: P.ink1, color: P.surface } } }, F.tooltipStyle),
        legend: Object.assign({ data: ['价格', 'MA20'], top: 0, right: 10 }, F.legendStyle),
        grid: { left: 10, right: 16, top: 40, bottom: 8, containLabel: true },
        xAxis: Object.assign({ type: 'category', boundaryGap: false, data: [] }, F.axisStyle, { splitLine: { show: false } }),
        yAxis: Object.assign({ type: 'value', scale: true }, F.axisStyle),
        series: [
          { name: '价格', type: 'line', data: [], showSymbol: false, lineStyle: { width: 2, color: P.series[0] }, areaStyle: { color: P.wash }, itemStyle: { color: P.series[0] },
            markLine: { symbol: 'none', label: { color: P.muted, fontSize: 10, formatter: '昨收' }, lineStyle: { color: P.muted, width: 1 }, data: [{ yAxis: 0 }] } },
          { name: 'MA20', type: 'line', data: [], showSymbol: false, lineStyle: { width: 2, color: P.axis, opacity: 0.9 }, itemStyle: { color: P.axis } }
        ]
      });
    }
    const tree = document.getElementById('mk-tree');
    if (tree) {
      this.treemapChart = APP.mkChart(tree, {
        tooltip: Object.assign({ formatter: p => (p.data && p.data.chg != null) ? p.data.name + '<br/>板块涨幅 <b>' + APP.fmt.pct(p.data.chg) + '</b>' : '' }, F.tooltipStyle),
        series: [{ type: 'treemap', roam: false, nodeClick: false, breadcrumb: { show: false },
          label: { fontSize: 12, formatter: p => (p.data && p.data.chg != null) ? (p.data.name + ' ' + APP.fmt.pct(p.data.chg)) : '' },
          itemStyle: { borderColor: P.surface, borderWidth: 2, gapWidth: 2 },
          data: [] }]
      });
      this.treemapChart.on('click', p => {
        const codes = DATA.stocks.filter(s => s.sector === p.data.sid).map(s => s.code);
        APP.market.selected = codes[0];
        APP.market.renderChart();
        const rows = document.querySelectorAll('#mk-tbl tbody tr');
        rows.forEach(x => x.classList.toggle('sel', x.dataset.code === codes[0]));
        APP.toast('已切换至「' + p.data.name + '」板块', 'info');
      });
    }
  },

  /* 混合两色(用于涨跌发散色阶) */
  mix(a, b, t) {
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    const r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t);
    const g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t);
    const bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1);
  },

  renderAll() {
    if (this.mainChart) this.renderChart();
    this.paintMarket(true);
    this.paintDashboard();
  },

  renderChart() {
    if (!this.mainChart) return;
    const P = APP.palette();
    const s = this.stocks[this.selected];
    const n = this.range;
    const hist = s.hist.slice(-n), times = s.times.slice(-n);
    const ma = hist.map((v, i) => {
      if (i < 19) return null;
      let sum = 0; for (let j = i - 19; j <= i; j++) sum += hist[j];
      return +(sum / 20).toFixed(2);
    });
    this.mainChart.setOption({
      xAxis: { data: times.map(t => String(t.getHours()).padStart(2, '0') + ':' + String(t.getMinutes()).padStart(2, '0') + ':' + String(t.getSeconds()).padStart(2, '0')) },
      series: [
        { data: hist, markLine: { data: [{ yAxis: s.prevClose }] } },
        { data: ma }
      ]
    });
    const sel = document.getElementById('mk-sel-name');
    if (sel) sel.innerHTML = s.name + ' <span class="en" id="mk-sel-code">' + s.code + '</span>';
    const pr = document.getElementById('mk-price');
    if (pr) pr.textContent = APP.fmt.price(s.price, s.cur);
    const ch = document.getElementById('mk-chg');
    if (ch) {
      const up = s.chg >= 0;
      ch.className = up ? 'up' : 'down';
      ch.innerHTML = (up ? '▲' : '▼') + ' ' + APP.fmt.pct(s.chg) + ' <span class="muted">昨收 ' + APP.fmt.price(s.prevClose, s.cur) + '</span>';
    }
  },

  paintMarket(force) {
    if (!document.getElementById('mk-kpi')) return;
    const P = APP.palette();
    /* KPI 行 */
    const ups = DATA.stocks.filter(st => this.stocks[st.code].chg >= 0).length;
    const downs = DATA.stocks.length - ups;
    let best = null, worst = null;
    DATA.stocks.forEach(st => {
      const s = this.stocks[st.code];
      if (!best || s.chg > best.chg) best = s;
      if (!worst || s.chg < worst.chg) worst = s;
    });
    const tile = (lab, val, sub) => '<div class="stat"><div class="stat-lab">' + lab + '</div><div class="stat-val">' + val + '</div><div class="stat-sub">' + sub + '</div></div>';
    document.getElementById('mk-kpi').innerHTML =
      tile('AI 行业综合指数', APP.fmt.num(this.idx[this.idx.length - 1], 2),
        '<span class="' + (this.idxChg >= 0 ? 'up' : 'down') + '">' + (this.idxChg >= 0 ? '▲' : '▼') + ' ' + APP.fmt.pct(this.idxChg) + '</span> 今日') +
      tile('上涨 / 下跌', '<span class="up">' + ups + '</span> / <span class="down">' + downs + '</span>', '共 ' + DATA.stocks.length + ' 只') +
      tile('领涨', best.name + ' <span class="en">' + best.code + '</span>', '<span class="up">▲ ' + APP.fmt.pct(best.chg) + '</span>') +
      tile('领跌', worst.name + ' <span class="en">' + worst.code + '</span>', '<span class="down">▼ ' + APP.fmt.pct(worst.chg) + '</span>');

    /* 股票表 */
    const every4 = this.tickCount % 4 === 0;
    DATA.stocks.forEach(st => {
      const s = this.stocks[st.code];
      const p = document.getElementById('p-' + st.code);
      const c = document.getElementById('c-' + st.code);
      if (p) { p.textContent = APP.fmt.price(s.price, s.cur); p.className = 'tnum ' + (s.chg >= 0 ? 'up' : 'down'); }
      if (c) { c.innerHTML = (s.chg >= 0 ? '▲' : '▼') + ' ' + APP.fmt.pct(s.chg); c.className = 'tnum ' + (s.chg >= 0 ? 'up' : 'down'); }
      if (every4 || force) {
        const sp = document.getElementById('s-' + st.code);
        if (sp) sp.innerHTML = APP.spark(s.hist.slice(-40), 88, 26, s.chg >= 0 ? P.up : P.down, '');
      }
    });

    /* 主图 */
    if (this.mainChart && (every4 || force)) this.renderChart();

    /* 板块 treemap(发散色:红涨绿跌+灰色中点) */
    if (this.treemapChart && (every4 || force)) {
      const mid = APP.isDark ? '#383835' : '#f0efec';
      const upC = APP.isDark ? '#e66767' : '#e34948';
      const dnC = APP.isDark ? '#0ca30c' : '#006300';
      const data = DATA.sectors.map(sec => {
        const codes = DATA.stocks.filter(s => s.sector === sec.id);
        const avg = codes.reduce((m, st) => m + this.stocks[st.code].chg, 0) / codes.length;
        const t = Math.min(1, Math.abs(avg) / 3);
        const col = avg >= 0 ? this.mix(mid, upC, t) : this.mix(mid, dnC, t);
        const lum = parseInt(col.slice(1, 3), 16) * 0.299 + parseInt(col.slice(3, 5), 16) * 0.587 + parseInt(col.slice(5, 7), 16) * 0.114;
        return { name: sec.name, sid: sec.id, value: Math.max(12, 100 + avg * 8), chg: avg,
          itemStyle: { color: col }, label: { color: lum > 150 ? '#0b0b0b' : '#ffffff' } };
      });
      this.treemapChart.setOption({ series: [{ data }] });
    }

    /* 热点云 + 热度榜 */
    if (every4 || force || this.tickCount % 2 === 0 || force) {
      const cloud = document.getElementById('mk-cloud');
      if (cloud) {
        const sorted = this.topics.slice().sort((a, b) => b.heat - a.heat);
        cloud.innerHTML = sorted.map(t =>
          '<span class="cloud-item" style="font-size:' + (12 + t.heat / 9).toFixed(1) + 'px;font-weight:' + (t.heat > 80 ? 700 : 400) + '">' +
          APP.esc(t.name) + ' <sup>' + t.heat + '°</sup></span>').join('');
      }
      const hot = document.getElementById('mk-hot');
      if (hot) {
        const top8 = this.topics.slice().sort((a, b) => b.heat - a.heat).slice(0, 8);
        const P2 = APP.palette();
        hot.innerHTML = top8.map((t, i) => {
          const delta = t.trend[t.trend.length - 1] - t.trend[t.trend.length - 2];
          return '<div class="hot-row"><span class="dt-rank">' + (i + 1) + '</span>' +
            '<div class="hot-main"><div class="hot-name">' + APP.esc(t.name) + ' ' + APP.tag(t.tag, 'mini') + '</div>' +
            '<div class="hbar"><div class="hbar-fill" style="width:' + t.heat + '%"></div></div></div>' +
            '<div class="hot-right"><b>' + t.heat + '°</b> <span class="' + (delta >= 0 ? 'up' : 'down') + '">' + (delta >= 0 ? '▲' : '▼') + '</span>' +
            '<div class="hot-spark">' + APP.spark(t.trend, 56, 20, delta >= 0 ? P2.up : P2.down, '') + '</div></div></div>';
        }).join('');
      }
    }
  },

  /* 尝试接入真实行情(stooq 公开 CSV,经 CORS 代理;失败自动回退仿真) */
  async tryReal() {
    APP.toast('正在尝试获取真实行情(约 10 秒)…', 'info');
    try {
      const codes = DATA.stocks.filter(s => s.market === 'US').map(s => s.code).join('+');
      const ctrl = new AbortController();
      const tm = setTimeout(() => ctrl.abort(), 12000);
      const r = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent('https://stooq.com/q/l/?s=' + codes + '&f=sd2t2ohlcv&h&e=csv'), { signal: ctrl.signal });
      clearTimeout(tm);
      const txt = await r.text();
      let ok = 0;
      txt.split('\n').forEach(line => {
        const parts = line.split(',');
        if (parts.length < 4 || parts[0] === 'Symbol') return;
        const code = parts[0].trim(), price = parseFloat(parts[3]);
        if (!price || !this.stocks[code]) return;
        this.stocks[code].prevClose = +parts[2] || price;
        this.stocks[code].price = price;
        this.stocks[code].chg = (price / this.stocks[code].prevClose - 1) * 100;
        ok++;
      });
      if (ok) APP.toast('已更新 ' + ok + ' 只美股真实行情基准价 ✓', 'success');
      else APP.toast('数据源返回为空,继续使用仿真引擎', 'warn');
    } catch (e) {
      APP.toast('获取失败(网络/CORS 限制),继续使用仿真引擎', 'warn');
    }
    this.paintMarket(true);
  },

  save() {
    const map = {};
    DATA.stocks.forEach(st => { const s = this.stocks[st.code]; map[st.code] = { p: s.price, pc: s.prevClose }; });
    APP.store.set('market_last', { date: APP.fmt.today(), map });
  }
};

/* 路由注册(委托到 APP.market) */
APP.registerPage('market', {
  mount(sec) { APP.market.mount(sec); },
  unmount() { APP.market.unmount(); }
});
