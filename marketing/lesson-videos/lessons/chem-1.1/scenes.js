// Pictures for chem-1.1 "Moles and Molar Mass". One EZ.scene per scene id in script.mjs.
// Everything shown is the lesson's own (app/src/content/chem/u1.ts). No values beyond the lesson's.
(() => {
  const { clamp, eio, eo, back, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .m-ft{position:absolute;left:0;right:0;bottom:26px;text-align:center;font-size:35px;font-weight:800;white-space:nowrap}
    .m-big{position:absolute;left:0;right:0;text-align:center;font-weight:900;white-space:nowrap}
    .m-row{position:absolute;left:0;right:0;text-align:center;font-size:40px;font-weight:800;white-space:nowrap}
    .m-col{top:340px;width:540px;height:470px}
    .m-col h3 small{display:inline-block;width:52px;height:52px;margin-right:14px;border-radius:50%;background:var(--brand);font-size:30px;font-weight:900;line-height:52px;text-align:center}
    .m-lab{position:absolute;width:300px;text-align:center;font-size:40px;font-weight:900;white-space:nowrap}
    .m-rc{top:320px;width:540px;height:540px;text-align:center} .m-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .m-rc .pic{height:200px;margin-top:20px;display:flex;align-items:center;justify-content:center;font-weight:900;white-space:nowrap}
    .m-rc p{margin:14px 20px 0;font-size:35px;font-weight:800;line-height:1.3}
  `
  document.head.appendChild(css)

  const all = (c, q) => (c['_' + q] ??= [...c.root.querySelectorAll(q)])
  const water = (x, y, s = 1) => ball(x, y, 42 * s, 'red') + ball(x - 62 * s, y + 38 * s, 24 * s, 'gray') + ball(x + 62 * s, y + 38 * s, 24 * s, 'gray')
  const lcg = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647

  // ---------- intro artwork: faint balls on the left and right edges (all above y = 950) ----------
  const col = (x, g) => [0, 1, 2, 3, 4, 5].map((i) => ball(x, 260 + i * 110, 30, g)).join('')
  EZ.intro = {
    chips: [['1@0.28', 'What a mole is'], ['1@0.52', 'Grams to moles'], ['1@0.76', 'Counting by weighing']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">${col(70, 'teal')}${col(160, 'warm')}${col(1760, 'warm')}${col(1850, 'teal')}</svg>`,
  }

  // ---------- hook: too many to count, so weigh ----------
  const rnd = lcg(7), DOTS = Array.from({ length: 90 }, () => [30 + rnd() * 700, 110 + rnd() * 330, 4 + rnd() * 3, rnd() < 0.5 ? 'teal' : 'pur'])
  const coin = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="34" ry="12" fill="url(#g-gold)"/>`
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Look closer</div><h2 class="h1" data-at="0">You can’t count atoms <span class="warm">one by one</span></h2>
      <div class="card" style="left:120px;top:320px;width:760px;height:540px" data-at="1"><h3>One grain of salt</h3>
        <svg style="position:absolute;left:0;top:0" width="760" height="540" viewBox="0 0 760 540">
          ${DOTS.map(([x, y, r, g], i) => `<g class="i" data-d="${i}">${ball(x, y, r, g)}</g>`).join('')}</svg>
        <div class="m-ft" data-at="1@0.5" data-fx="pop">more than 10<sup>17</sup> atoms</div></div>
      <div class="card" style="left:1040px;top:320px;width:760px;height:540px" data-at="2"><h3>Count by <span class="teal">weighing</span></h3>
        <svg style="position:absolute;left:0;top:0" width="760" height="540" viewBox="0 0 760 540"><g transform="translate(0 -70)">
          <g data-at="3" data-fx="pop"><path d="M250 330 Q250 250 330 250 L430 250 Q510 250 510 330 L510 360 L250 360 Z" fill="#7f88a2"/>
            ${[[300, 244], [360, 236], [420, 244], [470, 240], [330, 214], [400, 210], [450, 214]].map(([x, y]) => coin(x, y)).join('')}</g>
          <rect x="190" y="372" width="380" height="26" rx="10" fill="#aab1c4"/><rect x="345" y="398" width="70" height="60" fill="#8088a0"/><rect x="270" y="456" width="220" height="22" rx="10" fill="#646c82"/></g>
        </svg>
        <div class="m-ft" data-at="3" data-fx="fade">a bank weighs a bag of coins</div></div>`,
    update(c) {
      const t0 = c.b[1].start + 0.2
      for (const g of all(c, '.i')) { const p = clamp((c.t - t0 - +g.dataset.d * 0.018) / 0.3); g.style.opacity = p; g.style.transform = `scale(${0.5 + 0.5 * p})` }
    },
  })

  // ---------- the mole: a chemist's dozen ----------
  const eggs = [0, 1, 2, 3].flatMap((k) => [0, 1, 2].map((r) => ball(160 + k * 80, 160 + r * 80, 28, 'gold'))).join('')
  EZ.scene('mole', {
    html: `<div class="kicker" data-at="in" data-fx="left">The mole</div><h2 class="h1" data-at="0">The mole is a chemist’s <span class="warm">“dozen”</span></h2>
      <div class="card" style="left:120px;top:320px;width:760px;height:540px" data-at="1"><h3>A dozen</h3>
        <svg style="position:absolute;left:0;top:60px" width="760" height="420" viewBox="0 0 760 420"><g transform="translate(120 20)">${eggs}</g></svg>
        <div class="m-ft">12 things</div></div>
      <div class="card" style="left:1040px;top:320px;width:760px;height:540px" data-at="2"><h3>A mole</h3>
        <div class="m-big" style="top:90px;font-size:80px;color:var(--warm)" data-at="2@0.3" data-fx="pop">6.022 × 10<sup>23</sup></div>
        <div class="m-big" style="top:200px;font-size:38px;color:var(--muted)" data-at="2@0.6" data-fx="fade">things · Avogadro’s number, N<sub>A</sub></div>
        <div class="m-row" style="top:290px;font-size:34px" data-at="3" data-fx="fade">1 mol of carbon atoms<br>= <span class="teal">6.022 × 10<sup>23</sup></span> atoms</div>
        <div class="m-row" style="top:400px;font-size:34px" data-at="4" data-fx="fade">1 mol of water molecules<br>= <span class="teal">6.022 × 10<sup>23</sup></span> molecules</div></div>`,
    update(c) {},
  })

  // ---------- molar mass: grams match amu ----------
  EZ.scene('molar', {
    html: `<div class="kicker" data-at="in" data-fx="left">Why this number?</div><h2 class="h1" data-at="0">Grams <span class="teal">match</span> amu</h2>
      <div class="card" style="left:120px;top:320px;width:640px;height:420px" data-at="2"><h3>One water molecule</h3>
        <svg style="position:absolute;left:0;top:70px" width="640" height="300" viewBox="0 0 640 300">${water(320, 110, 1.5)}</svg>
        <div class="m-ft">about <span class="warm">18.02 amu</span></div></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="1" data-fx="fade"><line x1="800" y1="530" x2="1120" y2="530" stroke="#8d8df0" stroke-width="12" marker-end="url(#mk-pri)"/></g></svg>
      <div class="m-lab" style="left:810px;top:440px;width:300px" data-at="1" data-fx="fade">same number</div>
      <div class="card" style="left:1160px;top:320px;width:640px;height:420px" data-at="3"><h3>One mole of water</h3>
        <div class="m-big" style="top:120px;font-size:100px;color:var(--accent)" data-at="3@0.3" data-fx="pop">18.02 g</div></div>
      <div class="banner" style="top:830px" data-at="4" data-fx="pop">Molar mass, <span class="warm">M</span> = 18.02 g/mol</div>`,
  })

  // ---------- the one equation ----------
  EZ.scene('equation', {
    html: `<div class="kicker" data-at="in" data-fx="left">The one equation</div><h2 class="h1" data-at="0">One equation to <span class="warm">know</span></h2>
      <div class="card" style="left:120px;top:320px;width:800px;height:230px" data-at="1" data-fx="pop"><div class="m-big" style="top:40px;font-size:130px">n <span class="pri">=</span> <span class="teal">m</span> <span class="pri">/</span> <span class="warm">M</span></div></div>
      <div class="m-row" style="left:140px;right:auto;text-align:left;top:590px;font-size:40px" data-at="2" data-fx="right"><span class="pri">n</span> = moles</div>
      <div class="m-row" style="left:140px;right:auto;text-align:left;top:660px;font-size:40px" data-at="2@0.4" data-fx="right"><span class="teal">m</span> = mass in grams</div>
      <div class="m-row" style="left:140px;right:auto;text-align:left;top:730px;font-size:40px" data-at="2@0.75" data-fx="right"><span class="warm">M</span> = molar mass in g/mol</div>
      <div class="card" style="left:1000px;top:320px;width:800px;height:540px" data-at="3"><h3>Molar mass of CO<sub>2</sub></h3>
        <div class="m-row" style="top:130px;font-size:42px" data-at="3@0.4" data-fx="fade">add up the atomic masses</div>
        <div class="m-row" style="top:230px;font-size:48px" data-at="4" data-fx="up">12.01 + 2(16.00)</div>
        <div class="m-row" style="top:350px;font-size:72px;color:var(--accent)" data-at="5" data-fx="pop">44.01 g/mol</div></div>`,
  })

  // ---------- the hub trick ----------
  const NX = [360, 960, 1560], NY = 500
  const node = (x, g, t) => `<circle cx="${x}" cy="${NY}" r="125" fill="rgba(36,40,56,.92)" stroke="${g}" stroke-width="8"/><text x="${x}" y="${NY + 15}" text-anchor="middle" font-size="46" font-weight="900" style="fill:${g}">${t}</text>`
  const arr = (x1, x2, y, mk, col) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${col}" stroke-width="10" marker-end="url(#mk-${mk})"/>`
  EZ.scene('hub', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">The mole is the <span class="pri">hub</span></h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.5" data-fx="pop">${node(NX[1], '#8d8df0', 'moles')}</g>
        <g data-at="1" data-fx="pop">${node(NX[0], '#f3a764', 'grams')}</g><g data-at="1@0.5" data-fx="pop">${node(NX[2], '#3cc7bc', 'particles')}</g>
        <g data-at="2" data-fx="fade">${arr(500, 810, 450, 'pri', '#8d8df0')}</g>
        <g data-at="3" data-fx="fade">${arr(810, 500, 560, 'warm', '#f3a764')}</g>
        <g data-at="4" data-fx="fade">${arr(1100, 1410, 450, 'teal', '#3cc7bc')}</g>
        <g data-at="5" data-fx="fade">${arr(1410, 1100, 560, 'pri', '#8d8df0')}</g>
        <g data-at="6" data-fx="fade"><path d="M360 640 Q960 920 1560 640" fill="none" stroke="#f0707a" stroke-width="8" stroke-dasharray="16 12"/>
          <text x="960" y="790" text-anchor="middle" font-size="64" font-weight="900" class="f-bad" style="fill:#f0707a">✕</text></g>
      </svg>
      <div class="m-lab" style="left:510px;top:370px" data-at="2" data-fx="fade"><span class="pri">÷ M</span></div>
      <div class="m-lab" style="left:510px;top:585px" data-at="3" data-fx="fade"><span class="warm">× M</span></div>
      <div class="m-lab" style="left:1110px;top:370px;width:320px;font-size:34px" data-at="4" data-fx="fade"><span class="teal">× 6.022 × 10<sup>23</sup></span></div>
      <div class="m-lab" style="left:1110px;top:585px;width:320px;font-size:34px" data-at="5" data-fx="fade"><span class="pri">÷ 6.022 × 10<sup>23</sup></span></div>
      <div class="banner" style="top:900px" data-at="6" data-fx="pop">Never grams → particles directly. <span class="teal">Pass through moles!</span></div>`,
  })

  // ---------- worked example ----------
  EZ.scene('example', {
    html: `<div class="kicker" data-at="in" data-fx="left">Example</div><h2 class="h1" data-at="0">How many molecules in <span class="warm">36.0 g</span> of water?</h2>
      <div class="card m-col" style="left:120px" data-at="1"><h3><small>1</small>Molar mass</h3>
        <div class="m-row" style="top:130px;font-size:38px">2(1.008) + 16.00</div>
        <div class="m-row" style="top:230px;font-size:50px;color:var(--warm)">18.02 g/mol</div>
        <svg style="position:absolute;left:170px;top:300px" width="200" height="140" viewBox="0 0 200 140">${water(100, 50, 0.9)}</svg></div>
      <div class="card m-col" style="left:690px" data-at="2"><h3><small>2</small>Moles</h3>
        <div class="m-row" style="top:130px;font-size:38px">36.0 g ÷ 18.02 g/mol</div>
        <div class="m-row" style="top:230px;font-size:64px;color:var(--accent)">2.00 mol</div></div>
      <div class="card m-col" style="left:1260px" data-at="3"><h3><small>3</small>Molecules</h3>
        <div class="m-row" style="top:120px;font-size:36px">2.00 mol ×</div>
        <div class="m-row" style="top:180px;font-size:36px">6.022 × 10<sup>23</sup> /mol</div>
        <div class="m-row" style="top:270px;font-size:52px;color:var(--accent)">1.20 × 10<sup>24</sup></div></div>
      <div class="banner" style="top:870px" data-at="4" data-fx="pop"><span class="teal">1.20 × 10<sup>24</sup></span> water molecules</div>`,
  })

  // ---------- trap ----------
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Watch out</div><h2 class="h1" data-at="0">Count atoms vs. molecules <span class="bad">carefully</span></h2>
      <div class="card" style="left:120px;top:320px;width:760px;height:540px" data-at="1"><h3>1 mol of H<sub>2</sub>O</h3>
        <svg style="position:absolute;left:0;top:90px" width="760" height="300" viewBox="0 0 760 300">${water(380, 110, 1.7)}</svg>
        <div class="m-row" style="top:380px;font-size:36px">1 mol of molecules</div>
        <div class="m-row" style="top:440px;font-size:42px;color:var(--accent)" data-at="1@0.6" data-fx="pop">3 mol of atoms</div></div>
      <div class="card" style="left:1040px;top:320px;width:760px;height:540px" data-at="2"><h3>Oxygen gas is O<sub>2</sub></h3>
        <svg style="position:absolute;left:0;top:110px" width="760" height="260" viewBox="0 0 760 260">${ball(310, 130, 66, 'red')}${ball(450, 130, 66, 'red')}</svg>
        <div class="m-row" style="top:370px;font-size:60px;color:var(--accent)" data-at="2@0.5" data-fx="pop">32.00 g/mol</div>
        <div class="m-row" style="top:450px;font-size:38px;color:var(--bad)" data-at="2@0.8" data-fx="fade">not 16.00</div></div>`,
  })

  // ---------- try it ----------
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <div class="card" style="left:120px;top:290px;width:1680px;height:230px" data-at="1"><div class="m-big" style="top:36px;font-size:58px">How many moles are in <span class="warm">10.0 g of NaOH</span>?</div>
        <div class="m-big" style="top:140px;font-size:38px;color:var(--muted)">Na = 22.99 · O = 16.00 · H = 1.008</div></div>
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="720" r="66" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="720" r="66" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 720)"/>
        <text class="num" x="960" y="744" text-anchor="middle" font-size="70" font-weight="900">3</text><text x="960" y="840" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="m-row" style="top:590px;font-size:44px" data-at="4" data-fx="fade">M = 22.99 + 16.00 + 1.008 = <span class="warm">40.00 g/mol</span></div>
      <div class="m-row" style="top:680px;font-size:44px" data-at="5" data-fx="fade">10.0 ÷ 40.00 = <span class="teal">0.250 mol</span></div>
      <div class="banner" style="top:790px;font-size:60px" data-at="3" data-fx="pop">Answer: <span class="teal">0.250 mol</span></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
    },
  })

  // ---------- recap ----------
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card m-rc" style="left:120px" data-at="1"><div class="n">1</div><div class="pic" style="font-size:56px;color:var(--warm)">6.022 × 10<sup>23</sup></div><p>1 mol = that many particles<br><span class="teal">on your equation sheet</span></p></div>
      <div class="card m-rc" style="left:690px" data-at="2"><div class="n">2</div><div class="pic" style="font-size:96px">n <span class="pri">=</span> <span class="teal">m</span><span class="pri">/</span><span class="warm">M</span></div><p>Molar mass in g/mol = the mass in <span class="warm">amu</span></p></div>
      <div class="card m-rc" style="left:1260px" data-at="3"><div class="n">3</div><div class="pic" style="font-size:34px;color:var(--warm)">grams&nbsp; ⇄ &nbsp;<span class="pri">moles</span>&nbsp; ⇄ &nbsp;<span class="teal">particles</span></div><p>Always go<br><span class="pri">through moles</span></p></div>`,
  })
})()
