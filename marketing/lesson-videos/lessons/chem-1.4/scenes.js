// Pictures for chem-1.4 "Composition of Mixtures". One EZ.scene per scene id in script.mjs.
// All numbers shown are the lesson's own (app/src/content/chem/u1.ts).
(() => {
  const { clamp, eio, eo, back, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    sub{font-size:.6em} sup{font-size:.6em;line-height:0}
    .pc{position:absolute;top:300px;width:810px;height:380px;text-align:center}
    .pc h3{font-size:46px;padding-top:24px}
    .pc .s{position:absolute;left:0;right:0;bottom:26px;font-size:34px;font-weight:800;color:var(--muted);white-space:nowrap}
    .chip2{position:absolute;top:716px;width:540px;height:100px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center;font-size:36px;font-weight:900;line-height:94px;white-space:nowrap}
    .hc{position:absolute;top:300px;width:540px;height:400px;text-align:center}
    .hc h3{font-size:44px;padding-top:24px}
    .bar{position:absolute;left:60px;right:60px;height:46px;border-radius:23px;background:#2a2f44;overflow:hidden}
    .bar i{position:absolute;left:0;top:0;bottom:0;border-radius:23px}
    .bl{position:absolute;left:0;right:0;font-size:32px;font-weight:800;color:var(--muted);white-space:nowrap}
    .xc{position:absolute;width:760px;height:200px;text-align:center}
    .xc b{display:block;margin-top:30px;font-size:46px;font-weight:900} .xc span{display:block;margin-top:10px;font-size:34px;font-weight:800;color:var(--muted)}
    .st{position:absolute;left:120px;width:1680px;height:164px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .st .n{position:absolute;left:24px;top:50px;width:64px;height:64px;border-radius:50%;background:var(--brand);font-size:38px;font-weight:900;line-height:64px;text-align:center}
    .st .t{position:absolute;left:116px;top:20px;font-size:30px;font-weight:900;letter-spacing:.02em;color:var(--muted);white-space:nowrap}
    .st .e{position:absolute;left:116px;top:70px;font-size:46px;font-weight:900;white-space:nowrap}
    .st .r{position:absolute;right:40px;top:0;line-height:164px;font-size:56px;font-weight:900;white-space:nowrap}
    .hh{position:absolute;top:320px;width:810px;height:420px;text-align:center}
    .hh h3{font-size:52px;padding-top:30px} .hh .big{display:block;margin-top:14px;font-size:150px;font-weight:900;line-height:1}
    .hh p{margin:14px 30px 0;font-size:40px;font-weight:800;line-height:1.3}
    .opt{position:absolute;left:120px;width:1680px;height:100px;padding-left:112px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;font-size:36px;font-weight:800;white-space:nowrap}
    .opt .l{position:absolute;left:26px;top:20px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;text-align:center;color:var(--muted)}
    .opt .pc2{position:absolute;right:40px;font-size:32px;font-weight:800;color:var(--muted)}
    .opt .ok{position:absolute;right:24px;top:16px;width:64px;height:64px}
    .rc{top:320px;width:540px;height:560px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc svg{display:block;margin:14px auto 0} .rc p{margin:14px 14px 0;font-size:35px;font-weight:800;line-height:1.3;white-space:nowrap}
  `
  document.head.appendChild(css)

  const all = (c, q) => (c['_' + q] ??= [...c.root.querySelectorAll(q)])
  const CK = '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'

  // a block of particles: pure = one colour, mixture = several
  const dots = (cols, rows, x0, y0, pitch, r, pick, cls) => { let h = ''
    for (let j = 0; j < rows; j++) for (let k = 0; k < cols; k++) h += `<g class="${cls}" data-i="${j * cols + k}">${ball(x0 + k * pitch + (j % 2) * pitch * 0.35, y0 + j * pitch, r, pick(j, k))}</g>`
    return h }
  const MIXC = ['teal', 'warm', 'pur', 'teal', 'pur', 'warm', 'warm', 'teal', 'pur', 'pur', 'teal', 'warm', 'teal', 'warm', 'pur', 'teal', 'pur', 'warm', 'teal', 'pur', 'warm', 'pur', 'teal', 'warm']

  // ---------- intro artwork: faint element-percent bars at the left and right edges ----------
  const ibar = (x, y, w, f, c) => `<rect x="${x}" y="${y}" width="${w}" height="30" rx="15" fill="#fff" opacity=".5"/><rect x="${x}" y="${y}" width="${w * f}" height="30" rx="15" fill="${c}"/>`
  EZ.intro = {
    chips: [['1@0.28', 'Pure vs. mixture'], ['1@0.52', 'Checking purity'], ['1@0.76', 'Reading the impurity']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.16">
      ${ibar(50, 260, 230, 0.61, '#3cc7bc')}${ibar(50, 330, 230, 0.48, '#8d8df0')}${ibar(50, 400, 230, 0.83, '#f3a764')}
      ${ibar(1640, 260, 230, 0.48, '#8d8df0')}${ibar(1640, 330, 230, 0.83, '#f3a764')}${ibar(1640, 400, 230, 0.61, '#3cc7bc')}
      ${dots(3, 3, 90, 700, 70, 24, (j, k) => MIXC[j * 3 + k], 'x')}${dots(3, 3, 1700, 700, 70, 24, (j, k) => MIXC[9 + j * 3 + k], 'x')}</svg>`,
  }

  // ---------- hook: how could you check a supplement? ----------
  const bar = (top, f, col, cls) => `<div class="bar" style="top:${top}px"><i class="${cls}" style="width:${f * 100}%;background:${col}"></i></div>`
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Is it pure?</div><h2 class="h1" data-at="0">A supplement claims to be pure</h2>
      <div class="card hc" style="left:120px" data-at="0@0.2"><h3>The supplement</h3>
        <svg style="position:absolute;left:0;top:90px" width="540" height="290" viewBox="0 0 540 290">
          <rect x="190" y="30" width="160" height="40" rx="10" fill="#aab1c4"/><rect x="170" y="62" width="200" height="190" rx="34" fill="#232840" stroke="#aab1c4" stroke-width="7"/>
          <rect x="190" y="110" width="160" height="90" rx="12" fill="rgba(141,141,240,.25)"/><text x="270" y="170" text-anchor="middle" font-size="44" font-weight="900" class="f-pri">PURE</text>
          <g data-at="1" data-fx="pop"><text x="270" y="288" text-anchor="middle" font-size="34" font-weight="900" class="f-warm">can't see the atoms</text><text x="425" y="130" text-anchor="middle" font-size="110" font-weight="900" style="fill:#f0707a">?</text></g></svg></div>
      <div class="card hc" style="left:690px" data-at="2"><h3 class="teal">Measure one element</h3>
        <div class="bl" style="top:130px">how much is in the sample</div>${bar(190, 0.62, '#3cc7bc', 'mb')}<div class="bl" style="top:260px;color:var(--text)">measured</div></div>
      <div class="card hc" style="left:1260px" data-at="3"><h3 class="pri">Pure compound</h3>
        <div class="bl" style="top:130px">how much it should contain</div>${bar(190, 0.5, '#8d8df0', 'tb')}<div class="bl" style="top:260px;color:var(--text)">theoretical</div></div>
      <div class="banner" style="top:830px" data-at="3@0.5" data-fx="pop">Compare <span class="teal">measured</span> to <span class="pri">theoretical</span></div>`,
    update(c) {
      const p = c.p('2@0.2', 0.8), q = c.p('3@0.2', 0.8)
      c.$('.mb').style.width = 62 * p + '%'; c.$('.tb').style.width = 50 * q + '%'
    },
  })

  // ---------- pure substance vs mixture ----------
  EZ.scene('pure', {
    html: `<div class="kicker" data-at="in" data-fx="left">Two definitions</div><h2 class="h1" data-at="0">Pure substance vs. <span class="warm">mixture</span></h2>
      <div class="card pc" style="left:120px" data-at="1" data-fx="right"><h3 class="teal">Pure substance</h3>
        <svg style="position:absolute;left:0;top:90px" width="810" height="230">${dots(8, 3, 225, 52, 52, 22, () => 'teal', 'j')}</svg>
        <div class="s">one type of particle · composition <span class="teal">fixed</span></div></div>
      <div class="card pc" style="left:990px" data-at="2" data-fx="right"><h3 class="warm">Mixture</h3>
        <svg style="position:absolute;left:0;top:90px" width="810" height="230">${dots(8, 3, 225, 52, 52, 22, (j, k) => MIXC[j * 8 + k], 'j')}</svg>
        <div class="s">two or more types · proportions <span class="warm">can vary</span></div></div>
      <div data-at="3" data-fx="fade"><div class="chip2" style="left:120px;width:560px">Salt water: <span class="teal">1% salt</span></div><div class="chip2" style="left:720px;width:560px">Salt water: <span class="warm">20% salt</span></div><div class="chip2" style="left:1320px;width:480px;background:rgba(60,199,188,.14);border-color:rgba(60,199,188,.6)">still salt water</div></div>
      <div class="banner" style="top:860px" data-at="4" data-fx="pop">Pure NaCl is <span class="teal">always 60.7% Cl</span> by mass</div>`,
    update(c) {
      for (const g of all(c, '.j')) { const i = +g.dataset.i; g.setAttribute('transform', `translate(${(2.4 * Math.sin(c.t * 9 + i * 1.7)).toFixed(2)} ${(2.4 * Math.cos(c.t * 8 + i * 2.3)).toFixed(2)})`) }
    },
  })

  // ---------- elemental analysis checks purity ----------
  EZ.scene('check', {
    html: `<div class="kicker" data-at="in" data-fx="left">Elemental analysis</div><h2 class="h1" data-at="0">A purity test: measured vs. theoretical</h2>
      <div class="card xc" style="left:120px;top:290px;width:720px;height:200px" data-at="1" data-fx="right"><b class="teal">Measured mass %</b><span>of an element in the sample</span></div>
      <div style="position:absolute;left:840px;width:240px;top:360px;text-align:center;font-size:60px;font-weight:900;color:var(--muted)" data-at="1@0.4" data-fx="pop">vs.</div>
      <div class="card xc" style="left:1080px;top:290px;width:720px;height:200px" data-at="1@0.2" data-fx="left"><b class="pri">Theoretical mass %</b><span>for the pure compound</span></div>
      <div class="card xc" style="left:120px;top:560px;width:810px;height:190px;border-color:rgba(76,199,129,.7)" data-at="2" data-fx="right"><b class="good">They match</b><span>consistent with being pure</span></div>
      <div class="card xc" style="left:990px;top:560px;width:810px;height:190px;border-color:rgba(240,112,122,.7)" data-at="3" data-fx="left"><b class="bad">They don’t match</b><span>something else is in the sample</span></div>
      <div class="banner" style="top:830px" data-at="4" data-fx="pop">Which way it is off <span class="warm">tells you the kind of impurity</span></div>`,
  })

  // ---------- worked example: the problem ----------
  EZ.scene('example', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Example</div><h2 class="h1" data-at="0">How pure is the salt?</h2>
      <div class="card" style="left:120px;top:290px;width:1680px;height:310px" data-at="1@0.1">
        <div style="position:absolute;left:0;right:0;top:30px;text-align:center;font-size:50px;font-weight:900">2.00 g sample</div>
        <div style="position:absolute;left:120px;top:130px;width:1440px;height:110px;border-radius:24px;overflow:hidden;border:3px solid var(--line);display:flex">
          <div style="width:62%;background:linear-gradient(#3cc7bc,#2a9c93);text-align:center;font-size:44px;font-weight:900;line-height:104px;color:#10131c;white-space:nowrap">NaCl</div>
          <div style="flex:1;background:linear-gradient(#f3a764,#c97c37);text-align:center;font-size:40px;font-weight:900;line-height:104px;color:#10131c;white-space:nowrap">impurity</div></div>
        <div style="position:absolute;left:1560px;width:0;top:130px"></div>
        <div style="position:absolute;left:660px;top:250px;width:760px;text-align:center;font-size:40px;font-weight:900" data-at="1" data-fx="fade">the impurity has <span class="bad">no chlorine</span></div></div>
      <div class="card" style="left:200px;top:660px;width:700px;height:170px;text-align:center;border-color:rgba(60,199,188,.7)" data-at="2" data-fx="right"><div style="margin-top:22px;font-size:34px;font-weight:800;color:var(--muted)">analysis finds</div><div style="font-size:70px;font-weight:900;margin-top:6px"><span class="teal">0.900 g</span> Cl</div></div>
      <div class="card" style="left:1020px;top:660px;width:700px;height:170px;text-align:center;border-color:rgba(243,167,100,.7)" data-at="3" data-fx="left"><div style="margin-top:22px;font-size:34px;font-weight:800;color:var(--muted)">find</div><div style="font-size:44px;white-space:nowrap;font-weight:900;margin-top:12px"><span class="warm">% of sample</span> that is NaCl</div></div>`,
    update(c) {},
  })

  // ---------- worked example: the steps ----------
  EZ.scene('steps', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Example</div><h2 class="h1" data-at="0">Three steps</h2>
      <div class="st" style="top:290px" data-at="0@0.3" data-fx="right"><div class="n">1</div><div class="t">Pure NaCl</div><div class="e">35.45 / 58.44</div><div class="r good" data-at="0@0.6" data-fx="pop">60.66% Cl</div></div>
      <div class="st" style="top:478px" data-at="1" data-fx="right"><div class="n">2</div><div class="t">Mass of NaCl that holds 0.900 g Cl</div><div class="e" data-at="2" data-fx="fade">0.900 g Cl × <span class="pri">58.44 g NaCl / 35.45 g Cl</span></div><div class="r good" data-at="3" data-fx="pop">1.48 g NaCl</div></div>
      <div class="st" style="top:666px" data-at="4" data-fx="right"><div class="n">3</div><div class="t">Divide by the sample, ×100</div><div class="e">1.48 ÷ 2.00 × 100</div><div class="r good" data-at="5" data-fx="pop">74.2%</div></div>
      <div class="banner" style="top:870px" data-at="5@0.3" data-fx="pop">About <span class="teal">74.2% NaCl</span></div>`,
  })

  // ---------- trick: too high or too low? ----------
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Too high or too low?</h2>
      <div class="card hh" style="left:120px;border-color:rgba(60,199,188,.7)" data-at="1" data-fx="right"><h3 class="teal">Measured % higher</h3><span class="big teal up">↑</span><p>impurity has <span class="teal">more</span> of that element</p></div>
      <div class="card hh" style="left:990px;border-color:rgba(243,167,100,.7)" data-at="2" data-fx="left"><h3 class="warm">Measured % lower</h3><span class="big warm dn">↓</span><p>impurity has <span class="warm">less</span> of it, or none</p></div>
      <div class="banner" style="top:830px" data-at="3" data-fx="pop">This alone answers many <span class="warm">multiple-choice</span> questions</div>`,
    update(c) {
      c.$('.up').style.transform = `translateY(${-10 * Math.sin(c.t * 4)}px)`; c.$('.dn').style.transform = `translateY(${10 * Math.sin(c.t * 4)}px)`
    },
  })

  // ---------- try it ----------
  const OPTS = [['A', 'NaCl', '60.7% Cl', '1@0.28'], ['B', 'KBr', '0% Cl', '1@0.5'], ['C', 'KI', '0% Cl', '1@0.62'], ['D', 'Sand, SiO<sub>2</sub>', '0% Cl', '1@0.78']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:50px;line-height:1.2" data-at="1">Pure KCl is <span class="pri">47.6% Cl</span>. A “pure KCl” sample tests at <span class="warm">52.0% Cl</span>.<br>Which impurity could explain this?</h2>
      ${OPTS.map(([l, s, p, at], i) => `<div class="opt t${i}" style="top:${360 + i * 114}px" data-at="${at}" data-fx="left"><div class="l">${l}</div>${s}<span class="pc2">${i === 0 ? '' : p}</span>${i === 0 ? '<span class="pc2" style="right:130px">60.7% Cl</span>' + CK.replace('class="ok"', 'class="ok" style="opacity:0"') : ''}</div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="900" r="62" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="900" r="62" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 900)"/>
        <text class="num" x="960" y="924" text-anchor="middle" font-size="66" font-weight="900">3</text><text x="1060" y="912" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:830px;font-size:44px" data-at="4" data-fx="pop">Needs <span class="teal">higher Cl%</span> than KCl ${ARR} only <span class="teal">NaCl</span> does</div>`,
    update(c) {
      const b = c.b, t0 = b[3].start + 0.3, t1 = b[4].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[4].start + 0.5, b[4].start + 0.95))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 0) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const rbar = (y, f, col) => `<rect x="60" y="${y}" width="340" height="30" rx="15" fill="#2a2f44"/><rect x="60" y="${y}" width="${340 * f}" height="30" rx="15" fill="${col}"/>`
  const m1 = `<svg width="460" height="200" viewBox="0 0 460 200">${dots(3, 2, 56, 60, 52, 20, () => 'teal', '')}${dots(3, 2, 276, 60, 52, 20, (j, k) => MIXC[j * 3 + k], '')}<text x="110" y="180" text-anchor="middle" font-size="30" font-weight="900" class="f-teal">fixed</text><text x="330" y="180" text-anchor="middle" font-size="30" font-weight="900" class="f-warm">varies</text></svg>`
  const m2 = `<svg width="460" height="200" viewBox="0 0 460 200">${rbar(40, 0.62, '#3cc7bc')}${rbar(110, 0.5, '#8d8df0')}<text x="230" y="30" text-anchor="middle" font-size="28" font-weight="900" class="f-teal">measured</text><text x="230" y="100" text-anchor="middle" font-size="28" font-weight="900" class="f-pri">theoretical</text><text x="230" y="180" text-anchor="middle" font-size="30" font-weight="900" class="f-muted">match? →  pure</text></svg>`
  const m3 = `<svg width="460" height="200" viewBox="0 0 460 200"><text x="120" y="95" text-anchor="middle" font-size="120" font-weight="900" class="f-teal">↑</text><text x="340" y="95" text-anchor="middle" font-size="120" font-weight="900" class="f-warm">↓</text><text x="120" y="160" text-anchor="middle" font-size="30" font-weight="900" class="f-teal">richer</text><text x="340" y="160" text-anchor="middle" font-size="30" font-weight="900" class="f-warm">poorer</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div>${m1}<p><span class="teal">Pure: fixed</span> composition<br><span class="warm">Mixtures: can vary</span></p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div>${m2}<p>Compare <span class="teal">measured</span> vs.<br><span class="pri">theoretical</span> mass %<br>to judge purity</p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div>${m3}<p>Higher % → impurity<br><span class="teal">richer</span> in that element<br>Lower % → <span class="warm">poorer</span></p></div>`,
  })
})()
