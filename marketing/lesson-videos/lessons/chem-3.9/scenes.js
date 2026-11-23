// Pictures for chem-3.9 "Separating Mixtures: Chromatography & Distillation". One EZ.scene per scene
// id in script.mjs. Every value shown is the lesson's own (app/src/content/chem/u3.ts and book.ts).
// Particles, spots and glassware are schematic: counts, sizes and distances are not to scale, except
// that a spot's height on a strip is drawn at its Rf (distance of spot ÷ distance of solvent front).
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-note{position:absolute;left:1360px;width:490px;height:106px;padding:16px 22px 0 84px;border-radius:22px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .x-note i{position:absolute;left:22px;top:26px;width:46px;height:46px;border-radius:50%}
    .x-note b{display:block;font-size:30px;font-weight:900;line-height:1.15;white-space:nowrap} .x-note span{display:block;font-size:25px;font-weight:700;color:var(--muted);white-space:nowrap}
    .x-ln{position:absolute;left:44px;font-size:36px;font-weight:800;white-space:nowrap;color:var(--muted)}
    .x-big{position:absolute;left:44px;font-size:48px;font-weight:900;white-space:nowrap}
    .x-box{position:absolute;left:40px;right:40px;padding:20px;border-radius:22px;text-align:center;font-size:42px;font-weight:900;line-height:1.25;background:rgba(76,199,129,.14);border:2px solid var(--good)}
    .x-frac{position:absolute;left:44px;top:120px;display:flex;align-items:center;gap:26px;font-size:60px;font-weight:900;white-space:nowrap}
    .x-fr{display:flex;flex-direction:column;align-items:center;text-align:center} .x-fr span{padding:6px 14px;font-size:36px;line-height:1.2} .x-fr span+span{border-top:6px solid var(--text)}
    .x-prob{left:120px;top:290px;width:1680px;height:130px;padding:36px 48px 0;font-size:42px;font-weight:800;white-space:nowrap}
    .x-step{position:absolute;left:760px;width:1040px;height:120px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .x-step .n{position:absolute;left:26px;top:26px;width:68px;height:68px;border-radius:50%;background:var(--brand);font-size:38px;font-weight:900;line-height:68px;text-align:center}
    .x-step p{position:absolute;left:122px;top:0;bottom:0;margin:0;display:flex;align-items:center;font-size:34px;font-weight:800;line-height:1.25}
    .x-chx{position:absolute;height:72px;padding:0 26px;border-radius:20px;background:rgba(255,255,255,.05);border:2px solid var(--line);font-size:31px;font-weight:800;line-height:68px;white-space:nowrap}
    .x-srow{position:absolute;left:120px;width:1680px;height:120px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .x-srow .n{position:absolute;left:28px;top:26px;width:68px;height:68px;border-radius:50%;background:var(--brand);font-size:38px;font-weight:900;line-height:68px;text-align:center}
    .x-srow .lb{position:absolute;left:124px;top:38px;font-size:34px;font-weight:800;color:var(--muted);white-space:nowrap}
    .x-srow .eq{position:absolute;left:520px;top:30px;font-size:46px;font-weight:900;white-space:nowrap}
    .x-ans{position:absolute;left:120px;top:460px;width:1680px;height:124px;border-radius:28px;background:rgba(76,199,129,.14);border:3px solid var(--good);text-align:center;font-size:62px;font-weight:900;line-height:118px}
    .x-ans svg{position:absolute;right:30px;top:28px;width:64px;height:64px}
    .x-sub{position:absolute;left:40px;top:92px;font-size:28px;font-weight:800;color:var(--muted);white-space:nowrap}
    .x-rc{top:320px;width:540px;height:560px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:33px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const CHECK = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  // "Rf" in SVG text, with the f lowered; `rest` continues on the base line
  const rfs = (rest = '') => `R<tspan dy=".19em" font-size=".62em">f</tspan>${rest ? `<tspan dy="-.19em">${rest}</tspan>` : ''}`
  const RF = 'R<sub>f</sub>'
  const C = { A: '#f3a764', B: '#8d8df0', gold: '#f2c443', red: '#f0707a', teal: '#3cc7bc' }

  // ---------- a paper chromatography strip ----------
  // paper from top to bot, start line 70 px above the bottom, the solvent pool at the bottom.
  // p = how far the solvent has risen (0..1); each spot sits at Rf × (distance of the front).
  const strip = (cls, x, top, bot, w, spots, p = 0) => {
    const st = bot - 70, fy = lerp(st, top + 40, p)
    return `<g class="${cls}" data-st="${st}" data-top="${top}" data-bot="${bot}">
      <rect x="${x}" y="${top}" width="${w}" height="${bot - top}" rx="6" fill="#e3e6f0"/>
      <rect class="wet" x="${x}" y="${fy}" width="${w}" height="${bot - fy}" fill="#3cc7bc" opacity=".3"/>
      <line x1="${x}" x2="${x + w}" y1="${st}" y2="${st}" stroke="#7d859c" stroke-width="3" stroke-dasharray="10 8"/>
      <line class="fr" x1="${x}" x2="${x + w}" y1="${fy}" y2="${fy}" stroke="#1b7f77" stroke-width="5" stroke-dasharray="14 8" opacity="${p > 0.01 ? 1 : 0}"/>
      ${spots.map(([rf, col, dx = 0]) => `<ellipse class="sp" data-rf="${rf}" cx="${x + w / 2 + dx}" cy="${st - rf * (st - fy)}" rx="${w * 0.14}" ry="${w * 0.085}" fill="${col}" opacity=".82"/>`).join('')}
      <rect x="${x - 34}" y="${bot - 30}" width="${w + 68}" height="52" rx="10" fill="rgba(60,199,188,.3)" stroke="#c9cee0" stroke-width="4"/></g>`
  }
  const spotY = (top, bot, rf) => { const st = bot - 70; return st - rf * (st - top - 40) }
  const setStrip = (c, cls, p) => {
    const g = c.$('.' + cls), st = +g.dataset.st, top = +g.dataset.top, bot = +g.dataset.bot, fy = lerp(st, top + 40, p)
    const fr = g.querySelector('.fr'); fr.setAttribute('y1', fy); fr.setAttribute('y2', fy); fr.style.opacity = p > 0.01 ? 1 : 0
    const wet = g.querySelector('.wet'); wet.setAttribute('y', fy); wet.setAttribute('height', bot - fy)
    for (const s of (g._sp ??= [...g.querySelectorAll('.sp')])) s.setAttribute('cy', st - +s.dataset.rf * (st - fy))
    return fy
  }
  const INK = [[0.82, C.gold], [0.54, C.red], [0.26, C.B]]

  // ---------- intro artwork: two faint strips at the left and right edges, below the title ----------
  EZ.intro = {
    chips: [['1@0.32', 'Filtration'], ['1@0.6', 'Chromatography'], ['1@0.86', 'Distillation']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.22">${strip('ia', 110, 610, 920, 150, INK)}${strip('ib', 1660, 610, 920, 150, INK)}</svg>`,
    update(c) {
      const p = eio(c.seg(c.sc.start + 0.4, c.sc.start + 4.4))
      setStrip(c, 'ia', p); setStrip(c, 'ib', p)
    },
  }

  // ---------- hook: which pen wrote the note? ----------
  let scrib = ''
  for (let k = 0; k < 6; k++) { const y = 420 + k * 50, len = k === 5 ? 160 : 300
    let d = `M300 ${y}`
    for (let x = 300; x <= 300 + len; x += 20) d += ` Q${x + 5} ${y - 12} ${x + 10} ${y} T${x + 20} ${y}`
    scrib += `<path d="${d}" fill="none" stroke="#3f3a7a" stroke-width="5" stroke-linecap="round"/>` }
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Forensic science</div><h2 class="h1" data-at="0">Which pen wrote the note?</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.3" data-fx="fade"><g transform="rotate(-4 460 560)"><rect x="260" y="340" width="400" height="440" rx="10" fill="#e3e6f0"/>${scrib}</g>
          <g transform="rotate(32 760 470)"><rect x="700" y="452" width="250" height="36" rx="18" fill="#5b5bd6"/><path d="M700 452 L650 470 L700 488 Z" fill="#c9cee0"/><circle cx="652" cy="470" r="5" fill="#3f3a7a"/></g></g>
        <g data-at="1" data-fx="fade"><line x1="760" y1="660" x2="1060" y2="750" stroke="#eef0f7" stroke-width="6" stroke-dasharray="14 10" marker-end="url(#mk-text)"/>
          <text x="880" y="630" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">a sample of the ink</text></g>
        <g data-at="1" data-fx="fade">${strip('hs', 1120, 300, 840, 220, INK)}<ellipse class="x-mix" cx="1230" cy="770" rx="34" ry="21" fill="#3f3a7a"/></g>
        <text x="1400" y="440" font-size="36" font-weight="900" class="f-gold" data-at="3" data-fx="fade">one ink,</text>
        <text x="1400" y="490" font-size="36" font-weight="900" class="f-gold" data-at="3" data-fx="fade">several colors</text>
      </svg>
      <div class="banner" style="top:890px" data-at="2" data-out="3" data-fx="pop">This trick is <span class="teal">chromatography</span></div>
      <div class="banner" style="top:890px" data-at="3" data-fx="pop">Molecules stick to paper with <span class="warm">different strengths</span></div>`,
    update(c) { const p = eio(c.seg(c.b[1].start + 0.4, c.b[3].end)); setStrip(c, 'hs', p); c.$('.x-mix').style.opacity = 1 - clamp(p * 6) },
  })

  // ---------- filtration can't separate a solution ----------
  const beakerD = (x, y, w, h) => `M${x - 12} ${y} H${x} V${y + h - 26} Q${x} ${y + h} ${x + 26} ${y + h} H${x + w - 26} Q${x + w} ${y + h} ${x + w} ${y + h - 26} V${y} H${x + w + 12}`
  const liqD = (x, y, w, h, lv) => { const t = y + h - lv, i = 7
    return `M${x + i} ${t} H${x + w - i} V${y + h - 26} Q${x + w - i} ${y + h - i} ${x + w - 26} ${y + h - i} H${x + 26} Q${x + i} ${y + h - i} ${x + i} ${y + h - 26} Z` }
  const IONS = [[450, 425, 'Na'], [530, 420, 'Cl'], [600, 428, 'Na'], [480, 478, 'Cl'], [560, 476, 'Na'], [520, 515, 'Cl']]
  const IEND = [[430, 838], [492, 830], [552, 840], [610, 832], [462, 800], [585, 798]]
  const ionBall = (k) => k === 'Na' ? ball(0, 0, 19, 'warm', sup('Na', '+'), 17) : ball(0, 0, 27, 'teal', sup('Cl', '−'), 21)
  EZ.scene('filter', {
    html: `<div class="kicker" data-at="in" data-fx="left">First question</div><h2 class="h1" data-at="1">Filtration can’t separate a solution</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.3" data-fx="fade">
          <path d="${liqD(380, 640, 280, 240, 30)}" class="x-flt" fill="rgba(60,199,188,.16)"/><path d="${beakerD(380, 640, 280, 240)}" fill="none" stroke="#c9cee0" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M395 400 L645 400 L520 550 Z" fill="rgba(60,199,188,.2)"/>
          <path d="M340 330 L506 556 V700 M534 700 V556 L700 330" fill="none" stroke="#c9cee0" stroke-width="6" stroke-linejoin="round"/>
          <path d="M362 336 L520 540 L678 336" fill="none" stroke="#eef0f7" stroke-width="4" stroke-dasharray="12 8"/>
          ${IONS.map(([x, y, k], i) => `<g class="x-ion x-i${i}" transform="translate(${x} ${y})">${ionBall(k)}</g>`).join('')}</g>
        <g data-at="0@0.6" data-fx="fade"><line x1="728" y1="392" x2="668" y2="380" stroke="#eef0f7" stroke-width="4" marker-end="url(#mk-text)"/>
          <text x="740" y="402" font-size="32" font-weight="800">filter paper</text></g>
        <text x="520" y="312" text-anchor="middle" font-size="32" font-weight="900" class="f-teal" data-at="3@0.1" data-fx="fade">salt water</text>
        <text x="700" y="790" font-size="32" font-weight="900" class="f-warm" data-at="4@0.5" data-fx="fade">ions pass</text>
        <text x="700" y="830" font-size="32" font-weight="900" class="f-warm" data-at="4@0.5" data-fx="fade">right through</text>
      </svg>
      <div class="card" style="left:990px;top:300px;width:810px;height:590px" data-at="2"><h3>Why not?</h3>
        <div class="x-ln" style="top:110px">Dissolved particles are as small as</div>
        <div class="x-big" style="top:160px"><span class="pri">molecules</span> or <span class="teal">ions</span></div>
        <div class="x-ln" style="top:262px;color:var(--text)" data-at="3@0.3" data-fx="fade"><span class="warm">Na<sup>+</sup></span> and <span class="teal">Cl<sup>−</sup></span>: individual ions</div>
        <div class="x-ln" style="top:320px" data-at="3@0.7" data-fx="fade"><span class="bad">✗</span> too small to be trapped</div>
        <div class="x-box" style="top:410px" data-at="5" data-fx="pop">Separate by differences in<br>intermolecular interactions</div></div>`,
    update(c) {
      const b = c.b, T0 = b[3].start + 0.6
      let done = 0
      IONS.forEach(([x, y], i) => {
        const p = eio(c.seg(T0 + i * 0.6, T0 + i * 0.6 + 2.2)), [ex, ey] = IEND[i]
        let X, Y
        if (p < 0.35) { const q = p / 0.35; X = lerp(x, 520, q); Y = lerp(y, 548, q) }
        else if (p < 0.6) { X = 520; Y = lerp(548, 700, (p - 0.35) / 0.25) }
        else { const q = (p - 0.6) / 0.4; X = lerp(520, ex, q); Y = lerp(700, ey, q) }
        if (p >= 1) done++
        c.$('.x-i' + i).setAttribute('transform', `translate(${X.toFixed(1)} ${Y.toFixed(1)})`)
      })
      c.$('.x-flt').setAttribute('d', liqD(380, 640, 280, 240, lerp(30, 100, eio(c.seg(T0, T0 + 5.4)))))
      void done
    },
  })

  // ---------- chromatography: two phases compete ----------
  const S2 = [[0.77, C.A], [0.27, C.B]]
  const ST = 300, SB = 840 // strip top and bottom used in several scenes
  const note = (left, w, top, at, color, a, b2) => `<div class="x-note" style="left:${left}px;width:${w}px;top:${top}px" data-at="${at}" data-fx="right"><i style="background:${color}"></i><b>${a}</b><span>${b2}</span></div>`
  EZ.scene('chroma', {
    html: `<div class="kicker" data-at="in" data-fx="left">Chromatography</div><h2 class="h1" data-at="1">Two phases compete</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1" data-fx="fade">${strip('cs', 280, ST, SB, 240, S2)}</g>
        <g data-at="2@0.3" data-out="5" data-fx="fade"><line x1="600" y1="836" x2="566" y2="836" stroke="#3cc7bc" stroke-width="5" marker-end="url(#mk-teal)"/>
          <text x="612" y="847" font-size="32" font-weight="900" class="f-teal">mobile phase</text></g>
        <g data-at="3@0.3" data-out="5" data-fx="fade"><line x1="580" y1="372" x2="530" y2="372" stroke="#8d8df0" stroke-width="5" marker-end="url(#mk-pri)"/>
          <text x="592" y="383" font-size="32" font-weight="900" class="f-pri">stationary phase</text></g>
        <text x="262" y="780" text-anchor="end" font-size="30" font-weight="800" class="f-muted" data-at="4" data-fx="fade">start</text>
        <text class="x-fl f-teal" x="262" y="780" text-anchor="end" font-size="30" font-weight="900">front</text>
        <text x="560" y="${spotY(ST, SB, 0.27) + 11}" font-size="34" font-weight="900" class="f-pri" data-at="5@0.3" data-fx="fade">moves less</text>
        <text x="560" y="${spotY(ST, SB, 0.77) + 11}" font-size="34" font-weight="900" class="f-warm" data-at="6@0.3" data-fx="fade">travels farther</text>
      </svg>
      ${note(1200, 600, 300, '2', C.teal, 'Mobile phase', 'the moving solvent')}
      ${note(1200, 600, 424, '3', C.B, 'Stationary phase', 'paper, TLC plate or column packing')}
      ${note(1200, 600, 548, '5', C.B, 'Stronger pull to stationary', 'moves less')}
      ${note(1200, 600, 672, '6', C.A, 'Stronger pull to mobile', 'travels farther')}
      ${note(1200, 600, 796, '7', C.gold, 'One spot, several spots', 'each at its own height')}`,
    update(c) {
      const b = c.b, p = eio(c.seg(b[4].start + 0.6, b[5].start + 0.4)), fy = setStrip(c, 'cs', p)
      const fl = c.$('.x-fl'); fl.setAttribute('y', fy + 10); fl.style.opacity = p > 0.03 ? 1 : 0
      for (const s of (c._sp ??= [...c.root.querySelectorAll('.cs .sp')])) s.style.opacity = 0.82 * c.p('4', 0.4)
    },
  })

  // ---------- Rf ----------
  const RX = 540, RW = 240, yA = spotY(ST, SB, 0.77), yB = spotY(ST, SB, 0.27), RST = SB - 70, RFR = ST + 40
  EZ.scene('rf', {
    html: `<div class="kicker" data-at="in" data-fx="left">Comparing spots</div><h2 class="h1" data-at="0">The R<sub>f</sub> value</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.3" data-fx="fade">${strip('rs', RX, ST, SB, RW, S2, 1)}
          <text x="${RX - 62}" y="${RST + 10}" text-anchor="end" font-size="28" font-weight="800" class="f-muted">start</text></g>
        <g data-at="1@0.55" data-fx="fade"><line x1="${RX - 34}" y1="${RST - 6}" x2="${RX - 34}" y2="${RFR + 8}" stroke="#3cc7bc" stroke-width="7" marker-start="url(#mk-teal)" marker-end="url(#mk-teal)"/>
          <text x="${RX - 74}" y="${(RST + RFR) / 2 - 6}" text-anchor="end" font-size="34" font-weight="900" class="f-teal">solvent</text>
          <text x="${RX - 74}" y="${(RST + RFR) / 2 + 36}" text-anchor="end" font-size="34" font-weight="900" class="f-teal">front</text></g>
        <g data-at="1@0.2" data-fx="fade"><line x1="${RX + RW + 40}" y1="${RST - 6}" x2="${RX + RW + 40}" y2="${yA + 8}" stroke="#f3a764" stroke-width="7" marker-start="url(#mk-warm)" marker-end="url(#mk-warm)"/>
          <text x="${RX + RW + 64}" y="${yA + 70}" font-size="34" font-weight="900" class="f-warm">component</text></g>
        <text x="${RX + RW + 64}" y="${yA + 12}" font-size="34" font-weight="900" data-at="2@0.55" data-fx="fade">high ${rfs()}</text>
        <text x="${RX + RW + 64}" y="${yB + 12}" font-size="34" font-weight="900" data-at="2@0.1" data-fx="fade">low ${rfs()}</text>
      </svg>
      <div class="card" style="left:1120px;top:300px;width:680px;height:400px" data-at="1"><h3>The formula</h3>
        <div class="x-frac"><span>R<sub>f</sub> =</span><div class="x-fr"><span class="warm">distance traveled<br>by the component</span><span class="teal">distance traveled<br>by the solvent front</span></div></div></div>
      <div class="card" style="left:1120px;top:730px;width:680px;height:130px" data-at="3"><div class="x-ln" style="top:40px;color:var(--text)">${ARR} infer <span class="gold">relative polarities</span></div></div>`,
  })

  // ---------- worked example ----------
  const EX = 200, EW = 200, ET = 460, EB = 920
  const eA = spotY(ET, EB, 0.77), eB = spotY(ET, EB, 0.27)
  const step = (i, top, at, html, cls = '') => `<div class="x-step" style="top:${top}px;${cls}" data-at="${at}"><div class="n">${i}</div><p><span>${html}</span></p></div>`
  EZ.scene('example', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Read the chromatogram</h2>
      <div class="card x-prob" data-at="1"><span class="pri">Polar</span> paper, <span class="warm">nonpolar</span> solvent. <span data-at="2">A: R<sub>f</sub> = 0.77, B: R<sub>f</sub> = 0.27.</span> <span class="muted" data-at="2@0.8">More polar?</span></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.4" data-fx="fade">${strip('es', EX, ET, EB, EW, S2, 1)}</g>
        <ellipse class="x-ring" cx="${EX + EW / 2}" cy="${eB}" rx="46" ry="32" fill="none" stroke="#4cc781" stroke-width="5"/>
        <g data-at="2@0.2" data-fx="fade"><text x="${EX + EW + 40}" y="${eA + 12}" font-size="36" font-weight="900" class="f-warm">A · ${rfs(' 0.77')}</text></g>
        <g data-at="2@0.5" data-fx="fade"><text x="${EX + EW + 40}" y="${eB + 12}" font-size="36" font-weight="900" class="f-pri">B · ${rfs(' 0.27')}</text></g>
      </svg>
      ${step(1, 470, '3', 'Paper is <span class="pri">polar</span>, so polar molecules stick to it<br>and move slowly')}
      ${step(2, 610, '4', 'B moved the least (lowest R<sub>f</sub>):<br>strongest attraction to the polar paper')}
      ${step(3, 750, '5', '<span><span class="good">B is more polar.</span> A is less polar:<br>it prefers the nonpolar solvent</span>', 'border-color:var(--good);background:rgba(76,199,129,.12)')}`,
    update(c) {
      const w = c.p('4@0.3', 0.4) * (0.7 + 0.3 * Math.sin(c.t * 4) * (1 - c.seg(c.b[5].start, c.b[5].start + 0.5)))
      c.$('.x-ring').style.opacity = w
    },
  })

  // ---------- distillation ----------
  const FX = 400, FCY = 650, FR = 125
  const neckTop = FCY - Math.sqrt(FR * FR - 25 * 25)
  const flaskPath = `M${FX - 25} 420 V${neckTop} A${FR} ${FR} 0 1 0 ${FX + 25} ${neckTop} V420`
  const RCX = 1060, recvPath = `M${RCX - 25} 680 V730 L${RCX - 100} 866 Q${RCX - 104} 880 ${RCX - 90} 880 H${RCX + 90} Q${RCX + 104} 880 ${RCX + 100} 866 L${RCX + 25} 730 V680`
  const ETH = [[340, 690], [400, 680], [460, 692], [370, 730], [430, 728], [400, 750], [352, 742]]
  const WAT = [[310, 712], [370, 700], [430, 700], [490, 716], [340, 738], [462, 736], [400, 712], [372, 750], [428, 752]]
  const RDROP = [[1040, 862], [1080, 862], [1020, 840], [1060, 840], [1100, 842], [1040, 818], [1080, 818]]
  const VPATH = (x, y) => [[x, y], [FX, 600], [FX, 445], [FX + 70, 470], [RCX, 640], [RCX, 700]]
  const along = (pts, p) => { const L = []; let tot = 0
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); tot += d }
    let s = p * tot
    for (let i = 0; i < L.length; i++) { if (s <= L[i] || i === L.length - 1) { const q = clamp(s / L[i]); return [lerp(pts[i][0], pts[i + 1][0], q), lerp(pts[i][1], pts[i + 1][1], q)] } s -= L[i] }
  }
  EZ.scene('distill', {
    html: `<div class="kicker" data-at="in" data-fx="left">Distillation</div><h2 class="h1" data-at="1">Separate by boiling point</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.3" data-fx="fade">
          <clipPath id="x-fc"><circle cx="${FX}" cy="${FCY}" r="${FR - 4}"/></clipPath>
          <rect x="${FX - FR}" y="${FCY + 10}" width="${2 * FR}" height="${FR}" clip-path="url(#x-fc)" fill="rgba(60,199,188,.16)"/>
          ${WAT.map(([x, y], i) => `<g class="x-w" data-i="${i}" transform="translate(${x} ${y})">${ball(0, 0, 12, 'teal')}</g>`).join('')}
          ${ETH.map(([x, y], i) => `<g class="x-e x-e${i}" transform="translate(${x} ${y})">${ball(0, 0, 12, 'warm')}</g>`).join('')}
          <path d="${flaskPath}" fill="none" stroke="#c9cee0" stroke-width="6" stroke-linejoin="round"/>
          <line x1="${FX + 70}" y1="470" x2="${RCX}" y2="640" stroke="#c9cee0" stroke-width="80" stroke-linecap="round" opacity=".55"/>
          <line x1="${FX + 70}" y1="470" x2="${RCX}" y2="640" stroke="#1a1d2a" stroke-width="70" stroke-linecap="round"/>
          <line x1="${FX + 70}" y1="470" x2="${RCX}" y2="640" stroke="rgba(60,199,188,.2)" stroke-width="70" stroke-linecap="round"/>
          <path d="M${FX + 25} 445 L${FX + 70} 470 L${RCX} 640 V700" fill="none" stroke="#c9cee0" stroke-width="26" stroke-linejoin="round"/>
          <path d="M${FX + 25} 445 L${FX + 70} 470 L${RCX} 640 V700" fill="none" stroke="#10131c" stroke-width="16" stroke-linejoin="round"/>
          <clipPath id="x-rc"><path d="${recvPath}Z"/></clipPath>
          <rect class="x-rl" x="${RCX - 110}" y="880" width="220" height="40" clip-path="url(#x-rc)" fill="rgba(243,167,100,.25)"/>
          <path d="${recvPath}" fill="none" stroke="#c9cee0" stroke-width="6" stroke-linejoin="round"/></g>
        <text x="${FX - FR - 24}" y="${FCY + 20}" text-anchor="end" font-size="32" font-weight="900" class="f-muted" data-at="3@0.3" data-fx="fade">mixture</text>
        <g data-at="3@0.4" data-fx="fade"><g class="x-flame"><path d="M${FX} 790 C${FX + 34} 830 ${FX + 30} 870 ${FX} 880 C${FX - 30} 870 ${FX - 34} 830 ${FX} 790 Z" fill="#f3a764"/><path d="M${FX} 828 C${FX + 14} 848 ${FX + 12} 870 ${FX} 874 C${FX - 12} 870 ${FX - 14} 848 ${FX} 828 Z" fill="#f2c443"/></g>
          <text x="${FX + 50}" y="868" font-size="32" font-weight="900" class="f-warm">heat</text></g>
        <g data-at="5@0.2" data-fx="fade"><g transform="rotate(16.6 760 470)"><text x="760" y="470" text-anchor="middle" font-size="32" font-weight="900" class="f-teal">condenser</text></g></g>
        <text x="${RCX}" y="930" text-anchor="middle" font-size="32" font-weight="900" class="f-warm" data-at="5@0.7" data-fx="fade">collected</text>
        <text x="${FX}" y="930" text-anchor="middle" font-size="32" font-weight="900" class="f-teal" data-at="8@0.5" data-fx="fade">richer in water</text>
      </svg>
      ${note(1360, 490, 300, '2', C.B, 'Boiling point', '= IMF strength & vapor pressure')}
      ${note(1360, 490, 424, '4', C.A, 'Weaker IMFs', 'higher vapor pressure: out first')}
      ${note(1360, 490, 548, '5', C.teal, 'Condenser', 'vapor cools back to a liquid')}
      ${note(1360, 490, 672, '6', C.A, 'Ethanol: 78 °C', 'collected first')}
      ${note(1360, 490, 796, '6@0.6', C.teal, 'Water: 100 °C', 'more H-bonds per molecule')}`,
    update(c) {
      const b = c.b, t = c.t, heat = c.seg(b[3].start + 0.4, b[3].start + 1)
      c.$('.x-flame').setAttribute('transform', `translate(${FX} 880) scale(${1 + 0.06 * Math.sin(t * 9) * heat} ${1 + 0.1 * Math.sin(t * 7.3) * heat}) translate(${-FX} -880)`)
      for (const g of (c._w ??= [...c.root.querySelectorAll('.x-w')])) { const i = +g.dataset.i, [x, y] = WAT[i]
        g.setAttribute('transform', `translate(${(x + 2.5 * heat * Math.sin(t * 3 + i)).toFixed(1)} ${(y + 2.5 * heat * Math.cos(t * 2.6 + i * 1.3)).toFixed(1)})`) }
      const T0 = b[4].start + 0.6, span = Math.max(4, b[8].start - T0 - 2.6) / ETH.length
      let arrived = 0
      ETH.forEach(([x, y], i) => {
        const p = eio(c.seg(T0 + i * span, T0 + i * span + 2.6))
        let X, Y
        if (p < 1) { [X, Y] = along(VPATH(x, y), p); if (p > 0.92) { const q = (p - 0.92) / 0.08; X = lerp(X, RDROP[i][0], q); Y = lerp(Y, RDROP[i][1], q) } }
        else { [X, Y] = RDROP[i]; arrived++ }
        c.$('.x-e' + i).setAttribute('transform', `translate(${X.toFixed(1)} ${Y.toFixed(1)})`)
      })
      const lv = arrived / ETH.length * 80, rl = c.$('.x-rl')
      rl.setAttribute('y', 880 - lv); rl.setAttribute('height', lv + 4)
    },
  })

  // ---------- trap: high Rf does not always mean polar ----------
  const trapCard = (left, at, title, sub, cls, polarRf, nonRf) => {
    const top = 20, bot = 380
    return `<div class="card" style="left:${left}px;top:300px;width:810px;height:560px" data-at="${at}"><h3>${title}</h3><div class="x-sub">${sub}</div>
      <svg style="position:absolute;left:0;top:140px" width="810" height="420">${strip(cls, 150, top, bot, 170, [[polarRf, C.B, -18], [nonRf, C.gold, 18]])}
        <text x="380" y="${spotY(top, bot, polarRf) + 12}" font-size="36" font-weight="900" class="f-pri" data-at="${at}@0.75" data-fx="fade">polar</text>
        <text x="380" y="${spotY(top, bot, nonRf) + 12}" font-size="36" font-weight="900" class="f-gold" data-at="${at}@0.8" data-fx="fade">nonpolar</text></svg></div>`
  }
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Common trap</div><h2 class="h1" data-at="1">High R<sub>f</sub> = polar? <span class="bad">Not always</span></h2>
      ${trapCard(120, '3', 'Polar paper', 'stationary: polar · solvent: nonpolar', 'ta', 0.25, 0.8)}
      ${trapCard(990, '4', 'Phases reversed', 'stationary: nonpolar · solvent: polar', 'tb', 0.8, 0.25)}
      <div class="banner" style="top:890px" data-at="2" data-out="5" data-fx="pop">It depends on the <span class="teal">phases</span></div>
      <div class="banner" style="top:890px;font-size:44px" data-at="5" data-fx="pop">Which phase is <span class="pri">polar</span>? Which does it <span class="warm">like more</span>?</div>`,
    update(c) {
      const b = c.b
      setStrip(c, 'ta', eio(c.seg(b[3].start + 0.3, b[3].start + 0.3 + 0.7 * (b[3].end - b[3].start))))
      setStrip(c, 'tb', eio(c.seg(b[4].start + 0.3, b[4].start + 0.3 + 0.7 * (b[4].end - b[4].start))))
    },
  })

  // ---------- try it ----------
  const srow = (i, top, at, label, eq) => `<div class="x-srow" style="top:${top}px" data-at="${at}"><div class="n">${i}</div><div class="lb">${label}</div>
      <div class="eq" data-at="${at}@0.3" data-fx="fade">${eq}</div></div>`
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:58px" data-at="1">A dye spot travels 3.0 cm; the solvent front<br>travels 12.0 cm. What is its <span class="teal">R<sub>f</sub></span>?</h2>
      <div class="x-chx" style="left:120px;top:350px" data-at="1@0.4" data-fx="pop">spot: <span class="warm">3.0 cm</span></div>
      <div class="x-chx" style="left:420px;top:350px" data-at="1@0.6" data-fx="pop">solvent front: <span class="teal">12.0 cm</span></div>
      <div class="x-chx" style="left:840px;top:350px" data-at="1@0.85" data-fx="pop">R<sub>f</sub> = <span class="warm">?</span></div>
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="640" r="66" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="640" r="66" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 640)"/>
        <text class="x-num" x="960" y="664" text-anchor="middle" font-size="70" font-weight="900">3</text><text x="960" y="760" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="x-ans" data-at="3" data-fx="pop">R<sub>f</sub> = <span class="good">0.25</span>${CHECK}</div>
      ${srow(1, 620, '4', 'The formula', 'R<sub>f</sub> = spot distance ÷ solvent front distance')}
      ${srow(2, 760, '5', 'Divide', '3.0 cm ÷ 12.0 cm = <span class="good">0.25</span>')}`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const w = eo(c.seg(b[3].start + 0.4, b[3].start + 0.9))
      c.$('.x-ans').style.boxShadow = `0 0 ${60 * w}px rgba(76,199,129,${0.45 * w})`
    },
  })

  // ---------- recap ----------
  const m1 = `<svg width="460" height="210" viewBox="0 0 460 210"><path d="M150 20 L222 110 V190 M238 190 V110 L310 20" fill="none" stroke="#c9cee0" stroke-width="5" stroke-linejoin="round"/>
    <path d="M166 26 L230 104 L294 26" fill="none" stroke="#eef0f7" stroke-width="3" stroke-dasharray="8 6"/>
    ${ball(230, 60, 13, 'warm')}${ball(230, 150, 17, 'teal')}${ball(230, 196, 13, 'warm')}
    <text x="330" y="160" font-size="27" font-weight="900" class="f-warm">passes</text><text x="330" y="192" font-size="27" font-weight="900" class="f-warm">through</text></svg>`
  const m2 = `<svg width="460" height="210" viewBox="0 0 460 210">${strip('rcs', 150, 0, 180, 90, S2, 1)}
    <text x="270" y="${spotY(0, 180, 0.27) + 10}" font-size="27" font-weight="900" class="f-pri">low ${rfs()}</text></svg>`
  const m3 = `<svg width="460" height="210" viewBox="0 0 460 210"><clipPath id="x-rf"><circle cx="150" cy="130" r="66"/></clipPath><rect x="80" y="134" width="140" height="70" clip-path="url(#x-rf)" fill="rgba(60,199,188,.18)"/>
    <path d="M136 30 V66 A66 66 0 1 0 164 66 V30" fill="none" stroke="#c9cee0" stroke-width="5"/>${ball(132, 160, 10, 'teal')}${ball(168, 168, 10, 'teal')}${ball(150, 180, 10, 'teal')}
    ${ball(150, 46, 11, 'warm')}<line x1="240" y1="110" x2="240" y2="40" stroke="#f3a764" stroke-width="6" marker-end="url(#mk-warm)"/>
    <text x="262" y="72" font-size="27" font-weight="900" class="f-warm">first out</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${m1}<p>Filtration can’t<br>separate <span class="warm">dissolved</span><br><span class="warm">particles</span></p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${m2}<p>Stronger pull to the<br><span class="pri">stationary phase</span><br>${ARR} <span class="teal">lower R<sub>f</sub></span></p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${m3}<p>Distillation:<br><span class="warm">weaker IMFs</span> (lower bp)<br>comes off first</p></div>`,
  })
})()
