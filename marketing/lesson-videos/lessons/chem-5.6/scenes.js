// Pictures for chem-5.6 "Reaction Energy Profiles". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u5.ts): only the try question has
// values (50, 130 and 20 kJ). The other profiles are drawn without numbers, like the lesson's
// 'energy-profile' diagram (app/src/content/diagrams.tsx), which is the shape used here.
(() => {
  const { clamp, lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .e-ax{stroke:#c9cee0;stroke-width:4;stroke-linecap:round}
    .e-axl{font-size:30px;font-weight:800;fill:var(--muted)!important;text-anchor:middle}
    .e-lvl{stroke:#7d859c;stroke-width:3;stroke-dasharray:10 10}
    .e-curve{fill:none;stroke-linecap:round;stroke-linejoin:round}
    .e-lab{font-size:32px;font-weight:900}
    .e-side{position:absolute;left:1360px;width:470px}
    .e-note{position:absolute;left:1360px;width:490px;height:106px;padding:16px 22px 0 84px;border-radius:22px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .e-note i{position:absolute;left:22px;top:26px;width:46px;height:46px;border-radius:50%}
    .e-note b{display:block;font-size:30px;font-weight:900;line-height:1.15;white-space:nowrap} .e-note span{display:block;font-size:25px;font-weight:700;color:var(--muted);white-space:nowrap}
    .e-big{position:absolute;left:1360px;width:490px;padding:22px 28px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid var(--line)}
    .e-big b{display:block;font-size:36px;font-weight:900;line-height:1.15;white-space:nowrap} .e-big span{display:block;margin-top:8px;font-size:28px;font-weight:700;color:var(--muted);line-height:1.3;white-space:nowrap} .e-big em{font-style:normal;font-weight:900}
    .e-big .ok{position:absolute;right:18px;top:18px;width:54px;height:54px}
    .e-foot{position:absolute;left:0;top:956px;width:1920px;text-align:center;font-size:40px;font-weight:800;color:var(--muted)}
    .e-chip{position:absolute;height:76px;padding:0 30px;border-radius:20px;background:rgba(255,255,255,.05);border:2px solid var(--line);font-size:38px;font-weight:800;line-height:72px;white-space:nowrap}
    .e-rc{top:320px;width:540px;height:560px;text-align:center} .e-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .e-rc svg{display:block;margin:14px auto 0} .e-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const PUR = '#8d8df0', TEAL = '#3cc7bc', WARM = '#f3a764'
  const CHECK = '<svg viewBox="0 0 64 64" style="display:block;width:100%;height:100%"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  /** "Ea" with a lowered a, for SVG text */
  const EA = (extra = '') => `E<tspan dy="8" font-size=".62em">a</tspan><tspan dy="-8">${extra}</tspan>`
  const EAH = 'E<sub>a</sub>'

  /** smooth energy-profile path through (x, y) points: the lesson diagram's cubic per segment */
  const prof = (pts) => {
    let d = `M ${pts[0][0]} ${pts[0][1]}`
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], mx = (x0 + x1) / 2
      d += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`
    }
    return d
  }
  // the main graph: axes at x = 200 and y = 930; reactants plateau 240-420, peak at 720, products 1020-1200
  const XR = [240, 420], XT = 720, XP = [1020, 1200]
  const main = (R, T, P) => prof([[XR[0], R], [XR[1], R], [XT, T], [XP[0], P], [XP[1], P]])
  const R0 = 640, T0 = 400, P0 = 800 // exothermic, no numbers (shape of the lesson diagram)
  const axes = (at = 'in') => `<g data-at="${at}" data-fx="fade">
      <line x1="200" y1="330" x2="200" y2="930" class="e-ax" marker-start="url(#mk-text)"/><line x1="200" y1="930" x2="1250" y2="930" class="e-ax" marker-end="url(#mk-text)"/>
      <text x="720" y="990" class="e-axl">Reaction coordinate</text>
      <text transform="translate(150 640) rotate(-90)" class="e-axl">Potential energy</text></g>`
  /** x on a path -> point (the profile is monotonic in x) */
  function atX(path, x) {
    const L = path.getTotalLength()
    let a = 0, b = L
    for (let i = 0; i < 26; i++) { const m = (a + b) / 2; if (path.getPointAtLength(m).x < x) a = m; else b = m }
    return path.getPointAtLength(a)
  }
  const ring = (cls, color) => `<g class="${cls}" style="opacity:0"><circle r="22" fill="none" stroke="${color}" stroke-width="5"/></g>`
  function pulse(c, cls, x, y, on) {
    const ph = (c.t % 1.5) / 1.5, el = c.$('.' + cls)
    el.setAttribute('transform', `translate(${x} ${y}) scale(${1 + ph * 2.4})`)
    el.style.opacity = on * (1 - ph)
  }
  const dotG = (cls) => `<g class="${cls}" style="opacity:0"><circle r="28" fill="#fff" opacity=".25"/><circle r="15" fill="#fff"/></g>`

  // ---------- intro artwork: two faint profiles at the left and right edges, beside the chips ----------
  const miniI = (x0, flip) => {
    const pts = [[0, 200], [70, 200], [180, 30], [290, 250], [360, 250]].map(([x, y]) => [flip ? x0 - x : x0 + x, 640 + y])
    return `<path d="${prof(pts)}" class="e-curve" stroke="${PUR}" stroke-width="10" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/>`
  }
  EZ.intro = {
    chips: [['1@0.4', 'Activation energy'], ['1@0.6', 'ΔH'], ['1@0.82', 'Forward & reverse']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.22">${miniI(60, false)}${miniI(1860, true)}</svg>`,
    update(c) {
      const p = eio(c.seg(c.sc.start + 0.3, c.sc.start + 2.6))
      c.root.querySelectorAll('path').forEach((el) => el.setAttribute('stroke-dashoffset', 1 - p))
    },
  }

  // ---------- hook: a hike over a mountain pass ----------
  const HL = 700, HP = 380, HR = 820
  const HD = prof([[120, HL], [400, HL], [960, HP], [1480, HR], [1800, HR]])
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Picture it</div><h2 class="h1" data-at="0">A hike over a mountain pass</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <defs><linearGradient id="e-mt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8d8df0" stop-opacity=".35"/><stop offset="1" stop-color="#8d8df0" stop-opacity=".04"/></linearGradient></defs>
        <g data-at="0@0.3" data-fx="fade"><path d="${HD} L 1800 930 L 120 930 Z" fill="url(#e-mt)"/><path class="e-hp e-curve" d="${HD}" fill="none" stroke="${PUR}" stroke-width="8"/></g>
        <text x="250" y="${HL + 70}" text-anchor="middle" class="e-lab f-muted" data-at="1@0.1" data-fx="fade">start valley</text>
        <text x="1640" y="${HR + 70}" text-anchor="middle" class="e-lab f-muted" data-at="1@0.5" data-fx="fade">next valley</text>
        <g data-at="2" data-fx="fade"><text x="1010" y="${HP - 10}" class="e-lab f-pri">pass = transition state</text></g>
        <g data-at="3" data-fx="fade"><line x1="290" y1="${HP}" x2="960" y2="${HP}" class="e-lvl"/>
          <line x1="290" y1="${HL - 10}" x2="290" y2="${HP + 14}" stroke="${WARM}" stroke-width="8" marker-end="url(#mk-warm)"/>
          <text x="316" y="${HP + 80}" class="e-lab f-warm">climb =</text><text x="316" y="${HP + 122}" class="e-lab f-warm">activation energy</text></g>
        <g data-at="4" data-fx="fade"><line x1="400" y1="${HL}" x2="1800" y2="${HL}" class="e-lvl"/>
          <line x1="1740" y1="${HL + 8}" x2="1740" y2="${HR - 12}" stroke="${TEAL}" stroke-width="8" marker-end="url(#mk-teal)"/>
          <text x="1716" y="${HL - 22}" text-anchor="end" class="e-lab f-teal">height difference = ΔH</text></g>
        ${dotG('e-hk')}
      </svg>
      <div class="e-foot" data-at="5" data-fx="up">An energy profile is the same hike, <span class="pri">drawn as a graph</span></div>`,
    update(c) {
      const b = c.b, path = c.$('.e-hp')
      let x = 250
      x = lerp(x, 960, eio(c.seg(b[1].start + 0.2, b[2].start + 0.3)))
      x = lerp(x, 1640, eio(c.seg(b[4].start + 0.6, b[4].end + 0.3)))
      const p = atX(path, x)
      c.$('.e-hk').setAttribute('transform', `translate(${p.x} ${p.y - 26})`)
      c.$('.e-hk').style.opacity = c.seg(b[0].start + 0.6, b[0].start + 1)
    },
  })

  // ---------- reading the profile ----------
  const note = (i, at, color, a, b) => `<div class="e-note" style="top:${380 + i * 124}px" data-at="${at}" data-fx="right"><i style="background:${color}"></i><b>${a}</b><span>${b}</span></div>`
  // a molecule caught halfway: A–B breaking, B–C forming
  const halfway = `<svg width="440" height="120" viewBox="0 0 440 120">
    <line x1="80" y1="56" x2="210" y2="56" stroke="${WARM}" stroke-width="8" stroke-dasharray="12 10"/><line x1="230" y1="56" x2="360" y2="56" stroke="${TEAL}" stroke-width="8" stroke-dasharray="12 10"/>
    ${ball(80, 56, 32, 'gray')}${ball(220, 56, 32, 'pur')}${ball(360, 56, 32, 'gray')}
    <text x="140" y="112" text-anchor="middle" font-size="24" font-weight="900" class="f-warm">old bond</text><text x="300" y="112" text-anchor="middle" font-size="24" font-weight="900" class="f-teal">new bond</text></svg>`
  EZ.scene('profile', {
    html: `<svg class="full" viewBox="0 0 1920 1080">${axes('0@0.3')}
        <path d="${main(R0, T0, P0)}" class="e-curve" stroke="${PUR}" stroke-width="9" data-at="4" data-fx="draw" data-dur="2.2"/>
        <path class="e-mp" d="${main(R0, T0, P0)}" fill="none" stroke="none"/>
        <text x="${XR[0] + 4}" y="${R0 - 26}" class="e-lab" data-at="4@0.15" data-fx="fade">reactants</text>
        <text x="${XP[0] + 10}" y="${P0 + 50}" class="e-lab" data-at="4@0.6" data-fx="fade">products</text>
        <text x="${XT}" y="${T0 - 44}" text-anchor="middle" class="e-lab f-pri" data-at="6" data-fx="fade">transition state</text>
        ${ring('e-pr', PUR)}${dotG('e-pd')}
      </svg>
      <div class="kicker" style="left:1360px;top:150px" data-at="in" data-fx="right">Energy profile</div>
      <div style="position:absolute;left:1360px;top:212px;width:480px;font-size:50px;font-weight:900;line-height:1.08" data-at="0@0.2" data-fx="right">Reading<br>the graph</div>
      ${note(0, '2', '#7d859c', 'x-axis: reaction coordinate', 'progress from reactants to products')}
      ${note(1, '3', '#7d859c', 'y-axis: potential energy', 'higher = more energy')}
      ${note(2, '6', PUR, 'Transition state', 'the highest-energy point')}
      <div class="card" style="left:1360px;top:752px;width:490px;height:190px;text-align:center" data-at="7" data-fx="right">
        <div style="padding-top:14px">${halfway}</div><div style="font-size:24px;font-weight:800;color:var(--muted)">partly broken &nbsp;·&nbsp; partly formed</div></div>`,
    update(c) {
      const b = c.b, path = c.$('.e-mp')
      const x = lerp(XR[0], XT, eio(c.seg(b[5].start + 0.1, b[5].end)))
      const p = atX(path, x)
      c.$('.e-pd').setAttribute('transform', `translate(${p.x} ${p.y})`)
      c.$('.e-pd').style.opacity = c.seg(b[5].start, b[5].start + 0.3)
      pulse(c, 'e-pr', XT, T0, c.seg(b[6].start, b[6].start + 0.3))
    },
  })

  // ---------- measuring Ea and ΔH (then the products rise: endothermic) ----------
  const PE = 480 // products level in the endothermic version
  EZ.scene('measure', {
    html: `<svg class="full" viewBox="0 0 1920 1080">${axes()}
        <path class="e-mc e-curve" d="${main(R0, T0, P0)}" stroke="${PUR}" stroke-width="9"/>
        <text x="${XR[0] + 4}" y="${R0 - 26}" class="e-lab">reactants</text>
        <text class="e-mpl e-lab" x="${XP[0] + 10}" y="${P0 + 50}">products</text>
        <text x="${XT}" y="${T0 - 44}" text-anchor="middle" class="e-lab f-pri">transition state</text>
        <g data-at="1@0.4" data-fx="fade"><line x1="400" y1="${T0}" x2="${XT}" y2="${T0}" class="e-lvl"/>
          <line x1="400" y1="${R0 - 8}" x2="400" y2="${T0 + 14}" stroke="${WARM}" stroke-width="8" marker-end="url(#mk-warm)"/>
          <text x="382" y="${(R0 + T0) / 2 + 14}" text-anchor="end" font-size="44" font-weight="900" class="f-warm">${EA()}</text></g>
        <g data-at="3@0.4" data-fx="fade"><line x1="${XR[1]}" y1="${R0}" x2="1240" y2="${R0}" class="e-lvl"/>
          <line class="e-dh" x1="1215" x2="1215" stroke="${TEAL}" stroke-width="8" marker-end="url(#mk-teal)"/>
          <text class="e-dht f-teal" x="1232" font-size="44" font-weight="900" style="fill:var(--accent)">ΔH</text></g>
        ${ring('e-mr', WARM)}
      </svg>
      <div class="kicker" style="left:1360px;top:150px" data-at="in" data-fx="right">Measure it</div>
      <div style="position:absolute;left:1360px;top:212px;width:480px;font-size:50px;font-weight:900;line-height:1.08" data-at="0" data-fx="right">Two heights<br>on one graph</div>
      <div class="e-big" style="top:380px;border-color:rgba(243,167,100,.7)" data-at="1" data-fx="right"><b class="warm">${EAH} = TS − reactants</b><span>TS = transition state<br>the climb from the reactants</span></div>
      <div class="e-big" style="top:584px;border-color:rgba(60,199,188,.7)" data-at="3" data-fx="right"><b class="teal" style="font-size:31px">ΔH = products − reactants</b><span>compares the two ends</span></div>
      <div class="e-big" style="top:750px" data-at="4" data-out="5" data-fx="right"><b>ΔH <em class="teal">negative</em></b><span>products lower: <em style="color:var(--text)">exothermic</em></span></div>
      <div class="e-big" style="top:750px" data-at="5+0.3" data-fx="right"><b>ΔH <em class="warm">positive</em></b><span>products higher: <em style="color:var(--text)">endothermic</em></span></div>`,
    update(c) {
      const b = c.b
      const P = lerp(P0, PE, eio(c.seg(b[5].start + 0.2, b[5].start + 1.6)))
      c.$('.e-mc').setAttribute('d', main(R0, T0, P))
      c.$('.e-mpl').setAttribute('y', P + 50)
      const dh = c.$('.e-dh'), up = P < R0
      dh.setAttribute('y1', R0 + (up ? -8 : 8)); dh.setAttribute('y2', P + (up ? 12 : -12))
      dh.style.opacity = Math.abs(P - R0) > 40 ? 1 : 0
      c.$('.e-dht').setAttribute('y', (R0 + P) / 2 + 16)
      pulse(c, 'e-mr', XT, T0, c.seg(b[2].start, b[2].start + 0.3) * (1 - c.seg(b[3].start, b[3].start + 0.3)))
    },
  })

  // ---------- forward vs. reverse ----------
  EZ.scene('reverse', {
    html: `<svg class="full" viewBox="0 0 1920 1080">${axes()}
        <path class="e-rp e-curve" d="${main(R0, T0, P0)}" stroke="${PUR}" stroke-width="9"/>
        <text x="${XR[0] + 4}" y="${R0 - 26}" class="e-lab">reactants</text>
        <text x="${XP[0] + 10}" y="${P0 + 50}" class="e-lab">products</text>
        <text x="${XT}" y="${T0 - 44}" text-anchor="middle" class="e-lab f-pri">transition state</text>
        <line x1="400" y1="${T0}" x2="1150" y2="${T0}" class="e-lvl"/>
        <line x1="400" y1="${R0 - 8}" x2="400" y2="${T0 + 14}" stroke="${WARM}" stroke-width="8" marker-end="url(#mk-warm)"/>
        <text x="382" y="${(R0 + T0) / 2 + 14}" text-anchor="end" font-size="40" font-weight="900" class="f-warm">${EA()}</text>
        <text x="382" y="${(R0 + T0) / 2 + 52}" text-anchor="end" font-size="26" font-weight="800" class="f-warm">forward</text>
        <g data-at="2@0.4" data-fx="fade"><line x1="1150" y1="${P0 - 8}" x2="1150" y2="${T0 + 14}" stroke="${TEAL}" stroke-width="8" marker-end="url(#mk-teal)"/>
          <text x="1170" y="${(P0 + T0) / 2 + 14}" font-size="40" font-weight="900" class="f-teal">${EA()}</text>
          <text x="1170" y="${(P0 + T0) / 2 + 52}" font-size="26" font-weight="800" class="f-teal">reverse</text></g>
        ${ring('e-sr1', WARM)}${ring('e-sr2', TEAL)}${dotG('e-rd')}
      </svg>
      <div class="kicker" style="left:1360px;top:150px" data-at="in" data-fx="right">Forward vs. reverse</div>
      <div style="position:absolute;left:1360px;top:212px;width:480px;font-size:50px;font-weight:900;line-height:1.08" data-at="0" data-fx="right">Run it<br>backwards</div>
      <div class="e-big" style="top:380px;border-color:rgba(60,199,188,.7)" data-at="2" data-fx="right"><b class="teal">${EAH}(reverse) =</b><b class="teal">TS − products</b></div>
      <div class="e-big" style="top:560px;height:190px" data-at="4" data-fx="right"><b>Exothermic</b>
        <svg width="430" height="110" viewBox="0 0 430 110" style="display:block;margin-top:8px">
          <text x="0" y="36" font-size="26" font-weight="800" class="f-warm">forward</text><rect x="120" y="16" width="${240 * 0.75}" height="26" rx="13" fill="${WARM}"/>
          <text x="0" y="90" font-size="26" font-weight="800" class="f-teal">reverse</text><g data-at="5" data-fx="grow"><rect x="120" y="70" width="${400 * 0.75}" height="26" rx="13" fill="${TEAL}"/></g></svg></div>
      <div class="e-big" style="top:780px" data-at="6" data-fx="right"><b>Endothermic</b><span>the reverse ${EAH} is <em class="teal">smaller</em></span></div>`,
    update(c) {
      const b = c.b, path = c.$('.e-rp')
      const x = lerp(XP[1], XR[0], eio(c.seg(b[1].start + 0.3, b[1].end + 0.3)))
      const p = atX(path, x)
      c.$('.e-rd').setAttribute('transform', `translate(${p.x} ${p.y})`)
      c.$('.e-rd').style.opacity = c.seg(b[1].start, b[1].start + 0.3) * (1 - c.seg(b[2].start, b[2].start + 0.4))
      const s3 = c.seg(b[3].start, b[3].start + 0.3) * (1 - c.seg(b[4].start, b[4].start + 0.3))
      pulse(c, 'e-sr1', 400, R0, s3); pulse(c, 'e-sr2', 1150, P0, s3)
    },
  })

  // ---------- the trap: start from the right level ----------
  const small = (R, T, P, from, color, label) => {
    const W = 600, d = prof([[40, R], [130, R], [300, T], [470, P], [560, P]])
    const sx = from === 'R' ? 90 : 510, sy = from === 'R' ? R : P
    return `<svg width="${W}" height="300" viewBox="0 0 ${W} 300">
      <path d="${d}" class="e-curve" stroke="${PUR}" stroke-width="7"/>
      <line x1="${sx}" y1="${T}" x2="300" y2="${T}" class="e-lvl" style="stroke-width:2.5"/>
      <line x1="${sx}" y1="${sy - 6}" x2="${sx}" y2="${T + 12}" stroke="${color}" stroke-width="7" marker-end="url(#mk-${color === WARM ? 'warm' : 'teal'})"/>
      <circle cx="${sx}" cy="${sy}" r="14" fill="${color}"/>
      <text x="${from === 'R' ? 50 : 560}" y="${sy + 50}" text-anchor="${from === 'R' ? 'start' : 'end'}" font-size="28" font-weight="900" style="fill:${color}">${label}</text></svg>`
  }
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Watch out</div><h2 class="h1" data-at="1">Start from the right level</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:420px" data-at="2"><h3><span class="warm">Forward</span> ${EAH}</h3>
        <div style="position:absolute;left:105px;top:100px">${small(150, 40, 230, 'R', WARM, 'start: reactants')}</div></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:420px" data-at="3"><h3><span class="teal">Reverse</span> ${EAH}</h3>
        <div style="position:absolute;left:105px;top:100px">${small(150, 40, 230, 'P', TEAL, 'start: products')}</div></div>
      <div class="e-chip" style="left:120px;top:760px;border-color:rgba(243,167,100,.6)" data-at="5" data-fx="pop"><span class="warm">${EAH}</span> reaches up to the peak</div>
      <div class="e-chip" style="left:990px;top:760px;border-color:rgba(60,199,188,.6)" data-at="5@0.45" data-fx="pop"><span class="teal">ΔH</span> = products − reactants</div>
      <div class="e-foot" style="top:880px" data-at="4" data-fx="up">Don’t mix up the two arrows</div>`,
  })

  // ---------- why it matters: Ea and the rate constant ----------
  // a small profile in a card, with balls that try to get over the barrier
  const RW = 680, RB = 230
  const rprof = (T) => prof([[30, RB], [140, RB], [340, T], [540, 270], [650, 270]])
  const rballs = (cls) => [0, 1, 2, 3].map((i) => `<g class="${cls}${i}">${ball(0, 0, 16, ['teal', 'pur', 'warm', 'gold'][i])}</g>`).join('')
  const thermo = (x, y, k, cls) => `<g transform="translate(${x} ${y}) scale(${k})"><rect x="-16" y="0" width="32" height="160" rx="16" fill="rgba(255,255,255,.06)" stroke="#c9cee0" stroke-width="4"/>
    <rect class="${cls}" x="-8" y="90" width="16" height="90" rx="8" fill="#f0707a"/><circle cx="0" cy="182" r="28" fill="#f0707a" stroke="#c9cee0" stroke-width="4"/></g>`
  EZ.scene('rate', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="0">${EAH} and the rate constant</h2>
      <div class="card" style="left:120px;top:290px;width:810px;height:420px" data-at="1"><h3>Small ${EAH}</h3>
        <svg style="position:absolute;left:60px;top:90px" width="${RW}" height="300" viewBox="0 0 ${RW} 300"><path class="e-ra e-curve" d="${rprof(130)}" fill="none" stroke="${PUR}" stroke-width="7"/>${rballs('e-ba')}</svg>
        <div style="position:absolute;left:40px;bottom:26px;font-size:36px;font-weight:900" data-at="2@0.7" data-fx="fade">many get over: <span class="good">large k</span></div></div>
      <div class="card" style="left:990px;top:290px;width:810px;height:420px" data-at="1@0.3"><h3>Large ${EAH}</h3>
        <svg style="position:absolute;left:60px;top:90px" width="${RW}" height="300" viewBox="0 0 ${RW} 300"><path class="e-rb e-curve" d="${rprof(30)}" fill="none" stroke="${PUR}" stroke-width="7"/>${rballs('e-bb')}</svg>
        <div style="position:absolute;left:40px;bottom:26px;font-size:36px;font-weight:900" data-at="3@0.6" data-fx="fade">few get over: <span class="bad">slow</span></div></div>
      <div class="card" style="left:120px;top:740px;width:810px;height:180px" data-at="4"><svg style="position:absolute;left:36px;top:12px" width="80" height="160" viewBox="-40 -6 80 226">${thermo(0, 0, 0.85, 'e-merc')}</svg>
        <div style="position:absolute;left:140px;top:34px;font-size:38px;font-weight:900;line-height:1.3">Raise the temperature:<br><span class="warm">k increases</span> for every reaction</div></div>
      <div class="card" style="left:990px;top:740px;width:810px;height:180px" data-at="5"><div style="position:absolute;left:40px;top:28px;font-size:30px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)">Arrhenius equation</div>
        <div style="position:absolute;left:40px;top:80px;font-size:40px;font-weight:900;white-space:nowrap">higher <span class="warm">T</span> or lower <span class="pri">${EAH}</span> ${ARR} <span class="good">larger k</span></div></div>
      <div class="e-foot" style="top:950px;font-size:34px" data-at="6" data-fx="up">Qualitative only: no Arrhenius calculations on the AP® exam</div>`,
    update(c) {
      const b = c.b
      // left: three of four cross; right: one of four crosses, the rest roll back
      const run = (pre, pathCls, s0, over) => {
        const path = c.$('.' + pathCls)
        for (let i = 0; i < 4; i++) {
          const t0 = s0 + i * 0.45, p = c.seg(t0, t0 + 2.4)
          let x
          if (over[i]) x = lerp(85, 600, eio(p))
          else { const q = Math.sin(Math.PI * clamp(p * 1.15)); x = 85 + 190 * q }
          const pt = atX(path, x)
          c.$(`.${pre}${i}`).setAttribute('transform', `translate(${pt.x + (over[i] ? -i * 14 : i * 14) * (p >= 1 ? 1 : 0)} ${pt.y - 18})`)
        }
      }
      run('e-ba', 'e-ra', b[2].start + 0.2, [1, 1, 0, 1])
      run('e-bb', 'e-rb', b[3].start + 0.1, [0, 0, 1, 0])
      const m = eio(c.seg(b[4].start + 0.3, b[4].start + 1.4)), y = lerp(90, 25, m)
      c.$('.e-merc').setAttribute('y', y); c.$('.e-merc').setAttribute('height', 180 - y)
    },
  })

  // ---------- try it: 50, 130, 20 kJ ----------
  const KY = (e) => 930 - e * 4.2 // kJ -> px for this graph only
  const TR = KY(50), TT = KY(130), TP = KY(20)
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:58px" data-at="1">What is ${EAH} for the <span class="warm">forward</span> reaction?</h2>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="1@0.2" data-fx="fade">${axes()}
        <path d="${main(TR, TT, TP)}" class="e-curve" stroke="${PUR}" stroke-width="9"/></g>
        <text x="${XR[0] + 4}" y="${TR + 52}" class="e-lab" data-at="1@0.2" data-fx="fade">reactants: <tspan class="f-gold">50 kJ</tspan></text>
        <text x="${XT}" y="${TT - 36}" text-anchor="middle" class="e-lab" data-at="1@0.4" data-fx="fade">transition state: <tspan class="f-gold">130 kJ</tspan></text>
        <text x="${XP[0] - 20}" y="${TP + 50}" class="e-lab" data-at="1@0.55" data-fx="fade">products: <tspan class="f-gold">20 kJ</tspan></text>
        <g data-at="4" data-fx="fade"><line x1="330" y1="${TT}" x2="${XT}" y2="${TT}" class="e-lvl"/>
          <line x1="330" y1="${TR - 8}" x2="330" y2="${TT + 14}" stroke="${WARM}" stroke-width="8" marker-end="url(#mk-warm)"/>
          <text x="312" y="${(TR + TT) / 2 + 14}" text-anchor="end" font-size="40" font-weight="900" class="f-warm">80</text></g>
        <g data-at="5" data-fx="fade"><line x1="${XR[1]}" y1="${TR}" x2="1240" y2="${TR}" class="e-lvl"/>
          <line x1="1215" y1="${TR + 8}" x2="1215" y2="${TP - 12}" stroke="${TEAL}" stroke-width="8" marker-end="url(#mk-teal)"/></g>
        <g data-at="6" data-fx="fade"><line x1="${XT}" y1="${TT}" x2="1130" y2="${TT}" class="e-lvl"/>
          <line x1="1130" y1="${TP - 8}" x2="1130" y2="${TT + 14}" stroke="${PUR}" stroke-width="8" marker-end="url(#mk-pri)"/></g>
      </svg>
      <svg class="full e-count" viewBox="0 0 1920 1080"><circle cx="1600" cy="560" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="e-arc" cx="1600" cy="560" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 1600 560)"/>
        <text class="e-num" x="1600" y="586" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="1600" y="690" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="e-big e-win" style="top:330px;border-color:rgba(76,199,129,.8)" data-at="3" data-fx="right"><div class="ok">${CHECK}</div><b class="good">80 kJ</b><span data-at="4" data-fx="fade">${EAH} = TS − reactants<br><em style="color:var(--text)">130 − 50 = 80 kJ</em></span></div>
      <div class="e-big" style="top:560px;border-color:rgba(60,199,188,.7)" data-at="5" data-fx="right"><b class="teal">ΔH = 20 − 50</b><span><em style="color:var(--text)">= −30 kJ</em>: exothermic</span></div>
      <div class="e-big" style="top:750px;border-color:rgba(141,141,240,.7)" data-at="6" data-fx="right"><b class="pri">${EAH}(reverse) = 130 − 20</b><span><em style="color:var(--text)">= 110 kJ</em>: larger</span></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.e-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.e-arc').setAttribute('stroke-dashoffset', p)
      c.$('.e-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.3, b[3].start + 0.8))
      c.$('.e-win').style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.45 * win})`
    },
  })

  // ---------- recap ----------
  const rc = (arrows) => `<svg width="440" height="210" viewBox="0 0 440 210"><path d="${prof([[20, 110], [80, 110], [210, 30], [340, 170], [420, 170]])}" class="e-curve" stroke="${PUR}" stroke-width="7"/>${arrows}</svg>`
  const r1 = rc(`<line x1="60" y1="30" x2="210" y2="30" class="e-lvl" style="stroke-width:2.5"/><line x1="60" y1="104" x2="60" y2="42" stroke="${WARM}" stroke-width="7" marker-end="url(#mk-warm)"/>`)
  const r2 = rc(`<line x1="80" y1="110" x2="420" y2="110" class="e-lvl" style="stroke-width:2.5"/><line x1="400" y1="116" x2="400" y2="158" stroke="${TEAL}" stroke-width="7" marker-end="url(#mk-teal)"/>`)
  const r3 = rc(`<line x1="60" y1="30" x2="380" y2="30" class="e-lvl" style="stroke-width:2.5"/><line x1="60" y1="104" x2="60" y2="42" stroke="${WARM}" stroke-width="7" marker-end="url(#mk-warm)"/><line x1="380" y1="164" x2="380" y2="42" stroke="${TEAL}" stroke-width="7" marker-end="url(#mk-teal)"/>`)
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card e-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p><span class="warm">${EAH}</span> =<br>transition state<br>− reactants</p></div>
      <div class="card e-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p><span class="teal">ΔH</span> = products − reactants<br>negative: <span class="teal">exothermic</span><br>positive: <span class="warm">endothermic</span></p></div>
      <div class="card e-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Exothermic:<br>the <span class="teal">reverse ${EAH}</span> is<br>larger than the <span class="warm">forward</span></p></div>`,
  })
})()
