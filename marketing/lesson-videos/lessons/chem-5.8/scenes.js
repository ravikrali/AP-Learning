// Pictures for chem-5.8 "Mechanisms & Rate Laws: The Slow Step". One EZ.scene per scene id in
// script.mjs. Every equation and rate law shown is the lesson's own (app/src/content/chem/u5.ts and
// book.ts): the NO2 + CO mechanism, the one-step mechanism that is ruled out, the A + B quick check
// and the X + Y try question. The relay, the bottleneck and the flat rate line are schematic.
(() => {
  const { clamp, lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .r-eq{position:absolute;left:120px;height:84px;display:flex;align-items:center;gap:18px;font-size:50px;font-weight:900;white-space:nowrap}
    .r-lab{display:inline-block;width:180px;font-size:26px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
    .r-s{position:relative;display:inline-block}
    .r-op{color:var(--muted)}
    .r-x{position:absolute;left:-8px;right:-8px;top:50%;height:7px;margin-top:-2px;border-radius:4px;background:var(--bad)}
    .r-ring{position:absolute;left:-14px;right:-14px;top:-8px;bottom:-8px;border:5px solid;border-radius:20px}
    .r-tag{display:inline-block;margin-left:22px;padding:4px 18px;border-radius:999px;font-size:26px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;border:2px solid}
    .r-tag.s{color:var(--warm);border-color:rgba(243,167,100,.6);background:rgba(243,167,100,.12)}
    .r-tag.f{color:var(--accent);border-color:rgba(60,199,188,.6);background:rgba(60,199,188,.12)}
    .r-chip{position:absolute;height:72px;padding:0 26px;border-radius:20px;background:rgba(255,255,255,.05);border:2px solid var(--line);font-size:34px;font-weight:800;line-height:68px;white-space:nowrap}
    .r-chip svg{display:inline-block;width:44px;height:44px;vertical-align:middle;margin:-6px 14px 0 0}
    .r-note{position:absolute;padding:22px 30px 24px 34px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line);border-left-width:10px}
    .r-note b{display:block;font-size:40px;font-weight:900;line-height:1.15;white-space:nowrap} .r-note > span{display:block;margin-top:10px;font-size:30px;font-weight:700;color:var(--muted);line-height:1.3;white-space:nowrap}
    .r-note .ok{position:absolute;right:22px;top:20px;width:56px;height:56px} .r-note .ok svg{display:block;width:100%;height:100%}
    .r-row{position:absolute;left:40px;right:40px;height:64px;display:flex;align-items:center;gap:14px;font-size:38px;font-weight:900;white-space:nowrap}
    .r-steps{position:absolute;left:120px;top:290px;width:1680px;height:200px;padding:20px 44px}
    .r-steps div{position:relative;height:76px;font-size:48px;font-weight:900;white-space:nowrap;display:flex;align-items:center;gap:16px}
    .r-tile{position:absolute;top:540px;width:390px;height:150px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .r-tile .l{position:absolute;left:18px;top:14px;width:52px;height:52px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:28px;font-weight:900;line-height:48px;color:var(--muted)}
    .r-tile .f{margin-top:62px;font-size:42px;font-weight:900;line-height:1;white-space:nowrap}
    .r-tile .ok{position:absolute;right:16px;top:12px;width:56px;height:56px} .r-tile .ok svg{display:block;width:100%;height:100%}
    .r-why{position:absolute;left:120px;width:1680px;height:84px;border-radius:24px;background:rgba(60,199,188,.1);border:2px solid rgba(60,199,188,.6);font-size:40px;font-weight:800;line-height:80px;text-align:center;white-space:nowrap}
    .r-rc{top:320px;width:540px;height:580px;text-align:center} .r-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .r-rc svg{display:block;margin:14px auto 0} .r-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.32;white-space:nowrap}
  `
  document.head.appendChild(css)

  const CHECK = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const CROSS = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#f0707a"/><path d="M21 21l22 22M43 21L21 43" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round"/></svg>'
  const TEAL = '#3cc7bc', WARM = '#f3a764'
  const S = (h, o = {}) => `<span class="r-s">${h}${o.x ? `<i class="r-x" data-at="${o.x}" data-fx="grow"></i>` : ''}${o.r ? `<i class="r-ring" style="border-color:${o.rc}" data-at="${o.r}" data-fx="pop"></i>` : ''}</span>`
  const P = '<span class="r-op">+</span>', A = '<span class="r-op">→</span>'
  const sb = (n) => `<sub>${n}</sub>`, sp = (n) => `<sup>${n}</sup>`
  const NO2 = `NO${sb(2)}`, NO3 = `NO${sb(3)}`, CO2 = `CO${sb(2)}`
  const SLOW = '<span class="r-tag s">slow</span>', FAST = '<span class="r-tag f">fast</span>'

  // ---------- intro artwork: faint step boxes at the left and right edges, the middle one slow ----------
  const col = (x0) => [0, 1, 2].map((i) => { const slow = i === 1, x = x0 + i * 140, y = 830
    return `<rect x="${x}" y="${y}" width="110" height="96" rx="18" fill="rgba(255,255,255,.05)" stroke="${slow ? WARM : '#8d8df0'}" stroke-width="${slow ? 6 : 3}"/>
      <text x="${x + 55}" y="${y + 66}" text-anchor="middle" font-size="52" font-weight="900" class="${slow ? 'f-warm' : 'f-pri'}">${i + 1}</text>` }).join('')
  EZ.intro = {
    chips: [['1@0.3', 'The slow step'], ['1@0.6', 'Rate laws'], ['1@0.85', 'Two tests']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2"><g class="r-is1">${col(60)}</g><g class="r-is2">${col(1450)}</g></svg>`,
    update(c) {
      const p = eio(c.seg(c.sc.start + 0.2, c.sc.start + 2.4))
      c.$('.r-is1').setAttribute('transform', `translate(${lerp(-60, 0, p)} 0)`)
      c.$('.r-is2').setAttribute('transform', `translate(${lerp(60, 0, p)} 0)`)
    },
  }

  // ---------- hook: the relay ----------
  // track from x 200 to 1720, three legs; the baton runs fast, slow, fast
  const LEG = [[200, 680], [680, 1240], [1240, 1720]]
  const legCol = [TEAL, WARM, TEAL]
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Think about it</div><h2 class="h1" data-at="0">Only as fast as the slowest runner</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.4" data-fx="fade">
          <rect x="160" y="420" width="1600" height="150" rx="75" fill="rgba(255,255,255,.04)" stroke="#4a5070" stroke-width="3"/>
          ${LEG.map(([a, b], i) => `<line x1="${a + 30}" y1="495" x2="${b - 30}" y2="495" stroke="${legCol[i]}" stroke-width="10" stroke-linecap="round" stroke-dasharray="2 22" opacity=".7"/>`).join('')}
          <line x1="680" y1="440" x2="680" y2="550" stroke="#636b88" stroke-width="4"/><line x1="1240" y1="440" x2="1240" y2="550" stroke="#636b88" stroke-width="4"/>
        </g>
        <g data-at="1" data-fx="pop">${ball(200, 495, 42, 'teal')}</g>
        <g data-at="1@0.2" data-fx="pop">${ball(680, 495, 42, 'warm')}</g>
        <g data-at="1@0.4" data-fx="pop">${ball(1240, 495, 42, 'teal')}</g>
        <text x="440" y="400" text-anchor="middle" font-size="40" font-weight="900" class="f-teal" data-at="1@0.25" data-fx="fade">fast</text>
        <text x="960" y="400" text-anchor="middle" font-size="40" font-weight="900" class="f-warm" data-at="1@0.6" data-fx="fade">slow</text>
        <text x="1480" y="400" text-anchor="middle" font-size="40" font-weight="900" class="f-teal" data-at="1@0.45" data-fx="fade">fast</text>
        <g class="r-bat" data-at="2" data-fx="fade"><circle r="16" style="fill:#f2c443"/></g>
        <g data-at="3" data-fx="fade">
          <text x="440" y="640" text-anchor="middle" font-size="34" font-weight="900" class="f-muted">step 1</text>
          <text x="960" y="640" text-anchor="middle" font-size="34" font-weight="900" class="f-muted">step 2</text>
          <text x="1480" y="640" text-anchor="middle" font-size="34" font-weight="900" class="f-muted">step 3</text>
          <text x="960" y="700" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">elementary steps of a mechanism</text>
        </g>
      </svg>
      <div class="r-chip r-time" style="left:760px;top:290px;border-color:rgba(242,196,67,.6)" data-at="2@0.3" data-fx="pop"><span class="muted">most of the time is spent</span> <span class="warm">here</span></div>
      <div class="banner" style="top:790px" data-at="4" data-fx="pop">The <span class="warm">slowest</span> elementary step controls the overall rate</div>`,
    update(c) {
      // the baton: fast leg 1, slow leg 2, fast leg 3 (once, during sentence 2)
      const s = c.b[2].start, t = c.t - s
      let x
      if (t < 0.6) x = lerp(200, 680, eio(clamp(t / 0.6)))
      else if (t < 4.6) x = lerp(680, 1240, clamp((t - 0.6) / 4))
      else x = lerp(1240, 1720, eio(clamp((t - 4.6) / 0.6)))
      c.$('.r-bat').setAttribute('transform', `translate(${x} 495)`)
    },
  })

  // ---------- the rate-determining step: a bottleneck ----------
  // a pipe: wide on the left, a narrow neck, wide on the right (inside a card at 120,290)
  const PIPE = 'M30 120 H300 C350 120 360 215 410 215 H520 C570 215 580 120 630 120 H750 V380 H630 C580 380 570 285 520 285 H410 C360 285 350 380 300 380 H30 Z'
  const crowd = []; for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) crowd.push([70 + i * 50 + (j % 2) * 22, 160 + j * 60])
  EZ.scene('rds', {
    html: `<div class="kicker" data-at="in" data-fx="left">The key idea</div><h2 class="h1" data-at="0">The rate-determining step</h2>
      <div class="card" style="left:120px;top:290px;width:780px;height:620px" data-at="0@0.3">
        <svg style="position:absolute;left:0;top:-30px" width="780" height="520" viewBox="0 0 780 520">
          <g data-at="3" data-fx="fade"><path d="${PIPE}" fill="rgba(255,255,255,.05)" stroke="#636b88" stroke-width="4"/>
            ${crowd.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="url(#g-pur)"/>`).join('')}
            <circle class="r-d0" r="16" fill="url(#g-pur)"/><circle class="r-d1" r="16" fill="url(#g-pur)"/><circle class="r-d2" r="16" fill="url(#g-pur)"/></g>
          <path d="M410 200 V170 M520 200 V170 M410 170 H520" fill="none" stroke="${WARM}" stroke-width="4" data-at="2" data-fx="fade"/>
          <text x="465" y="150" text-anchor="middle" font-size="34" font-weight="900" class="f-warm" data-at="2" data-fx="fade">slowest step</text>
          <text x="690" y="440" text-anchor="middle" font-size="30" font-weight="900" class="f-teal" data-at="4" data-fx="fade">fast</text>
          <text x="160" y="440" text-anchor="middle" font-size="30" font-weight="900" class="f-muted" data-at="3@0.4" data-fx="fade">waiting</text>
        </svg>
        <div style="position:absolute;left:40px;top:470px;width:700px;font-size:32px;font-weight:800;line-height:1.3;white-space:nowrap" class="muted" data-at="4" data-fx="up">fast steps can't speed up the whole reaction</div></div>
      <div class="card" style="left:960px;top:290px;width:840px;height:620px" data-at="5"><h3 style="font-size:36px">If the <span class="warm">first step is slow</span></h3>
        <div class="r-row" style="top:110px;font-size:36px" data-at="6" data-fx="up"><span>overall rate law</span><span class="r-op">=</span><span class="warm">the slow step's rate law</span></div>
        <div class="r-row" style="top:200px;font-size:32px" data-at="7" data-fx="up"><span class="muted">written from its</span><span class="pri">molecularity</span></div>
        <div style="position:absolute;left:40px;top:300px;width:760px;height:2px;background:var(--line)" data-at="8" data-fx="grow"></div>
        <div class="r-row" style="top:340px" data-at="8@0.1" data-fx="up"><span class="r-lab" style="width:150px">Slow</span>A ${P} B ${A} AB</div>
        <div class="r-row" style="top:440px" data-at="8@0.5" data-fx="up"><span class="r-lab" style="width:150px">Rate</span><span class="warm">rate = <i>k</i>[A][B]</span></div></div>`,
    update(c) {
      // three particles squeeze through the neck one after another, then speed off
      const s = c.b[3].start, t = Math.max(0, c.t - s)
      for (let i = 0; i < 3; i++) {
        const q = ((t / 3 + i / 3) % 1)
        let x, y = 250
        if (q < 0.15) { x = lerp(330, 410, q / 0.15); y = lerp(250, 250, q) }
        else if (q < 0.75) x = lerp(410, 520, (q - 0.15) / 0.6)
        else x = lerp(520, 740, (q - 0.75) / 0.25)
        const el = c.$('.r-d' + i)
        el.setAttribute('cx', x); el.setAttribute('cy', y)
        el.setAttribute('opacity', q > 0.95 ? (1 - q) * 20 : 1)
      }
    },
  })

  // ---------- two tests ----------
  EZ.scene('tests', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Checking a mechanism</div><h2 class="h1" data-at="0">Two tests a mechanism must pass</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:400px" data-at="2"><h3><small>1</small>Steps <span class="pri">add up</span></h3>
        <svg style="position:absolute;left:0;top:120px" width="810" height="260" viewBox="0 0 810 260">
          <text x="60" y="50" font-size="26" font-weight="900" class="f-muted">STEP 1</text><rect x="200" y="18" width="460" height="46" rx="12" fill="rgba(255,255,255,.06)" stroke="#636b88" stroke-width="2"/>
          <text x="60" y="114" font-size="26" font-weight="900" class="f-muted">STEP 2</text><rect x="200" y="82" width="460" height="46" rx="12" fill="rgba(255,255,255,.06)" stroke="#636b88" stroke-width="2"/>
          <line x1="60" y1="150" x2="700" y2="150" stroke="#8d8df0" stroke-width="4" data-at="2@0.4" data-fx="draw"/>
          <text x="60" y="200" font-size="34" font-weight="900" class="f-pri" data-at="2@0.6" data-fx="fade">= the overall equation</text>
        </svg></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:400px" data-at="3"><h3><small>2</small>Rate law <span class="teal">matches</span></h3>
        <div class="r-chip" style="left:40px;top:130px" data-at="3@0.3" data-fx="pop"><span class="muted" style="font-size:26px;letter-spacing:.1em">PREDICTED</span>&nbsp; rate law</div>
        <div style="position:absolute;left:380px;top:204px;font-size:60px;font-weight:900" class="teal" data-at="3@0.5" data-fx="pop">=</div>
        <div class="r-chip" style="left:40px;top:280px" data-at="3@0.6" data-fx="pop"><span class="muted" style="font-size:26px;letter-spacing:.1em">EXPERIMENTAL</span>&nbsp; rate law</div></div>
      <div class="r-chip" style="left:120px;top:760px;height:96px;line-height:92px;font-size:42px;border-color:rgba(76,199,129,.6)" data-at="4" data-fx="pop">${CHECK}Pass both <span class="good">${ARR} consistent with experiment</span></div>
      <div class="r-chip" style="left:120px;top:880px;height:96px;line-height:92px;font-size:42px;border-color:rgba(240,112,122,.6)" data-at="5" data-fx="pop">${CROSS}Fail either <span class="bad">${ARR} it's out</span></div>`,
  })

  // ---------- worked example: NO2 + CO ----------
  EZ.scene('example', {
    html: `<div class="kicker" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Check a mechanism</h2>
      <div class="r-chip r-exp" style="left:120px;top:290px;height:80px;line-height:76px;font-size:38px" data-at="1" data-fx="pop"><span class="muted" style="font-size:26px;letter-spacing:.1em">EXPERIMENT</span>&nbsp; ${NO2} + CO ${ARR} NO + ${CO2} &nbsp;<span class="muted">·</span>&nbsp; <span class="teal">rate = <i>k</i>[NO<sub>2</sub>]<sup>2</sup></span></div>
      <div class="r-eq" style="top:400px" data-at="2"><span class="r-lab">Step 1</span>${S(`2${NO2}`, { r: '5@0.3', rc: WARM })}${A}${S(NO3, { x: '4@0.3' })}${P}${S('NO')}${SLOW}</div>
      <div class="r-eq" style="top:500px" data-at="3"><span class="r-lab">Step 2</span>${S(NO3, { x: '4@0.35' })}${P}${S('CO')}${A}${S(NO2, { x: '4@0.6' })}${P}${S(CO2)}${FAST}</div>
      <div class="r-note" style="left:120px;top:640px;width:810px;height:150px;border-left-color:var(--accent)" data-at="4" data-fx="up"><b>Test 1 · add up</b><span>${NO3} cancels, one ${NO2} cancels</span><div class="ok" data-at="4@0.8" data-fx="pop">${CHECK}</div></div>
      <div class="r-note" style="left:990px;top:640px;width:810px;height:150px;border-left-color:var(--warm)" data-at="5" data-fx="up"><b>Test 2 · <span class="warm">rate = <i>k</i>[NO<sub>2</sub>]<sup>2</sup></span></b><span>slow step: elementary, bimolecular</span><div class="ok" data-at="6" data-fx="pop">${CHECK}</div></div>
      <div class="banner" style="top:840px" data-at="7" data-fx="pop">Consistent with the data</div>`,
    update(c) {
      const w = eo(c.seg(c.b[6].start, c.b[6].start + 0.6))
      const e = c.$('.r-exp')
      e.style.borderColor = w ? `rgba(76,199,129,${w})` : ''
      e.style.boxShadow = `0 0 ${50 * w}px rgba(76,199,129,${0.45 * w})`
    },
  })

  // ---------- a mechanism that fails ----------
  EZ.scene('ruleout', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Compare</div><h2 class="h1" data-at="0">A mechanism that fails</h2>
      <div class="r-eq" style="top:300px" data-at="0@0.3"><span class="r-lab">One step</span>${S(NO2)}${P}${S('CO')}${A}${S('NO')}${P}${S(CO2)}</div>
      <div class="r-note" style="left:120px;top:440px;width:1680px;height:110px;border-left-color:var(--accent)" data-at="1" data-fx="up"><b>Test 1 · <span class="muted" style="font-size:34px">already the overall equation</span></b><div class="ok" data-at="1@0.6" data-fx="pop">${CHECK}</div></div>
      <div class="card" style="left:120px;top:600px;width:1680px;height:200px" data-at="2"><h3 style="font-size:36px">Test 2</h3>
        <div class="r-row" style="top:100px;font-size:44px"><span class="r-lab" style="width:210px">Predicted</span><span class="warm">rate = <i>k</i>[NO<sub>2</sub>][CO]</span>
          <span class="bad" style="margin:0 30px;font-size:60px" data-at="3" data-fx="pop">≠</span>
          <span data-at="3@0.1" data-fx="fade" style="display:flex;align-items:center;gap:14px"><span class="r-lab" style="width:230px">Experiment</span><span class="teal">rate = <i>k</i>[NO<sub>2</sub>]<sup>2</sup></span></span></div>
        <div class="ok" style="position:absolute;right:30px;top:24px;width:56px;height:56px" data-at="3@0.4" data-fx="pop">${CROSS}</div></div>
      <div class="banner" style="top:850px;background:linear-gradient(90deg, rgba(240,112,122,.35), rgba(91,91,214,.3));border-color:rgba(240,112,122,.7)" data-at="4" data-fx="pop"><span class="bad">Ruled out</span>, even though it adds up</div>`,
  })

  // ---------- quick trick: after the slow step doesn't count ----------
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">After the slow step, it doesn't count</h2>
      <div class="r-eq" style="top:290px;font-size:44px" data-at="1"><span class="r-lab">Step 1</span>${S('2' + NO2)}${A}${S(NO3)}${P}${S('NO')}${SLOW}</div>
      <div class="r-eq" style="top:380px;font-size:44px" data-at="1@0.2"><span class="r-lab">Step 2</span>${S(NO3)}${P}${S('<span class="gold">CO</span>', { r: '3@0.2', rc: '#f2c443' })}${A}${S(NO2)}${P}${S(CO2)}${FAST}</div>
      <div class="r-chip" style="left:1110px;top:296px;font-size:30px;border-color:rgba(242,196,67,.6)" data-at="3@0.4" data-fx="pop"><span class="gold">CO</span> first appears after the slow step</div>
      <div class="card" style="left:120px;top:500px;width:900px;height:200px" data-at="1@0.5"><h3 class="muted" style="font-size:30px">Rate law</h3>
        <div style="position:absolute;left:40px;top:84px;font-size:56px;font-weight:900;white-space:nowrap">rate = <i>k</i>[NO<sub>2</sub>]<sup>2</sup></div>
        <div style="position:absolute;left:470px;top:92px;font-size:44px;font-weight:900;white-space:nowrap" class="bad" data-at="2" data-fx="pop">no [CO]</div></div>
      <div class="card" style="left:1080px;top:500px;width:720px;height:340px" data-at="4"><h3 style="font-size:36px"><span class="gold">Zero order</span> in CO</h3>
        <svg style="position:absolute;left:0;top:90px" width="720" height="240" viewBox="0 0 720 240">
          <line x1="90" y1="200" x2="660" y2="200" stroke="#a3abbd" stroke-width="4"/><line x1="90" y1="200" x2="90" y2="20" stroke="#a3abbd" stroke-width="4"/>
          <text x="660" y="234" text-anchor="end" font-size="26" font-weight="800" class="f-muted">[CO]</text>
          <text x="76" y="40" text-anchor="end" font-size="26" font-weight="800" class="f-muted">rate</text>
          <line x1="100" y1="100" x2="640" y2="100" stroke="#f2c443" stroke-width="8" stroke-linecap="round" data-at="4@0.4" data-fx="draw"/>
          <text x="370" y="80" text-anchor="middle" font-size="28" font-weight="900" class="f-gold" data-at="4@0.7" data-fx="fade">no effect on the rate</text>
        </svg></div>
      <div class="r-chip" style="left:120px;top:740px;border-color:rgba(141,141,240,.6)" data-at="5" data-fx="pop">why a reactant can be <span class="pri">missing</span> from a rate law</div>
      <div class="r-note" style="left:120px;top:858px;width:1680px;height:136px;padding-top:14px;border-left-color:var(--brand)" data-at="6" data-fx="up"><b style="font-size:36px"><span class="pri">On the exam:</span> it first reacts in a fast step after the slow step</b><span>so changing its concentration does not change the overall rate</span></div>`,
  })

  // ---------- try it ----------
  const OPTS = [['A', `rate = <i>k</i>[X]${sp(2)}[Y]`], ['B', 'rate = <i>k</i>[X][Y]'], ['C', 'rate = <i>k</i>[XY][X]'], ['D', 'rate = <i>k</i>[X]']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="2">Which rate law does it <span class="teal">predict</span>?</h2>
      <div class="card r-steps" data-at="1">
        <div data-at="1@0.02" data-fx="fade"><span class="r-lab" style="width:170px">Step 1</span>${S('X + Y', { r: '5@0.1', rc: WARM })}${A}XY${SLOW}</div>
        <div data-at="1@0.5" data-fx="fade"><span class="r-lab" style="width:170px">Step 2</span>${S('XY')}${P}${S('X')}${A}${S(`X${sb(2)}Y`)}${FAST}</div>
      </div>
      ${OPTS.map(([l, f], i) => `<div class="r-tile t${i}" style="left:${120 + i * 430}px" data-at="2@${0.2 + i * 0.12}" data-fx="pop"><div class="l">${l}</div>
        ${i === 1 ? `<div class="ok">${CHECK}</div>` : ''}<div class="f">${f}</div></div>`).join('')}
      <svg class="full r-count" viewBox="0 0 1920 1080"><circle cx="960" cy="830" r="70" fill="none" stroke="#363c54" stroke-width="12"/><circle class="r-arc" cx="960" cy="830" r="70" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 830)"/>
        <text class="r-num" x="960" y="856" text-anchor="middle" font-size="72" font-weight="900">3</text><text x="960" y="940" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="r-why" style="top:780px" data-at="5" data-fx="up">The rate law comes from the <span class="warm">slow step</span>: X + Y, bimolecular</div>`,
    update(c) {
      const b = c.b, t0 = b[3].start + 0.3, t1 = b[4].start - 0.25, p = c.seg(t0, t1)
      c.$('.r-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.r-arc').setAttribute('stroke-dashoffset', p)
      c.$('.r-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[4].start + 0.4, b[4].start + 0.9))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 1) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.r-tile .ok').style.opacity = win; c.$('.r-tile .ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="190" viewBox="0 0 460 190">
    <rect x="40" y="20" width="380" height="64" rx="16" fill="rgba(243,167,100,.12)" stroke="${WARM}" stroke-width="4"/><text x="230" y="64" text-anchor="middle" font-size="32" font-weight="900" class="f-warm">slow step 1</text>
    <path d="M230 92 V130" fill="none" stroke="#8d8df0" stroke-width="5" marker-end="url(#mk-pri)"/>
    <text x="230" y="176" text-anchor="middle" font-size="34" font-weight="900" class="f-pri">rate law</text></svg>`
  const r2 = `<svg width="460" height="190" viewBox="0 0 460 190">
    <g transform="translate(40 20) scale(.8)"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g><text x="110" y="58" font-size="32" font-weight="900" class="f-pri">adds up</text>
    <g transform="translate(40 110) scale(.8)"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g><text x="110" y="148" font-size="32" font-weight="900" class="f-teal">rate law matches</text></svg>`
  const r3 = `<svg width="460" height="190" viewBox="0 0 460 190"><line x1="60" y1="160" x2="420" y2="160" stroke="#a3abbd" stroke-width="4"/><line x1="60" y1="160" x2="60" y2="20" stroke="#a3abbd" stroke-width="4"/>
    <line x1="70" y1="80" x2="410" y2="80" stroke="#f2c443" stroke-width="7" stroke-linecap="round"/><text x="420" y="186" text-anchor="end" font-size="22" font-weight="800" class="f-muted">concentration</text><text x="52" y="34" text-anchor="end" font-size="22" font-weight="800" class="f-muted">rate</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card r-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>First step slow ${ARR}<br>rate law from the<br><span class="warm">slow step's</span><br>molecularity</p></div>
      <div class="card r-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>A valid mechanism<br><span class="pri">adds up</span> AND<br><span class="teal">matches</span> the<br>experimental rate law</p></div>
      <div class="card r-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Species only<br>after the slow step<br>are <span class="gold">zero order</span></p></div>`,
  })
})()
