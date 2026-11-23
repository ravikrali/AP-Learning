// Pictures for chem-4.8 "Acids & Bases: Proton Transfer". One EZ.scene per scene id in script.mjs.
// Every reaction and species shown is the lesson's own (app/src/content/chem/u4.ts, book.ts).
// Atom sizes are in a sensible order only; molecule shapes are schematic, not to scale.
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .ab-n{position:absolute;width:520px;text-align:center;font-size:46px;font-weight:900;white-space:nowrap}
    .ab-n small{font-size:30px;font-weight:800;color:var(--muted);margin-left:10px}
    .ab-r{position:absolute;width:520px;text-align:center;font-size:32px;font-weight:900;white-space:nowrap}
    .ab-def{position:absolute;top:296px;width:810px;height:96px;border-radius:24px;font-size:42px;font-weight:900;line-height:90px;text-align:center;white-space:nowrap;border:3px solid}
    .ab-eq{position:absolute;left:120px;width:1680px;height:104px;border-radius:26px;background:rgba(36,40,56,.85);border:2px solid var(--line);text-align:center;font-size:46px;font-weight:900;line-height:100px;white-space:nowrap}
    .ab-eq i{font-style:normal;color:var(--muted);font-size:34px;font-weight:800}
    .ab-call{position:absolute;width:720px;text-align:center;font-size:34px;font-weight:900;line-height:1.2}
    .ab-sp{position:absolute;width:400px;text-align:center;font-size:84px;font-weight:900;line-height:100px;white-space:nowrap}
    .ab-op{position:absolute;width:120px;text-align:center;font-size:72px;font-weight:900;line-height:100px;color:var(--muted)}
    .ab-rl{position:absolute;width:400px;text-align:center;font-size:32px;font-weight:900;white-space:nowrap}
    .ab-step{position:absolute;top:288px;width:810px;height:170px;padding:22px 34px 0 120px;border-radius:28px;background:rgba(36,40,56,.9);border:3px solid}
    .ab-step .k{position:absolute;left:30px;top:44px;width:68px;height:68px;border-radius:50%;font-size:40px;font-weight:900;line-height:68px;text-align:center;color:#10131c}
    .ab-step b{display:block;font-size:44px;font-weight:900;line-height:1.2;white-space:nowrap} .ab-step span{display:block;margin-top:8px;font-size:34px;font-weight:800;color:var(--muted);white-space:nowrap}
    .ab-chip{position:absolute;top:300px;height:92px;padding:0 34px;border-radius:24px;background:var(--surface2);border:2px solid var(--line);font-size:50px;font-weight:900;line-height:90px;white-space:nowrap}
    .ab-big{position:absolute;width:400px;height:130px;border-radius:30px;text-align:center;font-size:72px;font-weight:900;line-height:126px;white-space:nowrap;background:rgba(36,40,56,.92);border:3px solid}
    .ab-al{position:absolute;width:300px;text-align:center;font-size:36px;font-weight:900;white-space:nowrap}
    .ab-stamp{position:absolute} .ab-stamp div{transform:rotate(-6deg);padding:2px 26px;border:7px solid var(--bad);border-radius:16px;color:var(--bad);font-size:46px;font-weight:900;letter-spacing:.06em;background:rgba(14,16,24,.88);white-space:nowrap}
    .ab-foot{position:absolute;left:0;right:0;text-align:center;font-size:40px;font-weight:900;white-space:nowrap}
    .ab-tile{position:absolute;top:400px;width:390px;height:250px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .ab-tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .ab-tile .f{margin-top:70px;font-size:78px;font-weight:900;line-height:1;white-space:nowrap} .ab-tile .ch{margin-top:26px;font-size:34px;font-weight:800;color:var(--muted)}
    .ab-tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .ab-rc{top:320px;width:540px;height:560px;text-align:center} .ab-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .ab-rc svg{display:block;margin:14px auto 0} .ab-rc p{margin:14px 20px 0;font-size:35px;font-weight:800;line-height:1.35;white-space:nowrap}
    .ab-mini{height:210px;margin:14px auto 0;display:flex;align-items:center;justify-content:center;gap:22px;font-size:58px;font-weight:900}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', WARM = '#f3a764', GOLD = '#f2c443', PUR = '#8d8df0', GREEN = '#4cc781'
  const CHECK = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const pol = (a, d) => [d * Math.cos((a * Math.PI) / 180), d * Math.sin((a * Math.PI) / 180)]
  const tr = (el, x, y) => el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`)
  // a molecule: centre atom with grey H atoms at the given angles (degrees, y down)
  const mol = (x, y, r, g, l, hs) => {
    const hh = hs.map((a) => pol(a, r + 16))
    return hh.map(([dx, dy]) => `<line x1="${x}" y1="${y}" x2="${x + dx}" y2="${y + dy}" stroke="#c9cee0" stroke-width="7"/>`).join('') +
      hh.map(([dx, dy]) => ball(x + dx, y + dy, 24, 'gray', 'H', 22)).join('') + ball(x, y, r, g, l, r * 0.62)
  }
  const proton = (cls = 'pr', r = 28) => `<g class="${cls}">${ball(0, 0, r, 'gold', sup('H', '+'), r * 0.8)}</g>`
  const bonds = `<line class="bdD" stroke="#c9cee0" stroke-width="7"/><line class="bdA" stroke="#c9cee0" stroke-width="7" style="opacity:0"/>`
  // move the proton from the donor (D) to the acceptor (A) along a throw arc; p in 0..1
  function throwP(c, D, A, p, h = 150) {
    const e = eio(p), x = lerp(D.px, A.px, e), y = lerp(D.py, A.py, e) - h * Math.sin(Math.PI * e)
    tr(c.$('.pr'), x, y)
    const bd = c.$('.bdD'), ba = c.$('.bdA')
    bd.setAttribute('x1', D.x); bd.setAttribute('y1', D.y); bd.setAttribute('x2', x); bd.setAttribute('y2', y); bd.style.opacity = 1 - clamp(e / 0.08)
    ba.setAttribute('x1', A.x); ba.setAttribute('y1', A.y); ba.setAttribute('x2', x); ba.setAttribute('y2', y); ba.style.opacity = clamp((e - 0.92) / 0.08)
  }
  const name = (x, y, html, at, out, cls = '') => `<div class="ab-n ${cls}" style="left:${x - 260}px;top:${y}px" data-at="${at}"${out ? ` data-out="${out}"` : ''} data-fx="fade">${html}</div>`
  const role = (x, y, html, at, cls, out) => `<div class="ab-r ${cls}" style="left:${x - 260}px;top:${y}px" data-at="${at}"${out ? ` data-out="${out}"` : ''} data-fx="pop">${html}</div>`
  const EQL = (x, y, at, s = 1) => `<g data-at="${at}" data-fx="fade"><g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="#a3abbd" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M-38 -9 H38 L24 -23"/><path d="M38 9 H-38 L-24 23"/></g></g>`
  const Hp = 'H<sup>+</sup>'

  // a four-species equation with its two conjugate pairs drawn as arcs (0↔2 above, 1↔3 below)
  const XS = [330, 760, 1160, 1590]
  const eqRow = (top, sp, roles, at) => `
    ${sp.map((h, i) => `<div class="ab-sp" style="left:${XS[i] - 200}px;top:${top}px" data-at="${at}@${[0.05, 0.2, 0.45, 0.6][i]}" data-fx="pop">${h}</div>`).join('')}
    <div class="ab-op" style="left:${545 - 60}px;top:${top}px" data-at="${at}@0.12" data-fx="fade">+</div>
    <div class="ab-op" style="left:${1375 - 60}px;top:${top}px" data-at="${at}@0.52" data-fx="fade">+</div>
    ${roles.map(([h, cls, a], i) => `<div class="ab-rl ${cls}" style="left:${XS[i] - 200}px;top:${top + 112}px" data-at="${a}" data-fx="pop">${h}</div>`).join('')}`
  const arcs = (top, eqAt, a1, a2, c1, c2, l1, l2) => {
    const y1 = top - 8, y2 = top + 172
    return `<svg class="full" viewBox="0 0 1920 1080">${EQL(960, top + 50, eqAt + '@0.35')}
      <path class="arcT" d="M${XS[0]} ${y1} C${XS[0]} ${y1 - 120} ${XS[2]} ${y1 - 120} ${XS[2]} ${y1}" fill="none" stroke="${c1}" stroke-width="6" stroke-linecap="round" data-at="${a1}" data-fx="draw"/>
      <path class="arcB" d="M${XS[1]} ${y2} C${XS[1]} ${y2 + 120} ${XS[3]} ${y2 + 120} ${XS[3]} ${y2}" fill="none" stroke="${c2}" stroke-width="6" stroke-linecap="round" data-at="${a2}" data-fx="draw"/>
      ${l1 ? `<text x="${(XS[0] + XS[2]) / 2}" y="${y1 - 104}" text-anchor="middle" font-size="32" font-weight="900" style="fill:${c1}" data-at="${a1}+0.6" data-fx="fade">${l1}</text>` : ''}
      ${l2 ? `<text x="${(XS[1] + XS[3]) / 2}" y="${y2 + 134}" text-anchor="middle" font-size="32" font-weight="900" style="fill:${c2}" data-at="${a2}+0.6" data-fx="fade">${l2}</text>` : ''}
      ${proton('dT', 20)}${proton('dB', 20)}</svg>`
  }
  // a small proton that runs along each arc once, as it is drawn
  function runArcs(c, a1, a2) {
    for (const [cls, path, at] of [['.dT', '.arcT', a1], ['.dB', '.arcB', a2]]) {
      const el = c.$(cls), pa = c.$(path), t0 = c.at(at), p = eio(c.seg(t0, t0 + 1.1))
      const pt = pa.getPointAtLength(p * pa.getTotalLength())
      tr(el, pt.x, pt.y)
      el.style.opacity = c.t < t0 ? 0 : 1 - c.seg(t0 + 1.2, t0 + 1.6)
    }
  }

  // ---------- intro artwork: faint molecules at the edges ----------
  EZ.intro = {
    chips: [['1@0.3', 'Acids & bases'], ['1@0.55', 'Conjugate pairs'], ['1@0.8', 'Water plays both']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">
      ${mol(190, 290, 50, 'teal', 'O', [130, 50])}${mol(230, 730, 50, 'pur', 'N', [200, 320, 90])}${mol(170, 875, 52, 'green', 'Cl', [0])}
      ${mol(1730, 280, 50, 'teal', 'O', [130, 50, 270])}${mol(1690, 730, 50, 'pur', 'N', [200, 320, 90, 270])}${mol(1760, 880, 50, 'teal', 'O', [180])}
      ${ball(330, 280, 24, 'gold', sup('H', '+'), 19)}${ball(1590, 300, 24, 'gold', sup('H', '+'), 19)}</svg>`,
  }

  // ---------- hook: a game of catch ----------
  const PL = { x: 430, y: 640 }, PR = { x: 1490, y: 640 }
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">The big idea</div><h2 class="h1" data-at="0">A game of catch</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.3" data-fx="pop">${ball(PL.x, PL.y, 100, 'warm')}</g>
        <g data-at="0@0.5" data-fx="pop">${ball(PR.x, PR.y, 100, 'teal')}</g>
        <g data-at="1@0.1" data-fx="pop">${proton('pr', 40)}</g>
        <text x="${PL.x + 130}" y="${PL.y - 140}" font-size="36" font-weight="900" class="f-gold" data-at="1@0.6" data-out="2@0.5" data-fx="fade">the ball = a proton</text><text x="${PL.x}" y="${PL.y + 190}" text-anchor="middle" font-size="34" font-weight="900" class="f-muted" data-at="2@0.3" data-fx="fade">throws it</text>
        <text x="${PL.x}" y="${PL.y + 150}" text-anchor="middle" font-size="54" font-weight="900" class="f-warm" data-at="2" data-fx="pop">ACID</text>
        <text x="${PR.x}" y="${PR.y + 150}" text-anchor="middle" font-size="54" font-weight="900" class="f-teal" data-at="3" data-fx="pop">BASE</text>
        <text x="${PR.x}" y="${PR.y + 190}" text-anchor="middle" font-size="34" font-weight="900" class="f-muted" data-at="3@0.3" data-fx="fade">catches it</text>
        <g data-at="4@0.2" data-fx="pop">${mol(960, 610, 50, 'teal', 'O', [130, 50])}</g>
      </svg>
      <div class="banner" style="top:880px;padding:16px 40px" data-at="4@0.4" data-fx="pop">Water can play <span class="gold">both positions</span></div>`,
    update(c) {
      const b = c.b, p = c.seg(b[2].start + 0.5, b[3].start + 0.3), e = eio(p)
      const x = lerp(PL.x + 70, PR.x - 70, e), y = PL.y - 150 - 230 * Math.sin(Math.PI * e)
      tr(c.$('.pr'), x, y)
      const g = c.$('.pr circle')
      g.parentNode.style.filter = p > 0 && p < 1 ? 'drop-shadow(0 0 16px rgba(242,196,67,.8))' : ''
    },
  })

  // ---------- Brønsted–Lowry definitions: HCl + H2O ----------
  const DY = 610
  const D1 = { x: 620, y: DY, px: 620 + 74, py: DY }, A1 = { x: 1300, y: DY, px: 1300 - 62, py: DY - 22 }
  EZ.scene('define', {
    html: `<div class="kicker" data-at="in" data-fx="left">Brønsted–Lowry</div><h2 class="h1" data-at="0">Acid gives, base takes</h2>
      <div class="ab-def warm" style="left:120px;border-color:var(--warm);background:rgba(243,167,100,.12)" data-at="1" data-fx="pop">Acid = proton (${Hp}) donor</div>
      <div class="ab-def teal" style="left:990px;border-color:var(--accent);background:rgba(60,199,188,.12)" data-at="2" data-fx="pop">Base = proton acceptor</div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="3" data-fx="fade">${bonds}
        ${ball(D1.x, D1.y, 58, 'green', 'Cl', 36)}
        ${mol(A1.x, A1.y, 50, 'teal', 'O', [130, 50])}
        ${proton('pr')}</g></svg>
      ${name(D1.x, 700, 'HCl', '3', '6')}${name(A1.x, 700, 'H<sub>2</sub>O', '3', '6')}
      ${name(D1.x, 700, 'Cl<sup>−</sup><small>chloride</small>', '6@0.2')}${name(A1.x, 700, 'H<sub>3</sub>O<sup>+</sup><small>hydronium</small>', '6@0.55')}
      ${role(D1.x, 772, 'acid: donates ' + Hp, '4@0.6', 'warm', '6')}${role(A1.x, 772, 'base: accepts ' + Hp, '5@0.3', 'teal', '6')}
      <div class="ab-call gold" style="left:${A1.x - 360}px;top:420px" data-at="7@0.5" data-fx="fade">${Hp} never alone in water:<br>it sits on H<sub>2</sub>O as H<sub>3</sub>O<sup>+</sup></div>
      <div class="ab-eq" style="top:860px" data-at="6@0.8">HCl<i>(aq)</i> + H<sub>2</sub>O<i>(l)</i> → H<sub>3</sub>O<sup>+</sup><i>(aq)</i> + Cl<sup>−</sup><i>(aq)</i></div>`,
    update(c) {
      const b = c.b
      throwP(c, D1, A1, c.seg(b[4].start + 0.5, b[4].start + 2.0), 130)
    },
  })

  // ---------- the same water, as an acid: NH3 + H2O ----------
  const D2 = { x: 620, y: DY, px: 620 + 66 * Math.cos(-0.17), py: DY - 66 * Math.sin(0.17) }, A2 = { x: 1300, y: DY, px: 1300 - 64, py: DY - 18 }
  EZ.scene('ammonia', {
    html: `<div class="kicker" data-at="in" data-fx="left">A different partner</div><h2 class="h1" data-at="0">Now water is the acid</h2>
      <div class="ab-eq" style="top:296px" data-at="3@0.4">NH<sub>3</sub><i>(aq)</i> + H<sub>2</sub>O<i>(l)</i> ⇌ NH<sub>4</sub><sup>+</sup><i>(aq)</i> + OH<sup>−</sup><i>(aq)</i></div>
      <svg class="full" viewBox="0 0 1920 1080">${bonds}
        <g data-at="in" data-fx="fade">${mol(D2.x, D2.y, 50, 'teal', 'O', [140])}</g>
        <g data-at="0@0.5" data-fx="pop">${mol(A2.x, A2.y, 48, 'pur', 'N', [320, 60, 120])}</g>
        ${proton('pr')}</svg>
      ${name(D2.x, 700, 'H<sub>2</sub>O', 'in', '3')}${name(A2.x, 700, 'NH<sub>3</sub><small>ammonia</small>', '0@0.5', '3')}
      ${name(D2.x, 700, 'OH<sup>−</sup>', '3@0.2')}${name(A2.x, 700, 'NH<sub>4</sub><sup>+</sup>', '3@0.5')}
      ${role(D2.x, 772, 'acid: donates ' + Hp, '1@0.7', 'warm', '3')}${role(A2.x, 772, 'base: accepts ' + Hp, '2@0.3', 'teal', '3')}
      <div class="banner" style="top:870px;padding:16px 40px" data-at="4" data-fx="pop">Same water, opposite job: <span class="gold">it depends on the partner</span></div>`,
    update(c) {
      const b = c.b
      throwP(c, D2, A2, c.seg(b[1].start + 0.6, b[1].start + 2.1), 130)
    },
  })

  // ---------- conjugate pairs ----------
  const CT = 480
  EZ.scene('conjugate', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Conjugate pairs</div><h2 class="h1" data-at="0">What’s left after the throw</h2>
      ${arcs(CT, '0', '3', '4', TEAL, WARM, 'pair: differ by one H⁺', 'pair: differ by one H⁺')}
      ${eqRow(CT, ['NH<sub>3</sub>', 'H<sub>2</sub>O', 'NH<sub>4</sub><sup>+</sup>', 'OH<sup>−</sup>'],
        [['base', 'teal', '3@0.2'], ['acid', 'warm', '4@0.2'], ['conjugate acid', 'teal', '3@0.6'], ['conjugate base', 'warm', '4@0.6']], '0')}
      <div data-at="in" data-out="3" data-fx="fade">
        <div class="ab-def" style="left:120px;top:830px;border-color:var(--warm);background:rgba(243,167,100,.1)" data-at="1" data-fx="pop"><span class="warm">acid</span> − ${Hp} ${ARR} <span class="warm">conjugate base</span></div>
        <div class="ab-def" style="left:990px;top:830px;border-color:var(--accent);background:rgba(60,199,188,.1)" data-at="2" data-fx="pop"><span class="teal">base</span> + ${Hp} ${ARR} <span class="teal">conjugate acid</span></div></div>
      <div class="banner" style="top:880px;padding:16px 40px" data-at="5" data-out="6" data-fx="pop">Every acid–base reaction has <span class="gold">two conjugate pairs</span></div>
      <div class="banner" style="top:880px;padding:16px 40px" data-at="6" data-fx="pop">A conjugate pair differs by <span class="gold">exactly one ${Hp}</span></div>`,
    update(c) { runArcs(c, '3', '4') },
  })

  // ---------- amphoteric ----------
  const AY = 600
  const arrow = (x1, x2, y, col, mk, at) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${col}" stroke-width="8" marker-end="url(#mk-${mk})" data-at="${at}" data-fx="draw"/>`
  EZ.scene('amphoteric', {
    html: `<div class="kicker" data-at="in" data-fx="left">Both positions</div><h2 class="h1" data-at="0">Water is amphoteric</h2>
      <div data-at="in" data-out="3" data-fx="fade">
        <svg class="full" viewBox="0 0 1920 1080">
          <g data-at="in" data-fx="pop">${mol(960, AY, 50, 'teal', 'O', [130, 50])}</g>
          ${arrow(860, 620, AY, TEAL, 'teal', '0@0.2')}${arrow(1060, 1300, AY, WARM, 'warm', '1@0.2')}
          <text x="740" y="${AY - 30}" text-anchor="middle" font-size="34" font-weight="900" class="f-teal" data-at="0@0.3" data-fx="fade">accepts H<tspan dy="-14" font-size="22">+</tspan></text>
          <text x="1180" y="${AY - 30}" text-anchor="middle" font-size="34" font-weight="900" class="f-warm" data-at="1@0.3" data-fx="fade">donates H<tspan dy="-14" font-size="22">+</tspan></text>
          <g data-at="0@0.5" data-fx="pop">${mol(470, AY, 50, 'teal', 'O', [130, 50, 270])}</g>
          <g data-at="1@0.5" data-fx="pop">${mol(1450, AY, 50, 'teal', 'O', [130])}</g>
        </svg>
        ${name(960, 690, 'H<sub>2</sub>O', 'in')}${name(470, 690, 'H<sub>3</sub>O<sup>+</sup>', '0@0.5', '', 'teal')}${name(1450, 690, 'OH<sup>−</sup>', '1@0.5', '', 'warm')}
        <div class="ab-foot" style="top:770px;font-size:34px;color:var(--muted)" data-at="1@0.7" data-fx="fade">which one depends on its partner</div>
        <div class="banner" style="top:860px;padding:16px 40px" data-at="2" data-fx="pop">Acid <em style="font-style:normal" class="muted">or</em> base: <span class="gold">amphoteric</span> <span class="muted" style="font-size:40px">(amphiprotic)</span></div>
      </div>
      <div data-at="3" data-fx="fade">
        <div class="ab-chip" style="left:120px" data-at="3@0.1" data-fx="pop">H<sub>2</sub>O</div>
        <div class="ab-chip" style="left:400px" data-at="3@0.4" data-fx="pop">HCO<sub>3</sub><sup>−</sup></div>
        <div class="ab-chip" style="left:740px" data-at="3@0.6" data-fx="pop">HSO<sub>4</sub><sup>−</sup></div>
        <div class="ab-chip" style="left:1070px" data-at="3@0.85" data-fx="pop">H<sub>2</sub>PO<sub>4</sub><sup>−</sup></div>
        <div class="ab-foot" style="left:1430px;right:auto;top:322px;font-size:36px;color:var(--muted)" data-at="3@0.9" data-fx="fade">all amphoteric</div>
        <div class="ab-big" style="left:760px;top:560px;border-color:var(--primary)" data-at="4" data-fx="pop">HCO<sub>3</sub><sup>−</sup></div>
        <svg class="full" viewBox="0 0 1920 1080">
          ${arrow(740, 560, 625, WARM, 'warm', '4@0.3')}${arrow(1180, 1360, 625, TEAL, 'teal', '5@0.2')}
          <text x="650" y="590" text-anchor="middle" font-size="34" font-weight="900" class="f-warm" data-at="4@0.35" data-fx="fade">− H<tspan dy="-14" font-size="22">+</tspan></text>
          <text x="1270" y="590" text-anchor="middle" font-size="34" font-weight="900" class="f-teal" data-at="5@0.25" data-fx="fade">+ H<tspan dy="-14" font-size="22">+</tspan></text>
          ${proton('t1', 22)}${proton('t2', 22)}
        </svg>
        <div class="ab-big" style="left:140px;top:560px;border-color:var(--warm)" data-at="4@0.6" data-fx="pop">CO<sub>3</sub><sup>2−</sup></div>
        <div class="ab-big" style="left:1380px;top:560px;border-color:var(--accent)" data-at="5@0.6" data-fx="pop">H<sub>2</sub>CO<sub>3</sub></div>
        <div class="ab-al warm" style="left:190px;top:716px" data-at="4@0.7" data-fx="fade">as an acid</div>
        <div class="ab-al teal" style="left:1430px;top:716px" data-at="5@0.7" data-fx="fade">as a base</div>
      </div>`,
    update(c) {
      const b = c.b
      const run = (cls, at, x0, x1, y) => { const t0 = at, p = eio(c.seg(t0, t0 + 1)); tr(c.$(cls), lerp(x0, x1, p), y - 34); c.$(cls).style.opacity = c.t < t0 ? 0 : 1 - c.seg(t0 + 1, t0 + 1.4) }
      run('.t1', b[4].start + 0.5, 740, 560, 625)
      run('.t2', b[5].start + 0.4, 1360, 1180, 625)
    },
  })

  // ---------- follow the H ----------
  const HT = 590
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Follow the H</h2>
      <div class="ab-step" style="left:120px;border-color:var(--warm)" data-at="1" data-fx="pop"><div class="k" style="background:${WARM}">1</div><b>Lost an H? <span class="warm" style="display:inline;color:var(--warm)">It was the acid</span></b><span>what’s left = its conjugate base</span></div>
      <div class="ab-step" style="left:990px;border-color:var(--accent)" data-at="2" data-fx="pop"><div class="k" style="background:${TEAL}">2</div><b>Gained an H? <span class="teal" style="display:inline;color:var(--accent)">It was the base</span></b><span>the result = its conjugate acid</span></div>
      ${arcs(HT, '3', '4@0.3', '5@0.3', WARM, TEAL, '', '')}
      ${eqRow(HT, ['HF', 'H<sub>2</sub>O', 'F<sup>−</sup>', 'H<sub>3</sub>O<sup>+</sup>'],
        [['lost H: acid', 'warm', '4@0.5'], ['gained H: base', 'teal', '5@0.5'], ['conjugate base', 'warm', '4@0.8'], ['conjugate acid', 'teal', '5@0.8']], '3')}
      <div class="banner" style="top:900px;padding:16px 40px" data-at="6" data-fx="pop">Lose ${Hp} ${ARR} charge one <span class="gold">more negative</span> &nbsp;<span class="muted" style="font-size:42px">(HF ${ARR} F<sup>−</sup>)</span></div>`,
    update(c) { runArcs(c, '4@0.3', '5@0.3') },
  })

  // ---------- the trap: Lewis is not tested ----------
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Watch out</div><h2 class="h1" data-at="0">Which definition counts?</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:560px" data-at="1"><h3 class="muted">Lewis acids &amp; bases</h3>
        <svg style="position:absolute;left:0;top:110px" width="810" height="300" viewBox="0 0 810 300">
          ${ball(260, 150, 70, 'gray')}${ball(560, 150, 70, 'gray')}
          <circle cx="342" cy="136" r="9" fill="#eef0f7"/><circle cx="342" cy="166" r="9" fill="#eef0f7"/>
          <line x1="372" y1="150" x2="474" y2="150" stroke="#a3abbd" stroke-width="7" marker-end="url(#mk-muted)"/>
          <text x="405" y="280" text-anchor="middle" font-size="34" font-weight="900" class="f-muted">electron-pair donors / acceptors</text></svg>
        <div class="ab-stamp" style="left:270px;top:440px" data-at="2@0.4" data-fx="pop"><div>NOT TESTED</div></div></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:560px;border-color:rgba(76,199,129,.7)" data-at="3"><h3 class="good">Brønsted–Lowry</h3>
        <svg style="position:absolute;left:0;top:110px" width="810" height="300" viewBox="0 0 810 300">
          ${ball(240, 160, 70, 'warm')}${ball(570, 160, 70, 'teal')}${proton('pr', 30)}
          <text x="405" y="290" text-anchor="middle" font-size="34" font-weight="900" class="f-good">proton transfer in water</text></svg>
        <div style="position:absolute;right:30px;top:22px;width:72px;height:72px" data-at="3@0.6" data-fx="pop">${CHECK}</div></div>
      <div class="banner" style="top:880px;padding:16px 40px" data-at="3@0.4" data-fx="pop">Stick with <span class="good">proton transfer</span></div>`,
    update(c) {
      const b = c.b, p = eio(c.seg(b[3].start + 0.3, b[3].start + 1.6))
      tr(c.$('.pr'), lerp(320, 490, p), 160 - 110 * Math.sin(Math.PI * p) - 0)
    },
  })

  // ---------- try it ----------
  const OPTS = [['A', 'H<sub>3</sub>PO<sub>4</sub>', 'its conjugate acid', '6@0.2'], ['B', 'HPO<sub>4</sub><sup>2−</sup>', 'one H<sup>+</sup> removed', '5@0.1'],
    ['C', 'PO<sub>4</sub><sup>3−</sup>', '', ''], ['D', 'H<sub>2</sub>PO<sub>4</sub><sup>2−</sup>', '', '']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">What is the <span class="teal">conjugate base</span> of H<sub>2</sub>PO<sub>4</sub><sup>−</sup>?</h2>
      ${OPTS.map(([l, f, ch, at], i) => `<div class="ab-tile t${i}" style="left:${120 + i * 430}px" data-at="2@${0.05 + i * 0.24}" data-fx="pop"><div class="l">${l}</div>
        ${i === 1 ? `<div class="ok">${CHECK}</div>` : ''}
        <div class="f">${f}</div>${ch ? `<div class="ch" data-at="${at}" data-fx="fade">${ch}</div>` : ''}</div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="820" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="820" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 820)"/>
        <text class="num" x="960" y="846" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="950" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:760px" data-at="5" data-fx="pop">Remove one ${Hp} ${ARR} lower the charge by <span class="gold">1</span></div>`,
    update(c) {
      const b = c.b, t0 = b[3].start + 0.3, t1 = b[4].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[4].start + 0.4, b[4].start + 0.9))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 1) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const m1 = `<svg width="460" height="210" viewBox="0 0 460 210">${ball(90, 110, 52, 'warm')}${ball(370, 110, 52, 'teal')}
    <line x1="160" y1="110" x2="296" y2="110" stroke="${GOLD}" stroke-width="6" stroke-dasharray="10 9" marker-end="url(#mk-gold)"/>${ball(230, 60, 24, 'gold', sup('H', '+'), 19)}</svg>`
  const m2 = `<div class="ab-mini"><span class="teal">NH<sub>4</sub><sup>+</sup></span><span class="muted" style="font-size:50px">/</span><span class="teal">NH<sub>3</sub></span></div>`
  const m3 = `<svg width="460" height="210" viewBox="0 0 460 210">${mol(230, 110, 44, 'teal', 'O', [130, 50])}
    <line x1="160" y1="96" x2="60" y2="96" stroke="${TEAL}" stroke-width="6" marker-end="url(#mk-teal)"/><line x1="300" y1="96" x2="400" y2="96" stroke="${WARM}" stroke-width="6" marker-end="url(#mk-warm)"/>
    <text x="70" y="70" font-size="26" font-weight="900" class="f-teal">base</text><text x="340" y="70" font-size="26" font-weight="900" class="f-warm">acid</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card ab-rc" style="left:120px" data-at="1"><div class="n">1</div>${m1}<p>Acid = ${Hp} <span class="warm">donor</span><br>Base = ${Hp} <span class="teal">acceptor</span></p></div>
      <div class="card ab-rc" style="left:690px" data-at="2"><div class="n">2</div>${m2}<p>Conjugate pairs<br>differ by exactly<br><span class="gold">one ${Hp}</span></p></div>
      <div class="card ab-rc" style="left:1260px" data-at="3"><div class="n">3</div>${m3}<p>Water is <span class="pri">amphoteric</span>:<br>it can act as<br>an acid or a base</p></div>`,
  })
})()
