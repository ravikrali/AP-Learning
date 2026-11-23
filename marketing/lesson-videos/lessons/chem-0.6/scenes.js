// Pictures for chem-0.6 "Logs & Exponents for Chemistry". One EZ.scene per scene id in
// script.mjs. All numbers shown are the lesson's own (app/src/content/chem/u0.ts).
(() => {
  const { clamp, lerp, eio, eo } = EZ
  const css = document.createElement('style')
  css.textContent = `
    sup{font-size:.6em;line-height:0}
    .zbig{position:absolute;left:120px;width:1680px;text-align:center;font-weight:900}
    .zrow{position:absolute;left:120px;width:1680px;height:120px;border-radius:28px;background:rgba(36,40,56,.9);border:2px solid var(--line)}
    .zrow .a{position:absolute;left:44px;top:0;line-height:120px;font-size:60px;font-weight:900;white-space:nowrap}
    .zrow .m{position:absolute;left:640px;top:0;line-height:120px;font-size:50px;font-weight:900;color:var(--muted)}
    .zrow .b{position:absolute;left:940px;top:0;line-height:120px;font-size:60px;font-weight:900;white-space:nowrap}
    .zbox{position:absolute;border-radius:30px;border:3px solid;text-align:center}
    .zbox h3{font-size:64px;margin-top:30px;font-weight:900}
    .zbox .s{font-size:40px;font-weight:900;margin-top:14px}
    .zbox .e{position:absolute;left:0;right:0;bottom:36px;font-size:48px;font-weight:900;white-space:nowrap}
    .zrule{position:absolute;left:120px;width:1680px;height:104px;border-radius:24px;background:rgba(36,40,56,.9);border:2px solid var(--line)}
    .zrule .n{position:absolute;left:22px;top:20px;width:64px;height:64px;border-radius:50%;background:var(--brand);font-size:38px;font-weight:900;line-height:64px;text-align:center}
    .zrule .t{position:absolute;left:120px;top:0;line-height:104px;font-size:56px;font-weight:900;white-space:nowrap}
    .zchip{position:absolute;border-radius:26px;text-align:center;font-weight:900;white-space:nowrap}
    .ztile{position:absolute;top:360px;width:390px;height:220px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .ztile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .ztile .f{margin-top:78px;font-size:64px;font-weight:900;line-height:1;white-space:nowrap}
    .ztile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .zwork{position:absolute;left:120px;top:660px;width:1680px;height:290px;text-align:center}
    .zwork .lb{position:absolute;left:0;right:0;font-size:46px;font-weight:900;white-space:nowrap}
    .zrc{top:320px;width:540px;height:580px;text-align:center} .zrc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .zrc .pic{height:190px;margin-top:20px;font-size:54px;font-weight:900;line-height:1.4;white-space:nowrap} .zrc p{margin:14px 10px 0;font-size:34px;font-weight:800;line-height:1.3;white-space:nowrap}
  `
  document.head.appendChild(css)

  // ---------- intro artwork: faint expressions at the left and right edges ----------
  EZ.intro = {
    chips: [['1@0.3', 'What a log means'], ['1@0.6', 'Undoing a log'], ['1@0.86', 'Estimating pH-style logs']],
    art: `<div style="position:absolute;left:36px;top:190px;font-size:84px;font-weight:900;color:#8d8df0;opacity:.12;white-space:nowrap">log(1000) = 3</div>
      <div style="position:absolute;right:36px;top:190px;font-size:84px;font-weight:900;color:#3cc7bc;opacity:.12;white-space:nowrap">10<sup>−2</sup> = 0.01</div>
      <div style="position:absolute;left:36px;top:850px;font-size:84px;font-weight:900;color:#f3a764;opacity:.12">ln x = y</div>
      <div style="position:absolute;right:36px;top:850px;font-size:84px;font-weight:900;color:#8d8df0;opacity:.12">x = 10<sup>y</sup></div>`,
  }

  // ---------- hook ----------
  const USES = [['pH', 'pri'], ['pKa', 'teal'], ['Rate laws', 'warm'], ['Nernst equation', 'gold']]
  EZ.scene('hook', {
    html: `<div class="kicker" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="0">Logs ask one simple question</h2>
      ${USES.map(([t, k], i) => `<div class="zchip ${k}" style="left:${120 + (i % 2) * 870}px;top:${300 + Math.floor(i / 2) * 130}px;width:810px;height:104px;line-height:98px;font-size:50px;border:3px solid rgba(141,141,240,.55);background:rgba(141,141,240,.12)" data-at="0@${0.2 + i * 0.15}" data-fx="pop">${t}</div>`).join('')}
      <div class="zbig" style="top:590px;font-size:60px;color:var(--warm)" data-at="1" data-fx="pop">Logs look scary…</div>
      <div class="banner" style="top:730px;font-size:60px" data-at="3" data-fx="pop"><span class="teal">10</span> to what <span class="warm">power</span> gives me this number?</div>`,
  })

  // ---------- what a log means ----------
  EZ.scene('meaning', {
    html: `<div class="kicker" data-at="in" data-fx="left">What a log means</div><h2 class="h1" data-at="0">The power of 10</h2>
      <div class="zrow" style="top:290px" data-at="1" data-fx="right"><div class="a">log(1000) = <span class="good">3</span></div><div class="m" data-at="1@0.4" data-fx="fade">because</div><div class="b" data-at="1@0.5" data-fx="fade">10<sup>3</sup> = 1000</div></div>
      <div class="zrow" style="top:440px" data-at="2" data-fx="right"><div class="a">log(0.01) = <span class="good">−2</span></div><div class="m" data-at="2@0.4" data-fx="fade">because</div><div class="b" data-at="2@0.5" data-fx="fade">10<sup>−2</sup> = 0.01</div></div>
      <div class="zbox" style="left:120px;top:620px;width:1680px;height:250px;border-color:rgba(243,167,100,.7);background:rgba(243,167,100,.12)" data-at="3" data-fx="pop">
        <div style="margin-top:28px;font-size:44px;font-weight:900" class="warm">The “undo” button</div>
        <div class="zbig" style="left:0;width:1680px;top:110px;font-size:76px" data-at="4" data-fx="pop">if log(x) = y, then <span class="good">x = 10<sup>y</sup></span></div></div>`,
  })

  // ---------- natural log ----------
  EZ.scene('ln', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">The natural log</div><h2 class="h1" data-at="0">ln: same idea, base <i>e</i></h2>
      <div class="zbox pri" style="left:120px;top:300px;width:810px;height:300px;border-color:rgba(141,141,240,.7);background:rgba(141,141,240,.12)" data-at="1"><h3 class="pri">log</h3><div class="s">base 10</div></div>
      <div class="zbox teal" style="left:990px;top:300px;width:810px;height:300px;border-color:rgba(60,199,188,.7);background:rgba(60,199,188,.12)" data-at="1@0.4" data-fx="pop"><h3 class="teal">ln</h3><div class="s">base <i>e</i> ≈ 2.718</div></div>
      <div class="zchip" style="left:990px;top:640px;width:390px;height:90px;line-height:86px;font-size:40px;background:rgba(243,167,100,.14);border:3px solid rgba(243,167,100,.6)" data-at="2" data-fx="pop">Kinetics</div>
      <div class="zchip" style="left:1410px;top:640px;width:390px;height:90px;line-height:86px;font-size:40px;background:rgba(243,167,100,.14);border:3px solid rgba(243,167,100,.6)" data-at="2@0.4" data-fx="pop">Thermodynamics</div>
      <div class="banner" style="top:790px;font-size:56px" data-at="3" data-fx="pop">if ln(x) = y, then <span class="good">x = <i>e</i><sup>y</sup></span></div>`,
  })

  // ---------- three log rules ----------
  const RULES = ['log(a × b) = log a + log b', 'log(a / b) = log a − log b', 'log(a<sup>n</sup>) = n log a']
  EZ.scene('rules', {
    html: `<div class="kicker" data-at="in" data-fx="left">Log rules</div><h2 class="h1" data-at="0">Three rules worth knowing</h2>
      ${RULES.map((r, i) => `<div class="zrule" style="top:${290 + i * 124}px" data-at="${i + 1}" data-fx="right"><div class="n">${i + 1}</div><div class="t">${r}</div></div>`).join('')}
      <div class="zbox" style="left:120px;top:690px;width:1680px;height:230px;border-color:rgba(76,199,129,.7);background:rgba(76,199,129,.1)" data-at="4" data-fx="pop">
        <div style="margin-top:24px;font-size:76px;font-weight:900">log(10<sup>n</sup>) = <span class="good">n</span></div>
        <div style="position:absolute;left:0;right:0;top:140px;font-size:46px;font-weight:900" data-at="5" data-fx="fade">1 × 10<sup>−n</sup> → log is just <span class="good">−n</span></div></div>`,
  })

  // ---------- estimate trick ----------
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Estimate pH-style logs in your head</h2>
      <div class="zbig" style="top:270px;font-size:84px" data-at="1" data-fx="pop">−log(<span class="warm">3.2 × 10<sup>−5</sup></span>) = ?</div>
      <div class="zrow" style="top:400px;height:100px" data-at="2" data-fx="right"><div class="a" style="line-height:100px;font-size:52px">−log(1 × 10<sup>−5</sup>) = <span class="good">5</span></div></div>
      <div class="zrow" style="top:520px;height:100px" data-at="3" data-fx="right"><div class="a" style="line-height:100px;font-size:52px">−log(10 × 10<sup>−5</sup>) = <span class="good">4</span></div></div>
      <svg class="full" viewBox="0 0 1920 1080" style="pointer-events:none">
        <g data-at="4" data-fx="fade"><line x1="460" y1="740" x2="1460" y2="740" stroke="#646c82" stroke-width="6" stroke-linecap="round"/>
        <line x1="560" y1="716" x2="560" y2="764" stroke="#aab1c4" stroke-width="6"/><line x1="1360" y1="716" x2="1360" y2="764" stroke="#aab1c4" stroke-width="6"/>
        <text x="560" y="810" text-anchor="middle" font-size="50" font-weight="900" class="f-text">4</text><text x="1360" y="810" text-anchor="middle" font-size="50" font-weight="900" class="f-text">5</text></g>
        <g data-at="4@0.5" data-fx="pop"><rect x="560" y="722" width="800" height="36" rx="18" fill="#f3a764" opacity=".7"/></g>
        <text x="960" y="690" text-anchor="middle" font-size="46" font-weight="900" class="f-warm" data-at="4@0.5" data-fx="fade">between 4 and 5</text></svg>
      <div class="banner" style="top:880px;font-size:42px" data-at="5" data-fx="pop">Faster · <span class="teal">catches calculator slips</span> · <span class="warm">eliminates wrong choices</span></div>`,
  })

  // ---------- worked example ----------
  EZ.scene('example', {
    html: `<div class="kicker" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">From a log back to a number</h2>
      <div class="zbox" style="left:120px;top:290px;width:1680px;height:130px;border-color:rgba(141,141,240,.7);background:rgba(141,141,240,.12)" data-at="1" data-fx="pop"><div style="line-height:124px;font-size:64px;font-weight:900">If <span class="pri">−log x = 3.00</span>, what is x?</div></div>
      <div class="zrow" style="top:460px" data-at="2" data-fx="right"><div class="a">−log x = 3.00 &nbsp;→&nbsp; log x = <span class="warm">−3.00</span></div></div>
      <div class="zrow" style="top:600px" data-at="3" data-fx="right"><div class="a">Undo the log: &nbsp;x = 10<sup>−3.00</sup></div></div>
      <div class="banner" style="top:760px;font-size:68px" data-at="4" data-fx="pop">x = <span class="good">0.0010</span> = <span class="good">1.0 × 10<sup>−3</sup></span></div>`,
  })

  // ---------- try it ----------
  const OPTS = [['A', '6 and 7'], ['B', '8 and 9'], ['C', '9 and 10'], ['D', '−9 and −8']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">Without a calculator, <span class="teal">−log(6 × 10<sup>−9</sup>)</span><br>is between…</h2>
      ${OPTS.map(([l, f], i) => `<div class="ztile t${i}" style="left:${120 + i * 430}px" data-at="1@${0.5 + i * 0.125}" data-fx="pop"><div class="l">${l}</div>
        ${i === 1 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        <div class="f">${f}</div></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="760" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="760" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 760)"/>
        <text class="num" x="960" y="786" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="890" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="card zwork" data-at="4-0.1">
        <div class="lb" style="top:50px" data-at="4@0.05" data-fx="fade">6 × 10<sup>−9</sup> is between <span class="pri">1 × 10<sup>−9</sup></span> and <span class="teal">1 × 10<sup>−8</sup></span></div>
        <div class="lb" style="top:130px" data-at="4@0.5" data-fx="fade"><span class="pri">−log = 9</span> &nbsp;·&nbsp; <span class="teal">−log = 8</span></div>
        <div class="lb" style="top:210px" data-at="5@0.1" data-fx="fade">so −log is between <span class="good">8 and 9</span></div></div>`,
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
      <div class="card zrc" style="left:120px" data-at="1"><div class="n">1</div><div class="pic"><span class="warm">log(x) = y</span><br><span class="teal">x = 10<sup>y</sup></span></div><p>log(x) is the <span class="pri">power of 10</span><br>that gives x<br>Undo it with <span class="teal">10<sup>log x</sup></span></p></div>
      <div class="card zrc" style="left:690px" data-at="2"><div class="n">2</div><div class="pic">log(10<sup>n</sup>) = <span class="good">n</span></div><p>The log of a power of 10<br>is just <span class="pri">the power</span></p></div>
      <div class="card zrc" style="left:1260px" data-at="3"><div class="n">3</div><div class="pic">−log(a × 10<sup>−n</sup>)</div><p>falls between<br><span class="good">n − 1 and n</span></p></div>`,
  })
})()
