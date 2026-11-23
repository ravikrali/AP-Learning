// Pictures for chem-4.9 "Balancing Redox with Half-Reactions". One EZ.scene per scene id in
// script.mjs. Every equation and number shown is the lesson's own (app/src/content/chem/u4.ts).
// Colours: oxidation = warm, reduction = purple, H2O = teal, H+ = green, electrons = gold.
// Atom and ion balls are not drawn to scale.
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .rx-eq{position:absolute;font-size:52px;font-weight:900;white-space:nowrap} .rx-eq span[data-at]{display:inline-block}
    .rx-eq .ar{color:var(--muted);margin:0 4px}
    .rx-lab{position:absolute;left:36px;top:22px;font-size:26px;font-weight:900;letter-spacing:.14em;text-transform:uppercase}
    .rx-row{position:absolute;left:120px;width:1680px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .rx-tag{position:absolute;height:62px;padding:0 24px;border-radius:18px;font-size:32px;font-weight:900;line-height:58px;white-space:nowrap;border:3px solid}
    .rx-sub{position:absolute;left:120px;top:272px;font-size:34px;font-weight:800;color:var(--muted);white-space:nowrap}
    .rx-x{position:relative;display:inline-block} .rx-x i{position:absolute;left:-6px;right:-6px;top:50%;height:7px;margin-top:-2px;border-radius:4px;background:var(--bad)}
    .rx-step{position:absolute;top:320px;width:390px;height:430px;text-align:center}
    .rx-step .n{margin:28px auto 0;width:96px;height:96px;border-radius:50%;font-size:58px;font-weight:900;line-height:96px;color:#10131c}
    .rx-step svg{display:block;margin:14px auto 0}
    .rx-step p{margin:10px 0 0;font-size:31px;font-weight:800;line-height:1.3;white-space:nowrap}
    .rx-chip{position:absolute;top:700px;width:400px;height:150px;padding:26px 0 0 98px;border-radius:24px;background:rgba(36,40,56,.92);border:3px solid var(--line)}
    .rx-chip .n{position:absolute;left:22px;top:38px;width:62px;height:62px;border-radius:50%;font-size:36px;font-weight:900;line-height:62px;text-align:center;color:#10131c}
    .rx-chip b{display:block;font-size:32px;font-weight:900;white-space:nowrap} .rx-chip span{display:block;margin-top:8px;font-size:25px;font-weight:800;color:var(--muted);white-space:nowrap}
    .rx-ch{position:absolute;left:0;right:0;top:74px;text-align:center;font-size:32px;font-weight:900;white-space:nowrap}
    .rx-stamp{position:absolute} .rx-stamp div{transform:rotate(-8deg);padding:2px 26px;border:7px solid;border-radius:16px;font-size:46px;font-weight:900;letter-spacing:.06em;background:rgba(14,16,24,.9);white-space:nowrap}
    .rx-ctx{position:absolute;left:120px;top:282px;font-size:40px;font-weight:900;white-space:nowrap}
    .rx-tile{position:absolute;top:370px;width:390px;height:190px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .rx-tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .rx-tile .f{margin-top:76px;font-size:64px;font-weight:900;line-height:1}
    .rx-tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .rx-line{position:absolute;left:120px;width:1680px;height:100px;border-radius:24px;background:rgba(36,40,56,.75);border:2px solid var(--line);padding:22px 40px 0;font-size:42px;font-weight:900;white-space:nowrap}
    .rx-rc{top:320px;width:540px;height:560px;text-align:center} .rx-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rx-rc svg{display:block;margin:14px auto 0} .rx-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const GOLD = '#f2c443', WARM = '#f3a764', PUR = '#8d8df0', TEAL = '#3cc7bc', GREEN = '#4cc781', RED = '#f0707a'
  const E = (n = '') => `<span class="gold">${n}e<sup>−</sup></span>`
  const ar = ' <span class="ar">→</span> '
  const MNO4 = 'MnO<sub>4</sub><sup>−</sup>', H2O = 'H<sub>2</sub>O'
  const ion = (s, q) => `${s}<sup>${q}</sup>`
  const place = (el, x, y) => el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`)
  const elec = (x, y, r = 16) => ball(x, y, r, 'gold')
  const CHECK = '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'

  // ---------- intro artwork: faint atoms and electrons at the edges ----------
  EZ.intro = {
    chips: [['1@0.3', 'Split in two'], ['1@0.55', 'Balance each half'], ['1@0.8', 'Put it back together']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">
      ${ball(190, 300, 56, 'gray', 'Zn', 34)}${elec(290, 240)}${elec(300, 360)}${ball(220, 620, 56, 'warm', sup('Cu', '2+'), 30)}${elec(150, 780)}${elec(260, 860)}
      ${ball(1730, 300, 56, 'warm', sup('Fe', '2+'), 30)}${elec(1630, 240)}${ball(1700, 600, 56, 'pur', sup('Mn', '2+'), 30)}${elec(1620, 700)}${elec(1780, 820)}</svg>`,
  }

  // ---------- hook: one tricky reaction ----------
  const slot = (i) => `<span style="display:inline-block;margin:0 10px 0 0;width:70px;height:80px;border:3px dashed var(--line);border-radius:16px;text-align:center;line-height:72px;font-size:46px" class="gold qn${i}">?</span>`
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">The problem</div><h2 class="h1" data-at="0">A reaction that looks simple</h2>
      <div class="card" style="left:120px;top:300px;width:1680px;height:170px" data-at="1-0.2">
        <div class="rx-eq" style="left:0;right:0;top:46px;text-align:center;font-size:58px">${slot(0)}<span>${MNO4}</span> + ${slot(1)}<span>${ion('Fe', '2+')}</span>${ar}${slot(2)}<span>${ion('Mn', '2+')}</span> + ${slot(3)}<span>${ion('Fe', '3+')}</span></div></div>
      <div class="rx-tag" style="left:120px;top:500px;border-color:var(--bad);background:rgba(240,112,122,.12)" data-at="2@0.1" data-out="4" data-fx="pop"><span class="bad">trial and error: guess, check, guess again…</span></div>
      <div class="rx-tag" style="left:120px;top:590px;border-color:var(--accent);background:rgba(60,199,188,.12)" data-at="3@0.05" data-out="4" data-fx="pop"><span class="teal">4 oxygens: where do they go?</span></div>
      <div class="rx-tag" style="left:760px;top:590px;border-color:var(--warm);background:rgba(243,167,100,.12)" data-at="3@0.55" data-out="4" data-fx="pop"><span class="warm">how many irons?</span></div>
      <div class="card" style="left:120px;top:520px;width:810px;height:220px" data-at="4@0.25"><div class="rx-lab warm">Oxidation half</div>
        <div class="rx-eq" style="left:40px;top:96px">${ion('Fe', '2+')}${ar}${ion('Fe', '3+')}</div></div>
      <div class="card" style="left:990px;top:520px;width:810px;height:220px" data-at="4@0.35"><div class="rx-lab pri">Reduction half</div>
        <div class="rx-eq" style="left:40px;top:96px">${MNO4}${ar}${ion('Mn', '2+')}</div></div>
      <div class="banner" style="top:790px;padding:16px 40px" data-at="4@0.6" data-fx="pop">Two halves ${ARR} a clean, <span class="gold">step-by-step recipe</span></div>`,
    update(c) {
      const b = c.b, on = c.t > b[2].start + 0.2 && c.t < b[4].start
      for (let i = 0; i < 4; i++) c.$('.qn' + i).textContent = on ? String(((Math.floor(c.t * 5) * 7 + i * 3) % 9) + 1) : '?'
    },
  })

  // ---------- half-reactions: zinc gives electrons to copper(II) ----------
  const ZX = 560, CX = 1360, PY = 420
  EZ.scene('halves', {
    html: `<div class="kicker" data-at="in" data-fx="left">Half-reactions</div><h2 class="h1" data-at="in+0.2">Two halves, with electrons</h2>
      <div class="rx-sub" data-at="0@0.3" data-fx="fade">only the <span class="warm">oxidation</span> part, or only the <span class="pri">reduction</span> part, with its <span class="gold">electrons</span></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="0@0.6" data-fx="fade">
        <g class="zn0">${ball(ZX, PY, 60, 'gray', 'Zn', 38)}</g><g class="zn1">${ball(ZX, PY, 60, 'gray', sup('Zn', '2+'), 34)}</g>
        <g class="cu0">${ball(CX, PY, 60, 'warm', sup('Cu', '2+'), 34)}</g><g class="cu1">${ball(CX, PY, 60, 'warm', 'Cu', 38)}</g>
        <text x="${ZX}" y="${PY + 100}" text-anchor="middle" font-size="32" font-weight="900" class="f-warm">oxidation</text>
        <text x="${CX}" y="${PY + 100}" text-anchor="middle" font-size="32" font-weight="900" class="f-pri">reduction</text></g>
        <g class="el"><g class="e0">${elec(0, 0)}</g><g class="e1">${elec(0, 0)}</g><text class="elt f-gold" text-anchor="middle" font-size="32" font-weight="900">${sup('2e', '−')}</text></g>
      </svg>
      <div class="card" style="left:120px;top:560px;width:810px;height:300px" data-at="1"><div class="rx-lab warm">Oxidation</div>
        <div class="rx-eq" style="left:40px;top:76px">Zn(s)${ar}${ion('Zn', '2+')}(aq) + ${E('2')}</div>
        <div class="rx-tag" style="left:40px;top:162px;border-color:var(--gold);background:rgba(242,196,67,.12)" data-at="4" data-fx="pop"><span class="gold">e<sup>−</sup> are products: lost</span></div>
        <div style="position:absolute;left:40px;top:238px;font-size:30px;font-weight:800;white-space:nowrap" class="muted" data-at="7@0.2" data-fx="fade">charge: <b style="color:var(--text)">0</b> on the left, <b style="color:var(--text)">(+2) + (−2) = 0</b> on the right <span class="good">✓</span></div></div>
      <div class="card" style="left:990px;top:560px;width:810px;height:300px" data-at="2"><div class="rx-lab pri">Reduction</div>
        <div class="rx-eq" style="left:40px;top:76px">${ion('Cu', '2+')}(aq) + ${E('2')}${ar}Cu(s)</div>
        <div class="rx-tag" style="left:40px;top:162px;border-color:var(--gold);background:rgba(242,196,67,.12)" data-at="5" data-fx="pop"><span class="gold">e<sup>−</sup> are reactants: gained</span></div></div>
      <div class="banner" style="top:890px;padding:16px 40px" data-at="6" data-fx="pop">Each half balances in <span class="teal">atoms</span> AND <span class="gold">charge</span></div>`,
    update(c) {
      const b = c.b, t = c.t
      const tLeave = b[1].start + 0.8, tMid = b[1].end, tGo = b[2].start + 0.2, tArr = b[2].start + 1.8
      let x
      if (t < tLeave) x = ZX + 72
      else if (t < tMid) x = lerp(ZX + 72, 960, eio(c.seg(tLeave, tMid)))
      else if (t < tGo) x = 960
      else x = lerp(960, CX - 72, eio(c.seg(tGo, tArr)))
      const bob = t > tLeave && t < tArr ? 6 * Math.sin(t * 5) : 0
      place(c.$('.e0'), x, PY - 22 + bob); place(c.$('.e1'), x, PY + 22 - bob)
      c.$('.elt').setAttribute('x', x.toFixed(1)); c.$('.elt').setAttribute('y', (PY - 62).toFixed(1))
      c.$('.el').style.opacity = c.seg(b[1].start, b[1].start + 0.4) * (1 - c.seg(tArr, tArr + 0.3))
      const zl = c.seg(tLeave, tLeave + 0.3), cl = c.seg(tArr, tArr + 0.3)
      c.$('.zn0').style.opacity = 1 - zl; c.$('.zn1').style.opacity = zl
      c.$('.cu0').style.opacity = 1 - cl; c.$('.cu1').style.opacity = cl
      const glow = c.seg(b[3].start, b[3].start + 0.4)
      for (const el of c.root.querySelectorAll('.rx-eq .gold')) el.style.textShadow = glow ? `0 0 ${18 * glow}px rgba(242,196,67,${0.9 * glow})` : ''
    },
  })

  // ---------- the rule: electrons lost = electrons gained ----------
  const LX = 200, RX = 610, RY = 250
  EZ.scene('rule', {
    html: `<div class="kicker" data-at="in" data-fx="left">The key rule</div><h2 class="h1" data-at="0">Electrons lost = electrons gained</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:560px" data-at="1-0.3"><h3>Transferred, not created</h3>
        <svg style="position:absolute;left:0;top:0" width="810" height="560" viewBox="0 0 810 560">
          <circle cx="${LX}" cy="${RY}" r="96" fill="rgba(243,167,100,.12)" stroke="${WARM}" stroke-width="4"/><text x="${LX}" y="${RY + 12}" text-anchor="middle" font-size="32" font-weight="900" class="f-warm">oxidation</text>
          <circle cx="${RX}" cy="${RY}" r="96" fill="rgba(141,141,240,.12)" stroke="${PUR}" stroke-width="4"/><text x="${RX}" y="${RY + 12}" text-anchor="middle" font-size="32" font-weight="900" class="f-pri">reduction</text>
          ${[0, 1, 2].map((i) => `<g class="rx-h${i}">${elec(0, 0, 18)}</g>`).join('')}
          <g data-at="2@0.2" data-fx="fade"><text x="${LX}" y="430" text-anchor="middle" font-size="38" font-weight="900" class="f-gold">${sup('e', '−')}<tspan dy=".31em"> lost</tspan></text>
            <text x="${(LX + RX) / 2}" y="440" text-anchor="middle" font-size="70" font-weight="900">=</text>
            <text x="${RX}" y="430" text-anchor="middle" font-size="38" font-weight="900" class="f-gold">${sup('e', '−')}<tspan dy=".31em"> gained</tspan></text></g>
        </svg></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:560px" data-at="3"><h3>Quick check</h3>
        <div class="rx-eq" style="left:40px;top:110px;font-size:50px">Fe(s)${ar}${ion('Fe', '2+')}(aq) + ${E('2')}</div>
        <div style="position:absolute;left:40px;top:196px;font-size:40px;font-weight:900" data-at="3@0.6" data-fx="fade">Is iron <span class="warm">oxidized</span> or <span class="pri">reduced</span>?</div>
        <div class="rx-tag" style="left:40px;top:280px;border-color:var(--gold);background:rgba(242,196,67,.12)" data-at="4@0.1" data-fx="pop"><span class="gold">e<sup>−</sup> are products: lost</span></div>
        <div style="position:absolute;left:40px;top:368px;font-size:36px;font-weight:900;white-space:nowrap" data-at="4@0.55" data-fx="fade">oxidation number: <span class="muted">0</span> ${ARR} <span class="warm">+2</span> (rises)</div>
        <div class="rx-stamp" style="left:250px;top:440px" data-at="5" data-fx="pop"><div style="border-color:var(--warm);color:var(--warm)">OXIDIZED</div></div></div>`,
    update(c) {
      const b = c.b
      for (let i = 0; i < 3; i++) {
        const t0 = b[1].start + 0.2 + i * 0.55, p = eio(c.seg(t0, t0 + 1.0))
        const x = lerp(LX + 60, RX - 60, p), y = RY - 40 - Math.sin(Math.PI * p) * 110
        place(c.$('.rx-h' + i), x, y)
        c.$('.rx-h' + i).style.opacity = c.seg(t0 - 0.3, t0) * (1 - 0.6 * c.seg(t0 + 1.0, t0 + 1.3))
      }
    },
  })

  // ---------- the O-H-E recipe ----------
  const water = `<svg width="200" height="110" viewBox="-100 -55 200 110">${ball(-46, 22, 24, 'gray', 'H', 22)}${ball(46, 22, 24, 'gray', 'H', 22)}${ball(0, -6, 40, 'red', 'O', 34)}</svg>`
  const hplus = `<svg width="200" height="110" viewBox="-100 -55 200 110">${ball(0, 0, 34, 'gray', sup('H', '+'), 30)}</svg>`
  const elecs = `<svg width="200" height="110" viewBox="-100 -55 200 110">${elec(-40, 0, 22)}${elec(10, -16, 22)}${elec(50, 18, 22)}</svg>`
  const others = `<svg width="200" height="110" viewBox="-100 -55 200 110">${ball(-50, 0, 34, 'gray')}<text x="0" y="16" text-anchor="middle" font-size="44" font-weight="900" class="f-muted">=</text>${ball(50, 0, 34, 'gray')}</svg>`
  const STEPS = [['1', '#aab1c4', others, 'Balance atoms<br>other than O and H'], ['O', TEAL, water, `add <span class="teal">H<sub>2</sub>O</span> to the side<br>that needs O`],
    ['H', GREEN, hplus, `add <span class="good">H<sup>+</sup></span> to the side<br>that needs H`], ['E', GOLD, elecs, `add <span class="gold">e<sup>−</sup></span> to<br>balance the charge`]]
  EZ.scene('recipe', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">The recipe</div><h2 class="h1" data-at="0@0.3">In acid, remember “O-H-E”</h2>
      ${STEPS.map(([n, col, pic, txt], i) => `<div class="card rx-step st${i}" style="left:${120 + i * 430}px" data-at="${i + 1}"><div class="n" style="background:${col}">${n}</div>${pic}<p>${txt}</p></div>`).join('')}
      <div class="banner" style="top:800px;padding:18px 40px" data-at="5" data-fx="pop">Then make the <span class="gold">e<sup>−</sup> equal</span> ${ARR} add the halves ${ARR} <span class="bad">cancel</span></div>`,
    update(c) {
      const b = c.b
      const cols = ['rgba(170,177,196,', 'rgba(60,199,188,', 'rgba(76,199,129,', 'rgba(242,196,67,']
      for (let i = 0; i < 4; i++) {
        const k = c.seg(b[i + 1].start, b[i + 1].start + 0.3) * (1 - c.seg(b[i + 1].end + 0.2, b[i + 1].end + 0.6))
        c.$('.st' + i).style.borderColor = k ? `${cols[i]}${0.9 * k})` : ''
        c.$('.st' + i).style.boxShadow = k ? `0 0 ${50 * k}px ${cols[i]}${0.35 * k})` : ''
      }
    },
  })

  // ---------- worked example: building the permanganate half ----------
  const chip = (i, at, col, n, a, s) => `<div class="rx-chip" style="left:${120 + i * 427}px;border-color:${col}" data-at="${at}" data-fx="pop"><div class="n" style="background:${col}">${n}</div><b>${a}</b><span>${s}</span></div>`
  EZ.scene('example', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">${MNO4} + ${ion('Fe', '2+')}, in acid</h2>
      <div class="rx-row" style="top:300px;height:150px" data-at="1"><div class="rx-lab warm">Oxidation</div>
        <div class="rx-eq" style="left:40px;top:66px">${ion('Fe', '2+')}(aq)${ar}${ion('Fe', '3+')}(aq) + ${E()}</div></div>
      <div class="rx-row" style="top:478px;height:180px" data-at="2"><div class="rx-lab pri">Reduction</div>
        <div class="rx-eq" style="left:40px;top:80px"><span>${MNO4}(aq)</span> <span data-at="5@0.55" data-fx="pop">+ <span class="good">8H<sup>+</sup>(aq)</span></span> <span data-at="6@0.75" data-fx="pop">+ ${E('5')}</span>${ar}<span>${ion('Mn', '2+')}(aq)</span> <span data-at="4@0.6" data-fx="pop">+ <span class="teal">4${H2O}(l)</span></span></div></div>
      ${chip(0, '3', '#aab1c4', '1', 'Mn: 1 = 1', 'already balanced')}
      ${chip(1, '4@0.3', TEAL, 'O', 'O: 4 = 4', `add 4 H<sub>2</sub>O on the right`)}
      ${chip(2, '5@0.3', GREEN, 'H', 'H: 8 = 8', `add 8 H<sup>+</sup> on the left`)}
      ${chip(3, '6@0.3', GOLD, 'E', 'charge: +7 vs +2', `add 5 e<sup>−</sup> on the left`)}
      <div class="banner" style="top:890px;padding:16px 40px" data-at="7" data-fx="pop">Reduction half: <span class="teal">atoms</span> ✓ &nbsp;<span class="gold">charge</span> ✓ &nbsp;(+2 = +2)</div>`,
  })

  // ---------- combine: equal electrons, add, cancel, check ----------
  const five = (at) => `<span class="gold" data-at="${at}" data-fx="pop">5</span>`
  EZ.scene('combine', {
    html: `<div class="kicker" data-at="in" data-fx="left">Put it together</div><h2 class="h1" data-at="0">Make the electrons equal</h2>
      <div class="rx-row" style="top:300px;height:130px" data-at="0@0.3"><div class="rx-eq" style="left:40px;top:38px">${five('2@0.5')}<span>${ion('Fe', '2+')}(aq)</span>${ar}${five('2@0.6')}<span>${ion('Fe', '3+')}(aq)</span> + <span class="rx-x">${five('2@0.7')}${E()}<i data-at="3@0.45" data-fx="grow"></i></span></div>
        <div class="rx-tag" style="right:30px;top:32px;border-color:var(--warm);background:rgba(243,167,100,.12)" data-at="1@0.1" data-out="2@0.4" data-fx="pop"><span class="warm">loses 1 e<sup>−</sup></span></div>
        <div class="rx-tag" style="right:30px;top:32px;border-color:var(--gold);background:rgba(242,196,67,.14)" data-at="2@0.5" data-fx="pop"><span class="gold">× 5 ${ARR} loses 5 e<sup>−</sup></span></div></div>
      <div class="rx-row" style="top:450px;height:130px" data-at="0@0.5"><div class="rx-eq" style="left:40px;top:38px"><span>${MNO4}(aq)</span> + <span class="good">8H<sup>+</sup>(aq)</span> + <span class="rx-x">${E('5')}<i data-at="3@0.45" data-fx="grow"></i></span>${ar}<span>${ion('Mn', '2+')}(aq)</span> + <span class="teal">4${H2O}(l)</span></div>
        <div class="rx-tag" style="right:30px;top:32px;border-color:var(--primary);background:rgba(141,141,240,.12)" data-at="1@0.55" data-fx="pop"><span class="pri">gains 5 e<sup>−</sup></span></div></div>
      <div class="card" style="left:120px;top:620px;width:1680px;height:250px;border-color:rgba(76,199,129,.7)" data-at="4">
        <div class="rx-eq" style="left:0;right:0;top:50px;text-align:center;font-size:46px">
          <span style="position:relative;display:inline-block">${MNO4}(aq) + 5${ion('Fe', '2+')}(aq) + 8H<sup>+</sup>(aq)<span class="rx-ch warm" data-at="5@0.3" data-fx="fade">−1 + 10 + 8 = +17</span></span>
          ${ar}
          <span style="position:relative;display:inline-block">${ion('Mn', '2+')}(aq) + 5${ion('Fe', '3+')}(aq) + 4${H2O}(l)<span class="rx-ch warm" data-at="6@0.2" data-fx="fade">2 + 15 = +17 <span class="good">✓</span></span></span></div></div>
      <div class="banner" style="top:900px;padding:14px 40px;font-size:46px" data-at="6@0.7" data-fx="pop">Charge <span class="warm">+17</span> on each side: <span class="good">balanced</span></div>`,
  })

  // ---------- the trap: atoms balance, charge does not ----------
  const BXc = 1390, BYc = 130
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Watch out</div><h2 class="h1" data-at="0">Atoms balanced is not enough</h2>
      <div class="card" style="left:120px;top:290px;width:1680px;height:350px;border-color:rgba(240,112,122,.6)" data-at="1-0.2">
        <div class="rx-eq" style="left:60px;top:44px;font-size:60px" data-at="2">Cu${' + '}${ion('Ag', '+')}${ar}${ion('Cu', '2+')} + Ag</div>
        <div style="position:absolute;left:60px;top:160px;font-size:38px;font-weight:900;white-space:nowrap" data-at="2@0.55" data-fx="fade">atoms: 1 Cu, 1 Ag on each side <span class="good">✓</span></div>
        <div style="position:absolute;left:60px;top:230px;font-size:38px;font-weight:900;white-space:nowrap" data-at="3@0.2" data-fx="fade">charge: <span class="bad">+1</span> on the left, <span class="bad">+2</span> on the right <span class="bad">✗</span></div>
        <svg style="position:absolute;left:0;top:0" width="1680" height="350" viewBox="0 0 1680 350"><g data-at="3@0.1" data-fx="fade">
          <path d="M${BXc} ${BYc} L${BXc - 40} 300 L${BXc + 40} 300 Z" fill="#363c54"/>
          <g class="beam"><line x1="-170" y1="0" x2="170" y2="0" stroke="#c9cee0" stroke-width="10" stroke-linecap="round"/>
            <g class="panL"><line x1="0" y1="0" x2="0" y2="60" stroke="#7d859c" stroke-width="4"/><rect x="-62" y="60" width="124" height="70" rx="16" fill="rgba(240,112,122,.16)" stroke="${RED}" stroke-width="3"/><text y="108" text-anchor="middle" font-size="40" font-weight="900" class="f-bad">+1</text></g>
            <g class="panR"><line x1="0" y1="0" x2="0" y2="60" stroke="#7d859c" stroke-width="4"/><rect x="-62" y="60" width="124" height="70" rx="16" fill="rgba(240,112,122,.16)" stroke="${RED}" stroke-width="3"/><text y="108" text-anchor="middle" font-size="40" font-weight="900" class="f-bad">+2</text></g></g>
          <circle cx="${BXc}" cy="${BYc}" r="12" fill="#c9cee0"/></g></svg>
        <div class="rx-stamp" style="left:730px;top:44px" data-at="4@0.5" data-fx="pop"><div style="border-color:var(--bad);color:var(--bad);font-size:28px">e<sup>−</sup> can’t appear or vanish</div></div></div>
      <div class="card" style="left:120px;top:670px;width:1680px;height:170px;border-color:rgba(76,199,129,.7)" data-at="5">
        <div class="rx-lab good" style="top:18px">Right</div>
        <div class="rx-eq" style="left:60px;top:76px">Cu(s) + <span class="good">2</span>${ion('Ag', '+')}(aq)${ar}${ion('Cu', '2+')}(aq) + <span class="good">2</span>Ag(s)</div>
        <div class="rx-tag" style="right:40px;top:54px;border-color:var(--good);background:rgba(76,199,129,.14)" data-at="5@0.7" data-fx="pop"><span class="good">charge +2 = +2</span></div></div>
      <div class="banner" style="top:880px;padding:16px 40px" data-at="6" data-fx="pop"><span class="gold">e<sup>−</sup> lost</span> must equal <span class="gold">e<sup>−</sup> gained</span></div>`,
    update(c) {
      const b = c.b, t = c.t, p = eo(c.seg(b[3].start + 0.3, b[3].start + 1.3))
      const a = (9 + (t > b[3].start + 1.3 ? 1.2 * Math.sin((t - b[3].start) * 3) * Math.exp(-(t - b[3].start - 1.3)) : 0)) * p
      c.$('.beam').setAttribute('transform', `translate(${BXc} ${BYc}) rotate(${a.toFixed(2)})`)
      const r = (a * Math.PI) / 180
      c.$('.panL').setAttribute('transform', `translate(${(-150 * Math.cos(r)).toFixed(1)} ${(-150 * Math.sin(r)).toFixed(1)})`)
      c.$('.panR').setAttribute('transform', `translate(${(150 * Math.cos(r)).toFixed(1)} ${(150 * Math.sin(r)).toFixed(1)})`)
    },
  })

  // ---------- try it ----------
  const OPTS = ['1 and 1', '2 and 3', '3 and 2', '6 and 6']
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1@0.75">To combine them, <span class="teal">multiply them by…</span></h2>
      <div class="rx-ctx" data-at="1">Al(s)${ar}${ion('Al', '3+')}(aq) + ${E('3')} &nbsp;<span class="muted">and</span>&nbsp; ${ion('Cu', '2+')}(aq) + ${E('2')}${ar}Cu(s)</div>
      ${OPTS.map((o, i) => `<div class="rx-tile t${i}" style="left:${120 + i * 430}px" data-at="2@${0.05 + i * 0.22}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>${i === 1 ? CHECK : ''}<div class="f">${o}</div></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="730" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="730" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 730)"/>
        <text class="num" x="960" y="756" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="860" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="rx-line" style="top:610px" data-at="5">Least common multiple of <span class="gold">3</span> and <span class="gold">2</span> = <span class="gold">6</span></div>
      <div class="rx-line" style="top:730px" data-at="6">Al <span class="warm">× 2</span> ${ARR} gives <span class="gold">6 e<sup>−</sup></span> &nbsp;·&nbsp; Cu <span class="pri">× 3</span> ${ARR} takes <span class="gold">6 e<sup>−</sup></span></div>
      <div class="rx-line" style="top:850px;border-color:rgba(76,199,129,.7)" data-at="7">2Al(s) + 3${ion('Cu', '2+')}(aq)${ar}2${ion('Al', '3+')}(aq) + 3Cu(s)</div>`,
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
  const m1 = `<svg width="460" height="200" viewBox="0 0 460 200">
    <rect x="130" y="10" width="200" height="56" rx="14" fill="rgba(255,255,255,.05)" stroke="#c9cee0" stroke-width="3"/><text x="230" y="48" text-anchor="middle" font-size="26" font-weight="900">redox</text>
    <line x1="190" y1="72" x2="120" y2="116" stroke="#c9cee0" stroke-width="4" marker-end="url(#mk-text)"/><line x1="270" y1="72" x2="340" y2="116" stroke="#c9cee0" stroke-width="4" marker-end="url(#mk-text)"/>
    <rect x="20" y="126" width="190" height="56" rx="14" fill="rgba(243,167,100,.14)" stroke="${WARM}" stroke-width="3"/><text x="115" y="164" text-anchor="middle" font-size="26" font-weight="900" class="f-warm">oxidation</text>
    <rect x="250" y="126" width="190" height="56" rx="14" fill="rgba(141,141,240,.14)" stroke="${PUR}" stroke-width="3"/><text x="345" y="164" text-anchor="middle" font-size="26" font-weight="900" class="f-pri">reduction</text></svg>`
  const m2 = `<svg width="460" height="200" viewBox="0 0 460 200">${[['1', '#aab1c4'], ['O', TEAL], ['H', GREEN], ['E', GOLD]].map(([n, col], i) => `<circle cx="${70 + i * 107}" cy="100" r="42" fill="${col}"/><text x="${70 + i * 107}" y="116" text-anchor="middle" font-size="44" font-weight="900" class="f-dark">${n}</text>${i < 3 ? `<line x1="${116 + i * 107}" y1="100" x2="${128 + i * 107}" y2="100" stroke="#c9cee0" stroke-width="4"/>` : ''}`).join('')}</svg>`
  const m3 = `<svg width="460" height="200" viewBox="0 0 460 200">${elec(80, 70, 20)}${elec(130, 70, 20)}<text x="230" y="86" text-anchor="middle" font-size="54" font-weight="900">=</text>${elec(330, 70, 20)}${elec(380, 70, 20)}
    <text x="105" y="140" text-anchor="middle" font-size="26" font-weight="900" class="f-warm">lost</text><text x="355" y="140" text-anchor="middle" font-size="26" font-weight="900" class="f-pri">gained</text>
    <text x="230" y="190" text-anchor="middle" font-size="28" font-weight="900" class="f-good">atoms ✓ charge ✓</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rx-rc" style="left:120px" data-at="1"><div class="n">1</div>${m1}<p>Split the reaction<br>into <span class="warm">oxidation</span> and<br><span class="pri">reduction</span> halves</p></div>
      <div class="card rx-rc" style="left:690px" data-at="2"><div class="n">2</div>${m2}<p>In acid: other atoms,<br>O with <span class="teal">H<sub>2</sub>O</span>, H with <span class="good">H<sup>+</sup></span>,<br>charge with <span class="gold">e<sup>−</sup></span></p></div>
      <div class="card rx-rc" style="left:1260px" data-at="3"><div class="n">3</div>${m3}<p>Equalize <span class="gold">e<sup>−</sup></span>, add,<br>cancel, then check<br>atoms AND charge</p></div>`,
  })
  void clamp
})()
