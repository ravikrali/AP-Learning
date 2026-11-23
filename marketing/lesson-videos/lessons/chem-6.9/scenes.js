// Pictures for chem-6.9 "Hess's Law". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u6.ts and chem/book.ts): the
// carbon monoxide worked example, the -50 kJ reversed-and-tripled check, the sulfur trioxide quick
// check and the A -> B try question. Energy levels show order and direction, not exact scale.
(() => {
  const { clamp, lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-foot{position:absolute;left:0;right:0;bottom:26px;text-align:center;font-size:40px;font-weight:900;white-space:nowrap}
    .x-line{position:absolute;left:0;width:1920px;text-align:center;font-size:44px;font-weight:900;white-space:nowrap}
    .x-rule{top:300px;width:540px;height:300px;text-align:center}
    .x-rule .n{margin:26px auto 0;width:70px;height:70px;border-radius:50%;background:var(--brand);font-size:40px;font-weight:900;line-height:70px}
    .x-rule .T{margin-top:16px;font-size:44px;font-weight:900;white-space:nowrap}
    .x-rule .F{margin-top:12px;font-size:38px;font-weight:800;white-space:nowrap}
    .x-rule .S{margin-top:10px;font-size:30px;font-weight:800;color:var(--muted);white-space:nowrap}
    .x-step{position:absolute;top:660px;width:440px;height:170px;border-radius:28px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center}
    .x-step .H{margin-top:22px;font-size:30px;font-weight:900;letter-spacing:.08em;color:var(--muted);white-space:nowrap}
    .x-step .V{margin-top:10px;font-size:64px;font-weight:900;white-space:nowrap}
    .x-sarr{position:absolute;top:720px;font-size:50px;font-weight:900;color:var(--muted)}
    .x-row{position:absolute;left:120px;width:1680px;height:96px;border-radius:24px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .x-row .L{position:absolute;left:28px;top:0;line-height:92px;font-size:34px;font-weight:900;color:var(--muted);white-space:nowrap}
    .x-row .E{position:absolute;left:250px;top:0;line-height:92px;font-size:50px;font-weight:900;white-space:nowrap}
    .x-row .D{position:absolute;right:34px;top:0;line-height:92px;font-size:48px;font-weight:900;white-space:nowrap}
    .x-tag{position:absolute;height:60px;padding:0 22px;border-radius:30px;font-size:32px;font-weight:900;line-height:56px;white-space:nowrap}
    .x-tag.k{background:rgba(60,199,188,.16);border:2px solid rgba(60,199,188,.7);color:var(--accent)}
    .x-tag.r{background:rgba(243,167,100,.16);border:2px solid rgba(243,167,100,.7);color:var(--warm)}
    .x-sp{border-radius:12px;padding:0 6px;transition:none}
    .x-sum{position:absolute;left:0;width:1920px;top:310px;text-align:center;font-size:76px;font-weight:900;white-space:nowrap}
    .x-sum span{padding:0 4px}
    .x-gone{opacity:.4;text-decoration:line-through;text-decoration-color:var(--bad);text-decoration-thickness:7px}
    .x-res{position:absolute;left:0;width:1920px;top:480px;text-align:center;font-size:76px;font-weight:900;white-space:nowrap}
    .x-dh{position:absolute;left:360px;top:650px;width:1200px;height:150px;border-radius:30px;background:rgba(36,40,56,.92);border:3px solid rgba(141,141,240,.6);text-align:center;font-size:64px;font-weight:900;line-height:146px;white-space:nowrap}
    .x-lv{position:absolute;font-size:40px;font-weight:900;white-space:nowrap}
    .x-av{position:absolute;font-size:44px;font-weight:900;white-space:nowrap}
    .x-hs{position:absolute;left:120px;width:980px;height:104px;border-radius:24px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .x-hs i{position:absolute;left:24px;top:20px;width:60px;height:60px;border-radius:50%;background:var(--brand);font-style:normal;font-size:34px;font-weight:900;line-height:60px;text-align:center}
    .x-hs b{position:absolute;left:110px;top:0;right:20px;font-size:34px;font-weight:900;line-height:1.2;display:flex;align-items:center;height:100px}
    .x-tab{left:1160px;top:300px;width:640px;height:500px}
    .x-tab table{position:absolute;left:30px;top:110px;width:580px;border-collapse:collapse;font-size:32px;font-weight:800}
    .x-tab td{padding:16px 10px;border-bottom:2px solid var(--line);white-space:nowrap}
    .x-tab td:last-child{text-align:right;font-weight:900}
    .x-tab tr.tot td{border-bottom:none;font-size:38px}
    .x-gv{position:absolute;top:310px;width:820px;height:190px;border-radius:28px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center}
    .x-gv .N{margin-top:26px;font-size:30px;font-weight:900;letter-spacing:.1em;color:var(--muted)}
    .x-gv .V{margin-top:16px;font-size:56px;font-weight:900;white-space:nowrap}
    .x-ans{position:absolute;left:120px;top:560px;width:1680px;height:360px;border-radius:30px;background:rgba(36,40,56,.92);border:3px solid rgba(76,199,129,.8)}
    .x-ans .ok{position:absolute;left:44px;top:44px;width:84px;height:84px}
    .x-ans .A{position:absolute;left:156px;top:30px;font-size:96px;font-weight:900}
    .x-ans .W{position:absolute;left:60px;font-size:44px;font-weight:800;white-space:nowrap}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', WARM = '#f3a764', TXT = '#eef0f7', GOLD = '#f2c443', PRI = '#8d8df0', MUT = '#a3abbd'
  const CHECK = '<svg viewBox="0 0 64 64" style="display:block;width:100%;height:100%"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const O2 = 'O<sub>2</sub>', CO2 = 'CO<sub>2</sub>', SO2 = 'SO<sub>2</sub>', SO3 = 'SO<sub>3</sub>'
  const lvl = (x1, x2, y, col = TXT, w = 9) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`
  const down = (x, y1, y2, col, mk, w = 9) => `<line x1="${x}" y1="${y1 + 8}" x2="${x}" y2="${y2 - 16}" stroke="${col}" stroke-width="${w}" marker-end="url(#mk-${mk})"/>`

  // ---------- intro artwork: a faint two-route energy diagram on the left, a mountain with two trails on the right ----------
  EZ.intro = {
    chips: [['1@0.5', 'Reverse'], ['1@0.64', 'Multiply'], ['1@0.8', 'Add']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">
      ${lvl(60, 300, 380)}${lvl(240, 420, 520)}${lvl(60, 420, 820)}
      ${down(110, 380, 820, GOLD, 'gold')}${down(280, 380, 520, TEAL, 'teal')}${down(380, 520, 820, TEAL, 'teal')}
      <path d="M1500 860 L1700 470 L1900 860 Z" fill="none" stroke="${TXT}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M1560 850 Q1640 700 1700 480" fill="none" stroke="${WARM}" stroke-width="6"/>
      <path d="M1840 850 L1640 760 L1780 650 L1660 560 L1700 480" fill="none" stroke="${TEAL}" stroke-width="6"/>
    </svg>`,
  }

  // ---------- hook: carbon burns to CO and CO2 together ----------
  const C = (x, y) => ball(x, y, 40, 'gray', 'C', 32), O = (x, y) => ball(x, y, 36, 'red', 'O', 28)
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">The problem</div><h2 class="h1" data-at="0">Some reactions can't be measured</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:470px" data-at="2"><h3>The goal: only CO</h3>
        <svg style="position:absolute;left:0;top:100px" width="810" height="300" viewBox="0 0 810 300">
          ${C(170, 140)}<text x="260" y="156" text-anchor="middle" font-size="50" font-weight="900" class="f-muted">+</text>${O(340, 140)}${O(412, 140)}
          <line x1="480" y1="140" x2="560" y2="140" stroke="${TXT}" stroke-width="7" marker-end="url(#mk-text)"/>
          ${C(640, 140)}${O(714, 140)}
          <text x="676" y="250" text-anchor="middle" font-size="36" font-weight="900" class="f-teal">CO only?</text>
        </svg></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:470px" data-at="3"><h3>What you get</h3>
        <svg style="position:absolute;left:0;top:100px" width="810" height="300" viewBox="0 0 810 300">
          ${C(200, 130)}${O(274, 130)}<text x="237" y="240" text-anchor="middle" font-size="36" font-weight="900">CO</text>
          <text x="400" y="146" text-anchor="middle" font-size="50" font-weight="900" class="f-muted">+</text>
          ${O(520, 130)}${C(594, 130)}${O(668, 130)}<text x="594" y="240" text-anchor="middle" font-size="36" font-weight="900" class="f-warm">some CO<tspan dy="8" font-size=".65em">2</tspan><tspan dy="-8"> too</tspan></text>
        </svg></div>
      <div class="x-line" style="top:796px" data-at="4" data-fx="fade">So how do you find <span class="gold">ΔH</span> for making CO?</div>
      <div class="banner" style="top:870px;font-size:44px" data-at="5" data-fx="pop">Hess's law: <span class="teal">add up reactions you can measure</span></div>`,
  })

  // ---------- the idea: steps add up; a state function; two hikers ----------
  const TR1 = 'M110 330 C190 260 250 140 400 46', TR2 = 'M640 330 L460 285 L580 220 L380 170 L470 115 L400 46'
  EZ.scene('idea', {
    html: `<div class="kicker" data-at="in" data-fx="left">The idea</div><h2 class="h1" data-at="0">The steps add up</h2>
      <div class="card" style="left:120px;top:290px;width:810px;height:520px" data-at="1"><h3>Energy is conserved</h3>
        <svg style="position:absolute;left:0;top:100px" width="810" height="340" viewBox="0 0 810 340">
          ${lvl(80, 500, 30)}<text x="90" y="16" font-size="28" font-weight="800" class="f-muted">start</text>
          ${lvl(440, 700, 150)}${lvl(80, 760, 300)}<text x="90" y="336" font-size="28" font-weight="800" class="f-muted">finish</text>
          <g data-at="2" data-fx="fade">${down(220, 30, 300, GOLD, 'gold')}<text x="240" y="176" font-size="36" font-weight="900" class="f-gold">overall ΔH</text></g>
          <g data-at="2@0.3" data-fx="fade">${down(470, 30, 150, TEAL, 'teal')}<text x="560" y="100" font-size="30" font-weight="900" class="f-teal">step 1</text>
            ${down(670, 150, 300, TEAL, 'teal')}<text x="560" y="240" font-size="30" font-weight="900" class="f-teal">step 2</text></g>
        </svg>
        <div class="x-foot" data-at="2@0.6" data-fx="fade"><span class="gold">ΔH</span> = <span class="teal">step 1</span> + <span class="teal">step 2</span></div></div>
      <div class="card" style="left:990px;top:290px;width:810px;height:520px" data-at="3"><h3>A <span class="pri">state function</span></h3>
        <svg style="position:absolute;left:0;top:100px" width="810" height="340" viewBox="0 0 810 340">
          <g data-at="5" data-fx="fade">
            <path d="M60 336 L400 40 L760 336" fill="rgba(141,141,240,.08)" stroke="#646c82" stroke-width="4" stroke-linejoin="round"/>
            <path d="${TR1}" fill="none" stroke="${WARM}" stroke-width="6" stroke-linecap="round"/>
            <path d="${TR2}" fill="none" stroke="${TEAL}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="400" y1="40" x2="400" y2="0" stroke="${TXT}" stroke-width="4"/><path d="M400 0 L440 12 L400 24 Z" fill="${GOLD}"/>
            <text x="470" y="40" font-size="28" font-weight="800" class="f-muted">summit</text>
            <text x="400" y="330" text-anchor="middle" font-size="28" font-weight="800" class="f-muted">base</text>
            <circle class="x-h1" r="19" fill="${WARM}" stroke="#10131c" stroke-width="3"/><circle class="x-h2" r="11" fill="${TEAL}" stroke="#10131c" stroke-width="3"/>
          </g>
          <g data-at="6" data-fx="fade">${lvl(40, 120, 46, GOLD, 4)}${lvl(40, 120, 330, GOLD, 4)}
            <line x1="80" y1="320" x2="80" y2="64" stroke="${GOLD}" stroke-width="7" marker-end="url(#mk-gold)"/>
            <text x="20" y="200" font-size="26" font-weight="900" class="f-gold" transform="rotate(-90 20 200)" text-anchor="middle">same</text></g>
        </svg>
        <div class="x-foot" style="font-size:32px" data-at="4" data-fx="fade">depends only on the <span class="pri">state</span>, not the path</div></div>
      <div class="banner" style="top:850px;font-size:42px" data-at="7" data-fx="pop">Heat and work: depend on the path &nbsp;·&nbsp; <span class="gold">ΔH</span>: does not</div>`,
    update(c) {
      const p = eio(c.seg(c.b[5].start + 0.3, c.b[5].end + 0.6))
      for (const [cls, d] of [['.x-h1', TR1], ['.x-h2', TR2]]) {
        const path = c.root.querySelector(`path[d="${d}"]`), L = path.getTotalLength(), pt = path.getPointAtLength(L * p)
        c.$(cls).setAttribute('cx', pt.x); c.$(cls).setAttribute('cy', pt.y)
      }
    },
  })

  // ---------- the three rules, and -50 kJ reversed and tripled ----------
  EZ.scene('rules', {
    html: `<div class="kicker" data-at="in" data-fx="left">Three rules</div><h2 class="h1" data-at="0">Combining reactions</h2>
      <div class="card x-rule" style="left:120px" data-at="1"><div class="n">1</div><div class="T warm">Reverse</div><div class="F">flip the sign of ΔH</div><div class="S" data-at="2" data-fx="fade">same size</div></div>
      <div class="card x-rule" style="left:690px" data-at="3"><div class="n">2</div><div class="T teal">Multiply by c</div><div class="F">ΔH × c</div><div class="S">same factor</div></div>
      <div class="card x-rule" style="left:1260px" data-at="4"><div class="n">3</div><div class="T pri">Add reactions</div><div class="F">add the ΔH values</div><div class="S">step + step</div></div>
      <div class="x-step" style="left:120px" data-at="5@0.4" data-fx="pop"><div class="H">A REACTION</div><div class="V teal">−50 kJ</div></div>
      <div class="x-sarr" style="left:592px" data-at="6" data-fx="fade">${ARR}</div>
      <div class="x-step" style="left:740px" data-at="6@0.2" data-fx="pop"><div class="H">REVERSED</div><div class="V warm">+50 kJ</div></div>
      <div class="x-sarr" style="left:1212px" data-at="7" data-fx="fade">${ARR}</div>
      <div class="x-step" style="left:1360px;border-color:rgba(243,167,100,.8)" data-at="7@0.2" data-fx="pop"><div class="H">× 3</div><div class="V warm">+150 kJ</div></div>`,
  })

  // ---------- the carbon monoxide example: set up ----------
  const HL_T = 'rgba(60,199,188,.28)', HL_W = 'rgba(243,167,100,.3)'
  EZ.scene('example', {
    html: `<div class="kicker" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Making carbon monoxide</h2>
      <div class="x-row" style="top:300px;border:3px solid rgba(242,196,67,.75)" data-at="1"><div class="L gold">TARGET</div>
        <div class="E"><span class="x-sp x-tc">C(s)</span> + ½${O2}(g) ${ARR} <span class="x-sp x-tco">CO(g)</span></div><div class="D gold">ΔH = ?</div></div>
      <div class="x-row" style="top:430px" data-at="2"><div class="L">(1)</div>
        <div class="E"><span class="x-sp x-1c">C(s)</span> + ${O2}(g) ${ARR} ${CO2}(g)</div><div class="D">−393.5 kJ</div></div>
      <div class="x-row" style="top:550px" data-at="3" data-out="6"><div class="L">(2)</div>
        <div class="E"><span class="x-sp x-2co">CO(g)</span> + ½${O2}(g) ${ARR} ${CO2}(g)</div><div class="D">−283.0 kJ</div></div>
      <div class="x-row" style="top:550px;border:3px solid rgba(243,167,100,.75)" data-at="6" data-fx="pop"><div class="L warm">(2) reversed</div>
        <div class="E" style="left:330px">${CO2}(g) ${ARR} <span class="x-sp" style="background:${HL_W}">CO(g)</span> + ½${O2}(g)</div><div class="D warm">+283.0 kJ</div></div>
      <div class="x-tag k" style="left:1150px;top:448px" data-at="4@0.5" data-fx="pop">keep</div>
      <div class="x-tag r" style="left:1150px;top:568px" data-at="5@0.5" data-fx="pop" data-out="6">reverse</div>
      <div class="x-line" style="top:700px" data-at="4" data-fx="fade" data-out="5"><span class="teal">C</span> on the left in the target and in (1)</div>
      <div class="x-line" style="top:700px" data-at="5" data-fx="fade" data-out="6"><span class="warm">CO</span> must end up on the right</div>
      <div class="banner" style="top:820px;font-size:46px" data-at="6@0.3" data-fx="pop">Reverse ${ARR} flip the sign: <span class="muted">−283.0</span> becomes <span class="warm">+283.0 kJ</span></div>`,
    update(c) {
      const b = c.b, on4 = c.t >= b[4].start, on5 = c.t >= b[5].start
      c.$('.x-tc').style.background = on4 && !on5 ? HL_T : 'transparent'
      c.$('.x-1c').style.background = on4 && !on5 ? HL_T : 'transparent'
      c.$('.x-tco').style.background = on5 ? HL_W : 'transparent'
      c.$('.x-2co').style.background = on5 ? HL_W : 'transparent'
    },
  })

  // ---------- add, cancel, and sum ----------
  EZ.scene('add', {
    html: `<div class="kicker" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Add and cancel</h2>
      <div class="x-line muted" style="top:300px;font-size:34px;font-weight:800" data-at="0@0.3" data-fx="fade">(1) &nbsp;+&nbsp; (2) reversed</div>
      <div class="x-sum" style="top:360px" data-at="1" data-fx="fade">C &nbsp;+&nbsp; <span class="x-ol"><span class="x-oa">${O2}</span><span class="x-ob">½${O2}</span></span> &nbsp;+&nbsp; <span class="x-c1">${CO2}</span> &nbsp;${ARR}&nbsp; <span class="x-c2">${CO2}</span> &nbsp;+&nbsp; CO &nbsp;+&nbsp; <span class="x-or">½${O2}</span></div>
      <div class="x-res" style="top:520px" data-at="4" data-fx="pop"><span class="gold">C &nbsp;+&nbsp; ½${O2} &nbsp;${ARR}&nbsp; CO</span> <span class="x-tag k" style="position:relative;top:-14px;margin-left:24px;font-size:30px">the target</span></div>
      <div class="x-dh" data-at="5" data-fx="pop">ΔH = −393.5 + 283.0</div>
      <div class="banner" style="top:850px;font-size:56px" data-at="6" data-fx="pop">ΔH = <span class="gold">−110.5 kJ</span></div>`,
    update(c) {
      const b = c.b, g2 = c.t >= b[2].start + 0.3, g3 = c.t >= b[3].start + 0.3
      c.$('.x-c1').classList.toggle('x-gone', g2); c.$('.x-c2').classList.toggle('x-gone', g2)
      c.$('.x-or').classList.toggle('x-gone', g3)
      c.$('.x-oa').style.display = g3 ? 'none' : ''; c.$('.x-ob').style.display = g3 ? '' : 'none'
      c.$('.x-ob').style.background = g3 && c.t < b[4].start ? 'rgba(242,196,67,.25)' : 'transparent'
      c.$('.x-ob').style.borderRadius = '12px'
    },
  })

  // ---------- the same answer as an energy diagram ----------
  const YT = 350, YM = 480, YB = 800
  EZ.scene('cycle', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">As a picture</div><h2 class="h1" data-at="0">Two routes, one total</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1" data-fx="fade">
          <line x1="200" y1="${YB + 20}" x2="200" y2="${YT - 20}" stroke="#c9cee0" stroke-width="4" marker-end="url(#mk-text)"/>
          <text transform="translate(170 ${(YT + YB) / 2}) rotate(-90)" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">enthalpy</text>
          ${lvl(300, 1060, YT)}
        </g>
        <g data-at="2" data-fx="fade">${lvl(300, 1340, YB)}${down(520, YT, YB, GOLD, 'gold', 10)}</g>
        <g data-at="3" data-fx="fade">${lvl(900, 1340, YM)}${down(980, YT, YM, MUT, 'muted', 9)}${down(1260, YM, YB, TEAL, 'teal', 9)}</g>
      </svg>
      <div class="x-lv" style="left:310px;top:${YT - 66}px" data-at="1@0.3" data-fx="fade">C(s) + ${O2}(g)</div>
      <div class="x-lv" style="left:1370px;top:${YB - 26}px" data-at="2@0.4" data-fx="fade">${CO2}(g)</div>
      <div class="x-lv" style="left:1370px;top:${YM - 26}px" data-at="3@0.2" data-fx="fade">CO(g) + ½${O2}(g)</div>
      <div class="x-av gold" style="left:550px;top:${(YT + YB) / 2 - 30}px" data-at="2@0.5" data-fx="fade">−393.5 kJ</div>
      <div class="x-av teal" style="left:1290px;top:${(YM + YB) / 2 - 30}px" data-at="3@0.6" data-fx="fade">−283.0 kJ</div>
      <div class="x-av muted" style="left:1010px;top:${(YT + YM) / 2 - 30}px" data-at="3@0.3" data-fx="fade" data-out="5">?</div>
      <div class="x-av good" style="left:1010px;top:${(YT + YM) / 2 - 30}px" data-at="5@0.3" data-fx="pop">−110.5 kJ</div>
      <div class="banner" style="top:880px;font-size:42px" data-at="4" data-fx="pop">Same start, same finish ${ARR} <span class="gold">−393.5</span> = <span class="good">?</span> + <span class="teal">(−283.0)</span></div>`,
  })

  // ---------- the trick: target first ----------
  const hs = (i, at, html) => `<div class="x-hs" style="top:${300 + i * 124}px" data-at="${at}" data-fx="left"><i>${i + 1}</i><b><span>${html}</span></b></div>`
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">The trick</div><h2 class="h1" data-at="0">Work target-first</h2>
      ${hs(0, 1, 'Look at the <span class="gold">target</span> equation')}
      ${hs(1, 2, 'Find a species in <span class="teal">only one</span> given equation')}
      ${hs(2, 3, 'Flip and/or multiply it: <span class="warm">correct side</span>, <span class="warm">correct coefficient</span>')}
      ${hs(3, 4, 'Repeat, add it all up, check it matches the target')}
      <div class="card x-tab" data-at="5"><h3>Your ΔH table</h3>
        <table><tr><td>(1) kept</td><td>−393.5</td></tr><tr><td class="warm">(2) reversed</td><td class="warm">+283.0</td></tr><tr class="tot"><td>Sum</td><td class="gold">−110.5 kJ</td></tr></table></div>`,
  })

  // ---------- applying it: sulfur trioxide ----------
  EZ.scene('sulfur', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Target-first</div><h2 class="h1" data-at="0">Sulfur trioxide</h2>
      <div class="x-row" style="top:290px;border:3px solid rgba(242,196,67,.75)" data-at="1"><div class="L gold">TARGET</div>
        <div class="E"><span class="x-sp x-ts">2S(s)</span> + 3${O2}(g) ${ARR} <span class="x-sp x-tso">2${SO3}(g)</span></div><div class="D gold">ΔH = ?</div></div>
      <div class="x-row" style="top:400px" data-at="2"><div class="L">(1)</div>
        <div class="E"><span class="x-sp x-1s">S(s)</span> + ${O2}(g) ${ARR} ${SO2}(g)</div><div class="D">−297 kJ</div></div>
      <div class="x-row" style="top:510px" data-at="3"><div class="L">(2)</div>
        <div class="E"><span class="x-sp x-2so">2${SO3}(g)</span> ${ARR} 2${SO2}(g) + ${O2}(g)</div><div class="D">+198 kJ</div></div>
      <div class="x-tag k" style="left:1100px;top:418px" data-at="4@0.6" data-fx="pop">× 2</div>
      <div class="x-tag r" style="left:1100px;top:528px" data-at="5@0.6" data-fx="pop">reverse</div>
      <div class="x-row" style="top:640px;background:rgba(60,199,188,.08)" data-at="4@0.7" data-fx="up"><div class="L teal">2 × (1)</div>
        <div class="E" style="font-size:44px">2S + 2${O2} ${ARR} 2${SO2}</div><div class="D teal">−594 kJ</div></div>
      <div class="x-row" style="top:746px;background:rgba(243,167,100,.08)" data-at="5@0.7" data-fx="up"><div class="L warm">(2) rev.</div>
        <div class="E" style="font-size:44px">2${SO2} + ${O2} ${ARR} 2${SO3}</div><div class="D warm">−198 kJ</div></div>
      <div class="banner" style="top:868px;font-size:46px" data-at="6" data-fx="pop">ΔH = <span class="teal">−594</span> + <span class="warm">(−198)</span> = <span class="gold">−792 kJ</span></div>`,
    update(c) {
      const b = c.b, s4 = c.t >= b[4].start && c.t < b[5].start, s5 = c.t >= b[5].start && c.t < b[6].start
      c.$('.x-ts').style.background = s4 ? HL_T : 'transparent'; c.$('.x-1s').style.background = s4 ? HL_T : 'transparent'
      c.$('.x-tso').style.background = s5 ? HL_W : 'transparent'; c.$('.x-2so').style.background = s5 ? HL_W : 'transparent'
    },
  })

  // ---------- try it ----------
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1">What is ΔH?</h2>
      <div class="x-gv" style="left:120px" data-at="1@0.2" data-fx="pop"><div class="N">GIVEN</div><div class="V">A(g) ${ARR} B(g) &nbsp; <span class="warm">+40 kJ</span></div></div>
      <div class="x-gv" style="left:980px;border-color:rgba(242,196,67,.7)" data-at="1@0.6" data-fx="pop"><div class="N">FIND ΔH FOR</div><div class="V gold">2B(g) ${ARR} 2A(g)</div></div>
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="700" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="700" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 700)"/>
        <text class="x-num" x="960" y="726" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="830" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="x-ans" data-at="3" data-fx="pop"><div class="ok">${CHECK}</div><div class="A good">−80 kJ</div>
        <div class="W" style="top:160px" data-at="4" data-fx="fade"><span class="warm">Reverse:</span> +40 ${ARR} −40 kJ</div>
        <div class="W" style="top:222px" data-at="5" data-fx="fade"><span class="teal">Multiply by 2:</span> −40 ${ARR} <span class="good">−80 kJ</span></div>
        <div class="W" style="top:284px" data-at="6" data-fx="fade">Both steps: <span class="warm">reverse</span> and <span class="teal">multiply</span></div></div>`,
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
  const r1 = `<svg width="440" height="190" viewBox="0 0 440 190">${lvl(60, 240, 24, TXT, 7)}${lvl(200, 320, 90, TXT, 7)}${lvl(60, 380, 170, TXT, 7)}
    ${down(110, 24, 170, GOLD, 'gold', 7)}${down(220, 24, 90, TEAL, 'teal', 7)}${down(300, 90, 170, TEAL, 'teal', 7)}</svg>`
  const r2 = `<svg width="440" height="190" viewBox="0 0 440 190">
    <line x1="30" y1="70" x2="120" y2="70" stroke="${WARM}" stroke-width="8" marker-end="url(#mk-warm)"/><line x1="120" y1="120" x2="30" y2="120" stroke="${WARM}" stroke-width="8" marker-end="url(#mk-warm)"/>
    <text x="220" y="112" text-anchor="middle" font-size="60" font-weight="900" class="f-teal">×c</text>
    <text x="370" y="114" text-anchor="middle" font-size="72" font-weight="900" class="f-pri">+</text></svg>`
  const r3 = `<svg width="440" height="190" viewBox="0 0 440 190">${[40, 95, 150].map((y, i) => `<rect x="40" y="${y - 20}" width="220" height="40" rx="20" fill="#363c54"/><rect x="56" y="${y - 14}" width="70" height="28" rx="14" fill="${i === 1 ? GOLD : '#646c82'}"/>`).join('')}
    <text x="278" y="105" font-size="30" font-weight="900" class="f-gold">only here</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Overall ΔH =<br>the <span class="gold">sum</span> of the<br>ΔH values<br>of the steps</p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p><span class="warm">Reverse</span>: flip the sign<br><span class="teal">× c</span>: ΔH × c<br><span class="pri">Add</span> equations:<br>add ΔH values</p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Start with species<br>that appear in<br><span class="gold">only one</span> given<br>equation</p></div>`,
  })
})()
