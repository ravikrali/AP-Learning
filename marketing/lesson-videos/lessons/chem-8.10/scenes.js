// Pictures for chem-8.10 "Buffer Capacity". One EZ.scene per scene id in script.mjs.
// Every fact shown is the lesson's own (app/src/content/chem/u8.ts, chem/book.ts): capacity = acid or base absorbed
// before the pH changes significantly; 0.10 M / 0.10 M vs 1.0 M / 1.0 M (same pH, about 10x capacity); a buffer fails
// when a partner is used up (0.010 mol A- vs 0.010 mol acid; 0.10 mol of each -> 10x); 10-fold dilution keeps the pH
// but lowers capacity; more HA -> stronger against base, more A- -> against acid (0.40 M / 0.10 M); expected acid ->
// somewhat more conjugate base; ratio -> pH, amounts -> capacity; the X / Y try.
// Ball counts only show which partner there is more of; the pH curves and bars are not to scale beyond order.
(() => {
  const { lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-lab{position:absolute;text-align:center;font-size:40px;font-weight:900;white-space:nowrap}
    .x-tx{position:absolute;font-size:38px;font-weight:900;white-space:nowrap}
    .x-chip{position:absolute;padding:8px 26px;border-radius:999px;font-size:32px;font-weight:900;white-space:nowrap;border:2px solid}
    .x-def{position:absolute;left:120px;width:810px;top:400px;text-align:center;font-size:46px;font-weight:900;line-height:1.45}
    .x-bar{position:absolute;height:20px;border-radius:10px;background:#363c54}
    .x-cap{position:absolute;height:30px;border-radius:15px;background:var(--gold)}
    .x-pm{position:absolute;width:80px;text-align:center;font-size:30px;font-weight:900;color:var(--gold)}
    .x-pm i{display:block;margin:4px auto 0;width:0;height:0;border-left:18px solid transparent;border-right:18px solid transparent;border-top:28px solid var(--gold)}
    .x-rule{position:absolute;left:1030px;width:730px;height:200px;border-radius:24px;border:3px solid var(--line);background:rgba(36,40,56,.6)}
    .x-rule div{margin-top:34px;text-align:center;font-size:40px;font-weight:900;white-space:nowrap}
    .x-rule div+div{margin-top:18px;font-size:36px}
    .x-pair{position:absolute;width:810px;height:70px;border-radius:20px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center;font-size:36px;font-weight:900;line-height:64px;white-space:nowrap}
    .x-opt{position:absolute;width:820px;height:130px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;padding:0 96px 0 106px;font-size:36px;font-weight:800;line-height:1.2}
    .x-opt .l{position:absolute;left:26px;top:33px;width:60px;height:60px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:32px;font-weight:900;line-height:56px;text-align:center;color:var(--muted)}
    .x-opt .ok{position:absolute;right:20px;top:31px;width:64px;height:64px}
    .x-pbox{position:absolute;top:850px;width:810px;height:110px;border-radius:28px;border:3px solid;display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:900;white-space:nowrap}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', GOLD = '#f2c443', PRI = '#8d8df0', WARM = '#f3a764', BAD = '#f0707a', GOOD = '#4cc781'
  const AM = 'A<sup>−</sup>', OH = 'OH<sup>−</sup>'
  const S = 1.4
  // a weak acid HA (purple with its gold H) and a conjugate base A- (teal)
  const ha = (x, y, s = S) => `<g transform="translate(${x} ${y})">${ball(0, 0, 17 * s, 'pur')}${ball(20 * s, -13 * s, 10 * s, 'gold')}</g>`
  const am = (x, y, s = S) => ball(x, y, 17 * s, 'teal')
  const mv = (c, sel, x, y) => c.$(sel).setAttribute('transform', `translate(${x} ${y})`)
  const beaker = (L, T, W, H) => `<path d="M${L + 3} ${T + 50}H${L + W - 3}V${T + H - 40}Q${L + W - 3} ${T + H - 3} ${L + W - 40} ${T + H - 3}H${L + 40}Q${L + 3} ${T + H - 3} ${L + 3} ${T + H - 40}Z" fill="rgba(60,199,188,.08)"/>
    <path d="M${L} ${T}V${T + H - 40}Q${L} ${T + H} ${L + 40} ${T + H}H${L + W - 40}Q${L + W} ${T + H} ${L + W} ${T + H - 40}V${T}" fill="none" stroke="#a3abbd" stroke-width="6" stroke-linecap="round"/>`
  // nh HA and na A- mixed in a grid inside a box; returns one string per ball, in a fixed shuffled order
  const pack = (L, T, W, H, cols, nh, na, s) => {
    const n = nh + na, rows = Math.ceil(n / cols)
    const kinds = Array.from({ length: n }, (_, i) => i).sort((a, b) => Math.sin(a * 12.9898) - Math.sin(b * 12.9898)).map((i) => (i < nh ? 'h' : 'a'))
    return kinds.map((k, i) => {
      const x = L + ((i % cols) + 0.5) * W / cols + 5 * Math.sin(i * 7.1), y = T + (Math.floor(i / cols) + 0.5) * H / rows + 5 * Math.cos(i * 3.3)
      return { k, s: k === 'h' ? ha(x - 7 * s, y + 5 * s, s) : am(x, y, s) }
    })
  }
  const drawPack = (p) => p.map((b) => b.s).join('')

  // ---------- intro: a faint row of buffer partners ----------
  const IX = Array.from({ length: 13 }, (_, i) => 300 + i * 110)
  EZ.intro = {
    chips: [['1@0.3', 'What capacity is'], ['1@0.55', 'What makes it bigger'], ['1@0.85', 'Acid vs. base']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.28">${IX.map((x, i) => i === 6 ? `<g class="x-ib">${am(x, 890)}</g>` : i % 2 ? am(x, 890) : ha(x, 890)).join('')}</svg>`,
    update(c) {
      const p = 0.5 - 0.5 * Math.cos((c.t - c.sc.start) * 1.2)
      c.$('.x-ib').setAttribute('transform', `translate(0 ${lerp(0, -22, p)})`)
    },
  }

  // ---------- hook: same pH, very different protection ----------
  const C1 = 'M1075 470L1120 476C1138 480 1140 722 1162 748L1750 775'
  const C2 = 'M1075 470L1560 490C1582 494 1588 722 1612 746L1750 760'
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="in+0.2">Same pH, same protection?</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:540px" data-at="0" data-fx="fade"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.2" data-fx="fade">${beaker(180, 420, 300, 320)}${drawPack(pack(205, 480, 250, 230, 2, 2, 2, 1.1))}</g>
        <g data-at="0@0.4" data-fx="fade">${beaker(570, 420, 300, 320)}${drawPack(pack(590, 480, 260, 235, 6, 20, 20, 0.62))}</g>
      </svg>
      <div class="x-lab warm" style="left:180px;width:300px;top:760px;font-size:34px" data-at="0@0.3" data-fx="fade">Buffer 1</div>
      <div class="x-lab teal" style="left:570px;width:300px;top:760px;font-size:34px" data-at="0@0.5" data-fx="fade">Buffer 2</div>
      <div class="x-chip gold" style="left:410px;top:330px;background:rgba(242,196,67,.12)" data-at="0@0.6" data-fx="pop">same pH</div>
      <div class="card" style="left:990px;top:300px;width:810px;height:540px" data-at="1"><h3>pH as acid is added</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <defs><clipPath id="x-clip"><rect class="x-cr" x="1060" y="400" width="0" height="440"/></clipPath></defs>
        <g data-at="1" data-fx="fade"><path d="M1070 420V792H1765" fill="none" stroke="#7d869c" stroke-width="4" stroke-linecap="round"/>
          <text x="1048" y="440" text-anchor="end" font-size="30" font-weight="900" class="f-muted">pH</text>
          <text x="1765" y="828" text-anchor="end" font-size="28" font-weight="800" class="f-muted">acid added →</text></g>
        <g clip-path="url(#x-clip)"><path d="${C2}" fill="none" stroke="${TEAL}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="${C1}" fill="none" stroke="${WARM}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></g>
        <text x="1185" y="705" font-size="30" font-weight="900" class="f-warm" data-at="2@0.3" data-fx="fade">Buffer 1 fails</text>
        <text x="1562" y="645" text-anchor="end" font-size="30" font-weight="900" class="f-teal" data-at="3@0.8" data-fx="fade">Buffer 2 fails</text>
        <g data-at="3@0.9" data-fx="fade"><path d="M1150 570H1585M1150 570l18-12M1150 570l18 12M1585 570l-18-12M1585 570l-18 12" fill="none" stroke="${GOLD}" stroke-width="5" stroke-linecap="round"/>
          <text x="1367" y="548" text-anchor="middle" font-size="32" font-weight="900" class="f-gold">10× more acid</text></g>
      </svg>
      <div class="banner" style="top:870px" data-at="4" data-fx="pop">That difference is <span class="gold">buffer capacity</span></div>`,
    update(c) {
      const b = c.b
      const w1 = eio(c.seg(b[1].start + 0.6, b[2].start + 0.6)), w2 = eio(c.seg(b[3].start, b[3].start + 2.6))
      c.$('.x-cr').setAttribute('width', 140 * w1 + 570 * w2)
    },
  })

  // ---------- definition ----------
  EZ.scene('define', {
    html: `<div class="kicker" data-at="in" data-fx="left">Definition</div><h2 class="h1" data-at="in+0.2">What is buffer capacity?</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:540px" data-at="0@0.5"><h3>Buffer capacity</h3></div>
      <div class="x-def" data-at="1">the amount of <span class="gold">acid or base</span><br>a buffer can absorb<br>before its pH<br><span class="warm">changes significantly</span></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:540px" data-at="2"><h3>Who does the work</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="2@0.2" data-fx="fade">${ha(1100, 490)}</g>
        <g data-at="2@0.6" data-fx="fade">${am(1100, 660)}</g>
      </svg>
      <div class="x-tx" style="left:1170px;top:462px" data-at="2@0.2" data-fx="fade"><span class="pri">HA</span> neutralizes added <span class="warm">base</span></div>
      <div class="x-tx" style="left:1170px;top:632px" data-at="2@0.6" data-fx="fade"><span class="teal">${AM}</span> neutralizes added <span class="warm">acid</span></div>
      <div class="banner" style="top:870px" data-at="3" data-fx="pop">Capacity depends on the <span class="gold">amounts</span>, not only the ratio</div>`,
  })

  // ---------- rule 1: more concentrated -> more capacity ----------
  EZ.scene('conc', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Rule 1</div><h2 class="h1" data-at="in+0.2">More concentrated ${ARR} more capacity</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:540px" data-at="1"><h3>0.10 M HA / 0.10 M ${AM}</h3></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:540px" data-at="2"><h3>1.0 M HA / 1.0 M ${AM}</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.3" data-fx="fade">${beaker(335, 390, 380, 300)}${drawPack(pack(360, 450, 330, 220, 2, 2, 2, 1.2))}</g>
        <g data-at="2@0.3" data-fx="fade">${beaker(1205, 390, 380, 300)}${drawPack(pack(1225, 450, 340, 225, 8, 20, 20, 0.66))}</g>
      </svg>
      <div class="x-lab" style="left:120px;width:810px;top:702px;font-size:34px" data-at="3" data-fx="fade">ratio 1 : 1 ${ARR} <span class="gold">same pH</span></div>
      <div class="x-lab" style="left:990px;width:810px;top:702px;font-size:34px" data-at="3@0.2" data-fx="fade">ratio 1 : 1 ${ARR} <span class="gold">same pH</span></div>
      <div data-at="4" data-fx="fade">
        <div class="x-lab muted" style="left:160px;width:150px;top:768px;font-size:30px;text-align:left">capacity</div>
        <div class="x-cap x-cap0" style="left:330px;top:776px;width:0"></div>
        <div class="x-lab muted" style="left:1030px;width:150px;top:768px;font-size:30px;text-align:left">capacity</div>
        <div class="x-cap x-cap1" style="left:1190px;top:776px;width:0"></div></div>
      <div class="x-lab gold" style="left:1640px;width:140px;top:766px;font-size:34px" data-at="4@0.6" data-fx="pop">≈ 10×</div>
      <div class="banner" style="top:870px" data-at="4@0.4" data-fx="pop">About <span class="gold">10×</span> more added acid or base neutralized</div>`,
    update(c) {
      const p = eio(c.seg(c.b[4].start + 0.2, c.b[4].start + 1.4))
      c.$('.x-cap0').style.width = `${44 * p}px`
      c.$('.x-cap1').style.width = `${440 * p}px`
    },
  })

  // ---------- when a buffer fails ----------
  const FA = [[360, 560], [520, 660], [640, 550], [730, 665]]
  const FH = [[330, 670], [440, 620], [540, 540], [650, 640]]
  const FREE = [[470, 705], [600, 610], [380, 615]]
  EZ.scene('fail', {
    html: `<div class="kicker bad" data-at="in" data-fx="left">When a buffer fails</div><h2 class="h1" data-at="in+0.2">A partner runs out</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:540px" data-at="1"></div>
      <div class="x-lab" style="left:120px;width:810px;top:322px;font-size:36px" data-at="1">starts with 0.010 mol <span class="teal">${AM}</span></div>
      <div class="x-chip warm" style="left:345px;top:380px;background:rgba(243,167,100,.12)" data-at="2" data-fx="pop">+ 0.010 mol strong acid</div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.2" data-fx="fade">${beaker(260, 450, 530, 300)}${FH.map(([x, y]) => ha(x, y)).join('')}</g>
        <g data-at="1@0.4" data-fx="fade">${FA.map(([x, y], i) => `<g class="x-ft${i}">${am(x, y)}</g><g class="x-fp${i}" style="opacity:0">${ball(x, y, 17 * S, 'pur')}</g>`).join('')}</g>
        ${FA.map((_, i) => `<g class="x-fh${i}" style="opacity:0">${ball(0, 0, 10 * S, 'gold')}</g>`).join('')}
        ${FREE.map((_, i) => `<g class="x-fr${i}" style="opacity:0">${ball(0, 0, 10 * S, 'gold')}</g>`).join('')}
      </svg>
      <div class="x-lab bad" style="left:120px;width:810px;top:768px;font-size:36px" data-at="2@0.7" data-fx="fade">all the ${AM} used up</div>
      <div class="card" style="left:990px;top:300px;width:810px;height:540px" data-at="1@0.3"><h3>The pH</h3></div>
      <div data-at="1@0.5" data-fx="fade">
        <div class="x-bar" style="left:1095px;top:480px;width:600px"></div>
        <div class="x-pm x-pmF" style="left:1355px;top:400px">pH<i></i></div>
        <div class="x-lab muted" style="left:1035px;width:120px;top:515px;font-size:28px">lower</div>
        <div class="x-lab muted" style="left:1635px;width:120px;top:515px;font-size:28px">higher</div></div>
      <div class="x-lab bad" style="left:990px;width:810px;top:560px;font-size:40px" data-at="3@0.4" data-fx="fade">drops sharply</div>
      <div class="x-lab" style="left:990px;width:810px;top:650px;font-size:32px" data-at="4"><span class="teal">0.10 mol</span> of each partner ${ARR} <span class="gold">10×</span> as much acid</div>
      <div class="x-chip gold" style="left:1245px;top:730px;background:rgba(242,196,67,.12)" data-at="5" data-fx="pop">same starting pH</div>
      <div class="banner" style="top:870px" data-at="0@0.5" data-fx="pop">A buffer fails when a partner is <span class="gold">nearly used up</span></div>`,
    update(c) {
      const b = c.b
      FA.forEach(([x, y], i) => {
        const t0 = b[2].start + 0.3 + i * 0.4, p = eio(c.seg(t0, t0 + 0.7)), land = c.seg(t0 + 0.6, t0 + 0.9)
        c.$('.x-fh' + i).style.opacity = String(Math.min(1, c.seg(t0 - 0.1, t0 + 0.1)))
        mv(c, '.x-fh' + i, lerp(x + 28, x + 28, p), lerp(380, y - 18, p))
        c.$('.x-fp' + i).style.opacity = String(land)
        c.$('.x-ft' + i).style.opacity = String(1 - land)
      })
      FREE.forEach(([x, y], i) => {
        const t0 = b[3].start + 0.2 + i * 0.35, p = eio(c.seg(t0, t0 + 0.7))
        c.$('.x-fr' + i).style.opacity = String(Math.min(1, c.seg(t0 - 0.1, t0 + 0.1)))
        mv(c, '.x-fr' + i, x, lerp(380, y, p))
      })
      const d2 = eio(c.seg(b[2].start + 0.3, b[2].end || b[3].start)), d3 = eio(c.seg(b[3].start + 0.3, b[3].start + 1.4))
      c.$('.x-pmF').style.left = `${1355 - 20 * d2 - 270 * d3}px`
    },
  })

  // ---------- dilution ----------
  const DP = pack(290, 510, 470, 220, 10, 20, 20, 0.7)
  // keep 2 HA and 2 A- spread over the beaker: nearest ball of the wanted kind to each target index
  const DKEEP = DP.map(() => false)
  ;[[3, 'h'], [16, 'a'], [24, 'h'], [37, 'a']].forEach(([t, k]) => {
    let best = -1
    DP.forEach((bb, i) => { if (bb.k === k && !DKEEP[i] && (best < 0 || Math.abs(i - t) < Math.abs(best - t))) best = i })
    DKEEP[best] = true
  })
  EZ.scene('dilute', {
    html: `<div class="kicker gold" data-at="in" data-fx="left">Dilution</div><h2 class="h1" data-at="in+0.2">Add water: same pH, less capacity</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:540px" data-at="in+0.3" data-fx="fade"></div>
      <div class="x-chip teal" style="left:385px;top:330px;background:rgba(60,199,188,.12)" data-at="1" data-fx="pop">+ water, 10-fold</div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="in+0.4" data-fx="fade">${beaker(260, 430, 530, 320)}${DP.map((bb, i) => `<g class="x-d${i}">${bb.s}</g>`).join('')}</g>
      </svg>
      <div class="x-lab" style="left:120px;width:810px;top:768px;font-size:34px" data-at="1@0.6" data-fx="fade">each partner: <span class="gold">1/10</span> the concentration</div>
      <div class="card" style="left:990px;top:300px;width:810px;height:540px" data-at="2"></div>
      <div class="x-lab" style="left:990px;width:810px;top:345px" data-at="2">ratio [${AM}]/[HA]: <span class="good">unchanged</span></div>
      <div class="x-lab" style="left:990px;width:810px;top:415px;font-size:36px" data-at="2@0.5" data-fx="fade">${ARR} pH <span class="good">about the same</span></div>
      <div class="x-lab" style="left:990px;width:810px;top:545px" data-at="3">concentrations: <span class="bad">lower</span></div>
      <div data-at="3@0.3" data-fx="fade">
        <div class="x-lab muted" style="left:1030px;width:150px;top:633px;font-size:30px;text-align:left">capacity</div>
        <div class="x-cap x-capD" style="left:1190px;top:641px;width:440px"></div></div>
      <div class="banner" style="top:870px" data-at="4" data-fx="pop">Still a buffer, just <span class="gold">less capacity</span></div>`,
    update(c) {
      const b = c.b, f = eio(c.seg(b[1].start + 0.3, b[1].start + 1.5))
      DP.forEach((bb, i) => { if (!DKEEP[i]) c.$('.x-d' + i).style.opacity = String(1 - f) })
      c.$('.x-capD').style.width = `${440 - 396 * eio(c.seg(b[3].start + 0.6, b[3].start + 1.6))}px`
    },
  })

  // ---------- rule 2: the ratio sets the direction ----------
  EZ.scene('direction', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Rule 2</div><h2 class="h1" data-at="in+0.2">The ratio sets the stronger direction</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:540px" data-at="3"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="3@0.2" data-fx="fade">${beaker(290, 380, 470, 270)}${drawPack(pack(315, 440, 420, 190, 5, 8, 2, 1.15))}</g>
      </svg>
      <div class="x-lab" style="left:120px;width:810px;top:665px;font-size:36px" data-at="3@0.3" data-fx="fade"><span class="pri">[HA] = 0.40 M</span> &nbsp; <span class="teal">[${AM}] = 0.10 M</span></div>
      <div class="x-lab" style="left:120px;width:810px;top:740px;font-size:34px" data-at="4"><span class="pri">HA</span> reacts with ${OH} ${ARR} <span class="gold">more vs. added base</span></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:540px" data-at="0@0.5"></div>
      <div class="x-rule x-r0" style="top:330px" data-at="1"><div>more <span class="pri">HA</span> than <span class="teal">${AM}</span></div><div>${ARR} stronger vs. added <span class="warm">base</span></div></div>
      <div class="x-rule x-r1" style="top:600px" data-at="2"><div>more <span class="teal">${AM}</span> than <span class="pri">HA</span></div><div>${ARR} stronger vs. added <span class="warm">acid</span></div></div>
      <div class="banner" style="top:870px;font-size:46px" data-at="5" data-fx="pop">Expect acid? Use somewhat more <span class="teal">conjugate base</span></div>`,
    update(c) {
      const b = c.b, w = eo(c.seg(b[4].start + 0.2, b[4].start + 0.7)), u = eo(c.seg(b[5].start, b[5].start + 0.5))
      const r0 = c.$('.x-r0'), r1 = c.$('.x-r1')
      r0.style.borderColor = w * (1 - u) ? `rgba(242,196,67,${w * (1 - u)})` : ''
      r0.style.boxShadow = `0 0 ${40 * w * (1 - u)}px rgba(242,196,67,${0.4 * w * (1 - u)})`
      r1.style.borderColor = u ? `rgba(60,199,188,${u})` : ''
      r1.style.boxShadow = `0 0 ${40 * u}px rgba(60,199,188,${0.4 * u})`
    },
  })

  // ---------- trick: bodyguards ----------
  const G1 = [ha(330, 500), am(470, 490), ha(610, 500), am(750, 490)]
  const G2 = [am(330, 620), ha(470, 630), am(610, 620), ha(750, 630)]
  EZ.scene('trick', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Trick</div><h2 class="h1" data-at="in+0.2">Capacity = how many bodyguards</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:540px" data-at="1"><h3>The bodyguards</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.3" data-fx="fade">${G1.join('')}</g>
        <g data-at="4@0.2" data-fx="fade">${G2.join('')}</g>
      </svg>
      <div class="x-lab muted" style="left:120px;width:810px;top:700px;font-size:32px" data-at="1@0.5" data-fx="fade">the two buffer partners</div>
      <div class="x-chip gold" style="left:465px;top:760px;background:rgba(242,196,67,.12)" data-at="4@0.2" data-fx="pop">× 2</div>
      <div class="card" style="left:990px;top:300px;width:810px;height:540px" data-at="2"></div>
      <div class="x-lab" style="left:990px;width:810px;top:345px" data-at="2">pH depends on the <span class="gold">ratio</span></div>
      <div class="x-lab" style="left:990px;width:810px;top:410px;font-size:34px" data-at="4@0.5" data-fx="fade">4 : 4 is still 1 : 1 ${ARR} <span class="good">same pH</span></div>
      <div class="x-lab" style="left:990px;width:810px;top:540px" data-at="3">capacity depends on the <span class="gold">amounts</span></div>
      <div data-at="3@0.4" data-fx="fade">
        <div class="x-lab muted" style="left:1030px;width:150px;top:633px;font-size:30px;text-align:left">protection</div>
        <div class="x-cap x-capT" style="left:1200px;top:641px;width:200px"></div></div>
      <div class="x-lab gold" style="left:990px;width:810px;top:710px;font-size:36px" data-at="5@0.4" data-fx="fade">twice the protection</div>
      <div class="banner" style="top:870px" data-at="6" data-fx="pop">Trap: same pH <span class="bad">≠</span> same capacity</div>`,
    update(c) {
      c.$('.x-capT').style.width = `${200 + 200 * eio(c.seg(c.b[5].start, c.b[5].start + 1))}px`
    },
  })

  // ---------- try it ----------
  const OPTS = ['Y has a lower pH', 'They have the same pH, and Y has greater capacity', 'X has greater capacity', 'They have the same capacity']
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1@0.85">Which is <span class="teal">true</span>?</h2>
      <div class="x-pair" style="left:120px;top:262px" data-at="1" data-fx="pop">Buffer X: 0.10 M <span class="pri">HA</span> / 0.10 M <span class="teal">${AM}</span></div>
      <div class="x-pair" style="left:990px;top:262px" data-at="1@0.45" data-fx="pop">Buffer Y: 0.50 M <span class="pri">HA</span> / 0.50 M <span class="teal">${AM}</span></div>
      ${OPTS.map((o, i) => `<div class="x-opt x-t${i}" style="left:${120 + (i % 2) * 860}px;top:${370 + Math.floor(i / 2) * 150}px" data-at="${i + 2}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>
        ${i === 1 ? '<svg class="ok" viewBox="0 0 64 64" style="opacity:0"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        <span>${o}</span></div>`).join('')}
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="790" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="790" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 790)"/>
        <text class="x-num" x="960" y="816" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="920" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:700px" data-at="7" data-fx="pop">The answer is <span class="good">B</span></div>
      <div class="x-pbox" style="left:120px;border-color:var(--gold);background:rgba(242,196,67,.12)" data-at="8" data-fx="pop">1 : 1 and 1 : 1&nbsp;${ARR}&nbsp;<span class="gold">same pH</span></div>
      <div class="x-pbox" style="left:990px;border-color:var(--accent);background:rgba(60,199,188,.12)" data-at="9" data-fx="pop">Y: 5× more of each&nbsp;${ARR}&nbsp;<span class="teal">more capacity</span></div>`,
    update(c) {
      const b = c.b, t0 = b[6].start + 0.3, t1 = b[7].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[7].start + 0.3, b[7].start + 0.8))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.x-t' + i)
        if (i === 1) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="150" viewBox="0 0 460 150">${ha(70, 80, 1.1)}${am(140, 75, 1.1)}<text x="230" y="92" text-anchor="middle" font-size="44" font-weight="900" class="f-muted">&lt;</text>
    ${[0, 1, 2, 3, 4, 5].map((i) => { const x = 280 + (i % 3) * 62, y = 48 + Math.floor(i / 3) * 62; return (i + Math.floor(i / 3)) % 2 ? am(x, y, 0.95) : ha(x - 6, y + 4, 0.95) }).join('')}</svg>`
  const r2 = `<svg width="460" height="150" viewBox="0 0 460 150">${[0, 1, 2].map((i) => ha(45 + i * 55, 70, 1.0)).join('')}${am(210, 70, 1.0)}
    <text x="250" y="84" font-size="34" font-weight="900" class="f-warm">vs. base</text>
    <text x="230" y="140" text-anchor="middle" font-size="26" font-weight="800" class="f-muted">extra HA</text></svg>`
  const r3 = `<svg width="460" height="150" viewBox="0 0 460 150"><text x="115" y="58" text-anchor="middle" font-size="34" font-weight="900" class="f-gold">ratio</text>
    <text x="115" y="118" text-anchor="middle" font-size="34" font-weight="900">pH</text><path d="M115 70V84" stroke="#a3abbd" stroke-width="5" stroke-linecap="round"/>
    <text x="345" y="58" text-anchor="middle" font-size="34" font-weight="900" class="f-gold">amounts</text>
    <text x="345" y="118" text-anchor="middle" font-size="34" font-weight="900">capacity</text><path d="M345 70V84" stroke="#a3abbd" stroke-width="5" stroke-linecap="round"/></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Higher concentrations<br>${ARR} <span class="gold">greater capacity</span><br><span class="muted">same ratio ${ARR} same pH</span></p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Extra <span class="pri">HA</span> ${ARR} absorbs base<br>Extra <span class="teal">${AM}</span> ${ARR} absorbs acid</p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>The <span class="gold">ratio</span> sets the pH.<br>The <span class="gold">amounts</span> set<br>the capacity.</p></div>`,
  })
})()
