// Pictures for chem-0.4 "Naming Compounds & Polyatomic Ions". One EZ.scene per scene id in script.mjs.
// All facts shown are the lesson's own (app/src/content/chem/u0.ts, lesson chem-0.4).
(() => {
  const { clamp, lerp, eio, eo, ball, sup } = EZ
  const css = document.createElement('style')
  css.textContent = `
    sub{font-size:.6em} sup{font-size:.6em;line-height:0}
    .tile{position:absolute;top:360px;width:390px;height:220px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .tile .f{margin-top:70px;font-size:62px;font-weight:900;line-height:1;white-space:nowrap}
    .tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .work{position:absolute;left:120px;top:650px;width:1680px;height:280px;text-align:center}
    .work .dg{position:absolute;left:0;right:0;top:10px;font-size:100px;font-weight:900}
    .work .lb{position:absolute;left:0;right:0;top:150px;font-size:40px;font-weight:900}
    .nm{position:absolute;width:810px;height:230px;text-align:center;border-radius:30px}
    .nm .f{margin-top:30px;font-size:96px;font-weight:900;line-height:1.1;white-space:nowrap}
    .nm .n{font-size:44px;font-weight:900;margin-top:6px;white-space:nowrap}
    .pi{position:absolute;width:530px;height:150px;border-radius:24px;background:rgba(36,40,56,.92);border:3px solid var(--line);white-space:nowrap}
    .pi .f{position:absolute;left:22px;top:0;line-height:144px;font-size:54px;font-weight:900;width:250px}
    .pi .n{position:absolute;left:275px;right:8px;top:0;line-height:144px;font-size:31px;font-weight:900;text-align:left}
    .rc{top:320px;width:540px;height:580px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc .pic{height:190px;margin-top:20px;font-size:56px;font-weight:900;line-height:1.4;white-space:nowrap} .rc p{margin:14px 10px 0;font-size:32px;font-weight:800;line-height:1.3;white-space:nowrap}
    .wd{position:absolute;width:330px;height:290px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid rgba(243,167,100,.6);text-align:center}
    .wd .w{margin-top:16px;font-size:50px;font-weight:900}
    .wd .c{font-size:27px;font-weight:800;margin-top:8px;line-height:1.25;color:var(--muted)}
    .wd .r{font-size:46px;font-weight:900;margin-top:10px;white-space:nowrap}
  `
  document.head.appendChild(css)

  // ---------- intro artwork: faint formulas at the left and right edges ----------
  EZ.intro = {
    chips: [['1@0.3', 'Ionic compounds'], ['1@0.6', 'Polyatomic ions'], ['1@0.86', 'Molecular names']],
    art: `<div style="position:absolute;left:36px;top:190px;font-size:84px;font-weight:900;color:#f3a764;opacity:.12;white-space:nowrap">SO<sub>4</sub><sup>2−</sup></div>
      <div style="position:absolute;right:36px;top:190px;font-size:84px;font-weight:900;color:#3cc7bc;opacity:.12;white-space:nowrap">NO<sub>3</sub><sup>−</sup></div>
      <div style="position:absolute;left:36px;top:850px;font-size:84px;font-weight:900;color:#8d8df0;opacity:.12;white-space:nowrap">CO<sub>2</sub></div>
      <div style="position:absolute;right:36px;top:850px;font-size:84px;font-weight:900;color:#8d8df0;opacity:.12;white-space:nowrap">PO<sub>4</sub><sup>3−</sup></div>`,
  }

  // ---------- hook ----------
  EZ.scene('hook', {
    html: `<div class="kicker" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="0">One oxygen makes a difference</h2>
      <div class="card" style="left:120px;top:330px;width:810px;height:360px;text-align:center;border-color:rgba(60,199,188,.7)" data-at="0" data-fx="pop">
        <div style="margin-top:60px;font-size:130px;font-weight:900">NaCl</div><div style="font-size:50px;font-weight:900;margin-top:10px" class="teal">table salt</div></div>
      <div class="card" style="left:990px;top:330px;width:810px;height:360px;text-align:center;border-color:rgba(243,167,100,.7)" data-at="1" data-fx="pop">
        <div style="margin-top:60px;font-size:130px;font-weight:900">NaCl<span class="warm" style="text-shadow:0 0 30px rgba(243,167,100,.8)">O</span></div><div style="font-size:50px;font-weight:900;margin-top:10px" class="warm">bleach</div></div>
      <div class="banner" style="top:780px;font-size:46px" data-at="3" data-fx="pop">Names and formulas = the <span class="pri">vocabulary</span> of chemistry</div>`,
  })

  // ---------- ionic compounds ----------
  EZ.scene('ionic', {
    html: `<div class="kicker" data-at="in" data-fx="left">Ionic compounds</div><h2 class="h1" data-at="0">Cation + anion, total charge zero</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0">${ball(480, 470, 90, 'warm', sup('Na', '+'), 58)}</g>
        <text x="650" y="490" text-anchor="middle" font-size="90" font-weight="900" class="f-text" data-at="0@0.3">+</text>
        <g data-at="0@0.3">${ball(820, 470, 90, 'teal', sup('Cl', '−'), 58)}</g>
        <text x="990" y="490" text-anchor="middle" font-size="90" font-weight="900" class="f-text" data-at="1">=</text>
        <text x="1230" y="490" text-anchor="middle" font-size="110" font-weight="900" class="f-text" data-at="1">NaCl</text>
        <text x="480" y="620" text-anchor="middle" font-size="36" font-weight="900" style="fill:#f3a764" data-at="0@0.5">cation (usually a metal)</text>
        <text x="820" y="620" text-anchor="middle" font-size="36" font-weight="900" style="fill:#3cc7bc" data-at="0@0.7">anion</text>
        <text x="1230" y="620" text-anchor="middle" font-size="36" font-weight="900" style="fill:#4cc781" data-at="1@0.4">total charge = 0</text>
      </svg>
      <div class="card nm" style="left:120px;top:690px;height:250px;border-color:rgba(243,167,100,.6)" data-at="2" data-fx="pop"><div class="f" style="font-size:54px;margin-top:36px"><span class="warm">sodium</span> <span class="teal">chlor<b>ide</b></span></div><div class="n muted" data-at="3@0.2" data-fx="fade">single-atom anions end in <span class="teal">-ide</span></div></div>
      <div class="card nm" style="left:990px;top:690px;height:250px;border-color:rgba(141,141,240,.6)" data-at="4" data-fx="pop"><div class="f" style="font-size:54px;margin-top:36px">FeCl<sub>3</sub> = <span class="pri">iron(III)</span> chloride</div><div class="n muted" style="font-size:34px" data-at="4@0.5" data-fx="fade">more than one possible charge:<br>Roman numeral</div></div>`,
  })

  // ---------- criss-cross ----------
  EZ.scene('criss', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Writing formulas</div><h2 class="h1" data-at="0">The criss-cross trick</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:480px;border-color:rgba(141,141,240,.6)" data-at="1" data-fx="pop"></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:480px;border-color:rgba(60,199,188,.6)" data-at="3" data-fx="pop"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <text x="400" y="440" text-anchor="middle" font-size="90" font-weight="900" class="f-text" data-at="1">Al<tspan font-size="52" dy="-34" style="fill:#f3a764">3+</tspan></text>
        <text x="650" y="440" text-anchor="middle" font-size="90" font-weight="900" class="f-text" data-at="1">O<tspan font-size="52" dy="-34" style="fill:#3cc7bc">2−</tspan></text>
        <path d="M470 460 L575 560" stroke="#8d8df0" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="300 400" data-at="1@0.5"/>
        <path d="M580 460 L450 560" stroke="#8d8df0" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="300 400" data-at="1@0.7"/>
        <text x="525" y="680" text-anchor="middle" font-size="110" font-weight="900" class="f-text" data-at="1@0.85">Al<tspan font-size="64" dy="22">2</tspan>O<tspan font-size="64" dy="22">3</tspan></text>
        <text x="1395" y="430" text-anchor="middle" font-size="76" font-weight="900" class="f-text" data-at="3">Mg<tspan font-size="44" dy="-28" style="fill:#f3a764">2+</tspan><tspan dy="28"> O</tspan><tspan font-size="44" dy="-28" style="fill:#3cc7bc">2−</tspan></text>
        <text x="1395" y="540" text-anchor="middle" font-size="70" font-weight="900" class="f-text" data-at="3@0.3">Mg<tspan font-size="44" dy="20">2</tspan><tspan dy="-20">O</tspan><tspan font-size="44" dy="20">2</tspan></text>
        <text x="1395" y="635" text-anchor="middle" font-size="40" font-weight="900" style="fill:#aab1c4" data-at="3@0.55">reduce if you can</text>
        <text x="1395" y="750" text-anchor="middle" font-size="96" font-weight="900" style="fill:#4cc781" data-at="3@0.8">MgO</text>
      </svg>`,
  })

  // ---------- polyatomic ions ----------
  const PI = [
    ['NH<sub>4</sub><sup>+</sup>', 'ammonium'], ['OH<sup>−</sup>', 'hydroxide'], ['NO<sub>3</sub><sup>−</sup>', 'nitrate'], ['NO<sub>2</sub><sup>−</sup>', 'nitrite'],
    ['SO<sub>4</sub><sup>2−</sup>', 'sulfate'], ['SO<sub>3</sub><sup>2−</sup>', 'sulfite'], ['CO<sub>3</sub><sup>2−</sup>', 'carbonate'], ['PO<sub>4</sub><sup>3−</sup>', 'phosphate'],
    ['<span style="font-size:44px">C<sub>2</sub>H<sub>3</sub>O<sub>2</sub><sup>−</sup></span>', 'acetate'], ['<span style="font-size:46px">MnO<sub>4</sub><sup>−</sup></span>', 'permanganate'], ['<span style="font-size:44px">Cr<sub>2</sub>O<sub>7</sub><sup>2−</sup></span>', 'dichromate'], ['CN<sup>−</sup>', 'cyanide'],
  ]
  const PAT = ['1', '2', '2@0.35', '2@0.7', '3', '3@0.35', '3@0.7', '4', '4@0.4', '5', '5@0.3', '5@0.6']
  EZ.scene('poly', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Memorize these</div><h2 class="h1" data-at="0">Polyatomic ions</h2>
      ${PI.map(([f, n], i) => `<div class="pi" style="left:${120 + (i % 3) * 560}px;top:${290 + Math.floor(i / 3) * 170}px" data-at="${PAT[i]}" data-fx="pop"><div class="f">${f}</div><div class="n">${n}</div></div>`).join('')}`,
  })

  // ---------- Nick the Camel ----------
  const NK = [
    ['Nick', '3 consonants<br>1 vowel', 'NO<sub>3</sub><sup>−</sup>', 'nitrate', 2, 0, 'rgba(243,167,100,.7)'],
    ['Camel', '3 consonants<br>2 vowels', 'CO<sub>3</sub><sup>2−</sup>', 'carbonate', 3, 0, 'rgba(60,199,188,.7)'],
    ['Clam', '3 consonants<br>1 vowel', 'ClO<sub>3</sub><sup>−</sup>', 'chlorate', 4, 0, 'rgba(141,141,240,.7)'],
    ['Supper', '4 consonants<br>2 vowels', 'SO<sub>4</sub><sup>2−</sup>', 'sulfate', 4, 0.35, 'rgba(243,167,100,.7)'],
    ['Phoenix', '4 consonants<br>3 vowels', 'PO<sub>4</sub><sup>3−</sup>', 'phosphate', 4, 0.7, 'rgba(60,199,188,.7)'],
  ]
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Memory trick</div><h2 class="h1" data-at="0" style="font-size:60px">“Nick the Camel ate a Clam for Supper in Phoenix”</h2>
      <div style="position:absolute;left:120px;top:250px;width:1680px;text-align:center;font-size:40px;font-weight:900" data-at="1" data-fx="fade"><span class="warm">Consonants</span> = oxygens &nbsp;·&nbsp; <span class="pri">Vowels</span> = negative charge</div>
      ${NK.map(([w, cv, f, n, at, fr, col], i) => `<div class="wd" style="left:${120 + i * 354}px;top:340px;width:330px;border-color:${col}" data-at="${at}@${fr}" data-fx="pop"><div class="w">${w}</div><div class="c">${cv}</div><div class="r" data-at="${at}@${fr + 0.2}" data-fx="fade">${f}</div><div style="font-size:30px;font-weight:800;margin-top:2px" class="muted" data-at="${at}@${fr + 0.2}" data-fx="fade">${n}</div></div>`).join('')}
      <div class="banner" style="top:690px;font-size:46px" data-at="5" data-fx="pop"><span class="teal">-ite</span> = one <span class="warm">fewer</span> oxygen, same charge</div>
      <div class="card" style="left:560px;top:830px;width:800px;height:120px;text-align:center;font-size:52px;font-weight:900;line-height:116px;border-color:rgba(60,199,188,.6)" data-at="5@0.5" data-fx="pop">NO<sub>3</sub><sup>−</sup> nitrate &nbsp;→&nbsp; <span class="teal">NO<sub>2</sub><sup>−</sup> nitrite</span></div>`,
  })

  // ---------- molecular (prefixes) ----------
  const PF = ['mono', 'di', 'tri', 'tetra', 'penta', 'hexa']
  EZ.scene('mol', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Molecular compounds</div><h2 class="h1" data-at="0">Two nonmetals: use prefixes</h2>
      <div style="position:absolute;left:120px;top:290px;width:1680px;text-align:center;font-size:54px;font-weight:900;white-space:nowrap" data-at="1" data-fx="fade">${PF.map((p, i) => `<span class="${i % 2 ? 'teal' : 'warm'}" data-at="1@${(0.2 + i * 0.12).toFixed(2)}" data-fx="fade">${p}-</span>`).join(' &nbsp; ')}</div>
      <div class="card nm" style="left:120px;top:400px;width:540px;height:240px;border-color:rgba(243,167,100,.6)" data-at="2" data-fx="pop"><div class="f" style="font-size:80px;margin-top:26px">CO<sub>2</sub></div><div class="n" style="font-size:36px">carbon <span class="warm">di</span>oxide</div></div>
      <div class="card nm" style="left:690px;top:400px;width:540px;height:240px;border-color:rgba(60,199,188,.6)" data-at="3" data-fx="pop"><div class="f" style="font-size:80px;margin-top:26px">N<sub>2</sub>O<sub>4</sub></div><div class="n" style="font-size:34px"><span class="teal">di</span>nitrogen <span class="teal">tetr</span>oxide</div></div>
      <div class="card nm" style="left:1260px;top:400px;width:540px;height:240px;border-color:rgba(141,141,240,.6)" data-at="4" data-fx="pop"><div class="f" style="font-size:80px;margin-top:26px">CO</div><div class="n" style="font-size:36px">carbon <span class="pri">mon</span>oxide</div></div>
      <div class="banner" style="top:690px;font-size:40px" data-at="4@0.5" data-fx="pop">Skip “mono” on the first element</div>
      <div class="card" style="left:170px;top:810px;width:1580px;height:140px;text-align:center;font-size:44px;font-weight:900;line-height:136px;border-color:rgba(76,199,129,.6)" data-at="5" data-fx="pop">Ionic: no prefixes! CaCl<sub>2</sub> = calcium chloride <span class="muted" style="font-size:32px">(not calcium dichloride)</span></div>`,
  })

  // ---------- trap ----------
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Watch out</div><h2 class="h1" data-at="0">Never change the formula inside the ion</h2>
      <div class="card" style="left:120px;top:310px;width:810px;height:420px;text-align:center;border-color:rgba(76,199,129,.7)" data-at="2" data-fx="pop">
        <div style="margin-top:50px;font-size:44px;font-weight:900" class="good">Right</div>
        <div style="margin-top:30px;font-size:120px;font-weight:900">(SO<sub>4</sub>)<sub>2</sub></div>
        <div style="font-size:36px;font-weight:800;margin-top:16px" class="muted" data-at="3@0.3" data-fx="fade">sulfate is always SO<sub>4</sub></div></div>
      <div class="card" style="left:990px;top:310px;width:810px;height:420px;text-align:center;border-color:rgba(239,98,98,.7)" data-at="2" data-fx="pop">
        <div style="margin-top:50px;font-size:44px;font-weight:900;color:#ef6262">Wrong</div>
        <div style="margin-top:30px;font-size:120px;font-weight:900;position:relative;display:inline-block">S<sub>2</sub>O<sub>8</sub><div style="position:absolute;left:-10px;right:-10px;top:50%;height:10px;border-radius:5px;background:#ef6262;transform:rotate(-6deg)" data-at="3@0.5" data-fx="fade"></div></div>
        <div style="font-size:36px;font-weight:800;margin-top:16px;color:#ef6262" data-at="3@0.5" data-fx="fade">never change the atoms inside</div></div>
      <div class="banner" style="top:810px;font-size:44px" data-at="1" data-fx="pop">To balance charges, change the <span class="pri">number of ions</span></div>`,
  })

  // ---------- try it ----------
  const OPTS = [['A', 'CaPO<sub>4</sub>'], ['B', 'Ca<sub>3</sub>(PO<sub>4</sub>)<sub>2</sub>'], ['C', 'Ca<sub>2</sub>(PO<sub>4</sub>)<sub>3</sub>'], ['D', 'Ca(PO<sub>4</sub>)<sub>2</sub>']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">What is the formula of<br><span class="teal">calcium phosphate</span>?</h2>
      ${OPTS.map(([l, f], i) => `<div class="tile t${i}" style="left:${120 + i * 430}px" data-at="1@${0.5 + i * 0.125}" data-fx="pop"><div class="l">${l}</div>
        ${i === 1 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        <div class="f">${f}</div></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="760" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="760" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 760)"/>
        <text class="num" x="960" y="786" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="890" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="card work" data-at="3-0.1">
        <div class="dg" data-at="3@0.15" data-fx="fade"><span class="good">Ca<sub>3</sub>(PO<sub>4</sub>)<sub>2</sub></span></div>
        <div class="lb" data-at="4@0.1" data-fx="fade"><span class="warm">3 Ca<sup>2+</sup> = +6</span> &nbsp;and&nbsp; <span class="teal">2 PO<sub>4</sub><sup>3−</sup> = −6</span> &nbsp;→&nbsp; <span class="good">total 0</span></div>
        <div class="lb" style="top:205px" data-at="5@0.1" data-fx="fade"><span class="muted">more than one polyatomic ion:</span> &nbsp;use <span class="pri">parentheses</span></div></div>`,
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
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div><div class="pic" style="font-size:64px"><span class="warm">Al<sup>3+</sup></span> <span class="teal">O<sup>2−</sup></span><br><span style="font-size:48px">Al<sub>2</sub>O<sub>3</sub></span></div><p>Ionic: charges add to zero.<br>Criss-cross, then reduce.</p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div><div class="pic" style="font-size:52px"><span class="warm">Nick</span> the <span class="teal">Camel</span>…<br><span style="font-size:44px">-ite = one less O</span></div><p>Memorize polyatomic ions.<br>-ite has one less O than -ate.</p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div><div class="pic" style="font-size:60px">CO<sub>2</sub><br><span style="font-size:40px" class="teal">carbon dioxide</span></div><p>Nonmetal + nonmetal:<br>use prefixes.</p></div>`,
  })
})()
