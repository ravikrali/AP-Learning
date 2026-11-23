// Pictures for chem-2.1 "Types of Chemical Bonds". One EZ.scene per scene id in script.mjs.
// Everything shown comes from the lesson (app/src/content/chem/u2.ts and its prose in book.ts).
// Atom and ion sizes are drawn in the right order but not to exact scale; the lesson gives no
// electronegativity values, so none are shown.
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    svg .f-pri{fill:var(--primary)} svg .f-teal{fill:var(--accent)} svg .f-warm{fill:var(--warm)} svg .f-bad{fill:var(--bad)}
    svg .f-muted{fill:var(--muted)} svg .f-gold{fill:var(--gold)} svg .f-good{fill:var(--good)}
    .foot{position:absolute;left:0;right:0;bottom:30px;text-align:center;font-size:54px;font-weight:900}
    .ask{position:absolute;left:0;top:782px;width:1920px;text-align:center;font-size:42px;font-weight:800;color:var(--muted)}
    .en{position:absolute;left:890px;top:320px;font-size:38px;font-weight:900;white-space:nowrap}
    .bt{top:440px;width:540px;height:500px;text-align:center}
    .bt .t{margin-top:26px;font-size:42px;font-weight:900} .bt .s{font-size:30px;font-weight:800;color:var(--muted)}
    .bt .m{margin-top:4px;font-size:42px;font-weight:900} .bt .x{margin-top:10px;font-size:40px;font-weight:900;color:var(--muted)} .bt .x b{color:var(--text)}
    .bt .u{font-size:27px;font-weight:800;color:var(--muted)}
    .pt{position:absolute;width:390px;height:210px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .pt .f{margin-top:28px;font-size:84px;font-weight:900;line-height:1} .pt .g{margin-top:14px;font-size:32px;font-weight:900}
    .nt{position:absolute;left:1090px;width:710px;height:120px;padding:16px 24px 0 88px;border-radius:24px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .nt i{position:absolute;left:24px;top:36px;width:46px;height:46px;border-radius:50%}
    .nt b{display:block;font-size:34px;font-weight:900;line-height:1.2} .nt span{display:block;font-size:28px;font-weight:700;color:var(--muted)}
    .row{position:absolute;left:120px;width:1680px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .chip{position:absolute;top:30px;width:300px;height:80px;border-radius:20px;border:3px solid;font-size:44px;font-weight:900;line-height:74px;text-align:center}
    .chip.m{border-color:var(--warm);color:var(--warm);background:rgba(243,167,100,.12)} .chip.n{border-color:var(--accent);color:var(--accent);background:rgba(60,199,188,.12)}
    .plus{position:absolute;top:30px;left:372px;width:60px;font-size:60px;font-weight:900;line-height:76px;text-align:center;color:var(--muted)}
    .res{position:absolute;left:880px;top:0;height:140px;display:flex;flex-direction:column;justify-content:center;font-size:56px;font-weight:900;line-height:1.1;white-space:nowrap}
    .res small{font-size:30px;font-weight:800;color:var(--muted)}
    .go{position:absolute;left:770px;top:38px;font-size:60px;color:var(--muted)}
    .obs{position:absolute;left:44px;top:0;width:1040px;height:150px;display:flex;flex-direction:column;justify-content:center;font-size:33px;font-weight:800;line-height:1.25}
    .obs small{display:block;font-size:29px;font-weight:800;color:var(--accent)}
    .sug{position:absolute;left:1110px;top:0;height:150px;display:flex;align-items:center;font-size:46px;font-weight:900;white-space:nowrap}
    .sug i.arr{margin-right:.5em;color:var(--muted)}
    .tile{position:absolute;top:400px;width:390px;height:250px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .tile .f{margin-top:64px;font-size:64px;font-weight:900;line-height:1} .tile .ch{margin:14px 26px 0;font-size:30px;font-weight:800;line-height:1.2;color:var(--muted)}
    .tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .oh{position:absolute;left:0;top:880px;width:1920px;text-align:center;font-size:84px;font-weight:900;line-height:1}
    .rc{top:320px;width:540px;height:560px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc svg{display:block;margin:14px auto 0} .rc p{margin:14px 20px 0;font-size:35px;font-weight:800;line-height:1.3;white-space:nowrap}
  `
  document.head.appendChild(css)

  const E = '#f2c443' // electrons are always the gold dots
  const epair = (cls, r = 10) => `<g class="${cls}"><circle cy="${-r * 1.4}" r="${r}" fill="${E}"/><circle cy="${r * 1.4}" r="${r}" fill="${E}"/></g>`
  const all = (c, q) => (c['_' + q] ??= [...c.root.querySelectorAll(q)])

  // ---------- intro artwork (kept above y = 950): a bonded pair and a few metal ions, faintly ----------
  EZ.intro = {
    chips: [['1@0.3', 'Covalent'], ['1@0.42', 'Ionic'], ['1@0.54', 'Metallic'], ['1@0.8', 'δ+ and δ−']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">
      ${ball(150, 720, 100, 'pur')}${ball(330, 830, 74, 'teal')}${epair('ie', 13)}
      ${[0, 1, 2, 3].map((i) => ball(1640 + (i % 2) * 150, 690 + Math.floor(i / 2) * 150, 50, 'warm', '+', 50)).join('')}
      ${[0, 1, 2, 3, 4].map((i) => `<circle class="im" r="12" fill="${E}" data-i="${i}"/>`).join('')}</svg>`,
    update(c) {
      const t = c.t - c.sc.start, k = 0.5 + 0.12 * Math.sin(t * 1.3)
      c.$('.ie').setAttribute('transform', `translate(${lerp(150, 330, k) + 26} ${lerp(720, 830, k) - 30}) rotate(31)`)
      for (const el of all(c, '.im')) { const i = +el.dataset.i
        el.setAttribute('cx', 1715 + 120 * Math.sin(t * (0.5 + i * 0.13) + i * 1.9)); el.setAttribute('cy', 765 + 120 * Math.cos(t * (0.42 + i * 0.11) + i * 2.6)) }
    },
  }

  // ---------- hook: salt shatters, copper bends, wax melts ----------
  const saltHalf = (cls, left) => { let s = ''
    for (let r = 0; r < 4; r++) for (let k = 0; k < 6; k++) { const cut = r < 2 ? 3 : 2
      if ((k < cut) === left) s += ball(135 + k * 50, 40 + r * 50, 23, (r + k) % 2 ? 'teal' : 'gray') }
    return `<g class="${cls}">${s}</g>` }
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Big question</div><h2 class="h1" data-at="in+0.15">Three solids, three behaviors</h2>
      <div class="card" style="left:120px;top:310px;width:520px;height:440px" data-at="0-0.2"><h3>Salt</h3>
        <svg style="position:absolute;left:0;top:96px" width="520" height="240" viewBox="0 0 520 240">${saltHalf('sa', true)}${saltHalf('sb', false)}</svg>
        <div class="foot teal">shatters</div></div>
      <div class="card" style="left:700px;top:310px;width:520px;height:440px" data-at="1-0.2"><h3>Copper</h3>
        <svg style="position:absolute;left:0;top:96px" width="520" height="240" viewBox="0 0 520 240">
          <path class="cu1" fill="none" stroke="#d98a4a" stroke-width="46" stroke-linecap="round"/><path class="cu2" fill="none" stroke="#ffd9b0" stroke-width="9" stroke-linecap="round" opacity=".55"/></svg>
        <div class="foot warm">bends</div></div>
      <div class="card" style="left:1280px;top:310px;width:520px;height:440px" data-at="2-0.2"><h3>Wax</h3>
        <svg style="position:absolute;left:0;top:96px" width="520" height="240" viewBox="0 0 520 240">
          <ellipse class="wp" cx="260" cy="212" fill="#f4e3a1"/><rect class="wb" x="195" width="130" rx="18" fill="#f4e3a1"/><rect class="wh" x="213" width="22" rx="11" fill="#fff" opacity=".45"/></svg>
        <div class="foot gold">melts</div></div>
      <div class="ask" data-at="3">All made of atoms stuck together. So why so different?</div>
      <div class="banner" style="top:858px" data-at="4" data-fx="pop">How the atoms <span class="pri">share</span> or <span class="warm">trade</span> their electrons</div>`,
    update(c) {
      const b = c.b
      const p0 = eio(c.seg(b[0].start + 0.35, b[0].end + 0.25))
      c.$('.sa').setAttribute('transform', `translate(${-34 * p0} ${8 * p0}) rotate(${-7 * p0} 185 120)`)
      c.$('.sb').setAttribute('transform', `translate(${34 * p0} ${12 * p0}) rotate(${8 * p0} 335 120)`)
      const p1 = eio(c.seg(b[1].start + 0.3, b[1].end + 0.3)), d = `M70 ${92 + 20 * p1} Q260 ${92 + 190 * p1} 450 ${92 + 20 * p1}`
      c.$('.cu1').setAttribute('d', d); c.$('.cu2').setAttribute('d', d); c.$('.cu2').setAttribute('transform', 'translate(0 -11)')
      const p2 = eio(c.seg(b[2].start + 0.3, b[2].end + 0.6)), h = lerp(160, 46, p2)
      c.$('.wb').setAttribute('y', 212 - h); c.$('.wb').setAttribute('height', h)
      c.$('.wh').setAttribute('y', 226 - h); c.$('.wh').setAttribute('height', Math.max(h - 34, 0))
      c.$('.wp').setAttribute('rx', lerp(74, 215, p2)); c.$('.wp').setAttribute('ry', lerp(9, 22, p2))
    },
  })

  // ---------- the tug-of-war and the three bond types ----------
  const bt = (i, at, color, title, s, m, x, u, svg) => `<div class="card bt" style="left:${120 + i * 570}px" data-at="${at}">
    <div class="t ${color}">${title}</div><svg width="540" height="190" viewBox="0 0 540 190">${svg}</svg>
    <div class="s">${s}</div><div class="m">${m}</div><div class="x">${x}</div><div class="u">${u}</div></div>`
  EZ.scene('tug', {
    html: `<div class="kicker" data-at="in" data-fx="left">The big idea</div><h2 class="h1" data-at="in+0.15">A tug-of-war for electrons</h2>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="0" data-fx="fade">
        <line x1="300" y1="345" x2="700" y2="345" stroke="#7d859c" stroke-width="5" stroke-dasharray="4 12" stroke-linecap="round"/>
        ${ball(300, 345, 52, 'pur')}${ball(700, 345, 52, 'teal')}${epair('tp', 11)}
        <line class="ta" y1="345" y2="345" stroke="#8d8df0" stroke-width="8" marker-end="url(#mk-pri)"/><line class="tb2" y1="345" y2="345" stroke="#3cc7bc" stroke-width="8" marker-end="url(#mk-teal)"/></g></svg>
      <div class="en" data-at="1" data-fx="right"><span class="gold">Electronegativity (EN)</span> = how hard an atom pulls</div>
      ${bt(0, '2', 'pri', 'Nonpolar covalent', 'similar EN', 'shared <span class="pri">equally</span>', '<b>Cl–Cl</b>, <b>C–H</b>', '&nbsp;',
        `${ball(165, 100, 62, 'teal', 'Cl')}${ball(375, 100, 62, 'teal', 'Cl')}${epair('p0')}`)}
      ${bt(1, '3', 'teal', 'Polar covalent', 'unequal EN', 'shared <span class="teal">unequally</span>', '<b>H–Cl</b>, <b>O–H</b>', '&nbsp;',
        `${ball(150, 100, 40, 'gray', 'H')}${ball(390, 100, 62, 'teal', 'Cl')}${epair('p1')}`)}
      ${bt(2, '4', 'warm', 'Ionic', 'very unequal EN', 'essentially <span class="warm">transferred</span>', '<b>Na<sup>+</sup>Cl<sup>−</sup></b>', 'usually metal + nonmetal',
        `${ball(150, 100, 50, 'warm', 'Na')}${ball(390, 100, 66, 'teal', 'Cl')}<g class="p2"><circle r="10" fill="${E}"/></g>
         <text class="q2 f-warm" x="196" y="52" font-size="50" font-weight="900">+</text><text class="q2 f-teal" x="444" y="56" font-size="50" font-weight="900">−</text>`)}`,
    update(c) {
      const b = c.b, t = c.t
      const x = 500 + 78 * Math.sin(t * 1.7), n = 7 * Math.sin(t * 6)
      c.$('.tp').setAttribute('transform', `translate(${x} 345)`)
      c.$('.ta').setAttribute('x1', 236 + n); c.$('.ta').setAttribute('x2', 176 + n)
      c.$('.tb2').setAttribute('x1', 764 - n); c.$('.tb2').setAttribute('x2', 824 - n)
      c.$('.p0').setAttribute('transform', `translate(${270 + 5 * Math.sin(t * 2.2)} 100)`)
      const len3 = b[3].end - b[3].start
      c.$('.p1').setAttribute('transform', `translate(${lerp(259, 296, eio(c.seg(b[3].start + 0.12 * len3, b[3].start + 0.3 * len3))) + 3 * Math.sin(t * 2.2)} 100)`)
      const len4 = b[4].end - b[4].start, p = eio(c.seg(b[4].start + 0.5 * len4, b[4].start + 0.68 * len4))
      c.$('.p2').setAttribute('transform', `translate(${lerp(212, 338, p)} ${100 - 46 * Math.sin(Math.PI * p)})`)
      for (const el of all(c, '.q2')) el.style.opacity = c.seg(b[4].start + 0.68 * len4, b[4].start + 0.68 * len4 + 0.4)
    },
  })

  // ---------- partial charges ----------
  const PT = [['C–H', 980, 320], ['N–H', 1410, 320], ['O–H', 980, 560], ['F–H', 1410, 560]]
  EZ.scene('partial', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Polar bonds</div><h2 class="h1" data-at="in+0.15">Partial charges: δ+ and δ−</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0" data-fx="fade"><ellipse class="cl" cy="570" rx="96" ry="64" fill="${E}" opacity=".2"/>${ball(360, 570, 78, 'gray', 'H')}${ball(700, 570, 128, 'teal', 'Cl')}${epair('pp', 13)}</g>
        <text x="700" y="350" text-anchor="middle" font-size="32" font-weight="800" class="f-muted" data-at="1" data-fx="fade">more electronegative</text>
        <text x="700" y="424" text-anchor="middle" font-size="76" font-weight="900" class="f-teal" data-at="2@0.35" data-fx="pop">δ−</text>
        <text x="360" y="472" text-anchor="middle" font-size="76" font-weight="900" class="f-warm" data-at="3@0.3" data-fx="pop">δ+</text>
        <g data-at="4" data-fx="fade"><line x1="350" y1="768" x2="712" y2="768" stroke="#eef0f7" stroke-width="8" marker-end="url(#mk-text)"/><line x1="378" y1="744" x2="378" y2="792" stroke="#eef0f7" stroke-width="8"/>
          <text x="540" y="824" text-anchor="middle" font-size="34" font-weight="900">bond dipole</text></g>
      </svg>
      ${PT.map(([f, x, y], i) => `<div class="pt p${i}" style="left:${x}px;top:${y}px" data-at="5@${0.04 + i * 0.07}" data-fx="pop"><div class="f">${f}</div>
        ${i === 3 ? '<div class="g gold" data-at="5@0.42" data-fx="fade">most polar</div>' : ''}${i === 0 ? '<div class="g pri" data-at="6@0.3" data-fx="fade">effectively nonpolar</div>' : ''}</div>`).join('')}
      <div class="banner" style="top:880px" data-at="4@0.1" data-fx="pop">Bigger EN difference ${ARR} bigger <span class="teal">bond dipole</span></div>`,
    update(c) {
      const b = c.b, t = c.t, len1 = b[1].end - b[1].start
      const p = eio(c.seg(b[1].start + 0.45 * len1, b[1].start + 0.8 * len1))
      c.$('.pp').setAttribute('transform', `translate(${lerp(505, 548, p) + 3 * Math.sin(t * 2.4)} 570)`)
      c.$('.cl').setAttribute('cx', lerp(505, 560, p))
      const len5 = b[5].end - b[5].start, w = eo(c.seg(b[5].start + 0.4 * len5, b[5].start + 0.4 * len5 + 0.45))
      c.$('.p3').style.borderColor = w ? `rgba(242,196,67,${w})` : ''; c.$('.p3').style.boxShadow = `0 0 ${50 * w}px rgba(242,196,67,${0.45 * w})`
      const len6 = b[6].end - b[6].start, v = eo(c.seg(b[6].start + 0.25 * len6, b[6].start + 0.25 * len6 + 0.45))
      c.$('.p0').style.borderColor = v ? `rgba(141,141,240,${v})` : ''; c.$('.p0').style.boxShadow = `0 0 ${50 * v}px rgba(141,141,240,${0.45 * v})`
    },
  })

  // ---------- the continuum ----------
  EZ.scene('continuum', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Don’t miss this</div><h2 class="h1" data-at="0">No sharp line</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <defs><linearGradient id="cont" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#8d8df0"/><stop offset=".5" stop-color="#3cc7bc"/><stop offset="1" stop-color="#f3a764"/></linearGradient></defs>
        <g data-at="in" data-fx="fade">${ball(830, 440, 78, 'pur')}${ball(1090, 440, 88, 'teal')}${epair('kp', 13)}
          <rect x="220" y="620" width="1480" height="52" rx="26" fill="url(#cont)"/>
          <text x="330" y="738" text-anchor="middle" font-size="42" font-weight="900" class="f-pri">nonpolar covalent</text>
          <text x="960" y="738" text-anchor="middle" font-size="42" font-weight="900" class="f-teal">polar covalent</text>
          <text x="1620" y="738" text-anchor="middle" font-size="42" font-weight="900" class="f-warm">ionic</text>
          <text x="960" y="800" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">EN difference: similar · unequal · very unequal</text></g>
        <g data-at="1" data-out="2" data-fx="fade"><line x1="1300" y1="560" x2="1300" y2="700" stroke="#eef0f7" stroke-width="7" stroke-dasharray="14 12"/></g>
        <g data-at="1@0.45" data-out="2" data-fx="pop"><path d="M1268 614L1332 678M1332 614L1268 678" stroke="#f0707a" stroke-width="12" stroke-linecap="round" fill="none"/></g>
        <text x="960" y="588" text-anchor="middle" font-size="46" font-weight="900" class="f-gold" data-at="2" data-fx="pop">a continuum</text>
        <g class="mk"><circle r="34" fill="#10131c" opacity=".5"/><circle r="24" fill="#fff"/></g>
      </svg>
      <div class="banner" style="top:858px" data-at="3" data-fx="pop">Every polar bond has some <span class="warm">ionic character</span></div>`,
    update(c) {
      const b = c.b, p = eio(c.seg(b[1].start + 0.4, b[3].end))
      c.$('.mk').setAttribute('transform', `translate(${lerp(250, 1670, p)} 646)`)
      c.$('.kp').setAttribute('transform', `translate(${lerp(956, 1040, p) + 3 * Math.sin(c.t * 2.4)} 440)`)
    },
  })

  // ---------- metallic bonding ----------
  const NE = 16
  EZ.scene('metal', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Metals</div><h2 class="h1" data-at="0">A sea of electrons</h2>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="in" data-fx="fade">
        <rect x="120" y="320" width="920" height="480" rx="36" fill="rgba(60,199,188,.08)" stroke="#363c54" stroke-width="2"/>
        ${[0, 1, 2].map((r) => `<g class="r${r}">${[0, 1, 2, 3, 4].map((k) => ball(220 + k * 150, 420 + r * 140, 46, 'warm', '+', 52)).join('')}</g>`).join('')}
        ${Array.from({ length: NE }, (_, i) => `<circle class="me" r="11" fill="${E}" data-i="${i}"/>`).join('')}</g></svg>
      <div class="nt" style="top:330px" data-at="1" data-fx="right"><i style="background:${E}"></i><b>Valence electrons</b><span>not owned by any single atom</span></div>
      <div class="nt" style="top:470px" data-at="2" data-fx="right"><i style="background:#f3a764"></i><b>Delocalized</b><span>roam freely among positive metal ions</span></div>
      <div class="nt" style="top:610px;height:190px" data-at="3" data-fx="right"><i style="background:#3cc7bc"></i><b>That’s why metals…</b><span data-at="3@0.2" data-fx="fade">conduct electricity</span><span data-at="3@0.55" data-fx="fade">can be bent or hammered into shape</span></div>
      <div class="banner" style="top:858px;font-size:44px" data-at="4" data-fx="pop">Solid copper: <span class="warm">Cu cations</span> surrounded by <span class="gold">delocalized valence electrons</span></div>`,
    update(c) {
      const b = c.b, t = c.t, len = b[3].end - b[3].start
      const drift = 300 * clamp(t - (b[3].start + 0.15 * len), 0, 0.4 * len)
      for (const el of all(c, '.me')) { const i = +el.dataset.i
        const x = ((((i * 197) % 860) + 46 * Math.sin(t * (0.9 + (i % 5) * 0.17) + i * 1.3) + drift) % 860 + 860) % 860
        const y = 350 + ((i * 113) % 420) + 16 * Math.cos(t * (1.1 + (i % 4) * 0.21) + i * 2.1)
        el.setAttribute('cx', 150 + x); el.setAttribute('cy', y); el.style.opacity = Math.min(clamp(x / 40), clamp((860 - x) / 40)) }
      c.$('.r0').setAttribute('transform', `translate(${75 * eio(c.seg(b[3].start + 0.58 * len, b[3].start + 0.9 * len))} 0)`)
    },
  })

  // ---------- the bond-type sorter ----------
  const sort = (i, at, a, b2, res) => `<div class="row" style="top:${340 + i * 185}px;height:140px" data-at="${at}">
    <div class="chip ${a[0]}" style="left:44px">${a[1]}</div><div class="plus">+</div><div class="chip ${b2[0]}" style="left:460px">${b2[1]}</div>
    <div class="go" data-at="${at}@0.45" data-fx="fade">${ARR}</div><div class="res" data-at="${at}@0.5" data-fx="right">${res}</div></div>`
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Quick bond-type sorter</h2>
      ${sort(0, '1', ['m', 'Metal'], ['n', 'Nonmetal'], '<span>usually <span class="warm">ionic</span></span>')}
      ${sort(1, '2', ['n', 'Nonmetal'], ['n', 'Nonmetal'], '<span class="teal">covalent</span><small>polar if the ENs differ</small>')}
      ${sort(2, '3', ['m', 'Metal'], ['m', 'Metal'], '<span class="gold">metallic</span>')}`,
  })

  // ---------- properties are the best evidence ----------
  const ev = (i, at, obs, extra, res) => `<div class="row" style="top:${350 + i * 172}px;height:150px" data-at="${at}">
    <div class="obs"><span>${obs}</span>${extra}</div><div class="sug" data-at="${at}@0.62" data-fx="right">${ARR}${res}</div></div>`
  EZ.scene('evidence', {
    html: `<div class="kicker" data-at="in" data-fx="left">AP® fine print</div><h2 class="h1" data-at="1">Best evidence: the <span class="gold">properties</span></h2>
      <div style="position:absolute;left:120px;top:270px;font-size:38px;font-weight:800;color:var(--muted)" data-at="0@0.3">EN difference isn’t the <span class="warm">only</span> factor</div>
      ${ev(0, '2', 'Conducts electricity as a solid, and is malleable', '', '<span class="gold">metallic bonding</span>')}
      ${ev(1, '3', 'Doesn’t conduct as a solid; conducts when melted or dissolved', '<small data-at="4" data-fx="fade">ions can’t move in the solid, but can once melted or dissolved</small>', '<span class="warm">ionic bonding</span>')}
      ${ev(2, '5', 'Doesn’t conduct in any state; low melting point', '', '<span class="teal">covalent molecules</span>')}`,
  })

  // ---------- try it ----------
  const OPTS = [['A', 'H', 'because it’s smaller'], ['B', 'O', 'because it’s more electronegative'], ['C', 'Neither', 'the bond is nonpolar'], ['D', 'Both', 'share it equally']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:60px" data-at="1">In an O–H bond, which atom carries the <span class="teal">partial negative charge</span>?</h2>
      ${OPTS.map(([l, f, ch], i) => `<div class="tile t${i}" style="left:${120 + i * 430}px" data-at="2@${0.02 + i * 0.26}" data-fx="pop"><div class="l">${l}</div>
        ${i === 1 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        <div class="f">${f}</div><div class="ch">${ch}</div></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="820" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="820" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 820)"/>
        <text class="num" x="960" y="846" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="950" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:716px" data-at="5" data-fx="pop">Shared electrons spend more time near <span class="teal">O</span></div>
      <div class="oh" data-at="6" data-fx="pop">O<sup class="teal">δ−</sup> – H<sup class="warm">δ+</sup></div>`,
    update(c) {
      const b = c.b, t0 = b[3].start + 0.3, t1 = b[4].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[4].start + 0.5, b[4].start + 0.95))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 1) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const dots = (x, y, r = 7) => `<circle cx="${x}" cy="${y - r * 1.4}" r="${r}" fill="${E}"/><circle cx="${x}" cy="${y + r * 1.4}" r="${r}" fill="${E}"/>`
  const share = `<svg width="480" height="210" viewBox="0 0 480 210">
    ${ball(40, 40, 26, 'teal')}${ball(130, 40, 26, 'teal')}${dots(85, 40)}<text x="190" y="52" font-size="30" font-weight="900" class="f-pri">equal sharing</text>
    ${ball(36, 108, 18, 'gray')}${ball(130, 108, 26, 'teal')}${dots(96, 108)}<text x="190" y="120" font-size="30" font-weight="900" class="f-teal">unequal sharing</text>
    ${ball(38, 176, 22, 'warm', sup('', '+'), 44)}${ball(130, 176, 28, 'teal', sup('', '−'), 44)}<text x="190" y="188" font-size="30" font-weight="900" class="f-warm">transfer</text></svg>`
  const dip = `<svg width="480" height="210" viewBox="0 0 480 210">${ball(150, 122, 44, 'gray', 'H')}${ball(320, 122, 70, 'teal', 'Cl')}${dots(226, 122, 8)}
    <text x="150" y="58" text-anchor="middle" font-size="46" font-weight="900" class="f-warm">δ+</text><text x="320" y="40" text-anchor="middle" font-size="46" font-weight="900" class="f-teal">δ−</text></svg>`
  const sea = `<svg width="480" height="210" viewBox="0 0 480 210"><rect x="30" y="8" width="420" height="194" rx="26" fill="rgba(60,199,188,.1)"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => ball(90 + (i % 4) * 100, 62 + Math.floor(i / 4) * 88, 30, 'warm', '+', 36)).join('')}
    ${[[140, 40], [240, 84], [338, 50], [60, 108], [140, 150], [240, 150], [392, 108], [140, 184], [340, 186], [420, 30]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="${E}"/>`).join('')}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div>${share}<p>Nonpolar: <span class="pri">equal</span> sharing<br>Polar: <span class="teal">unequal</span> sharing<br>Ionic: a <span class="warm">transfer</span></p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div>${dip}<p>More EN atom is <span class="teal">δ−</span><br>Bigger EN difference:<br><span class="pri">bigger dipole</span></p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div>${sea}<p>Metallic bonding:<br><span class="warm">cations</span> in a sea of<br><span class="gold">delocalized electrons</span></p></div>`,
  })
})()
