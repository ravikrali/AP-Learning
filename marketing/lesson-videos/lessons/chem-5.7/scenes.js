// Pictures for chem-5.7 "Reaction Mechanisms". One EZ.scene per scene id in script.mjs. Every
// equation shown is the lesson's own (app/src/content/chem/u5.ts): the NO2 + CO example, the
// H2O2 / I- quick check and the Cl2 + CHCl3 try question. The balls in the hook and in the
// "pieces" scene are schematic species, not real molecules; X and Y in the trick are placeholders.
(() => {
  const { clamp, lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .m-eq{position:absolute;left:120px;height:90px;display:flex;align-items:center;gap:20px;font-size:56px;font-weight:900;white-space:nowrap}
    .m-lab{display:inline-block;width:190px;font-size:28px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
    .m-s{position:relative;display:inline-block}
    .m-op{color:var(--muted)}
    .m-x{position:absolute;left:-8px;right:-8px;top:50%;height:7px;margin-top:-2px;border-radius:4px;background:var(--bad)}
    .m-ring{position:absolute;left:-14px;right:-14px;top:-8px;bottom:-8px;border:5px solid;border-radius:20px}
    .m-line{position:absolute;left:120px;width:1680px;height:4px;border-radius:2px;background:#4a5070}
    .m-chip{position:absolute;height:72px;padding:0 26px;border-radius:20px;background:rgba(255,255,255,.05);border:2px solid var(--line);font-size:34px;font-weight:800;line-height:68px;white-space:nowrap}
    .m-chip svg{display:inline-block;width:44px;height:44px;vertical-align:middle;margin:-6px 14px 0 0}
    .m-note{position:absolute;padding:22px 30px 24px 34px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line);border-left-width:10px}
    .m-note b{display:block;font-size:42px;font-weight:900;line-height:1.15;white-space:nowrap} .m-note > span{display:block;margin-top:10px;font-size:30px;font-weight:700;color:var(--muted);line-height:1.3;white-space:nowrap}
    .m-note svg{display:block;margin-top:18px}
    .m-steps{position:absolute;left:120px;top:290px;width:1680px;height:270px;padding:24px 44px}
    .m-steps div{position:relative;height:74px;font-size:46px;font-weight:900;white-space:nowrap;display:flex;align-items:center;gap:16px}
    .m-steps .m-lab{width:170px;font-size:26px}
    .m-steps .m-ring{left:-10px;right:-10px;top:-4px;bottom:-4px;border-width:4px;border-radius:16px}
    .m-tile{position:absolute;top:600px;width:390px;height:150px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .m-tile .l{position:absolute;left:18px;top:14px;width:52px;height:52px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:28px;font-weight:900;line-height:48px;color:var(--muted)}
    .m-tile .f{margin-top:62px;font-size:42px;font-weight:900;line-height:1;white-space:nowrap}
    .m-tile .ok{position:absolute;right:16px;top:12px;width:56px;height:56px} .m-tile .ok svg{display:block;width:100%;height:100%}
    .m-why{position:absolute;left:120px;width:1680px;height:84px;border-radius:24px;background:rgba(60,199,188,.1);border:2px solid rgba(60,199,188,.6);font-size:40px;font-weight:800;line-height:80px;text-align:center;white-space:nowrap}
    .m-rc{top:320px;width:540px;height:580px;text-align:center} .m-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .m-rc svg{display:block;margin:14px auto 0} .m-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.32;white-space:nowrap}
  `
  document.head.appendChild(css)

  const CHECK = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const CROSS = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#f0707a"/><path d="M21 21l22 22M43 21L21 43" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round"/></svg>'
  const TEAL = '#3cc7bc', WARM = '#f3a764', BAD = '#f0707a'
  // one species in an equation row; x = when it is struck out, r = when it is ringed (with colour rc)
  const S = (h, o = {}) => `<span class="m-s">${h}${o.x ? `<i class="m-x" data-at="${o.x}" data-fx="grow"></i>` : ''}${o.r ? `<i class="m-ring" style="border-color:${o.rc}" data-at="${o.r}" data-fx="pop"></i>` : ''}</span>`
  const P = '<span class="m-op">+</span>', A = '<span class="m-op">→</span>'
  const sb = (n) => `<sub>${n}</sub>`, sp = (n) => `<sup>${n}</sup>`

  // a filmstrip of frames; inner(i, fx, fy) draws frame i's content
  const strip = (x, y, n, fw, fh, inner, op = 1) => {
    const w = n * (fw + 30) + 30, h = fh + 80
    let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="rgba(20,22,32,.95)" stroke="#4a5070" stroke-width="3" opacity="${op}"/>`
    for (let k = 0; k < w / 40 - 1; k++) s += `<rect x="${x + 18 + k * 40}" y="${y + 12}" width="20" height="16" rx="4" fill="#4a5070"/><rect x="${x + 18 + k * 40}" y="${y + h - 28}" width="20" height="16" rx="4" fill="#4a5070"/>`
    for (let i = 0; i < n; i++) { const fx = x + 30 + i * (fw + 30), fy = y + 40
      s += `<rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" rx="12" fill="rgba(255,255,255,.06)" stroke="#636b88" stroke-width="2"/>${inner(i, fx, fy)}` }
    return s
  }

  // ---------- intro artwork: faint filmstrips at the left and right edges ----------
  const vstrip = (x) => { let s = `<rect x="${x}" y="230" width="170" height="680" rx="18" fill="rgba(255,255,255,.05)" stroke="#8d8df0" stroke-width="3"/>`
    for (let k = 0; k < 16; k++) s += `<rect x="${x + 12}" y="${246 + k * 41}" width="14" height="20" rx="4" fill="#8d8df0"/><rect x="${x + 144}" y="${246 + k * 41}" width="14" height="20" rx="4" fill="#8d8df0"/>`
    for (let i = 0; i < 4; i++) s += `<rect x="${x + 36}" y="${248 + i * 162}" width="98" height="140" rx="10" fill="none" stroke="#8d8df0" stroke-width="3"/><text x="${x + 85}" y="${334 + i * 162}" text-anchor="middle" font-size="54" font-weight="900" class="f-pri">${i + 1}</text>`
    return s }
  EZ.intro = {
    chips: [['1@0.3', 'Elementary steps'], ['1@0.6', 'Intermediates'], ['1@0.85', 'Catalysts']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2"><g class="m-is1">${vstrip(60)}</g><g class="m-is2">${vstrip(1690)}</g></svg>`,
    update(c) {
      const p = eio(c.seg(c.sc.start + 0.2, c.sc.start + 2.4))
      c.$('.m-is1').setAttribute('transform', `translate(0 ${lerp(60, 0, p)})`)
      c.$('.m-is2').setAttribute('transform', `translate(0 ${lerp(-60, 0, p)})`)
    },
  }

  // ---------- hook: the poster and the movie ----------
  const FR = [['pur', 'pur'], ['teal', 'gray'], ['teal', 'warm'], ['gray', 'gold']]
  const frame = (i, fx, fy) => i < 3
    ? `${ball(fx + 80, fy + 95, 30, FR[i][0])}${ball(fx + 150, fy + 95, 30, FR[i][1])}<text x="${fx + 115}" y="${fy + 180}" text-anchor="middle" font-size="30" font-weight="900" class="f-teal">Step ${i + 1}</text>`
    : `<text x="${fx + 115}" y="${fy + 120}" text-anchor="middle" font-size="70" font-weight="900" class="f-muted">…</text>`
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Think about it</div><h2 class="h1" data-at="0">The poster and the movie</h2>
      <div class="card" style="left:120px;top:290px;width:560px;height:460px" data-at="0@0.3"><h3 class="muted" style="font-size:32px">Balanced equation</h3>
        <div class="m-chip" style="left:40px;top:96px;border-color:rgba(141,141,240,.6)" data-at="1@0.2" data-fx="pop"><span class="muted" style="font-size:24px;letter-spacing:.1em">START</span>&nbsp; reactants</div>
        <div style="position:absolute;left:150px;top:196px;font-size:90px;font-weight:900;line-height:1" class="muted" data-at="1@0.4" data-fx="fade">↓</div>
        <div style="position:absolute;left:260px;top:186px;font-size:100px;font-weight:900;line-height:1" class="gold" data-at="2@0.5" data-fx="pop">?</div>
        <div class="m-chip" style="left:40px;top:330px;border-color:rgba(60,199,188,.6)" data-at="1@0.6" data-fx="pop"><span class="muted" style="font-size:24px;letter-spacing:.1em">FINISH</span>&nbsp; products</div></div>
      <div style="position:absolute;left:760px;top:300px;font-size:34px;font-weight:900;letter-spacing:.1em;text-transform:uppercase" class="teal" data-at="3" data-fx="fade">Mechanism</div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="3" data-fx="fade"><g class="m-film">${strip(760, 360, 4, 230, 210, frame)}</g></g></svg>
      <div style="position:absolute;left:760px;top:680px;font-size:38px;font-weight:800" class="muted" data-at="3@0.5" data-fx="up">the whole movie, scene by scene</div>
      <div class="banner" style="top:800px" data-at="4" data-fx="pop">How the reaction <span class="gold">really happens</span></div>`,
    update(c) {
      const s = c.b[3].start, p = eio(c.seg(s, s + 1.6))
      c.$('.m-film').setAttribute('transform', `translate(${lerp(260, 0, p)} 0)`)
    },
  })

  // ---------- the pieces: steps add up; intermediate and catalyst ----------
  const brow = (y, l, r, lab) => `<text x="40" y="${y + 10}" font-size="26" font-weight="900" class="f-muted" style="letter-spacing:.1em">${lab}</text>
    ${ball(250, y, 28, l[0])}<text x="305" y="${y + 14}" text-anchor="middle" font-size="40" font-weight="900" class="f-muted">+</text>${ball(360, y, 28, l[1])}
    <text x="450" y="${y + 14}" text-anchor="middle" font-size="44" font-weight="900" class="f-muted">→</text>
    ${ball(540, y, 28, r[0])}<text x="595" y="${y + 14}" text-anchor="middle" font-size="40" font-weight="900" class="f-muted">+</text>${ball(650, y, 28, r[1])}`
  const timeline = (segs, color, f, lab) => `<svg width="700" height="96" viewBox="0 0 700 96"><line x1="10" y1="20" x2="690" y2="20" stroke="#4a5070" stroke-width="6" stroke-linecap="round"/>
    ${segs.map(([a, b]) => `<line x1="${a}" y1="20" x2="${b}" y2="20" stroke="${color}" stroke-width="14" stroke-linecap="round"/>`).join('')}
    <text x="10" y="54" font-size="22" font-weight="800" class="f-muted">start</text><text x="690" y="54" text-anchor="end" font-size="22" font-weight="800" class="f-muted">end</text><text x="350" y="88" text-anchor="middle" font-size="30" font-weight="900" class="${f}">${lab}</text></svg>`
  EZ.scene('pieces', {
    html: `<div class="kicker" data-at="in" data-fx="left">The pieces</div><h2 class="h1" data-at="0">What is a mechanism?</h2>
      <div class="card" style="left:120px;top:290px;width:780px;height:560px" data-at="1"><h3 style="font-size:36px">A series of <span class="pri">elementary steps</span></h3>
        <svg style="position:absolute;left:0;top:100px" width="780" height="450" viewBox="0 0 780 450">
          <g data-at="1@0.3" data-fx="fade">${brow(60, ['pur', 'pur'], ['teal', 'gray'], 'STEP 1')}</g>
          <g data-at="1@0.6" data-fx="fade">${brow(160, ['teal', 'warm'], ['pur', 'gold'], 'STEP 2')}</g>
          <line x1="40" y1="225" x2="740" y2="225" stroke="#8d8df0" stroke-width="4" data-at="2@0.3" data-fx="draw"/>
          <g data-at="2@0.6" data-fx="fade">${brow(290, ['pur', 'warm'], ['gray', 'gold'], 'OVERALL')}</g>
          <text x="390" y="395" text-anchor="middle" font-size="32" font-weight="900" class="f-gold" data-at="2@0.7" data-fx="fade">add up to the overall balanced equation</text>
        </svg></div>
      <div class="m-chip" style="left:120px;top:880px;border-color:rgba(242,196,67,.6)" data-at="3" data-fx="pop">two kinds of species that are <span class="gold">not</span> in the overall equation</div>
      <div class="m-note" style="left:960px;top:290px;width:840px;height:260px;border-left-color:var(--accent)" data-at="4" data-fx="right"><b class="teal">Intermediate</b><span><em style="font-style:normal;color:var(--text)">produced</em> in one step ${ARR} <em style="font-style:normal;color:var(--text)">consumed</em> in a later step</span>
        <div data-at="5" data-fx="fade">${timeline([[230, 470]], TEAL, 'f-teal', 'only while the reaction is running')}</div></div>
      <div class="m-note" style="left:960px;top:590px;width:840px;height:260px;border-left-color:var(--warm)" data-at="6" data-fx="right"><b class="warm">Catalyst</b><span><em style="font-style:normal;color:var(--text)">consumed</em> in an early step ${ARR} <em style="font-style:normal;color:var(--text)">regenerated</em> later</span>
        <div data-at="7" data-fx="fade">${timeline([[10, 200], [500, 690]], WARM, 'f-warm', 'present at the start and the end')}</div></div>`,
  })

  // ---------- worked example: NO2 + CO ----------
  EZ.scene('example', {
    html: `<div class="kicker" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Spot the intermediate</h2>
      <div class="m-eq" style="top:290px" data-at="1"><span class="m-lab">Step 1</span>${S(`NO${sb(2)}`)}${P}${S(`NO${sb(2)}`)}${A}${S(`<span class="teal">NO${sb(3)}</span>`, { r: '8@0.3', rc: TEAL })}${P}${S('NO')}</div>
      <div class="m-eq" style="top:390px" data-at="2"><span class="m-lab">Step 2</span>${S(`<span class="teal">NO${sb(3)}</span>`, { r: '8@0.5', rc: TEAL })}${P}${S('CO')}${A}${S(`NO${sb(2)}`)}${P}${S(`CO${sb(2)}`)}</div>
      <div class="m-line" style="top:500px" data-at="3" data-fx="grow"></div>
      <div class="m-eq" style="top:520px;font-size:50px;gap:16px" data-at="3@0.3"><span class="m-lab">Add</span>${S(`NO${sb(2)}`, { x: '6@0.3' })}${P}${S(`NO${sb(2)}`)}${P}${S(`NO${sb(3)}`, { x: '5@0.2' })}${P}${S('CO')}${A}${S(`NO${sb(3)}`, { x: '5@0.4' })}${P}${S('NO')}${P}${S(`NO${sb(2)}`, { x: '6@0.5' })}${P}${S(`CO${sb(2)}`)}</div>
      <div style="position:absolute;left:310px;top:618px;font-size:32px;font-weight:800" class="bad" data-at="4" data-fx="fade">cancel what appears on both sides</div>
      <div class="banner" style="top:690px" data-at="7" data-fx="pop"><span class="muted" style="font-size:36px">Overall:</span>&nbsp; NO${sb(2)} + CO ${ARR} NO + CO${sb(2)}</div>
      <div class="m-note" style="left:120px;top:830px;width:1680px;height:100px;padding-top:20px;border-left-color:var(--accent)" data-at="8" data-fx="up"><b style="font-size:40px"><span class="teal">NO<sub>3</sub> = intermediate</span> <span class="muted" style="font-size:34px">&nbsp;made in step 1, used in step 2</span></b></div>`,
  })

  // ---------- a mechanism with a catalyst: H2O2 and I- ----------
  const I = `I${sp('−')}`, IO = `IO${sp('−')}`
  EZ.scene('catalyst', {
    html: `<div class="kicker" data-at="in" data-fx="left">Catalyst vs. intermediate</div><h2 class="h1" data-at="0">Follow each species</h2>
      <div class="m-eq" style="top:290px" data-at="1"><span class="m-lab">Step 1</span>${S(`H${sb(2)}O${sb(2)}`)}${P}${S(`<span class="warm">${I}</span>`, { r: '3@0.2', rc: WARM, x: '5@0.6' })}${A}${S(`H${sb(2)}O`)}${P}${S(`<span class="teal">${IO}</span>`, { r: '4@0.25', rc: TEAL, x: '5@0.7' })}</div>
      <div class="m-eq" style="top:400px" data-at="2"><span class="m-lab">Step 2</span>${S(`H${sb(2)}O${sb(2)}`)}${P}${S(`<span class="teal">${IO}</span>`, { r: '4@0.45', rc: TEAL, x: '5@0.75' })}${A}${S(`H${sb(2)}O`)}${P}${S(`O${sb(2)}`)}${P}${S(`<span class="warm">${I}</span>`, { r: '3@0.45', rc: WARM, x: '5@0.65' })}</div>
      <div class="m-note" style="left:120px;top:540px;width:810px;height:150px;border-left-color:var(--warm)" data-at="3@0.3" data-fx="up"><b><span class="warm">I<sup>−</sup></span> = catalyst</b><span>used in step 1 ${ARR} regenerated in step 2</span></div>
      <div class="m-note" style="left:990px;top:540px;width:810px;height:150px;border-left-color:var(--accent)" data-at="4@0.3" data-fx="up"><b><span class="teal">IO<sup>−</sup></span> = intermediate</b><span>made in step 1 ${ARR} used in step 2</span></div>
      <div class="banner" style="top:800px" data-at="5@0.5" data-fx="pop"><span class="muted" style="font-size:36px">Overall:</span>&nbsp; 2H${sb(2)}O${sb(2)} ${ARR} 2H${sb(2)}O + O${sb(2)}</div>`,
  })

  // ---------- quick trick: where it first appears ----------
  const box = (x, y, t, col, f) => `<rect x="${x - 38}" y="${y - 46}" width="76" height="66" rx="14" fill="none" stroke="${col}" stroke-width="4"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="48" font-weight="900" class="${f}">${t}</text>`
  const T = (x, y, t, a = 'start') => `<text x="${x}" y="${y}" text-anchor="${a}" font-size="46" font-weight="900">${t}</text>`
  const L = (x, y, t) => `<text x="${x}" y="${y}" font-size="26" font-weight="900" class="f-muted" style="letter-spacing:.08em">${t}</text>`
  const hackInt = `<svg style="position:absolute;left:0;top:96px" width="810" height="380" viewBox="0 0 810 380">
      ${L(40, 76, 'STEP 1')}${T(180, 80, 'A + B →')}${box(410, 80, 'X', TEAL, 'f-teal')}<text x="530" y="82" font-size="28" font-weight="900" class="f-teal" data-at="2@0.4" data-fx="fade">first: right side</text>
      ${L(40, 226, 'STEP 2')}${box(220, 230, 'X', TEAL, 'f-teal')}${T(282, 230, '+ C → D')}<text x="530" y="232" font-size="28" font-weight="900" class="f-teal" data-at="2@0.75" data-fx="fade">later: left side</text>
      <path d="M396 112 C 380 160, 270 150, 232 182" fill="none" stroke="${TEAL}" stroke-width="6" marker-end="url(#mk-teal)" data-at="2@0.6" data-fx="draw"/>
      <text x="405" y="340" text-anchor="middle" font-size="50" font-weight="900" class="f-teal" data-at="3" data-fx="pop">Made, then used.</text></svg>`
  const hackCat = `<svg style="position:absolute;left:0;top:96px" width="810" height="380" viewBox="0 0 810 380">
      ${L(40, 76, 'STEP 1')}${box(220, 80, 'Y', WARM, 'f-warm')}${T(282, 80, '+ A → B')}<text x="530" y="82" font-size="28" font-weight="900" class="f-warm" data-at="4@0.4" data-fx="fade">first: left side</text>
      ${L(40, 226, 'STEP 2')}${T(180, 230, 'B → C +')}${box(410, 230, 'Y', WARM, 'f-warm')}<text x="530" y="232" font-size="28" font-weight="900" class="f-warm" data-at="4@0.75" data-fx="fade">later: right side</text>
      <path d="M234 112 C 250 160, 360 150, 398 182" fill="none" stroke="${WARM}" stroke-width="6" marker-end="url(#mk-warm)" data-at="4@0.6" data-fx="draw"/>
      <text x="405" y="340" text-anchor="middle" font-size="50" font-weight="900" class="f-warm" data-at="5" data-fx="pop">Used, then given back.</text></svg>`
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Intermediate or catalyst, in one glance</h2>
      <div class="m-chip" style="left:120px;top:290px;border-color:rgba(242,196,67,.6)" data-at="1" data-fx="pop">look at where the species <span class="gold">first appears</span></div>
      <div class="card" style="left:120px;top:390px;width:810px;height:470px;border-color:rgba(60,199,188,.6)" data-at="2"><h3 class="teal" style="font-size:38px">Intermediate</h3>${hackInt}</div>
      <div class="card" style="left:990px;top:390px;width:810px;height:470px;border-color:rgba(243,167,100,.6)" data-at="4"><h3 class="warm" style="font-size:38px">Catalyst</h3>${hackCat}</div>
      <div class="banner" style="top:890px;padding:16px 40px;font-size:44px" data-at="6" data-fx="pop"><span class="gold">Neither</span> appears in the overall equation</div>`,
  })

  // ---------- evidence: supported, never proven ----------
  EZ.scene('evidence', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Evidence</div><h2 class="h1" data-at="0">Supported, never proven</h2>
      <div class="m-chip" style="left:120px;top:290px;border-color:rgba(240,112,122,.6)" data-at="1@0.3" data-fx="pop">${CROSS}<span class="bad">proven</span></div>
      <div class="m-chip" style="left:440px;top:290px;border-color:rgba(76,199,129,.6)" data-at="1@0.6" data-fx="pop">${CHECK}<span class="good">supported</span></div>
      <div class="card m-ev1" style="left:120px;top:400px;width:640px;height:130px" data-at="2@0.1"><h3 style="font-size:38px">Mechanism 1</h3><div style="position:absolute;left:40px;top:82px;font-size:26px;font-weight:800" class="muted">proposed steps</div>
        <div class="m-chip" style="right:20px;top:64px;height:50px;line-height:46px;padding:0 18px;font-size:24px;border-color:${TEAL};background:rgba(60,199,188,.16)" data-at="3@0.3" data-fx="pop"><span class="teal">intermediate detected</span></div></div>
      <div class="card m-ev2" style="left:120px;top:570px;width:640px;height:130px" data-at="2@0.3"><h3 style="font-size:38px">Mechanism 2</h3><div style="position:absolute;left:40px;top:82px;font-size:26px;font-weight:800" class="muted">proposed steps</div></div>
      <svg class="full" viewBox="0 0 1920 1080"><path d="M772 465 C 860 465, 900 520, 985 535" fill="none" stroke="#8d8df0" stroke-width="6" marker-end="url(#mk-pri)" data-at="2@0.5" data-fx="draw"/>
        <path d="M772 635 C 860 635, 900 580, 985 565" fill="none" stroke="#8d8df0" stroke-width="6" marker-end="url(#mk-pri)" data-at="2@0.55" data-fx="draw"/></svg>
      <div class="card" style="left:1000px;top:480px;width:800px;height:140px" data-at="2@0.7"><h3 style="font-size:38px;padding-top:44px">the <span class="gold">same</span> overall equation</h3></div>
      <div class="card" style="left:120px;top:740px;width:820px;height:180px" data-at="4"><h3 style="font-size:36px">Must also agree with</h3>
        <div style="position:absolute;left:40px;top:90px;font-size:40px;font-weight:900" class="pri">the experimental rate law</div>
        <div style="position:absolute;right:30px;top:34px;font-size:26px;font-weight:800" class="muted">next lesson</div></div>
      <div class="card" style="left:1000px;top:680px;width:800px;height:240px" data-at="5"><h3 style="font-size:36px">On the exam, say</h3>
        <div class="m-chip" style="left:40px;top:90px;border-color:rgba(76,199,129,.6)" data-at="5@0.35" data-fx="pop">${CHECK}“consistent with the data”</div>
        <div class="m-chip" style="left:40px;top:170px;height:56px;line-height:52px;font-size:30px;border:0;background:none;padding:0" data-at="5@0.7" data-fx="fade"><span class="muted">not</span>&nbsp; <span class="bad" style="text-decoration:line-through">“proven”</span></div></div>`,
    update(c) {
      const w = eo(c.seg(c.b[3].start + 0.4, c.b[3].start + 1.0))
      const e1 = c.$('.m-ev1'), e2 = c.$('.m-ev2')
      e1.style.borderColor = w ? `rgba(60,199,188,${w})` : ''
      e1.style.boxShadow = `0 0 ${50 * w}px rgba(60,199,188,${0.4 * w})`
      e2.style.filter = `brightness(${1 - 0.4 * w})`
    },
  })

  // ---------- try it ----------
  const Cl = (o) => S('Cl', o), CCl3 = (o) => S(`CCl${sb(3)}`, o)
  const OPTS = [['A', `Cl${sb(2)} and CHCl${sb(3)}`], ['B', `Cl and CCl${sb(3)}`], ['C', `HCl and CCl${sb(4)}`], ['D', `Only Cl${sb(2)}`]]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="2">Which species are <span class="teal">intermediates</span>?</h2>
      <div class="card m-steps" data-at="1">
        <div data-at="1@0.02" data-fx="fade"><span class="m-lab">Step 1</span>${S(`Cl${sb(2)}`)}${A}${S('2Cl', { r: '5@0.1', rc: TEAL })}</div>
        <div data-at="1@0.25" data-fx="fade"><span class="m-lab">Step 2</span>${Cl({ r: '5@0.5', rc: TEAL })}${P}${S(`CHCl${sb(3)}`)}${A}${S('HCl')}${P}${CCl3({ r: '6@0.2', rc: TEAL })}</div>
        <div data-at="1@0.6" data-fx="fade"><span class="m-lab">Step 3</span>${CCl3({ r: '6@0.55', rc: TEAL })}${P}${Cl({ r: '5@0.75', rc: TEAL })}${A}${S(`CCl${sb(4)}`)}</div>
      </div>
      ${OPTS.map(([l, f], i) => `<div class="m-tile t${i}" style="left:${120 + i * 430}px" data-at="2@${0.2 + i * 0.12}" data-fx="pop"><div class="l">${l}</div>
        ${i === 1 ? `<div class="ok">${CHECK}</div>` : ''}<div class="f">${f}</div></div>`).join('')}
      <svg class="full m-count" viewBox="0 0 1920 1080"><circle cx="960" cy="850" r="70" fill="none" stroke="#363c54" stroke-width="12"/><circle class="m-arc" cx="960" cy="850" r="70" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 850)"/>
        <text class="m-num" x="960" y="876" text-anchor="middle" font-size="72" font-weight="900">3</text><text x="960" y="960" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="m-why" style="top:790px" data-at="5" data-fx="up"><span class="teal">Cl</span>: made in step 1, used in steps 2 and 3</div>
      <div class="m-why" style="top:890px" data-at="6" data-fx="up"><span class="teal">CCl<sub>3</sub></span>: made in step 2, used in step 3</div>`,
    update(c) {
      const b = c.b, t0 = b[3].start + 0.3, t1 = b[4].start - 0.25, p = c.seg(t0, t1)
      c.$('.m-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.m-arc').setAttribute('stroke-dashoffset', p)
      c.$('.m-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[4].start + 0.4, b[4].start + 0.9))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 1) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const mb = (x, y, g) => ball(x, y, 20, g)
  const r1 = `<svg width="460" height="190" viewBox="0 0 460 190"><text x="20" y="42" font-size="22" font-weight="900" class="f-muted">STEP 1</text>${mb(150, 34, 'pur')}${mb(200, 34, 'pur')}<text x="250" y="44" font-size="30" font-weight="900" class="f-muted">→</text>${mb(310, 34, 'teal')}${mb(360, 34, 'gray')}
    <text x="20" y="102" font-size="22" font-weight="900" class="f-muted">STEP 2</text>${mb(150, 94, 'teal')}${mb(200, 94, 'warm')}<text x="250" y="104" font-size="30" font-weight="900" class="f-muted">→</text>${mb(310, 94, 'pur')}${mb(360, 94, 'gold')}
    <line x1="20" y1="130" x2="420" y2="130" stroke="#8d8df0" stroke-width="4"/><text x="20" y="169" font-size="19" font-weight="900" class="f-muted">OVERALL</text>${mb(150, 162, 'pur')}${mb(200, 162, 'warm')}<text x="250" y="172" font-size="30" font-weight="900" class="f-muted">→</text>${mb(310, 162, 'gray')}${mb(360, 162, 'gold')}</svg>`
  const r2 = `<svg width="460" height="190" viewBox="0 0 460 190">
    ${box(70, 64, 'X', TEAL, 'f-teal')}<text x="130" y="62" font-size="34" font-weight="900" class="f-teal">made → used</text>
    ${box(70, 154, 'Y', WARM, 'f-warm')}<text x="130" y="152" font-size="34" font-weight="900" class="f-warm">used → given back</text></svg>`
  const r3 = `<svg width="460" height="190" viewBox="0 0 460 190"><circle cx="200" cy="80" r="56" fill="rgba(60,199,188,.12)" stroke="${TEAL}" stroke-width="10"/><line x1="242" y1="122" x2="300" y2="180" stroke="${TEAL}" stroke-width="16" stroke-linecap="round"/>
    ${box(200, 96, 'X', TEAL, 'f-teal')}<g transform="translate(300 10) scale(.9)"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card m-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Elementary steps<br><span class="pri">add up to</span> the<br>overall equation</p></div>
      <div class="card m-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p><span class="teal">Intermediate:</span><br>made, then used<br><span class="warm">Catalyst:</span> used,<br>then regenerated</p></div>
      <div class="card m-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Detecting an<br><span class="teal">intermediate</span><br><span class="good">supports</span> a<br>mechanism</p></div>`,
  })
  void clamp; void BAD
})()
