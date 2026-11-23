// Pictures for chem-6.5 "Energy of Phase Changes". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u6.ts and chem/book.ts): 0 °C and
// 100 °C, ΔHfus 6.01 and ΔHvap 40.7 kJ/mol, the 36.0 g ice example, the +10.0 kJ/mol quick check,
// the 18.0 g two-step example and the 0.500 mol try question. The heating curve is the app's own
// 'heating-curve' diagram, scaled up; thermometer levels show direction only, never a reading.
(() => {
  const { clamp, lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-eq{position:absolute;left:0;width:1920px;top:290px;text-align:center;font-size:140px;font-weight:900;letter-spacing:2px;line-height:1}
    .x-eq span{display:inline-block;transform-origin:50% 70%}
    .x-tile{position:absolute;top:480px;width:520px;height:270px;border-radius:30px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center}
    .x-tile .L{margin-top:22px;font-size:92px;font-weight:900;line-height:1}
    .x-tile .N{margin-top:16px;font-size:40px;font-weight:900;line-height:1.15}
    .x-tile .D{margin-top:10px;font-size:30px;font-weight:700;color:var(--muted);line-height:1.3}
    .x-big{position:absolute;padding:20px 30px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid var(--line)}
    .x-big b{display:block;font-size:38px;font-weight:900;line-height:1.2;white-space:nowrap} .x-big span{display:block;margin-top:6px;font-size:28px;font-weight:700;color:var(--muted);white-space:nowrap}
    .x-big b span,.x-big b em{display:inline;margin:0;font-size:inherit;font-weight:inherit;font-style:normal}
    .x-step{position:absolute;left:820px;width:980px;padding:18px 32px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .x-step .H{font-size:34px;font-weight:900;color:var(--muted)} .x-step .H i{display:inline-block;width:46px;height:46px;margin-right:14px;border-radius:50%;background:var(--brand);color:#fff;font-style:normal;text-align:center;line-height:46px;font-size:28px}
    .x-step .B{margin-top:8px;font-size:40px;font-weight:900;line-height:1.3;white-space:nowrap}
    .x-lab{font-size:32px;font-weight:900}
    .x-row{position:absolute;left:1040px;width:760px;height:72px;padding:0 26px;box-sizing:border-box;border-radius:20px;background:rgba(36,40,56,.92);border:2px solid var(--line);font-size:34px;font-weight:900;line-height:68px;white-space:nowrap}
    .x-row i{display:inline-block;width:44px;height:44px;margin-right:16px;border-radius:50%;background:var(--brand);color:#fff;font-style:normal;text-align:center;line-height:44px;font-size:26px;vertical-align:middle}
    .x-row em{position:absolute;right:26px;top:0;font-style:normal}
    .x-gv{position:absolute;top:310px;width:530px;height:190px;border-radius:28px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center}
    .x-gv .N{margin-top:26px;font-size:28px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
    .x-gv .V{margin-top:16px;font-size:58px;font-weight:900;white-space:nowrap}
    .x-ans{position:absolute;left:120px;top:560px;width:1680px;height:330px;border-radius:30px;background:rgba(36,40,56,.92);border:3px solid rgba(76,199,129,.8)}
    .x-ans .ok{position:absolute;left:44px;top:44px;width:84px;height:84px}
    .x-ans .A{position:absolute;left:156px;top:30px;font-size:96px;font-weight:900}
    .x-ans .W{position:absolute;left:60px;top:170px;font-size:46px;font-weight:800;white-space:nowrap}
    .x-ans .K{position:absolute;left:60px;top:240px;font-size:40px;font-weight:800;color:var(--muted);white-space:nowrap}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', WARM = '#f3a764', RED = '#f0707a', PUR = '#8d8df0', GOLD = '#f2c443'
  const CHECK = '<svg viewBox="0 0 64 64" style="display:block;width:100%;height:100%"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const sub = (s) => `<tspan dy="9" font-size=".65em">${s}</tspan>`

  // a thermometer: tube from y0 down h px, bulb below it; the liquid column has class `cls`
  const thermo = (x, y0, h, cls, col = RED) => `<rect x="${x - 18}" y="${y0}" width="36" height="${h}" rx="18" fill="rgba(255,255,255,.06)" stroke="#c9cee0" stroke-width="4"/>
    <rect class="${cls}" x="${x - 9}" y="${y0 + h - 30}" width="18" height="60" rx="9" fill="${col}"/>
    <circle cx="${x}" cy="${y0 + h + 22}" r="32" fill="${col}" stroke="#c9cee0" stroke-width="4"/>`
  const level = (c, sel, y0, h, f) => {
    const el = c.$(sel), top = y0 + 14 + (h - 28) * (1 - clamp(f))
    el.setAttribute('y', top); el.setAttribute('height', y0 + h + 20 - top)
  }

  // the app's heating curve (diagram 'heating-curve'), placed with o = { x, y, s, t }
  const PTS = [[55, 200], [85, 170], [135, 170], [255, 110], [345, 110], [375, 80]]
  const place = (o) => PTS.map(([x, y]) => [o.x + (x - 50) * o.s, o.y + (y - 20) * o.t])
  const str = (pts) => pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')
  const axes = (o, fs = 30) => {
    const x0 = o.x, y0 = o.y + 190 * o.t, x1 = o.x + 335 * o.s + 24, y1 = o.y - 16
    return `<line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}" stroke="#a3abbd" stroke-width="4" marker-end="url(#mk-muted)"/>
      <line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}" stroke="#a3abbd" stroke-width="4" marker-end="url(#mk-muted)"/>
      <text x="${x1}" y="${y0 + fs + 14}" text-anchor="end" font-size="${fs}" font-weight="800" class="f-muted">heat added</text>
      <g transform="translate(${x0 - 18} ${y1 + 6}) rotate(-90)"><text text-anchor="end" font-size="${fs}" font-weight="800" class="f-muted">temperature</text></g>`
  }
  // the first k segments of a curve (k from 0 to 5)
  const partial = (pts, k) => {
    k = clamp(k, 0, 5); const n = Math.floor(k), out = pts.slice(0, n + 1)
    if (n < 5) { const a = pts[n], b = pts[n + 1], f = k - n; out.push([lerp(a[0], b[0], f), lerp(a[1], b[1], f)]) }
    return out
  }

  // ---------- intro artwork: two faint heating curves at the far edges ----------
  const iL = place({ x: 40, y: 660, s: 0.6, t: 1.2 }), iR = place({ x: 1680, y: 660, s: 0.6, t: 1.2 })
  EZ.intro = {
    chips: [['1@0.4', 'Heating curve'], ['1@0.6', 'q = n × ΔH'], ['1@0.8', 'Endo vs. exo']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.22">
      <polyline points="${str(iL)}" fill="none" stroke="${PUR}" stroke-width="8" stroke-linejoin="round" data-at="in+0.3" data-fx="draw" data-dur="2"/>
      <polyline points="${str(iR)}" fill="none" stroke="${TEAL}" stroke-width="8" stroke-linejoin="round" data-at="in+0.6" data-fx="draw" data-dur="2"/></svg>`,
  }

  // ---------- hook: the pot that won't get hotter ----------
  const flames = [700, 775, 850, 925, 1000].map((x, i) => `<path class="x-fl${i}" d="M${x} 840 C${x - 24} 820 ${x - 10} 800 ${x} 780 C${x + 10} 800 ${x + 24} 820 ${x} 840 Z" fill="${i % 2 ? GOLD : WARM}"/>`).join('')
  const bubbles = Array.from({ length: 8 }, (_, i) => `<circle class="x-bb${i}" r="${8 + (i % 3) * 4}" fill="none" stroke="#b4f3ec" stroke-width="3"/>`).join('')
  const VAP = [[680, 420], [790, 350], [900, 440], [1000, 360], [740, 480], [960, 500]]
  const vapor = VAP.map((_, i) => `<g class="x-m${i}">${ball(0, 0, 22, 'teal')}</g>`).join('')
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Picture it</div><h2 class="h1" data-at="0">Heat in, temperature stuck</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.3" data-fx="fade">
          <rect x="620" y="842" width="460" height="20" rx="8" fill="#646c82"/>
          <path d="M630 560 L1070 560 L1050 790 L650 790 Z" fill="rgba(238,240,247,.10)" stroke="#c9cee0" stroke-width="5" stroke-linejoin="round"/>
          <path d="M638 640 L1062 640 L1050 786 L650 786 Z" fill="${TEAL}" opacity=".35"/>
          <rect x="600" y="548" width="40" height="18" rx="8" fill="#c9cee0"/><rect x="1060" y="548" width="40" height="18" rx="8" fill="#c9cee0"/>
          ${thermo(1330, 420, 360, 'x-ht')}</g>
        <g class="x-flames">${flames}</g>
        <g class="x-bubs">${bubbles}</g>
        <g class="x-vap">${vapor}</g>
        <text x="1385" y="514" font-size="40" font-weight="900" class="f-gold" data-at="2@0.3" data-fx="fade">100 °C</text>
        <text x="1385" y="566" font-size="32" font-weight="900" class="f-warm" data-at="2@0.7" data-fx="fade">stuck</text>
        <g data-at="3" data-out="4" data-fx="pop"><text x="850" y="470" text-anchor="middle" font-size="130" font-weight="900" class="f-pri">?</text></g>
        <text x="1110" y="370" font-size="32" font-weight="900" class="f-teal" data-at="4@0.4" data-fx="fade">into the gas phase</text>
      </svg>
      <div class="banner" style="top:900px" data-at="4" data-out="5" data-fx="pop">Energy goes into <span class="teal">pulling molecules apart</span></div>
      <div class="banner" style="top:900px" data-at="5" data-fx="pop">It is <span class="warm">not</span> making them faster</div>`,
    update(c) {
      const b = c.b, t = c.t
      const fire = c.seg(b[0].start, b[0].start + 0.5), big = 1 + 0.25 * eio(c.seg(b[1].start, b[1].start + 0.8))
      c.$('.x-flames').style.opacity = fire
      for (let i = 0; i < 5; i++) {
        const s = big * (1 + 0.08 * Math.sin(t * 9 + i * 1.9)), x = 700 + 75 * i
        c.$('.x-fl' + i).setAttribute('transform', `translate(${x} 840) scale(1 ${s.toFixed(3)}) translate(${-x} -840)`)
      }
      c.$('.x-bubs').style.opacity = c.seg(b[0].start + 0.3, b[0].start + 0.9)
      for (let i = 0; i < 8; i++) {
        const ph = (t * 0.55 + i * 0.37) % 1, el = c.$('.x-bb' + i)
        el.setAttribute('cx', 680 + ((i * 53) % 340)); el.setAttribute('cy', 770 - 120 * ph)
        el.style.opacity = Math.sin(Math.PI * ph)
      }
      level(c, '.x-ht', 420, 360, 0.8)
      const up = eio(c.seg(b[4].start, b[4].end + 0.6))
      c.$('.x-vap').style.opacity = c.seg(b[4].start, b[4].start + 0.3)
      VAP.forEach(([x, y], i) => {
        const x0 = 700 + i * 60, y0 = 640
        c.$('.x-m' + i).setAttribute('transform', `translate(${lerp(x0, x, up).toFixed(1)} ${lerp(y0, y, up).toFixed(1)})`)
      })
    },
  })

  // ---------- the heating curve, drawn segment by segment ----------
  const O = { x: 200, y: 330, s: 4.0, t: 2.8 }, P = place(O)
  EZ.scene('curve', {
    html: `<div class="kicker" data-at="in" data-fx="left">Heating curve</div><h2 class="h1" data-at="0">Heat in, temperature up?</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1" data-fx="fade">${axes(O, 34)}</g>
        <g data-at="7" data-fx="fade"><line x1="${P[1][0]}" y1="${P[1][1]}" x2="${P[2][0]}" y2="${P[2][1]}" stroke="${TEAL}" stroke-width="22" stroke-linecap="round" opacity=".45"/>
          <line x1="${P[3][0]}" y1="${P[3][1]}" x2="${P[4][0]}" y2="${P[4][1]}" stroke="${TEAL}" stroke-width="22" stroke-linecap="round" opacity=".45"/></g>
        <polyline class="x-cv" fill="none" stroke="${PUR}" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>
        <circle class="x-tip" r="13" fill="${GOLD}"/>
        <text x="280" y="832" class="x-lab f-muted" data-at="2@0.3" data-fx="fade">solid</text>
        <text x="440" y="712" text-anchor="middle" class="x-lab f-teal" data-at="3@0.4" data-fx="fade">melting (0 °C)</text>
        <text x="780" y="704" class="x-lab f-muted" data-at="4@0.4" data-fx="fade">liquid</text>
        <text x="1200" y="544" text-anchor="middle" class="x-lab f-teal" data-at="5@0.4" data-fx="fade">boiling (100 °C)</text>
        <text x="1520" y="500" class="x-lab f-muted" data-at="6@0.4" data-fx="fade">gas</text>
        <text x="440" y="790" text-anchor="middle" font-size="30" font-weight="900" class="f-gold" data-at="7@0.3" data-fx="fade">phase change</text>
        <text x="1200" y="622" text-anchor="middle" font-size="30" font-weight="900" class="f-gold" data-at="7@0.3" data-fx="fade">phase change</text>
        <g data-at="2" data-fx="fade">${thermo(1740, 360, 420, 'x-ct')}</g>
      </svg>`,
    update(c) {
      const b = c.b
      let k = 0
      for (let i = 0; i < 5; i++) k += eio(c.seg(b[i + 2].start + 0.1, b[i + 2].end))
      const pts = partial(P, k), tip = pts[pts.length - 1]
      c.$('.x-cv').setAttribute('points', str(pts))
      c.$('.x-cv').style.opacity = c.seg(b[2].start, b[2].start + 0.2)
      c.$('.x-tip').setAttribute('cx', tip[0]); c.$('.x-tip').setAttribute('cy', tip[1])
      c.$('.x-tip').style.opacity = c.seg(b[2].start, b[2].start + 0.2) * (1 - c.seg(b[7].start, b[7].start + 0.4))
      level(c, '.x-ct', 360, 420, 0.1 + 0.65 * (P[0][1] - tip[1]) / (P[0][1] - P[5][1]))
    },
  })

  // ---------- why the temperature stops: energy goes into the attractions ----------
  const GRID = []; for (let r = 0; r < 3; r++) for (let q = 0; q < 4; q++) GRID.push([300 + q * 120, 500 + r * 120])
  const LINKS = []; GRID.forEach((_, i) => { if (i % 4 < 3) LINKS.push([i, i + 1]); if (i < 8) LINKS.push([i, i + 4]) })
  EZ.scene('why', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Why it stays flat</div><h2 class="h1" data-at="0">Where the energy goes</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.4" data-fx="fade">
          <g class="x-links">${LINKS.map((_, j) => `<line class="x-l${j}" stroke="${GOLD}" stroke-width="6" stroke-dasharray="10 9" stroke-linecap="round"/>`).join('')}</g>
          ${GRID.map((_, i) => `<g class="x-w${i}">${ball(0, 0, 34, 'pur')}</g>`).join('')}
          ${thermo(840, 380, 400, 'x-yt')}</g>
        <g class="x-heat">${[540, 620, 700].map((y) => `<line x1="70" y1="${y}" x2="170" y2="${y}" stroke="${WARM}" stroke-width="8" stroke-dasharray="14 10" marker-end="url(#mk-warm)"/>`).join('')}
          <text x="40" y="410" font-size="30" font-weight="900" class="f-warm">energy in</text></g>
        <text x="840" y="900" text-anchor="middle" font-size="30" font-weight="900" class="f-teal" data-at="3@0.4" data-fx="fade">steady</text>
      </svg>
      <div class="x-big" style="left:940px;top:330px;width:800px" data-at="1" data-fx="right"><b style="font-size:36px">Overcomes <span class="warm">intermolecular attractions</span></b><span>where the added energy goes</span></div>
      <div class="x-big" style="left:940px;top:500px;width:800px" data-at="2" data-fx="right"><b>Average kinetic energy: <em class="bad">not raised</em></b><span>the molecules do not speed up</span></div>
      <div class="x-big" style="left:940px;top:670px;width:800px;border-color:rgba(60,199,188,.8)" data-at="3" data-fx="right"><b class="teal">Temperature stays constant</b><span>for a pure substance, during a phase change</span></div>`,
    update(c) {
      const b = c.b, t = c.t
      const sp = eio(c.seg(b[1].start + 0.3, b[1].end + 0.5)), f = 1 + 0.35 * sp
      const pos = GRID.map(([x, y], i) => [480 + (x - 480) * f + 5 * Math.sin(t * 7 + i * 1.7), 620 + (y - 620) * f + 5 * Math.cos(t * 6 + i * 2.3)])
      pos.forEach(([x, y], i) => c.$('.x-w' + i).setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`))
      LINKS.forEach(([a, bb], j) => {
        const l = c.$('.x-l' + j)
        l.setAttribute('x1', pos[a][0].toFixed(1)); l.setAttribute('y1', pos[a][1].toFixed(1))
        l.setAttribute('x2', pos[bb][0].toFixed(1)); l.setAttribute('y2', pos[bb][1].toFixed(1))
      })
      c.$('.x-links').style.opacity = 1 - sp
      const h = c.$('.x-heat'), on = c.seg(b[1].start, b[1].start + 0.3) * (1 - c.seg(b[3].end, b[3].end + 0.4))
      h.style.opacity = on
      h.querySelectorAll('line').forEach((l) => l.setAttribute('stroke-dashoffset', -24 * clamp(t - b[1].start, 0, b[3].end - b[1].start)))
      level(c, '.x-yt', 380, 400, 0.5)
    },
  })

  // ---------- direction: absorbed going up, released coming down ----------
  const box = (x, name, inner) => `<rect x="${x}" y="470" width="400" height="220" rx="28" fill="rgba(36,40,56,.92)" stroke="#3a4060" stroke-width="3"/>
    <text x="${x + 200}" y="516" text-anchor="middle" font-size="32" font-weight="900" class="f-muted">${name}</text>${inner}`
  const solid = [0, 1, 2, 3, 4].flatMap((q) => [0, 1].map((r) => ball(270 + q * 46, 590 + r * 46, 22, 'pur'))).join('')
  const liquid = [[880, 640], [925, 650], [968, 636], [1012, 648], [1050, 630], [905, 600], [990, 600]].map(([x, y]) => ball(x, y, 22, 'pur')).join('')
  const gas = [[1420, 570], [1530, 640], [1640, 560], [1700, 650], [1470, 655]].map(([x, y]) => ball(x, y, 22, 'pur')).join('')
  EZ.scene('direction', {
    html: `<div class="kicker" data-at="in" data-fx="left">Direction</div><h2 class="h1" data-at="0">Absorbed or released?</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.3" data-fx="fade">${box(160, 'solid', solid)}${box(760, 'liquid', liquid)}${box(1360, 'gas', gas)}</g>
        <path d="M400 462 Q660 340 900 462" fill="none" stroke="${WARM}" stroke-width="9" marker-end="url(#mk-warm)" data-at="1" data-fx="draw"/>
        <text x="650" y="380" text-anchor="middle" class="x-lab f-warm" data-at="1" data-fx="fade">melting</text>
        <path d="M1000 462 Q1260 340 1500 462" fill="none" stroke="${WARM}" stroke-width="9" marker-end="url(#mk-warm)" data-at="1@0.5" data-fx="draw"/>
        <text x="1250" y="380" text-anchor="middle" class="x-lab f-warm" data-at="1@0.5" data-fx="fade">boiling</text>
        <path d="M900 698 Q660 820 400 698" fill="none" stroke="${TEAL}" stroke-width="9" marker-end="url(#mk-teal)" data-at="3" data-fx="draw"/>
        <text x="650" y="800" text-anchor="middle" class="x-lab f-teal" data-at="3" data-fx="fade">freezing</text>
        <path d="M1500 698 Q1260 820 1000 698" fill="none" stroke="${TEAL}" stroke-width="9" marker-end="url(#mk-teal)" data-at="3@0.5" data-fx="draw"/>
        <text x="1250" y="800" text-anchor="middle" class="x-lab f-teal" data-at="3@0.5" data-fx="fade">condensing</text>
      </svg>
      <div class="x-big" style="left:120px;top:860px;width:770px;border-color:rgba(243,167,100,.8)" data-at="2" data-fx="pop"><b class="warm">Energy absorbed</b><span>melting, boiling ${ARR} endothermic</span></div>
      <div class="x-big" style="left:970px;top:860px;width:770px;border-color:rgba(60,199,188,.8)" data-at="4" data-fx="pop"><b class="teal">Energy released</b><span>freezing, condensing ${ARR} exothermic</span></div>`,
  })

  // ---------- q = n × ΔH ----------
  const tile = (i, at, col, L, N, D) => `<div class="x-tile" style="left:${120 + i * 580}px;border-color:${col}" data-at="${at}" data-fx="pop"><div class="L" style="color:${col}">${L}</div><div class="N">${N}</div><div class="D">${D}</div></div>`
  EZ.scene('equation', {
    html: `<div class="kicker" data-at="in" data-fx="left">The equation</div><h2 class="h1" data-at="in+0.2">Heat for a phase change</h2>
      <div class="x-eq" data-at="0@0.35" data-fx="pop"><span class="x-e0 gold">q</span> = <span class="x-e1 pri">n</span> × <span class="x-e2 teal">ΔH</span></div>
      ${tile(0, '1', GOLD, 'q', 'heat', 'for the phase change')}
      ${tile(1, '1@0.15', PUR, 'n', 'moles', 'mol')}
      ${tile(2, '1@0.5', TEAL, 'ΔH', 'molar enthalpy', 'of the phase change (kJ/mol)')}
      <div class="x-big" style="left:120px;top:790px;width:780px;border-color:rgba(60,199,188,.7)" data-at="2" data-fx="pop"><b>Water: <span class="teal">ΔH<sub>fus</sub> = 6.01 kJ/mol</span></b><span>fusion = melting</span></div>
      <div class="x-big" style="left:960px;top:790px;width:780px;border-color:rgba(243,167,100,.7)" data-at="3" data-fx="pop"><b>Water: <span class="warm">ΔH<sub>vap</sub> = 40.7 kJ/mol</span></b><span>vaporization = boiling</span></div>`,
    update(c) {
      const b = c.b, win = [[b[1].start, b[1].start + 1.2], [b[1].start + 0.1, b[1].start + 0.4 * (b[1].end - b[1].start)], [b[1].start + 0.5 * (b[1].end - b[1].start), b[1].end]]
      win.forEach(([a, z], i) => {
        const on = c.seg(a, a + 0.3) * (1 - c.seg(z, z + 0.3))
        c.$('.x-e' + i).style.transform = `scale(${1 + 0.18 * on})`
      })
    },
  })

  // ---------- opposite processes: same size, opposite sign ----------
  const pair = (up, down, hi, lo, formula) => `<svg style="position:absolute;left:0;top:96px" width="810" height="220" viewBox="0 0 810 220">
      <text x="60" y="52" font-size="32" font-weight="900" class="f-muted">${hi}</text><line x1="180" y1="40" x2="400" y2="40" stroke="#eef0f7" stroke-width="6"/>
      <text x="60" y="192" font-size="32" font-weight="900" class="f-muted">${lo}</text><line x1="180" y1="180" x2="400" y2="180" stroke="#eef0f7" stroke-width="6"/>
      <line x1="250" y1="172" x2="250" y2="56" stroke="${WARM}" stroke-width="10" marker-end="url(#mk-warm)"/>
      <line x1="330" y1="48" x2="330" y2="164" stroke="${TEAL}" stroke-width="10" marker-end="url(#mk-teal)"/>
      <text x="440" y="96" font-size="34" font-weight="900" class="f-warm">${up}: +</text>
      <text x="440" y="148" font-size="34" font-weight="900" class="f-teal">${down}: −</text></svg>
    <div style="position:absolute;left:0;width:100%;top:322px;text-align:center;font-size:44px;font-weight:900">${formula}</div>`
  EZ.scene('sign', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Signs</div><h2 class="h1" data-at="in+0.2">Reverse it, flip the sign</h2>
      <div class="banner" style="top:296px" data-at="0" data-fx="pop">Opposite processes: <span class="gold">equal size</span>, <span class="warm">opposite sign</span></div>
      <div class="card" style="left:120px;top:440px;width:810px;height:400px" data-at="1"><h3 style="font-size:34px">Liquid and gas</h3>${pair('vaporization', 'condensation', 'gas', 'liquid', 'ΔH<sub>cond</sub> = −ΔH<sub>vap</sub>')}</div>
      <div class="card" style="left:990px;top:440px;width:810px;height:400px" data-at="2"><h3 style="font-size:34px">Solid and liquid</h3>${pair('fusion', 'freezing', 'liquid', 'solid', 'ΔH<sub>freezing</sub> = −ΔH<sub>fus</sub>')}</div>
      <div class="x-big" style="left:120px;top:870px;width:1680px;box-sizing:border-box;text-align:center;border-color:rgba(141,141,240,.8)" data-at="3" data-fx="pop"><b>ΔH<sub>fus</sub> = +10.0 kJ/mol &nbsp;${ARR}&nbsp; ΔH<sub>freezing</sub> = <span class="warm">−10.0 kJ/mol</span></b></div>`,
  })

  // ---------- why the boiling plateau is longer ----------
  const O2 = { x: 170, y: 380, s: 2.2, t: 2.1 }, P2 = place(O2)
  const loose = [[1110, 830], [1160, 830], [1210, 830], [1135, 787], [1185, 787], [1235, 812], [1085, 790]].map(([x, y]) => ball(x, y, 24, 'pur')).join('')
  const apart = [[1480, 800], [1610, 760], [1745, 805], [1545, 885], [1700, 885]].map(([x, y]) => ball(x, y, 24, 'pur')).join('')
  EZ.scene('longer', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Plateau lengths</div><h2 class="h1" data-at="in+0.2">Why boiling takes longer</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0" data-fx="fade">${axes(O2, 28)}<polyline points="${str(P2)}" fill="none" stroke="${PUR}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/></g>
        <g data-at="1" data-fx="fade"><path d="M${P2[1][0]} ${P2[1][1] + 26} v14 H${P2[2][0]} v-14" fill="none" stroke="${TEAL}" stroke-width="5"/>
          <text x="${(P2[1][0] + P2[2][0]) / 2}" y="${P2[1][1] + 76}" text-anchor="middle" font-size="28" font-weight="900" class="f-teal">melting</text></g>
        <g data-at="1@0.4" data-fx="fade"><path d="M${P2[3][0]} ${P2[3][1] - 26} v-14 H${P2[4][0]} v14" fill="none" stroke="${WARM}" stroke-width="5"/>
          <text x="${(P2[3][0] + P2[4][0]) / 2}" y="${P2[3][1] - 54}" text-anchor="middle" font-size="28" font-weight="900" class="f-warm">boiling: much longer</text></g>
      </svg>
      <div class="x-big" style="left:1000px;top:320px;width:800px;height:250px;box-sizing:border-box" data-at="2" data-fx="right"><b>Energy per mole (water)</b>
        <svg width="740" height="170" viewBox="0 0 740 170" style="display:block;margin-top:8px">
          <text x="0" y="56" font-size="32" font-weight="900" class="f-teal">ΔH${sub('fus')}</text><g data-at="2@0.2" data-fx="grow"><rect x="130" y="28" width="${(6.01 * 14).toFixed(1)}" height="40" rx="10" fill="${TEAL}"/></g>
          <text x="${130 + 6.01 * 14 + 16}" y="58" font-size="30" font-weight="900" data-at="2@0.3" data-fx="fade">6.01 kJ/mol</text>
          <text x="0" y="136" font-size="32" font-weight="900" class="f-warm">ΔH${sub('vap')}</text><g data-at="2@0.5" data-fx="grow"><rect x="130" y="108" width="${(40.7 * 14).toFixed(1)}" height="40" rx="10" fill="${WARM}"/></g>
          <text x="${130 + 40.7 * 14 - 16}" y="138" text-anchor="end" font-size="30" font-weight="900" class="f-dark" data-at="2@0.7" data-fx="fade">40.7 kJ/mol</text></svg></div>
      <div class="card" style="left:1000px;top:610px;width:380px;height:320px" data-at="3"><h3 style="font-size:34px;padding:24px 30px 0">Melting</h3>
        <div style="position:absolute;left:30px;top:80px;font-size:26px;font-weight:800;color:var(--muted)">loosens; still in contact</div></div>
      <div class="card" style="left:1420px;top:610px;width:380px;height:320px" data-at="4"><h3 style="font-size:34px;padding:24px 30px 0">Boiling</h3>
        <div style="position:absolute;left:30px;top:80px;font-size:26px;font-weight:800;color:var(--muted)">separates completely</div></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="3@0.3" data-fx="fade">${loose}</g><g data-at="4@0.3" data-fx="fade">${apart}</g></svg>`,
  })

  // ---------- worked example: melting 36.0 g of ice ----------
  const CUBES = [[300, 690], [400, 715], [490, 690], [350, 790], [455, 795]]
  EZ.scene('example', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Melting ice</h2>
      <div class="card" style="left:120px;top:300px;width:660px;height:650px" data-at="1"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <text x="160" y="370" font-size="34" font-weight="900" class="f-teal" data-at="1@0.2" data-fx="fade">Ice: 36.0 g at 0 °C</text>
        <text x="160" y="424" font-size="34" font-weight="900" class="f-warm" data-at="1@0.5" data-fx="fade">ΔH${sub('fus')}<tspan dy="-9"> = 6.01 kJ/mol</tspan></text>
        <g data-at="1@0.3" data-fx="fade"><path d="M220 560 L220 880 Q220 900 240 900 L560 900 Q580 900 580 880 L580 560" fill="none" stroke="#c9cee0" stroke-width="5"/>
          <rect class="x-wat" x="224" y="740" width="352" height="156" rx="14" fill="${TEAL}" opacity=".35"/>
          ${thermo(690, 480, 330, 'x-et', TEAL)}</g>
        <g class="x-ice">${CUBES.map((_, i) => `<g class="x-c${i}"><rect x="-38" y="-38" width="76" height="76" rx="14" fill="#d8f6f2" stroke="#9fe3db" stroke-width="3" opacity=".9"/></g>`).join('')}</g>
        <text x="690" y="912" text-anchor="middle" font-size="30" font-weight="900" class="f-teal" data-at="1@0.8" data-fx="fade">0 °C</text>
        <g class="x-heat2">${[640, 720, 800].map((y) => `<line x1="140" y1="${y}" x2="206" y2="${y}" stroke="${WARM}" stroke-width="8" stroke-dasharray="12 9" marker-end="url(#mk-warm)"/>`).join('')}</g>
      </svg>
      <div class="x-step" style="top:300px" data-at="2" data-fx="right"><div class="H"><i>1</i>Convert to moles</div>
        <div class="B" data-at="3@0.3" data-fx="fade">n = 36.0 g ÷ 18.02 g/mol = <span class="teal">2.00 mol</span></div></div>
      <div class="x-step" style="top:500px" data-at="4" data-fx="right"><div class="H"><i>2</i>Multiply by ΔH<sub>fus</sub></div>
        <div class="B" data-at="5@0.3" data-fx="fade">q = 2.00 mol × 6.01 kJ/mol = <span class="good">12.0 kJ</span></div></div>
      <div class="x-step" style="top:700px;border-color:rgba(76,199,129,.8)" data-at="6" data-fx="right"><div class="H">Melting absorbs energy</div>
        <div class="B"><span class="good">12.0 kJ</span> absorbed</div></div>`,
    update(c) {
      const b = c.b, m = eio(c.seg(b[6].start, b[6].end + 0.4))
      c.$('.x-ice').style.opacity = c.seg(b[1].start + 0.3, b[1].start + 0.8)
      CUBES.forEach(([x, y], i) => c.$('.x-c' + i).setAttribute('transform', `translate(${x} ${y + 40 * m}) scale(${(1 - 0.92 * m).toFixed(3)})`))
      c.$('.x-ice').querySelectorAll('rect').forEach((r) => r.setAttribute('opacity', (0.9 * (1 - m * m)).toFixed(3)))
      const top = lerp(740, 700, m)
      c.$('.x-wat').setAttribute('y', top); c.$('.x-wat').setAttribute('height', 896 - top)
      const h = c.$('.x-heat2')
      h.style.opacity = c.seg(b[6].start, b[6].start + 0.3)
      h.querySelectorAll('line').forEach((l) => l.setAttribute('stroke-dashoffset', -21 * clamp(c.t - b[6].start, 0, b[6].end - b[6].start + 0.5)))
      level(c, '.x-et', 480, 330, 0.3)
    },
  })

  // ---------- trick: multi-step heating problems ----------
  const O3 = { x: 170, y: 420, s: 2.3, t: 2.0 }, P3 = place(O3)
  const NUM = [[196, 708], [308, 655], [482, 600], [745, 535], [866, 488]]
  const ROWS = [['Warm the ice', 'mcΔT', 'warm'], ['Melt it', 'nΔH<sub>fus</sub>', 'teal'], ['Warm the water', 'mcΔT', 'warm'], ['Boil it', 'nΔH<sub>vap</sub>', 'teal'], ['Warm the steam', 'mcΔT', 'warm']]
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Multi-step heating problems</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <text x="170" y="352" font-size="36" font-weight="900" class="f-gold" data-at="1@0.3" data-fx="fade">Ice at −10 °C, all the way to steam</text>
        <g data-at="1@0.4" data-fx="fade">${axes(O3, 28)}</g>
        <polyline points="${str(P3)}" fill="none" stroke="${PUR}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" data-at="1@0.5" data-fx="draw"/>
        <g data-at="4" data-fx="fade">${[0, 1, 2, 3, 4].map((i) => `<line x1="${P3[i][0]}" y1="${P3[i][1]}" x2="${P3[i + 1][0]}" y2="${P3[i + 1][1]}" stroke="${i % 2 ? TEAL : WARM}" stroke-width="11" stroke-linecap="round"/>`).join('')}</g>
        ${NUM.map(([x, y], i) => `<g data-at="3@${(0.05 + i * 0.19).toFixed(2)}" data-fx="pop"><circle cx="${x}" cy="${y}" r="22" fill="#5b5bd6"/><text x="${x}" y="${y + 9}" text-anchor="middle" font-size="26" font-weight="900">${i + 1}</text></g>`).join('')}
      </svg>
      ${ROWS.map(([a, f, col], i) => `<div class="x-row" style="top:${330 + i * 84}px" data-at="3@${(0.05 + i * 0.19).toFixed(2)}" data-fx="right"><i>${i + 1}</i>${a}<em class="${col}" data-at="4@${(0.1 + i * 0.12).toFixed(2)}" data-fx="fade">${f}</em></div>`).join('')}
      <div class="x-row" style="top:760px;height:80px;line-height:76px;border-color:rgba(242,196,67,.8);font-size:38px" data-at="5" data-fx="pop">Add them up: <span class="gold">q<sub>1</sub> + q<sub>2</sub> + q<sub>3</sub> + q<sub>4</sub> + q<sub>5</sub></span></div>
      <div class="banner" style="top:880px" data-at="6" data-fx="pop">Slopes: <span class="warm">mcΔT</span> &nbsp;·&nbsp; plateaus: <span class="teal">nΔH</span> &nbsp;·&nbsp; watch <span class="gold">J vs. kJ</span>!</div>`,
  })

  // ---------- example from the book: melt, then warm ----------
  EZ.scene('twostep', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Example</div><h2 class="h1" data-at="in+0.2">Melt, then warm</h2>
      <div class="x-step" style="left:120px;width:1680px;top:310px" data-at="0" data-fx="right"><div class="H"><i>1</i>Melt 18.0 g of ice at 0 °C (a plateau)</div>
        <div class="B" data-at="0@0.5" data-fx="fade">q<sub>1</sub> = nΔH<sub>fus</sub> = 1.00 mol × 6.01 kJ/mol = <span class="teal">6.01 kJ</span></div></div>
      <div class="x-step" style="left:120px;width:1680px;top:510px" data-at="1" data-fx="right"><div class="H"><i>2</i>Warm the water to 25.0 °C (a slope)</div>
        <div class="B" data-at="1@0.3" data-fx="fade">q<sub>2</sub> = mcΔT = 18.0 g × 4.18 J/(g·°C) × 25.0 °C = <span class="warm">1881 J</span><span data-at="1@0.7" data-fx="fade"> = <span class="teal">1.88 kJ</span></span></div></div>
      <div class="x-step" style="left:120px;width:1680px;top:720px;border-color:rgba(76,199,129,.8)" data-at="2" data-fx="right"><div class="H"><i>3</i>Total</div>
        <div class="B">6.01 kJ + 1.88 kJ = <span class="good">7.89 kJ</span></div></div>`,
  })

  // ---------- try it: 0.500 mol of steam condenses ----------
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1">How much heat is released?</h2>
      <div class="x-gv" style="left:120px" data-at="1@0.3" data-fx="pop"><div class="N">steam</div><div class="V">0.500 mol</div></div>
      <div class="x-gv" style="left:695px" data-at="1@0.45" data-fx="pop"><div class="N">condenses at</div><div class="V">100 °C</div></div>
      <div class="x-gv" style="left:1270px" data-at="1@0.75" data-fx="pop"><div class="N">ΔH<sub>vap</sub></div><div class="V warm">40.7 kJ/mol</div></div>
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="700" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="700" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 700)"/>
        <text class="x-num" x="960" y="726" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="830" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="x-ans" data-at="3" data-fx="pop"><div class="ok">${CHECK}</div><div class="A good">20.4 kJ released</div>
        <div class="W" data-at="4" data-fx="fade">q = 0.500 mol × 40.7 kJ/mol = 20.4 kJ</div>
        <div class="K" data-at="5" data-fx="fade">condensing reverses boiling: ΔH<sub>cond</sub> = −40.7 kJ/mol</div></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.3, b[3].start + 0.8))
      c.$('.x-ans').style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.45 * win})`
    },
  })

  // ---------- recap ----------
  const R = place({ x: 60, y: 30, s: 0.95, t: 0.72 })
  const r1 = `<svg width="440" height="190" viewBox="0 0 440 190"><polyline points="${str(R)}" fill="none" stroke="${PUR}" stroke-width="7" stroke-linejoin="round"/>
    <line x1="${R[1][0]}" y1="${R[1][1]}" x2="${R[2][0]}" y2="${R[2][1]}" stroke="${TEAL}" stroke-width="14" stroke-linecap="round" opacity=".6"/>
    <line x1="${R[3][0]}" y1="${R[3][1]}" x2="${R[4][0]}" y2="${R[4][1]}" stroke="${TEAL}" stroke-width="14" stroke-linecap="round" opacity=".6"/></svg>`
  const r2 = `<svg width="440" height="190" viewBox="0 0 440 190"><text x="220" y="115" text-anchor="middle" font-size="88" font-weight="900"><tspan class="f-gold">q</tspan> = <tspan class="f-pri">n</tspan> × <tspan class="f-teal">ΔH</tspan></text></svg>`
  const r3 = `<svg width="440" height="190" viewBox="0 0 440 190"><line x1="100" y1="160" x2="340" y2="160" stroke="#eef0f7" stroke-width="5"/><line x1="100" y1="30" x2="340" y2="30" stroke="#eef0f7" stroke-width="5"/>
    <line x1="180" y1="152" x2="180" y2="46" stroke="${WARM}" stroke-width="10" marker-end="url(#mk-warm)"/><line x1="260" y1="38" x2="260" y2="144" stroke="${TEAL}" stroke-width="10" marker-end="url(#mk-teal)"/>
    <text x="140" y="108" text-anchor="end" font-size="44" font-weight="900" class="f-warm">+</text><text x="300" y="108" font-size="44" font-weight="900" class="f-teal">−</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Temperature stays<br><span class="teal">constant</span> during<br>a phase change</p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Melting, boiling:<br><span class="warm">absorb</span> energy<br>Freezing, condensing:<br><span class="teal">release</span> it</p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Opposite phase<br>changes: <span class="gold">same size</span>,<br><span class="warm">opposite sign</span></p></div>`,
  })
})()
