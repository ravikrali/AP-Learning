// Pictures for chem-0.5 "Balancing Chemical Equations". One EZ.scene per scene id in script.mjs.
// All facts shown are the lesson's own (app/src/content/chem/u0.ts and book.ts, lesson chem-0.5).
(() => {
  const { clamp, lerp, eio, eo, ball, sup } = EZ
  const css = document.createElement('style')
  css.textContent = `
    sub{font-size:.6em} sup{font-size:.6em;line-height:0}
    .tile{position:absolute;top:360px;width:390px;height:220px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .tile .f{margin-top:84px;font-size:62px;font-weight:900;line-height:1;white-space:nowrap}
    .tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .work{position:absolute;left:120px;top:650px;width:1680px;height:290px;text-align:center}
    .work .dg{position:absolute;left:0;right:0;top:10px;font-size:100px;font-weight:900}
    .work .lb{position:absolute;left:0;right:0;top:150px;font-size:40px;font-weight:900}
    .eq{position:absolute;left:0;width:1920px;text-align:center;font-size:96px;font-weight:900;white-space:nowrap}
    .mn{position:absolute;top:350px;width:390px;height:400px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .mn .big{margin-top:20px;font-size:150px;font-weight:900;line-height:1}
    .mn .w{font-size:46px;font-weight:900;margin-top:6px}
    .mn .d{font-size:28px;font-weight:800;margin:12px 20px 0;line-height:1.3;color:var(--muted)}
    .st{position:absolute;left:120px;width:1680px;height:96px;border-radius:24px;background:rgba(36,40,56,.92);border:3px solid var(--line);font-size:40px;font-weight:900;line-height:90px;padding-left:36px;white-space:nowrap}
    .rc{top:320px;width:540px;height:580px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc .pic{height:190px;margin-top:20px;font-size:56px;font-weight:900;line-height:1.4;white-space:nowrap} .rc p{margin:14px 10px 0;font-size:32px;font-weight:800;line-height:1.3;white-space:nowrap}
    .brick{position:absolute;width:150px;height:80px;border-radius:14px}
  `
  document.head.appendChild(css)

  // ---------- intro artwork: faint equations at the left and right edges ----------
  EZ.intro = {
    chips: [['1@0.3', 'The golden rule'], ['1@0.6', 'The MINO order'], ['1@0.86', 'Check every element']],
    art: `<div style="position:absolute;left:36px;top:190px;font-size:84px;font-weight:900;color:#f3a764;opacity:.12;white-space:nowrap">2H<sub>2</sub></div>
      <div style="position:absolute;right:36px;top:190px;font-size:84px;font-weight:900;color:#3cc7bc;opacity:.12;white-space:nowrap">2H<sub>2</sub>O</div>
      <div style="position:absolute;left:36px;top:850px;font-size:84px;font-weight:900;color:#8d8df0;opacity:.12;white-space:nowrap">4Al</div>
      <div style="position:absolute;right:36px;top:850px;font-size:84px;font-weight:900;color:#8d8df0;opacity:.12;white-space:nowrap">3O<sub>2</sub></div>`,
  }

  // ---------- hook: bricks rearranged ----------
  const BR = ['#f3a764', '#f3a764', '#3cc7bc', '#8d8df0', '#8d8df0', '#4cc781']
  const brickSet = (x0, y0, pos) => BR.map((c, i) => `<div class="brick" style="left:${x0 + pos[i][0]}px;top:${y0 + pos[i][1]}px;background:${c}"></div>`).join('')
  EZ.scene('hook', {
    html: `<div class="kicker" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="0">Atoms are never created or destroyed</h2>
      <div class="card" style="left:120px;top:320px;width:660px;height:360px;border-color:rgba(243,167,100,.6)" data-at="0" data-fx="pop">
        ${brickSet(100, 70, [[0, 0], [170, 0], [340, 0], [0, 100], [170, 100], [340, 100]])}
        <div style="position:absolute;left:0;right:0;top:290px;text-align:center;font-size:36px;font-weight:900" class="muted">before</div></div>
      <svg class="full" viewBox="0 0 1920 1080"><path d="M820 500 L1100 500" stroke="#8d8df0" stroke-width="10" stroke-linecap="round" fill="none" stroke-dasharray="400 500" data-at="1"/><path d="M1070 465 L1110 500 L1070 535" stroke="#8d8df0" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none" data-at="1@0.5"/></svg>
      <div class="card" style="left:1140px;top:320px;width:660px;height:360px;border-color:rgba(60,199,188,.6)" data-at="1" data-fx="pop">
        ${brickSet(100, 70, [[0, 0], [170, 100], [340, 0], [170, 0], [0, 100], [340, 100]])}
        <div style="position:absolute;left:0;right:0;top:290px;text-align:center;font-size:36px;font-weight:900" class="muted">after: same bricks, new shape</div></div>
      <div class="banner" style="top:790px;font-size:46px" data-at="2" data-fx="pop">A <span class="pri">balanced equation</span>: every brick accounted for</div>`,
  })

  // ---------- golden rule ----------
  EZ.scene('golden', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">The golden rule</div><h2 class="h1" data-at="0">Change only the coefficients</h2>
      <div class="card" style="left:120px;top:310px;width:810px;height:460px;text-align:center;border-color:rgba(76,199,129,.7)" data-at="1" data-fx="pop">
        <div style="margin-top:40px;font-size:44px;font-weight:900" class="good">Change: coefficients</div>
        <div style="margin-top:40px;font-size:130px;font-weight:900"><span class="warm" style="text-shadow:0 0 30px rgba(243,167,100,.8)">2</span>H<sub>2</sub>O</div>
        <div style="font-size:34px;font-weight:800;margin-top:16px" class="muted">the big numbers in front</div></div>
      <div class="card" style="left:990px;top:310px;width:810px;height:460px;text-align:center;border-color:rgba(239,98,98,.7)" data-at="2" data-fx="pop">
        <div style="margin-top:40px;font-size:44px;font-weight:900;color:#ef6262">Never change: subscripts</div>
        <div style="margin-top:40px;font-size:130px;font-weight:900">H<span class="warm" style="text-shadow:0 0 30px rgba(243,167,100,.8)"><sub>2</sub></span>O</div>
        <div style="font-size:34px;font-weight:800;margin-top:16px;color:#ef6262">changes the substance itself</div></div>
      <div class="banner" style="top:830px;font-size:48px" data-at="3" data-fx="pop">H<sub>2</sub>O<sub>2</sub> is <span class="warm">hydrogen peroxide</span>, not water!</div>`,
  })

  // ---------- check: unbalanced -> balanced ----------
  EZ.scene('check', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Balancing H<sub>2</sub> + O<sub>2</sub></div><h2 class="h1" data-at="0">From unbalanced to balanced</h2>
      <div class="eq" style="top:300px;font-size:90px" data-at="0" data-fx="fade"><span class="muted">H<sub>2</sub> + O<sub>2</sub> → H<sub>2</sub>O</span></div>
      <div class="muted" style="position:absolute;left:0;width:1920px;text-align:center;top:420px;font-size:38px;font-weight:900" data-at="0@0.5" data-fx="fade">not balanced</div>
      <div class="eq" style="top:520px;font-size:110px" data-at="1" data-fx="pop"><span class="warm" style="text-shadow:0 0 30px rgba(243,167,100,.7)">2</span>H<sub>2</sub> + O<sub>2</sub> → <span class="warm" style="text-shadow:0 0 30px rgba(243,167,100,.7)">2</span>H<sub>2</sub>O</div>
      <div class="card" style="left:360px;top:710px;width:620px;height:200px;text-align:center;border-color:rgba(243,167,100,.6)" data-at="2" data-fx="pop"><div style="margin-top:30px;font-size:64px;font-weight:900"><span class="warm">H</span> = 4 &nbsp;|&nbsp; 4</div><div style="font-size:30px;font-weight:800;margin-top:10px" class="muted">left | right</div></div>
      <div class="card" style="left:1000px;top:710px;width:620px;height:200px;text-align:center;border-color:rgba(60,199,188,.6)" data-at="2@0.5" data-fx="pop"><div style="margin-top:30px;font-size:64px;font-weight:900"><span class="teal">O</span> = 2 &nbsp;|&nbsp; 2</div><div style="font-size:30px;font-weight:800;margin-top:10px" class="muted">left | right</div></div>`,
  })

  // ---------- ratio ----------
  EZ.scene('ratio', {
    html: `<div class="kicker" data-at="in" data-fx="left">What the numbers mean</div><h2 class="h1" data-at="0">Coefficients are ratios of particles</h2>
      <div class="eq" style="top:290px;font-size:100px" data-at="0" data-fx="fade"><span class="warm">2</span>H<sub>2</sub> + <span class="teal">1</span>O<sub>2</sub> → <span class="pri">2</span>H<sub>2</sub>O</div>
      <div class="card" style="left:120px;top:470px;width:810px;height:200px;text-align:center;border-color:rgba(141,141,240,.6)" data-at="1" data-fx="pop"><div style="margin-top:34px;font-size:42px;font-weight:900"><span class="warm">2</span> molecules H<sub>2</sub> + <span class="teal">1</span> molecule O<sub>2</sub></div><div style="font-size:42px;font-weight:900;margin-top:10px">→ <span class="pri">2</span> molecules H<sub>2</sub>O</div></div>
      <div class="card" style="left:990px;top:470px;width:810px;height:200px;text-align:center;border-color:rgba(60,199,188,.6)" data-at="2" data-fx="pop"><div style="margin-top:34px;font-size:42px;font-weight:900"><span class="warm">2</span> mol H<sub>2</sub> + <span class="teal">1</span> mol O<sub>2</sub></div><div style="font-size:42px;font-weight:900;margin-top:10px">→ <span class="pri">2</span> mol H<sub>2</sub>O</div></div>
      <div class="card" style="left:290px;top:730px;width:1340px;height:200px;text-align:center;border-color:rgba(239,98,98,.7)" data-at="3" data-fx="pop"><div style="margin-top:34px;font-size:46px;font-weight:900" class="warm">Coefficients are NOT mass ratios</div><div style="font-size:42px;font-weight:900;margin-top:14px;color:#ef6262">2 g H<sub>2</sub> does not react with 1 g O<sub>2</sub></div></div>`,
  })

  // ---------- MINO ----------
  const MN = [
    ['M', 'Metals', '', 'rgba(243,167,100,.7)', '#f3a764', 2],
    ['I', 'Ions', 'polyatomic ions that appear on both sides as a unit', 'rgba(60,199,188,.7)', '#3cc7bc', 3],
    ['N', 'Nonmetals', 'other than H and O', 'rgba(141,141,240,.7)', '#8d8df0', 4],
    ['O', 'Oxygen & hydrogen', 'last', 'rgba(76,199,129,.7)', '#4cc781', 5],
  ]
  EZ.scene('mino', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Balancing order</div><h2 class="h1" data-at="0">The MINO order</h2>
      <div style="position:absolute;left:120px;top:272px;width:1680px;text-align:left;font-size:34px;font-weight:900" class="muted" data-at="1" data-fx="fade">balance in this order to avoid going in circles</div>
      ${MN.map(([l, w, d, b, col, at], i) => `<div class="mn" style="left:${120 + i * 430}px;border-color:${b}" data-at="${at}" data-fx="pop"><div class="big" style="color:${col}">${l}</div><div class="w">${w}</div><div class="d">${d}</div></div>`).join('')}
      <div class="banner" style="top:810px;font-size:44px" data-at="6" data-fx="pop">Finally: <span class="teal">check every element</span> and <span class="warm">reduce</span> common factors</div>`,
  })

  // ---------- propane ----------
  EZ.scene('propane', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Burning propane</div><h2 class="h1" data-at="0" style="font-size:56px">C<sub>3</sub>H<sub>8</sub> + O<sub>2</sub> → CO<sub>2</sub> + H<sub>2</sub>O</h2>
      <div class="st" style="top:290px;border-color:rgba(243,167,100,.6)" data-at="1" data-fx="pop"><span class="warm">Carbon:</span> 3 on the left → <span class="warm">3</span> CO<sub>2</sub></div>
      <div class="st" style="top:410px;border-color:rgba(60,199,188,.6)" data-at="2" data-fx="pop"><span class="teal">Hydrogen:</span> 8 on the left → <span class="teal">4</span> H<sub>2</sub>O &nbsp;<span class="muted">(4 × 2 = 8)</span></div>
      <div class="st" style="top:530px;border-color:rgba(141,141,240,.6)" data-at="3" data-fx="pop"><span class="pri">Oxygen on the right:</span> 3 × 2 + 4 × 1 = 10 O atoms</div>
      <div class="st" style="top:650px;border-color:rgba(141,141,240,.6)" data-at="4" data-fx="pop">so you need <span class="pri">5</span> O<sub>2</sub> on the left</div>
      <div class="card" style="left:120px;top:790px;width:1680px;height:140px;text-align:center;font-size:76px;font-weight:900;line-height:136px;border-color:rgba(76,199,129,.7)" data-at="5" data-fx="pop">C<sub>3</sub>H<sub>8</sub> + <span class="warm">5</span>O<sub>2</sub> → <span class="warm">3</span>CO<sub>2</sub> + <span class="warm">4</span>H<sub>2</sub>O</div>`,
  })

  // ---------- fractions ----------
  EZ.scene('frac', {
    html: `<div class="kicker" data-at="in" data-fx="left">A useful step</div><h2 class="h1" data-at="0">Fractions can help along the way</h2>
      <div class="eq" style="top:330px;font-size:84px" data-at="1" data-fx="pop">C<sub>2</sub>H<sub>6</sub> + <span class="warm">7/2</span> O<sub>2</sub> → 2CO<sub>2</sub> + 3H<sub>2</sub>O</div>
      <div class="muted" style="position:absolute;left:0;width:1920px;text-align:center;top:450px;font-size:38px;font-weight:900" data-at="1@0.4" data-fx="fade">7 O atoms on the right, so 7/2 O<sub>2</sub></div>
      <div class="banner" style="top:560px;font-size:46px" data-at="2" data-fx="pop">Multiply every coefficient by <span class="warm">2</span></div>
      <div class="eq" style="top:720px;font-size:84px" data-at="2@0.5" data-fx="pop"><span class="good">2C<sub>2</sub>H<sub>6</sub> + 7O<sub>2</sub> → 4CO<sub>2</sub> + 6H<sub>2</sub>O</span></div>
      <div class="muted" style="position:absolute;left:0;width:1920px;text-align:center;top:850px;font-size:38px;font-weight:900" data-at="2@0.8" data-fx="fade">final equations use the smallest whole numbers</div>`,
  })

  // ---------- trap ----------
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Watch out</div><h2 class="h1" data-at="0">Count atoms inside parentheses</h2>
      <div class="card" style="left:120px;top:310px;width:810px;height:440px;text-align:center;border-color:rgba(243,167,100,.7)" data-at="2" data-fx="pop">
        <div style="margin-top:46px;font-size:120px;font-weight:900">Ca(OH)<sub>2</sub></div>
        <div style="margin-top:34px;font-size:54px;font-weight:900"><span class="pri">1</span> Ca &nbsp;·&nbsp; <span class="warm">2</span> O &nbsp;·&nbsp; <span class="teal">2</span> H</div></div>
      <div class="card" style="left:990px;top:310px;width:810px;height:440px;text-align:center;border-color:rgba(60,199,188,.7)" data-at="3" data-fx="pop">
        <div style="margin-top:46px;font-size:120px;font-weight:900"><span class="warm">3</span>Ca(OH)<sub>2</sub></div>
        <div style="margin-top:34px;font-size:54px;font-weight:900"><span class="pri">3</span> Ca &nbsp;·&nbsp; <span class="warm">6</span> O &nbsp;·&nbsp; <span class="teal">6</span> H</div></div>
      <div class="banner" style="top:830px;font-size:44px" data-at="1" data-fx="pop">The subscript outside <span class="pri">( )</span> multiplies everything inside</div>`,
  })

  // ---------- try it ----------
  const OPTS = [['A', '1, 1, 1'], ['B', '2, 3, 1'], ['C', '4, 3, 2'], ['D', '2, 1, 1']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">Which coefficients balance<br><span class="teal">Al + O<sub>2</sub> → Al<sub>2</sub>O<sub>3</sub></span> ?</h2>
      ${OPTS.map(([l, f], i) => `<div class="tile t${i}" style="left:${120 + i * 430}px" data-at="1@${0.5 + i * 0.125}" data-fx="pop"><div class="l">${l}</div>
        ${i === 2 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        <div class="f">${f}</div></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="760" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="760" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 760)"/>
        <text class="num" x="960" y="786" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="890" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="card work" data-at="4-0.1">
        <div class="dg" data-at="4@0.05" data-fx="fade"><span class="good">4Al + 3O<sub>2</sub> → 2Al<sub>2</sub>O<sub>3</sub></span></div>
        <div class="lb" data-at="4@0.5" data-fx="fade"><span class="warm">O: 2 and 3</span> &nbsp;→&nbsp; <span class="teal">lowest common multiple = 6</span></div>
        <div class="lb" style="top:210px" data-at="5@0.1" data-fx="fade"><span class="teal">3 O<sub>2</sub> and 2 Al<sub>2</sub>O<sub>3</sub></span> &nbsp;→&nbsp; <span class="warm">4 Al</span></div></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.5, b[3].start + 0.95))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 2) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div><div class="pic" style="font-size:64px"><span class="warm">2</span>H<sub>2</sub>O<br><span style="font-size:40px" class="teal">change the big numbers</span></div><p>Only change coefficients,<br>never subscripts.</p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div><div class="pic" style="font-size:96px"><span class="warm">M</span><span class="teal">I</span><span class="pri">N</span><span class="good">O</span></div><p>Metals, ions, nonmetals,<br>then O and H last.</p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div><div class="pic" style="font-size:60px">H = 4 | 4<br><span style="font-size:48px" class="teal">O = 2 | 2</span></div><p>Always do a final count<br>of every element.</p></div>`,
  })
})()
