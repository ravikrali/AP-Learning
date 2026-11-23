// Pictures for chem-4.5b "Limiting Reactant". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u4.ts; the excess-aluminum numbers
// and the reasons yields fall short are from book.ts). Atom sizes are in the right order, not to scale.
(() => {
  const { clamp, lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .lr-row{position:absolute;left:120px;width:1680px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .lr-row .n{position:absolute;left:28px;top:20px;width:64px;height:64px;border-radius:50%;font-size:36px;font-weight:900;line-height:64px;text-align:center;color:#10131c}
    .lr-row .lb{position:absolute;left:118px;top:30px;font-size:34px;font-weight:900;white-space:nowrap}
    .lr-row .eq{position:absolute;font-size:38px;font-weight:900;white-space:nowrap}
    .lr-res{position:absolute;right:22px;height:76px;padding:0 28px;border-radius:20px;font-size:42px;font-weight:900;line-height:72px;white-space:nowrap;background:rgba(91,91,214,.35);border:2px solid var(--primary)}
    .lr-tag{position:absolute;height:64px;padding:0 24px;border-radius:18px;font-size:32px;font-weight:900;line-height:60px;white-space:nowrap;border:3px solid}
    .lr-prob{left:120px;top:290px;width:1680px;height:120px;padding:34px 48px 0;font-size:44px;font-weight:800;white-space:nowrap}
    .lr-line{position:absolute;left:40px;right:40px;text-align:center;font-size:44px;font-weight:900;white-space:nowrap}
    .lr-fr{display:inline-block;vertical-align:middle;margin:0 10px;text-align:center;font-size:36px;line-height:1.15}
    .lr-fr .t{display:block;padding:0 8px 6px;border-bottom:4px solid currentColor} .lr-fr .b{display:block;padding:6px 8px 0}
    .lr-chip{position:absolute;height:76px;padding:0 30px;border-radius:22px;background:rgba(255,255,255,.05);border:2px solid var(--line);font-size:36px;font-weight:800;line-height:72px;white-space:nowrap}
    .lr-chip .x{position:relative;display:inline-block;margin-left:6px} .lr-chip .x i{position:absolute;left:-3px;right:-3px;top:50%;height:7px;margin-top:-3px;border-radius:4px;background:var(--bad)}
    .lr-stamp{position:absolute} .lr-stamp div{transform:rotate(-8deg);padding:2px 24px;border:7px solid var(--bad);border-radius:16px;color:var(--bad);font-size:44px;font-weight:900;letter-spacing:.06em;background:rgba(14,16,24,.9);white-space:nowrap}
    .lr-ctx{position:absolute;left:120px;top:272px;font-size:38px;font-weight:800;color:var(--muted);white-space:nowrap}
    .lr-opt{position:absolute;width:820px;height:130px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;padding:0 90px 0 106px;font-size:35px;font-weight:800;line-height:1.2}
    .lr-opt .l{position:absolute;left:26px;top:33px;width:60px;height:60px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:32px;font-weight:900;line-height:56px;text-align:center;color:var(--muted)}
    .lr-opt .ok{position:absolute;right:20px;top:31px;width:64px;height:64px}
    .lr-rc{top:320px;width:540px;height:560px;text-align:center} .lr-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .lr-rc svg{display:block;margin:14px auto 0} .lr-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const CHECK = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const TEAL = '#3cc7bc', PUR = '#8d8df0', WARM = '#f3a764', RED = '#f0707a', GREEN = '#4cc781', GOLD = '#f2c443'
  const place = (el, x, y) => el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`)
  // atoms: Al drawn larger than Cl (right order, not to scale)
  const Al = (x, y, r = 38) => ball(x, y, r, 'gray', 'Al', r * 0.62)
  const Cl = (x, y, r = 30) => ball(x, y, r, 'green', 'Cl', r * 0.66)
  const cl2 = (x, y, k = 1) => Cl(x - 27 * k, y, 30 * k) + Cl(x + 27 * k, y, 30 * k)
  // a simple sausage and bun (no brand, just shapes)
  const dog = () => `<rect x="-62" y="-19" width="124" height="38" rx="19" fill="#c8643c"/><rect x="-46" y="-12" width="70" height="7" rx="3.5" fill="#fff" opacity=".22"/>`
  const bun = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-66 -6 Q-66 30 0 30 Q66 30 66 -6 Z" fill="#e2ad6a"/><path d="M-66 -6 Q-66 -30 -40 -26 L40 -26 Q66 -30 66 -6 Z" fill="#c98f4c"/></g>`

  // ---------- intro artwork: faint atoms at the edges ----------
  EZ.intro = {
    chips: [['1@0.3', 'Runs out first'], ['1@0.55', 'The product test'], ['1@0.8', 'Percent yield']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">
      ${Al(170, 300, 46)}${Al(270, 420, 46)}${cl2(180, 760)}${cl2(260, 880)}
      ${cl2(1720, 300)}${cl2(1760, 440)}${cl2(1700, 600)}${Al(1740, 800, 46)}</svg>`,
  }

  // ---------- hook: 10 hot dogs, 8 buns ----------
  const DX = (i) => 400 + i * 130, DY = 450, BY = 680
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Think like a cook</div><h2 class="h1" data-at="0">Something always runs out first</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.1" data-fx="fade"><text x="210" y="${DY + 4}" text-anchor="middle" font-size="64" font-weight="900" class="f-warm">10</text><text x="210" y="${DY + 50}" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">hot dogs</text></g>
        <g data-at="1@0.55" data-fx="fade"><text x="210" y="${BY + 4}" text-anchor="middle" font-size="64" font-weight="900" class="f-teal">8</text><text x="210" y="${BY + 50}" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">buns</text></g>
        ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<g data-at="1@${0.55 + i * 0.04}" data-fx="pop">${bun(DX(i), BY)}</g>`).join('')}
        ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `<g data-at="1@${0.1 + i * 0.035}" data-fx="pop"><g class="hd${i}" transform="translate(${DX(i)} ${DY})">${dog()}</g></g>`).join('')}
        <text x="${(DX(8) + DX(9)) / 2}" y="${DY + 80}" text-anchor="middle" font-size="34" font-weight="900" class="f-warm" data-at="4@0.2" data-fx="fade">2 left over</text>
        <text x="${(DX(0) + DX(7)) / 2}" y="${BY + 92}" text-anchor="middle" font-size="36" font-weight="900" class="f-good" data-at="3@0.55" data-fx="fade">8 complete hot dogs</text>
        <g data-at="5@0.3" data-fx="fade"><path d="M${DX(0) - 70} ${BY + 120} v16 h${DX(7) - DX(0) + 140} v-16" fill="none" stroke="${TEAL}" stroke-width="5"/>
          <text x="${(DX(0) + DX(7)) / 2}" y="${BY + 180}" text-anchor="middle" font-size="36" font-weight="900" class="f-teal">buns ran out first = the limiting reactant</text></g>
      </svg>
      <div class="banner" style="top:900px;padding:16px 40px" data-at="6" data-fx="pop">It decides <span class="gold">how much product</span> you get</div>`,
    update(c) {
      const b = c.b
      for (let i = 0; i < 8; i++) {
        const p = eio(c.seg(b[3].start + i * 0.12, b[3].start + i * 0.12 + 0.7))
        place(c.$('.hd' + i), DX(i), lerp(DY, BY - 14, p))
      }
      const g = 0.5 + 0.5 * Math.sin((c.t - b[4].start) * 4)
      const on = c.seg(b[4].start, b[4].start + 0.4) * (1 - c.seg(b[5].start, b[5].start + 0.5))
      for (const i of [8, 9]) c.$('.hd' + i).style.filter = on ? `drop-shadow(0 0 ${8 + 10 * g * on}px rgba(243,167,100,${0.8 * on}))` : ''
    },
  })

  // ---------- limiting vs excess ----------
  const TK = { x: 70, y: 110, w: 150, h: 230 }
  const tank = (cls, col) => `<rect x="${TK.x}" y="${TK.y}" width="${TK.w}" height="${TK.h}" rx="22" fill="rgba(255,255,255,.04)" stroke="${col}" stroke-width="4"/>
    <rect class="${cls}" x="${TK.x + 8}" y="${TK.y + 8}" width="${TK.w - 16}" height="${TK.h - 16}" rx="16" fill="${col}" opacity=".75"/>`
  EZ.scene('limiting', {
    html: `<div class="kicker" data-at="in" data-fx="left">Two kinds of reactant</div><h2 class="h1" data-at="0">Limiting vs. excess</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:400px" data-at="0@0.4"><h3 class="teal">Limiting reactant</h3>
        <svg style="position:absolute;left:0;top:0" width="810" height="400" viewBox="0 0 810 400">${tank('tkL', TEAL)}
          <text x="270" y="170" font-size="38" font-weight="900" data-at="1@0.5" data-fx="fade">used up</text><text x="270" y="216" font-size="38" font-weight="900" data-at="1@0.5" data-fx="fade">completely</text>
          <g data-at="2@0.1" data-fx="fade"><line x1="270" y1="262" x2="330" y2="262" stroke="${GOLD}" stroke-width="6" marker-end="url(#mk-gold)"/>
            <text x="356" y="274" font-size="34" font-weight="900" class="f-gold">sets the maximum</text><text x="356" y="318" font-size="34" font-weight="900" class="f-gold">(theoretical) product</text></g></svg></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:400px" data-at="3"><h3 class="warm">Excess reactant</h3>
        <svg style="position:absolute;left:0;top:0" width="810" height="400" viewBox="0 0 810 400">${tank('tkR', WARM)}
          <text x="270" y="190" font-size="38" font-weight="900" data-at="3@0.6" data-fx="fade">some is</text><text x="270" y="236" font-size="38" font-weight="900" class="f-warm" data-at="3@0.6" data-fx="fade">left over</text></svg></div>
      <div class="lr-chip" style="left:120px;top:740px" data-at="5@0.3" data-fx="pop">not always the&nbsp;<span class="x">smaller mass<i data-at="5@0.45" data-fx="grow"></i></span></div>
      <div class="lr-chip" style="left:760px;top:740px" data-at="5@0.6" data-fx="pop">not always the&nbsp;<span class="x">fewest moles<i data-at="5@0.75" data-fx="grow"></i></span></div>
      <div class="banner" style="top:870px;padding:16px 40px" data-at="6" data-fx="pop">It depends on the <span class="gold">mole ratio</span></div>`,
    update(c) {
      const b = c.b
      const lv = (cls, level) => { const el = c.$(cls), h = (TK.h - 16) * level; el.setAttribute('height', h.toFixed(1)); el.setAttribute('y', (TK.y + 8 + (TK.h - 16) - h).toFixed(1)) }
      lv('.tkL', 1 - eio(c.seg(b[1].start + 0.2, b[1].start + 1.6)))
      lv('.tkR', 1 - 0.62 * eio(c.seg(b[3].start + 0.3, b[3].start + 1.7)))
    },
  })

  // ---------- the product test ----------
  const PT = { x: 640, aY: 380, bY: 590, h: 96, aW: 980, bW: 600 }
  EZ.scene('test', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">The product test</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <text x="280" y="330" text-anchor="middle" font-size="28" font-weight="900" class="f-muted" style="letter-spacing:.1em" data-at="1" data-fx="fade">REACTANT</text>
        <text x="${PT.x}" y="330" font-size="28" font-weight="900" class="f-muted" style="letter-spacing:.1em" data-at="1" data-fx="fade">PRODUCT IT COULD MAKE ON ITS OWN</text>
        <g data-at="1@0.05" data-fx="pop"><rect x="140" y="${PT.aY}" width="280" height="${PT.h}" rx="22" fill="rgba(141,141,240,.18)" stroke="${PUR}" stroke-width="4"/><text x="280" y="${PT.aY + 62}" text-anchor="middle" font-size="44" font-weight="900" class="f-pri">Reactant A</text></g>
        <g data-at="1@0.15" data-fx="pop"><rect x="140" y="${PT.bY}" width="280" height="${PT.h}" rx="22" fill="rgba(60,199,188,.18)" stroke="${TEAL}" stroke-width="4"/><text x="280" y="${PT.bY + 62}" text-anchor="middle" font-size="44" font-weight="900" class="f-teal">Reactant B</text></g>
        <line x1="440" y1="${PT.aY + 48}" x2="610" y2="${PT.aY + 48}" stroke="#c9cee0" stroke-width="6" marker-end="url(#mk-text)" data-at="1@0.3" data-fx="fade"/>
        <line x1="440" y1="${PT.bY + 48}" x2="610" y2="${PT.bY + 48}" stroke="#c9cee0" stroke-width="6" marker-end="url(#mk-text)" data-at="1@0.3" data-fx="fade"/>
        <rect class="barA" x="${PT.x}" y="${PT.aY}" width="0" height="${PT.h}" rx="18" fill="${PUR}" opacity=".8"/>
        <rect class="barB" x="${PT.x}" y="${PT.bY}" width="0" height="${PT.h}" rx="18" fill="${TEAL}" opacity=".8"/>
        <text x="${PT.x + 30}" y="${PT.aY + 62}" font-size="38" font-weight="900" class="f-dark" data-at="1@0.75" data-fx="fade">product from A</text>
        <text x="${PT.x + 30}" y="${PT.bY + 62}" font-size="38" font-weight="900" class="f-dark" data-at="1@0.85" data-fx="fade">product from B</text>
        <g data-at="2@0.2" data-fx="pop"><g transform="translate(${PT.x + PT.bW + 50} ${PT.bY + 48})"><circle r="34" fill="${GREEN}"/><path d="M-15 1l9 9 17-19" fill="none" stroke="#10131c" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></g></g>
        <text x="${PT.x + PT.bW + 104}" y="${PT.bY + 62}" font-size="40" font-weight="900" class="f-good" data-at="2@0.3" data-fx="fade">smaller wins</text>
        <g data-at="3@0.55" data-fx="fade"><path d="M${PT.x} ${PT.bY + 116} v16 h${PT.bW} v-16" fill="none" stroke="${GOLD}" stroke-width="5"/>
          <text x="${PT.x + PT.bW / 2}" y="${PT.bY + 176}" text-anchor="middle" font-size="36" font-weight="900" class="f-gold">theoretical yield</text></g>
      </svg>
      <div class="lr-tag" style="left:160px;top:${PT.bY + 120}px;border-color:var(--accent);background:rgba(60,199,188,.14)" data-at="3@0.15" data-fx="pop"><span class="teal">limiting</span></div>
      <div class="banner" style="top:880px;padding:16px 40px" data-at="4" data-fx="pop">No comparing ratios ${ARR} it <span class="good">always works</span></div>`,
    update(c) {
      const b = c.b, s = b[1].start
      c.$('.barA').setAttribute('width', (PT.aW * eio(c.seg(s + 0.6, s + 2.0))).toFixed(1))
      c.$('.barB').setAttribute('width', (PT.bW * eio(c.seg(s + 0.9, s + 2.2))).toFixed(1))
      c.$('.barA').style.opacity = 0.8 - 0.45 * c.seg(b[2].start + 0.2, b[2].start + 0.7)
    },
  })

  // ---------- worked example: aluminum + chlorine ----------
  EZ.scene('example', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Aluminum + chlorine</h2>
      <div class="card lr-prob" data-at="1"><span data-at="2" data-fx="fade"><span class="pri">10.0 g Al</span> + <span class="teal">30.0 g Cl<sub>2</sub></span> ${ARR} <span class="warm">? g AlCl<sub>3</sub></span></span>
        <span style="position:absolute;right:48px;top:36px;font-size:42px;font-weight:900">2Al + 3Cl<sub>2</sub> → 2AlCl<sub>3</sub></span></div>
      <div class="lr-row" style="top:440px;height:104px" data-at="3"><div class="n" style="background:${PUR}">1</div><div class="lb" style="color:${PUR}">moles</div>
        <div class="eq" style="left:300px;top:30px" data-at="3@0.2" data-fx="fade">Al: 10.0 ÷ 26.98 = <span class="pri">0.371 mol</span></div>
        <div class="eq" style="left:960px;top:30px" data-at="4@0.2" data-fx="fade">Cl<sub>2</sub>: 30.0 ÷ 70.90 = <span class="teal">0.423 mol</span></div></div>
      <div class="lr-row" style="top:566px;height:200px" data-at="5"><div class="n" style="background:${WARM}">2</div><div class="lb" style="color:${WARM}">product test</div>
        <div class="eq x-a" style="left:400px;top:34px" data-at="5@0.3" data-fx="fade">From Al: 0.371 × (2/2) = 0.371 mol AlCl<sub>3</sub></div>
        <div class="eq" style="left:400px;top:116px" data-at="6@0.3" data-fx="fade">From Cl<sub>2</sub>: 0.423 × (2/3) = <span class="good">0.282 mol AlCl<sub>3</sub></span></div>
        <div class="lr-tag" style="right:28px;top:106px;border-color:var(--good);background:rgba(76,199,129,.14)" data-at="6@0.75" data-fx="pop"><span class="good">smaller</span></div>
        <div class="lr-tag" style="right:28px;top:24px;border-color:var(--accent);background:rgba(60,199,188,.16)" data-at="7@0.15" data-fx="pop"><span class="teal">Cl<sub>2</sub> is limiting</span></div></div>
      <div class="lr-row" style="top:788px;height:116px" data-at="8"><div class="n" style="background:${TEAL};top:26px">3</div><div class="lb" style="color:${TEAL};top:36px">mass</div>
        <div class="eq" style="left:300px;top:36px" data-at="8@0.3" data-fx="fade">0.282 mol × 133.33 g/mol =</div>
        <div class="lr-res" style="top:18px" data-at="8@0.8" data-fx="pop"><span class="good">37.6 g AlCl<sub>3</sub></span></div></div>`,
    update(c) {
      const b = c.b
      c.$('.x-a').style.color = c.t > b[6].start + 1 ? 'var(--muted)' : ''
    },
  })

  // ---------- the trap: more mass, more moles, still limiting ----------
  const BX = 300, MS = 20, ML = 1250
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Watch out</div><h2 class="h1" data-at="0">More isn’t always enough</h2>
      <div class="card" style="left:120px;top:290px;width:1680px;height:390px" data-at="1-0.2">
        <svg style="position:absolute;left:0;top:0" width="1680" height="390" viewBox="0 0 1680 390">
          <text x="50" y="120" font-size="34" font-weight="900" class="f-muted" data-at="1" data-fx="fade">mass</text>
          <text x="50" y="290" font-size="34" font-weight="900" class="f-muted" data-at="2" data-fx="fade">moles</text>
          <g data-at="1@0.1" data-fx="fade"><text x="${BX - 20}" y="78" text-anchor="end" font-size="34" font-weight="900" class="f-pri">Al</text><text x="${BX - 20}" y="148" text-anchor="end" font-size="34" font-weight="900" class="f-teal">Cl₂</text></g>
          <rect class="m1" x="${BX}" y="48" width="0" height="44" rx="12" fill="${PUR}"/><rect class="m2" x="${BX}" y="118" width="0" height="44" rx="12" fill="${TEAL}"/>
          <text x="${BX + 10 * MS + 20}" y="82" font-size="34" font-weight="900" class="f-pri" data-at="1@0.4" data-fx="fade">10.0 g</text>
          <text x="${BX + 30 * MS + 20}" y="152" font-size="34" font-weight="900" class="f-teal" data-at="1@0.6" data-fx="fade">30.0 g <tspan class="f-warm">more</tspan></text>
          <g data-at="2@0.1" data-fx="fade"><text x="${BX - 20}" y="248" text-anchor="end" font-size="34" font-weight="900" class="f-pri">Al</text><text x="${BX - 20}" y="318" text-anchor="end" font-size="34" font-weight="900" class="f-teal">Cl₂</text></g>
          <rect class="n1" x="${BX}" y="218" width="0" height="44" rx="12" fill="${PUR}"/><rect class="n2" x="${BX}" y="288" width="0" height="44" rx="12" fill="${TEAL}"/>
          <text x="${BX + 0.371 * ML + 20}" y="252" font-size="34" font-weight="900" class="f-pri" data-at="2@0.5" data-fx="fade">0.371 mol</text>
          <text x="${BX + 0.423 * ML + 20}" y="322" font-size="34" font-weight="900" class="f-teal" data-at="2@0.7" data-fx="fade">0.423 mol <tspan class="f-warm">more</tspan></text>
        </svg>
        <div class="lr-stamp" style="right:50px;top:150px" data-at="3@0.2" data-fx="pop"><div>Cl<sub>2</sub> RUNS OUT FIRST</div></div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <text x="560" y="784" text-anchor="end" font-size="36" font-weight="900" class="f-muted" data-at="4" data-fx="fade">the recipe:</text>
        <g data-at="4@0.15" data-fx="pop">${Al(630, 772)}</g><g data-at="4@0.22" data-fx="pop">${Al(720, 772)}</g>
        <text x="800" y="790" text-anchor="middle" font-size="54" font-weight="900" class="f-muted" data-at="4@0.3" data-fx="fade">:</text>
        <g data-at="4@0.4" data-fx="pop">${cl2(900, 772)}</g><g data-at="4@0.5" data-fx="pop">${cl2(1040, 772)}</g><g data-at="4@0.6" data-fx="pop">${cl2(1180, 772)}</g>
        <text x="1270" y="786" font-size="40" font-weight="900" data-at="4@0.7" data-fx="fade"><tspan class="f-pri">2 mol Al</tspan> : <tspan class="f-teal">3 mol Cl₂</tspan></text>
      </svg>
      <div class="banner" style="top:880px;padding:16px 40px" data-at="5" data-fx="pop">The <span class="gold">mole ratio</span> decides. Not the mass, not the moles alone.</div>`,
    update(c) {
      const b = c.b
      const w = (cls, full, t0) => c.$(cls).setAttribute('width', (full * eio(c.seg(t0, t0 + 1))).toFixed(1))
      w('.m1', 10 * MS, b[1].start + 0.2); w('.m2', 30 * MS, b[1].start + 0.4)
      w('.n1', 0.371 * ML, b[2].start + 0.2); w('.n2', 0.423 * ML, b[2].start + 0.4)
    },
  })

  // ---------- how much excess is left ----------
  const EB = { x: 260, y: 640, w: 1400, h: 100 }, USED = 7.61 / 10.0
  EZ.scene('excess', {
    html: `<div class="kicker" data-at="in" data-fx="left">The excess reactant</div><h2 class="h1" data-at="0">How much aluminum is left?</h2>
      <div class="card" style="left:120px;top:290px;width:1680px;height:250px" data-at="1">
        <div class="lr-line" style="top:44px" data-at="1@0.2" data-fx="fade"><span class="teal">0.423 mol Cl<sub>2</sub></span> ×
          <span class="lr-fr warm"><span class="t">2 mol Al</span><span class="b">3 mol Cl<sub>2</sub></span></span> = <span class="pri">0.282 mol Al used</span></div>
        <div class="lr-line" style="top:168px" data-at="2" data-fx="fade">= <span class="pri">7.61 g Al</span> used</div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="3-0.6" data-fx="fade"><text x="${EB.x}" y="${EB.y - 24}" font-size="34" font-weight="900" class="f-muted">10.0 g Al to start</text>
          <rect x="${EB.x}" y="${EB.y}" width="${EB.w}" height="${EB.h}" rx="20" fill="rgba(255,255,255,.04)" stroke="#c9cee0" stroke-width="4"/></g>
        <rect class="eU" x="${EB.x + 6}" y="${EB.y + 6}" width="0" height="${EB.h - 12}" rx="15" fill="${PUR}" opacity=".8"/>
        <rect class="eL" x="${EB.x + EB.w * USED}" y="${EB.y + 6}" width="${EB.w * (1 - USED) - 6}" height="${EB.h - 12}" rx="15" fill="${WARM}" opacity="0"/>
        <text x="${EB.x + (EB.w * USED) / 2}" y="${EB.y + 64}" text-anchor="middle" font-size="38" font-weight="900" class="f-dark" data-at="3@0.15" data-fx="fade">7.61 g used</text>
        <text x="${EB.x + EB.w * (1 + USED) / 2}" y="${EB.y + 64}" text-anchor="middle" font-size="38" font-weight="900" class="f-dark" data-at="3@0.7" data-fx="fade">2.39 g</text>
        <text x="${EB.x + EB.w * (1 + USED) / 2}" y="${EB.y + EB.h + 50}" text-anchor="middle" font-size="36" font-weight="900" class="f-warm" data-at="3@0.75" data-fx="fade">left over (excess)</text>
      </svg>
      <div class="banner" style="top:880px;padding:16px 40px" data-at="4" data-fx="pop">Find the excess from the <span class="teal">limiting reactant</span>, not the product</div>`,
    update(c) {
      const b = c.b
      c.$('.eU').setAttribute('width', ((EB.w * USED - 6) * eio(c.seg(b[3].start, b[3].start + 1.2))).toFixed(1))
      c.$('.eL').setAttribute('opacity', (0.8 * c.seg(b[3].start + 1.1, b[3].start + 1.6)).toFixed(2))
    },
  })

  // ---------- percent yield ----------
  const YB = { x: 420, w: 1200, h: 86 }, ACT = 30.1 / 37.6
  EZ.scene('yield', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Real experiments</div><h2 class="h1" data-at="0">Percent yield</h2>
      <div class="card" style="left:120px;top:284px;width:1680px;height:154px" data-at="1">
        <div class="lr-line" style="top:30px;font-size:50px">Percent yield = <span class="lr-fr" style="font-size:40px"><span class="t good">actual</span><span class="b gold">theoretical</span></span> × 100</div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="2" data-fx="fade"><text x="${YB.x - 24}" y="509" text-anchor="end" font-size="34" font-weight="900" class="f-gold">theoretical</text>
          <rect x="${YB.x}" y="460" width="${YB.w}" height="${YB.h}" rx="18" fill="rgba(242,196,67,.12)" stroke="${GOLD}" stroke-width="4" stroke-dasharray="14 10"/>
          <text x="${YB.x + YB.w - 24}" y="516" text-anchor="end" font-size="36" font-weight="900" class="f-gold">37.6 g</text>
          <text x="${YB.x - 24}" y="619" text-anchor="end" font-size="34" font-weight="900" class="f-good">actual</text></g>
        <rect class="yA" x="${YB.x}" y="572" width="0" height="${YB.h}" rx="18" fill="${GREEN}" opacity=".85"/>
        <text x="${YB.x + 24}" y="628" font-size="36" font-weight="900" class="f-dark" data-at="2@0.3" data-fx="fade">30.1 g</text>
        <text x="${YB.x + YB.w * ACT + 30}" y="632" font-size="58" font-weight="900" class="f-good" data-at="2@0.85" data-fx="pop">80.1%</text>
      </svg>
      <div class="lr-chip" style="left:120px;top:710px" data-at="3@0.05" data-fx="pop">lost in <span class="warm">transfers &amp; filtering</span></div>
      <div class="lr-chip" style="left:700px;top:710px" data-at="3@0.4" data-fx="pop"><span class="warm">side reactions</span></div>
      <div class="lr-chip" style="left:1063px;top:710px" data-at="3@0.75" data-fx="pop">reaction <span class="warm">not complete</span></div>
      <div class="banner" style="top:860px;padding:16px 40px;background:rgba(240,112,122,.16);border-color:var(--bad)" data-at="4" data-fx="pop">Over <span class="bad">100%</span> ${ARR} an error (often a product that is still wet)</div>`,
    update(c) {
      const b = c.b
      c.$('.yA').setAttribute('width', (YB.w * ACT * eio(c.seg(b[2].start + 0.3, b[2].start + 1.8))).toFixed(1))
    },
  })

  // ---------- try it ----------
  const OPTS = ['H<sub>2</sub>', 'O<sub>2</sub>', 'Neither: they are exactly balanced', 'Can’t tell without masses']
  const xrow = (top, at, html) => `<div class="lr-row" style="top:${top}px;height:104px" data-at="${at}"><div class="eq" style="left:44px;top:28px;font-size:40px">${html}</div></div>`
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1@0.75">Which reactant is <span class="teal">limiting</span>?</h2>
      <div class="lr-ctx" data-at="1">2H<sub>2</sub> + O<sub>2</sub> → 2H<sub>2</sub>O &nbsp;·&nbsp; <b style="color:var(--text)">3.0 mol H<sub>2</sub></b> reacts with <b style="color:var(--text)">2.0 mol O<sub>2</sub></b></div>
      ${OPTS.map((o, i) => `<div class="lr-opt t${i}" style="left:${120 + (i % 2) * 860}px;top:${350 + Math.floor(i / 2) * 150}px" data-at="2@${[0.02, 0.12, 0.3, 0.7][i]}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>
        ${i === 0 ? `<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>` : ''}
        <span>${o}</span></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="790" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="790" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 790)"/>
        <text class="num" x="960" y="816" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="920" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      ${xrow(680, '5', '2.0 mol O<sub>2</sub> needs <span class="warm">4.0 mol H<sub>2</sub></span>, but there are only <span class="bad">3.0 mol</span>')}
      ${xrow(806, '6', '3.0 mol H<sub>2</sub> only needs <span class="teal">1.5 mol O<sub>2</sub></span> ' + ARR + ' <span class="good">H<sub>2</sub> runs out first</span>')}`,
    update(c) {
      const b = c.b, t0 = b[3].start + 0.3, t1 = b[4].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[4].start + 0.4, b[4].start + 0.9))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 0) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const m1 = `<svg width="460" height="210" viewBox="0 0 460 210">
    <rect x="90" y="30" width="100" height="150" rx="16" fill="rgba(255,255,255,.04)" stroke="${TEAL}" stroke-width="4"/>
    <rect x="270" y="30" width="100" height="150" rx="16" fill="rgba(255,255,255,.04)" stroke="${WARM}" stroke-width="4"/><rect x="276" y="122" width="88" height="52" rx="11" fill="${WARM}" opacity=".75"/>
    <text x="140" y="118" text-anchor="middle" font-size="26" font-weight="900" class="f-teal">empty</text>
    <text x="140" y="206" text-anchor="middle" font-size="26" font-weight="900" class="f-teal">limiting</text><text x="320" y="206" text-anchor="middle" font-size="26" font-weight="900" class="f-warm">excess</text></svg>`
  const m2 = `<svg width="460" height="210" viewBox="0 0 460 210">
    <rect x="40" y="44" width="360" height="52" rx="12" fill="${PUR}" opacity=".5"/><text x="58" y="80" font-size="26" font-weight="900" class="f-dark">from A</text>
    <rect x="40" y="120" width="220" height="52" rx="12" fill="${TEAL}"/><text x="58" y="156" font-size="26" font-weight="900" class="f-dark">from B</text>
    <g transform="translate(300 146)"><circle r="26" fill="${GREEN}"/><path d="M-11 1l7 7 13-15" fill="none" stroke="#10131c" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`
  const m3 = `<svg width="460" height="210" viewBox="0 0 460 210">
    <rect x="40" y="50" width="380" height="50" rx="12" fill="rgba(242,196,67,.12)" stroke="${GOLD}" stroke-width="3" stroke-dasharray="10 8"/>
    <rect x="40" y="122" width="304" height="50" rx="12" fill="${GREEN}" opacity=".85"/><text x="58" y="157" font-size="26" font-weight="900" class="f-dark">actual</text>
    <text x="230" y="85" text-anchor="middle" font-size="26" font-weight="900" class="f-gold">theoretical</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card lr-rc" style="left:120px" data-at="1"><div class="n">1</div>${m1}<p>The <span class="teal">limiting</span> reactant<br>runs out first and<br>sets the <span class="gold">max product</span></p></div>
      <div class="card lr-rc" style="left:690px" data-at="2"><div class="n">2</div>${m2}<p>Product test:<br>product from each.<br>The <span class="good">smaller</span> wins.</p></div>
      <div class="card lr-rc" style="left:1260px" data-at="3"><div class="n">3</div>${m3}<p>Percent yield =<br><span class="good">actual</span> ÷ <span class="gold">theoretical</span><br>× 100</p></div>`,
  })
})()
