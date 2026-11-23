// Pictures for chem-1.2 "Mass Spectra of Elements". One EZ.scene per scene id in script.mjs.
// Everything shown is the lesson's own (app/src/content/chem/u1.ts); the spectrum is the lesson's
// "mass-spec-cl" diagram. Ball sizes only suggest which isotope is more common, not an exact scale.
(() => {
  const { clamp, eio, eo, back, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .xr{position:absolute;left:900px;width:900px;height:104px;padding:0 30px 0 112px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line);display:flex;align-items:center;font-size:38px;font-weight:800;white-space:nowrap}
    .xr small{position:absolute;left:26px;top:20px;width:62px;height:62px;border-radius:50%;background:var(--brand);font-size:36px;font-weight:900;line-height:62px;text-align:center}
    .xn{position:absolute;left:1060px;width:740px;padding:22px 30px 24px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .xn b{display:block;font-size:42px;font-weight:900;line-height:1.15} .xn span{display:block;margin-top:6px;font-size:31px;font-weight:700;line-height:1.3;color:var(--muted)}
    .xi{position:absolute;left:120px;width:700px;height:200px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .xi b{position:absolute;left:190px;top:34px;font-size:44px;font-weight:900;white-space:nowrap} .xi span{position:absolute;left:190px;top:100px;font-size:36px;font-weight:800;color:var(--muted);white-space:nowrap}
    .xi svg{position:absolute;left:20px;top:40px}
    .xq{position:absolute;left:120px;width:760px;height:190px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .xq b{position:absolute;left:196px;top:30px;font-size:44px;font-weight:900;white-space:nowrap} .xq span{position:absolute;left:196px;top:96px;font-size:36px;font-weight:800;color:var(--muted);white-space:nowrap}
    .xq svg{position:absolute;left:24px;top:36px}
    .xl{position:absolute;left:0;width:1920px;text-align:center;font-size:44px;font-weight:900;white-space:nowrap}
    .xk{top:320px;width:540px;height:560px;text-align:center} .xk .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .xk svg{display:block;margin:14px auto 0} .xk p{margin:14px 10px 0;font-size:35px;font-weight:800;line-height:1.3;white-space:nowrap}
  `
  document.head.appendChild(css)

  const all = (c, q) => (c['_' + q] ??= [...c.root.querySelectorAll(q)])
  // isotope label for inside an SVG ball: mass number up, symbol level
  const iso = (m, s) => `<tspan dy="-.5em" font-size=".6em">${m}</tspan><tspan dy=".5em">${s}</tspan>`
  const bigIso = (x, y, r, m, g, sym = 'Cl') => ball(x, y, r, g, iso(m, sym), r * 0.62)
  const okIcon = '<svg width="60" height="60" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const noIcon = '<svg width="60" height="60" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#f0707a"/><path d="M21 21l22 22M43 21L21 43" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round"/></svg>'

  // a small spectrum drawing: axes + bars (heights relative), used by intro art and recap
  const miniSpec = (x0, y0, w, h, bars, col = '#8d8df0') => {
    let s = `<line x1="${x0}" y1="${y0}" x2="${x0 + w}" y2="${y0}" stroke="#aab1c4" stroke-width="5"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 - h - 20}" stroke="#aab1c4" stroke-width="5"/>`
    for (const [px, ph] of bars) s += `<rect x="${x0 + px * w - 14}" y="${y0 - ph * h}" width="28" height="${ph * h}" rx="4" fill="${col}"/>`
    return s
  }

  // ---------- intro artwork: faint spectra at the left and right edges (all above y = 950) ----------
  EZ.intro = {
    chips: [['1@0.28', 'Peaks and isotopes'], ['1@0.52', 'Average atomic mass'], ['1@0.76', 'A quick estimate']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">${miniSpec(30, 800, 170, 380, [[0.3, 0.76], [0.75, 0.24]])}${miniSpec(1720, 800, 170, 380, [[0.3, 0.25], [0.7, 0.8]], '#3cc7bc')}</svg>`,
  }

  // ---------- hook: 35.45 is not the mass of any atom ----------
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Look closer</div><h2 class="h1" data-at="0">Chlorine: <span class="warm">35.45</span> amu?</h2>
      <div class="card" style="left:120px;top:320px;width:520px;height:520px" data-at="0@0.2" data-fx="pop"><h3>Periodic table</h3>
        <svg style="position:absolute;left:0;top:90px" width="520" height="420" viewBox="0 0 520 420">
          <rect x="110" y="30" width="300" height="340" rx="22" fill="rgba(141,141,240,.16)" stroke="#8d8df0" stroke-width="5"/>
          <text x="140" y="90" font-size="40" font-weight="800" class="f-muted">17</text>
          <text x="260" y="240" text-anchor="middle" font-size="140" font-weight="900">Cl</text>
          <text x="260" y="330" text-anchor="middle" font-size="62" font-weight="900" class="f-warm">35.45</text></svg></div>
      <div class="card" style="left:760px;top:320px;width:1040px;height:520px" data-at="1" data-fx="pop"><h3>Real chlorine atoms</h3>
        <svg style="position:absolute;left:0;top:90px" width="1040" height="420" viewBox="0 0 1040 420">
          <g data-at="2@0.1" data-fx="pop">${bigIso(250, 160, 100, 35, 'teal')}</g>
          <text x="250" y="320" text-anchor="middle" font-size="46" font-weight="900" data-at="2@0.3" data-fx="fade">about 35</text>
          <g data-at="2@0.55" data-fx="pop">${bigIso(780, 160, 100, 37, 'warm')}</g>
          <text x="780" y="320" text-anchor="middle" font-size="46" font-weight="900" data-at="2@0.7" data-fx="fade">about 37</text>
          <text x="520" y="190" text-anchor="middle" font-size="130" font-weight="900" class="f-muted" data-at="3" data-fx="pop">?</text></svg></div>
      <div class="banner" style="top:896px" data-at="4" data-fx="pop">35.45 is an <span class="warm">average</span>, and a mass spectrometer shows the mix</div>`,
  })

  // ---------- reading a mass spectrum ----------
  const SX0 = 200, SY0 = 790, SH = 400
  const sx = (m) => SX0 + 100 + (m - 33) * 120
  const bars = [[35, 75.8, 'teal'], [37, 24.2, 'warm']]
  EZ.scene('spectrum', {
    html: `<div class="kicker" data-at="in" data-fx="left">Reading a spectrum</div><h2 class="h1" data-at="0">Mass spectrum of chlorine</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1" data-fx="fade">
          <line x1="${SX0}" y1="${SY0}" x2="${SX0 + 780}" y2="${SY0}" stroke="#aab1c4" stroke-width="5"/><line x1="${SX0}" y1="${SY0}" x2="${SX0}" y2="${SY0 - SH - 40}" stroke="#aab1c4" stroke-width="5"/>
          ${[33, 34, 35, 36, 37, 38].map((m) => `<line x1="${sx(m)}" y1="${SY0}" x2="${sx(m)}" y2="${SY0 + 10}" stroke="#aab1c4" stroke-width="4"/><text x="${sx(m)}" y="${SY0 + 48}" text-anchor="middle" font-size="34" font-weight="800" class="f-muted">${m}</text>`).join('')}
          <text x="${SX0 + 390}" y="${SY0 + 104}" text-anchor="middle" font-size="36" font-weight="900">Mass (amu)</text>
          <text x="${SX0 + 12}" y="${SY0 - SH - 60}" font-size="34" font-weight="900">Abundance (%)</text></g>
        ${bars.map(([m, p, g], i) => `<rect class="bar" data-i="${i}" x="${sx(m) - 36}" y="${SY0}" width="72" height="0" rx="8" fill="${g === 'teal' ? '#3cc7bc' : '#f3a764'}"/>
          <text class="blab" data-i="${i}" x="${sx(m)}" y="${SY0 - (p / 100) * SH - 18}" text-anchor="middle" font-size="40" font-weight="900" style="opacity:0">${p}%</text>`).join('')}
        <g class="p1"><circle cx="${sx(35)}" cy="${SY0 - 0.758 * SH - 74}" r="0" fill="none"/></g>
      </svg>
      <div class="xn" style="top:330px" data-at="2" data-fx="right"><b class="teal">Each peak = one isotope</b><span>a mass spectrometer sorts atoms by mass</span></div>
      <div class="xn" style="top:500px" data-at="3" data-fx="right"><b class="pri">Position = its mass</b><span>where the peak sits on the amu axis</span></div>
      <div class="xn" style="top:670px" data-at="4" data-fx="right"><b class="warm">Height = abundance</b><span>how abundant that isotope is</span></div>
      <div class="banner" style="top:896px;left:1060px;width:740px;font-size:40px" data-at="5" data-fx="pop">Taller peak, <span class="teal">more common</span></div>`,
    update(c) {
      const g = eo(c.p('1@0.3', 1.0))
      all(c, '.bar').forEach((r, i) => { const p = bars[i][1], h = (p / 100) * SH * g; r.setAttribute('height', h.toFixed(1)); r.setAttribute('y', (SY0 - h).toFixed(1)) })
      all(c, '.blab').forEach((t) => { t.style.opacity = clamp((g - 0.8) / 0.2) })
    },
  })

  // ---------- average atomic mass = weighted average ----------
  EZ.scene('wavg', {
    html: `<div class="kicker" data-at="in" data-fx="left">Average atomic mass</div><h2 class="h1" data-at="1">A <span class="pri">weighted</span> average</h2>
      <div class="card" style="left:120px;top:320px;width:1680px;height:190px" data-at="2" data-fx="pop"><div class="xl" style="left:0;top:50px;font-size:54px;width:1680px">Average mass = <span class="pri">Σ</span> (<span class="warm">isotope mass</span> × <span class="teal">fractional abundance</span>)</div></div>
      <div class="card" style="left:120px;top:560px;width:820px;height:300px" data-at="3" data-fx="pop"><h3>Like a class grade</h3>
        <svg style="position:absolute;left:0;top:90px" width="820" height="200" viewBox="0 0 820 200">
          <rect x="60" y="30" width="520" height="56" rx="14" fill="#8d8df0"/><text x="80" y="70" font-size="34" font-weight="900" fill="#10131c">Tests</text>
          <rect x="60" y="110" width="270" height="56" rx="14" fill="#3cc7bc"/><text x="80" y="150" font-size="34" font-weight="900" fill="#10131c">Homework</text>
          <text x="610" y="70" font-size="34" font-weight="800" class="f-muted">count more</text></svg></div>
      <div class="card" style="left:980px;top:560px;width:820px;height:300px" data-at="4" data-fx="pop"><h3>Counts by its abundance</h3>
        <svg style="position:absolute;left:0;top:90px" width="820" height="200" viewBox="0 0 820 200">
          <rect x="60" y="30" width="520" height="56" rx="14" fill="#3cc7bc"/><text x="80" y="70" font-size="34" font-weight="900" fill="#10131c">More abundant isotope</text>
          <rect x="60" y="110" width="290" height="56" rx="14" fill="#f3a764"/><text x="80" y="150" font-size="34" font-weight="900" fill="#10131c">Less abundant</text>
          <text x="610" y="70" font-size="34" font-weight="800" class="f-muted">pulls more</text></svg></div>`,
  })

  // ---------- worked example: chlorine ----------
  EZ.scene('chlorine', {
    html: `<div class="kicker" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Average mass of <span class="teal">chlorine</span></h2>
      <div class="xq" style="top:310px" data-at="1" data-fx="left"><svg width="150" height="150" viewBox="0 0 150 150">${bigIso(75, 75, 70, 35, 'teal')}</svg><b class="teal">75.76% <sup>35</sup>Cl</b><span>mass 34.969 amu</span></div>
      <div class="xq" style="top:540px" data-at="2" data-fx="left"><svg width="150" height="150" viewBox="0 0 150 150">${bigIso(75, 75, 70, 37, 'warm')}</svg><b class="warm">24.24% <sup>37</sup>Cl</b><span>mass 36.966 amu</span></div>
      <div class="xr" style="top:310px" data-at="3" data-fx="right"><small>1</small>Percents to decimals: <span class="pri" style="margin-left:14px">0.7576</span>&nbsp;and&nbsp;<span class="pri">0.2424</span></div>
      <div class="xr" style="top:430px" data-at="4" data-fx="right"><small>2</small>34.969 × 0.7576 = <span class="teal" style="margin-left:14px">26.49</span></div>
      <div class="xr" style="top:550px" data-at="5" data-fx="right"><small>2</small>36.966 × 0.2424 = <span class="warm" style="margin-left:14px">8.961</span></div>
      <div class="xr" style="top:670px;border-color:rgba(76,199,129,.7)" data-at="6" data-fx="right"><small>3</small>26.49 + 8.961 = <span class="good" style="margin-left:14px">35.45 amu</span></div>
      <div class="banner" style="top:880px" data-at="7" data-fx="pop">Matches the periodic table: <span class="good">35.45 amu</span></div>`,
  })

  // ---------- trick: estimate first ----------
  const NX = (m) => 340 + (m - 35) * 620
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Estimate first, calculate second</h2>
      <div class="card" style="left:120px;top:320px;width:1680px;height:450px" data-at="1@0.5" data-fx="pop">
        <svg style="position:absolute;left:0;top:0" width="1680" height="450" viewBox="0 0 1680 450">
          <line x1="${NX(35) - 160}" y1="300" x2="${NX(37) + 160}" y2="300" stroke="#aab1c4" stroke-width="6"/>
          ${[35, 36, 37].map((m) => `<line x1="${NX(m)}" y1="300" x2="${NX(m)}" y2="318" stroke="#aab1c4" stroke-width="5"/><text x="${NX(m)}" y="362" text-anchor="middle" font-size="40" font-weight="900" class="f-muted">${m}</text>`).join('')}
          <g data-at="2@0.1" data-fx="pop">${bigIso(NX(35), 200, 78, 35, 'teal')}</g>
          <g data-at="2@0.1" data-fx="pop">${bigIso(NX(37), 220, 46, 37, 'warm')}</g>
          <g data-at="2@0.45" data-fx="fade"><text x="${NX(35) + 50}" y="100" text-anchor="middle" font-size="40" font-weight="900" class="f-teal">most abundant</text></g>
          <g data-at="2@0.6" data-fx="pop"><line x1="${NX(35.45)}" y1="270" x2="${NX(35.45)}" y2="300" stroke="#fff" stroke-width="7"/><circle cx="${NX(35.45)}" cy="300" r="14" fill="#fff"/>
            <text x="${NX(35.45) + 40}" y="262" font-size="50" font-weight="900" class="f-pri">35.45</text></g>
          <g data-at="2@0.8" data-fx="fade"><text x="${NX(36) + 150}" y="130" text-anchor="middle" font-size="40" font-weight="800" class="f-muted">${iso(35, 'Cl')} is about 3/4 of all Cl atoms</text></g>
        </svg></div>
      <div class="banner" style="top:790px" data-at="1" data-fx="pop">The average lands closer to the <span class="teal">most abundant</span> isotope</div>
      <div class="banner" style="top:930px;font-size:40px;height:90px" data-at="3" data-fx="pop">On multiple choice, the estimate alone often picks the answer</div>`,
  })

  // ---------- exam note: single element only ----------
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Exam note</div><h2 class="h1" data-at="0">The AP® exam uses a <span class="teal">single element</span></h2>
      <div class="xq" style="left:120px;top:340px;width:1680px;border-color:rgba(76,199,129,.7)" data-at="1" data-fx="left"><svg width="150" height="120" viewBox="0 0 150 120">${okIcon.replace('width="60" height="60"', 'width="100" height="100" x="20" y="10"')}</svg><b class="good">Mass spectra of a single element</b><span>peaks are the isotopes of that one element</span></div>
      <div class="xq" style="left:120px;top:560px;width:1680px;border-color:rgba(240,112,122,.7)" data-at="2" data-fx="left"><svg width="150" height="120" viewBox="0 0 150 120">${noIcon.replace('width="60" height="60"', 'width="100" height="100" x="20" y="10"')}</svg><b class="bad">Not mixtures</b><span>and not molecules that break into fragments</span></div>`,
  })

  // ---------- try it ----------
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="2">Boron: what is the <span class="teal">average atomic mass</span>?</h2>
      <div class="xq" style="top:290px;height:170px" data-at="1" data-fx="left"><svg width="150" height="130" viewBox="0 0 150 130">${bigIso(75, 65, 60, 10, 'teal', 'B')}</svg><b class="teal">19.9% <sup>10</sup>B</b><span>mass 10.013 amu</span></div>
      <div class="xq" style="left:1040px;top:290px;height:170px" data-at="1@0.5" data-fx="right"><svg width="150" height="130" viewBox="0 0 150 130">${bigIso(75, 65, 60, 11, 'warm', 'B')}</svg><b class="warm">80.1% <sup>11</sup>B</b><span>mass 11.009 amu</span></div>
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="710" r="66" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="710" r="66" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 710)"/>
        <text class="num" x="960" y="734" text-anchor="middle" font-size="70" font-weight="900">3</text><text x="960" y="830" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:520px" data-at="4" data-fx="pop">Average mass = <span class="good">10.81 amu</span></div>
      <div class="xl" style="top:680px;font-size:42px" data-at="5" data-fx="fade">10.013 × 0.199 = <span class="teal">1.993</span></div>
      <div class="xl" style="top:750px;font-size:42px" data-at="6" data-fx="fade">11.009 × 0.801 = <span class="warm">8.818</span></div>
      <div class="xl" style="top:850px;font-size:38px;color:var(--muted)" data-at="7" data-fx="fade">1.993 + 8.818 = 10.81, close to 11 because <sup>11</sup>B is the most common</div>`,
    update(c) {
      const b = c.b, t0 = b[3].start + 0.3, t1 = b[4].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="230" viewBox="0 0 460 230">${miniSpec(70, 200, 330, 150, [[0.3, 0.76], [0.75, 0.24]])}</svg>`
  const r2 = `<svg width="460" height="230" viewBox="0 0 460 230"><text x="230" y="120" text-anchor="middle" font-size="92" font-weight="900" class="f-pri">Σ</text><text x="230" y="190" text-anchor="middle" font-size="40" font-weight="900">mass × fraction</text></svg>`
  const r3 = `<svg width="460" height="230" viewBox="0 0 460 230"><line x1="50" y1="170" x2="410" y2="170" stroke="#aab1c4" stroke-width="5"/>
    ${bigIso(100, 100, 50, 35, 'teal')}${bigIso(370, 120, 30, 37, 'warm')}<circle cx="148" cy="170" r="11" fill="#fff"/></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card xk" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p><span class="teal">Peaks</span> = isotopes<br>Position = mass<br>Height = <span class="warm">abundance</span></p></div>
      <div class="card xk" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Average atomic mass<br>= <span class="pri">Σ</span>(mass × fraction)</p></div>
      <div class="card xk" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>The average is pulled<br>toward the <span class="teal">most abundant</span><br>isotope</p></div>`,
  })
})()
