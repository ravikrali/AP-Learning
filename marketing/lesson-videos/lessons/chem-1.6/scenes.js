// Pictures for chem-1.6 "Photoelectron Spectroscopy (PES)". One EZ.scene per scene id in script.mjs.
// Everything shown is the lesson's own (app/src/content/chem/u1.ts, and the PES diagram and notes it uses).
// Spectra are schematic: the axis is not to scale and no peak positions are claimed except the order.
(() => {
  const { clamp, lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .zn{position:absolute;left:1180px;width:620px;padding:20px 30px 22px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .zn b{display:block;font-size:40px;font-weight:900;line-height:1.15} .zn span{display:block;margin-top:6px;font-size:30px;font-weight:700;line-height:1.3;color:var(--muted)}
    .st{position:absolute;left:120px;width:1000px;height:122px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .st .n{position:absolute;left:28px;top:24px;width:74px;height:74px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:74px;text-align:center}
    .st b{position:absolute;left:130px;top:16px;font-size:40px;font-weight:900;white-space:nowrap}
    .st span{position:absolute;left:130px;top:68px;font-size:30px;font-weight:700;color:var(--muted);white-space:nowrap}
    .ln{position:absolute;left:0;width:1920px;text-align:center;font-weight:900;white-space:nowrap}
    .opt{position:absolute;left:120px;width:1680px;height:100px;padding-left:112px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;font-size:40px;font-weight:800;white-space:nowrap}
    .opt .l{position:absolute;left:26px;top:20px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;text-align:center;color:var(--muted)}
    .opt .ok{position:absolute;right:24px;top:16px;width:64px;height:64px}
    .tc{position:absolute;top:320px;height:480px;text-align:center}
    .tc svg{display:block;margin:26px auto 0} .tc p{margin:8px 24px 0;font-size:40px;font-weight:800;line-height:1.3;white-space:nowrap}
    .ch{position:absolute;top:470px;width:470px;height:210px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center}
    .ch b{display:block;margin-top:34px;font-size:44px;font-weight:900;line-height:1.2} .ch span{display:block;margin-top:12px;font-size:32px;font-weight:700;color:var(--muted)}
    .rc{top:320px;width:540px;height:560px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc svg{display:block;margin:14px auto 0} .rc p{margin:14px 20px 0;font-size:35px;font-weight:800;line-height:1.3;white-space:nowrap}
  `
  document.head.appendChild(css)
  const PUR = '#8d8df0', TEAL = '#3cc7bc', WARM = '#f3a764', BAD = '#f0707a', MUTED = '#a3abbd', GOLD = '#f2c443'
  const nucleus = (x, y, r = 34) => ball(x, y, r, 'warm', '+', r * 1.2)
  const electron = (x, y, r = 16, g = 'teal') => ball(x, y, r, g, '−', r * 1.3)
  const at = (s, fx) => (s == null ? '' : ` data-at="${s}"${fx ? ` data-fx="${fx}"` : ''}`)

  // ---------- intro artwork: faint atoms and a faint spectrum on the edges (all above y = 950) ----------
  const orbitArt = (x, y) => `<g>${[70, 130, 190].map((r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#8d8df0" stroke-width="3"/>`).join('')}${nucleus(x, y, 28)}${electron(x + 130, y, 14)}${electron(x - 92, y - 92, 14)}</g>`
  const barsArt = (x, y) => [[0, 2], [60, 2], [120, 6], [180, 1]].map(([dx, n]) => `<rect x="${x + dx}" y="${y - n * 26}" width="34" height="${n * 26}" rx="5" fill="#3cc7bc"/>`).join('') + `<line x1="${x - 20}" y1="${y}" x2="${x + 240}" y2="${y}" stroke="#a3abbd" stroke-width="4"/>`
  EZ.intro = {
    chips: [['1@0.28', 'Reading peaks'], ['1@0.52', 'Binding energy'], ['1@0.76', 'Finding the element']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">${orbitArt(40, 420)}${orbitArt(1880, 700)}${barsArt(1640, 330)}${barsArt(30, 840)}</svg>`,
  }

  // ---------- the sodium spectrum (the lesson's own diagram), drawn big ----------
  // peaks from the lesson diagram: label, binding energy (MJ/mol), electrons, x
  const PK = [['1s', '104', 2, 150, 's'], ['2s', '6.84', 2, 380, 's'], ['2p', '3.67', 6, 590, 'p'], ['3s', '0.50', 1, 820, 's']]
  const BASE = 440, U = 48
  const COL = { s: WARM, p: TEAL }
  const pes = (a = {}) => `<svg style="position:absolute;left:0;top:0" width="1000" height="560" viewBox="0 0 1000 560">
      <line x1="60" y1="${BASE}" x2="970" y2="${BASE}" stroke="#a3abbd" stroke-width="4"/><line x1="60" y1="50" x2="60" y2="${BASE}" stroke="#a3abbd" stroke-width="4"/>
      <text x="76" y="50" font-size="26" font-weight="800" style="fill:#a3abbd">Relative number of electrons</text>
      <text x="60" y="532" font-size="28" font-weight="800" style="fill:#a3abbd">← Binding energy (MJ/mol)</text>
      <text x="970" y="532" text-anchor="end" font-size="24" font-weight="700" style="fill:#a3abbd">axis not to scale</text>
      ${PK.map(([n, e, k, x, t], i) => `<g class="pk" data-i="${i}">
        <g${at(a.bar?.(i), 'up')}><rect x="${x - 30}" y="${BASE - k * U}" width="60" height="${k * U}" rx="8" fill="${COL[t]}" opacity=".9"/>
          <text class="cn" x="${x}" y="${BASE - k * U / 2 + 13}" text-anchor="middle" font-size="38" font-weight="900" style="fill:#10131c;opacity:${a.cnt ? 0 : 1}">${k}</text></g>
        <text x="${x}" y="${BASE - k * U - 16}" text-anchor="middle" font-size="40" font-weight="900" style="fill:#eef0f7"${at(a.lab?.(i), 'fade')}>${n}</text>
        <text x="${x}" y="${BASE + 44}" text-anchor="middle" font-size="30" font-weight="800" style="fill:#a3abbd"${at(a.en?.(i), 'fade')}>${e}</text></g>`).join('')}
    </svg>`

  // ---------- hook ----------
  const photonPath = (x1, x2, y, amp = 16, wl = 34) => { let d = ''; for (let x = x1; x <= x2; x += 4) d += `${x === x1 ? 'M' : 'L'}${x.toFixed(1)} ${(y + amp * Math.sin(((x - x1) / wl) * Math.PI * 2)).toFixed(1)} `; return d }
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="0">How do we know about subshells?</h2>
      <div class="card" style="left:120px;top:320px;width:1000px;height:520px" data-at="0@0.3">
        <svg style="position:absolute;left:0;top:0" width="1000" height="520" viewBox="0 0 1000 520">
          <circle cx="350" cy="270" r="100" fill="none" stroke="#8d8df0" stroke-width="3" stroke-dasharray="8 8"/>
          <circle cx="350" cy="270" r="190" fill="none" stroke="#8d8df0" stroke-width="3" stroke-dasharray="8 8"/>
          ${nucleus(350, 270, 40)}
          <g class="ie"></g><path class="ph" fill="none" stroke="#f2c443" stroke-width="7" stroke-linecap="round" d=""/><g class="ej"></g>
        </svg></div>
      <div class="zn" style="top:320px" data-at="1" data-fx="right"><b class="bad">We can’t see electrons</b></div>
      <div class="zn" style="top:445px" data-at="2" data-fx="right"><b class="warm">Knock one out with light</b><span>and measure how hard it was to remove</span></div>
      <div class="zn" style="top:625px" data-at="3" data-fx="right"><b class="teal">PES</b><span>photoelectron spectroscopy</span></div>
      <div class="banner" style="top:896px" data-at="4" data-fx="pop">A <span class="teal">fingerprint</span> of the electron configuration</div>`,
    update(c) {
      const a = c.t * 1.1, t2 = c.at('2@0.45')
      c.$('.ie').innerHTML = electron(350 + 100 * Math.cos(a), 270 + 100 * Math.sin(a), 15, 'pur') + electron(350 + 190 * Math.cos(-a * 0.7 + 2), 270 + 190 * Math.sin(-a * 0.7 + 2), 17, 'pur')
      // a photon wave arrives, then an electron leaves
      const t1 = c.at('2'), pp = eio(c.seg(t1, t2)), head = lerp(40, 200, pp)
      c.$('.ph').setAttribute('d', c.t >= t1 && c.t < t2 + 0.25 ? photonPath(Math.max(30, head - 150), head, 270) : '')
      c.$('.ph').style.opacity = 1 - c.seg(t2, t2 + 0.25)
      const ep = eio(c.seg(t2, t2 + 1.5)), aE = Math.min(c.t, t2) * 1.1 + 2
      const sx = 350 + 190 * Math.cos(aE), sy = 270 + 190 * Math.sin(aE)
      c.$('.ej').innerHTML = c.t >= t2 ? electron(lerp(sx, 880, ep), lerp(sy, 90, ep), 20) : ''
    },
  })

  // ---------- how PES works ----------
  EZ.scene('how', {
    html: `<div class="kicker" data-at="in" data-fx="left">How PES works</div><h2 class="h1" data-at="0">Light in, electron out</h2>
      <div class="card" style="left:120px;top:320px;width:1000px;height:540px" data-at="0@0.3">
        <svg style="position:absolute;left:0;top:0" width="1000" height="540" viewBox="0 0 1000 540">
          <circle cx="330" cy="300" r="120" fill="none" stroke="#8d8df0" stroke-width="3" stroke-dasharray="8 8"/>
          ${nucleus(330, 300, 40)}<g class="ie"></g><path class="ph" fill="none" stroke="#f2c443" stroke-width="7" stroke-linecap="round" d=""/><g class="ej"></g>
          <text x="140" y="190" text-anchor="middle" font-size="34" font-weight="900" style="fill:#f2c443" data-at="1" data-out="3" data-fx="fade">photon</text>
          <text x="850" y="268" text-anchor="middle" font-size="34" font-weight="900" style="fill:#3cc7bc" data-at="3" data-fx="fade">electron</text>
          <text x="850" y="306" text-anchor="middle" font-size="30" font-weight="800" style="fill:#a3abbd" data-at="3" data-fx="fade">kinetic energy</text>
        </svg></div>
      <div class="zn" style="top:320px" data-at="1" data-fx="right"><b class="warm">High-energy photons</b><span>X-rays or ultraviolet light</span></div>
      <div class="zn" style="top:480px" data-at="5" data-fx="right"><b class="teal">Same subshell</b><span>about the same binding energy</span></div>
      <div class="zn" style="top:640px" data-at="6" data-fx="right"><b class="pri">Separate peaks</b><span>not a smear</span></div>
      <div class="banner" style="top:900px;font-size:44px" data-at="4" data-fx="pop"><span class="pri">binding energy</span> = photon energy − <span class="teal">kinetic energy</span> of the electron</div>`,
    update(c) {
      const a = c.t * 1.2, t1 = c.at('1'), t2 = c.at('2')
      const aE = Math.min(c.t, t2) * 1.2
      c.$('.ie').innerHTML = (c.t < t2 ? electron(330 + 120 * Math.cos(aE), 300 + 120 * Math.sin(aE), 16) : '') + electron(330 + 60 * Math.cos(-a * 1.6), 300 + 60 * Math.sin(-a * 1.6), 12, 'pur')
      const pp = eio(c.seg(t1 + 0.2, t2 + 0.5)), head = lerp(40, 190, pp)
      c.$('.ph').setAttribute('d', c.t >= t1 && c.t < t2 + 0.9 ? photonPath(Math.max(30, head - 150), head, 300) : '')
      c.$('.ph').style.opacity = c.seg(t1, t1 + 0.3) * (1 - c.seg(t2 + 0.5, t2 + 0.9))
      const ep = eio(c.seg(t2 + 0.6, t2 + 2.2)), sx = 330 + 120 * Math.cos(Math.min(c.t, t2 + 0.6) * 1.2), sy = 300 + 120 * Math.sin(Math.min(c.t, t2 + 0.6) * 1.2)
      c.$('.ej').innerHTML = c.t >= t2 + 0.5 ? electron(lerp(sx, 880, ep), lerp(sy, 200, ep), 20) : ''
    },
  })

  // ---------- reading a spectrum ----------
  EZ.scene('read', {
    html: `<div class="kicker" data-at="in" data-fx="left">Reading a PES spectrum</div><h2 class="h1" data-at="0">Sodium, <span class="teal">peak by peak</span></h2>
      <div class="card" style="left:120px;top:320px;width:1000px;height:560px" data-at="0@0.3">
        ${pes({ bar: (i) => `1@${(i * 0.2).toFixed(2)}`, lab: (i) => `1@${(i * 0.2 + 0.1).toFixed(2)}`, en: (i) => `2@${(i * 0.15).toFixed(2)}`, cnt: 1 }).replace('</svg>', `
          <g data-at="4" data-fx="fade"><path d="M830 98 H170" stroke="#8d8df0" stroke-width="6" marker-end="url(#mk-pri)"/><text x="500" y="82" text-anchor="middle" font-size="30" font-weight="900" style="fill:#8d8df0">binding energy increases</text>
          <text x="150" y="150" text-anchor="middle" font-size="28" font-weight="900" style="fill:#8d8df0">core</text><text x="820" y="150" text-anchor="middle" font-size="28" font-weight="900" style="fill:#3cc7bc">valence</text></g></svg>`)}</div>
      <div class="zn" style="top:320px" data-at="1" data-fx="right"><b class="warm">Each peak</b><span>= one subshell</span></div>
      <div class="zn" style="top:470px" data-at="2" data-fx="right"><b class="pri">Position</b><span>= binding energy: the energy needed to remove an electron</span></div>
      <div class="zn" style="top:665px" data-at="3" data-fx="right"><b class="teal">Higher</b><span>= held more tightly, closer to the nucleus</span></div>
      <div class="banner" style="top:900px;font-size:46px" data-at="5" data-fx="pop"><span class="warm">Height</span> ∝ the <span class="teal">number of electrons</span></div>`,
    update(c) {
      const k = c.p('5', 0.4)
      for (const el of c.root.querySelectorAll('.cn')) el.style.opacity = k
    },
  })

  // ---------- test yourself on sodium ----------
  EZ.scene('sodium', {
    html: `<div class="kicker" data-at="in" data-fx="left">Check your reading</div><h2 class="h1" data-at="0">Two questions about sodium</h2>
      <div class="card" style="left:120px;top:320px;width:1000px;height:560px" data-at="0@0.3">${pes({ cnt: 0, en: () => null }).replace('</svg>', `
        <g data-at="3@0.2" data-fx="fade"><path d="M310 150 H650" stroke="#f2c443" stroke-width="5" stroke-dasharray="10 8"/><text x="400" y="134" text-anchor="middle" font-size="30" font-weight="900" style="fill:#f2c443">6 : 2 = 3 : 1</text></g></svg>`)}</div>
      <div class="zn" style="top:320px" data-at="1" data-fx="right"><b class="teal">3s: lowest binding energy</b><span>about 0.50 MJ/mol</span></div>
      <div class="zn" style="top:480px" data-at="2" data-fx="right"><b class="warm">Farthest from the nucleus</b><span>and the most shielded: easiest to remove</span></div>
      <div class="zn" style="top:665px" data-at="4" data-fx="right"><b class="pri">2p: 6 electrons</b><span>2s: 2 electrons, so 2p is 3× taller</span></div>
      <div class="banner" style="top:900px;font-size:46px" data-at="3" data-fx="pop">2p peak ≈ <span class="teal">3× taller</span> than 2s. Why?</div>`,
    update(c) {
      const h1 = c.p('1@0.2', 0.4), h3 = c.p('3@0.2', 0.4), A = [0.3, 0.3, 0.3, 1], B = [0.3, 1, 1, 0.3]
      for (const g of c.root.querySelectorAll('.pk')) { const i = +g.dataset.i; g.style.opacity = lerp(lerp(1, A[i], h1), B[i], h3) }
    },
  })

  // ---------- the trick: decode in 3 steps ----------
  const miniBars = [[0, 2, WARM], [1, 2, WARM], [2, 6, TEAL], [3, 1, WARM]]
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Decode any PES in 3 steps</h2>
      <div class="st" style="top:320px" data-at="1" data-fx="right"><div class="n">1</div><b>Count peaks, high energy to low</b><span>1s, 2s, 2p, 3s, 3p</span></div>
      <div class="st" style="top:470px" data-at="2" data-fx="right"><div class="n">2</div><b>Read the heights as electron counts</b><span>s: 2 max · p: 6 max · d: 10 max</span></div>
      <div class="st" style="top:620px" data-at="3" data-fx="right"><div class="n">3</div><b>Add them up</b><span>neutral atom: total = atomic number</span></div>
      <div class="card" style="left:1180px;top:320px;width:620px;height:560px" data-at="4" data-fx="up">
        <svg style="position:absolute;left:0;top:0" width="620" height="560" viewBox="0 0 620 560">
          <line x1="50" y1="360" x2="580" y2="360" stroke="#a3abbd" stroke-width="4"/>
          ${miniBars.map(([i, n, col]) => `<rect x="${90 + i * 128}" y="${360 - n * 32}" width="48" height="${n * 32}" rx="7" fill="${col}"/><text x="${114 + i * 128}" y="${360 - n * 32 - 12}" text-anchor="middle" font-size="36" font-weight="900" style="fill:#eef0f7">${n}</text>`).join('')}
          ${['1s', '2s', '2p', '3s'].map((l, i) => `<text x="${114 + i * 128}" y="404" text-anchor="middle" font-size="30" font-weight="800" style="fill:#a3abbd">${l}</text>`).join('')}
          <text x="310" y="64" text-anchor="middle" font-size="30" font-weight="900" style="fill:#a3abbd" letter-spacing="3">EXAMPLE: 2 : 2 : 6 : 1</text>
        </svg>
        <div class="ln" style="position:absolute;left:0;width:620px;top:440px;font-size:44px">1s² 2s² 2p⁶ 3s¹</div></div>
      <div class="banner" style="top:910px;font-size:46px" data-at="5" data-fx="pop">2 + 2 + 6 + 1 = 11 electrons = <span class="teal">sodium</span></div>`,
  })

  // ---------- comparing two elements ----------
  EZ.scene('compare', {
    html: `<div class="kicker" data-at="in" data-fx="left">Comparing two elements</div><h2 class="h1" data-at="0">Same subshell, different energy</h2>
      <div class="card" style="left:120px;top:320px;width:1000px;height:540px" data-at="1" data-fx="up">
        <svg style="position:absolute;left:0;top:0" width="1000" height="540" viewBox="0 0 1000 540">
          <line x1="60" y1="410" x2="970" y2="410" stroke="#a3abbd" stroke-width="4"/><line x1="60" y1="50" x2="60" y2="410" stroke="#a3abbd" stroke-width="4"/>
          <text x="60" y="502" font-size="28" font-weight="800" style="fill:#a3abbd">← Binding energy</text><text x="970" y="502" text-anchor="end" font-size="24" font-weight="700" style="fill:#a3abbd">axis not to scale</text>
          <g data-at="2" data-fx="up"><rect x="650" y="${410 - 130}" width="70" height="130" rx="9" fill="${WARM}"/><text x="685" y="${410 - 150}" text-anchor="middle" font-size="40" font-weight="900" style="fill:#eef0f7">O 1s</text></g>
          <g data-at="2@0.4" data-fx="up"><rect x="330" y="${410 - 130}" width="70" height="130" rx="9" fill="${TEAL}"/><text x="365" y="${410 - 150}" text-anchor="middle" font-size="40" font-weight="900" style="fill:#eef0f7">F 1s</text></g>
          <g data-at="2@0.7" data-fx="fade"><path d="M650 268 H430" stroke="#f2c443" stroke-width="7" marker-end="url(#mk-gold)"/><text x="540" y="244" text-anchor="middle" font-size="28" font-weight="900" style="fill:#f2c443">higher</text></g>
          <text x="685" y="456" text-anchor="middle" font-size="32" font-weight="900" style="fill:#f3a764" data-at="3" data-fx="fade">8 protons</text>
          <text x="365" y="456" text-anchor="middle" font-size="32" font-weight="900" style="fill:#3cc7bc" data-at="3@0.3" data-fx="fade">9 protons</text>
        </svg></div>
      <div class="zn" style="top:320px" data-at="3" data-fx="right"><b class="teal">F has more protons</b><span>9 versus 8 for O</span></div>
      <div class="zn" style="top:480px" data-at="4" data-fx="right"><b class="warm">Greater nuclear charge</b><span>pulls the 1s electrons more strongly: Coulomb’s law</span></div>
      <div class="banner" style="top:896px;font-size:46px" data-at="5" data-fx="pop">Bigger Z: every peak shifts to <span class="teal">higher binding energy</span></div>`,
  })

  // ---------- the trap ----------
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Watch out</div><h2 class="h1" data-at="0">Height is not energy</h2>
      <div class="card tc" style="left:120px;width:760px" data-at="2" data-fx="up"><svg width="300" height="260" viewBox="0 0 300 260"><line x1="20" y1="230" x2="280" y2="230" stroke="#a3abbd" stroke-width="4"/><rect x="70" y="150" width="50" height="80" rx="7" fill="${WARM}"/><rect x="170" y="40" width="50" height="190" rx="7" fill="${WARM}"/><path d="M270 40V230" stroke="#f2c443" stroke-width="5" marker-start="url(#mk-gold)" marker-end="url(#mk-gold)"/></svg><p><span class="warm">Height</span></p><p style="color:var(--muted);font-size:38px">how many electrons</p></div>
      <div class="card tc" style="left:1040px;width:760px" data-at="3" data-fx="up"><svg width="300" height="260" viewBox="0 0 300 260"><line x1="20" y1="230" x2="280" y2="230" stroke="#a3abbd" stroke-width="4"/><rect x="60" y="150" width="50" height="80" rx="7" fill="${TEAL}"/><rect x="190" y="150" width="50" height="80" rx="7" fill="${TEAL}"/><path d="M200 110H100" stroke="#f2c443" stroke-width="7" marker-end="url(#mk-gold)"/><text x="150" y="86" text-anchor="middle" font-size="30" font-weight="900" style="fill:#f2c443">position</text></svg><p><span class="teal">Position</span></p><p style="color:var(--muted);font-size:38px">how tightly they are held</p></div>
      <div class="banner" style="top:880px;font-size:48px" data-at="1" data-out="4" data-fx="pop">A taller peak <span class="bad">≠</span> higher energy</div>
      <div class="banner" style="top:880px;font-size:48px" data-at="4" data-fx="pop">Two <span class="warm">different</span> questions</div>`,
  })

  // ---------- try it ----------
  const OPTS = [['A', 'Lithium', '1@0.3'], ['B', 'Boron', '1@0.5'], ['C', 'Nitrogen', '1@0.66'], ['D', 'Neon', '1@0.86']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:60px" data-at="1">Peak heights <span class="teal">2 : 2 : 3</span>. Which element?</h2>
      ${OPTS.map(([l, s, a], i) => `<div class="opt t${i}" style="top:${290 + i * 114}px" data-at="${a}" data-fx="left"><div class="l">${l}</div>${s}
        ${i === 2 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}</div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="862" r="66" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="862" r="66" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 862)"/>
        <text class="num" x="960" y="886" text-anchor="middle" font-size="70" font-weight="900">3</text><text x="960" y="982" text-anchor="middle" font-size="32" font-weight="800" style="fill:#a3abbd">pause if you need more time</text></svg>
      <div class="banner" style="top:775px;font-size:46px" data-at="4" data-fx="pop">3 peaks = <span class="warm">1s</span>, <span class="warm">2s</span>, <span class="teal">2p</span></div>
      <div class="ln" style="top:895px;font-size:44px" data-at="5" data-fx="up">1s² 2s² 2p³ ${ARR} 7 electrons ${ARR} <span class="teal">nitrogen</span></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.5, b[3].start + 0.95))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 2) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- FRQ tip ----------
  EZ.scene('frq', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Free-response tip</div><h2 class="h1" data-at="0">Explain a peak with Coulomb’s law</h2>
      <div class="ch" style="left:120px" data-at="2" data-fx="up"><b class="pri" style="font-size:38px">1s electrons<br>closer to the nucleus</b></div>
      <div class="ln" style="top:550px;left:600px;width:90px;font-size:60px;color:var(--muted)" data-at="2@0.3" data-fx="fade">→</div>
      <div class="ch" style="left:725px" data-at="2@0.35" data-fx="up"><b class="warm">Stronger<br>attraction</b></div>
      <div class="ln" style="top:550px;left:1205px;width:90px;font-size:60px;color:var(--muted)" data-at="2@0.65" data-fx="fade">→</div>
      <div class="ch" style="left:1330px" data-at="2@0.7" data-fx="up"><b class="teal">More energy<br>to remove</b></div>
      <div class="ln" style="top:330px;font-size:44px" data-at="1" data-fx="up">Use <span class="pri">specifics</span>, not just “it’s stronger”</div>
      <div class="banner" style="top:800px;font-size:44px" data-at="3" data-fx="pop">Name the <span class="teal">subshells</span>, then link distance or charge ${ARR} attraction ${ARR} energy</div>`,
  })

  // ---------- recap ----------
  const m1 = `<svg width="460" height="210" viewBox="0 0 460 210"><line x1="30" y1="170" x2="430" y2="170" stroke="#a3abbd" stroke-width="4"/><rect x="90" y="110" width="44" height="60" rx="6" fill="${WARM}"/><rect x="250" y="40" width="44" height="130" rx="6" fill="${TEAL}"/><path d="M400 196H150" stroke="#8d8df0" stroke-width="5" marker-end="url(#mk-pri)"/></svg>`
  const chip = (x, t, col) => `<rect x="${x}" y="70" width="120" height="70" rx="16" fill="rgba(36,40,56,.95)" stroke="${col}" stroke-width="4"/><text x="${x + 60}" y="118" text-anchor="middle" font-size="40" font-weight="900" style="fill:${col}">${t}</text>`
  const m2 = `<svg width="460" height="210" viewBox="0 0 460 210">${chip(20, '1s', WARM)}${chip(170, '2s', WARM)}${chip(320, '2p', TEAL)}</svg>`
  const m3 = `<svg width="460" height="210" viewBox="0 0 460 210"><line x1="30" y1="170" x2="430" y2="170" stroke="#a3abbd" stroke-width="4"/><rect x="290" y="70" width="44" height="100" rx="6" fill="${WARM}" opacity=".5"/><rect x="130" y="70" width="44" height="100" rx="6" fill="${TEAL}"/><path d="M300 56H170" stroke="#f2c443" stroke-width="6" marker-end="url(#mk-gold)"/><text x="235" y="26" text-anchor="middle" font-size="28" font-weight="900" style="fill:#f2c443">more protons</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div>${m1}<p><span class="pri">Position</span> = binding energy<br><span class="warm">Height</span> = number of<br>electrons</p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div>${m2}<p>Read the peaks in order<br>to rebuild the<br><span class="teal">configuration</span></p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div>${m3}<p>More protons: the same<br>subshell has a <span class="teal">higher</span><br>binding energy</p></div>`,
  })
})()
