// Pictures for chem-7.3 "Writing K and Q". One EZ.scene per scene id in script.mjs.
// Every expression shown is the lesson's own (app/src/content/chem/u7.ts and chem/book.ts): the
// general aA + bB form, the SO2 / SO3 quick check, CaCO3, the ammonia-in-water example, AgCl and the
// N2 + 3H2 try question. The Q-to-K track and the lumps carry no numbers.
(() => {
  const { clamp, lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-fr{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 .1em;line-height:1.18}
    .x-fr>span{display:block;padding:0 .16em;white-space:nowrap}
    .x-fr .x-d{border-top:.06em solid var(--text);padding-top:.05em}
    sub sub{font-size:.8em;top:.1em}
    .x-eqa{display:inline-block;width:1.2em;height:.72em;margin:0 .22em;vertical-align:-.04em;overflow:visible}
    .x-eq{position:absolute;left:0;width:1920px;text-align:center;font-weight:900;white-space:nowrap}
    .x-in{position:absolute;left:0;right:0;text-align:center;font-weight:900;white-space:nowrap}
    .x-co{color:var(--warm)}
    .x-s{position:relative;display:inline-block}
    .x-st{position:absolute;left:-8px;right:-8px;top:48%;height:7px;border-radius:4px;background:var(--bad)}
    .x-tag{position:absolute;height:64px;padding:0 24px;border-radius:32px;font-size:32px;font-weight:900;line-height:60px;white-space:nowrap}
    .x-tag.t{background:rgba(60,199,188,.16);border:2px solid rgba(60,199,188,.7);color:var(--accent)}
    .x-tag.p{background:rgba(141,141,240,.16);border:2px solid rgba(141,141,240,.7);color:var(--primary)}
    .x-tag.w{background:rgba(243,167,100,.16);border:2px solid rgba(243,167,100,.7);color:var(--warm)}
    .x-tag.g{background:rgba(242,196,67,.16);border:2px solid rgba(242,196,67,.7);color:var(--gold)}
    .x-note{position:absolute;top:820px;width:810px;height:110px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line);font-size:38px;font-weight:900;line-height:106px;text-align:center;white-space:nowrap}
    .x-line{position:absolute;left:0;width:1920px;text-align:center;font-size:40px;font-weight:900;white-space:nowrap}
    .x-row{position:absolute;left:40px;right:40px;height:150px;border-radius:24px;text-align:center;font-weight:900;white-space:nowrap;line-height:146px}
    .x-row.bad{background:rgba(240,112,122,.1);border:2px solid rgba(240,112,122,.6)}
    .x-row.ok{background:rgba(76,199,129,.1);border:2px solid rgba(76,199,129,.6)}
    .x-row .ic{position:absolute;left:22px;top:45px;width:56px;height:56px}
    .x-stamp{position:absolute} .x-stamp div{transform:rotate(-9deg);padding:4px 30px;border:8px solid var(--bad);border-radius:18px;color:var(--bad);font-size:64px;font-weight:900;letter-spacing:.06em;background:rgba(14,16,24,.85);white-space:nowrap}
    .x-opt{position:absolute;width:820px;height:130px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;padding:0 96px 0 120px;font-size:48px;font-weight:900}
    .x-opt .l{position:absolute;left:26px;top:31px;width:60px;height:60px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:32px;font-weight:900;line-height:56px;text-align:center;color:var(--muted)}
    .x-opt .ok{position:absolute;right:20px;top:29px;width:64px;height:64px}
    .x-opt span{white-space:nowrap}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', WARM = '#f3a764', TXT = '#eef0f7', GOLD = '#f2c443', PRI = '#8d8df0', BAD = '#f0707a'
  const CHECK = '<svg viewBox="0 0 64 64" style="display:block;width:100%;height:100%"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const CROSS = '<svg viewBox="0 0 64 64" style="display:block;width:100%;height:100%"><circle cx="32" cy="32" r="30" fill="#f0707a"/><path d="M21 21l22 22M43 21L21 43" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round"/></svg>'
  // the equilibrium double arrow, drawn (the font has no good ⇌)
  const EQ = '<svg class="x-eqa" viewBox="0 0 64 36"><g fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12H58L47 3"/><path d="M60 24H6L17 33"/></g></svg>'
  const fr = (top, bot) => `<span class="x-fr"><span class="x-n">${top}</span><span class="x-d">${bot}</span></span>`
  const s = (t) => `<sub>${t}</sub>`
  const NH3 = `NH${s(3)}`, N2 = `N${s(2)}`, H2 = `H${s(2)}`, O2 = `O${s(2)}`, SO2 = `SO${s(2)}`, SO3 = `SO${s(3)}`, CO2 = `CO${s(2)}`
  const P = (x) => `P${s(x)}`
  const Kc = `K${s('c')}`, Kp = `K${s('p')}`
  const ex = (n) => `<sup class="x-co">${n}</sup>`
  const strike = (inner, at) => `<span class="x-s">${inner}<i class="x-st" data-at="${at}" data-fx="grow" data-dur="0.4"></i></span>`

  // ---------- intro artwork: faint double arrows on the left, a faint K fraction on the right ----------
  const arrows = (x, y, w, col) => `<g fill="none" stroke="${col}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"><path d="M${x} ${y}H${x + w}L${x + w - 34} ${y - 28}"/><path d="M${x + w} ${y + 44}H${x}L${x + 34} ${y + 72}"/></g>`
  EZ.intro = {
    chips: [['1@0.32', 'Write K'], ['1@0.56', 'What to leave out'], ['1@0.84', 'Q, its twin']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">
      ${arrows(70, 360, 260, PRI)}${arrows(110, 560, 220, TEAL)}${arrows(60, 760, 280, WARM)}
      <text x="1720" y="560" text-anchor="middle" font-size="150" font-weight="900" class="f-gold">K</text>
      <line x1="1600" y1="640" x2="1840" y2="640" stroke="${TXT}" stroke-width="9" stroke-linecap="round"/>
      <text x="1720" y="610" text-anchor="middle" font-size="64" font-weight="900" class="f-teal">[C]</text>
      <text x="1720" y="720" text-anchor="middle" font-size="64" font-weight="900" class="f-pri">[A]</text>
      <text x="1720" y="860" text-anchor="middle" font-size="110" font-weight="900" class="f-warm">Q</text>
    </svg>`,
  }

  // ---------- hook: one ratio at equilibrium ----------
  const PTS = Array.from({ length: 15 }, (_, i) => {
    const col = i % 5, row = Math.floor(i / 5)
    return { x: 120 + col * 150 + ((i * 37) % 50) - 25, y: 80 + row * 115 + ((i * 53) % 40) - 20, g: [0, 2, 3, 5, 7, 9, 11, 13].includes(i) ? 'pur' : 'teal', ph: i * 1.7 }
  })
  EZ.scene('hook', {
    html: `<div class="kicker" data-at="in" data-fx="left">The magic ratio</div><h2 class="h1" data-at="0">One ratio at equilibrium</h2>
      <div class="card" style="left:120px;top:300px;width:860px;height:560px" data-at="0@0.3"><h3>A reaction at equilibrium</h3>
        <svg style="position:absolute;left:0;top:100px" width="860" height="360" viewBox="0 0 860 360">
          ${PTS.map((p, i) => `<g class="x-pt${i}">${ball(0, 0, 30, p.g)}</g>`).join('')}
        </svg>
        <div style="position:absolute;left:0;right:0;top:476px;text-align:center;font-size:34px;font-weight:900;white-space:nowrap">
          <span class="pri">● reactants</span> &nbsp;&nbsp;&nbsp; <span class="teal">● products</span></div></div>
      <div class="card" style="left:1040px;top:300px;width:760px;height:560px" data-at="1"><h3>The ratio</h3>
        <div class="x-in" style="top:150px;font-size:64px"><span class="gold" data-at="2" data-fx="fade">K =</span> ${fr('<span class="teal">products</span>', '<span class="pri">reactants</span>')}</div>
        <div class="x-in" style="top:340px;font-size:36px;color:var(--muted)" data-at="1@0.55" data-fx="fade">at a given temperature</div>
        <div class="x-in gold" style="top:420px;font-size:40px" data-at="2@0.5" data-fx="fade">the equilibrium constant</div></div>
      <div class="x-line" style="top:910px" data-at="3" data-fx="fade">How do you write it for a real reaction?</div>`,
    update(c) {
      PTS.forEach((p, i) => {
        const x = p.x + 10 * Math.sin(c.t * 0.9 + p.ph), y = p.y + 8 * Math.cos(c.t * 0.75 + p.ph * 1.3)
        c.$('.x-pt' + i).setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`)
      })
    },
  })

  // ---------- the law of mass action ----------
  EZ.scene('law', {
    html: `<div class="kicker" data-at="in" data-fx="left">Law of mass action</div><h2 class="h1" data-at="0">Products over reactants</h2>
      <div class="x-eq" style="top:300px;font-size:76px" data-at="1"><span class="pri"><b class="x-co x-c">a</b>A + <b class="x-co x-c">b</b>B</span>${EQ}<span class="teal"><b class="x-co x-c">c</b>C + <b class="x-co x-c">d</b>D</span></div>
      <div style="position:absolute;left:120px;width:1180px;top:450px;text-align:center;font-size:96px;font-weight:900;white-space:nowrap">
        <span class="gold" data-at="4" data-fx="fade">${Kc} =</span>
        <span class="x-fr"><span class="x-n teal" data-at="2" data-fx="fade">[C]<sup class="x-co" data-at="3@0.35" data-fx="fade">c</sup>[D]<sup class="x-co" data-at="3@0.5" data-fx="fade">d</sup></span><span class="x-d pri" data-at="2@0.5" data-fx="fade">[A]<sup class="x-co" data-at="3@0.65" data-fx="fade">a</sup>[B]<sup class="x-co" data-at="3@0.8" data-fx="fade">b</sup></span></span></div>
      <div class="x-tag t" style="left:1380px;top:470px" data-at="2@0.2" data-fx="right">products on top</div>
      <div class="x-tag p" style="left:1380px;top:560px" data-at="2@0.6" data-fx="right">reactants on the bottom</div>
      <div class="x-tag w" style="left:1380px;top:650px" data-at="3" data-fx="right">coefficient = exponent</div>
      <div class="x-note" style="left:120px" data-at="5" data-fx="pop">[ &nbsp;] = <span class="teal">molar concentration</span></div>
      <div class="x-note" style="left:990px" data-at="6" data-fx="pop">Dissolved species: <span class="teal">molarity</span></div>`,
    update(c) {
      const g = c.seg(c.b[3].start, c.b[3].start + 0.4) * (1 - c.seg(c.b[3].end + 0.3, c.b[3].end + 0.9))
      for (const el of c.root.querySelectorAll('.x-c')) el.style.textShadow = `0 0 ${28 * g}px rgba(243,167,100,${0.9 * g})`
    },
  })

  // ---------- Kc and Kp ----------
  const box = (x, y) => `<rect x="${x}" y="${y}" width="120" height="96" rx="14" fill="rgba(60,199,188,.08)" stroke="${TEAL}" stroke-width="3"/>
    ${[[24, 30], [62, 22], [96, 40], [36, 66], [78, 72]].map(([a, b], i) => `<circle cx="${x + a}" cy="${y + b}" r="9" fill="${i % 2 ? PRI : TEAL}"/>`).join('')}`
  EZ.scene('kp', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Gases</div><h2 class="h1" data-at="0">${Kc} or ${Kp}</h2>
      <div class="x-eq" style="top:286px;font-size:58px" data-at="2"><span class="pri"><b class="x-co">2</b>${SO2}(g) + ${O2}(g)</span>${EQ}<span class="teal"><b class="x-co">2</b>${SO3}(g)</span></div>
      <div class="card" style="left:120px;top:400px;width:810px;height:360px" data-at="0@0.2"><h3>${Kc}: concentrations</h3>
        <svg style="position:absolute;right:28px;top:22px" width="130" height="110">${box(4, 6)}</svg>
        <div class="x-in" style="top:160px;font-size:58px" data-at="3" data-fx="fade">${Kc} = ${fr(`[${SO3}]${ex(2)}`, `[${SO2}]${ex(2)}[${O2}]`)}</div></div>
      <div class="card" style="left:990px;top:400px;width:810px;height:360px" data-at="1"><h3>${Kp}: partial pressures</h3>
        <svg style="position:absolute;right:28px;top:14px" width="130" height="120" viewBox="0 0 130 120"><circle cx="65" cy="62" r="50" fill="rgba(242,196,67,.08)" stroke="${GOLD}" stroke-width="4"/>
          ${[-60, -30, 0, 30, 60].map((a) => `<line x1="${65 + 38 * Math.sin((a * Math.PI) / 180)}" y1="${62 - 38 * Math.cos((a * Math.PI) / 180)}" x2="${65 + 46 * Math.sin((a * Math.PI) / 180)}" y2="${62 - 46 * Math.cos((a * Math.PI) / 180)}" stroke="${GOLD}" stroke-width="4"/>`).join('')}
          <g class="x-needle"><line x1="0" y1="0" x2="0" y2="-36" stroke="${TXT}" stroke-width="5" stroke-linecap="round"/></g><circle cx="65" cy="62" r="7" fill="${TXT}"/></svg>
        <div class="x-in" style="top:160px;font-size:58px" data-at="4" data-fx="fade">${Kp} = ${fr(`(${P(SO3)})${ex(2)}`, `(${P(SO2)})${ex(2)}(${P(O2)})`)}</div></div>
      <div class="x-line" style="top:790px" data-at="5" data-fx="fade">Usually <span class="warm">different values</span>: use the K the question gives, with matching data</div>
      <div class="banner" style="top:870px;font-size:42px" data-at="6" data-fx="pop">Converting ${Kc} ${ARR} ${Kp} isn't tested. <span class="teal">Notice which one is used.</span></div>`,
    update(c) {
      const a = 18 + 6 * Math.sin(c.t * 1.6)
      c.$('.x-needle').setAttribute('transform', `translate(65 62) rotate(${a.toFixed(1)})`)
    },
  })

  // ---------- leave out solids and pure liquids ----------
  const lump = (cx, cy, rx, ry) => {
    const dots = []
    for (let y = cy - ry + 14; y < cy + ry - 8; y += 24) for (let x = cx - rx + 14; x < cx + rx - 8; x += 24) {
      if (((x - cx) / (rx - 12)) ** 2 + ((y - cy) / (ry - 12)) ** 2 < 1) dots.push(`<circle cx="${x}" cy="${y}" r="5.5" fill="#f1f3f9" opacity=".75"/>`)
    }
    return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#g-gray)"/>${dots.join('')}`
  }
  EZ.scene('solids', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">What to leave out</div><h2 class="h1" data-at="1">Solids and pure liquids: <span class="warm">not in K or Q</span></h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:520px" data-at="2"><h3>Why?</h3>
        <svg style="position:absolute;left:0;top:96px" width="810" height="300" viewBox="0 0 810 300">
          <g data-at="3" data-fx="pop">${lump(170, 140, 72, 56)}</g>
          <g data-at="3@0.3" data-fx="pop">${lump(530, 140, 150, 116)}</g>
          <text x="170" y="236" text-anchor="middle" font-size="30" font-weight="900" class="f-muted" data-at="3" data-fx="fade">small lump</text>
          <text x="530" y="290" text-anchor="middle" font-size="30" font-weight="900" class="f-warm" data-at="3@0.4" data-fx="fade">more moles, more volume</text>
        </svg>
        <div class="x-in teal" style="top:406px;font-size:42px" data-at="4" data-fx="fade">Same moles per liter</div>
        <div class="x-in" style="top:460px;font-size:32px;color:var(--muted)" data-at="4@0.55" data-fx="fade">a constant, absorbed into K</div></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:520px" data-at="5"><h3>Example</h3>
        <div class="x-in" style="top:130px;font-size:46px">${strike(`CaCO${s(3)}(s)`, '5@0.55')}${EQ}${strike('CaO(s)', '5@0.75')} + <span class="teal">${CO2}(g)</span></div>
        <div class="x-in" style="top:250px;font-size:96px" data-at="6" data-fx="fade"><span class="gold">${Kp}</span> = <span class="teal">${P(CO2)}</span></div>
        <div class="x-in" style="top:410px;font-size:32px;color:var(--muted)" data-at="6@0.4" data-fx="fade">only the gas is left</div></div>
      <div class="banner" style="top:856px;font-size:42px" data-at="7" data-fx="pop">Some solid present ${ARR} <span class="teal">its amount doesn't affect the equilibrium</span></div>`,
  })

  // ---------- water as the solvent ----------
  const WATER = Array.from({ length: 64 }, (_, i) => [70 + (i % 8) * 46 + ((i * 29) % 20) - 10, 250 + Math.floor(i / 8) * 40 + ((i * 41) % 16) - 8])
  EZ.scene('water', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">The solvent</div><h2 class="h1" data-at="0">Leave out water too</h2>
      <svg class="full" viewBox="0 0 1920 1080"><g transform="translate(120 0)">
        <g data-at="0@0.2" data-fx="fade">
          <path d="M40 300 V770 Q40 810 80 810 H440 Q480 810 480 770 V300" fill="none" stroke="${TXT}" stroke-width="7" stroke-linecap="round"/>
          <path d="M46 360 H474 V770 Q474 804 440 804 H80 Q46 804 46 770 Z" fill="rgba(60,199,188,.13)"/>
          ${WATER.map(([x, y]) => `<circle cx="${x - 5}" cy="${(y - 250) * 1.27 + 392}" r="7" fill="#7fb9ff" opacity=".55"/>`).join('')}
          ${[[150, 500], [330, 600], [220, 720]].map(([x, y]) => ball(x, y, 22, 'pur')).join('')}
        </g>
        <text x="260" y="875" text-anchor="middle" font-size="36" font-weight="900" class="f-teal" data-at="0@0.6" data-fx="fade">mostly water</text>
      </g></svg>
      <div style="position:absolute;left:120px;top:900px;width:520px;text-align:center;font-size:32px;font-weight:800;color:var(--muted);white-space:nowrap" data-at="1" data-fx="fade">its concentration hardly changes</div>
      <div style="position:absolute;left:700px;width:1120px;top:330px;text-align:center;font-size:46px;font-weight:900;white-space:nowrap" data-at="2">
        <span class="pri">${NH3}(aq)</span> + ${strike(`H${s(2)}O(l)`, '3')}${EQ}<span class="teal">NH${s(4)}<sup>+</sup>(aq) + OH<sup>−</sup>(aq)</span></div>
      <div style="position:absolute;left:700px;width:1120px;top:470px;text-align:center;font-size:86px;font-weight:900;white-space:nowrap" data-at="3" data-fx="fade">
        <span class="gold">K</span> = ${fr(`<span class="teal">[NH${s(4)}<sup>+</sup>][OH<sup>−</sup>]</span>`, `<span class="pri">[${NH3}]</span>`)}</div>
      <div class="x-stamp" style="left:1120px;top:790px" data-at="4" data-fx="pop"><div>NO WATER!</div></div>`,
  })

  // ---------- Q ----------
  const TX0 = 220, TX1 = 1700, KX = 1080, TY = 840
  EZ.scene('q', {
    html: `<div class="kicker" data-at="in" data-fx="left">The reaction quotient</div><h2 class="h1" data-at="0">Q: same formula, any moment</h2>
      <div class="card" style="left:120px;top:290px;width:810px;height:300px" data-at="0@0.4"><h3><span class="gold">K</span></h3>
        <div class="x-in" style="top:96px;font-size:52px">${fr('<span class="teal">products</span>', '<span class="pri">reactants</span>')}</div>
        <div class="x-tag g" style="left:250px;top:30px">at equilibrium</div></div>
      <div class="card" style="left:990px;top:290px;width:810px;height:300px" data-at="1"><h3><span class="warm">Q</span></h3>
        <div class="x-in" style="top:96px;font-size:52px">${fr('<span class="teal">products</span>', '<span class="pri">reactants</span>')}</div>
        <div class="x-tag w" style="left:200px;top:30px" data-at="1@0.5" data-fx="pop">current, at any moment</div>
        <div class="x-in" style="top:244px;font-size:30px;color:var(--muted)" data-at="2" data-fx="fade">not necessarily at equilibrium</div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="3" data-fx="fade"><line x1="${TX0}" y1="${TY}" x2="${TX1}" y2="${TY}" stroke="#646c82" stroke-width="8" stroke-linecap="round"/>
          <line x1="${KX}" y1="${TY - 40}" x2="${KX}" y2="${TY + 50}" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
          <text x="${KX}" y="${TY + 100}" text-anchor="middle" font-size="44" font-weight="900" class="f-gold">K</text></g>
        <g class="x-ring"><circle r="40" fill="none" stroke="${GOLD}" stroke-width="5"/></g>
        <g class="x-q"><circle r="30" fill="url(#g-warm)"/><text y="-50" text-anchor="middle" font-size="44" font-weight="900" class="f-warm">Q</text></g>
        <text class="x-mv f-muted" x="${(TX0 + KX) / 2}" y="${TY + 70}" text-anchor="middle" font-size="32" font-weight="900">moves toward K</text>
        <g data-at="4@0.3" data-fx="pop"><rect x="${KX + 70}" y="${TY - 130}" width="240" height="76" rx="38" fill="rgba(76,199,129,.18)" stroke="#4cc781" stroke-width="3"/>
          <text x="${KX + 190}" y="${TY - 78}" text-anchor="middle" font-size="44" font-weight="900" class="f-good">Q = K</text></g>
      </svg>
      <div class="x-line" style="top:982px" data-at="5" data-fx="fade">Same formula, <span class="warm">different moment</span></div>`,
    update(c) {
      const b = c.b, t = c.t
      const p = eio(c.seg(b[3].start + 0.4, b[3].end + 0.2))
      const x = lerp(TX0 + 60, KX, p)
      c.$('.x-q').setAttribute('transform', `translate(${x.toFixed(1)} ${TY})`)
      c.$('.x-q').style.opacity = c.seg(b[3].start, b[3].start + 0.3)
      c.$('.x-mv').style.opacity = c.seg(b[3].start + 0.3, b[3].start + 0.7) * (1 - c.seg(b[4].start, b[4].start + 0.4))
      const land = b[3].end + 0.2, ph = ((t - land) % 1.5) / 1.5
      c.$('.x-ring').setAttribute('transform', `translate(${KX} ${TY}) scale(${1 + ph * 1.8})`)
      c.$('.x-ring').style.opacity = t < land ? 0 : (1 - ph) * (1 - c.seg(b[5].end, b[5].end + 0.5))
    },
  })

  // ---------- two traps ----------
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Watch out</div><h2 class="h1" data-at="0">Two traps</h2>
      <div class="card" style="left:120px;top:290px;width:810px;height:600px" data-at="1"><h3><small>1</small>Exponents, not multipliers</h3>
        <div class="x-in" style="top:108px;font-size:38px;color:var(--muted)" data-at="2" data-fx="fade"><b class="x-co">2</b>${SO2} + ${O2}${EQ}<b class="x-co">2</b>${SO3}</div>
        <div class="x-row bad" style="top:190px;font-size:46px" data-at="2@0.3"><div class="ic">${CROSS}</div>${fr(`<span class="bad">2</span>${P(SO3)}`, `<span class="bad">2</span>${P(SO2)} <span class="bad">+</span> ${P(O2)}`)}</div>
        <div class="x-row ok" style="top:370px;font-size:46px" data-at="2@0.7"><div class="ic">${CHECK}</div>${fr(`(${P(SO3)})${ex(2)}`, `(${P(SO2)})${ex(2)}(${P(O2)})`)}</div>
        <div class="x-in" style="top:540px;font-size:34px" data-at="3" data-fx="fade">Concentrations <span class="good">multiply</span>, never <span class="bad">add</span></div></div>
      <div class="card" style="left:990px;top:290px;width:810px;height:600px" data-at="4"><h3><small>2</small>Check the phase</h3>
        <div class="x-in" style="top:116px;font-size:42px" data-at="5" data-fx="fade">AgCl<span class="warm">(s)</span>${EQ}Ag<sup>+</sup>(aq) + Cl<sup>−</sup>(aq)</div>
        <div class="x-row bad" style="top:190px;font-size:46px" data-at="6"><div class="ic">${CROSS}</div>K = ${fr(`[Ag<sup>+</sup>][Cl<sup>−</sup>]`, `<span class="bad">[AgCl]</span>`)}</div>
        <div class="x-row ok" style="top:370px;font-size:50px" data-at="6@0.45"><div class="ic">${CHECK}</div>K = [Ag<sup>+</sup>][Cl<sup>−</sup>]</div>
        <div class="x-tag g" style="left:265px;top:530px" data-at="7@0.4" data-fx="pop">this one is K${s('sp')}</div></div>`,
  })

  // ---------- try it ----------
  const OPTS = [
    `[${NH3}] / [${N2}][${H2}]`,
    `[${NH3}]<sup>2</sup> / [${N2}][${H2}]<sup>3</sup>`,
    `[${N2}][${H2}]<sup>3</sup> / [${NH3}]<sup>2</sup>`,
    `2[${NH3}] / [${N2}]3[${H2}]`,
  ]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1">What is ${Kc} for ${N2}(g) + 3${H2}(g)${EQ}2${NH3}(g)?</h2>
      ${OPTS.map((o, i) => `<div class="x-opt t${i}" style="left:${120 + (i % 2) * 860}px;top:${330 + Math.floor(i / 2) * 160}px" data-at="1@${0.55 + i * 0.1}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>
        ${i === 1 ? `<div class="ok">${CHECK}</div>` : ''}<span>${o}</span></div>`).join('')}
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="790" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="790" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 790)"/>
        <text class="x-num" x="960" y="816" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="920" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:680px;font-size:44px" data-at="4" data-fx="pop"><span class="teal">${NH3}</span> on top, <span class="pri">${N2} and ${H2}</span> on the bottom</div>
      <div class="banner" style="top:830px;font-size:44px" data-at="5" data-fx="pop">Raised to the coefficients: [${NH3}]<sup class="x-co">2</sup> and [${H2}]<sup class="x-co">3</sup></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.3, b[3].start + 0.8))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 1) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="440" height="190" viewBox="0 0 440 190">
    <text x="220" y="78" text-anchor="middle" font-size="64" font-weight="900" class="f-teal">[C]<tspan dy="-26" font-size="38" class="f-warm">c</tspan></text>
    <line x1="140" y1="104" x2="300" y2="104" stroke="${TXT}" stroke-width="6" stroke-linecap="round"/>
    <text x="220" y="170" text-anchor="middle" font-size="64" font-weight="900" class="f-pri">[A]<tspan dy="-26" font-size="38" class="f-warm">a</tspan></text></svg>`
  const r2 = `<svg width="440" height="190" viewBox="0 0 440 190">
    <text x="130" y="118" text-anchor="middle" font-size="76" font-weight="900" class="f-muted">(s)</text><line x1="62" y1="92" x2="198" y2="92" stroke="${BAD}" stroke-width="9" stroke-linecap="round"/>
    <text x="310" y="118" text-anchor="middle" font-size="76" font-weight="900" class="f-muted">(l)</text><line x1="252" y1="92" x2="368" y2="92" stroke="${BAD}" stroke-width="9" stroke-linecap="round"/></svg>`
  const r3 = `<svg width="440" height="190" viewBox="0 0 440 190">
    <line x1="30" y1="120" x2="410" y2="120" stroke="#646c82" stroke-width="7" stroke-linecap="round"/>
    <line x1="300" y1="80" x2="300" y2="160" stroke="${GOLD}" stroke-width="6" stroke-linecap="round"/><text x="300" y="60" text-anchor="middle" font-size="40" font-weight="900" class="f-gold">K</text>
    <circle cx="90" cy="120" r="22" fill="url(#g-warm)"/><text x="90" y="80" text-anchor="middle" font-size="40" font-weight="900" class="f-warm">Q</text>
    <line x1="126" y1="120" x2="262" y2="120" stroke="${WARM}" stroke-width="7" marker-end="url(#mk-warm)"/></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>K = <span class="teal">products</span><br>over <span class="pri">reactants</span>,<br>each raised to<br>its <span class="warm">coefficient</span></p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Leave out<br><span class="warm">solids</span> and<br><span class="warm">pure liquids</span></p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p><span class="warm">Q</span>: same form,<br>at any moment<br>At equilibrium:<br><span class="good">Q = K</span></p></div>`,
  })
})()
