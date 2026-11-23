// Pictures for chem-0.1 "Scientific Notation & Significant Figures". One EZ.scene per scene id in
// script.mjs. All numbers shown are the lesson's own (app/src/content/chem/u0.ts).
(() => {
  const { clamp, lerp, eio, eo } = EZ
  const css = document.createElement('style')
  css.textContent = `
    sub{font-size:.6em} sup{font-size:.6em;line-height:0}
    .dim{color:#5d647b} .tl{color:var(--accent)}
    .big{position:absolute;left:120px;width:1680px;text-align:center;font-weight:900}
    .rowc{position:absolute;left:120px;width:1680px;height:150px;border-radius:30px;background:rgba(36,40,56,.9);border:2px solid var(--line)}
    .rowc .a{position:absolute;left:44px;top:0;line-height:150px;font-size:70px;font-weight:900;white-space:nowrap}
    .rowc .m{position:absolute;left:640px;top:0;line-height:150px;font-size:60px;font-weight:900;color:var(--primary)}
    .rowc .b{position:absolute;left:760px;top:0;line-height:150px;font-size:70px;font-weight:900;white-space:nowrap}
    .rowc .d{position:absolute;right:44px;top:0;line-height:150px;font-size:34px;font-weight:800;color:var(--muted);white-space:nowrap}
    .pwr{position:absolute;top:760px;width:810px;height:150px;border-radius:30px;border:3px solid;display:flex;align-items:center;justify-content:center;font-size:48px;font-weight:900;white-space:nowrap}
    .srow{position:absolute;left:120px;width:1680px;height:104px;border-radius:24px;background:rgba(36,40,56,.9);border:2px solid var(--line)}
    .srow .n{position:absolute;left:22px;top:20px;width:64px;height:64px;border-radius:50%;background:var(--brand);font-size:38px;font-weight:900;line-height:64px;text-align:center}
    .srow .t{position:absolute;left:112px;top:0;line-height:104px;font-size:36px;font-weight:900;white-space:nowrap}
    .srow .e{position:absolute;left:1000px;top:0;line-height:104px;font-size:54px;font-weight:900;white-space:nowrap}
    .srow .c{position:absolute;right:40px;top:0;line-height:104px;font-size:44px;font-weight:900;white-space:nowrap}
    .pcard{position:absolute;top:290px;width:810px;height:230px;border-radius:30px;border:3px solid;text-align:center}
    .pcard b{display:block;margin-top:26px;font-size:50px;font-weight:900} .pcard span{display:block;margin-top:10px;font-size:38px;font-weight:800;color:var(--text)}
    .xex{position:absolute;left:120px;top:590px;width:1680px;height:290px;border-radius:30px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center}
    .xex .dg{position:absolute;left:0;right:0;top:60px;font-size:120px;font-weight:900;letter-spacing:6px}
    .xex .lb{position:absolute;left:0;right:0;top:215px;font-size:38px;font-weight:900}
    .ccard{position:absolute;top:290px;width:810px;height:470px;text-align:center}
    .ccard h3{font-size:72px;padding-top:26px}
    .ccard .r{font-size:40px;font-weight:900;margin-top:8px}
    .ccard .ex{position:absolute;left:0;right:0;top:210px;font-size:46px;font-weight:900;line-height:1.35}
    .ccard .ans{position:absolute;left:0;right:0;bottom:30px;font-size:52px;font-weight:900}
    .tile{position:absolute;top:360px;width:390px;height:220px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .tile .f{margin-top:58px;font-size:104px;font-weight:900;line-height:1}
    .tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .work{position:absolute;left:120px;top:650px;width:1680px;height:280px;text-align:center}
    .work .dg{position:absolute;left:0;right:0;top:10px;font-size:96px;font-weight:900;letter-spacing:6px}
    .work .lb{position:absolute;left:0;right:0;top:140px;font-size:36px;font-weight:900}
    .rc{top:320px;width:540px;height:580px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc .pic{height:190px;margin-top:20px;font-size:56px;font-weight:900;line-height:1.4;white-space:nowrap} .rc p{margin:14px 10px 0;font-size:34px;font-weight:800;line-height:1.3;white-space:nowrap}
  `
  document.head.appendChild(css)

  // ---------- intro artwork: faint numbers at the left and right edges ----------
  EZ.intro = {
    chips: [['1@0.3', 'Scientific notation'], ['1@0.6', 'Counting sig figs'], ['1@0.86', 'Rounding rules']],
    art: `<div style="position:absolute;left:36px;top:190px;font-size:84px;font-weight:900;color:#8d8df0;opacity:.12;white-space:nowrap">1.7 × 10<sup>6</sup></div>
      <div style="position:absolute;right:36px;top:190px;font-size:84px;font-weight:900;color:#3cc7bc;opacity:.12;white-space:nowrap">5.2 × 10<sup>−4</sup></div>
      <div style="position:absolute;left:36px;top:850px;font-size:84px;font-weight:900;color:#f3a764;opacity:.12">0.0045</div>
      <div style="position:absolute;right:36px;top:850px;font-size:84px;font-weight:900;color:#8d8df0;opacity:.12">2.500</div>`,
  }

  // ---------- hook ----------
  EZ.scene('hook', {
    html: `<div class="kicker" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="0">Huge numbers, honest measurements</h2>
      <div class="card" style="left:120px;top:310px;width:1680px;height:450px;text-align:center" data-at="0@0.1">
        <div style="margin-top:34px;font-size:34px;font-weight:800;color:var(--muted)">molecules in one drop of water</div>
        <div class="big" style="top:110px;left:0;width:1680px;font-size:70px;white-space:nowrap" data-at="0@0.3" data-fx="fade">1,700,000,000,000,000,000,000</div>
        <div class="big" style="top:290px;left:0;width:1680px;font-size:96px;color:var(--accent)" data-at="2" data-fx="pop">1.7 × 10<sup>21</sup></div>
        <div style="position:absolute;left:0;width:1680px;top:215px;text-align:center;font-size:44px;font-weight:900;color:var(--warm)" data-at="1" data-fx="pop">Nobody wants to write that twice!</div></div>
      <div class="chip" style="position:absolute;left:120px;top:790px;width:820px;height:110px;border-radius:26px;background:rgba(60,199,188,.14);border:3px solid rgba(60,199,188,.6);text-align:center;font-size:38px;font-weight:900;line-height:104px;white-space:nowrap" data-at="2" data-fx="pop"><span class="teal">Scientific notation</span> = big and tiny numbers</div>
      <div style="position:absolute;left:980px;top:790px;width:820px;height:110px;border-radius:26px;background:rgba(141,141,240,.14);border:3px solid rgba(141,141,240,.6);text-align:center;font-size:38px;font-weight:900;line-height:104px;white-space:nowrap" data-at="3" data-fx="pop"><span class="pri">Sig figs</span> = how precisely measured</div>`,
  })

  // ---------- scientific notation ----------
  EZ.scene('sci', {
    html: `<div class="kicker" data-at="in" data-fx="left">Scientific notation</div><h2 class="h1" data-at="0">One form for any number</h2>
      <div class="big" style="top:290px;font-size:72px" data-at="1" data-fx="pop"><span class="warm">(1 to 10)</span> × 10<sup class="pri">power</sup></div>
      <div class="rowc" style="top:420px" data-at="2" data-fx="right"><div class="a">1,700,000</div><div class="m">→</div><div class="b" data-at="2@0.5" data-fx="fade">1.7 × 10<sup>6</sup></div><div class="d" data-at="2@0.5" data-fx="fade">6 places left → positive</div></div>
      <div class="rowc" style="top:590px" data-at="3" data-fx="right"><div class="a">0.00052</div><div class="m">→</div><div class="b" data-at="3@0.5" data-fx="fade">5.2 × 10<sup>−4</sup></div><div class="d" data-at="3@0.5" data-fx="fade">4 places right → negative</div></div>
      <div class="pwr teal" style="left:120px;border-color:rgba(60,199,188,.7);background:rgba(60,199,188,.12)" data-at="4" data-fx="pop">Big numbers → positive power</div>
      <div class="pwr warm" style="left:990px;border-color:rgba(243,167,100,.7);background:rgba(243,167,100,.12)" data-at="4@0.5" data-fx="pop">Tiny numbers → negative power</div>`,
  })

  // ---------- which digits are significant ----------
  const T = (s) => `<span class="tl">${s}</span>`, D = (s) => `<span class="dim">${s}</span>`
  const ROWS = [
    ['Nonzero digits count', `${T('4.56')}`, '3'],
    ['Zeros between count', `${T('1.05')}`, '3'],
    ['Leading zeros never count', `${D('0.00')}${T('45')}`, '2'],
    ['Trailing zeros: need a decimal point', `${T('2.50')} <span class="muted" style="font-size:36px">and</span> ${T('2.500')}`, '3 and 4'],
    ['300 is ambiguous: use sci. notation', `${T('3.00 × 10<sup>2</sup>')}`, '3'],
  ]
  EZ.scene('sig', {
    html: `<div class="kicker" data-at="in" data-fx="left">Sig figs</div><h2 class="h1" data-at="0">Which digits are significant?</h2>
      ${ROWS.map(([t, e, n], i) => `<div class="srow" style="top:${290 + i * 114}px" data-at="${i + 1}" data-fx="right"><div class="n">${i + 1}</div><div class="t">${t}</div><div class="e" data-at="${i + 1}@0.35" data-fx="fade">${e}</div><div class="c good" data-at="${i + 1}@0.6" data-fx="pop">${n}</div></div>`).join('')}
      <div class="banner" style="top:880px;font-size:44px" data-at="6" data-fx="pop"><span class="gold">Exact numbers</span> (counted, or defined like 1 m = 100 cm): unlimited sig figs</div>`,
  })

  // ---------- Atlantic-Pacific trick ----------
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">The Atlantic–Pacific trick</h2>
      <div class="pcard pri" style="left:120px;border-color:rgba(141,141,240,.7);background:rgba(141,141,240,.12)" data-at="1" data-fx="pop"><b>Decimal point <u>P</u>resent</b><span>start from the <b style="display:inline;font-size:38px" class="pri">Pacific</b> (left)</span></div>
      <div class="pcard warm" style="left:990px;border-color:rgba(243,167,100,.7);background:rgba(243,167,100,.12)" data-at="2" data-fx="pop"><b>Decimal point <u>A</u>bsent</b><span>start from the <b style="display:inline;font-size:38px" class="warm">Atlantic</b> (right)</span></div>
      <div style="position:absolute;left:120px;top:540px;width:1680px;text-align:center;font-size:32px;font-weight:800;color:var(--muted)" data-at="1@0.5" data-fx="fade">at the first nonzero digit, then count everything after it</div>
      <div class="xex" data-at="3"><div class="dg" data-at="3@0.1" data-fx="fade">${D('0.00')}${T('340')}</div>
        <div class="lb" data-at="3@0.55" data-fx="fade"><span class="pri">Pacific</span> start at 3 → 3, 4, 0 = <span class="good">3 sig figs</span></div></div>`,
  })

  // ---------- calculations ----------
  EZ.scene('calc', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Calculations</div><h2 class="h1" data-at="0">Sig figs in calculations</h2>
      <div class="card ccard" style="left:120px" data-at="1"><h3 class="pri">× and ÷</h3><div class="r">fewest <span class="pri">sig figs</span></div>
        <div class="ex" data-at="2" data-fx="fade">3.5 cm × 2.25 cm<br>= 7.875</div><div class="ans" data-at="2@0.6" data-fx="pop"><span class="good">7.9 cm²</span> <span style="font-size:34px;color:var(--muted)">(2 sig figs)</span></div></div>
      <div class="card ccard" style="left:990px" data-at="3"><h3 class="teal">+ and −</h3><div class="r">fewest <span class="teal">decimal places</span></div>
        <div class="ex" data-at="4" data-fx="fade">12.11 g + 0.3 g<br>= 12.41</div><div class="ans" data-at="4@0.6" data-fx="pop"><span class="good">12.4 g</span> <span style="font-size:34px;color:var(--muted)">(1 decimal place)</span></div></div>
      <div class="banner" style="top:830px;font-size:44px" data-at="5" data-fx="pop">Keep extra digits while you calculate. <span class="warm">Round only the final answer.</span></div>`,
  })

  // ---------- the trap ----------
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Watch out</div><h2 class="h1" data-at="0">Your calculator doesn’t know your precision</h2>
      <div class="card" style="left:120px;top:320px;width:810px;height:420px;text-align:center" data-at="1">
        <div style="margin-top:34px;font-size:34px;font-weight:800;color:var(--muted)">calculator display</div>
        <div style="position:absolute;left:40px;right:40px;top:120px;height:130px;border-radius:20px;background:#0c0e15;border:2px solid var(--line);text-align:left;padding-left:34px;font-size:56px;font-weight:900;line-height:126px">3.5 × 2.25 = <span class="bad">7.875</span></div>
        <div style="position:absolute;left:0;right:0;top:290px;font-size:36px;font-weight:800;color:var(--muted)">shows every digit</div></div>
      <div class="card" style="left:990px;top:320px;width:810px;height:420px;text-align:center" data-at="2" data-fx="right">
        <div style="margin-top:34px;font-size:34px;font-weight:800;color:var(--muted)">written answer</div>
        <div style="position:absolute;left:0;right:0;top:100px;font-size:76px;font-weight:900" class="bad">7.875 cm²</div>
        <div style="position:absolute;left:0;right:0;top:205px;font-size:38px;font-weight:900" class="bad">claims precision you never measured</div>
        <div style="position:absolute;left:0;right:0;top:285px;font-size:76px;font-weight:900;opacity:0" class="good ok2">7.9 cm²</div></div>
      <div class="banner" style="top:810px;font-size:56px" data-at="3" data-fx="pop"><span class="warm">Round</span> the final answer!</div>`,
    update(c) {
      const p = eo(c.seg(c.b[3].start, c.b[3].start + 0.5)), el = c.$('.ok2')
      el.style.opacity = p; el.style.transform = `translateY(${(1 - p) * 20}px)`
    },
  })

  // ---------- try it ----------
  const OPTS = [['A', '3'], ['B', '4'], ['C', '6'], ['D', '7']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">How many <span class="teal">significant figures</span><br>are in 0.004050?</h2>
      ${OPTS.map(([l, f], i) => `<div class="tile t${i}" style="left:${120 + i * 430}px" data-at="1@${0.5 + i * 0.125}" data-fx="pop"><div class="l">${l}</div>
        ${i === 1 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        <div class="f">${f}</div></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="760" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="760" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 760)"/>
        <text class="num" x="960" y="786" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="890" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="card work" data-at="4-0.1">
        <div class="dg" data-at="4@0.05" data-fx="fade">${D('0.00')}${T('4050')}</div>
        <div class="lb" data-at="4@0.3" data-fx="fade"><span class="muted">leading zeros: placeholders</span> &nbsp;·&nbsp; <span class="tl">4, 0, 5, 0</span></div>
        <div class="lb" style="top:200px" data-at="5@0.1" data-fx="fade"><span class="warm">trailing zero counts: decimal point</span> &nbsp;=&nbsp; <span class="good">4 sig figs</span></div></div>`,
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
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div><div class="pic"><span class="warm">1.7 × 10<sup>6</sup></span><br><span class="teal">5.2 × 10<sup>−4</sup></span></div><p>Scientific notation:<br>(1 to 10) × 10<sup>n</sup><br><span class="teal">Small numbers → negative n</span></p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div><div class="pic">${D('0.00')}${T('4050')}</div><p><span class="warm">Leading zeros</span> never count<br>Trailing zeros count<br>only with a <span class="pri">decimal point</span></p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div><div class="pic">7.875 → <span class="good">7.9</span></div><p><span class="pri">× ÷ → fewest sig figs</span><br><span class="teal">+ − → fewest<br>decimal places</span></p></div>`,
  })
})()
