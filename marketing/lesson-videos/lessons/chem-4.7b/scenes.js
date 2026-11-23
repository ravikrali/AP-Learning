// Pictures for chem-4.7b "Oxidation Numbers & Spotting Redox". One EZ.scene per scene id in script.mjs.
// Every formula, number and example is the lesson's own (app/src/content/chem/u4.ts; "not actual
// charges" and "total increase = total decrease" are from book.ts). Atoms are drawn schematically:
// sizes are not to scale, and a row of balls is a count for the bookkeeping, not a structure.
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .ox-ic{position:absolute;top:290px;width:390px;height:210px;border-radius:28px;background:rgba(36,40,56,.92);border:2px solid var(--line);text-align:center}
    .ox-ic svg{display:block;margin:20px auto 0} .ox-ic b{display:block;margin-top:8px;font-size:36px;font-weight:900}
    .ox-chip{position:absolute;height:76px;padding:0 30px;border-radius:22px;background:rgba(255,255,255,.05);border:2px solid var(--line);font-size:36px;font-weight:800;line-height:72px;white-space:nowrap}
    .ox-rule{position:absolute;left:120px;width:1680px;height:86px;border-radius:24px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .ox-rule .n{position:absolute;left:20px;top:13px;width:58px;height:58px;border-radius:50%;background:var(--brand);font-size:32px;font-weight:900;line-height:58px;text-align:center}
    .ox-rule .r{position:absolute;left:104px;top:16px;font-size:40px;font-weight:900;white-space:nowrap}
    .ox-rule .v{position:absolute;left:640px;top:14px;font-size:42px;font-weight:900;white-space:nowrap}
    .ox-rule .e{position:absolute;left:1100px;top:20px;font-size:34px;font-weight:800;color:var(--muted);white-space:nowrap}
    .ox-q{position:absolute;left:120px;top:290px;font-size:44px;font-weight:800;white-space:nowrap}
    .ox-steps{left:1000px;top:290px;width:800px;height:500px}
    .ox-ln{position:absolute;left:44px;font-size:46px;font-weight:900;white-space:nowrap}
    .ox-res{position:absolute;left:44px;top:370px;height:96px;padding:0 36px;border-radius:24px;font-size:56px;font-weight:900;line-height:92px;white-space:nowrap;background:rgba(60,199,188,.16);border:3px solid var(--accent)}
    .ox-row{position:absolute;left:120px;width:1680px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .ox-row .eq{position:absolute;left:44px;font-size:42px;font-weight:900;white-space:nowrap}
    .ox-side{left:120px;width:780px;height:440px;top:300px}
    .ox-side p{position:absolute;left:40px;top:96px;margin:0;font-size:34px;font-weight:800;color:var(--muted);white-space:nowrap}
    .ox-mn{position:absolute;width:780px;height:300px;border-radius:30px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .ox-mn .big{position:absolute;left:44px;font-size:110px;font-weight:900;line-height:1;letter-spacing:4px}
    .ox-mn .w{position:absolute;left:44px;top:170px;font-size:44px;font-weight:800;white-space:nowrap}
    .ox-mn .w b{font-weight:900}
    .ox-eqc{left:120px;top:286px;width:1680px;height:210px}
    .ox-eqr{position:absolute;left:0;right:0;top:20px;display:flex;justify-content:center;align-items:flex-end;gap:34px}
    .ox-col{display:flex;flex-direction:column;align-items:center}
    .ox-col .on{height:58px;font-size:40px;font-weight:900;white-space:nowrap}
    .ox-col .fm{font-size:58px;font-weight:900;white-space:nowrap}
    .ox-op{font-size:58px;font-weight:900;color:var(--muted);padding-bottom:2px}
    .ox-sr{position:absolute;left:120px;width:1680px;height:200px;border-radius:28px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .ox-sr .ox-eqr{left:30px;right:auto;top:26px;justify-content:flex-start;gap:24px}
    .ox-sr .ox-col .fm{font-size:50px} .ox-sr .ox-op{font-size:50px} .ox-sr .ox-col .on{font-size:32px;height:50px}
    .ox-sr .tag{position:absolute;right:30px;top:26px;width:420px;text-align:center}
    .ox-badge{display:inline-block;padding:4px 26px;border-radius:16px;font-size:40px;font-weight:900;border:4px solid;white-space:nowrap}
    .ox-sr .tag p{margin:14px 0 0;font-size:30px;font-weight:800;color:var(--muted);line-height:1.3;white-space:nowrap}
    .ox-x{position:absolute;top:300px;height:110px;padding:0 40px;border-radius:26px;border:3px solid var(--line);background:rgba(255,255,255,.05);font-size:46px;font-weight:900;line-height:104px;white-space:nowrap;color:var(--muted)}
    .ox-x i{position:absolute;left:18px;right:18px;top:50%;height:9px;margin-top:-4px;border-radius:5px;background:var(--bad)}
    .ox-f{position:absolute;top:520px;width:540px;height:300px;border-radius:30px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center}
    .ox-f svg{display:block;margin:30px auto 0} .ox-f b{display:block;margin-top:14px;font-size:40px;font-weight:900;white-space:nowrap}
    .ox-tile{position:absolute;top:400px;width:390px;height:250px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .ox-tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .ox-tile .f{margin-top:78px;font-size:110px;font-weight:900;line-height:1}
    .ox-tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .ox-rc{top:320px;width:540px;height:560px;text-align:center} .ox-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .ox-rc svg{display:block;margin:14px auto 0} .ox-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.32;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', PUR = '#8d8df0', WARM = '#f3a764', RED = '#f0707a', GREEN = '#4cc781', GOLD = '#f2c443', MUT = '#7d859c'
  const place = (el, x, y) => el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`)
  // a small electron: a teal dot with an e⁻ label (the minus raised with sup())
  const eDot = (lab = true) => `<circle r="22" fill="#3cc7bc" opacity=".25"/><circle r="12" fill="url(#g-teal)"/>${lab ? `<text y="-28" text-anchor="middle" font-size="28" font-weight="900" class="f-teal">${sup('e', '−')}</text>` : ''}`
  const eTxt = 'e<sup>−</sup>'

  // ---------- intro artwork: faint oxidation numbers and electrons at the edges ----------
  const NUMS = [[150, 230, '+7'], [300, 360, '−2'], [120, 780, '0'], [280, 900, '+1'], [1780, 230, '+6'], [1620, 360, '−3'], [1800, 780, '+2'], [1640, 900, '−1']]
  EZ.intro = {
    chips: [['1@0.3', 'Oxidation numbers'], ['1@0.55', 'Oxidized'], ['1@0.78', 'Reduced']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.18">
      ${NUMS.map(([x, y, t]) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="96" font-weight="900" class="f-pri">${t}</text>`).join('')}
      <g class="ie0">${eDot(false)}</g><g class="ie1">${eDot(false)}</g></svg>`,
    update(c) {
      const s = c.t - c.sc.start
      place(c.$('.ie0'), 200 + 40 * Math.cos(s * 1.2), 560 + 40 * Math.sin(s * 1.2))
      place(c.$('.ie1'), 1720 - 40 * Math.cos(s * 1.2), 560 - 40 * Math.sin(s * 1.2))
    },
  }

  // ---------- hook: everything runs on electron transfer ----------
  const icBattery = `<svg width="200" height="110" viewBox="0 0 200 110"><rect x="20" y="20" width="150" height="70" rx="12" fill="none" stroke="${TEAL}" stroke-width="6"/><rect x="170" y="40" width="14" height="30" rx="4" fill="${TEAL}"/><rect x="30" y="30" width="90" height="50" rx="6" fill="${TEAL}" opacity=".6"/></svg>`
  const icRust = `<svg width="200" height="110" viewBox="0 0 200 110"><rect x="20" y="30" width="160" height="50" rx="10" fill="#8a90a3"/><circle cx="60" cy="50" r="11" fill="#b96a26"/><circle cx="110" cy="62" r="14" fill="#b96a26"/><circle cx="150" cy="45" r="8" fill="#b96a26"/><circle cx="85" cy="40" r="6" fill="#b96a26"/></svg>`
  const icLeaf = `<svg width="200" height="110" viewBox="0 0 200 110"><path d="M40 90 C40 30 110 10 170 18 C165 80 110 100 40 90 Z" fill="${GREEN}" opacity=".85"/><path d="M40 90 L140 36" stroke="#23834d" stroke-width="5" stroke-linecap="round"/></svg>`
  const icCell = `<svg width="200" height="110" viewBox="0 0 200 110"><ellipse cx="100" cy="55" rx="80" ry="44" fill="none" stroke="${WARM}" stroke-width="6"/><circle cx="100" cy="55" r="18" fill="${WARM}" opacity=".7"/><circle cx="55" cy="45" r="6" fill="${WARM}"/><circle cx="145" cy="68" r="6" fill="${WARM}"/></svg>`
  const HA = 640, HB = 1280, HY = 650
  EZ.scene('hook', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Electron transfer</div><h2 class="h1" data-at="0-0.2">Follow the electrons</h2>
      ${[['Batteries', icBattery], ['Rusting', icRust], ['Photosynthesis', icLeaf], ['Metabolism', icCell]].map(([n, ic], i) =>
        `<div class="ox-ic" style="left:${120 + i * 430}px" data-at="0@${0.02 + i * 0.22}" data-fx="pop">${ic}<b>${n}</b></div>`).join('')}
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1" data-fx="fade">${ball(HA, HY, 56, 'pur')}${ball(HB, HY, 56, 'warm')}
          <path d="M${HA + 70} ${HY - 30} Q${(HA + HB) / 2} ${HY - 120} ${HB - 70} ${HY - 30}" fill="none" stroke="${TEAL}" stroke-width="4" stroke-dasharray="10 12" opacity=".6" marker-end="url(#mk-teal)"/></g>
        <g class="he">${eDot()}</g>
        <text x="${(HA + HB) / 2}" y="${HY + 30}" text-anchor="middle" font-size="64" font-weight="900" class="f-gold" data-at="2@0.4" data-out="3" data-fx="pop">?</text>
      </svg>
      <div class="banner" style="top:790px;padding:18px 40px" data-at="3" data-fx="pop">Oxidation numbers ${ARR} <span class="gold">bookkeeping</span> for electrons</div>
      <div class="ox-chip" style="left:600px;top:930px" data-at="5" data-fx="pop">not actual charges, just a <span class="teal">way to keep count</span></div>`,
    update(c) {
      const b = c.b, s = c.t - b[1].start
      const on = s > 0 ? 1 : 0, p = s > 0 ? eio(((s * 0.5) % 1)) : 0
      const x = lerp(HA + 60, HB - 60, p), y = HY - 40 - 160 * Math.sin(Math.PI * p) * 0.5
      place(c.$('.he'), x, y)
      c.$('.he').style.opacity = on * Math.min(clamp(p * 6), clamp((1 - p) * 6))
    },
  })

  // ---------- the six rules ----------
  const RULES = [
    ['Free element', '= <span class="teal">0</span>', 'Fe, O<sub>2</sub>, Cl<sub>2</sub>'],
    ['Monatomic ion', '= <span class="teal">its charge</span>', 'Na<sup>+</sup> = +1, S<sup>2−</sup> = −2'],
    ['F in compounds', '<span class="warm">always −1</span>', ''],
    ['O', '<span class="warm">usually −2</span>', 'peroxides (H<sub>2</sub>O<sub>2</sub>): −1'],
    ['H', '<span class="warm">+1</span> with nonmetals', '−1 with metals (NaH)'],
    ['Sum', '= <span class="gold">overall charge</span>', '0 for a neutral compound'],
  ]
  EZ.scene('rules', {
    html: `<div class="kicker" data-at="in" data-fx="left">The rules</div><h2 class="h1" data-at="0">Apply in order of priority</h2>
      ${RULES.map(([r, v, e], i) => `<div class="ox-rule r${i}" style="top:${290 + i * 100}px" data-at="${i + 1}"><div class="n">${i + 1}</div>
        <div class="r">${r}</div><div class="v">${v}</div>${e ? `<div class="e" data-at="${i + 1}@0.45" data-fx="fade">${e}</div>` : ''}</div>`).join('')}`,
    update(c) {
      const b = c.b
      for (let i = 0; i < 6; i++) {
        const s = b[i + 1], on = c.t >= s.start && (i === 5 || c.t < b[i + 2].start) ? 1 : 0
        c.$('.r' + i).style.borderColor = on ? 'rgba(141,141,240,.85)' : ''
      }
    },
  })

  // ---------- solve for the unknown: Mn in MnO4- ----------
  const SY = 560, MX = 300, OX = [450, 560, 670, 780]
  EZ.scene('solve', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Solve for the unknown</h2>
      <div class="ox-q" data-at="1">Oxidation number of <span class="pri">Mn</span> in MnO<sub>4</sub><sup>−</sup>?</div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.3" data-fx="fade">
          <path d="M200 440 h-22 v240 h22" fill="none" stroke="#c9cee0" stroke-width="6"/><path d="M850 440 h22 v240 h-22" fill="none" stroke="#c9cee0" stroke-width="6"/>
          <text x="886" y="462" font-size="56" font-weight="900">−</text>
          ${ball(MX, SY, 60, 'pur', 'Mn', 40)}${OX.map((x) => ball(x, SY, 44, 'red', 'O', 36)).join('')}
        </g>
        <text x="${MX}" y="${SY + 120}" text-anchor="middle" font-size="48" font-weight="900" class="f-gold" data-at="1@0.6" data-out="5" data-fx="fade">?</text>
        <text x="${MX}" y="${SY + 120}" text-anchor="middle" font-size="52" font-weight="900" class="f-teal" data-at="5@0.1" data-fx="pop">+7</text>
        ${OX.map((x, i) => `<text x="${x}" y="${SY + 112}" text-anchor="middle" font-size="40" font-weight="900" class="f-bad" data-at="2@${0.05 + i * 0.1}" data-fx="pop">−2</text>`).join('')}
        <g data-at="2@0.6" data-fx="fade"><path d="M${OX[0] - 40} ${SY + 140} v16 h${OX[3] - OX[0] + 80} v-16" fill="none" stroke="${RED}" stroke-width="5"/>
          <text x="${(OX[0] + OX[3]) / 2}" y="${SY + 210}" text-anchor="middle" font-size="46" font-weight="900" class="f-bad">−8</text></g>
      </svg>
      <div class="card ox-steps" data-at="2-0.2">
        <div class="ox-ln" style="top:40px" data-at="2@0.3" data-fx="fade">4 O: 4 × (<span class="bad">−2</span>) = <span class="bad">−8</span></div>
        <div class="ox-ln" style="top:150px" data-at="3@0.2" data-fx="fade">Total = ion’s charge = <span class="gold">−1</span></div>
        <div class="ox-ln" style="top:260px" data-at="4@0.1" data-fx="fade"><span class="pri">Mn</span> + (<span class="bad">−8</span>) = <span class="gold">−1</span></div>
        <div class="ox-res" data-at="5" data-fx="pop"><span class="pri">Mn</span> = <span class="teal">+7</span></div></div>
      <div class="ox-row" style="top:850px;height:110px" data-at="6"><div class="eq" style="top:28px">Same idea: <span class="pri">N</span> in NH<sub>4</sub><sup>+</sup> &nbsp;${ARR} 4 H = <span class="warm">+4</span>, total = <span class="gold">+1</span> &nbsp;${ARR} <span class="pri">N</span> = <span class="teal">−3</span></div></div>`,
  })

  // ---------- oxidation vs reduction ----------
  const scale = (x, dir, col, cls) => `<line x1="${x}" y1="${dir > 0 ? 300 : 110}" x2="${x}" y2="${dir > 0 ? 120 : 290}" stroke="${col}" stroke-width="12" marker-end="url(#mk-${cls})"/>`
  EZ.scene('oxred', {
    html: `<div class="kicker" data-at="in" data-fx="left">Oxidation vs. reduction</div><h2 class="h1" data-at="0">What the numbers tell you</h2>
      <div class="card ox-side" data-at="1"><h3 class="warm">Oxidation</h3><p>= <b class="warm">loss</b> of electrons</p>
        <svg style="position:absolute;left:0;top:90px" width="780" height="350" viewBox="0 0 780 350">
          ${ball(170, 200, 58, 'pur')}<g class="oe">${eDot()}</g>
          <g data-at="1@0.55" data-fx="fade">${scale(470, 1, WARM, 'warm')}<text x="510" y="190" font-size="38" font-weight="900" class="f-warm">ox. number</text><text x="510" y="236" font-size="38" font-weight="900" class="f-warm">goes UP</text></g></svg></div>
      <div class="card ox-side" style="left:1020px" data-at="2"><h3 class="teal">Reduction</h3><p>= <b class="teal">gain</b> of electrons</p>
        <svg style="position:absolute;left:0;top:90px" width="780" height="350" viewBox="0 0 780 350">
          ${ball(170, 200, 58, 'warm')}<g class="re">${eDot()}</g>
          <g data-at="2@0.5" data-fx="fade">${scale(470, -1, TEAL, 'teal')}<text x="510" y="190" font-size="38" font-weight="900" class="f-teal">ox. number</text><text x="510" y="236" font-size="38" font-weight="900" class="f-teal">goes DOWN</text></g></svg></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="3" data-fx="fade">
        <text x="300" y="808" text-anchor="middle" font-size="34" font-weight="900" class="f-warm">oxidized</text>
        <line x1="420" y1="796" x2="1490" y2="796" stroke="${TEAL}" stroke-width="6" stroke-dasharray="14 12" opacity=".7" marker-end="url(#mk-teal)"/>
        <text x="1620" y="808" text-anchor="middle" font-size="34" font-weight="900" class="f-teal">reduced</text>
        ${[0, 1, 2].map((i) => `<g class="fe${i}">${eDot(false)}</g>`).join('')}</g></svg>
      <div class="banner" style="top:870px;padding:18px 40px" data-at="4" data-out="5" data-fx="pop">One can’t happen <span class="gold">without the other</span></div>
      <div class="banner" style="top:870px;padding:18px 40px" data-at="5" data-fx="pop">Total <span class="warm">increase</span> = total <span class="teal">decrease</span></div>`,
    update(c) {
      const b = c.b
      const po = eio(c.seg(b[1].start + 0.3, b[1].start + 1.4))
      place(c.$('.oe'), lerp(250, 350, po), 200 - 110 * Math.sin(Math.PI * po * 0.5))
      c.$('.oe').style.opacity = 1 - c.seg(b[1].start + 1.2, b[1].start + 1.6)
      const pr = eio(c.seg(b[2].start + 0.2, b[2].start + 1.3))
      place(c.$('.re'), lerp(350, 236, pr), lerp(90, 170, pr))
      c.$('.re').style.opacity = c.seg(b[2].start, b[2].start + 0.3)
      const s = c.t - b[3].start
      for (let i = 0; i < 3; i++) {
        const p = s > 0 ? ((s * 0.35 + i / 3) % 1) : 0
        place(c.$('.fe' + i), lerp(440, 1470, p), 796)
        c.$('.fe' + i).style.opacity = s > 0 ? Math.min(clamp(p * 8), clamp((1 - p) * 8)) : 0
      }
    },
  })

  // ---------- OIL RIG ----------
  const word = (l, rest, cls) => `<span class="${cls}" style="font-size:96px">${l}</span><span style="font-size:52px">${rest}</span>`
  const oilLine = (top, at, html) => `<div style="position:absolute;left:60px;top:${top}px;font-weight:900;white-space:nowrap;line-height:1" data-at="${at}" data-fx="fade">${html}</div>`
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Memory trick</div><h2 class="h1" data-at="0">OIL RIG</h2>
      <div class="card" style="left:120px;top:290px;width:810px;height:380px" data-at="1">
        ${oilLine(36, '1', `<span class="warm" style="font-size:96px">O</span>`)}${oilLine(146, '1', `<span class="warm" style="font-size:96px">I</span>`)}${oilLine(256, '1', `<span class="warm" style="font-size:96px">L</span>`)}
        ${oilLine(66, '2@0.05', `<span style="font-size:52px;margin-left:80px">xidation</span>`)}${oilLine(176, '2@0.15', `<span style="font-size:52px;margin-left:80px">s</span>`)}${oilLine(286, '2@0.25', `<span style="font-size:52px;margin-left:80px">oss</span> <span class="muted" style="font-size:40px;margin-left:14px">of e<sup>−</sup></span>`)}</div>
      <div class="card" style="left:990px;top:290px;width:810px;height:380px" data-at="1@0.3">
        ${oilLine(36, '1@0.3', `<span class="teal" style="font-size:96px">R</span>`)}${oilLine(146, '1@0.3', `<span class="teal" style="font-size:96px">I</span>`)}${oilLine(256, '1@0.3', `<span class="teal" style="font-size:96px">G</span>`)}
        ${oilLine(66, '2@0.5', `<span style="font-size:52px;margin-left:80px">eduction</span>`)}${oilLine(176, '2@0.6', `<span style="font-size:52px;margin-left:80px">s</span>`)}${oilLine(286, '2@0.7', `<span style="font-size:52px;margin-left:80px">ain</span> <span class="muted" style="font-size:40px;margin-left:14px">of e<sup>−</sup></span>`)}</div>
      <div class="card" style="left:120px;top:710px;width:1680px;height:230px" data-at="3">
        <div style="position:absolute;left:0;right:0;top:28px;text-align:center;font-size:48px;font-weight:900">Or: <span class="warm">LEO</span> the lion says <span class="teal">GER</span></div>
        <div style="position:absolute;left:0;right:0;top:120px;text-align:center;font-size:42px;font-weight:800" data-at="4" data-fx="fade">
          <span class="warm">L</span>ose <span class="warm">E</span>lectrons = <span class="warm">O</span>xidation &nbsp;&nbsp;·&nbsp;&nbsp; <span class="teal">G</span>ain <span class="teal">E</span>lectrons = <span class="teal">R</span>eduction</div></div>`,
  })

  // ---------- worked example: Zn + Cu2+ ----------
  const col = (fm, on, onAt, cls) => `<div class="ox-col"><div class="on ${cls}" data-at="${onAt}" data-fx="pop">${on}</div><div class="fm">${fm}</div></div>`
  const op = (s) => `<div class="ox-op">${s}</div>`
  const ZX = 560, CX = 1360, BY = 690
  EZ.scene('example', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Who’s oxidized?</h2>
      <div class="card ox-eqc" data-at="1"><div class="ox-eqr">
        ${col('Zn<small class="muted" style="font-size:.55em">(s)</small>', '0', '2@0.15', 'warm')}${op('+')}
        ${col('Cu<sup>2+</sup><small class="muted" style="font-size:.55em">(aq)</small>', '+2', '3@0.15', 'teal')}${op('→')}
        ${col('Zn<sup>2+</sup><small class="muted" style="font-size:.55em">(aq)</small>', '+2', '2@0.25', 'warm')}${op('+')}
        ${col('Cu<small class="muted" style="font-size:.55em">(s)</small>', '0', '3@0.25', 'teal')}</div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.4" data-out="4@0.55" data-fx="fade">${ball(ZX, BY, 62, 'gray', 'Zn', 40)}</g>
        <g data-at="4@0.55" data-fx="fade">${ball(ZX, BY, 62, 'gray', sup('Zn', '2+'), 36)}</g>
        <g data-at="1@0.6" data-out="4@0.75" data-fx="fade">${ball(CX, BY, 62, 'warm', sup('Cu', '2+'), 36)}</g>
        <g data-at="4@0.75" data-fx="fade">${ball(CX, BY, 62, 'warm', 'Cu', 40)}</g>
        <path d="M${ZX + 70} ${BY - 40} Q${(ZX + CX) / 2} ${BY - 170} ${CX - 70} ${BY - 40}" fill="none" stroke="${TEAL}" stroke-width="5" stroke-dasharray="12 12" opacity=".6" marker-end="url(#mk-teal)" data-at="4" data-fx="fade"/>
        <text x="${(ZX + CX) / 2}" y="${BY - 150}" text-anchor="middle" font-size="40" font-weight="900" class="f-teal" data-at="4@0.3" data-fx="fade">2 ${sup('e', '−')}</text>
        <g class="xe0">${eDot(false)}</g><g class="xe1">${eDot(false)}</g>
        <g data-at="2@0.6" data-fx="fade"><text x="${ZX}" y="${BY + 112}" text-anchor="middle" font-size="38" font-weight="900" class="f-warm">0 → +2: up</text>
          <text x="${ZX}" y="${BY + 160}" text-anchor="middle" font-size="34" font-weight="800" class="f-muted">lost 2 ${sup('e', '−')} = <tspan class="f-warm">oxidized</tspan></text></g>
        <g data-at="3@0.6" data-fx="fade"><text x="${CX}" y="${BY + 112}" text-anchor="middle" font-size="38" font-weight="900" class="f-teal">+2 → 0: down</text>
          <text x="${CX}" y="${BY + 160}" text-anchor="middle" font-size="34" font-weight="800" class="f-muted">gained 2 ${sup('e', '−')} = <tspan class="f-teal">reduced</tspan></text></g>
      </svg>
      <div class="banner" style="top:900px;padding:14px 40px;font-size:46px" data-at="5" data-fx="pop">Up by <span class="warm">2</span>, down by <span class="teal">2</span>: the changes match</div>`,
    update(c) {
      const b = c.b
      for (let i = 0; i < 2; i++) {
        const p = eio(c.seg(b[4].start + 0.2 + i * 0.35, b[4].start + 1.4 + i * 0.35))
        const x = lerp(ZX + 50, CX - 50, p), y = BY - 30 - 260 * p * (1 - p) * 1.5
        place(c.$('.xe' + i), x, y)
        c.$('.xe' + i).style.opacity = p > 0 && p < 1 ? 1 : 0
      }
    },
  })

  // ---------- spotting redox ----------
  const sc = (fm, on, at, cls) => `<div class="ox-col"><div class="on ${cls}" data-at="${at}" data-fx="pop">${on}</div><div class="fm">${fm}</div></div>`
  EZ.scene('spot', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Spotting redox</div><h2 class="h1" data-at="0">Did any oxidation number change?</h2>
      <div class="banner" style="top:290px;padding:16px 40px;font-size:44px" data-at="1" data-fx="pop">A <span class="gold">change</span> in oxidation number ${ARR} redox</div>
      <div class="ox-sr" style="top:430px" data-at="2"><div class="ox-eqr">
        ${sc('2Na', '0', '2@0.45', 'warm')}${op('+')}${sc('Cl<sub>2</sub>', '0', '3@0.1', 'teal')}${op('→')}${sc('2NaCl', '<span class="warm">+1</span> &nbsp;<span class="teal">−1</span>', '2@0.6', 'muted')}</div>
        <div class="tag"><div class="ox-badge good" style="border-color:var(--good);background:rgba(76,199,129,.14)" data-at="3@0.6" data-fx="pop">REDOX</div>
          <p data-at="3@0.3" data-fx="fade"><span class="warm">Na: oxidized</span> · <span class="teal">Cl<sub>2</sub>: reduced</span></p></div></div>
      <div class="ox-sr" style="top:660px" data-at="4"><div class="ox-eqr">
        ${sc('AgNO<sub>3</sub>', 'Ag +1', '5@0.05', 'pri')}${op('+')}${sc('KCl', 'Cl −1', '5@0.35', 'pri')}${op('→')}${sc('AgCl', 'Ag +1 &nbsp;Cl −1', '5@0.6', 'pri')}${op('+')}${sc('KNO<sub>3</sub>', '', '5', 'pri')}</div>
        <div class="tag"><div class="ox-badge bad" style="border-color:var(--bad);background:rgba(240,112,122,.14)" data-at="6@0.3" data-fx="pop">NOT REDOX</div>
          <p data-at="5@0.85" data-fx="fade">no oxidation number changes</p></div></div>
      <div class="ox-chip" style="left:120px;top:890px" data-at="6@0.5" data-fx="pop">a <span class="warm">precipitation</span> reaction: no electrons transferred</div>`,
  })

  // ---------- the trap: what the exam skips ----------
  const focusIc = [
    `<svg width="200" height="110" viewBox="0 0 200 110">${ball(70, 60, 40, 'pur')}<g transform="translate(150 40)">${eDot(false)}</g><line x1="104" y1="52" x2="134" y2="44" stroke="${WARM}" stroke-width="5" marker-end="url(#mk-warm)"/></svg>`,
    `<svg width="200" height="110" viewBox="0 0 200 110">${ball(130, 60, 40, 'warm')}<g transform="translate(46 40)">${eDot(false)}</g><line x1="66" y1="44" x2="92" y2="52" stroke="${TEAL}" stroke-width="5" marker-end="url(#mk-teal)"/></svg>`,
    `<svg width="200" height="110" viewBox="0 0 200 110"><line x1="20" y1="60" x2="180" y2="60" stroke="${TEAL}" stroke-width="7" stroke-dasharray="14 10" marker-end="url(#mk-teal)"/><g transform="translate(70 60)">${eDot(false)}</g></svg>`,
  ]
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Watch out</div><h2 class="h1" data-at="0">What the AP® exam won’t test</h2>
      <div class="ox-x" style="left:470px" data-at="1@0.4" data-fx="pop">oxidizing agent<i data-at="1@0.8" data-fx="grow"></i></div>
      <div class="ox-x" style="left:1030px" data-at="1@0.55" data-fx="pop">reducing agent<i data-at="1@0.9" data-fx="grow"></i></div>
      ${[['which is <span class="warm">oxidized</span>', '2@0.3'], ['which is <span class="teal">reduced</span>', '2@0.48'], ['direction of e<sup>−</sup> flow', '2@0.7']].map(([t, at], i) =>
        `<div class="ox-f" style="left:${120 + i * 570}px" data-at="${at}" data-fx="pop">${focusIc[i]}<b>${t}</b></div>`).join('')}
      <div style="position:absolute;left:120px;top:460px;font-size:34px;font-weight:900;letter-spacing:.12em;color:var(--muted)" data-at="2" data-fx="fade">FOCUS ON</div>`,
  })

  // ---------- try it ----------
  const OPTS = ['−2', '+4', '+6', '+8']
  const xrow = (top, at, html) => `<div class="ox-row" style="top:${top}px;height:104px" data-at="${at}"><div class="eq" style="top:26px">${html}</div></div>`
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">Oxidation number of <span class="teal">S</span> in SO<sub>4</sub><sup>2−</sup>?</h2>
      ${OPTS.map((f, i) => `<div class="ox-tile t${i}" style="left:${120 + i * 430}px" data-at="1@${0.5 + i * 0.12}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>
        ${i === 2 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        <div class="f">${f}</div></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="820" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="820" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 820)"/>
        <text class="num" x="960" y="846" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="950" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      ${xrow(700, '4', '4 O = 4 × (<span class="bad">−2</span>) = <span class="bad">−8</span>, and the total must be <span class="gold">−2</span>')}
      ${xrow(826, '5', '<span class="teal">S</span> + (<span class="bad">−8</span>) = <span class="gold">−2</span> &nbsp;' + ARR + ' <span class="teal">S = +6</span>')}`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.3, b[3].start + 0.8))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 2) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="210" viewBox="0 0 460 210">
    ${ball(70, 60, 34, 'gray', 'Fe', 24)}<text x="70" y="140" text-anchor="middle" font-size="36" font-weight="900" class="f-teal">0</text>
    ${ball(180, 60, 34, 'red', 'O', 26)}<text x="180" y="140" text-anchor="middle" font-size="36" font-weight="900" class="f-warm">−2</text>
    ${ball(290, 60, 28, 'gray', 'H', 24)}<text x="290" y="140" text-anchor="middle" font-size="36" font-weight="900" class="f-warm">+1</text>
    ${ball(395, 60, 30, 'gold', 'F', 24)}<text x="395" y="140" text-anchor="middle" font-size="36" font-weight="900" class="f-warm">−1</text>
    <text x="230" y="196" text-anchor="middle" font-size="30" font-weight="900" class="f-gold">sum = charge</text></svg>`
  const r2 = `<svg width="460" height="210" viewBox="0 0 460 210">
    <line x1="130" y1="170" x2="130" y2="64" stroke="${WARM}" stroke-width="12" marker-end="url(#mk-warm)"/><text x="130" y="204" text-anchor="middle" font-size="28" font-weight="900" class="f-warm">oxidation</text>
    <line x1="330" y1="40" x2="330" y2="146" stroke="${TEAL}" stroke-width="12" marker-end="url(#mk-teal)"/><text x="330" y="204" text-anchor="middle" font-size="28" font-weight="900" class="f-teal">reduction</text>
    <text x="230" y="110" text-anchor="middle" font-size="34" font-weight="900" class="f-gold">OIL RIG</text></svg>`
  const r3 = `<svg width="460" height="210" viewBox="0 0 460 210">${ball(70, 100, 46, 'pur')}${ball(390, 100, 46, 'warm')}
    <line x1="130" y1="100" x2="326" y2="100" stroke="${TEAL}" stroke-width="6" stroke-dasharray="12 10" marker-end="url(#mk-teal)"/>
    <g transform="translate(230 100)">${eDot()}</g>
    <text x="70" y="190" text-anchor="middle" font-size="26" font-weight="900" class="f-warm">oxidized</text><text x="390" y="190" text-anchor="middle" font-size="26" font-weight="900" class="f-teal">reduced</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card ox-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Elements = <span class="teal">0</span><br>O = −2, H = +1, F = −1<br>The sum = <span class="gold">the charge</span></p></div>
      <div class="card ox-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p><span class="warm">Oxidation</span> = loss of ${eTxt}<br>(ox. # up)<br><span class="teal">Reduction</span> = gain (down)</p></div>
      <div class="card ox-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Electrons go from<br>the <span class="warm">oxidized</span> species<br>to the <span class="teal">reduced</span> one</p></div>`,
  })
})()
