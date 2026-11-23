// Pictures for chem-5.10 "Multistep Energy Profiles". One EZ.scene per scene id in script.mjs.
// Every fact is the lesson's own (app/src/content/chem/u5.ts, book.ts). The main picture is the
// lesson's 'multistep-profile' diagram (app/src/content/diagrams.tsx): two humps, step 1 the
// larger climb. The only numbers shown are the quick check's 90 and 30 kJ/mol, and the two
// climbs in that scene are drawn in that 3 : 1 ratio. Other profiles carry no numbers.
(() => {
  const { clamp, lerp, eio, eo, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .m-ax{stroke:#c9cee0;stroke-width:4;stroke-linecap:round}
    .m-axl{font-size:30px;font-weight:800;fill:var(--muted)!important;text-anchor:middle}
    .m-lvl{stroke:#7d859c;stroke-width:3;stroke-dasharray:10 10}
    .m-curve{fill:none;stroke-linecap:round;stroke-linejoin:round}
    .m-lab{font-size:32px;font-weight:900}
    .m-note{position:absolute;left:1360px;width:490px;height:106px;padding:16px 22px 0 84px;border-radius:22px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .m-note i{position:absolute;left:22px;top:26px;width:46px;height:46px;border-radius:50%}
    .m-note b{display:block;font-size:30px;font-weight:900;line-height:1.15;white-space:nowrap} .m-note span{display:block;font-size:25px;font-weight:700;color:var(--muted);white-space:nowrap}
    .m-big{position:absolute;left:1360px;width:490px;padding:22px 28px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid var(--line)}
    .m-big b{display:block;font-size:34px;font-weight:900;line-height:1.2;white-space:nowrap} .m-big span{display:block;margin-top:8px;font-size:27px;font-weight:700;color:var(--muted);line-height:1.3;white-space:nowrap} .m-big em{font-style:normal;font-weight:900}
    .m-big .ok{position:absolute;right:18px;top:18px;width:54px;height:54px}
    .m-foot{position:absolute;left:0;top:930px;width:1920px;text-align:center;font-size:40px;font-weight:800;color:var(--muted)}
    .m-row{position:absolute;left:40px;height:90px;font-size:38px;font-weight:900;line-height:90px;white-space:nowrap}
    .m-row i{display:inline-block;width:26px;height:26px;margin-right:26px;border-radius:50%;vertical-align:middle}
    .m-tile{position:absolute;width:350px;height:150px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line)}
    .m-tile .l{position:absolute;left:16px;top:16px;width:48px;height:48px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:26px;font-weight:900;line-height:44px;text-align:center;color:var(--muted)}
    .m-tile p{position:absolute;left:80px;top:24px;margin:0;font-size:33px;font-weight:900;line-height:1.3;white-space:nowrap}
    .m-tile .ok{position:absolute;right:12px;top:12px;width:50px;height:50px;opacity:0}
    .m-rc{top:320px;width:540px;height:560px;text-align:center} .m-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .m-rc svg{display:block;margin:14px auto 0} .m-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const PUR = '#8d8df0', TEAL = '#3cc7bc', WARM = '#f3a764', BAD = '#f0707a', GOOD = '#4cc781', GRAY = '#7d859c'
  const CHECK = '<svg viewBox="0 0 64 64" style="display:block;width:100%;height:100%"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  /** "Ea" with a lowered a, for SVG text */
  const EA = 'E<tspan dy="8" font-size=".62em">a</tspan>'
  const EAH = 'E<sub>a</sub>'
  /** "TS" with a lowered step number, for SVG text */
  const TS = (n) => `TS<tspan dy="8" font-size=".62em">${n}</tspan>`

  /** smooth energy-profile path through (x, y) points: the lesson diagram's cubic per segment */
  const prof = (pts) => {
    let d = `M ${pts[0][0]} ${pts[0][1]}`
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], mx = (x0 + x1) / 2
      d += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`
    }
    return d
  }
  // the main graph: axes at x = 200 and y = 930; reactants 240-380, TS1 at 560, valley at 760, TS2 at 950, products 1100-1220
  const X1 = 560, XI = 760, X2 = 950
  const two = (R, T1, I, T2, P) => prof([[240, R], [380, R], [X1, T1], [XI, I], [X2, T2], [1100, P], [1220, P]])
  const R0 = 680, A0 = 360, I0 = 600, B0 = 493, P0 = 820 // step 1 climb 320, step 2 climb 107 (3 : 1)
  const axes = (at = 'in') => `<g data-at="${at}" data-fx="fade">
      <line x1="200" y1="300" x2="200" y2="930" class="m-ax" marker-start="url(#mk-text)"/><line x1="200" y1="930" x2="1250" y2="930" class="m-ax" marker-end="url(#mk-text)"/>
      <text x="720" y="990" class="m-axl">Reaction coordinate</text>
      <text transform="translate(150 615) rotate(-90)" class="m-axl">Potential energy</text></g>`
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
  const side = (kick, title, cls = '') => `<div class="kicker ${cls}" style="left:1360px;top:150px" data-at="in" data-fx="right">${kick}</div>
      <div style="position:absolute;left:1360px;top:212px;width:480px;font-size:50px;font-weight:900;line-height:1.08" data-at="0@0.2" data-fx="right">${title}</div>`
  /** a vertical arrow from level y0 up to level y1 at x */
  const up = (x, y0, y1, color, mk) => `<line x1="${x}" y1="${y0 - 8}" x2="${x}" y2="${y1 + 14}" stroke="${color}" stroke-width="8" marker-end="url(#mk-${mk})"/>`

  // ---------- intro artwork: two faint two-hump profiles at the left and right edges, beside the chips ----------
  const miniI = (x0, flip) => {
    const pts = [[0, 190], [50, 190], [120, 40], [190, 140], [260, 90], [330, 250], [370, 250]].map(([x, y]) => [flip ? x0 - x : x0 + x, 640 + y])
    return `<path d="${prof(pts)}" class="m-curve" stroke="${PUR}" stroke-width="10" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/>`
  }
  EZ.intro = {
    chips: [['1@0.62', 'Steps'], ['1@0.74', 'Intermediates'], ['1@0.88', 'Slow step']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.22">${miniI(50, false)}${miniI(1870, true)}</svg>`,
    update(c) {
      const p = eio(c.seg(c.sc.start + 0.3, c.sc.start + 2.6))
      c.root.querySelectorAll('path').forEach((el) => el.setAttribute('stroke-dashoffset', 1 - p))
    },
  }

  // ---------- hook: one hump becomes two ----------
  const HR = 720, HA = 430, HI = 650, HB = 540, HP = 840
  const H2 = prof([[160, HR], [380, HR], [640, HA], [900, HI], [1160, HB], [1480, HP], [1760, HP]])
  const H1 = prof([[160, HR], [380, HR], [900, HA], [1480, HP], [1760, HP]])
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Two steps</div><h2 class="h1" data-at="0">Two steps, two humps</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <path d="${H1}" class="m-curve" stroke="${GRAY}" stroke-width="7" stroke-dasharray="18 14" data-at="1" data-out="2" data-fx="fade"/>
        <text x="900" y="${HA - 34}" text-anchor="middle" class="m-lab f-muted" data-at="1@0.3" data-out="2" data-fx="fade">one hump?</text>
        <path d="${H2}" class="m-curve" stroke="${PUR}" stroke-width="9" data-at="2" data-fx="draw" data-dur="1.6"/>
        <text x="640" y="${HA - 34}" text-anchor="middle" class="m-lab f-pri" data-at="2@0.5" data-fx="fade">step 1</text>
        <text x="1160" y="${HB - 34}" text-anchor="middle" class="m-lab f-pri" data-at="2@0.8" data-fx="fade">step 2</text>
        <text x="900" y="${HI + 58}" text-anchor="middle" class="m-lab f-warm" data-at="3@0.45" data-fx="fade">intermediate</text>
        <g data-at="3@0.65" data-fx="fade"><line x1="360" y1="${HA}" x2="640" y2="${HA}" class="m-lvl"/>${up(360, HR, HA, WARM, 'warm')}
          <text x="340" y="${(HR + HA) / 2 + 12}" text-anchor="end" class="m-lab f-warm">slow step</text></g>
        <g data-at="4@0.3" data-fx="fade"><line x1="1340" y1="${HR}" x2="1720" y2="${HR}" class="m-lvl"/>
          <line x1="1690" y1="${HR + 8}" x2="1690" y2="${HP - 14}" stroke="${TEAL}" stroke-width="8" marker-end="url(#mk-teal)"/>
          <text x="1670" y="${(HR + HP) / 2 + 14}" text-anchor="end" font-size="40" font-weight="900" class="f-teal">ΔH</text></g>
        ${ring('m-hr', WARM)}
      </svg>`,
    update(c) {
      const b = c.b
      pulse(c, 'm-hr', 900, HI, c.seg(b[3].start + 0.8, b[3].start + 1.1) * (1 - c.seg(b[4].start, b[4].start + 0.3)))
    },
  })

  // ---------- walking the two humps ----------
  const note = (i, at, color, a, s) => `<div class="m-note" style="top:${380 + i * 124}px" data-at="${at}" data-fx="right"><i style="background:${color}"></i><b>${a}</b><span>${s}</span></div>`
  const mainLabels = (ts = true) => `
        <text x="244" y="${R0 + 52}" class="m-lab">reactants</text>
        <text x="1110" y="${P0 + 52}" class="m-lab">products</text>
        <text x="${XI}" y="${I0 + 54}" text-anchor="middle" class="m-lab f-warm">intermediate</text>
        ${ts ? `<text x="${X1}" y="${A0 - 34}" text-anchor="middle" class="m-lab f-pri">${TS(1)}</text><text x="${X2}" y="${B0 - 34}" text-anchor="middle" class="m-lab f-pri">${TS(2)}</text>` : ''}`
  EZ.scene('humps', {
    html: `<svg class="full" viewBox="0 0 1920 1080">${axes('0@0.2')}
        <path class="m-wp m-curve" d="${two(R0, A0, I0, B0, P0)}" stroke="${PUR}" stroke-width="9" data-at="0@0.4" data-fx="fade"/>
        <text x="244" y="${R0 + 52}" class="m-lab" data-at="1" data-fx="fade">reactants</text>
        <text x="${X1}" y="${A0 - 34}" text-anchor="middle" class="m-lab f-pri" data-at="1@0.7" data-fx="fade">${TS(1)}</text>
        <text x="${XI}" y="${I0 + 54}" text-anchor="middle" class="m-lab f-warm" data-at="7" data-fx="fade">intermediate</text>
        <text x="${X2}" y="${B0 - 34}" text-anchor="middle" class="m-lab f-pri" data-at="3@0.6" data-fx="fade">${TS(2)}</text>
        <text x="1110" y="${P0 + 52}" class="m-lab" data-at="4@0.5" data-fx="fade">products</text>
        <g data-at="5@0.3" data-fx="fade"><line x1="250" y1="262" x2="750" y2="262" stroke="${PUR}" stroke-width="5" stroke-linecap="round"/><line x1="250" y1="250" x2="250" y2="274" stroke="${PUR}" stroke-width="5"/><line x1="750" y1="250" x2="750" y2="274" stroke="${PUR}" stroke-width="5"/>
          <text x="500" y="240" text-anchor="middle" class="m-lab f-pri">step 1</text></g>
        <g data-at="5@0.6" data-fx="fade"><line x1="770" y1="262" x2="1210" y2="262" stroke="${TEAL}" stroke-width="5" stroke-linecap="round"/><line x1="770" y1="250" x2="770" y2="274" stroke="${TEAL}" stroke-width="5"/><line x1="1210" y1="250" x2="1210" y2="274" stroke="${TEAL}" stroke-width="5"/>
          <text x="990" y="240" text-anchor="middle" class="m-lab f-teal">step 2</text></g>
        ${ring('m-r1', PUR)}${ring('m-r2', PUR)}${ring('m-r3', WARM)}${dotG('m-wd')}
      </svg>
      ${side('Humps & valleys', 'Reading<br>two humps')}
      ${note(0, '5', PUR, 'Hump = one step', 'its own transition state')}
      ${note(1, '6', PUR, '2 humps = 2 steps', 'count the humps')}
      ${note(2, '7', WARM, 'Valley = intermediate', 'made, then used up')}
      ${note(3, '9', GRAY, 'TS: top of a hump', 'intermediate: in a valley')}`,
    update(c) {
      const b = c.b, path = c.$('.m-wp')
      let x = 300
      x = lerp(x, X1, eio(c.seg(b[1].start + 0.2, b[1].end)))
      x = lerp(x, XI, eio(c.seg(b[2].start + 0.1, b[2].end)))
      x = lerp(x, X2, eio(c.seg(b[3].start + 0.1, b[3].end)))
      x = lerp(x, 1160, eio(c.seg(b[4].start + 0.1, b[4].end)))
      const p = atX(path, x)
      c.$('.m-wd').setAttribute('transform', `translate(${p.x} ${p.y})`)
      c.$('.m-wd').style.opacity = c.seg(b[1].start, b[1].start + 0.3) * (1 - c.seg(b[5].start, b[5].start + 0.4))
      const hp = c.seg(b[5].start + 0.4, b[5].start + 0.7) * (1 - c.seg(b[7].start, b[7].start + 0.3))
      pulse(c, 'm-r1', X1, A0, hp); pulse(c, 'm-r2', X2, B0, c.seg(b[6].start, b[6].start + 0.3) * (1 - c.seg(b[7].start, b[7].start + 0.3)))
      pulse(c, 'm-r3', XI, I0, c.seg(b[7].start, b[7].start + 0.3) * (1 - c.seg(b[9].start, b[9].start + 0.3)))
    },
  })

  // ---------- which step is slow ----------
  EZ.scene('slow', {
    html: `<svg class="full" viewBox="0 0 1920 1080">${axes()}
        <path d="${two(R0, A0, I0, B0, P0)}" class="m-curve" stroke="${PUR}" stroke-width="9"/>${mainLabels()}
        <g data-at="2@0.3" data-fx="fade"><line x1="350" y1="${A0}" x2="${X1}" y2="${A0}" class="m-lvl"/>${up(350, R0, A0, WARM, 'warm')}
          <text x="332" y="${(R0 + A0) / 2 + 4}" text-anchor="end" font-size="40" font-weight="900" class="f-warm">${EA}</text>
          <text x="332" y="${(R0 + A0) / 2 + 42}" text-anchor="end" font-size="26" font-weight="800" class="f-warm">step 1</text></g>
        <g data-at="3@0.3" data-fx="fade"><line x1="${XI}" y1="${I0}" x2="1060" y2="${I0}" class="m-lvl"/><line x1="${X2}" y1="${B0}" x2="1060" y2="${B0}" class="m-lvl"/>${up(1040, I0, B0, TEAL, 'teal')}
          <text x="1066" y="${(I0 + B0) / 2 + 4}" font-size="40" font-weight="900" class="f-teal">${EA}</text>
          <text x="1066" y="${(I0 + B0) / 2 + 40}" font-size="26" font-weight="800" class="f-teal">step 2</text></g>
        ${ring('m-sr', GOOD)}
      </svg>
      ${side('The slow step', 'Compare<br>the climbs', 'warm')}
      <div class="m-big" style="top:380px" data-at="4" data-fx="right"><b>Larger ${EAH} = slower</b><span>the rate-determining step</span></div>
      <div class="m-big" style="top:560px" data-at="6" data-fx="right"><b><em style="color:var(--warm)">Step 1:</em> 90 kJ/mol</b><b><em style="color:var(--accent)">Step 2:</em> 30 kJ/mol</b></div>
      <div class="m-big m-sw" style="top:740px;border-color:rgba(76,199,129,.8)" data-at="7" data-fx="right"><div class="ok">${CHECK}</div><b class="good">Step 1 is slow</b><span>the rate-determining step</span></div>`,
    update(c) {
      const b = c.b
      pulse(c, 'm-sr', X1, A0, c.seg(b[7].start, b[7].start + 0.3))
      const w = eo(c.seg(b[7].start + 0.3, b[7].start + 0.8))
      c.$('.m-sw').style.boxShadow = `0 0 ${50 * w}px rgba(76,199,129,${0.4 * w})`
    },
  })

  // ---------- the trap: measure from the start of that step ----------
  const TR = 560, TA = 420, TI = 820, TB = 470, TP = 760 // step 1 climb 140; step 2 climb 350 from the valley, 90 from the reactants
  const xmark = (x, y) => `<g transform="translate(${x} ${y})"><circle r="24" fill="${BAD}"/><path d="M-10 -10L10 10M10 -10L-10 10" stroke="#10131c" stroke-width="6" stroke-linecap="round"/></g>`
  const vmark = (x, y) => `<g transform="translate(${x} ${y})"><circle r="24" fill="${GOOD}"/><path d="M-11 1l7 7 14-15" fill="none" stroke="#10131c" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></g>`
  EZ.scene('trap', {
    html: `<svg class="full" viewBox="0 0 1920 1080">${axes()}
        <path d="${two(TR, TA, TI, TB, TP)}" class="m-curve" stroke="${PUR}" stroke-width="9" data-at="2" data-fx="draw" data-dur="1.4"/>
        <text x="244" y="${TR + 52}" class="m-lab" data-at="2@0.1" data-fx="fade">reactants</text>
        <text x="1110" y="${TP + 52}" class="m-lab" data-at="2@0.4" data-fx="fade">products</text>
        <text x="${XI}" y="${TI + 54}" text-anchor="middle" class="m-lab f-warm" data-at="2@0.6" data-fx="fade">intermediate</text>
        <g data-at="2@0.8" data-fx="fade"><line x1="350" y1="${TA}" x2="${X1}" y2="${TA}" class="m-lvl"/>${up(350, TR, TA, WARM, 'warm')}
          <text x="332" y="${(TR + TA) / 2 + 12}" text-anchor="end" font-size="26" font-weight="800" class="f-warm">step 1</text></g>
        <g data-at="3@0.2" data-fx="fade"><line x1="380" y1="${TR}" x2="1200" y2="${TR}" class="m-lvl"/><line x1="${X2}" y1="${TB}" x2="1200" y2="${TB}" class="m-lvl"/>${up(1180, TR, TB, BAD, 'bad')}</g>
        <g data-at="4" data-fx="pop">${xmark(1180, TR + 50)}</g>
        <g data-at="5@0.3" data-fx="fade"><line x1="${XI}" y1="${TB}" x2="${X2}" y2="${TB}" class="m-lvl"/>${up(XI, TI, TB, TEAL, 'teal')}</g>
        <g data-at="6@0.3" data-fx="pop">${vmark(XI + 50, (TI + TB) / 2)}</g>
        ${ring('m-tr', WARM)}
      </svg>
      ${side('Watch out', 'Start where<br>the step starts', 'warm')}
      <div class="m-big" style="top:380px;border-color:rgba(240,112,122,.8)" data-at="3" data-fx="right"><b class="bad">From the reactants</b><span>the second climb looks small</span></div>
      <div class="m-big" style="top:560px;border-color:rgba(60,199,188,.8)" data-at="6" data-fx="right"><b class="teal">From the intermediate</b><span>the second climb is larger</span></div>
      <div class="m-big m-tw" style="top:740px;border-color:rgba(76,199,129,.8)" data-at="7" data-fx="right"><div class="ok">${CHECK}</div><b class="good">Step 2 is slow</b><span>the rate-determining step</span></div>`,
    update(c) {
      const b = c.b
      pulse(c, 'm-tr', XI, TI, c.seg(b[2].start + 1.4, b[2].start + 1.7) * (1 - c.seg(b[3].start, b[3].start + 0.3)))
      const w = eo(c.seg(b[7].start + 0.3, b[7].start + 0.8))
      c.$('.m-tw').style.boxShadow = `0 0 ${50 * w}px rgba(76,199,129,${0.4 * w})`
    },
  })

  // ---------- overall ΔH: the humps move, the ends stay put ----------
  const SHAPES = [[A0, I0, B0], [480, 560, 330], [400, 740, 440], [A0, I0, B0]]
  EZ.scene('dh', {
    html: `<svg class="full" viewBox="0 0 1920 1080">${axes()}
        <path class="m-dp m-curve" d="${two(R0, A0, I0, B0, P0)}" stroke="${PUR}" stroke-width="9"/>
        <text x="244" y="${R0 + 52}" class="m-lab">original reactants</text>
        <text x="1240" y="${P0 + 52}" text-anchor="end" class="m-lab">final products</text>
        <g data-at="1@0.3" data-fx="fade"><line x1="380" y1="${R0}" x2="1240" y2="${R0}" class="m-lvl"/>
          <line x1="1215" y1="${R0 + 8}" x2="1215" y2="${P0 - 14}" stroke="${TEAL}" stroke-width="8" marker-end="url(#mk-teal)"/>
          <text x="1196" y="${(R0 + P0) / 2 + 14}" text-anchor="end" font-size="40" font-weight="900" class="f-teal">ΔH</text></g>
        ${ring('m-d1', TEAL)}${ring('m-d2', TEAL)}
      </svg>
      ${side('Overall ΔH', 'Only the<br>ends count', 'teal')}
      <div class="m-big" style="top:380px;border-color:rgba(60,199,188,.7)" data-at="1" data-fx="right"><b class="teal" style="font-size:31px">ΔH = products − reactants</b><span>final minus original</span></div>
      <div class="m-big" style="top:560px" data-at="2" data-fx="right"><b>Humps don’t matter</b><span>not for ΔH</span></div>
      <div class="m-big" style="top:740px" data-at="4" data-fx="right"><b>Start &amp; end only</b><span>those two energies set ΔH</span></div>`,
    update(c) {
      const b = c.b, p = c.seg(b[3].start + 0.2, b[3].end + 0.2) * 3
      const k = Math.min(2, Math.floor(p)), f = eio(clamp(p - k))
      const s = SHAPES[k].map((v, i) => lerp(v, SHAPES[k + 1][i], f))
      c.$('.m-dp').setAttribute('d', two(R0, s[0], s[1], s[2], P0))
      const on = c.seg(b[4].start, b[4].start + 0.3)
      pulse(c, 'm-d1', 300, R0, on); pulse(c, 'm-d2', 1160, P0, on)
    },
  })

  // ---------- profile and mechanism must agree; the catalyzed profile ----------
  const MP = [[30, 250], [110, 250], [230, 90], [360, 210], [480, 150], [600, 310], [690, 310]]
  const mini = `<svg width="720" height="360" viewBox="0 0 720 360">
      <path d="${prof(MP)}" class="m-curve" stroke="${PUR}" stroke-width="7"/>
      <g data-at="1@0.3" data-fx="fade"><text x="230" y="62" text-anchor="middle" font-size="28" font-weight="900" class="f-pri">step 1</text><text x="480" y="122" text-anchor="middle" font-size="28" font-weight="900" class="f-pri">step 2</text></g>
      <text x="360" y="258" text-anchor="middle" font-size="28" font-weight="900" class="f-warm" data-at="2@0.3" data-fx="fade">intermediate</text>
      <g data-at="3@0.3" data-fx="fade"><line x1="95" y1="90" x2="230" y2="90" class="m-lvl" style="stroke-width:2.5"/><line x1="95" y1="244" x2="95" y2="102" stroke="${WARM}" stroke-width="7" marker-end="url(#mk-warm)"/>
        <text x="80" y="180" text-anchor="end" font-size="26" font-weight="900" class="f-warm">slow</text></g></svg>`
  const UC = prof([[80, 400], [260, 400], [700, 80], [1140, 480], [1320, 480]])
  const CA = prof([[80, 400], [260, 400], [500, 230], [700, 330], [900, 260], [1140, 480], [1320, 480]])
  EZ.scene('match', {
    html: `<div class="kicker" data-at="in" data-fx="left">Mechanism and profile</div><h2 class="h1" data-at="0">They must agree</h2>
      <div data-at="0@0.3" data-out="5" data-fx="fade">
        <div class="card" style="left:120px;top:300px;width:810px;height:440px"><div style="position:absolute;left:45px;top:40px">${mini}</div></div>
        <div class="card" style="left:990px;top:300px;width:810px;height:440px">
          <div class="m-row" style="top:50px" data-at="1" data-fx="right"><i style="background:var(--primary)"></i>One hump per elementary step</div>
          <div class="m-row" style="top:175px" data-at="2" data-fx="right"><i style="background:var(--warm)"></i>One valley per intermediate</div>
          <div class="m-row" style="top:300px" data-at="3" data-fx="right"><i style="background:var(--warm)"></i>Highest barrier = slow step</div></div>
      </div>
      <div class="card" style="left:120px;top:300px;width:1680px;height:580px" data-at="5" data-fx="fade">
        <svg style="position:absolute;left:0;top:20px" width="1680" height="560" viewBox="0 0 1680 560">
          <path d="${UC}" class="m-curve" stroke="${GRAY}" stroke-width="7" stroke-dasharray="18 12"/>
          <text x="700" y="52" text-anchor="middle" class="m-lab f-muted">uncatalyzed</text>
          <path d="${CA}" class="m-curve" stroke="${TEAL}" stroke-width="9" data-at="5@0.2" data-fx="draw" data-dur="1.4"/>
          <text x="700" y="384" text-anchor="middle" class="m-lab f-teal" data-at="5@0.6" data-fx="fade">catalyzed: more humps</text>
          <text x="90" y="450" class="m-lab">reactants</text><text x="1140" y="530" class="m-lab">products</text>
          <g data-at="6@0.3" data-fx="fade"><line x1="700" y1="80" x2="1430" y2="80" class="m-lvl"/><line x1="500" y1="230" x2="1430" y2="230" class="m-lvl"/>
            <line x1="1400" y1="88" x2="1400" y2="218" stroke="#f2c443" stroke-width="8" marker-end="url(#mk-gold)"/>
            <text x="1422" y="140" font-size="32" font-weight="900" class="f-gold">highest point</text><text x="1422" y="178" font-size="32" font-weight="900" class="f-gold">is lower</text></g>
        </svg></div>
      <div class="m-foot" data-at="7" data-fx="up">Sketch a profile from a mechanism, <span class="pri">or read a mechanism from a profile</span></div>`,
  })

  // ---------- try it: three humps ----------
  const QP = [[30, 380], [110, 380], [220, 120], [330, 300], [440, 180], [550, 330], [660, 220], [760, 470], [830, 470]]
  const OPTS = ['3 steps,<br>3 intermediates', '3 steps,<br>2 intermediates', '2 steps,<br>3 intermediates', '1 step,<br>2 intermediates']
  const num = (x, y, n, color) => `<g transform="translate(${x} ${y})"><circle r="26" fill="${color}"/><text y="11" text-anchor="middle" font-size="32" font-weight="900" class="f-dark">${n}</text></g>`
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:58px" data-at="1"><span class="pri">3 humps</span>: how many steps and intermediates?</h2>
      <div class="card" style="left:120px;top:330px;width:880px;height:560px" data-at="1@0.3" data-fx="fade">
        <svg style="position:absolute;left:20px;top:40px" width="840" height="500" viewBox="0 0 840 500">
          <path d="${prof(QP)}" class="m-curve" stroke="${PUR}" stroke-width="8"/>
          <g data-at="5" data-fx="pop">${num(220, 70, 1, PUR)}</g><g data-at="5@0.25" data-fx="pop">${num(440, 130, 2, PUR)}</g><g data-at="5@0.5" data-fx="pop">${num(660, 170, 3, PUR)}</g>
          <g data-at="6@0.45" data-fx="pop">${num(330, 356, 1, WARM)}</g><g data-at="6@0.6" data-fx="pop">${num(550, 386, 2, WARM)}</g>
        </svg></div>
      ${OPTS.map((o, i) => `<div class="m-tile m-t${i}" style="left:${1060 + (i % 2) * 380}px;top:${330 + Math.floor(i / 2) * 175}px" data-at="1@${0.5 + i * 0.1}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>${i === 1 ? `<div class="ok">${CHECK}</div>` : ''}<p>${o}</p></div>`).join('')}
      <svg class="full m-count" viewBox="0 0 1920 1080"><circle cx="1430" cy="770" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="m-arc" cx="1430" cy="770" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 1430 770)"/>
        <text class="m-num" x="1430" y="796" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="1430" y="900" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="m-big" style="left:1060px;top:700px;width:730px" data-at="5" data-fx="up"><b><em style="color:var(--primary)">3 humps</em> = 3 steps</b><b data-at="6@0.3" data-fx="fade"><em style="color:var(--warm)">2 valleys</em> = 2 intermediates</b></div>`,
    update(c) {
      const b = c.b, t0 = b[3].start + 0.3, t1 = b[4].start - 0.25, p = c.seg(t0, t1)
      c.$('.m-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.m-arc').setAttribute('stroke-dashoffset', p)
      c.$('.m-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[4].start + 0.3, b[4].start + 0.8))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.m-t' + i)
        if (i === 1) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${50 * win}px rgba(76,199,129,${0.5 * win})`; el.querySelector('.ok').style.opacity = win }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const RP = [[20, 150], [70, 150], [150, 40], [230, 110], [300, 75], [380, 180], [420, 180]]
  const rc = (extra) => `<svg width="440" height="210" viewBox="0 0 440 210"><path d="${prof(RP)}" class="m-curve" stroke="${PUR}" stroke-width="7"/>${extra}</svg>`
  const r1 = rc(`<circle cx="150" cy="40" r="11" fill="${PUR}"/><circle cx="300" cy="75" r="11" fill="${PUR}"/><circle cx="230" cy="110" r="11" fill="${WARM}"/>`)
  const r2 = rc(`<line x1="55" y1="40" x2="150" y2="40" class="m-lvl" style="stroke-width:2.5"/><line x1="55" y1="144" x2="55" y2="52" stroke="${WARM}" stroke-width="7" marker-end="url(#mk-warm)"/>`)
  const r3 = rc(`<line x1="70" y1="150" x2="420" y2="150" class="m-lvl" style="stroke-width:2.5"/><line x1="405" y1="155" x2="405" y2="172" stroke="${TEAL}" stroke-width="6"/><circle cx="45" cy="150" r="11" fill="${TEAL}"/><circle cx="405" cy="180" r="11" fill="${TEAL}"/>`)
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card m-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p><span class="pri">Humps</span> = steps<br><span class="warm">Valleys</span> between<br>humps = intermediates</p></div>
      <div class="card m-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>The biggest <span class="warm">${EAH}</span> climb<br>= the rate-determining<br>step</p></div>
      <div class="card m-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p><span class="teal">ΔH</span> depends only on<br>the start and end<br>energies</p></div>`,
  })
  void ARR
})()
