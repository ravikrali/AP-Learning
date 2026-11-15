// Pictures for chem-2.2 "Bonds & Potential Energy". One EZ.scene per scene id in script.mjs.
// Numbers shown are the lesson's own (app/src/content/chem/u2.ts). Ion and atom sizes are drawn
// in the right order but not to exact scale.
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    svg .f-pri{fill:var(--primary)} svg .f-teal{fill:var(--accent)} svg .f-warm{fill:var(--warm)} svg .f-bad{fill:var(--bad)}
    svg .f-muted{fill:var(--muted)} svg .f-gold{fill:var(--gold)} svg .f-good{fill:var(--good)}
    .ax{stroke:#c9cee0;stroke-width:4;stroke-linecap:round} .tick{font-size:28px;font-weight:700;fill:var(--muted)!important;text-anchor:middle}
    .axl{font-size:30px;font-weight:800;fill:var(--muted)!important;text-anchor:middle}
    .zero{stroke:#7d859c;stroke-width:3;stroke-dasharray:10 10}
    .curve{fill:none;stroke-linecap:round;stroke-linejoin:round}
    .note{position:absolute;left:1360px;width:490px;height:106px;padding:16px 22px 0 84px;border-radius:22px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .note i{position:absolute;left:22px;top:26px;width:46px;height:46px;border-radius:50%}
    .note b{display:block;font-size:30px;font-weight:900;line-height:1.15} .note span{display:block;font-size:25px;font-weight:700;color:var(--muted)}
    .big{position:absolute;left:1360px;width:440px;padding:26px 30px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid var(--line)}
    .big b{display:block;font-size:40px;font-weight:900;line-height:1.1} .big span{display:block;margin-top:10px;font-size:30px;font-weight:700;color:var(--muted)} .big em{font-style:normal;font-weight:900}
    .quote{left:120px;top:206px;width:1680px;height:170px;display:flex;align-items:center;justify-content:center;font-size:66px;font-weight:900}
    .quote .q{position:relative} .quote .strike{position:absolute;left:-12px;right:-12px;top:52%;height:9px;border-radius:5px;background:var(--bad)}
    .stamp{position:absolute;right:70px;top:150px} .stamp div{transform:rotate(-11deg);padding:4px 30px;border:9px solid var(--bad);border-radius:18px;color:var(--bad);font-size:78px;font-weight:900;letter-spacing:.08em;background:rgba(14,16,24,.85)}
    .foot{position:absolute;left:0;right:0;bottom:34px;text-align:center;font-size:54px;font-weight:900}
    .th{position:absolute;top:296px;font-size:28px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
    .row{position:absolute;left:120px;width:1680px;height:140px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .math{position:absolute;left:44px;right:44px;display:flex;align-items:center;font-size:64px;font-weight:900}
    .math .f{width:210px} .math .eq{margin-left:auto;display:inline-flex;align-items:center;justify-content:center;width:96px;height:96px;border-radius:24px;font-size:66px}
    .tile{position:absolute;top:400px;width:390px;height:250px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .tile .f{margin-top:54px;font-size:92px;font-weight:900;line-height:1} .tile .ch{margin-top:16px;font-size:36px;font-weight:800;color:var(--muted)}
    .tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .step{position:absolute;top:330px;height:120px;padding:0 44px 0 30px;border-radius:28px;display:flex;align-items:center;gap:22px;font-size:50px;font-weight:900;border:3px solid}
    .step small{display:inline-flex;align-items:center;justify-content:center;width:68px;height:68px;border-radius:50%;font-size:40px;color:#10131c}
    .answer{left:120px;top:510px;width:1680px;height:400px;padding:34px 56px;font-size:52px;font-weight:700;line-height:1.5}
    .answer .lab{display:block;font-size:26px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:10px} .answer b{font-weight:900}
    .rc{top:320px;width:540px;height:560px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc svg{display:block;margin:14px auto 0} .rc p{margin:14px 20px 0;font-size:35px;font-weight:800;line-height:1.3;white-space:nowrap}
  `
  document.head.appendChild(css)

  // ---------- the H2 potential energy curve (same Morse-style curve as the lesson's diagram) ----------
  const X = (r) => 220 + (r / 300) * 980 // pm -> px
  const Y = (e) => 470 - e * 0.94 // kJ/mol -> px (0 at y = 470)
  const morse = (r) => 436 * (1 - Math.exp(-0.0194 * (r - 74))) ** 2 - 436
  const RMIN = 35, pts = []
  for (let r = 300; r >= RMIN; r--) pts.push([X(r), Y(morse(r))])
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const LEN = cum.at(-1)
  const lenAt = (r) => { const i = clamp(300 - r, 0, pts.length - 1), k = Math.floor(i); return lerp(cum[k], cum[Math.min(k + 1, pts.length - 1)], i - k) }
  const D = 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L')
  const AY = 242 // the row of atoms above the graph; the left nucleus sits on the energy axis (distance 0)

  const hAtom = (cls) => `<g class="${cls}"><circle r="100" fill="url(#g-cloud)" stroke="#8d8df0" stroke-opacity=".45" stroke-width="2"/>
    <circle class="e" r="10" fill="#3cc7bc"/><circle r="18" fill="url(#g-warm)"/><text y="9" text-anchor="middle" font-size="28" font-weight="900" style="fill:#10131c">+</text>
    <text y="-112" text-anchor="middle" font-size="30" font-weight="900" class="f-muted">H</text></g>`
  const graph = (ghost) => `<svg class="full" viewBox="0 0 1920 1080">
    <g data-at="${ghost ? 'in' : '0@0.4'}" data-fx="fade">
      <line x1="220" y1="356" x2="220" y2="930" class="ax"/><line x1="220" y1="930" x2="1236" y2="930" class="ax"/>
      ${[100, 200, 300].map((r) => `<line x1="${X(r)}" y1="930" x2="${X(r)}" y2="944" class="ax"/><text x="${X(r)}" y="978" class="tick">${r}</text>`).join('')}
      <text x="720" y="1030" class="axl">Distance between the nuclei (pm)</text>
      <text transform="translate(150 650) rotate(-90)" class="axl">Potential energy (kJ/mol)</text>
    </g>
    <g data-at="${ghost ? 'in' : '2'}" data-fx="fade"><line x1="220" y1="470" x2="1236" y2="470" class="zero"/><text x="1232" y="452" class="tick" style="text-anchor:end">energy = 0 (atoms far apart)</text></g>
    <path d="${D}" class="curve" stroke="#8d8df0" stroke-width="${ghost ? 9 : 0}" opacity="${ghost ? 0.9 : 0}"/>
    <path d="${D}" class="curve trail" stroke="#8d8df0" stroke-width="9" stroke-dasharray="${LEN} ${LEN * 3}" stroke-dashoffset="${LEN}"/>
    ${ghost ? '' : `
    <text x="${X(RMIN) + 34}" y="386" font-size="30" font-weight="800" class="f-bad" data-at="4@0.45" data-fx="fade">too close: nuclei repel</text>
    <g data-at="6" data-fx="fade"><line x1="${X(74)}" y1="${Y(-436)}" x2="${X(74)}" y2="930" stroke="#3cc7bc" stroke-width="4" stroke-dasharray="9 9"/>
      <text x="${X(74)}" y="978" class="tick" style="fill:var(--accent)!important;font-weight:900">74</text>
      <text x="${X(74) + 44}" y="${Y(-436) + 40}" font-size="32" font-weight="900" class="f-teal">bond length = 74 pm</text></g>
    <g data-at="7" data-fx="fade"><line x1="${X(74)}" y1="${Y(-436)}" x2="${X(200) + 50}" y2="${Y(-436)}" stroke="#f3a764" stroke-width="3" stroke-dasharray="9 9" opacity=".8"/>
      <line x1="${X(200)}" y1="${Y(0) + 12}" x2="${X(200)}" y2="${Y(-436) - 12}" stroke="#f3a764" stroke-width="7" marker-start="url(#mk-warm)" marker-end="url(#mk-warm)"/>
      <text x="${X(200) + 26}" y="666" font-size="38" font-weight="900" class="f-warm">bond energy</text><text x="${X(200) + 26}" y="712" font-size="38" font-weight="900" class="f-warm">436 kJ/mol</text></g>`}
    <g class="ring"><circle r="20" fill="none" stroke="#3cc7bc" stroke-width="5"/></g>
    <g class="dot"><circle r="30" fill="#8d8df0" opacity=".3"/><circle r="15" fill="#fff"/></g>
    <g transform="translate(220 ${AY})">${hAtom('la')}</g><g class="ra">${hAtom('rb')}</g>
    <g class="pull"><line class="pl" y1="${AY}" y2="${AY}" stroke="#3cc7bc" stroke-width="8" marker-end="url(#mk-teal)"/><line class="pr" y1="${AY}" y2="${AY}" stroke="#3cc7bc" stroke-width="8" marker-end="url(#mk-teal)"/></g>
    <g class="push"><line x1="100" x2="34" y1="${AY}" y2="${AY}" stroke="#f0707a" stroke-width="8" marker-end="url(#mk-bad)"/><line class="pr" y1="${AY}" y2="${AY}" stroke="#f0707a" stroke-width="8" marker-end="url(#mk-bad)"/></g>
    <g class="len"><line class="ll" y1="${AY + 44}" y2="${AY + 44}" x1="222" stroke="#fff" stroke-width="4" marker-start="url(#mk-text)" marker-end="url(#mk-text)"/><text class="lt" y="${AY + 84}" text-anchor="middle" font-size="30" font-weight="900">74 pm</text></g>
  </svg>`
  // put the atoms, the tracking dot and the drawn part of the curve where distance r says they are
  function place(c, r, trail, o = {}) {
    const x = X(r), t = c.t
    c.$('.trail').setAttribute('stroke-dashoffset', LEN - lenAt(trail))
    c.$('.dot').setAttribute('transform', `translate(${x} ${Y(morse(r))})`)
    c.$('.dot').style.opacity = o.dot ?? 1
    c.$('.ra').setAttribute('transform', `translate(${x} ${AY})`)
    const share = clamp((150 - r) / 70), d = x - 220, orbit = lerp(62, 46, share)
    c.$('.la .e').setAttribute('transform', `translate(${share * d * 0.4 + orbit * Math.cos(t * 2.6)} ${orbit * Math.sin(t * 2.6)})`)
    c.$('.rb .e').setAttribute('transform', `translate(${-share * d * 0.4 + orbit * Math.cos(-t * 2.6 + 2.2)} ${orbit * Math.sin(-t * 2.6 + 2.2)})`)
    const pull = (o.pull ?? 0) * clamp((r - 150) / 40), nudge = 8 * Math.sin(t * 5)
    c.$('.pull').style.opacity = pull
    c.$('.pull .pl').setAttribute('x1', 330 + nudge); c.$('.pull .pl').setAttribute('x2', 400 + nudge)
    c.$('.pull .pr').setAttribute('x1', x - 110 - nudge); c.$('.pull .pr').setAttribute('x2', x - 180 - nudge)
    c.$('.push').style.opacity = (o.push ?? 0) * clamp((72 - r) / 12)
    c.$('.push .pr').setAttribute('x1', x + 120); c.$('.push .pr').setAttribute('x2', x + 186)
    c.$('.len').style.opacity = o.len ?? 0
    c.$('.len .ll').setAttribute('x2', x - 2); c.$('.len .lt').setAttribute('x', (220 + x) / 2)
    const ring = o.ring ?? 0, ph = (t % 1.5) / 1.5
    c.$('.ring').setAttribute('transform', `translate(${X(74)} ${Y(-436)}) scale(${1 + ph * 2.6})`)
    c.$('.ring').style.opacity = ring * (1 - ph)
  }
  const note = (i, at, color, a, b) => `<div class="note" style="top:${378 + i * 124}px" data-at="${at}" data-fx="right"><i style="background:${color}"></i><b>${a}</b><span>${b}</span></div>`

  // ---------- intro artwork: the curve, faintly, behind the title ----------
  EZ.intro = {
    chips: [['1@0.52', 'Why bonds form'], ['1@0.7', 'How strong'], ['1@0.88', 'How long']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2"><g transform="translate(-140 250) scale(1.16 .78)"><path d="${D}" class="curve trail" stroke="#8d8df0" stroke-width="12" stroke-dasharray="${LEN} ${LEN * 3}"/><circle class="idot" r="20" fill="#3cc7bc"/></g></svg>`,
    update(c) {
      const p = eio(c.seg(c.sc.start + 0.2, c.sc.start + 3.2)), r = lerp(300, RMIN, p)
      c.$('.trail').setAttribute('stroke-dashoffset', LEN - lenAt(r))
      const rb = 74 + 110 * Math.abs(Math.sin((c.t - c.sc.start) * 0.5)) // a ball rolling in the well
      c.$('.idot').setAttribute('transform', `translate(${X(rb)} ${Y(morse(rb)) - 24})`)
      c.$('.idot').style.opacity = c.seg(c.sc.start + 3, c.sc.start + 3.6)
    },
  }

  // ---------- myth ----------
  const pair = (id) => `<g class="${id}a">${ball(0, 0, 66, 'pur')}</g><g class="${id}b">${ball(0, 0, 66, 'teal')}</g>`
  EZ.scene('myth', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Myth buster</div>
      <div class="card quote" data-at="1"><span class="q">“Breaking a bond releases energy.”<i class="strike" data-at="2" data-fx="grow" data-dur="0.35"></i></span></div>
      <div class="stamp" data-at="2+0.15" data-fx="pop"><div>MYTH</div></div>
      <div class="card" style="left:120px;top:420px;width:810px;height:520px" data-at="3">
        <h3>Breaking a bond</h3>
        <svg style="position:absolute;left:0;top:96px" width="810" height="300" viewBox="0 0 810 300">
          <g class="ein"><line x1="405" y1="6" x2="405" y2="66" stroke="#f3a764" stroke-width="10" marker-end="url(#mk-warm)"/><line x1="405" y1="294" x2="405" y2="234" stroke="#f3a764" stroke-width="10" marker-end="url(#mk-warm)"/>
          <text x="436" y="40" font-size="32" font-weight="900" class="f-warm">energy in</text></g>${pair('l')}</svg>
        <div class="foot warm">costs energy</div></div>
      <div class="card" style="left:990px;top:420px;width:810px;height:520px" data-at="4">
        <h3>Forming a bond</h3>
        <svg style="position:absolute;left:0;top:96px" width="810" height="300" viewBox="0 0 810 300">
          <g class="rays">${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="0" x2="0" y2="0" stroke="#3cc7bc" stroke-width="9" stroke-linecap="round" data-a="${i * 30 + 15}"/>`).join('')}</g>
          <text class="eout f-teal" x="600" y="54" font-size="32" font-weight="900">energy out</text>${pair('r')}</svg>
        <div class="foot teal">releases energy</div></div>
      <div style="position:absolute;left:0;top:966px;width:1920px;text-align:center;font-size:40px;font-weight:800;color:var(--muted)" data-at="5">A potential energy graph shows why ${ARR}</div>`,
    update(c) {
      const b = c.b, y = 150
      const sL = lerp(86, 330, eio(c.seg(b[3].start + 0.5, b[3].end + 0.2)))
      c.$('.la').setAttribute('transform', `translate(${405 - sL / 2} ${y})`); c.$('.lb').setAttribute('transform', `translate(${405 + sL / 2} ${y})`)
      const bob = 7 * Math.sin(c.t * 5)
      c.$('.ein').setAttribute('transform', `translate(0 0)`)
      c.$('.ein').style.opacity = c.seg(b[3].start + 0.2, b[3].start + 0.7) * (0.75 + 0.25 * Math.sin(c.t * 5))
      const join = b[4].start + 1.5
      const sR = lerp(330, 86, eio(c.seg(b[4].start + 0.3, join)))
      c.$('.ra').setAttribute('transform', `translate(${405 - sR / 2} ${y})`); c.$('.rb').setAttribute('transform', `translate(${405 + sR / 2} ${y})`)
      const since = c.t - join, ph = since < 0 ? -1 : (since % 1.6) / 1.6
      c.$('.rays').style.opacity = ph < 0 ? 0 : Math.sin(Math.PI * ph)
      for (const l of c.root.querySelectorAll('.rays line')) {
        const a = (+l.dataset.a * Math.PI) / 180, r1 = 120 + 70 * Math.max(ph, 0), r2 = r1 + 46
        l.setAttribute('x1', 405 + r1 * Math.cos(a)); l.setAttribute('y1', y + r1 * 0.62 * Math.sin(a)); l.setAttribute('x2', 405 + r2 * Math.cos(a)); l.setAttribute('y2', y + r2 * 0.62 * Math.sin(a))
      }
      c.$('.eout').style.opacity = clamp(since / 0.4)
      void bob
    },
  })

  // ---------- the potential energy curve ----------
  EZ.scene('curve', {
    html: `${graph(false)}
      <div class="kicker" style="left:1360px;top:150px" data-at="in" data-fx="right">The energy curve</div>
      <div style="position:absolute;left:1360px;top:212px;width:480px;font-size:50px;font-weight:900;line-height:1.08" data-at="in+0.2" data-fx="right">Two H atoms,<br>one graph</div>
      ${note(0, '2', '#7d859c', 'Far apart', 'no interaction: energy = 0')}
      ${note(1, '3', '#3cc7bc', 'Closer', 'attraction lowers the energy')}
      ${note(2, '4', '#f0707a', 'Too close', 'nuclei repel: energy shoots up')}
      ${note(3, '6', '#3cc7bc', 'Bottom of the well', '= bond length')}
      ${note(4, '7', '#f3a764', 'Depth of the well', '= bond energy')}`,
    update(c) {
      const b = c.b, t = c.t
      let r = lerp(300, 74, eio(c.seg(b[3].start + 0.3, b[3].end)))
      const p4 = eio(c.seg(b[4].start + 0.4, b[4].start + 0.55 * (b[4].end - b[4].start)))
      if (p4 > 0) r = lerp(74, RMIN, p4)
      let trail = r
      const back = b[5].start + 0.2, land = back + 1.3
      if (t >= back) {
        trail = RMIN
        r = lerp(RMIN, 74, eio(c.seg(back, land)))
        if (t > land) r = 74 + 11 * Math.exp(-2.4 * (t - land)) * Math.sin(7 * (t - land))
      }
      place(c, r, trail, {
        dot: c.p('1', 0.5), pull: c.seg(b[3].start, b[3].start + 0.4) * (1 - c.seg(b[3].end, b[3].end + 0.3)),
        push: t < back ? c.seg(b[4].start + 0.3, b[4].start + 0.7) : 1 - c.seg(back, back + 0.4),
        len: c.p('6', 0.5), ring: c.seg(land, land + 0.3),
      })
    },
  })

  // ---------- breaking = climbing out, forming = falling in ----------
  EZ.scene('well', {
    html: `${graph(true)}
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.25" data-fx="fade"><line x1="${X(205)}" y1="${Y(-436) - 14}" x2="${X(205)}" y2="${Y(0) + 16}" stroke="#f3a764" stroke-width="9" marker-end="url(#mk-warm)"/>
          <text x="${X(205) - 22}" y="800" text-anchor="end" font-size="36" font-weight="900" class="f-warm">energy IN</text><text x="${X(205) - 22}" y="844" text-anchor="end" font-size="32" font-weight="800" class="f-warm">436 kJ/mol</text></g>
        <g data-at="2@0.3" data-fx="fade"><line x1="${X(245)}" y1="${Y(0) + 14}" x2="${X(245)}" y2="${Y(-436) - 16}" stroke="#3cc7bc" stroke-width="9" marker-end="url(#mk-teal)"/>
          <text x="${X(245) + 24}" y="800" font-size="36" font-weight="900" class="f-teal">energy OUT</text><text x="${X(245) + 24}" y="844" font-size="32" font-weight="800" class="f-teal">436 kJ/mol</text></g>
      </svg>
      <div class="kicker warm" style="left:1360px;top:150px" data-at="in" data-fx="right">Myth, solved</div>
      <div style="position:absolute;left:1360px;top:212px;width:480px;font-size:50px;font-weight:900;line-height:1.08" data-at="0" data-fx="right">In or out<br>of the well?</div>
      <div class="big" style="top:400px;border-color:rgba(243,167,100,.7)" data-at="1" data-fx="right"><b class="warm">Break a bond</b><span>climb out of the well:<br><em class="warm">energy goes in</em></span></div>
      <div class="big" style="top:660px;border-color:rgba(60,199,188,.7)" data-at="2" data-fx="right"><b class="teal">Form a bond</b><span>fall into the well:<br><em class="teal">energy is released</em></span></div>`,
    update(c) {
      const b = c.b, t = c.t
      let r = lerp(74, 300, eio(c.seg(b[1].start + 0.3, b[1].start + 0.62 * (b[1].end - b[1].start))))
      const land = b[2].start + 0.62 * (b[2].end - b[2].start)
      if (t > b[2].start) r = lerp(300, 74, eio(c.seg(b[2].start + 0.3, land)))
      if (t > land) r = 74 + 11 * Math.exp(-2.4 * (t - land)) * Math.sin(7 * (t - land))
      place(c, r, 300, { ring: t < b[1].start ? 1 : c.seg(land, land + 0.2) })
    },
  })

  // ---------- bond order ----------
  const ROWS = [['C–C', 1, 154, 347, 2], ['C=C', 2, 134, 614, 3], ['C≡C', 3, 120, 839, 4]]
  const molecule = (n, pm) => { const d = pm * 1.35, x1 = 250 - d / 2, x2 = 250 + d / 2
    return `${Array.from({ length: n }, (_, i) => `<line x1="${x1}" x2="${x2}" y1="${70 + (i - (n - 1) / 2) * 20}" y2="${70 + (i - (n - 1) / 2) * 20}" stroke="#eef0f7" stroke-width="9"/>`).join('')}${ball(x1, 70, 44, 'gray', 'C')}${ball(x2, 70, 44, 'gray', 'C')}` }
  EZ.scene('order', {
    html: `<div class="kicker" data-at="in" data-fx="left">Bond order</div><h2 class="h1" data-at="0">Single, double, triple</h2>
      <div data-at="in" data-out="6" data-fx="fade">
        <div class="th" style="left:160px" data-at="1" data-fx="fade">Bond</div><div class="th" style="left:760px" data-at="2@0.2" data-fx="fade">Bond length</div><div class="th" style="left:1290px" data-at="2@0.55" data-fx="fade">Bond energy (approx.)</div>
        ${ROWS.map(([f, n, pm, kj, beat], i) => `<div class="row" style="top:${346 + i * 160}px" data-at="1@${0.12 + i * 0.3}">
          <div style="position:absolute;left:40px;top:34px;font-size:56px;font-weight:900">${f}</div>
          <svg style="position:absolute;left:170px;top:0" width="500" height="140">${molecule(n, pm)}</svg>
          <div style="position:absolute;left:640px;top:52px;width:${(pm / 154) * 330}px;height:36px;border-radius:18px;background:linear-gradient(90deg,#5b5bd6,#8d8df0)" data-at="${beat}@0.2" data-fx="grow"></div>
          <div style="position:absolute;left:${660 + (pm / 154) * 330}px;top:40px;font-size:44px;font-weight:900;white-space:nowrap" class="pri" data-at="${beat}@0.3" data-fx="fade">${pm} pm</div>
          <div style="position:absolute;left:1170px;top:52px;width:${(kj / 839) * 230}px;height:36px;border-radius:18px;background:linear-gradient(90deg,#b96a26,#f3a764)" data-at="${beat}@0.6" data-fx="grow"></div>
          <div style="position:absolute;left:${1190 + (kj / 839) * 230}px;top:40px;font-size:44px;font-weight:900;white-space:nowrap" class="warm" data-at="${beat}@0.7" data-fx="fade">${kj} kJ/mol</div>
        </div>`).join('')}
      </div>
      <div class="banner" style="top:850px" data-at="5" data-fx="pop">Higher bond order ${ARR} <span class="pri">shorter</span> and <span class="warm">stronger</span></div>
      <div data-at="6" data-fx="fade">
        <div style="position:absolute;left:120px;top:300px;font-size:46px;font-weight:900" class="teal">Atom size matters too: bigger atoms ${ARR} longer bonds</div>
        <svg class="full" viewBox="0 0 1920 1080">
          <g data-at="6@0.1" data-fx="pop"><line x1="470" y1="580" x2="585" y2="580" stroke="#eef0f7" stroke-width="10"/>${ball(470, 580, 42, 'gray', 'H')}${ball(585, 580, 74, 'teal', 'F')}
            <line x1="470" y1="740" x2="585" y2="740" stroke="#3cc7bc" stroke-width="6" marker-start="url(#mk-teal)" marker-end="url(#mk-teal)"/></g>
          <text x="528" y="800" text-anchor="middle" font-size="40" font-weight="900" class="f-teal" data-at="6@0.85" data-fx="fade">H–F: shorter bond</text>
          <g data-at="6@0.2" data-fx="pop"><line x1="1200" y1="580" x2="1380" y2="580" stroke="#eef0f7" stroke-width="10"/>${ball(1200, 580, 42, 'gray', 'H')}${ball(1380, 580, 138, 'pur', 'I', 76)}
            <line x1="1200" y1="740" x2="1380" y2="740" stroke="#8d8df0" stroke-width="6" marker-start="url(#mk-pri)" marker-end="url(#mk-pri)"/></g>
          <text x="1290" y="800" text-anchor="middle" font-size="40" font-weight="900" class="f-pri" data-at="6@0.6" data-fx="fade">H–I: longer bond</text>
        </svg>
      </div>`,
  })

  // ---------- Coulomb's law ----------
  // an ion pair touching, centred on (cx, y): [cation label, charge, radius, colour], [anion …]
  const ions = (cx, y, a, b) => { const x1 = cx - (a[2] + b[2]) / 2 + a[2] - a[2], xa = cx - b[2], xb = cx + a[2]; void x1
    return ball(xa, y, a[2], a[3], sup(a[0], a[1]), Math.min(a[2] * 0.62, 40)) + ball(xb, y, b[2], b[3], sup(b[0], b[1]), Math.min(b[2] * 0.62, 40)) }
  const meter = (x, y, frac, label, color) => `<rect x="${x}" y="${y}" width="250" height="26" rx="13" fill="#2c3145"/><rect class="tb" x="${x}" y="${y}" width="${250 * frac}" height="26" rx="13" fill="${color}"/><text x="${x}" y="${y - 14}" font-size="28" font-weight="900" style="fill:${color}">${label}</text>`
  EZ.scene('coulomb', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Ionic bonds</div><h2 class="h1" data-at="0">Coulomb’s law</h2>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="1" data-fx="fade">
        <g class="cat">${ball(0, 0, 44, 'warm', '+', 52)}</g><g class="an">${ball(0, 0, 64, 'teal', '−', 60)}</g>
        <line class="a1" y1="214" y2="214" stroke="#eef0f7" stroke-width="7" marker-end="url(#mk-text)"/><line class="a2" y1="214" y2="214" stroke="#eef0f7" stroke-width="7" marker-end="url(#mk-text)"/>
        <text x="1450" y="196" font-size="46" font-weight="900">F ∝ <tspan class="f-pri">q₁q₂</tspan> / <tspan class="f-teal">r²</tspan></text>
        <text x="1450" y="244" font-size="26" font-weight="700" class="f-muted">charges on top, distance below</text></g></svg>
      <div class="card" style="left:120px;top:330px;width:810px;height:530px" data-at="2"><h3><small>1</small><span class="pri">Bigger charges</span></h3>
        <svg style="position:absolute;left:0;top:110px" width="810" height="420">
          <g data-at="3@0.05" data-fx="pop">${ions(210, 100, ['Mg', '2+', 36, 'warm'], ['O', '2−', 66, 'teal'])}</g><g data-at="3@0.3" data-fx="fade">${meter(470, 96, 1, 'far stronger', '#8d8df0')}</g>
          <g data-at="3@0.6" data-fx="pop">${ions(200, 300, ['Na', '+', 50, 'warm'], ['Cl', '−', 84, 'teal'])}</g><g data-at="3@0.8" data-fx="fade">${meter(470, 296, 0.25, 'weaker', '#7d859c')}</g>
        </svg></div>
      <div class="card" style="left:990px;top:330px;width:810px;height:530px" data-at="4"><h3><small>2</small><span class="teal">Smaller ions</span></h3>
        <svg style="position:absolute;left:0;top:110px" width="810" height="420">
          <g data-at="5@0.45" data-fx="pop">${ions(200, 100, ['Na', '+', 50, 'warm'], ['F', '−', 62, 'teal'])}</g><g data-at="5@0.6" data-fx="fade">${meter(470, 96, 0.8, 'closer: stronger', '#3cc7bc')}</g>
          <g data-at="5@0.8" data-fx="pop">${ions(180, 300, ['Na', '+', 50, 'warm'], ['I', '−', 100, 'teal'])}</g><g data-at="5@0.9" data-fx="fade">${meter(470, 296, 0.45, 'farther: weaker', '#7d859c')}</g>
        </svg></div>
      <div class="banner" style="top:896px" data-at="6" data-fx="pop">Compare <span class="pri">charge</span> first, then <span class="teal">size</span></div>`,
    update(c) {
      const k = 10 * Math.sin(c.t * 3.2), xa = 1080 + k, xb = 1320 - k
      c.$('.cat').setAttribute('transform', `translate(${xa} 214)`); c.$('.an').setAttribute('transform', `translate(${xb} 214)`)
      c.$('.a1').setAttribute('x1', xa + 54); c.$('.a1').setAttribute('x2', xa + 92)
      c.$('.a2').setAttribute('x1', xb - 74); c.$('.a2').setAttribute('x2', xb - 112)
    },
  })

  // ---------- the melting point trick ----------
  const HAL = [['NaF', 'F', 31, '993 °C'], ['NaCl', 'Cl', 41, ''], ['NaBr', 'Br', 45, ''], ['NaI', 'I', 51, '661 °C']]
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Which ionic compound melts higher?</h2>
      <div class="card" style="left:120px;top:320px;width:810px;height:600px" data-at="1"><h3><small>1</small>Multiply the charges</h3>
        <div class="math" style="top:150px" data-at="2@0.02"><span class="f pri">MgO</span><span>2 × 2 =</span><span class="eq" style="background:var(--brand)">4</span></div>
        <div class="math" style="top:290px" data-at="2@0.42"><span class="f muted">NaCl</span><span>1 × 1 =</span><span class="eq" style="background:var(--surface2);border:2px solid var(--line)">1</span></div>
        <div style="position:absolute;left:44px;right:44px;top:450px;padding:18px;border-radius:22px;text-align:center;font-size:46px;font-weight:900;background:rgba(76,199,129,.16);border:2px solid var(--good)" class="good" data-at="2@0.78" data-fx="pop">MgO melts higher</div></div>
      <div class="card" style="left:990px;top:320px;width:810px;height:600px" data-at="3"><h3><small>2</small>Tie? Smaller ions win</h3>
        <svg style="position:absolute;left:0;top:96px" width="810" height="350">
          ${HAL.map(([f, x, r, mp], i) => { const cx = 92 + i * 195
            return `<g data-at="4@${0.14 + i * 0.24}" data-fx="pop">${ball(cx - r, 130, 24, 'warm')}${ball(cx + 24, 130, r, 'teal', sup(x, '−'), 26)}<text x="${cx}" y="240" text-anchor="middle" font-size="42" font-weight="900">${f}</text>
              ${mp ? `<text x="${cx}" y="286" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">${mp}</text>` : ''}</g>
              ${i < 3 ? `<text x="${cx + 106}" y="146" text-anchor="middle" font-size="54" font-weight="900" class="f-good" data-at="4@${0.3 + i * 0.24}" data-fx="fade">&gt;</text>` : ''}` }).join('')}
        </svg>
        <div style="position:absolute;left:44px;right:44px;top:424px;padding:18px;border-radius:22px;text-align:center;font-size:38px;font-weight:900;background:rgba(60,199,188,.14);border:2px solid var(--accent)" class="teal" data-at="5" data-fx="pop">The negative ion gets bigger<br>down the group</div></div>`,
  })

  // ---------- try it ----------
  const OPTS = [['A', 'KCl', '1+ and 1−'], ['B', 'NaCl', '1+ and 1−'], ['C', 'CaO', '2+ and 2−'], ['D', 'KBr', '1+ and 1−']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">Which has the <span class="teal">strongest attraction</span> between its ions?</h2>
      ${OPTS.map(([l, f, ch], i) => `<div class="tile t${i}" style="left:${120 + i * 430}px" data-at="1@${0.5 + i * 0.125}" data-fx="pop"><div class="l">${l}</div>
        ${i === 2 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        <div class="f">${f}</div><div class="ch" data-at="${i === 2 ? '4@0.1' : '4@0.55'}" data-fx="fade">${ch}</div></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="820" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="820" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 820)"/>
        <text class="num" x="960" y="846" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="950" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:760px" data-at="5" data-fx="pop">Bigger charges ${ARR} much <span class="teal">stronger</span> attraction</div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.5, b[3].start + 0.95))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i), base = el.dataset.at ? null : null; void base
        if (i === 2) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- free-response tip ----------
  EZ.scene('frq', {
    html: `<div class="kicker" data-at="in" data-fx="left">Free-response tip</div><h2 class="h1" data-at="0">“Explain using Coulomb’s law”</h2>
      <div class="step" style="left:120px;border-color:var(--primary);background:rgba(141,141,240,.14)" data-at="1@0.62" data-fx="pop"><small style="background:var(--primary)">1</small>the charges</div>
      <div class="step" style="left:600px;border-color:var(--accent);background:rgba(60,199,188,.12)" data-at="1@0.76" data-fx="pop"><small style="background:var(--accent)">2</small>the distance (ion size)</div>
      <div class="step" style="left:1330px;border-color:var(--warm);background:rgba(243,167,100,.12)" data-at="1@0.9" data-fx="pop"><small style="background:var(--warm)">3</small>the result</div>
      <div class="card answer" data-at="2-0.2"><span class="lab">Model answer</span>
        <span data-at="2@0.06" data-fx="fade">Mg<sup>2+</sup> has a <b class="pri">greater charge</b> than Na<sup>+</sup></span>
        <span data-at="2@0.48" data-fx="fade"> and a <b class="teal">smaller radius</b>,</span>
        <span data-at="2@0.66" data-fx="fade"> so the Coulombic attraction between Mg<sup>2+</sup> and O<sup>2−</sup> is <b class="warm">greater</b>,</span>
        <span data-at="3" data-fx="fade"> giving MgO a <b class="warm">higher melting point</b>.</span></div>`,
  })

  // ---------- recap ----------
  const mini = `<svg width="380" height="210" viewBox="150 300 1130 660"><path d="${D}" class="curve" stroke="#8d8df0" stroke-width="20"/><line x1="220" y1="470" x2="1236" y2="470" stroke="#7d859c" stroke-width="8" stroke-dasharray="24 24"/>
    <line x1="${X(74)}" y1="880" x2="${X(74)}" y2="950" stroke="#3cc7bc" stroke-width="12"/><line x1="${X(190)}" y1="490" x2="${X(190)}" y2="862" stroke="#f3a764" stroke-width="14" marker-start="url(#mk-warm)" marker-end="url(#mk-warm)"/><circle cx="${X(74)}" cy="880" r="34" fill="#fff"/></svg>`
  const inout = `<svg width="460" height="210" viewBox="-40 0 460 210">${ball(70, 62, 30, 'pur')}${ball(170, 62, 30, 'teal')}<line x1="110" y1="20" x2="110" y2="104" stroke="#f3a764" stroke-width="6" stroke-dasharray="8 8"/><text x="225" y="74" font-size="30" font-weight="900" class="f-warm">energy in</text>
    ${ball(96, 158, 30, 'pur')}${ball(140, 158, 30, 'teal')}<text x="225" y="170" font-size="30" font-weight="900" class="f-teal">energy out</text></svg>`
  const both = `<svg width="460" height="210" viewBox="-20 0 460 210">${[-18, 0, 18].map((d) => `<line x1="60" x2="150" y1="${62 + d}" y2="${62 + d}" stroke="#eef0f7" stroke-width="7"/>`).join('')}${ball(60, 62, 32, 'gray', 'C')}${ball(150, 62, 32, 'gray', 'C')}
    <text x="210" y="74" font-size="30" font-weight="900" class="f-pri">short, strong</text>${ball(72, 158, 24, 'warm', sup('', '2+'), 30)}${ball(130, 158, 34, 'teal', sup('', '2−'), 30)}<text x="210" y="170" font-size="30" font-weight="900" class="f-teal">big charges</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div>${mini}<p>Well bottom =<br><span class="teal">bond length</span><br>Well depth =<br><span class="warm">bond energy</span></p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div>${inout}<p>Breaking bonds<br><span class="warm">costs</span> energy.<br>Forming bonds<br><span class="teal">releases</span> it.</p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div>${both}<p>Higher bond order:<br><span class="pri">shorter, stronger</span><br>Ionic: <span class="teal">bigger charges,<br>smaller ions</span></p></div>`,
  })
})()
