// Pictures for chem-1.8 "Valence Electrons & Ionic Compounds". One EZ.scene per scene id in script.mjs.
// Everything shown is the lesson's own (app/src/content/chem/u1.ts and book.ts). Atoms and ions are schematic:
// the sizes are in a sensible order but make no claim of exact scale.
(() => {
  const { clamp, eio, eo, back, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .zn{position:absolute;left:1180px;width:620px;padding:20px 30px 22px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .zn b{display:block;font-size:40px;font-weight:900;line-height:1.15} .zn span{display:block;margin-top:6px;font-size:30px;font-weight:700;line-height:1.3;color:var(--muted)}
    .ln{position:absolute;left:0;width:1920px;text-align:center;font-weight:900;white-space:nowrap}
    .cx{position:absolute;left:120px;width:1680px;padding:22px 40px 24px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line);font-size:48px;font-weight:900;line-height:1.35;white-space:nowrap}
    .cx small{display:block;font-size:30px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:6px}
    .gc{position:absolute;top:540px;width:540px;height:330px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:12px;text-align:center;white-space:nowrap}
    .gc .lb{font-size:30px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)} .gc .rt{font-size:62px;font-weight:900} .gc .cp{font-size:48px;font-weight:900;line-height:1.3}
    .ch{position:absolute;width:262px;height:230px;text-align:center}
    .ch .g{display:block;margin-top:30px;font-size:32px;font-weight:900;color:var(--muted)} .ch .v{display:block;margin-top:8px;font-size:100px;font-weight:900;line-height:1.1}
    .pc{position:absolute;top:320px;height:360px;padding:26px 36px}
    .pc b{display:block;font-size:48px;font-weight:900;line-height:1.15} .pc span{display:block;margin-top:14px;font-size:36px;font-weight:800;line-height:1.35;color:var(--muted)} .pc em{display:block;margin-top:14px;font-style:normal;font-size:44px;font-weight:900}
    .opt{position:absolute;left:120px;width:1680px;height:100px;padding-left:112px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;font-size:40px;font-weight:800;white-space:nowrap}
    .opt .l{position:absolute;left:26px;top:20px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;text-align:center;color:var(--muted)}
    .opt .ok{position:absolute;right:24px;top:16px;width:64px;height:64px}
    .rc{top:320px;width:540px;height:560px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc svg{display:block;margin:14px auto 0} .rc p{margin:14px 20px 0;font-size:35px;font-weight:800;line-height:1.3;white-space:nowrap}
  `
  document.head.appendChild(css)
  const PUR = '#8d8df0', TEAL = '#3cc7bc', WARM = '#f3a764', BAD = '#f0707a', MUTED = '#a3abbd', TXT = '#eef0f7'

  const cat = (x, y, r, label = '+') => ball(x, y, r, 'warm', label, r * 1.15)
  const an = (x, y, r, label = '−') => ball(x, y, r, 'teal', label, r * 1.15)

  // ---------- intro artwork: a faint column of ions on each edge (all above y = 950) ----------
  const col = (x) => [0, 1, 2, 3, 4, 5].map((i) => (i % 2 === 0 ? cat(x, 250 + i * 100, 28) : an(x, 250 + i * 100, 42))).join('')
  EZ.intro = {
    chips: [['1@0.28', 'Metals and nonmetals'], ['1@0.52', 'Ion charges'], ['1@0.76', 'Predicting formulas']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">${col(66)}${col(1854)}</svg>`,
  }

  // ---------- hook: salt, and a compound you have never seen ----------
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="0">A pattern machine</h2>
      <div class="card" style="left:120px;top:320px;width:760px;height:520px" data-at="0@0.3"><h3>Table salt</h3>
        <svg style="position:absolute;left:0;top:0" width="760" height="520" viewBox="0 0 760 520">
          ${cat(270, 270, 56, sup('Na', '+'))}${an(470, 270, 76, sup('Cl', '−'))}
          <text x="380" y="450" text-anchor="middle" font-size="76" font-weight="900" style="fill:#eef0f7">NaCl</text></svg></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="1" data-fx="fade"><line x1="910" y1="580" x2="1010" y2="580" stroke="#8d8df0" stroke-width="12" marker-end="url(#mk-pri)"/></g></svg>
      <div class="card" style="left:1040px;top:320px;width:760px;height:520px" data-at="1"><h3>Rubidium iodide</h3>
        <svg style="position:absolute;left:0;top:0" width="760" height="520" viewBox="0 0 760 520">
          <text x="380" y="330" text-anchor="middle" font-size="220" font-weight="900" class="f-pri" style="fill:#8d8df0">?</text>
          <text x="380" y="450" text-anchor="middle" font-size="34" font-weight="800" style="fill:#a3abbd">a compound you have never seen</text></svg></div>
      <div class="banner" style="top:896px" data-at="2" data-fx="pop">The periodic table is a <span class="teal">pattern machine</span></div>`,
  })

  // ---------- valence electrons decide bonding ----------
  const MX = 230, NX = 770, AY = 270
  EZ.scene('valence', {
    html: `<div class="kicker" data-at="in" data-fx="left">Valence electrons decide bonding</div><h2 class="h1" data-at="0">Lose, gain, bond</h2>
      <div class="card" style="left:120px;top:320px;width:1000px;height:540px" data-at="0@0.4">
        <svg style="position:absolute;left:0;top:0" width="1000" height="540" viewBox="0 0 1000 540">
          <g data-at="1" data-fx="pop">${ball(MX, AY, 100, 'warm', 'metal', 38)}</g>
          <g data-at="3" data-fx="pop">${ball(NX, AY, 100, 'teal', 'nonmetal', 32)}</g>
          <g class="el"></g>
          <text class="pl" x="${MX + 96}" y="${AY - 96}" font-size="84" font-weight="900" style="fill:#f3a764;opacity:0">+</text>
          <text class="mi" x="${NX + 96}" y="${AY - 96}" font-size="84" font-weight="900" style="fill:#3cc7bc;opacity:0">−</text>
          <text x="${MX}" y="${AY + 190}" text-anchor="middle" font-size="46" font-weight="900" style="fill:#f3a764" data-at="2" data-fx="fade">cation</text>
          <text x="${NX}" y="${AY + 190}" text-anchor="middle" font-size="46" font-weight="900" style="fill:#3cc7bc" data-at="4" data-fx="fade">anion</text>
        </svg></div>
      <div class="zn" style="top:320px" data-at="1" data-fx="right"><b class="warm">Metals, on the left</b><span>few valence electrons, low ionization energy</span><span class="warm" style="font-weight:900" data-at="2" data-fx="fade">lose electrons: cations</span></div>
      <div class="zn" style="top:560px" data-at="3" data-fx="right"><b class="teal">Nonmetals, on the right</b><span>high electronegativity</span><span class="teal" style="font-weight:900" data-at="4" data-fx="fade">gain electrons: anions</span></div>
      <div class="banner" style="top:896px" data-at="5" data-fx="pop">Metal + nonmetal = usually an <span class="teal">ionic compound</span></div>`,
    update(c) {
      const p = eio(c.seg(c.b[2].start + 0.3, c.b[4].start + 0.9))
      const x = MX + 100 + p * (NX - 100 - MX - 100), y = AY - Math.sin(p * Math.PI) * 60
      c.$('.el').innerHTML = c.t >= c.b[1].start + 0.4 ? `<g opacity="${clamp((1 - p) / 0.15)}">${ball(x, y, 20, 'gold')}</g>` : ''
      c.$('.pl').style.opacity = clamp((p - 0.15) / 0.3); c.$('.mi').style.opacity = clamp((p - 0.8) / 0.2)
    },
  })

  // ---------- match a noble gas ----------
  EZ.scene('noble', {
    html: `<div class="kicker" data-at="in" data-fx="left">Main-group ions</div><h2 class="h1" data-at="0">Match a noble gas</h2>
      <div class="ln" style="top:300px;font-size:38px;color:var(--muted)" data-at="0@0.3" data-fx="fade">gain or lose electrons until the configuration matches a <span class="teal">noble gas</span></div>
      <div class="card" style="left:120px;top:380px;width:840px;height:360px" data-at="1" data-fx="up">
        <svg style="position:absolute;left:0;top:0" width="840" height="360" viewBox="0 0 840 360">
          ${ball(140, 140, 66, 'warm', 'Mg', 50)}
          <line x1="232" y1="140" x2="400" y2="140" stroke="#f3a764" stroke-width="9" marker-end="url(#mk-warm)" data-at="1@0.35" data-fx="draw"/>
          <text x="316" y="100" text-anchor="middle" font-size="32" font-weight="900" style="fill:#f3a764" data-at="1@0.4" data-fx="fade">loses 2 e⁻</text>
          <g data-at="1@0.6" data-fx="pop">${ball(540, 140, 56, 'warm', sup('Mg', '2+'), 34)}</g>
          <text x="140" y="280" text-anchor="middle" font-size="40" font-weight="900" style="fill:#eef0f7">[Ne] 3s²</text>
          <text x="560" y="280" text-anchor="middle" font-size="36" font-weight="900" style="fill:#3cc7bc" data-at="1@0.8" data-fx="fade">same as neon</text></svg></div>
      <div class="card" style="left:1000px;top:380px;width:800px;height:360px" data-at="2" data-fx="up">
        <svg style="position:absolute;left:0;top:0" width="800" height="360" viewBox="0 0 800 360">
          ${ball(130, 140, 66, 'teal', 'S', 50)}
          <line x1="222" y1="140" x2="380" y2="140" stroke="#3cc7bc" stroke-width="9" marker-end="url(#mk-teal)" data-at="2@0.35" data-fx="draw"/>
          <text x="300" y="100" text-anchor="middle" font-size="32" font-weight="900" style="fill:#3cc7bc" data-at="2@0.4" data-fx="fade">gains 2 e⁻</text>
          <g data-at="2@0.6" data-fx="pop">${ball(500, 140, 78, 'teal', sup('S', '2−'), 44)}</g>
          <text x="130" y="280" text-anchor="middle" font-size="38" font-weight="900" style="fill:#eef0f7">[Ne] 3s² 3p⁴</text>
          <text x="560" y="280" text-anchor="middle" font-size="36" font-weight="900" style="fill:#3cc7bc" data-at="2@0.8" data-fx="fade">same as argon</text></svg></div>
      <div class="cx" style="top:780px" data-at="3" data-out="4" data-fx="up">A third electron would come from the <span class="pri">core</span>: far more energy</div>
      <div class="banner" style="top:780px" data-at="4" data-fx="pop"><span class="bad">Mg³⁺</span> does not form in chemical reactions</div>`,
  })

  // ---------- same column, same kind of compound ----------
  EZ.scene('column', {
    html: `<div class="kicker" data-at="in" data-fx="left">The pattern</div><h2 class="h1" data-at="0">Same column, same kind of compound</h2>
      <div class="cx" style="top:300px" data-at="1" data-fx="up">Same group = same number of <span class="teal">valence electrons</span><div style="font-size:48px;margin-top:2px" data-at="2" data-fx="fade">${ARR} &nbsp;<span class="warm">analogous compounds</span></div></div>
      <div class="card gc" style="left:120px" data-at="3" data-fx="up"><div class="lb">Group 1 + Group 17</div><div class="rt teal">1 : 1</div><div class="cp">NaCl · KCl<br>NaBr · KI</div></div>
      <div class="card gc" style="left:690px" data-at="4" data-fx="up"><div class="lb">Group 2 + Group 16</div><div class="rt teal">1 : 1</div><div class="cp">MgO · CaO<br>CaS</div></div>
      <div class="card gc" style="left:1260px" data-at="5" data-fx="up"><div class="lb">Group 16 + hydrogen</div><div class="cp" style="font-size:64px;margin-top:20px">H₂O<br>H₂S</div></div>`,
  })

  // ---------- typical charges ----------
  const CH = [['1', '+1', 'warm', '1@0'], ['2', '+2', 'warm', '1@0.33'], ['13', '+3', 'warm', '1@0.66'], ['15', '−3', 'teal', '2@0'], ['16', '−2', 'teal', '2@0.33'], ['17', '−1', 'teal', '2@0.66']]
  EZ.scene('charges', {
    html: `<div class="kicker" data-at="in" data-fx="left">Typical charges</div><h2 class="h1" data-at="0">Read the charge off the table</h2>
      ${CH.map(([g, v, k, at], i) => `<div class="card ch" style="left:${120 + i * 284}px;top:310px" data-at="${at}" data-fx="up"><span class="g">Group ${g}</span><span class="v ${k}">${v}</span></div>`).join('')}
      <div class="card" style="left:120px;top:590px;width:900px;height:250px;padding:26px 40px" data-at="3" data-fx="right"><b class="teal" style="display:block;font-size:42px">Nitrogen: 5 valence electrons</b><div style="margin-top:14px;font-size:50px;font-weight:900">gains 3 ${ARR} <span class="teal">N³⁻</span></div><div style="margin-top:8px;font-size:30px;font-weight:800;color:var(--muted)">a noble-gas configuration</div></div>
      <div class="card" style="left:1060px;top:590px;width:740px;height:230px" data-at="4" data-fx="right">
        <svg style="position:absolute;left:0;top:0" width="740" height="230" viewBox="0 0 740 230">
          ${cat(90, 95, 34)}${cat(180, 95, 34)}${cat(270, 95, 34)}${an(400, 95, 62, '3−')}
          <text x="530" y="116" font-size="64" font-weight="900" style="fill:#eef0f7">Li₃N</text>
          <text x="370" y="205" text-anchor="middle" font-size="30" font-weight="800" style="fill:#a3abbd">3 Li⁺ balance one N³⁻</text></svg></div>`,
  })

  // ---------- worked example: Ga and S ----------
  const tile = (x, y, sym, col) => `<rect x="${x - 95}" y="${y - 65}" width="190" height="130" rx="22" fill="rgba(36,40,56,.95)" stroke="${col}" stroke-width="5"/><text x="${x}" y="${y + 24}" text-anchor="middle" font-size="76" font-weight="900" style="fill:${col}">${sym}</text>`
  EZ.scene('predict', {
    html: `<div class="kicker" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Predict the formula</h2>
      <div class="card" style="left:120px;top:310px;width:900px;height:560px" data-at="0@0.5">
        <svg style="position:absolute;left:0;top:0" width="900" height="560" viewBox="0 0 900 560">
          <text x="260" y="74" text-anchor="middle" font-size="36" font-weight="900" style="fill:#a3abbd">Group 13</text>
          <text x="640" y="74" text-anchor="middle" font-size="36" font-weight="900" style="fill:#a3abbd">Group 16</text>
          <g data-at="1" data-fx="pop">${tile(260, 180, 'Al', WARM)}${tile(640, 180, 'O', TEAL)}</g>
          <g data-at="2" data-fx="pop">${tile(260, 350, 'Ga', WARM)}</g>
          <text x="260" y="460" text-anchor="middle" font-size="32" font-weight="800" style="fill:#f3a764" data-at="2@0.3" data-fx="fade">directly below Al</text>
          <g data-at="3" data-fx="pop">${tile(640, 350, 'S', TEAL)}</g>
          <text x="640" y="460" text-anchor="middle" font-size="32" font-weight="800" style="fill:#3cc7bc" data-at="3@0.3" data-fx="fade">directly below O</text></svg></div>
      <div class="zn" style="left:1080px;width:720px;top:310px" data-at="1" data-fx="right"><b class="pri">Aluminum + oxygen = Al₂O₃</b></div>
      <div class="zn" style="left:1080px;width:720px;top:430px" data-at="1@0.6" data-fx="right"><b class="warm">Gallium + sulfur = ?</b></div>
      <div class="zn" style="left:1080px;width:720px;top:580px" data-at="4" data-fx="right"><b class="teal">Analogous elements form analogous compounds</b></div>
      <div class="banner" style="top:896px;font-size:52px" data-at="5" data-fx="pop">Gallium + sulfur = <span class="teal">Ga₂S₃</span></div>`,
  })

  // ---------- watch for: ionic vs covalent, and transition metals ----------
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Two things to watch</div><h2 class="h1" data-at="0">Is it really ionic?</h2>
      <div class="card pc" style="left:120px;width:820px;border-color:rgba(76,199,129,.6)" data-at="1" data-fx="up"><b class="good">Ionic</b><span>a metal + a nonmetal, with very different electronegativities</span><em>K and F ${ARR} <span class="teal" style="display:inline;margin:0;font-size:inherit;color:var(--teal)">ionic KF</span></em></div>
      <div class="card pc" style="left:980px;width:820px;border-color:rgba(240,112,122,.6)" data-at="2" data-fx="up"><b class="bad">Covalent</b><span>a nonmetal + a nonmetal</span><em style="font-size:40px;line-height:1.4">C and O<br>N and H<br>S and O</em></div>
      <div class="cx" style="top:720px;border-color:rgba(243,167,100,.7);font-size:42px" data-at="3" data-fx="up"><small style="color:var(--warm)">Analogies work best in the main groups</small>Transition metals often form ions with more than one charge</div>`,
  })

  // ---------- try it ----------
  const OPTS = [['A', 'LiSe', '1@0.3'], ['B', 'Li₂Se', '1@0.5'], ['C', 'LiSe₂', '1@0.66'], ['D', 'Li₃Se₂', '1@0.86']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:60px" data-at="1">Lithium + selenium: the most likely formula?</h2>
      ${OPTS.map(([l, s, at], i) => `<div class="opt t${i}" style="top:${290 + i * 114}px" data-at="${at}" data-fx="left"><div class="l">${l}</div>${s}
        ${i === 1 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}</div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="862" r="66" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="862" r="66" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 862)"/>
        <text class="num" x="960" y="886" text-anchor="middle" font-size="70" font-weight="900">3</text><text x="960" y="982" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:775px;font-size:46px" data-at="4" data-fx="pop">Li: Group 1, <span class="warm">+1</span> &nbsp;·&nbsp; Se: Group 16, <span class="teal">−2</span></div>
      <div class="ln" style="top:895px;font-size:46px" data-at="5" data-fx="up">2 Li⁺ + Se²⁻ ${ARR} <span class="good">Li₂Se</span> <span style="font-size:34px;color:var(--muted)">&nbsp;just like Na₂O</span></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.5, b[3].start + 0.95))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 1) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const m1 = `<svg width="460" height="210" viewBox="0 0 460 210"><circle cx="230" cy="105" r="80" fill="none" stroke="#8d8df0" stroke-width="3" stroke-dasharray="8 8"/>${ball(230, 105, 30, 'warm', '+', 36)}${ball(310, 105, 16, 'gold')}</svg>`
  const chip = (x, t, col) => `<rect x="${x}" y="70" width="170" height="70" rx="16" fill="rgba(36,40,56,.95)" stroke="${col}" stroke-width="4"/><text x="${x + 85}" y="118" text-anchor="middle" font-size="40" font-weight="900" style="fill:${col}">${t}</text>`
  const m2 = `<svg width="460" height="210" viewBox="0 0 460 210">${chip(20, 'NaCl', WARM)}${chip(270, 'KBr', TEAL)}<text x="230" y="118" text-anchor="middle" font-size="44" font-weight="900" style="fill:#a3abbd">↔</text></svg>`
  const m3 = `<svg width="460" height="210" viewBox="0 0 460 210"><text x="230" y="90" text-anchor="middle" font-size="46" font-weight="900" style="fill:#f3a764">+1 +2 +3</text><text x="230" y="170" text-anchor="middle" font-size="46" font-weight="900" style="fill:#3cc7bc">−3 −2 −1</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div>${m1}<p><span class="pri">Valence electrons</span> and<br>nuclei decide<br>whether atoms bond</p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div>${m2}<p><span class="pri">Same group</span>:<br>analogous compounds<br>NaCl matches KBr</p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div>${m3}<p>Predict charges<br><span class="warm">from position</span><br>in the table</p></div>`,
  })
})()
