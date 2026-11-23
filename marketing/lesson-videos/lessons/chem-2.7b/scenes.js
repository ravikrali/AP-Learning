// Pictures for chem-2.7b "Hybridization, Sigma/Pi Bonds & Polarity". One EZ.scene per scene id in script.mjs.
// Facts shown are the lesson's own (app/src/content/chem/u2.ts). Molecules are drawn as labelled balls
// with bonds as lines; sizes and angles are schematic, not to scale.
(() => {
  const { clamp, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    sub{font-size:.6em}
    .mc{top:290px;width:700px;height:320px;text-align:center}
    .mc .f{position:absolute;left:36px;top:14px;text-align:left;font-size:42px;font-weight:900}
    .mc .s{position:absolute;left:0;right:0;bottom:16px;font-size:30px;font-weight:800;color:var(--muted)}
    .mc svg{position:absolute;left:0;top:60px}
    .vtag{position:absolute;top:238px;font-size:34px;font-weight:900;padding:6px 26px;border-radius:999px;background:rgba(36,40,56,.95);border:3px solid}
    .hrow{position:absolute;left:120px;width:1680px;height:160px;border-radius:26px;background:rgba(36,40,56,.8);border:2px solid var(--line)}
    .hrow .d{position:absolute;left:40px;top:50px;font-size:46px;font-weight:900;white-space:nowrap}
    .hrow .h{position:absolute;left:520px;top:22px;font-size:100px;font-weight:900;line-height:1.1}
    .hrow .a{position:absolute;left:860px;top:52px;font-size:44px;font-weight:900;color:var(--muted);white-space:nowrap}
    .hrow svg{position:absolute;left:1300px;top:0}
    .brow{position:absolute;left:120px;width:860px;height:112px;border-radius:24px;background:rgba(36,40,56,.85);border:2px solid var(--line)}
    .brow .t{position:absolute;left:30px;top:30px;font-size:34px;font-weight:900;white-space:nowrap}
    .brow .v{position:absolute;right:28px;top:26px;font-size:42px;font-weight:900;white-space:nowrap}
    .brow svg{position:absolute;left:290px;top:0}
    .ebar{position:absolute;left:120px;top:690px;width:860px;height:150px;border-radius:24px;background:rgba(36,40,56,.85);border:2px solid var(--line)}
    .ebar .r{position:absolute;left:30px;height:36px;font-size:36px;font-weight:900;line-height:36px}
    .ebar .b{position:absolute;left:100px;top:0;height:36px;border-radius:18px}
    .ebar .c{position:absolute;right:26px;top:52px;font-size:28px;font-weight:800;color:var(--muted)}
    .pt{position:absolute;width:540px;height:260px;border-radius:28px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center}
    .pt svg{position:absolute;left:0;top:0}
    .pt .fm{position:absolute;left:28px;bottom:16px;font-size:44px;font-weight:900}
    .pt .vd{position:absolute;right:28px;bottom:20px;font-size:38px;font-weight:900}
    .tile{position:absolute;top:360px;width:390px;height:220px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .tile .f{margin-top:58px;font-size:104px;font-weight:900;line-height:1}
    .tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .work{position:absolute;left:120px;top:650px;width:1680px;height:250px;text-align:center;font-size:58px;font-weight:900;padding-top:38px;line-height:1.45}
    .rule2{position:absolute;top:290px;width:700px;height:170px;border-radius:30px;border:3px solid;display:flex;align-items:center;justify-content:center;text-align:center;font-size:42px;font-weight:900;line-height:1.25;padding:0 24px}
    .res{position:absolute;left:0;width:1920px;text-align:center;font-size:56px;font-weight:900}
    .cnt{position:absolute;left:1150px;width:650px;height:150px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .cnt .k{position:absolute;left:30px;top:22px;font-size:32px;font-weight:800;color:var(--muted);white-space:nowrap}
    .cnt .n{position:absolute;left:30px;top:66px;font-size:56px;font-weight:900;white-space:nowrap}
    .rc{top:320px;width:540px;height:580px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc svg{display:block;margin:14px auto 0} .rc p{margin:14px 20px 0;font-size:35px;font-weight:800;line-height:1.3;white-space:nowrap}
  `
  document.head.appendChild(css)

  const rad = (a) => (a * Math.PI) / 180
  const LN = '#eef0f7'
  // [label, dx, dy, radius, colour, bond order to the first atom]; the first atom is the central one
  const MOLS = {
    co2: [['C', 0, 0, 26, 'gray'], ['O', -100, 0, 31, 'red', 2], ['O', 100, 0, 31, 'red', 2]],
    h2o: [['O', 0, -22, 34, 'red'], ['H', -74, 44, 23, 'warm'], ['H', 74, 44, 23, 'warm']],
    ccl4: [['C', 0, 0, 25, 'gray'], ['Cl', 0, -72, 27, 'green'], ['Cl', -72, 40, 27, 'green'], ['Cl', 72, 40, 27, 'green'], ['Cl', 0, 66, 27, 'green']],
    chcl3: [['C', 0, 0, 25, 'gray'], ['H', 0, -70, 19, 'warm'], ['Cl', -72, 40, 27, 'green'], ['Cl', 72, 40, 27, 'green'], ['Cl', 0, 66, 27, 'green']],
    nh3: [['N', 0, -26, 31, 'pur'], ['H', -68, 36, 21, 'warm'], ['H', 68, 36, 21, 'warm'], ['H', 0, 62, 21, 'warm']],
    bf3: [['B', 0, 0, 26, 'gold'], ['F', 0, -74, 26, 'teal'], ['F', -64, 37, 26, 'teal'], ['F', 64, 37, 26, 'teal']],
    ch4: [['C', 0, 0, 25, 'gray'], ['H', 0, -68, 19, 'warm'], ['H', -68, 40, 19, 'warm'], ['H', 68, 40, 19, 'warm'], ['H', 0, 64, 19, 'warm']],
    ch3cl: [['C', 0, 0, 25, 'gray'], ['H', 0, -68, 19, 'warm'], ['H', -68, 40, 19, 'warm'], ['H', 68, 40, 19, 'warm'], ['Cl', 0, 66, 27, 'green']],
  }
  /** a molecule centred on (cx, cy), scaled by k */
  const mol = (kind, cx, cy, k = 1) => {
    const [c, ...o] = MOLS[kind], sx = cx + c[1] * k, sy = cy + c[2] * k
    let ls = '', bs = ''
    o.forEach(([l, dx, dy, r, g, n = 1]) => {
      const ex = cx + dx * k, ey = cy + dy * k, L = Math.hypot(ex - sx, ey - sy), px = -(ey - sy) / L, py = (ex - sx) / L
      for (let i = 0; i < n; i++) { const off = (i - (n - 1) / 2) * 13 * k; ls += `<line x1="${sx + px * off}" y1="${sy + py * off}" x2="${ex + px * off}" y2="${ey + py * off}" stroke="${LN}" stroke-width="${7 * k}"/>` }
      bs += ball(ex, ey, r * k, g, l, r * k * (l.length > 1 ? 0.84 : 0.95))
    })
    return ls + bs + ball(sx, sy, c[3] * k, c[4], c[0], c[3] * k * 0.95)
  }
  const OK = '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'

  // ---------- intro artwork ----------
  EZ.intro = {
    chips: [['1@0.3', 'Hybridization'], ['1@0.6', 'σ and π bonds'], ['1@0.86', 'Polarity']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.13">${mol('ccl4', 960, 560, 3.2)}</svg>`,
  }

  // ---------- hook: same polar bonds, different result; tug of war ----------
  const team = (x0, dir, g) => [0, 1, 2].map((i) => ball(x0 + dir * i * 84, 890, 36, g)).join('')
  EZ.scene('hook', {
    html: `<div class="kicker" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="0">Same polar bonds, different result</h2>
      <div class="card mc" style="left:210px" data-at="0" data-fx="pop"><div class="f teal">CO<sub>2</sub></div><svg width="700" height="220" viewBox="0 0 700 220">${mol('co2', 350, 110, 1.15)}</svg><div class="s">polar bonds</div></div>
      <div class="card mc" style="left:1010px" data-at="0@0.5" data-fx="pop"><div class="f warm">H<sub>2</sub>O</div><svg width="700" height="220" viewBox="0 0 700 220">${mol('h2o', 350, 100, 1.15)}</svg><div class="s">polar bonds</div></div>
      <div class="vtag" style="left:700px;top:312px;border-color:#4cc781;color:#4cc781" data-at="1" data-fx="pop">nonpolar</div>
      <div class="vtag" style="left:1560px;top:312px;border-color:#f3a764;color:#f3a764" data-at="1@0.4" data-fx="pop">polar</div>
      <div class="banner" style="top:650px;font-size:46px" data-at="1" data-fx="pop">It's all about <span class="teal">symmetry</span></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="2" data-fx="fade"><g class="tug">
          <line x1="${300}" x2="${1620}" y1="890" y2="890" stroke="#a3abbd" stroke-width="10" stroke-linecap="round"/>
          ${team(370, 1, 'pur')}${team(1550, -1, 'warm')}
          <path d="M960 890 V840 L1010 858 L960 876" fill="#f2c443" stroke="#f2c443" stroke-width="4" stroke-linejoin="round"/>
        </g>
        <line x1="760" x2="560" y1="815" y2="815" stroke="#8d8df0" stroke-width="10" marker-end="url(#mk-pri)"/>
        <line x1="1160" x2="1360" y1="815" y2="815" stroke="#f3a764" stroke-width="10" marker-end="url(#mk-warm)"/></g>
        <g data-at="2@0.7" data-fx="fade"><text x="960" y="985" text-anchor="middle" font-size="34" font-weight="800" class="f-muted">equal pulls in opposite directions cancel</text></g>
      </svg>`,
    update(c) {
      const g = c.$('.tug'), a = c.at('2')
      g.setAttribute('transform', `translate(${c.t > a ? 14 * Math.sin((c.t - a) * 2.6) * clamp((c.t - a) / 0.6) : 0} 0)`)
    },
  })

  // ---------- hybridization: name the domains ----------
  const hp = (n) => {
    const O = [[180, 80, 110, 0], [180, 80, 56, 90]]; void O
    const cx = 180, cy = 80
    let outs
    if (n === 2) outs = [[cx - 110, cy], [cx + 110, cy]]
    else if (n === 3) outs = [[cx, cy - 56], [cx - 56 * Math.cos(rad(30)), cy + 28], [cx + 56 * Math.cos(rad(30)), cy + 28]]
    else outs = [[cx, cy - 56], [cx - 52, cy + 30], [cx + 52, cy + 30], [cx, cy + 40]]
    return outs.map(([x, y], i) => `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${LN}" stroke-width="${n === 4 && i === 3 ? 12 : 7}" stroke-linecap="round"/>`).join('')
      + outs.map(([x, y]) => ball(x, y, n === 2 ? 20 : 16, 'pur')).join('') + ball(cx, cy, 24, 'gray')
  }
  const HY = [['2 domains', 'sp', '180°', 2], ['3 domains', 'sp<sup>2</sup>', '120°', 3], ['4 domains', 'sp<sup>3</sup>', '109.5°', 4]]
  EZ.scene('hybrid', {
    html: `<div class="kicker" data-at="in" data-fx="left">Hybridization</div><h2 class="h1" data-at="0">A naming code for the domains</h2>
      <div style="position:absolute;left:120px;top:258px;font-size:34px;font-weight:800;color:var(--muted)" data-at="1" data-fx="fade">Match the number of electron domains</div>
      ${HY.map(([d, h, a, n], i) => `<div class="hrow" style="top:${320 + i * 180}px" data-at="${i + 2}"><div class="d">${d}</div><div class="h ${['pri', 'teal', 'warm'][i]}">${h}</div><div class="a">ideal angle <span class="${['pri', 'teal', 'warm'][i]}">${a}</span></div>
        <svg width="360" height="160" viewBox="0 0 360 160">${hp(n)}</svg></div>`).join('')}
      <div class="banner" style="top:872px;font-size:34px" data-at="5" data-fx="pop">Not tested: drawing hybrid orbitals, or d-orbital hybrids (5–6 domains)<br>For those, just know the shape</div>`,
  })

  // ---------- sigma and pi ----------
  const SB = (n) => { const ys = n === 1 ? [56] : n === 2 ? [46, 66] : [38, 56, 74]
    return ys.map((y) => `<line x1="70" x2="210" y1="${y}" y2="${y}" stroke="${LN}" stroke-width="7"/>`).join('') + ball(70, 56, 24, 'pur') + ball(210, 56, 24, 'pur') }
  const SP = (a, b) => `<span class="pri">${a}</span>`
  void SP
  EZ.scene('bonds', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Bond types</div><h2 class="h1" data-at="0">Sigma (σ) and pi (π) bonds</h2>
      ${[['Single bond', '1 <span class="pri">σ</span>', 1], ['Double bond', '1 <span class="pri">σ</span> + 1 <span class="warm">π</span>', 2], ['Triple bond', '1 <span class="pri">σ</span> + 2 <span class="warm">π</span>', 3]].map(([t, v, n], i) =>
        `<div class="brow" style="top:${290 + i * 130}px" data-at="${i + 1}"><div class="t">${t}</div><svg width="280" height="112" viewBox="0 0 280 112">${SB(n)}</svg><div class="v">${v}</div></div>`).join('')}
      <div class="card" style="left:1020px;top:290px;width:780px;height:550px" data-at="4">
        <svg width="780" height="550" viewBox="0 0 780 550">
          <g data-at="4@0.05" data-fx="fade">
            <ellipse cx="320" cy="115" rx="110" ry="52" fill="rgba(141,141,240,.35)" stroke="#8d8df0" stroke-width="5"/><ellipse cx="460" cy="115" rx="110" ry="52" fill="rgba(141,141,240,.35)" stroke="#8d8df0" stroke-width="5"/>
            <circle cx="320" cy="115" r="11" fill="#aab1c4"/><circle cx="460" cy="115" r="11" fill="#aab1c4"/>
            <text x="390" y="215" text-anchor="middle" font-size="38" font-weight="900" class="f-pri">σ: head-on overlap</text></g>
          <g data-at="4@0.5" data-fx="fade">
            ${[340, 440].map((x) => `<ellipse cx="${x}" cy="335" rx="46" ry="50" fill="rgba(243,167,100,.35)" stroke="#f3a764" stroke-width="5"/><ellipse cx="${x}" cy="435" rx="46" ry="50" fill="rgba(243,167,100,.35)" stroke="#f3a764" stroke-width="5"/>`).join('')}
            <circle cx="340" cy="385" r="11" fill="#aab1c4"/><circle cx="440" cy="385" r="11" fill="#aab1c4"/>
            <text x="390" y="525" text-anchor="middle" font-size="38" font-weight="900" class="f-warm">π: side-by-side overlap</text></g>
        </svg></div>
      <div class="ebar" data-at="5"><div class="r pri" style="top:24px">σ<div class="b" style="width:540px;background:#8d8df0"></div></div><div class="r warm" style="top:84px">π<div class="b" style="width:300px;background:#f3a764"></div></div><div class="c" style="top:60px">bond energy</div></div>
      <div class="banner" style="top:880px;font-size:40px" data-at="6" data-fx="pop">π <span class="warm">locks rotation</span> ${ARR} cis / trans isomers around C=C</div>`,
  })

  // ---------- is the molecule polar? ----------
  const PT = [['co2', 'CO<sub>2</sub>', 'linear · symmetric', 'Nonpolar', 0.95, '2'], ['h2o', 'H<sub>2</sub>O', 'bent', 'Polar', 0.8, '3'], ['ccl4', 'CCl<sub>4</sub>', 'tetrahedral', 'Nonpolar', 0.8, '4'],
    ['chcl3', 'CHCl<sub>3</sub>', 'not symmetric', 'Polar', 0.8, '5'], ['nh3', 'NH<sub>3</sub>', 'pyramidal', 'Polar', 0.8, '5@0.5'], ['bf3', 'BF<sub>3</sub>', 'trigonal planar', 'Nonpolar', 0.8, '6']]
  const ptile = (kind, f, s, v, k, at, i) => `<div class="pt" style="left:${120 + (i % 3) * 570}px;top:${i < 3 ? 390 : 670}px" data-at="${at}" data-fx="pop">
      <svg width="540" height="190" viewBox="0 0 540 190">${mol(kind, 270, 95, k)}</svg>
      <div class="fm">${f}</div><div class="vd ${v === 'Polar' ? 'warm' : 'good'}">${v}</div>
      <div style="position:absolute;left:28px;top:12px;font-size:26px;font-weight:800;color:var(--muted)">${s}</div></div>`
  EZ.scene('polar', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Polarity</div><h2 class="h1" data-at="0">Is the molecule polar?</h2>
      <div style="position:absolute;left:0;top:272px;width:1920px;text-align:center;font-size:42px;font-weight:900" data-at="1" data-fx="fade"><span class="teal">polar bonds</span> &nbsp;+&nbsp; <span class="warm">not symmetric</span> &nbsp;${ARR}&nbsp; polar <span class="muted" style="font-size:30px;font-weight:800">(dipoles don't cancel)</span></div>
      ${PT.map(([k, f, s, v, sc, at], i) => ptile(k, f, s, v, sc, at, i)).join('')}`,
  })

  // ---------- quick polarity test ----------
  const HT = [['ch4', 'CH<sub>4</sub>', 'no lone pairs, identical', 'Nonpolar', 0.8, '3'], ['ch3cl', 'CH<sub>3</sub>Cl', 'one outer atom different', 'Polar', 0.8, '3@0.35'], ['nh3', 'NH<sub>3</sub>', 'has a lone pair', 'Polar', 0.8, '3@0.7']]
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick test</div><h2 class="h1" data-at="0">The quick polarity test</h2>
      <div class="rule2 teal" style="left:120px;border-color:rgba(60,199,188,.7);background:rgba(60,199,188,.12)" data-at="1" data-fx="pop">Central atom has<br>no lone pairs</div>
      <div style="position:absolute;left:820px;top:350px;width:280px;text-align:center;font-size:48px;font-weight:900" data-at="1@0.3" data-fx="fade">AND</div>
      <div class="rule2 pri" style="left:1100px;border-color:rgba(141,141,240,.7);background:rgba(141,141,240,.12)" data-at="1@0.4" data-fx="pop">All outer atoms<br>are identical</div>
      <div class="res" style="top:500px" data-at="1@0.8" data-out="2" data-fx="pop">${ARR} <span class="good">nonpolar</span></div>
      <div class="banner" style="top:490px;font-size:44px" data-at="2" data-fx="pop">Otherwise, check carefully: <span class="warm">usually polar</span></div>
      ${HT.map(([k, f, s, v, sc, at], i) => `<div class="pt" style="left:${120 + i * 570}px;top:620px;height:290px" data-at="${at}" data-fx="pop">
        <svg width="540" height="200" viewBox="0 0 540 200">${mol(k, 270, 100, sc)}</svg>
        <div class="fm" style="bottom:50px">${f}</div><div class="vd ${v === 'Polar' ? 'warm' : 'good'}" style="bottom:54px">${v}</div>
        <div style="position:absolute;left:0;right:0;bottom:12px;font-size:26px;font-weight:800;color:var(--muted)">${s}</div></div>`).join('')}`,
  })
  // (the "nonpolar" result fades when the "otherwise" banner replaces it)

  // ---------- worked example: ethene ----------
  const C1 = [470, 540], C2 = [770, 540]
  const HH = [[360, 420], [360, 660], [880, 420], [880, 660]]
  const lblpos = [[378, 512], [378, 598], [862, 512], [862, 598]]
  EZ.scene('example', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Count σ and π bonds: ethene, H<sub>2</sub>C=CH<sub>2</sub></h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1" data-fx="fade">
          ${HH.map(([x, y], i) => { const c = i < 2 ? C1 : C2; return `<line x1="${c[0]}" y1="${c[1]}" x2="${x}" y2="${y}" stroke="${LN}" stroke-width="8"/>` }).join('')}
          <line x1="${C1[0]}" x2="${C2[0]}" y1="${C1[1] - 13}" y2="${C2[1] - 13}" stroke="${LN}" stroke-width="8"/><line x1="${C1[0]}" x2="${C2[0]}" y1="${C1[1] + 13}" y2="${C2[1] + 13}" stroke="${LN}" stroke-width="8"/></g>
        <g data-at="1@0.2" data-fx="pop">${ball(C1[0], C1[1], 52, 'gray', 'C')}${ball(C2[0], C2[1], 52, 'gray', 'C')}</g>
        <g data-at="1@0.5" data-fx="pop">${HH.map(([x, y]) => ball(x, y, 34, 'warm', 'H')).join('')}</g>
        <g data-at="2@0.1" data-fx="fade">${lblpos.map(([x, y]) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="46" font-weight="900" class="f-pri">σ</text>`).join('')}</g>
        <g data-at="2@0.6" data-fx="fade"><text x="620" y="603" text-anchor="middle" font-size="46" font-weight="900" class="f-pri">σ</text></g>
        <g data-at="3" data-fx="fade">
          <ellipse cx="620" cy="420" rx="110" ry="40" fill="rgba(243,167,100,.3)" stroke="#f3a764" stroke-width="5"/><ellipse cx="620" cy="665" rx="110" ry="40" fill="rgba(243,167,100,.3)" stroke="#f3a764" stroke-width="5"/>
          <text x="620" y="433" text-anchor="middle" font-size="46" font-weight="900" class="f-warm">π</text></g>
        <g data-at="4" data-fx="fade"><text x="${C1[0]}" y="${C1[1] + 105}" text-anchor="middle" font-size="40" font-weight="900" class="f-teal">${sup('sp', '2')}</text><text x="${C2[0]}" y="${C2[1] + 105}" text-anchor="middle" font-size="40" font-weight="900" class="f-teal">${sup('sp', '2')}</text>
          <text x="620" y="790" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">3 domains each · 120°</text></g>
      </svg>
      <div class="cnt" style="top:300px" data-at="2" data-fx="right"><div class="k">σ bonds</div><div class="n"><span class="pri">4</span> C–H <span class="muted">+</span> <span class="pri">1</span> C=C <span class="muted">=</span> <span class="good">5</span></div></div>
      <div class="cnt" style="top:470px" data-at="3" data-fx="right"><div class="k">π bonds</div><div class="n">C=C has <span class="warm">1</span></div></div>
      <div class="cnt" style="top:640px" data-at="4" data-fx="right"><div class="k">Each carbon</div><div class="n">3 domains <span class="muted">${ARR}</span> <span class="teal">sp<sup>2</sup></span></div></div>
      <div class="banner" style="top:900px;font-size:44px" data-at="5" data-fx="pop"><span class="pri">5 σ</span> · <span class="warm">1 π</span> · both carbons <span class="teal">sp<sup>2</sup></span></div>`,
  })

  // ---------- try it ----------
  const OPTS = [['A', 'sp'], ['B', 'sp<sup>2</sup>'], ['C', 'sp<sup>3</sup>'], ['D', 'none']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">What is the hybridization of <span class="teal">C</span><br>in carbon dioxide, CO<sub>2</sub>?</h2>
      ${OPTS.map(([l, f], i) => `<div class="tile t${i}" style="left:${120 + i * 430}px" data-at="1@${0.5 + i * 0.125}" data-fx="pop"><div class="l">${l}</div>${i === 0 ? OK : ''}
        <div class="f">${f}</div></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="760" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="760" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 760)"/>
        <text class="num" x="960" y="786" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="890" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="card work" data-at="4-0.1">
        <span data-at="4@0.05" data-fx="fade">O=C=O: C has <span class="pri">2 domains</span> (two double bonds)</span><br>
        <span data-at="5@0.1" data-fx="fade">${ARR} &nbsp;<span class="good">sp</span>, linear, 180°</span></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.5, b[3].start + 0.95))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 0) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const mini = (n, x) => { const cx = x, cy = 85
    const outs = n === 2 ? [[cx - 56, cy], [cx + 56, cy]] : n === 3 ? [[cx, cy - 52], [cx - 46, cy + 28], [cx + 46, cy + 28]] : [[cx, cy - 52], [cx - 46, cy + 28], [cx + 46, cy + 28], [cx, cy + 36]]
    return outs.map(([a, b]) => `<line x1="${cx}" y1="${cy}" x2="${a}" y2="${b}" stroke="${LN}" stroke-width="6"/>`).join('') + outs.map(([a, b]) => ball(a, b, 14, 'pur')).join('') + ball(cx, cy, 20, 'gray') }
  const r1 = `<svg width="460" height="170" viewBox="0 0 460 170">${mini(2, 80)}${mini(3, 230)}${mini(4, 380)}</svg>`
  const r2 = `<svg width="460" height="170" viewBox="0 0 460 170"><line x1="120" x2="340" y1="72" y2="72" stroke="${LN}" stroke-width="7"/><line x1="120" x2="340" y1="98" y2="98" stroke="${LN}" stroke-width="7"/>${ball(120, 85, 34, 'gray')}${ball(340, 85, 34, 'gray')}
    <text x="230" y="50" text-anchor="middle" font-size="40" font-weight="900" class="f-pri">σ</text><text x="230" y="146" text-anchor="middle" font-size="40" font-weight="900" class="f-warm">π</text></svg>`
  const r3 = `<svg width="460" height="170" viewBox="0 0 460 170">${mol('co2', 115, 85, 0.6)}${mol('h2o', 345, 80, 0.8)}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>2 domains = <span class="pri">sp</span><br>3 = <span class="teal">sp<sup>2</sup></span><br>4 = <span class="warm">sp<sup>3</sup></span></p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Single = <span class="pri">σ</span>. Double = σ + <span class="warm">π</span>.<br>Triple = σ + 2π.<br>σ is stronger than π;<br>π prevents rotation</p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p><span class="teal">Polar bonds</span> +<br><span class="warm">asymmetric shape</span><br>= polar molecule</p></div>`,
  })
})()
