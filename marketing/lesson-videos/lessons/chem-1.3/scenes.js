// Pictures for chem-1.3 "Composition of Pure Substances". One EZ.scene per scene id in script.mjs.
// Everything shown is the lesson's own (app/src/content/chem/u1.ts and book.ts). Atom sizes only
// suggest which atom is bigger, not an exact scale.
(() => {
  const { clamp, eo, back, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .c3{position:absolute;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .st{position:absolute;left:920px;width:880px;height:118px;padding:0 30px 0 112px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line);display:flex;flex-direction:column;justify-content:center;white-space:nowrap}
    .st small{position:absolute;left:26px;top:28px;width:62px;height:62px;border-radius:50%;background:var(--brand);font-size:36px;font-weight:900;line-height:62px;text-align:center}
    .st b{font-size:40px;font-weight:900;line-height:1.15} .st span{margin-top:4px;font-size:29px;font-weight:700;color:var(--muted)}
    .tb3{position:absolute;left:120px;top:300px;width:1680px;border-collapse:collapse;font-size:46px;font-weight:800;text-align:center}
    .tb3 th{font-size:30px;font-weight:900;letter-spacing:.06em;color:var(--muted);padding:10px 8px;text-transform:uppercase}
    .tb3 td{padding:16px 8px;border-top:2px solid var(--line)}
    .rc{top:320px;width:540px;height:560px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc svg{display:block;margin:14px auto 0} .rc p{margin:14px 10px 0;font-size:35px;font-weight:800;line-height:1.3;white-space:nowrap}
    .ln{position:absolute;left:0;width:1920px;text-align:center;font-weight:900;white-space:nowrap}
  `
  document.head.appendChild(css)

  const sub = (s) => `<span style="font-size:.62em;position:relative;top:.28em">${s}</span>`
  // water: two small hydrogen balls on one larger oxygen ball
  const water = (x, y, k = 1) => `${ball(x - 62 * k, y + 46 * k, 30 * k, 'gray', 'H', 30 * k)}${ball(x + 62 * k, y + 46 * k, 30 * k, 'gray', 'H', 30 * k)}${ball(x, y, 48 * k, 'warm', 'O', 48 * k)}`
  const bar = (x, y, w, h, hp) => `<rect x="${x}" y="${y}" width="${w * hp}" height="${h}" rx="10" fill="#aab1c4"/><rect x="${x + w * hp}" y="${y}" width="${w * (1 - hp)}" height="${h}" rx="10" fill="#f3a764"/>`

  // ---------- intro artwork: faint atoms at the left and right edges (all above y = 950) ----------
  EZ.intro = {
    chips: [['1@0.28', 'Fixed recipe'], ['1@0.52', 'Mass percent'], ['1@0.76', 'Percent to formula']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">${water(110, 330, 1.5)}${water(1810, 330, 1.5)}${water(110, 700, 1.5)}${water(1810, 700, 1.5)}</svg>`,
  }

  // ---------- hook: the same water, anywhere ----------
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Look closer</div><h2 class="h1" data-at="0">The same water, <span class="warm">anywhere</span></h2>
      <div class="card" style="left:120px;top:320px;width:500px;height:300px;text-align:center" data-at="0@0.3" data-fx="pop"><h3>Glacier</h3><svg style="margin-top:6px" width="460" height="190" viewBox="0 0 460 190">${water(230, 80, 1.1)}</svg></div>
      <div class="card" style="left:710px;top:320px;width:500px;height:300px;text-align:center" data-at="1" data-fx="pop"><h3>Your tap</h3><svg style="margin-top:6px" width="460" height="190" viewBox="0 0 460 190">${water(230, 80, 1.1)}</svg></div>
      <div class="card" style="left:1300px;top:320px;width:500px;height:300px;text-align:center" data-at="1@0.55" data-fx="pop"><h3>Mars</h3><svg style="margin-top:6px" width="460" height="190" viewBox="0 0 460 190">${water(230, 80, 1.1)}</svg></div>
      <div class="c3" style="left:120px;top:680px;width:1680px;height:170px" data-at="2" data-fx="up">
        <svg style="position:absolute;left:0;top:0" width="1680" height="170" viewBox="0 0 1680 170">${bar(60, 40, 1560, 56, 0.112)}
          <text x="60" y="140" font-size="40" font-weight="900" class="f-muted">11.2% hydrogen</text>
          <text x="1620" y="140" text-anchor="end" font-size="40" font-weight="900" class="f-warm">88.8% oxygen</text></svg></div>
      <div class="banner" style="top:896px" data-at="3" data-fx="pop">A fixed recipe: <span class="teal">a law of nature</span></div>`,
  })

  // ---------- the law of definite proportions ----------
  EZ.scene('law', {
    html: `<div class="kicker" data-at="in" data-fx="left">The law</div><h2 class="h1" data-at="0">Law of <span class="pri">definite proportions</span></h2>
      <div class="card" style="left:120px;top:320px;width:760px;height:540px;text-align:center" data-at="0@0.3" data-fx="pop"><h3>A pure compound</h3>
        <svg style="margin-top:10px" width="720" height="400" viewBox="0 0 720 400"><g data-at="1" data-fx="pop">${water(360, 150, 2)}</g>
          <text x="360" y="360" text-anchor="middle" font-size="76" font-weight="900" data-at="2" data-fx="fade">H${'<tspan dy=".3em" font-size=".62em">2</tspan>'}<tspan dy="-.3em">O</tspan></text></svg></div>
      <div class="st" style="top:350px" data-at="1" data-fx="right"><small>1</small><b class="pri">Same ratio of masses</b><span>of its elements, every time</span></div>
      <div class="st" style="top:500px" data-at="2" data-fx="right"><small>2</small><b class="teal">Atoms combine in a fixed ratio</b><span>that ratio is the formula</span></div>
      <div class="banner" style="top:896px" data-at="2@0.6" data-fx="pop">Fixed atoms ${ARR} fixed <span class="warm">mass ratio</span></div>`,
  })

  // ---------- mass percent ----------
  EZ.scene('percent', {
    html: `<div class="kicker" data-at="in" data-fx="left">Mass percent</div><h2 class="h1" data-at="0">Mass percent of an element</h2>
      <div class="c3" style="left:120px;top:300px;width:1680px;height:170px;text-align:center" data-at="1" data-fx="up">
        <div style="margin-top:34px;font-size:50px;font-weight:900">% = <span class="warm">mass of element in 1 mol</span> ÷ <span class="teal">molar mass</span> × 100</div></div>
      <div class="ln" style="top:520px;font-size:40px;color:var(--muted)" data-at="2" data-fx="fade">Try it on water</div>
      <div class="card" style="left:120px;top:590px;width:510px;height:240px;text-align:center" data-at="3" data-fx="right"><h3>O in 1 mol H${sub(2)}O</h3><div style="font-size:70px;font-weight:900" class="warm">16.00 g</div></div>
      <div class="card" style="left:705px;top:590px;width:510px;height:240px;text-align:center" data-at="4" data-fx="right"><h3>Molar mass H${sub(2)}O</h3><div style="font-size:70px;font-weight:900" class="teal">18.02 g/mol</div></div>
      <div class="card" style="left:1290px;top:590px;width:510px;height:240px;text-align:center" data-at="5" data-fx="right"><h3>16.00 ÷ 18.02 × 100</h3><div style="font-size:70px;font-weight:900" class="good">88.8% O</div></div>`,
  })

  // ---------- empirical vs molecular ----------
  EZ.scene('formulas', {
    html: `<div class="kicker" data-at="in" data-fx="left">Two kinds of formula</div><h2 class="h1" data-at="0">Empirical vs. <span class="pri">molecular</span></h2>
      <div class="card" style="left:120px;top:300px;width:800px;height:230px" data-at="1" data-fx="right"><h3 class="teal">Empirical formula</h3><div style="font-size:42px;font-weight:800;padding:0 40px">the <span class="teal">lowest whole-number ratio</span> of atoms</div></div>
      <div class="card" style="left:120px;top:560px;width:800px;height:230px" data-at="2" data-fx="right"><h3 class="warm">Molecular formula</h3><div style="font-size:42px;font-weight:800;padding:0 40px">the <span class="warm">actual number</span> of atoms in one molecule</div></div>
      <div class="card" style="left:1000px;top:300px;width:800px;height:490px;text-align:center" data-at="3" data-fx="pop"><h3>Glucose</h3>
        <div style="font-size:80px;font-weight:900;margin-top:30px" class="warm">C${sub(6)}H${sub(12)}O${sub(6)}</div>
        <div style="font-size:40px;font-weight:800;margin-top:20px;color:var(--muted)" data-at="4" data-fx="fade">${ARR} divide everything by 6 ${ARR}</div>
        <div style="font-size:80px;font-weight:900;margin-top:20px" class="teal" data-at="4@0.5" data-fx="pop">CH${sub(2)}O</div></div>
      <div class="banner" style="top:880px" data-at="5" data-fx="pop">Ionic formulas (NaCl, CaCl${sub(2)}): <span class="teal">lowest whole-number ratio</span></div>`,
  })

  // ---------- the chant ----------
  const CH = [['1', 'Percent to mass', 'assume 100 g: percents become grams'], ['2', 'Mass to mole', 'convert grams to moles (÷ molar mass)'], ['3', 'Divide by small', 'divide every mole number by the smallest'], ['4', 'Multiply till whole', 'x.5 → ×2  ·  x.33 or x.67 → ×3']]
  EZ.scene('chant', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">The empirical formula chant</h2>
      <div class="card" style="left:120px;top:320px;width:660px;height:480px;text-align:center" data-at="1" data-fx="pop"><h3>🎵</h3>
        <div style="font-size:50px;font-weight:900;line-height:1.35;margin-top:10px"><span class="warm">Percent to mass,</span><br><span class="teal">mass to mole,</span><br><span class="pri">divide by small,</span><br>multiply ’til whole.</div></div>
      ${CH.map(([n, b, s], i) => `<div class="st" style="top:${316 + i * 134}px" data-at="${i + 2}" data-fx="right"><small>${n}</small><b>${b}</b><span>${s}</span></div>`).join('')}`,
  })

  // ---------- worked example ----------
  EZ.scene('example', {
    html: `<div class="kicker" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Find the formula</h2>
      <div class="c3" style="left:120px;top:290px;width:1680px;height:72px;text-align:center;font-size:36px;font-weight:800;line-height:72px" data-at="0@0.3" data-fx="fade">40.0% C · 6.7% H · 53.3% O, molar mass <span class="warm">180 g/mol</span></div>
      <table class="tb3" style="top:385px"><tr><th></th><th data-at="1" data-fx="fade">Grams (100 g)</th><th data-at="2" data-fx="fade">Moles</th><th data-at="3" data-fx="fade">÷ smallest</th></tr>
        <tr><td class="warm">C</td><td data-at="1" data-fx="fade">40.0</td><td data-at="2" data-fx="fade">3.33</td><td class="teal" data-at="3" data-fx="fade">1</td></tr>
        <tr><td class="warm">H</td><td data-at="1" data-fx="fade">6.7</td><td data-at="2" data-fx="fade">6.6</td><td class="teal" data-at="3" data-fx="fade">≈ 2</td></tr>
        <tr><td class="warm">O</td><td data-at="1" data-fx="fade">53.3</td><td data-at="2" data-fx="fade">3.33</td><td class="teal" data-at="3" data-fx="fade">1</td></tr></table>
      <div class="c3" style="left:120px;top:775px;width:820px;height:215px;text-align:center" data-at="4" data-fx="pop"><div style="font-size:34px;font-weight:900;color:var(--muted);margin-top:22px">EMPIRICAL FORMULA</div><div style="font-size:76px;font-weight:900" class="teal">CH${sub(2)}O</div><div style="font-size:32px;font-weight:800;color:var(--muted)">30.03 g/mol</div></div>
      <div class="ln" style="left:940px;width:80px;top:830px;font-size:60px" data-at="5" data-fx="fade">${ARR}</div>
      <div class="c3" style="left:1020px;top:775px;width:780px;height:215px;text-align:center" data-at="5" data-fx="pop"><div style="font-size:34px;font-weight:900;color:var(--muted);margin-top:22px">180 ÷ 30.03 ≈ 6</div><div style="font-size:76px;font-weight:900" class="warm" data-at="6" data-fx="pop">C${sub(6)}H${sub(12)}O${sub(6)}</div><div style="font-size:32px;font-weight:800;color:var(--muted)" data-at="6" data-fx="fade">glucose</div></div>`,
  })

  // ---------- try it ----------
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">Mass percent of <span class="teal">carbon</span> in CO${sub(2)}?</h2>
      <div class="card" style="left:120px;top:330px;width:1680px;height:200px;text-align:center" data-at="1@0.4" data-fx="up"><div style="font-size:50px;font-weight:900;margin-top:50px">C = <span class="warm">12.01</span> &nbsp;·&nbsp; O = <span class="teal">16.00</span></div></div>
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="722" r="66" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="722" r="66" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 722)"/>
        <text class="num" x="960" y="746" text-anchor="middle" font-size="70" font-weight="900">3</text><text x="960" y="842" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="card" style="left:120px;top:590px;width:1680px;height:300px;text-align:center;border-color:rgba(76,199,129,.7)" data-at="3" data-fx="pop"><h3 class="good">Answer</h3>
        <div style="font-size:60px;font-weight:900;margin-top:10px" data-at="4" data-fx="fade">12.01 ÷ 44.01 × 100</div>
        <div style="font-size:84px;font-weight:900" class="good" data-at="5" data-fx="pop">= 27.3% C</div></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
    },
  })

  // ---------- FRQ tip ----------
  EZ.scene('frq', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">FRQ tip</div><h2 class="h1" data-at="0">“Justify the formula”</h2>
      <div class="card" style="left:120px;top:320px;width:1680px;height:220px;text-align:center" data-at="1" data-fx="up"><div style="font-size:50px;font-weight:800;margin-top:60px">Show the <span class="warm">mole ratio</span> explicitly</div></div>
      <div class="card" style="left:120px;top:590px;width:1680px;height:220px;text-align:center" data-at="2" data-fx="pop"><div style="font-size:30px;font-weight:900;color:var(--muted);margin-top:26px">FOR EXAMPLE</div><div style="font-size:60px;font-weight:900;margin-top:10px">C : H = <span class="teal">3.33 : 6.6</span> = <span class="warm">1 : 2</span></div></div>
      <div class="banner" style="top:880px" data-at="3" data-fx="pop">Points for the <span class="warm">ratio</span>, not just the final formula</div>`,
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="210" viewBox="0 0 460 210">${water(230, 60, 1.1)}<text x="230" y="190" text-anchor="middle" font-size="36" font-weight="900" class="f-muted">same mass ratio</text></svg>`
  const r2 = `<svg width="460" height="210" viewBox="0 0 460 210"><text x="230" y="80" text-anchor="middle" font-size="38" font-weight="900">element ÷ molar mass</text><text x="230" y="150" text-anchor="middle" font-size="60" font-weight="900" class="f-warm">× 100 = %</text></svg>`
  const r3 = `<svg width="460" height="210" viewBox="0 0 460 210"><text x="230" y="60" text-anchor="middle" font-size="42" font-weight="900" class="f-warm">% → g → mol</text><text x="230" y="120" text-anchor="middle" font-size="42" font-weight="900" class="f-teal">÷ smallest</text><text x="230" y="180" text-anchor="middle" font-size="42" font-weight="900" class="f-pri">whole numbers</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>A pure compound always has<br>the <span class="teal">same mass ratio</span><br>of its elements</p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p><span class="warm">Mass %</span> = element mass<br>in formula ÷ molar mass<br>× 100</p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Empirical formula<br>from percents:<br><span class="teal">divide by the smallest</span></p></div>`,
  })
})()
