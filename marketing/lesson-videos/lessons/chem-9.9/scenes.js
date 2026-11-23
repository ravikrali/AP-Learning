// Pictures for chem-9.9 "Cell Potential & Free Energy". One EZ.scene per scene id in script.mjs.
// Every fact shown is the lesson's own (app/src/content/chem/u9.ts, chem/book.ts): lead–acid ≈ 2 V (a car battery
// is six in series), AA 1.5 V; more positive E° = stronger tendency to be reduced; Cu²⁺/Cu +0.34 V, Zn²⁺/Zn −0.76 V;
// higher E° reduced (cathode), other reversed (anode); E°cell = E°cathode − E°anode = +1.10 V; ΔG° = −nFE°,
// F = 96,485 C/mol e⁻, −(2)(96,485)(1.10) = −212 kJ; sign rules (galvanic / electrolytic); never multiply E°
// (1 V = 1 J/C, doubling doubles energy and charge); the Ag/Cu try (+0.46 V), copper wire in silver nitrate.
// The ladders are drawn to scale in volts. Battery and energy/charge bars carry no numbers beyond the lesson's.
// Wrong choices in the try are the usual slips with the lesson's own numbers (adding, reversing, doubling Ag).
(() => {
  const { lerp, eio, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-line{position:absolute;left:0;width:1920px;text-align:center;font-size:44px;font-weight:900;white-space:nowrap}
    .x-lab{position:absolute;text-align:center;font-size:42px;font-weight:900;white-space:nowrap;line-height:1.2}
    .x-lab small{display:block;font-size:28px;font-weight:800;color:var(--muted)}
    .x-hl{position:absolute;font-size:42px;font-weight:900;white-space:nowrap;line-height:1.2}
    .x-hl small{display:block;font-size:28px;font-weight:800;color:var(--muted)}
    .x-row{position:absolute;left:44px;right:30px;font-size:40px;font-weight:900;white-space:nowrap}
    .x-row em{font-style:normal;font-size:30px;font-weight:800;color:var(--muted)}
    .x-eq{position:absolute;left:0;width:1920px;text-align:center;font-size:88px;font-weight:900;white-space:nowrap}
    .x-tl{position:absolute;top:450px;width:480px;height:170px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .x-tl .f{margin-top:34px;font-size:48px;font-weight:900;line-height:1;white-space:nowrap}
    .x-tl .s{margin-top:18px;font-size:30px;font-weight:800;color:var(--muted);white-space:nowrap}
    .x-sr{position:absolute;left:120px;width:1680px;height:130px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid var(--line)}
    .x-c{position:absolute;top:0;line-height:124px;font-size:44px;font-weight:900;white-space:nowrap}
    .x-note{position:absolute;left:1240px;width:560px;top:318px;text-align:center;font-size:32px;font-weight:800;line-height:1.3;white-space:nowrap}
    .x-opt{position:absolute;width:820px;height:120px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;padding:0 96px 0 106px;font-size:42px;font-weight:900;line-height:1.2}
    .x-opt .l{position:absolute;left:26px;top:26px;width:60px;height:60px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:32px;font-weight:900;line-height:56px;text-align:center;color:var(--muted)}
    .x-opt .ok{position:absolute;right:20px;top:24px;width:64px;height:64px}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', GOLD = '#f2c443', WARM = '#f3a764', BAD = '#f0707a', LINE = '#363c54', MUT = '#a3abbd'
  const E0 = 'E°', DG = 'ΔG°'
  const ECELL = `E°<sub>cell</sub>`
  const mv = (c, sel, x, y) => c.$(sel).setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`)
  // an upright cell (battery) centred at (cx, cy)
  const cell = (cx, cy, w, h, sw = 4) => `<rect x="${cx - w * 0.18}" y="${cy - h / 2 - h * 0.07}" width="${w * 0.36}" height="${h * 0.08}" rx="${w * 0.05}" fill="${MUT}"/>
    <rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${w * 0.14}" fill="rgba(170,177,196,.16)" stroke="${MUT}" stroke-width="${sw}"/>
    <text x="${cx}" y="${cy - h / 2 + w * 0.42}" text-anchor="middle" font-size="${w * 0.36}" font-weight="900" class="f-gold">+</text>
    <text x="${cx}" y="${cy + h / 2 - w * 0.16}" text-anchor="middle" font-size="${w * 0.36}" font-weight="900" class="f-muted">−</text>`

  // ---------- intro: a faint row of six cells in series ----------
  const IC = [0, 1, 2, 3, 4, 5].map((i) => 660 + i * 120)
  EZ.intro = {
    chips: [['1@0.3', 'Reduction potentials'], ['1@0.55', 'Cell voltage'], ['1@0.85', 'ΔG° = −nFE°']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.22"><line x1="660" y1="938" x2="1260" y2="938" stroke="${MUT}" stroke-width="4"/>
      ${IC.map((x) => cell(x, 890, 60, 78, 3)).join('')}</svg>`,
  }

  // ---------- hook: where a battery's voltage comes from ----------
  const SIX = [0, 1, 2, 3, 4, 5].map((i) => 515 + i * 66)
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="in+0.2">Where does a cell's voltage come from?</h2>
      <div class="card" style="left:120px;top:300px;width:780px;height:520px" data-at="0"><h3>Lead–acid cell</h3></div>
      <div class="card" style="left:1020px;top:300px;width:780px;height:520px" data-at="0@0.55"><h3>AA cell</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.15" data-fx="pop">${cell(300, 530, 150, 210)}</g>
        <g data-at="0@0.65" data-fx="pop">${cell(1410, 530, 100, 240)}</g>
        <g data-at="1" data-fx="fade"><line x1="515" y1="575" x2="845" y2="575" stroke="${MUT}" stroke-width="4"/>${SIX.map((x) => cell(x, 520, 48, 84, 3)).join('')}</g>
      </svg>
      <div class="x-lab gold" style="left:150px;width:300px;top:680px;font-size:60px" data-at="0@0.3" data-fx="pop">≈ 2 V</div>
      <div class="x-lab gold" style="left:1260px;width:300px;top:680px;font-size:60px" data-at="0@0.8" data-fx="pop">1.5 V</div>
      <div class="x-lab" style="left:480px;width:400px;top:630px;font-size:34px" data-at="1@0.3" data-fx="fade">car battery<small>six cells in series</small></div>
      <div class="banner" style="top:860px" data-at="2" data-out="3" data-fx="pop">The voltage comes from the <span class="gold">chemistry</span></div>
      <div class="banner" style="top:860px" data-at="3" data-fx="pop">How badly each half-reaction <span class="teal">wants electrons</span></div>`,
  })

  // ---------- standard reduction potentials: the ladder ----------
  const AX = 520, Y0 = 600, S = 280
  const vy = (v) => Y0 - v * S
  const rung = (cls, col) => `<g class="${cls}"><line x1="${AX - 40}" y1="0" x2="900" y2="0" stroke="${col}" stroke-width="10" stroke-linecap="round"/><circle cx="${AX}" cy="0" r="13" style="fill:${col}" stroke="#10131c" stroke-width="4"/></g>`
  EZ.scene('potentials', {
    html: `<div class="kicker" data-at="in" data-fx="left">Reduction potentials</div><h2 class="h1" data-at="in+0.2">Each half-reaction has an E°</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0" data-fx="fade"><line x1="${AX}" y1="830" x2="${AX}" y2="340" stroke="${MUT}" stroke-width="5" stroke-linecap="round" marker-end="url(#mk-muted)"/>
          <line x1="${AX - 14}" y1="${Y0}" x2="${AX + 14}" y2="${Y0}" stroke="${MUT}" stroke-width="5"/>
          <text x="${AX - 26}" y="${Y0 + 11}" text-anchor="end" font-size="30" font-weight="900" class="f-muted">0</text>
          <text x="${AX + 30}" y="350" font-size="32" font-weight="900" class="f-muted">E° (V)</text></g>
        <g data-at="2">${rung('x-r0', TEAL)}</g>
        <g data-at="3">${rung('x-r1', WARM)}</g>
      </svg>
      <div class="x-note" data-at="1" data-fx="fade"><span class="teal">↑ more positive E°</span><br>stronger tendency to be reduced</div>
      <div class="x-hl teal" style="right:${1920 - AX + 66}px;top:${vy(0.34) - 26}px" data-at="2+0.9" data-fx="fade">+0.34 V</div>
      <div class="x-hl" style="left:930px;top:${vy(0.34) - 26}px" data-at="2+0.9" data-fx="fade">Cu<sup>2+</sup> + 2e<sup>−</sup> ${ARR} Cu</div>
      <div class="x-hl warm" style="right:${1920 - AX + 66}px;top:${vy(-0.76) - 26}px" data-at="3+0.9" data-fx="fade">−0.76 V</div>
      <div class="x-hl" style="left:930px;top:${vy(-0.76) - 26}px" data-at="3+0.9" data-fx="fade">Zn<sup>2+</sup> + 2e<sup>−</sup> ${ARR} Zn</div>
      <div class="x-hl teal" style="left:1380px;top:${vy(0.34) - 30}px" data-at="4" data-fx="pop">cathode<small>reduced</small></div>
      <div class="x-hl warm" style="left:1380px;top:${vy(-0.76) - 30}px" data-at="5" data-fx="pop">anode<small>runs in reverse: oxidized</small></div>
      <div class="banner" style="top:880px" data-at="6" data-fx="pop">Cu<sup>2+</sup> is <span class="teal">reduced</span> · Zn is <span class="warm">oxidized</span></div>`,
    update(c) {
      mv(c, '.x-r0', 0, lerp(Y0, vy(0.34), eio(c.p('2', 0.8))))
      mv(c, '.x-r1', 0, lerp(Y0, vy(-0.76), eio(c.p('3', 0.8))))
    },
  })

  // ---------- E°cell for the Daniell cell ----------
  const BX = 1060, B0 = 560, BS = 250
  const by = (v) => B0 - v * BS
  EZ.scene('cell', {
    html: `<div class="kicker" data-at="in" data-fx="left">Cell potential</div><h2 class="h1" data-at="in+0.2">The zinc–copper cell</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:540px" data-at="0@0.3"><h3>Calculate</h3>
        <div class="x-row" style="top:100px" data-at="1">${ECELL} = E°<sub>cathode</sub> − E°<sub>anode</sub></div>
        <div class="x-row" style="top:170px" data-at="2"><em>both as reduction potentials</em></div>
        <div class="x-row" style="top:250px" data-at="3">= 0.34 − (−0.76)</div>
        <div class="x-row" style="top:330px;font-size:48px" data-at="4">= <span class="gold">+1.10 V</span></div>
        <div class="x-row" style="top:420px" data-at="6"><span class="teal">positive</span> ${ARR} favored</div></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:540px" data-at="0@0.6"><h3>On the ladder</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.7" data-fx="fade"><line x1="${BX}" y1="800" x2="${BX}" y2="390" stroke="${MUT}" stroke-width="4" stroke-linecap="round" marker-end="url(#mk-muted)"/>
          <line x1="${BX - 12}" y1="${B0}" x2="${BX + 12}" y2="${B0}" stroke="${MUT}" stroke-width="4"/>
          <text x="${BX - 22}" y="${B0 + 10}" text-anchor="end" font-size="28" font-weight="900" class="f-muted">0</text>
          <line x1="${BX - 20}" y1="${by(0.34)}" x2="1330" y2="${by(0.34)}" stroke="${TEAL}" stroke-width="9" stroke-linecap="round"/>
          <line x1="${BX - 20}" y1="${by(-0.76)}" x2="1330" y2="${by(-0.76)}" stroke="${WARM}" stroke-width="9" stroke-linecap="round"/></g>
        <path d="M1550 ${by(0.34)}H1572V${by(-0.76)}H1550" fill="none" stroke="${GOLD}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" data-at="5" data-fx="draw"/>
      </svg>
      <div class="x-hl teal" style="left:1350px;top:${by(0.34) - 26}px;font-size:36px" data-at="0@0.8" data-fx="fade">+0.34 V<small>Cu, cathode</small></div>
      <div class="x-hl warm" style="left:1350px;top:${by(-0.76) - 26}px;font-size:36px" data-at="0@0.8" data-fx="fade">−0.76 V<small>Zn, anode</small></div>
      <div class="x-hl gold" style="left:1592px;top:${(by(0.34) + by(-0.76)) / 2 - 26}px;font-size:42px" data-at="5@0.4" data-fx="pop">1.10 V</div>
      <div class="banner" style="top:880px" data-at="6@0.3" data-fx="pop">${ECELL} &gt; 0 ${ARR} <span class="teal">favored</span></div>`,
  })

  // ---------- ΔG° = −nFE° ----------
  EZ.scene('dg', {
    html: `<div class="kicker" data-at="in" data-fx="left">Free energy</div><h2 class="h1" data-at="in+0.2">Cell potential gives ΔG°</h2>
      <div class="x-eq" style="top:300px" data-at="1"><span class="pri">${DG}</span> = −<span class="gold">n</span><span class="teal">F</span>${E0}</div>
      <div class="x-tl" style="left:200px" data-at="2" data-out="7" data-fx="pop"><div class="f gold">n</div><div class="s">mol e<sup>−</sup> transferred</div></div>
      <div class="x-tl" style="left:720px" data-at="3" data-out="7" data-fx="pop"><div class="f"><span class="teal">F</span> = 96,485</div><div class="s">C/mol e<sup>−</sup></div></div>
      <div class="x-tl" style="left:1240px;border-color:${GOLD}" data-at="4" data-out="7" data-fx="pop"><div class="f">n = <span class="gold">2</span></div><div class="s">zinc–copper cell</div></div>
      <div class="x-line" style="top:670px;font-size:52px" data-at="5" data-out="7">${DG} = −(2)(96,485)(1.10)</div>
      <div class="x-line" style="top:750px;font-size:52px" data-at="6" data-out="7">= −212,000 J = <span class="gold">−212 kJ</span></div>
      <div class="x-sr" style="top:450px" data-at="8"><div class="x-c" style="left:44px">${E0} &gt; 0 ${ARR} ${DG} &lt; 0 ${ARR} <span class="teal">favored</span></div><div class="x-c teal" style="left:1260px">galvanic</div></div>
      <div class="x-sr" style="top:620px" data-at="9"><div class="x-c" style="left:44px">${E0} &lt; 0 ${ARR} ${DG} &gt; 0 ${ARR} <span class="warm">needs external voltage</span></div><div class="x-c warm" style="left:1260px">electrolytic</div></div>`,
  })

  // ---------- trap: never multiply E° ----------
  const bars = (cx, cls) => `<g class="${cls}a"><rect x="${cx - 170}" y="0" width="120" height="1" style="fill:${GOLD}"/></g>
    <g class="${cls}b"><rect x="${cx + 50}" y="0" width="120" height="1" style="fill:${TEAL}"/></g>
    <line x1="${cx - 220}" y1="740" x2="${cx + 220}" y2="740" stroke="${MUT}" stroke-width="4"/>
    <text x="${cx - 110}" y="782" text-anchor="middle" font-size="30" font-weight="800" class="f-gold">energy</text>
    <text x="${cx + 110}" y="782" text-anchor="middle" font-size="30" font-weight="800" class="f-teal">charge</text>`
  const setBar = (c, sel, h) => c.$(sel).setAttribute('transform', `translate(0 ${(740 - h).toFixed(1)}) scale(1 ${h.toFixed(1)})`)
  EZ.scene('trap', {
    html: `<div class="kicker bad" data-at="in" data-fx="left">Trap</div><h2 class="h1" data-at="in+0.2">Never multiply E° by coefficients</h2>
      <div class="card" style="left:120px;top:300px;width:780px;height:520px" data-at="0@0.4"><h3>Reaction × 1</h3></div>
      <div class="card" style="left:1020px;top:300px;width:780px;height:520px" data-at="1"><h3>Reaction <span class="gold">× 2</span></h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.6" data-fx="fade">${bars(510, 'x-l')}</g>
        <g data-at="1@0.3" data-fx="fade">${bars(1410, 'x-r')}</g>
      </svg>
      <div class="x-lab gold" style="left:120px;width:780px;top:405px;font-size:52px" data-at="0@0.8" data-fx="pop">${E0} = +1.10 V</div>
      <div class="x-lab gold" style="left:1020px;width:780px;top:405px;font-size:52px" data-at="2" data-fx="pop">${E0} = +1.10 V <span class="muted" style="font-size:32px">not doubled</span></div>
      <div class="x-lab" style="left:120px;width:780px;top:485px;font-size:38px" data-at="3" data-fx="fade">1 V = 1 J/C</div>
      <div class="x-lab" style="left:1020px;width:780px;top:485px;font-size:38px" data-at="6" data-fx="fade"><span class="pri">${DG}</span> doubles, through <span class="gold">n</span></div>
      <div class="banner" style="top:860px" data-at="5" data-fx="pop">Voltage = energy ÷ charge: <span class="gold">unchanged</span></div>`,
    update(c) {
      const h = 90
      setBar(c, '.x-la', h); setBar(c, '.x-lb', h)
      const d = h * (1 + eio(c.p('4+0.3', 1.0)))
      setBar(c, '.x-ra', d); setBar(c, '.x-rb', d)
    },
  })

  // ---------- try it ----------
  const OPTS = ['+1.14 V', '−0.46 V', '+0.46 V', '+1.26 V']
  const OK = 2
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1">Find the cell potential</h2>
      <div class="x-line" style="top:262px;font-size:42px" data-at="1@0.3">Ag<sup>+</sup> + e<sup>−</sup> ${ARR} Ag &nbsp; ${E0} = <span class="teal">+0.80 V</span></div>
      <div class="x-line" style="top:326px;font-size:42px" data-at="2@0.3">Cu<sup>2+</sup> + 2e<sup>−</sup> ${ARR} Cu &nbsp; ${E0} = <span class="warm">+0.34 V</span></div>
      ${OPTS.map((o, i) => `<div class="x-opt x-t${i}" style="left:${120 + (i % 2) * 860}px;top:${410 + Math.floor(i / 2) * 140}px" data-at="3@${(0.15 + i * 0.18).toFixed(2)}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>
        ${i === OK ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        <span>${o}</span></div>`).join('')}
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="790" r="74" fill="none" stroke="${LINE}" stroke-width="12"/><circle class="x-arc" cx="960" cy="790" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 790)"/>
        <text class="x-num" x="960" y="816" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="920" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:685px" data-at="6" data-fx="pop">Ag: <span class="teal">cathode</span> · Cu: <span class="warm">anode</span></div>
      <div class="x-line" style="top:832px" data-at="7">${ECELL} = 0.80 − 0.34 = <span class="gold">+0.46 V</span></div>
      <div class="x-line" style="top:905px;font-size:40px" data-at="8" data-out="9">Two Ag<sup>+</sup> needed, but ${E0} is <span class="gold">not doubled</span></div>
      <div class="x-line" style="top:905px;font-size:40px" data-at="9">Copper wire in silver nitrate ${ARR} coated with <span class="teal">silver</span></div>`,
    update(c) {
      const b = c.b, t0 = b[4].start + 0.3, t1 = b[5].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = c.seg(b[5].start + 0.2, b[5].start + 0.65)
      for (let i = 0; i < 4; i++) {
        const el = c.$('.x-t' + i)
        if (i === OK) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="150" viewBox="0 0 460 150"><line x1="90" y1="40" x2="370" y2="40" stroke="${TEAL}" stroke-width="9" stroke-linecap="round"/><line x1="90" y1="115" x2="370" y2="115" stroke="${WARM}" stroke-width="9" stroke-linecap="round"/>
    <text x="230" y="28" text-anchor="middle" font-size="24" font-weight="900" class="f-teal">higher: reduced</text><text x="230" y="146" text-anchor="middle" font-size="24" font-weight="900" class="f-warm">lower: oxidized</text></svg>`
  const r2 = `<svg width="460" height="150" viewBox="0 0 460 150"><text x="230" y="96" text-anchor="middle" font-size="64" font-weight="900" class="f-gold">E° × 2</text>
    <line x1="120" y1="40" x2="340" y2="110" stroke="${BAD}" stroke-width="9" stroke-linecap="round"/></svg>`
  const r3 = `<svg width="460" height="150" viewBox="0 0 460 150"><text x="230" y="92" text-anchor="middle" font-size="54" font-weight="900" class="f-gold">ΔG° = −nFE°</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p style="font-size:30px">${ECELL} = E°<sub>cathode</sub> − E°<sub>anode</sub><br>higher E° is <span class="teal">reduced</span></p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Never multiply E°<br>by <span class="bad">coefficients</span></p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>${E0} &gt; 0 ${ARR} ${DG} &lt; 0<br><span class="teal">favored</span></p></div>`,
  })
})()
