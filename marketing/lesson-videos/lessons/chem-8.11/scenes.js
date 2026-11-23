// Pictures for chem-8.11 "pH & Solubility". One EZ.scene per scene id in script.mjs.
// Every fact shown is the lesson's own (app/src/content/chem/u8.ts, chem/book.ts): solubility depends on pH when an ion
// is a weak acid, a weak base or hydroxide; CaCO3 and Mg(OH)2 dissolve more in acid (Le Chatelier); Fe(OH)3 most soluble
// at pH 2; the three links (H3O+ + OH- -> water, Q < Ksp, dissolves until Q = Ksp); Cl-, Br-, I-, NO3- do not react with
// H3O+, so AgCl is unaffected; acid does not increase Ksp; the CaF2 try. Ion counts and bar heights show order only.
(() => {
  const { lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-lab{position:absolute;text-align:center;font-size:40px;font-weight:900;white-space:nowrap}
    .x-tx{position:absolute;font-size:38px;font-weight:900;white-space:nowrap}
    .x-leg{position:absolute;font-size:30px;font-weight:900;white-space:nowrap}
    .x-chip{position:absolute;padding:8px 26px;border-radius:999px;font-size:32px;font-weight:900;white-space:nowrap;border:2px solid}
    .x-def{position:absolute;left:120px;width:810px;top:390px;text-align:center;font-size:46px;font-weight:900;line-height:1.5}
    .x-eq{position:absolute;left:120px;width:1680px;top:290px;height:96px;border-radius:24px;background:rgba(36,40,56,.92);border:3px solid var(--line);display:flex;align-items:center;justify-content:center;font-size:44px;font-weight:900;white-space:nowrap}
    .x-eqa{margin:0 20px}
    .x-box{position:absolute;left:1030px;width:730px;height:118px;border-radius:24px;border:3px solid var(--line);background:rgba(36,40,56,.6);text-align:center;font-size:36px;font-weight:900;line-height:112px;white-space:nowrap}
    .x-lk{top:290px;width:540px;height:410px;text-align:center}
    .x-lk .n,.x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-lk .f{margin-top:44px;font-size:40px;font-weight:900;white-space:nowrap}
    .x-lk p{margin:30px 16px 0;font-size:32px;font-weight:800;line-height:1.4;white-space:nowrap;color:var(--muted)}
    .x-trk{position:absolute;height:20px;border-radius:10px;background:#363c54}
    .x-q{position:absolute;width:52px;height:52px;border-radius:50%;background:var(--brand);font-size:32px;font-weight:900;line-height:52px;text-align:center}
    .x-col{position:absolute;width:96px;border-radius:14px 14px 0 0;background:var(--accent)}
    .x-ask{position:absolute;left:460px;width:1000px;top:480px;height:90px;border-radius:999px;border:3px solid var(--gold);background:rgba(242,196,67,.12);text-align:center;font-size:38px;font-weight:900;line-height:84px;white-space:nowrap}
    .x-pair{position:absolute;width:1680px;height:70px;border-radius:20px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center;font-size:36px;font-weight:900;line-height:64px;white-space:nowrap}
    .x-opt{position:absolute;width:820px;height:130px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;padding:0 96px 0 106px;font-size:44px;font-weight:900;line-height:1.2}
    .x-opt .l{position:absolute;left:26px;top:33px;width:60px;height:60px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:32px;font-weight:900;line-height:56px;text-align:center;color:var(--muted)}
    .x-opt .ok{position:absolute;right:20px;top:31px;width:64px;height:64px}
    .x-pbox{position:absolute;top:850px;width:810px;height:110px;border-radius:28px;border:3px solid;display:flex;align-items:center;justify-content:center;font-size:36px;font-weight:900;white-space:nowrap}
    .x-rc{top:320px;width:540px;height:580px;text-align:center}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', GOLD = '#f2c443', WARM = '#f3a764'
  const H3O = 'H<sub>3</sub>O<sup>+</sup>', OH = 'OH<sup>−</sup>', CO3 = 'CO<sub>3</sub><sup>2−</sup>', KSP = 'K<sub>sp</sub>'
  const mv = (c, sel, x, y) => c.$(sel).setAttribute('transform', `translate(${x} ${y})`)
  const beaker = (L, T, W, H) => `<path d="M${L + 3} ${T + 50}H${L + W - 3}V${T + H - 40}Q${L + W - 3} ${T + H - 3} ${L + W - 40} ${T + H - 3}H${L + 40}Q${L + 3} ${T + H - 3} ${L + 3} ${T + H - 40}Z" fill="rgba(60,199,188,.08)"/>
    <path d="M${L} ${T}V${T + H - 40}Q${L} ${T + H} ${L + 40} ${T + H}H${L + W - 40}Q${L + W} ${T + H} ${L + W} ${T + H - 40}V${T}" fill="none" stroke="#a3abbd" stroke-width="6" stroke-linecap="round"/>`
  const EQA = `<svg class="x-eqa" width="70" height="34" viewBox="0 0 70 34"><path d="M4 11H64L52 3M66 23H6L18 31" fill="none" stroke="#eef0f7" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`

  // ---------- a beaker with a solid at the bottom, dissolved ions, and H3O+ that either removes anions or does not ----------
  const BL = 230, BT = 480, BW = 590, BH = 345, SY = 760, SH = 52, SDROP = 26
  const tankHtml = (p, o) => `${beaker(BL, BT, BW, BH)}
    <rect class="${p}-slab" x="300" y="${SY}" width="450" height="${SH}" rx="12" fill="#d5d9e4" stroke="#8f97ab" stroke-width="3"/>
    ${o.cats.map(([x, y]) => ball(x, y, o.cr, o.cg)).join('')}
    ${o.ans.map(([x, y], i) => `<g class="${p}-a${i}">${ball(x, y, o.ar, o.ag)}</g>`).join('')}
    ${(o.news || []).map(([g], k) => `<g class="${p}-n${k}" style="opacity:0">${ball(0, 0, g === o.cg ? o.cr : o.ar, g)}</g>`).join('')}
    ${o.hits.map((_, k) => `<g class="${p}-h${k}" style="opacity:0">${ball(0, 0, 15, 'gold')}</g>`).join('')}`
  const legend = (items) => items.map(([g, r, x, txt, at]) => `<svg class="full" viewBox="0 0 1920 1080"><g data-at="${at}" data-fx="fade">${ball(x, 448, r, g)}</g></svg>
    <div class="x-leg" style="left:${x + 30}px;top:428px" data-at="${at}" data-fx="fade">${txt}</div>`).join('')
  const runTank = (c, p, o, tA, tM) => {
    o.hits.forEach((ai, k) => {
      const t0 = tA + 0.2 + k * 0.45, m = eio(c.seg(t0, t0 + 0.8))
      const [ax, ay] = o.bind ? o.ans[ai] : o.free[k]
      const tx = o.bind ? ax + 0.7 * (o.ar + 15) : ax, ty = o.bind ? ay - 0.7 * (o.ar + 15) : ay
      mv(c, `.${p}-h${k}`, tx, lerp(BT + 40, ty, m))
      const gone = o.bind ? c.seg(t0 + 1.0, t0 + 1.5) : 0
      c.$(`.${p}-h${k}`).style.opacity = String(Math.min(c.seg(t0 - 0.1, t0 + 0.15), 1 - gone))
      if (o.bind) c.$(`.${p}-a${ai}`).style.opacity = String(1 - gone)
    })
    if (tM == null) return
    const s = eio(c.seg(tM, tM + 2.4)), slab = c.$(`.${p}-slab`)
    slab.setAttribute('y', SY + SDROP * s)
    slab.setAttribute('height', SH - SDROP * s)
    o.news.forEach(([, x, y], k) => {
      const t0 = tM + 0.2 + k * 0.4, m = eo(c.seg(t0, t0 + 0.9))
      mv(c, `.${p}-n${k}`, x, lerp(SY + 10, y, m))
      c.$(`.${p}-n${k}`).style.opacity = String(c.seg(t0, t0 + 0.3))
    })
  }

  // ---------- intro: a faint row of ions ----------
  const IX = Array.from({ length: 13 }, (_, i) => 300 + i * 110)
  EZ.intro = {
    chips: [['1@0.3', 'When acid matters'], ['1@0.55', "When it doesn't"], ['1@0.85', 'How to explain it']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.28">${IX.map((x, i) => i === 6 ? `<g class="x-ib">${ball(x, 890, 18, 'gold')}</g>` : i % 2 ? ball(x, 890, 24, 'teal') : ball(x, 890, 22, 'warm')).join('')}</svg>`,
    update(c) {
      const p = 0.5 - 0.5 * Math.cos((c.t - c.sc.start) * 1.2)
      c.$('.x-ib').setAttribute('transform', `translate(0 ${lerp(0, -22, p)})`)
    },
  }

  // ---------- hook: acid rain on marble vs. table salt ----------
  const DL = [440, 490, 535, 580, 615, 470], DR = [1330, 1370, 1410, 1450, 1395, 1350]
  const drop = '<path d="M0 -16Q7 -2 0 6Q-7 -2 0 -16Z" fill="#f3a764"/>'
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="in+0.2">Acid on two kinds of salt</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:540px" data-at="0" data-fx="fade"></div>
      <div class="x-chip warm" style="left:420px;top:320px;background:rgba(243,167,100,.12)" data-at="0@0.3" data-fx="pop">acid rain</div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.2" data-fx="fade"><rect class="x-mb" x="400" y="500" width="250" height="270" rx="16" fill="#d5d9e4" stroke="#8f97ab" stroke-width="4"/>
          <path d="M420 690Q480 660 520 700T630 680M430 745Q500 720 560 752" fill="none" stroke="#a3abbd" stroke-width="3" stroke-linecap="round"/></g>
        ${DL.map((_, i) => `<g class="x-dl${i}" style="opacity:0">${drop}</g>`).join('')}
      </svg>
      <div class="x-lab" style="left:120px;width:810px;top:784px;font-size:34px" data-at="1" data-fx="fade">marble = <span class="teal">CaCO<sub>3</sub></span></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:540px" data-at="2" data-fx="fade"></div>
      <div class="x-chip warm" style="left:1325px;top:320px;background:rgba(243,167,100,.12)" data-at="2@0.2" data-fx="pop">acid</div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="2@0.1" data-fx="fade"><path d="M1395 520L1490 575L1395 630L1300 575Z" fill="#eef0f7"/><path d="M1300 575L1395 630V740L1300 685Z" fill="#c9cedb"/><path d="M1490 575L1395 630V740L1490 685Z" fill="#aab1c4"/></g>
        ${DR.map((_, i) => `<g class="x-dr${i}" style="opacity:0">${drop}</g>`).join('')}
      </svg>
      <div class="x-lab" style="left:990px;width:810px;top:744px;font-size:34px" data-at="2@0.3" data-fx="fade">table salt</div>
      <div class="x-lab muted" style="left:990px;width:810px;top:786px;font-size:30px" data-at="2@0.7" data-fx="fade">no faster than in plain water</div>
      <div class="banner" style="top:870px" data-at="3" data-fx="pop">Why does acid matter for <span class="gold">some</span> salts?</div>`,
    update(c) {
      const b = c.b, er = eio(c.seg(b[0].start + 0.6, b[2].start)), top = 500 + 60 * er
      const mb = c.$('.x-mb')
      mb.setAttribute('y', top)
      mb.setAttribute('height', 770 - top)
      const rain = (cls, xs, t0, t1, yEnd) => {
        const on = Math.min(c.seg(t0, t0 + 0.4), 1 - c.seg(t1 - 0.4, t1))
        xs.forEach((x, i) => {
          const ph = (((c.t - t0) * 0.8 + i / xs.length) % 1 + 1) % 1
          mv(c, `.${cls}${i}`, x, lerp(380, yEnd, ph))
          c.$(`.${cls}${i}`).style.opacity = String(on * Math.min(1, ph * 8, (1 - ph) * 8))
        })
      }
      rain('x-dl', DL, b[0].start + 0.3, b[2].start + 0.4, top - 8)
      rain('x-dr', DR, b[2].start + 0.3, b[3].start + 2.5, 560)
    },
  })

  // ---------- when pH matters ----------
  EZ.scene('when', {
    html: `<div class="kicker" data-at="in" data-fx="left">The rule</div><h2 class="h1" data-at="in+0.2">When pH affects solubility</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:540px" data-at="0@0.4"></div>
      <div class="x-def" data-at="1">A salt's solubility depends<br>on <span class="gold">pH</span> when one of its ions is<br>a <span class="teal">weak acid</span>, a <span class="teal">weak base</span>,<br>or <span class="teal">hydroxide</span> (${OH})</div>
      <div class="card" style="left:990px;top:300px;width:810px;height:540px" data-at="2" data-fx="fade"></div>
      <div class="x-box" style="top:330px" data-at="2@0.2">the ion reacts with <span class="warm">added acid or base</span></div>
      <div class="x-box" style="top:510px" data-at="3">the ion is <span class="bad">removed</span></div>
      <div class="x-box" style="top:690px;border-color:var(--gold)" data-at="3@0.5">the solubility equilibrium <span class="gold">shifts</span></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <path d="M1395 456V500" stroke="#a3abbd" stroke-width="5" marker-end="url(#mk-muted)" data-at="3" data-fx="fade"/>
        <path d="M1395 636V680" stroke="#a3abbd" stroke-width="5" marker-end="url(#mk-muted)" data-at="3@0.5" data-fx="fade"/>
      </svg>`,
  })

  // ---------- calcium carbonate ----------
  const TC = { cg: 'warm', cr: 22, ag: 'teal', ar: 24, bind: true,
    cats: [[330, 600], [560, 575], [700, 690]], ans: [[440, 690], [660, 600], [320, 700]], hits: [0, 1, 2],
    news: [['warm', 390, 640], ['teal', 490, 590], ['warm', 610, 700], ['teal', 560, 660]] }
  EZ.scene('carbonate', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">A basic anion</div><h2 class="h1" data-at="in+0.2">Acid dissolves CaCO<sub>3</sub></h2>
      <div class="x-eq" data-at="1"><span>CaCO<sub>3</sub>(s)</span>${EQA}<span>Ca<sup>2+</sup>(aq) + ${CO3}(aq)</span></div>
      <div class="x-chip gold" style="left:1500px;top:314px;background:rgba(242,196,67,.12)" data-at="4@0.3" data-fx="pop">shifts right ${ARR}</div>
      <div class="card" style="left:120px;top:410px;width:810px;height:440px" data-at="1@0.2" data-fx="fade"></div>
      ${legend([['warm', 16, 250, 'Ca<sup>2+</sup>', '1@0.4'], ['teal', 17, 460, CO3, '1@0.4'], ['gold', 13, 680, H3O, '3']])}
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="1@0.3" data-fx="fade">${tankHtml('x-c', TC)}</g></svg>
      <div class="card" style="left:990px;top:410px;width:810px;height:440px" data-at="2" data-fx="fade"></div>
      <div class="x-tx" style="left:1040px;top:445px" data-at="2@0.2"><span class="teal">${CO3}</span> is a <span class="teal">weak base</span></div>
      <div class="x-tx" style="left:1040px;top:545px" data-at="3@0.4"><span class="gold">${H3O}</span> removes <span class="teal">${CO3}</span></div>
      <div class="x-tx" style="left:1040px;top:645px" data-at="4">Le Châtelier: shift <span class="gold">right</span></div>
      <div class="x-tx" style="left:1040px;top:745px" data-at="5">${ARR} <span class="good">more CaCO<sub>3</sub> dissolves</span></div>
      <div class="banner" style="top:870px" data-at="5@0.6" data-fx="pop">That is what acid rain does to <span class="gold">marble</span></div>`,
    update(c) { runTank(c, 'x-c', TC, c.b[3].start + 0.8, c.b[5].start) },
  })

  // ---------- hydroxides ----------
  const TM = { cg: 'pur', cr: 25, ag: 'teal', ar: 16, bind: true,
    cats: [[360, 620], [640, 595]], ans: [[300, 570], [440, 700], [580, 700], [730, 560]], hits: [0, 1, 2, 3],
    news: [['pur', 500, 640], ['teal', 400, 590], ['teal', 600, 650]] }
  const COLS = [['2', 170], ['7', 52], ['10', 30], ['13', 16]]
  EZ.scene('hydroxide', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Hydroxides</div><h2 class="h1" data-at="in+0.2">Lower pH, higher solubility</h2>
      <div class="x-eq" data-at="1"><span>Mg(OH)<sub>2</sub>(s)</span>${EQA}<span>Mg<sup>2+</sup>(aq) + 2${OH}(aq)</span></div>
      <div class="card" style="left:120px;top:410px;width:810px;height:440px" data-at="1@0.2" data-fx="fade"></div>
      ${legend([['pur', 16, 250, 'Mg<sup>2+</sup>', '1@0.4'], ['teal', 12, 460, OH, '1@0.4'], ['gold', 13, 640, H3O, '2']])}
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="1@0.3" data-fx="fade">${tankHtml('x-m', TM)}</g></svg>
      <div class="x-chip good" style="left:1500px;top:314px;background:rgba(76,199,129,.12)" data-at="2@0.6" data-fx="pop">more dissolves</div>
      <div class="card" style="left:990px;top:410px;width:810px;height:440px" data-at="3" data-fx="fade"></div>
      <div class="x-lab" style="left:990px;width:810px;top:425px;font-size:38px" data-at="3@0.2">lower pH ${ARR} <span class="good">higher solubility</span></div>
      <div class="x-lab muted" style="left:990px;width:810px;top:488px;font-size:30px" data-at="4">Fe(OH)<sub>3</sub> solubility</div>
      <div data-at="4" data-fx="fade">
        ${COLS.map(([ph], i) => `<div class="x-col x-col${i}" style="left:${1108 + i * 170}px;top:760px;height:0"></div><div class="x-lab muted" style="left:${1076 + i * 170}px;width:160px;top:772px;font-size:30px">pH ${ph}</div>`).join('')}
        <div class="x-trk" style="left:1080px;top:758px;width:640px;height:4px;border-radius:2px"></div></div>
      <div class="x-lab good" style="left:1076px;width:160px;top:540px;font-size:30px" data-at="4@0.6" data-fx="pop">greatest</div>
      <div class="banner" style="top:870px" data-at="5" data-fx="pop">Low pH = lots of <span class="gold">${H3O}</span> to pull away ${OH}</div>`,
    update(c) {
      runTank(c, 'x-m', TM, c.b[2].start + 0.2, c.b[2].start + 2.6)
      const g = eio(c.seg(c.b[4].start + 0.1, c.b[4].start + 1.2))
      COLS.forEach(([, h], i) => {
        const el = c.$('.x-col' + i)
        el.style.height = `${h * g}px`
        el.style.top = `${760 - h * g}px`
      })
    },
  })

  // ---------- the three links ----------
  EZ.scene('explain', {
    html: `<div class="kicker gold" data-at="in" data-fx="left">How to explain it</div><h2 class="h1" data-at="in+0.2">Three links</h2>
      <div class="card x-lk" style="left:120px" data-at="1"><div class="n">1</div><div class="f">${H3O} + ${OH} ${ARR} H<sub>2</sub>O</div><p>acid reacts with ${OH}<br>from the dissolved solid</p></div>
      <div class="card x-lk" style="left:690px" data-at="2"><div class="n">2</div><div class="f">[${OH}] is <span class="bad">lowered</span></div><p>so Q = [Mg<sup>2+</sup>][${OH}]<sup>2</sup><br>becomes less than ${KSP}</p></div>
      <div class="card x-lk" style="left:1260px" data-at="3"><div class="n">3</div><div class="f" style="font-size:36px"><span class="good">more Mg(OH)<sub>2</sub> dissolves</span></div><p>until Q again<br>equals ${KSP}</p></div>
      <div class="card" style="left:120px;top:720px;width:1680px;height:130px" data-at="2@0.3" data-fx="fade"></div>
      <div data-at="2@0.3" data-fx="fade">
        <div class="x-leg muted" style="left:170px;top:768px">Q vs. ${KSP}</div>
        <div class="x-trk" style="left:400px;top:782px;width:1100px"></div>
        <div style="position:absolute;left:1297px;top:762px;width:6px;height:60px;border-radius:3px;background:var(--gold)"></div>
        <div class="x-leg gold" style="left:1320px;top:730px;font-size:26px">${KSP}</div>
        <div class="x-q" style="left:1274px;top:766px">Q</div></div>
      <div class="x-leg bad" style="left:1560px;top:768px;font-size:34px" data-at="2@0.6" data-fx="fade" data-out="3">Q &lt; ${KSP}</div>
      <div class="x-leg good" style="left:1560px;top:768px;font-size:34px" data-at="3@0.6" data-fx="fade">Q = ${KSP}</div>
      <div class="banner" style="top:870px" data-at="4" data-fx="pop">Keep it <span class="gold">qualitative</span>: no calculations on the exam</div>`,
    update(c) {
      const b = c.b, d = eio(c.seg(b[2].start + 0.4, b[2].start + 1.3)), u = eio(c.seg(b[3].start + 0.2, b[3].start + 1.4))
      c.$('.x-q').style.left = `${1274 - 520 * d + 520 * u}px`
    },
  })

  // ---------- no change: anions from strong acids ----------
  const TA = { cg: 'gray', cr: 22, ag: 'green', ar: 24, bind: false,
    cats: [[380, 620], [650, 660]], ans: [[530, 590], [330, 720]], hits: [0, 1, 2], free: [[470, 700], [710, 575], [590, 735]] }
  const STRONG = ['Cl<sup>−</sup>', 'Br<sup>−</sup>', 'I<sup>−</sup>', 'NO<sub>3</sub><sup>−</sup>']
  EZ.scene('nochange', {
    html: `<div class="kicker bad" data-at="in" data-fx="left">No effect</div><h2 class="h1" data-at="in+0.2">When pH doesn't matter</h2>
      <div class="x-eq" data-at="2"><span>AgCl(s)</span>${EQA}<span>Ag<sup>+</sup>(aq) + Cl<sup>−</sup>(aq)</span></div>
      <div class="card" style="left:120px;top:410px;width:810px;height:440px" data-at="2@0.2" data-fx="fade"></div>
      ${legend([['gray', 16, 250, 'Ag<sup>+</sup>', '2@0.4'], ['green', 17, 460, 'Cl<sup>−</sup>', '2@0.4'], ['gold', 13, 640, H3O, '4']])}
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="2@0.3" data-fx="fade">${tankHtml('x-a', TA)}</g></svg>
      <div class="card" style="left:990px;top:410px;width:810px;height:440px" data-at="1" data-fx="fade"></div>
      <div class="x-lab muted" style="left:990px;width:810px;top:430px;font-size:32px" data-at="1@0.1">conjugate bases of <span class="gold">strong</span> acids</div>
      ${STRONG.map((s, i) => `<div class="x-chip good" style="left:${1085 + i * 160}px;top:490px;width:130px;text-align:center;padding:8px 0;background:rgba(76,199,129,.12)" data-at="1@${0.3 + i * 0.12}" data-fx="pop">${s}</div>`).join('')}
      <div class="x-tx" style="left:1040px;top:600px;font-size:36px" data-at="3">HCl is strong ${ARR} Cl<sup>−</sup> is a <span class="muted">negligible base</span></div>
      <div class="x-tx" style="left:1040px;top:680px;font-size:36px" data-at="4"><span class="gold">${H3O}</span> does <span class="bad">not</span> remove Cl<sup>−</sup></div>
      <div class="x-tx" style="left:1040px;top:760px;font-size:36px" data-at="4@0.6">${ARR} <span class="gold">no shift</span></div>
      <div class="banner" style="top:870px" data-at="5" data-fx="pop">AgCl's solubility is <span class="bad">not</span> affected by acid</div>`,
    update(c) { runTank(c, 'x-a', TA, c.b[4].start + 0.2, null) },
  })

  // ---------- the trap ----------
  EZ.scene('trap', {
    html: `<div class="kicker bad" data-at="in" data-fx="left">Trap</div><h2 class="h1" data-at="in+0.2">Acid does not raise ${KSP}</h2>
      <div class="card" style="left:120px;top:290px;width:1680px;height:160px" data-at="1" data-fx="fade"></div>
      <div class="x-lab" style="left:120px;width:1680px;top:312px" data-at="1@0.1">Adding acid does <span class="bad">not</span> raise ${KSP}</div>
      <div class="x-lab" style="left:120px;width:1680px;top:378px;font-size:36px" data-at="2">Acid matters only when it can <span class="gold">remove an ion</span> ${ARR} the equilibrium shifts</div>
      <div class="x-ask" data-at="3">Does the anion come from a <span class="teal">weak</span> or a <span class="warm">strong</span> acid?</div>
      <svg class="full" viewBox="0 0 1920 1080" data-at="3@0.6" data-fx="fade">
        <path d="M760 574L560 636" stroke="#a3abbd" stroke-width="5" stroke-linecap="round" marker-end="url(#mk-muted)"/>
        <path d="M1160 574L1360 636" stroke="#a3abbd" stroke-width="5" stroke-linecap="round" marker-end="url(#mk-muted)"/></svg>
      <div class="card" style="left:120px;top:650px;width:810px;height:200px;border-color:var(--good)" data-at="4"></div>
      <div class="x-lab" style="left:120px;width:810px;top:680px;font-size:38px" data-at="4">from a <span class="teal">weak acid</span>: ${CO3}, F<sup>−</sup></div>
      <div class="x-lab good" style="left:120px;width:810px;top:760px;font-size:38px" data-at="4@0.4">${ARR} acid helps it dissolve</div>
      <div class="card" style="left:990px;top:650px;width:810px;height:200px" data-at="5"></div>
      <div class="x-lab" style="left:990px;width:810px;top:680px;font-size:38px" data-at="5">from a <span class="warm">strong acid</span>: Cl<sup>−</sup>, NO<sub>3</sub><sup>−</sup></div>
      <div class="x-lab muted" style="left:990px;width:810px;top:760px;font-size:38px" data-at="5@0.4">${ARR} no effect</div>`,
  })

  // ---------- try it ----------
  const OPTS = ['AgCl', 'AgBr', 'PbI<sub>2</sub>', 'CaF<sub>2</sub>']
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1">Which solubility <span class="teal">increases</span> the most?</h2>
      <div class="x-pair" style="left:120px;top:262px" data-at="1@0.3" data-fx="pop">when <span class="warm">HNO<sub>3</sub></span> is added</div>
      ${OPTS.map((o, i) => `<div class="x-opt x-t${i}" style="left:${120 + (i % 2) * 860}px;top:${370 + Math.floor(i / 2) * 150}px" data-at="${i + 2}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>
        ${i === 3 ? '<svg class="ok" viewBox="0 0 64 64" style="opacity:0"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        <span>${o}</span></div>`).join('')}
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="790" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="790" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 790)"/>
        <text class="x-num" x="960" y="816" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="920" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:700px" data-at="7" data-fx="pop">The answer is <span class="good">D</span></div>
      <div class="x-pbox" style="left:120px;border-color:var(--gold);background:rgba(242,196,67,.12)" data-at="8" data-fx="pop"><span>HF is weak ${ARR} F<sup>−</sup> is a <span class="gold">weak base</span>, removed</span></div>
      <div class="x-pbox" style="left:990px;border-color:var(--line);background:rgba(36,40,56,.6)" data-at="9" data-fx="pop"><span>Cl<sup>−</sup>, Br<sup>−</sup>, I<sup>−</sup>: strong acids ${ARR} <span class="muted">no effect</span></span></div>`,
    update(c) {
      const b = c.b, t0 = b[6].start + 0.3, t1 = b[7].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[7].start + 0.3, b[7].start + 0.8))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.x-t' + i)
        if (i === 3) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="150" viewBox="0 0 460 150"><rect x="150" y="112" width="160" height="26" rx="8" fill="#d5d9e4" stroke="#8f97ab" stroke-width="3"/>
    ${ball(205, 62, 24, 'teal')}${ball(240, 36, 14, 'gold')}<path d="M330 120V40" stroke="${GOLD}" stroke-width="5" stroke-linecap="round" marker-end="url(#mk-gold)"/></svg>`
  const r2 = `<svg width="460" height="150" viewBox="0 0 460 150">${ball(170, 75, 26, 'green')}<text x="230" y="90" text-anchor="middle" font-size="44" font-weight="900" class="f-muted">≠</text>${ball(290, 75, 16, 'gold')}</svg>`
  const r3 = `<svg width="460" height="150" viewBox="0 0 460 150">${[150, 230, 310].map((x, i) => `<circle cx="${x}" cy="75" r="34" fill="none" stroke="${GOLD}" stroke-width="5"/><text x="${x}" y="88" text-anchor="middle" font-size="36" font-weight="900" class="f-gold">${i + 1}</text>`).join('')}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Anion is a weak base<br>or ${OH} ${ARR} acid<br><span class="good">increases</span> solubility</p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Anion from a strong acid<br>(Cl<sup>−</sup>, NO<sub>3</sub><sup>−</sup> …)<br>${ARR} pH has <span class="muted">no effect</span></p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Explain it <span class="gold">qualitatively</span>.<br>No calculations<br>on the exam.</p></div>`,
  })
  void WARM
})()
