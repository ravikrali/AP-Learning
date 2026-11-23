// Pictures for chem-0.2 "Dimensional Analysis: Units Are Your GPS". One EZ.scene per scene id in
// script.mjs. All numbers shown are the lesson's own (app/src/content/chem/u0.ts).
(() => {
  const { clamp, lerp, eio, eo } = EZ
  const css = document.createElement('style')
  css.textContent = `
    sub{font-size:.6em} sup{font-size:.6em;line-height:0}
    .big{position:absolute;left:120px;width:1680px;text-align:center;font-weight:900}
    .eq{position:absolute;left:120px;width:1680px;text-align:center;font-weight:900;white-space:nowrap}
    .frac{display:inline-block;vertical-align:middle;text-align:center;line-height:1.15;margin:0 12px}
    .frac>span{display:block;padding:0 10px} .frac>span:first-child{border-bottom:5px solid var(--text)}
    .xpill{position:absolute;border-radius:26px;border:3px solid;display:flex;align-items:center;justify-content:center;font-weight:900;white-space:nowrap;text-align:center}
    .pf{position:absolute;left:120px;width:1680px;height:92px;border-radius:22px;background:rgba(36,40,56,.9);border:2px solid var(--line)}
    .pf .s{position:absolute;left:30px;top:0;line-height:92px;font-size:40px;font-weight:900;width:260px}
    .pf .sy{position:absolute;left:300px;top:14px;width:64px;height:64px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:36px;font-weight:900;line-height:60px;text-align:center}
    .pf .f{position:absolute;left:420px;top:0;line-height:92px;font-size:52px;font-weight:900;white-space:nowrap}
    .pf .n{position:absolute;right:40px;top:0;line-height:92px;font-size:34px;font-weight:800;color:var(--muted)}
    .stp{position:absolute;left:120px;width:1680px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center}
    .tile{position:absolute;top:360px;width:390px;height:220px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .rc{top:320px;width:540px;height:580px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc .pic{height:190px;margin-top:20px;font-size:50px;font-weight:900;line-height:1.4;white-space:nowrap} .rc p{margin:14px 10px 0;font-size:34px;font-weight:800;line-height:1.3;white-space:nowrap}
    .cx{position:relative;display:inline-block}
    .cx i{position:absolute;left:-6px;right:-6px;top:52%;height:6px;border-radius:3px;background:var(--warm);transform-origin:left;transform:scaleX(0)}
  `
  document.head.appendChild(css)

  // strike-through that grows from the left, driven by update()
  const strike = (c, sel, t0, d = 0.4) => {
    const p = eo(c.seg(t0, t0 + d))
    const root = c.$(sel)
    if (root) root.querySelectorAll('i').forEach((e) => { e.style.transform = `scaleX(${p})` })
  }
  const F = (t, b) => `<span class="frac"><span>${t}</span><span>${b}</span></span>`
  const P3 = (inner) => `<span style="position:relative;display:inline-block;vertical-align:middle;padding-right:34px;margin-right:34px"><span style="font-weight:300;font-size:1.7em;vertical-align:middle">(</span>${inner}<span style="font-weight:300;font-size:1.7em;vertical-align:middle">)</span><sup style="position:absolute;right:2px;top:34px;font-size:.55em">3</sup></span>`
  const X = (s, cls) => `<span class="cx ${cls}">${s}<i></i></span>`

  // ---------- intro artwork: faint conversions at the left and right edges ----------
  EZ.intro = {
    chips: [['1@0.3', 'Conversion factors'], ['1@0.6', 'Metric prefixes'], ['1@0.86', 'Squared and cubed units']],
    art: `<div style="position:absolute;left:36px;top:190px;font-size:76px;font-weight:900;color:#8d8df0;opacity:.12;white-space:nowrap">1000 g / 1 kg</div>
      <div style="position:absolute;right:36px;top:190px;font-size:76px;font-weight:900;color:#3cc7bc;opacity:.12;white-space:nowrap">10<sup>−3</sup> · 10<sup>6</sup></div>
      <div style="position:absolute;left:36px;top:850px;font-size:76px;font-weight:900;color:#f3a764;opacity:.12">mL → L</div>
      <div style="position:absolute;right:36px;top:850px;font-size:76px;font-weight:900;color:#8d8df0;opacity:.12">(100 cm)³</div>`,
  }

  // ---------- hook ----------
  EZ.scene('hook', {
    html: `<div class="kicker" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="0">Follow the units</h2>
      <div class="card" style="left:120px;top:310px;width:1680px;height:330px;text-align:center" data-at="1">
        <div style="margin-top:36px;font-size:36px;font-weight:800;color:var(--muted)">most AP® calculation problems</div>
        <div class="big" style="top:120px;left:0;width:1680px;font-size:84px" data-at="1@0.3" data-fx="pop"><span class="pri">units</span> <span class="muted">→</span> <span class="teal">answer</span></div></div>
      <div class="xpill good" style="left:120px;top:690px;width:1680px;height:130px;font-size:48px;border-color:rgba(76,199,129,.7);background:rgba(76,199,129,.12)" data-at="2" data-fx="pop">Units cancel to what the question asks for</div>
      <div class="banner" style="top:850px;font-size:44px" data-at="2@0.6" data-fx="pop">You are almost certainly <span class="gold">on the right track</span></div>`,
  })

  // ---------- conversion factors are fancy 1s ----------
  EZ.scene('factor', {
    html: `<div class="kicker" data-at="in" data-fx="left">Conversion factors</div><h2 class="h1" data-at="0">Conversion factors are fancy 1s</h2>
      <div class="card" style="left:120px;top:290px;width:1680px;height:230px;text-align:center" data-at="1">
        <div class="eq" style="left:0;top:40px;font-size:56px" data-at="1@0.2" data-fx="fade">1 kg = 1000 g &nbsp;<span class="muted">→</span>&nbsp; ${F('1000 g', '1 kg')} <span class="muted">=</span> <span class="gold">1</span></div></div>
      <div class="xpill pri" style="left:120px;top:560px;width:810px;height:100px;font-size:40px;border-color:rgba(141,141,240,.7);background:rgba(141,141,240,.12)" data-at="2" data-fx="pop">changes the units</div>
      <div class="xpill teal" style="left:990px;top:560px;width:810px;height:100px;font-size:40px;border-color:rgba(60,199,188,.7);background:rgba(60,199,188,.12)" data-at="2@0.5" data-fx="pop">not the amount</div>
      <div class="stp" style="top:700px;height:260px" data-at="3">
        <div style="margin-top:22px;font-size:34px;font-weight:800;color:var(--muted)">unit you <span class="warm">don't want</span> goes on the <span class="warm">bottom</span></div>
        <div class="eq fx" style="left:0;top:92px;font-size:66px" data-at="4" data-fx="fade">2.5 ${X('kg', 'pri')} × ${F('1000 g', X('1 kg', 'pri'))} = <span class="good">2500 g</span></div></div>`,
    update(c) { strike(c, '.fx', c.b[4].start + 0.5) },
  })

  // ---------- metric prefixes ----------
  const PF = [
    ['giga', 'G', '10<sup>9</sup>'], ['mega', 'M', '10<sup>6</sup>'], ['kilo', 'k', '10<sup>3</sup>'], ['centi', 'c', '10<sup>−2</sup>'],
    ['milli', 'm', '10<sup>−3</sup>'], ['micro', 'μ', '10<sup>−6</sup>'], ['nano', 'n', '10<sup>−9</sup>'], ['pico', 'p', '10<sup>−12</sup>'],
  ]
  const PB = [1, 1, 1, 2, 2, 3, 3, 3]
  EZ.scene('prefix', {
    html: `<div class="kicker" data-at="in" data-fx="left">Metric prefixes</div><h2 class="h1" data-at="0">Prefixes you must know</h2>
      ${PF.map(([n, s, f], i) => `<div class="card" style="left:${i < 4 ? 120 : 990}px;top:${280 + (i % 4) * 106}px;width:810px;height:92px;border-radius:22px" data-at="${PB[i] + 0}@${(i === 0 || i === 3 || i === 5) ? 0 : i === 1 || i === 6 ? 0.3 : 0.6}" data-fx="${i < 4 ? 'right' : 'left'}">
        <div style="position:absolute;left:28px;top:0;line-height:92px;font-size:40px;font-weight:900;width:210px">${n}</div>
        <div style="position:absolute;left:250px;top:14px;width:64px;height:64px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:36px;font-weight:900;line-height:60px;text-align:center" class="pri">${s}</div>
        <div style="position:absolute;right:36px;top:0;line-height:92px;font-size:52px;font-weight:900" class="${i < 3 || i === 5 ? 'pri' : 'teal'}">${f}</div></div>`).join('')}
      <div class="xpill gold" style="left:120px;top:730px;width:1680px;height:96px;font-size:38px;border-color:rgba(243,200,100,.6);background:rgba(243,200,100,.1)" data-at="4" data-fx="pop">On the AP® Equations &amp; Constants sheet</div>
      <div class="banner" style="top:860px;font-size:48px" data-at="5" data-fx="pop">1 mL = 1 cm³ &nbsp;·&nbsp; 1 L = 1000 mL</div>`,
  })

  // ---------- chain conversions ----------
  EZ.scene('chain', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Example</div><h2 class="h1" data-at="0">Chain conversions</h2>
      <div class="card" style="left:120px;top:290px;width:1680px;height:120px;text-align:center" data-at="1">
        <div class="eq" style="left:0;top:0;line-height:120px;font-size:50px">Convert <span class="warm">45 minutes</span> into seconds, then hours</div></div>
      <div class="stp" style="top:450px;height:200px" data-at="2">
        <div class="eq s1" style="left:0;top:34px;font-size:62px">45 ${X('min', 'pri')} × ${F('60 s', X('1 min', 'pri'))} = <span class="good">2700 s</span></div></div>
      <div class="stp" style="top:690px;height:200px" data-at="4">
        <div class="eq s2" style="left:0;top:34px;font-size:62px">45 ${X('min', 'pri')} × ${F('1 h', X('60 min', 'pri'))} = <span class="good">0.75 h</span></div></div>
      <div class="xpill muted" style="left:120px;top:925px;width:1680px;height:80px;font-size:34px;border-color:var(--line);background:rgba(36,40,56,.6)" data-at="3" data-fx="fade">minutes on top, minutes on the bottom of the factor → they cancel</div>`,
    update(c) { strike(c, '.s1', c.b[3].start + 0.2); strike(c, '.s2', c.b[4].start + 0.5) },
  })

  // ---------- cubed units ----------
  EZ.scene('cube', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">The sneaky one</div><h2 class="h1" data-at="0">Squared and cubed units</h2>
      <div class="card" style="left:120px;top:290px;width:1680px;height:110px;text-align:center" data-at="1">
        <div class="eq" style="left:0;line-height:110px;font-size:50px">How many <span class="teal">cm³</span> are in <span class="warm">1 m³</span>?</div></div>
      <svg class="full" viewBox="0 0 1920 1080" style="pointer-events:none">
        <g data-at="2" style="opacity:0">
          <rect x="260" y="470" width="190" height="190" rx="10" fill="rgba(141,141,240,.18)" stroke="#8d8df0" stroke-width="5"/>
          <path d="M260 470l60-50h190l-60 50M450 470l60-50v190l-60 50" fill="rgba(141,141,240,.1)" stroke="#8d8df0" stroke-width="5" stroke-linejoin="round"/>
          <text x="355" y="700" text-anchor="middle" font-size="40" font-weight="900" class="f-pri">1 m³</text>
        </g>
      </svg>
      <div class="stp" style="left:640px;top:450px;width:1160px;height:130px" data-at="2" data-fx="right"><div class="eq" style="left:0;top:0;width:1160px;line-height:130px;font-size:46px">1 m = 100 cm, but the unit is <span class="warm">cubed</span></div></div>
      <div class="xpill warm" style="left:640px;top:610px;width:1160px;height:90px;font-size:42px;border-color:rgba(243,167,100,.7);background:rgba(243,167,100,.12)" data-at="2@0.6" data-fx="pop">so the factor gets cubed too</div>
      <div class="stp" style="top:740px;height:130px" data-at="3"><div class="eq" style="left:0;line-height:130px;font-size:56px">1 m³ × ${P3(F('100 cm', '1 m'))} =100<sup>3</sup> cm³</div></div>
      <div class="banner" style="top:900px;font-size:50px" data-at="4" data-fx="pop"><span class="good">1,000,000 cm³</span> = 1 × 10<sup>6</sup> cm³ <span class="muted" style="font-size:.7em" data-at="5" data-fx="fade">(= 1000 L)</span></div>`,
  })

  // ---------- write the units ----------
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Write the units every single time</h2>
      <div class="xpill pri" style="left:120px;top:300px;width:1680px;height:130px;font-size:52px;border-color:rgba(141,141,240,.7);background:rgba(141,141,240,.12)" data-at="1" data-fx="pop">Units on every number = #1 way to catch mistakes</div>
      <div class="card" style="left:120px;top:490px;width:810px;height:330px;text-align:center" data-at="2" data-fx="right">
        <div style="margin-top:34px;font-size:34px;font-weight:800;color:var(--muted)">wanted</div>
        <div style="position:absolute;left:0;right:0;top:110px;font-size:100px;font-weight:900" class="good">g</div></div>
      <div class="card" style="left:990px;top:490px;width:810px;height:330px;text-align:center" data-at="3" data-fx="left">
        <div style="margin-top:34px;font-size:34px;font-weight:800;color:var(--muted)">got</div>
        <div style="position:absolute;left:0;right:0;top:110px;font-size:100px;font-weight:900" class="bad">g<sup>2</sup>/mol</div></div>
      <div class="banner" style="top:860px;font-size:44px" data-at="3@0.5" data-fx="pop">A factor is <span class="warm">upside down</span></div>`,
  })

  // ---------- try it ----------
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">Convert <span class="warm">350 mL</span> to <span class="teal">liters</span></h2>
      <div class="xpill muted" style="left:120px;top:330px;width:1680px;height:100px;font-size:40px;border-color:var(--line);background:rgba(36,40,56,.6)" data-at="2" data-fx="fade">Hint: 1 L = 1000 mL. Put mL on the bottom so it cancels.</div>
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="640" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="640" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 640)"/>
        <text class="num" x="960" y="666" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="770" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="card stp" style="top:490px;height:340px" data-at="4-0.1">
        <div class="eq w1" style="left:0;top:50px;font-size:66px" data-at="4@0.05" data-fx="fade">350 ${X('mL', 'pri')} × ${F('1 L', X('1000 mL', 'pri'))}</div>
        <div class="eq" style="left:0;top:210px;font-size:86px" data-at="5@0.1" data-fx="pop"><span class="muted">=</span> <span class="good">0.350 L</span></div></div>`,
    update(c) {
      const b = c.b, t0 = b[3].start + 0.3, t1 = b[4].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      strike(c, '.w1', b[4].start + 0.4)
    },
  })

  // ---------- recap ----------
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div><div class="pic">${F('1000 g', '1 kg')}<span class="muted"> = </span><span class="gold">1</span></div><p>A conversion factor<br>equals <span class="gold">1</span>:<br><span class="teal">units change, amount doesn't</span></p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div><div class="pic">${F('1 L', X('1000 mL', 'pri'))}</div><p>Unit you want to<br>get rid of goes<br><span class="warm">on the bottom</span></p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div><div class="pic">${P3(F('100 cm', '1 m'))}</div><p><span class="pri">Squared or cubed units:</span><br>square or cube<br>the factor too</p></div>`,
  })
})()
