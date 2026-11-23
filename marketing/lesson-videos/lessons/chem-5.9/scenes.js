// Pictures for chem-5.9 "Pre-Equilibrium Approximation". One EZ.scene per scene id in script.mjs.
// Every equation shown is the lesson's own (app/src/content/chem/u5.ts): the 2NO + O2 example, its
// derivation (also in book.ts) and the NO + Br2 try question. The balls in the hook and in the
// "idea" scene are schematic species, not real molecules.
(() => {
  const { clamp, lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .p9-eq{position:absolute;left:120px;height:90px;display:flex;align-items:center;gap:34px;font-size:56px;font-weight:900;white-space:nowrap}
    .p9-lab{display:inline-block;width:190px;font-size:28px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
    .p9-s{position:relative;display:inline-block}
    .p9-op{color:var(--muted)}
    .p9-x{position:absolute;left:-8px;right:-8px;top:50%;height:7px;margin-top:-2px;border-radius:4px;background:var(--bad)}
    .p9-ring{position:absolute;left:-14px;right:-14px;top:-8px;bottom:-8px;border:5px solid;border-radius:20px}
    .p9-tag{display:inline-block;padding:6px 20px;border-radius:16px;font-size:28px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;border:2px solid}
    .p9-chip{position:absolute;height:72px;padding:0 26px;border-radius:20px;background:rgba(255,255,255,.05);border:2px solid var(--line);font-size:34px;font-weight:800;line-height:68px;white-space:nowrap}
    .p9-chip svg{display:inline-block;width:44px;height:44px;vertical-align:middle;margin:-6px 14px 0 0}
    .p9-note{position:absolute;padding:20px 30px 22px 34px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line);border-left-width:10px}
    .p9-note b{display:block;font-size:40px;font-weight:900;line-height:1.15;white-space:nowrap} .p9-note > span{display:block;margin-top:8px;font-size:30px;font-weight:700;color:var(--muted);line-height:1.3;white-space:nowrap}
    .p9-alg{position:absolute;left:40px;height:90px;font-size:54px;font-weight:900;line-height:90px;white-space:nowrap}
    .p9-steps{position:absolute;left:120px;top:290px;width:1680px;height:190px;padding:20px 44px}
    .p9-steps > div{position:relative;height:74px;font-size:44px;font-weight:900;white-space:nowrap;display:flex;align-items:center;gap:30px}
    .p9-steps .p9-lab{width:420px;font-size:24px}
    .p9-tile{position:absolute;top:520px;width:390px;height:170px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .p9-tile .l{position:absolute;left:18px;top:14px;width:52px;height:52px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:28px;font-weight:900;line-height:48px;color:var(--muted)}
    .p9-tile .r{margin-top:30px;font-size:30px;font-weight:800;color:var(--muted)}
    .p9-tile .f{margin-top:8px;font-size:42px;font-weight:900;line-height:1.1;white-space:nowrap}
    .p9-tile .ok{position:absolute;right:16px;top:12px;width:56px;height:56px} .p9-tile .ok svg{display:block;width:100%;height:100%}
    .p9-why{position:absolute;left:120px;width:1680px;height:84px;border-radius:24px;background:rgba(60,199,188,.1);border:2px solid rgba(60,199,188,.6);font-size:40px;font-weight:800;line-height:80px;text-align:center;white-space:nowrap}
    .p9-rc{top:320px;width:540px;height:580px;text-align:center} .p9-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .p9-rc svg{display:block;margin:14px auto 0} .p9-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.32;white-space:nowrap}
  `
  document.head.appendChild(css)

  const CHECK = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const CROSS = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#f0707a"/><path d="M21 21l22 22M43 21L21 43" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round"/></svg>'
  const TEAL = '#3cc7bc', WARM = '#f3a764', BAD = '#f0707a'
  // one species in an equation row; x = when it is struck out, r = when it is ringed (with colour rc)
  const S = (h, o = {}) => `<span class="p9-s">${h}${o.x ? `<i class="p9-x" data-at="${o.x}" data-fx="grow"></i>` : ''}${o.r ? `<i class="p9-ring" style="border-color:${o.rc}" data-at="${o.r}" data-fx="pop"></i>` : ''}</span>`
  const P = '<span class="p9-op">+</span>', A = '<span class="p9-op">→</span>', EQ = '<span class="p9-op">⇌</span>'
  const sb = (n) => `<sub>${n}</sub>`, sp = (n) => `<sup>${n}</sup>`
  const N2O2 = `N${sb(2)}O${sb(2)}`, O2 = `O${sb(2)}`, NO2 = `NO${sb(2)}`
  const k1 = `k${sb(1)}`, km1 = `k${sb('−1')}`, k2 = `k${sb(2)}`
  // SVG text with a lowered part
  // (a lowered tspan drops .2em of the parent size; `back` raises the text after it again)
  const lo = (base, s) => `${base}<tspan dy=".32em" font-size=".62em">${s}</tspan>`
  const back = (t) => `<tspan dy="-.2em">${t}</tspan>`

  // ---------- intro artwork: faint fast ⇌ arrows on the left, a slow → on the right ----------
  const dbl = (x, y) => `<g transform="translate(${x} ${y})"><line x1="0" y1="-14" x2="110" y2="-14" stroke="#8d8df0" stroke-width="8" marker-end="url(#mk-pri)"/><line x1="110" y1="14" x2="0" y2="14" stroke="#8d8df0" stroke-width="8" marker-end="url(#mk-pri)"/></g>`
  EZ.intro = {
    chips: [['1@0.3', 'Fast equilibrium'], ['1@0.55', 'Slow step'], ['1@0.8', 'Substitute']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">
      <g class="p9-il">${[260, 350, 680, 770].map((y) => dbl(24, y)).join('')}<text x="89" y="900" text-anchor="middle" font-size="40" font-weight="900" class="f-pri">fast</text></g>
      <g class="p9-ir"><line x1="1845" y1="640" x2="1845" y2="840" stroke="#f3a764" stroke-width="10" marker-end="url(#mk-warm)"/><text x="1830" y="900" text-anchor="middle" font-size="40" font-weight="900" class="f-warm">slow</text></g></svg>`,
    update(c) {
      const p = eio(c.seg(c.sc.start + 0.2, c.sc.start + 2.4))
      c.$('.p9-il').setAttribute('transform', `translate(${lerp(-40, 0, p)} 0)`)
      c.$('.p9-ir').setAttribute('transform', `translate(0 ${lerp(-60, 0, p)})`)
    },
  }

  // ---------- hook: the slow step needs an intermediate ----------
  const mini = (x, y, g, r = 34) => ball(x, y, r, g)
  const dot = (g) => `<svg width="46" height="46" viewBox="-23 -23 46 46" style="vertical-align:middle;margin:-8px 16px 0">${ball(0, 0, 20, g)}</svg>`
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">The puzzle</div><h2 class="h1" data-at="0">The slow step comes second</h2>
      <div class="card" style="left:120px;top:290px;width:880px;height:380px" data-at="1"><h3 style="font-size:36px">The mechanism</h3>
        <svg style="position:absolute;left:0;top:90px" width="880" height="290" viewBox="0 0 880 290">
          <g data-at="1@0.15" data-fx="fade"><text x="40" y="70" font-size="26" font-weight="900" class="f-muted" style="letter-spacing:.1em">STEP 1</text>
            <text x="40" y="104" font-size="26" font-weight="900" class="f-teal">fast</text>
            ${mini(250, 76, 'pur')}<text x="305" y="90" text-anchor="middle" font-size="40" font-weight="900" class="f-muted">+</text>${mini(360, 76, 'pur')}
            <text x="460" y="92" text-anchor="middle" font-size="52" font-weight="900" class="f-muted">⇌</text>
            ${mini(570, 76, 'teal')}</g>
          <g data-at="1@0.45" data-fx="fade"><text x="40" y="200" font-size="26" font-weight="900" class="f-muted" style="letter-spacing:.1em">STEP 2</text>
            <text x="40" y="234" font-size="26" font-weight="900" class="f-warm">slow</text>
            ${mini(250, 206, 'teal')}<text x="305" y="220" text-anchor="middle" font-size="40" font-weight="900" class="f-muted">+</text>${mini(360, 206, 'warm')}
            <text x="460" y="222" text-anchor="middle" font-size="52" font-weight="900" class="f-muted">→</text>
            ${mini(570, 206, 'gold')}</g>
          <g data-at="1@0.75" data-fx="fade"><path d="M600 116 C 600 150, 320 128, 262 162" fill="none" stroke="${TEAL}" stroke-width="5" stroke-dasharray="12 10" marker-end="url(#mk-teal)"/>
            <text x="640" y="86" font-size="30" font-weight="900" class="f-teal">intermediate</text></g>
        </svg></div>
      <div class="card" style="left:1060px;top:290px;width:740px;height:380px" data-at="2"><h3 style="font-size:36px">The slow step <span class="warm">sets the rate</span></h3>
        <div style="position:absolute;left:40px;top:130px;font-size:56px;font-weight:900;white-space:nowrap">rate = k<span class="p9-s" style="margin:0 16px">[${dot('teal')}]<i class="p9-ring" style="border-color:${BAD}" data-at="3@0.3" data-fx="pop"></i></span>[${dot('warm')}]</div>
        <div style="position:absolute;left:40px;top:250px;font-size:34px;font-weight:900" class="bad" data-at="3@0.5" data-fx="fade">contains the intermediate!</div></div>
      <div class="p9-chip" style="left:1060px;top:700px;border-color:rgba(240,112,122,.6)" data-at="4" data-fx="pop">${CROSS}<span class="bad">never</span>&nbsp;in a final rate law</div>
      <div class="p9-note" style="left:120px;top:700px;width:880px;height:130px;border-left-color:var(--accent)" data-at="5" data-fx="up"><b>Intermediates exist <span class="teal">only briefly</span></b><span data-at="6" data-fx="fade">can’t be controlled or measured as starting conditions</span></div>
      <div class="banner" style="top:860px;padding:16px 40px;font-size:42px" data-at="7" data-fx="pop">Rate laws use what you can <span class="teal">set and measure</span>: reactants <span class="muted" style="font-size:34px">(sometimes a catalyst)</span></div>`,
  })

  // ---------- the idea: a fast back-and-forth step stays at equilibrium ----------
  const SLOTS = [[260, 420], [470, 420], [680, 420], [260, 600], [470, 600], [680, 600]]
  const pairG = (i) => `<g transform="translate(${SLOTS[i][0]} ${SLOTS[i][1]})"><g class="p9-sep${i}">${ball(0, 0, 30, 'pur')}</g><g class="p9-sep${i}b">${ball(0, 0, 30, 'pur')}</g>
    <g class="p9-dim${i}"><ellipse rx="78" ry="46" fill="none" stroke="${TEAL}" stroke-width="5"/>${ball(-26, 0, 30, 'teal')}${ball(26, 0, 30, 'teal')}</g></g>`
  EZ.scene('idea', {
    html: `<div class="kicker" data-at="in" data-fx="left">The idea</div><h2 class="h1" data-at="0">A fast step before a slow step</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1" data-fx="fade"><rect x="120" y="300" width="900" height="420" rx="32" fill="rgba(36,40,56,.92)" stroke="#8d8df0" stroke-width="3"/>
          <text x="160" y="356" font-size="34" font-weight="900" class="f-pri">Step 1: fast, reversible</text>
          ${SLOTS.map((_, i) => pairG(i)).join('')}</g>
        <g data-at="1@0.4" data-fx="fade"><rect x="1300" y="300" width="500" height="420" rx="32" fill="rgba(36,40,56,.92)" stroke="#f3a764" stroke-width="3"/>
          <text x="1340" y="356" font-size="34" font-weight="900" class="f-warm">Step 2: slow</text>
          <line x1="1040" y1="510" x2="1280" y2="510" stroke="#f3a764" stroke-width="6" stroke-dasharray="14 12" marker-end="url(#mk-warm)"/></g>
        <g class="p9-mig"><ellipse rx="78" ry="46" fill="none" stroke="${TEAL}" stroke-width="5"/>${ball(-26, 0, 30, 'teal')}${ball(26, 0, 30, 'teal')}</g>
        <g data-at="5" data-fx="fade"><text x="570" y="690" text-anchor="middle" font-size="40" font-weight="900" class="f-teal">at equilibrium</text></g>
      </svg>
      <div class="p9-note" style="left:120px;top:750px;width:900px;height:130px;border-left-color:var(--primary)" data-at="2" data-fx="up"><b>goes <span class="pri">back and forth</span> much faster</b><span>than the slow step uses up its product</span></div>
      <div class="p9-note" style="left:1300px;top:740px;width:500px;height:150px;border-left-color:var(--accent)" data-at="3@0.4" data-fx="up"><b style="font-size:34px">most falls apart</b><span>before it can react</span></div>
      <div style="position:absolute;left:1340px;top:620px;width:440px;font-size:30px;font-weight:800;line-height:1.25" class="warm" data-at="4@0.3" data-fx="fade">a little drawn off:<br>balance hardly disturbed</div>
      <div class="banner" style="top:910px;padding:14px 40px;font-size:42px" data-at="5" data-fx="pop">Treat step 1 as <span class="teal">at equilibrium</span><span data-at="6" data-fx="fade">: the <span class="gold">pre-equilibrium approximation</span></span></div>`,
    update(c) {
      const b = c.b, stop = b[5].start
      const tt = Math.min(c.t, stop)
      const speed = c.seg(b[1].start, b[1].start + 1.0)
      for (let i = 0; i < SLOTS.length; i++) {
        // fast flipping between "split" and "joined" while the idea is explained; then it settles
        const raw = 0.5 + 0.5 * Math.sin(tt * 4.2 + i * 1.7)
        const settled = i % 2 ? 1 : 0
        const blend = c.seg(stop, stop + 0.6)
        const j = lerp(speed ? clamp((raw - 0.3) / 0.4) : settled, settled, blend)
        const s = lerp(30, 56, 1 - j)
        c.$('.p9-sep' + i).setAttribute('transform', `translate(${-s} 0)`)
        c.$('.p9-sep' + i + 'b').setAttribute('transform', `translate(${s} 0)`)
        c.$('.p9-sep' + i).style.opacity = 1 - j; c.$('.p9-sep' + i + 'b').style.opacity = 1 - j
        c.$('.p9-dim' + i).style.opacity = j
      }
      // one joined pair slowly drawn off into the slow step
      const m = eio(c.seg(b[4].start + 0.2, b[4].end + 0.4))
      const mig = c.$('.p9-mig')
      mig.setAttribute('transform', `translate(${lerp(890, 1550, m)} ${lerp(510, 510, m)}) scale(.8)`)
      mig.style.opacity = c.seg(b[4].start, b[4].start + 0.3)
    },
  })

  // ---------- the example: 2NO + O2 ----------
  EZ.scene('example', {
    html: `<div class="kicker" data-at="in" data-fx="left">Worked example</div>
      <h2 class="h1" data-at="0"><span class="muted" style="font-size:44px">Overall:</span> 2NO + ${O2} ${ARR} 2${NO2}</h2>
      <div class="p9-eq" style="top:300px" data-at="1"><span class="p9-lab">Step 1</span>${S('2NO')}${EQ}${S(`<span class="teal">${N2O2}</span>`, { r: '4@0.3', rc: TEAL })}<span class="p9-tag teal" style="border-color:rgba(60,199,188,.6);margin-left:20px">fast, reversible</span></div>
      <div class="p9-eq" style="top:400px" data-at="2"><span class="p9-lab">Step 2</span>${S(`<span class="teal">${N2O2}</span>`, { r: '4@0.5', rc: TEAL })}${P}${S(O2)}${A}${S(`2${NO2}`)}<span class="p9-tag warm" style="border-color:rgba(243,167,100,.6);margin-left:20px">slow</span></div>
      <div class="card" style="left:120px;top:540px;width:1000px;height:200px" data-at="3"><h3 style="font-size:32px" class="muted">Slow-step rate law</h3>
        <div style="position:absolute;left:40px;top:90px;font-size:60px;font-weight:900;white-space:nowrap">rate = ${k2}<span class="p9-s" style="margin:0 16px">[<span class="teal">${N2O2}</span>]<i class="p9-ring" style="border-color:${TEAL}" data-at="4@0.7" data-fx="pop"></i><i class="p9-x" data-at="5" data-fx="grow"></i></span>[${O2}]</div></div>
      <div class="p9-note" style="left:1170px;top:540px;width:630px;height:200px;border-left-color:var(--accent)" data-at="4" data-fx="right"><b><span class="teal">${N2O2}</span> = intermediate</b><span>made in step 1, used in step 2</span></div>
      <div class="p9-chip" style="left:120px;top:790px;border-color:rgba(240,112,122,.6)" data-at="5@0.2" data-fx="pop">${CROSS}<span class="bad">can’t stay</span>&nbsp; ${ARR}&nbsp; replace it</div>`,
  })

  // ---------- the derivation ----------
  EZ.scene('derive', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">The substitution</div><h2 class="h1" data-at="0">Replace the intermediate</h2>
      <div class="card" style="left:120px;top:290px;width:1060px;height:640px" data-at="1">
        <div class="p9-alg" style="top:30px" data-at="2"><span class="p9-lab" style="width:250px">Step 1</span>${k1}[NO]${sp(2)} = ${km1}[<span class="teal">${N2O2}</span>]</div>
        <div class="p9-alg" style="top:140px" data-at="3"><span class="p9-lab" style="width:250px">Solve</span><span class="p9-s" style="padding:0 12px">[<span class="teal">${N2O2}</span>] = (${k1}/${km1})[NO]${sp(2)}<i class="p9-ring" style="border-color:${TEAL}" data-at="3@0.6" data-fx="pop"></i></span></div>
        <div style="position:absolute;left:40px;right:40px;top:262px;height:4px;border-radius:2px;background:#4a5070" data-at="4" data-fx="grow"></div>
        <div class="p9-alg" style="top:290px" data-at="4" data-out="5"><span class="p9-lab" style="width:250px">Slow step</span>rate = ${k2}[<span class="teal">${N2O2}</span>][${O2}]</div>
        <div class="p9-alg" style="top:290px" data-at="5+0.35" data-fx="fade"><span class="p9-lab" style="width:250px">Substitute</span>rate = ${k2}<span class="teal">(${k1}/${km1})[NO]${sp(2)}</span>[${O2}]</div>
        <div class="p9-alg" style="top:410px;left:30px;right:30px;height:120px;line-height:120px;text-align:center;font-size:66px;border-radius:26px;background:linear-gradient(90deg,rgba(91,91,214,.5),rgba(60,199,188,.32));border:2px solid rgba(141,141,240,.7)" data-at="7" data-fx="pop">rate = k[NO]${sp(2)}[${O2}]</div>
      </div>
      <div class="p9-note" style="left:1230px;top:290px;width:570px;height:140px;border-left-color:var(--primary)" data-at="1" data-fx="right"><b style="font-size:36px">At equilibrium</b><span>forward rate = reverse rate</span></div>
      <div class="p9-note" style="left:1230px;top:450px;width:570px;height:140px;border-left-color:var(--gold)" data-at="6" data-fx="right"><b style="font-size:36px">Combine constants</b><span>k = ${k2}${k1}/${km1}</span></div>
      <div class="p9-note" style="left:1230px;top:610px;width:570px;height:140px;border-left-color:var(--good)" data-at="8" data-fx="right"><b style="font-size:36px" class="good">No intermediate</b><span style="font-size:27px">only species from the overall reaction</span></div>
      <div class="p9-note" style="left:1230px;top:770px;width:570px;height:160px;border-left-color:var(--warm)" data-at="9" data-fx="right"><b style="font-size:36px" class="warm">Third order overall</b><span>yet no step has three<br>molecules colliding at once</span></div>`,
  })

  // ---------- shortcut ----------
  const NO = (x, y) => ball(x, y, 46, 'pur', 'NO', 30)
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Shortcut</div><h2 class="h1" data-at="0">Count back to the start</h2>
      <div class="p9-chip" style="left:120px;top:290px;border-color:rgba(242,196,67,.6)" data-at="1" data-fx="pop">all the reactants that made the slow step’s species, <span class="gold">counted from the start</span></div>
      <div class="card" style="left:120px;top:400px;width:1680px;height:360px" data-at="2"><h3 style="font-size:34px" class="muted">The slow step needs</h3>
        <svg style="position:absolute;left:0;top:80px" width="1680" height="280" viewBox="0 0 1680 280">
          <g class="p9-pk"><rect x="80" y="60" width="300" height="140" rx="30" fill="rgba(60,199,188,.14)" stroke="${TEAL}" stroke-width="5"/>
            <text x="230" y="146" text-anchor="middle" font-size="52" font-weight="900" class="f-teal">${lo('N', '2')}${back('O')}${lo('', '2')}</text></g>
          <g class="p9-un"><g class="p9-u1">${NO(0, 0)}</g><g class="p9-u2">${NO(0, 0)}</g>
            <text x="230" y="250" text-anchor="middle" font-size="32" font-weight="900" class="f-pri">made from 2NO</text></g>
          <text x="470" y="148" text-anchor="middle" font-size="60" font-weight="900" class="f-muted">+</text>
          ${ball(580, 130, 50, 'warm', lo('O', '2'), 32)}
          <g data-at="4" data-fx="fade"><text x="760" y="148" font-size="60" font-weight="900" class="f-muted">→</text>
            <text x="850" y="150" font-size="64" font-weight="900">rate = k[NO]<tspan dy="-.5em" font-size=".62em">2</tspan><tspan dy=".31em">[</tspan>${lo('O', '2')}${back(']')}</text>
            <text x="850" y="230" font-size="30" font-weight="800" class="f-muted">2 NO and 1 O<tspan dy=".32em" font-size=".62em">2</tspan></text></g>
        </svg></div>
      <div class="p9-chip" style="left:120px;top:800px;height:100px;line-height:96px;font-size:40px;border-color:rgba(243,167,100,.7);background:rgba(243,167,100,.1)" data-at="5" data-fx="pop"><span class="warm">On FRQs:</span>&nbsp; still write out the substitution for full credit</div>`,
    update(c) {
      const b = c.b, p = eio(c.seg(b[3].start + 0.3, b[3].start + 1.2))
      c.$('.p9-pk').style.opacity = 1 - clamp(p / 0.45)
      c.$('.p9-un').style.opacity = clamp((p - 0.45) / 0.55)
      c.$('.p9-u1').setAttribute('transform', `translate(${lerp(200, 160, p)} 130)`)
      c.$('.p9-u2').setAttribute('transform', `translate(${lerp(260, 300, p)} 130)`)
    },
  })

  // ---------- try it ----------
  const NOBr2 = `NOBr${sb(2)}`, Br2 = `Br${sb(2)}`
  const OPTS = [['A', `k[${NOBr2}][NO]`], ['B', `k[NO][${Br2}]`], ['C', `k[NO]${sp(2)}[${Br2}]`], ['D', `k[NO]${sp(2)}`]]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="2">What <span class="teal">rate law</span> does this predict?</h2>
      <div class="card p9-steps" data-at="1">
        <div data-at="1@0.02" data-fx="fade"><span class="p9-lab">Step 1 · fast, reversible</span>${S('NO')}${P}${S(Br2)}${EQ}${S(`<span class="teal">${NOBr2}</span>`, { r: '6@0.3', rc: TEAL })}</div>
        <div data-at="1@0.5" data-fx="fade"><span class="p9-lab">Step 2 · slow</span>${S(`<span class="teal">${NOBr2}</span>`, { r: '5@0.4', rc: TEAL })}${P}${S('NO')}${A}${S('2NOBr')}</div>
      </div>
      ${OPTS.map(([l, f], i) => `<div class="p9-tile t${i}" style="left:${120 + i * 430}px" data-at="2@${0.2 + i * 0.12}" data-fx="pop"><div class="l">${l}</div>
        ${i === 2 ? `<div class="ok">${CHECK}</div>` : ''}<div class="r">rate =</div><div class="f">${f}</div></div>`).join('')}
      <svg class="full p9-count" viewBox="0 0 1920 1080"><circle cx="960" cy="830" r="70" fill="none" stroke="#363c54" stroke-width="12"/><circle class="p9-arc" cx="960" cy="830" r="70" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 830)"/>
        <text class="p9-num" x="960" y="856" text-anchor="middle" font-size="72" font-weight="900">3</text><text x="960" y="940" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="p9-why" style="top:740px" data-at="5" data-fx="up">Slow step: rate = ${k2}[<span class="teal">${NOBr2}</span>][NO]</div>
      <div class="p9-why" style="top:840px" data-at="6" data-fx="up">[<span class="teal">${NOBr2}</span>] = K[NO][${Br2}] &nbsp;${ARR}&nbsp; rate = k[NO]${sp(2)}[${Br2}]</div>`,
    update(c) {
      const b = c.b, t0 = b[3].start + 0.3, t1 = b[4].start - 0.25, p = c.seg(t0, t1)
      c.$('.p9-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.p9-arc').setAttribute('stroke-dashoffset', p)
      c.$('.p9-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[4].start + 0.4, b[4].start + 0.9))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 2) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="190" viewBox="0 0 460 190">
    <text x="20" y="56" font-size="24" font-weight="900" class="f-teal">FAST</text>${ball(150, 46, 22, 'pur')}${ball(200, 46, 22, 'pur')}<text x="262" y="60" text-anchor="middle" font-size="40" font-weight="900" class="f-muted">⇌</text>${ball(320, 46, 22, 'teal')}${ball(360, 46, 22, 'teal')}
    <text x="20" y="136" font-size="24" font-weight="900" class="f-warm">SLOW</text>${ball(150, 126, 22, 'teal')}${ball(200, 126, 22, 'warm')}<text x="262" y="140" text-anchor="middle" font-size="40" font-weight="900" class="f-muted">→</text>${ball(330, 126, 22, 'gold')}
    <text x="230" y="184" text-anchor="middle" font-size="26" font-weight="900" class="f-teal">step 1 at equilibrium</text></svg>`
  const r2 = `<svg width="460" height="190" viewBox="0 0 460 190">
    <text x="230" y="60" text-anchor="middle" font-size="34" font-weight="900">${lo('k', 'forward')}${back('[…] = k')}<tspan dy=".32em" font-size=".62em">reverse</tspan>${back('[')}<tspan class="f-teal">●</tspan>]</text>
    <line x1="230" y1="80" x2="230" y2="120" stroke="#8d8df0" stroke-width="5" marker-end="url(#mk-pri)"/>
    <text x="230" y="168" text-anchor="middle" font-size="34" font-weight="900">rate = k[ <tspan class="f-pri">…</tspan> ]</text></svg>`
  const r3 = `<svg width="460" height="190" viewBox="0 0 460 190">
    <text x="60" y="110" font-size="44" font-weight="900">rate = k[</text>${ball(272, 96, 26, 'teal')}<text x="302" y="110" font-size="44" font-weight="900">]</text>
    <line x1="238" y1="130" x2="306" y2="62" stroke="${BAD}" stroke-width="9" stroke-linecap="round"/>
    <g transform="translate(350 64) scale(.9)"><circle cx="32" cy="32" r="30" fill="#f0707a"/><path d="M21 21l22 22M43 21L21 43" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round"/></g></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card p9-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Fast reversible step<br>before a slow step:<br><span class="teal">treat it as being</span><br><span class="teal">at equilibrium</span></p></div>
      <div class="card p9-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Solve for the<br><span class="teal">intermediate</span>,<br>then <span class="pri">substitute</span></p></div>
      <div class="card p9-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>The final<br>rate law has<br><span class="bad">no intermediates</span></p></div>`,
  })
  void WARM
})()
