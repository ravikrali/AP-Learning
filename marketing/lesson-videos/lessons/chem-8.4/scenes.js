// Pictures for chem-8.4 "Mixing Acids & Bases". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u8.ts, chem/book.ts): 50.0 mL 0.100 M HCl +
// 30.0 mL 0.100 M NaOH -> pH 1.60; 25.0 mL 0.20 M NaOH + 25.0 mL 0.10 M HCl -> pH 12.70; 5.00 mmol
// CH3COOH with 2.50 mmol NaOH -> pH = pKa = 4.74, with 5.00 mmol -> pH about 8.72. Particle counts
// and beakers show the idea, not a scale (except where a block is labelled 1.00 x 10^-3 mol).
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-eq{display:inline-block;width:1.15em;height:.72em;margin:0 .24em;vertical-align:-.02em;background:currentColor;-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 22'%3E%3Cpath d='M2 7h29l-7-5.5M32 15H3l7 5.5' fill='none' stroke='black' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/contain no-repeat}
    .x-q{position:absolute;left:1230px;width:570px;height:120px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line);font-size:50px;font-weight:900;line-height:116px;text-align:center;white-space:nowrap}
    .x-lead{position:absolute;left:120px;top:286px;font-size:46px;font-weight:900;white-space:nowrap}
    .x-row{position:absolute;left:120px;width:1680px;height:96px;border-radius:24px;background:rgba(36,40,56,.85);border:2px solid var(--line);font-size:46px;font-weight:900;line-height:92px;white-space:nowrap}
    .x-row .lb{position:absolute;left:40px;font-size:36px;color:var(--muted)} .x-row .e{position:absolute;left:640px}
    .x-case{position:absolute;width:810px;height:250px}
    .x-case .n{position:absolute;left:30px;top:28px;width:62px;height:62px;border-radius:50%;background:var(--brand);text-align:center;line-height:62px;font-size:34px;font-weight:900}
    .x-case .a{position:absolute;left:116px;top:30px;font-size:42px;font-weight:900;white-space:nowrap}
    .x-case .b{position:absolute;left:116px;top:108px;font-size:36px;font-weight:800;color:var(--muted);white-space:nowrap}
    .x-case .c{position:absolute;left:116px;top:170px;font-size:40px;font-weight:900;white-space:nowrap}
    .x-case svg{position:absolute;right:26px;top:88px}
    .x-st{position:absolute;left:990px;width:810px;height:86px;border-radius:22px;background:rgba(36,40,56,.92);border:2px solid var(--line);font-size:38px;font-weight:900;line-height:82px;text-align:center;white-space:nowrap}
    .x-lab{position:absolute;text-align:center;font-size:34px;font-weight:900;white-space:nowrap}
    .x-chip{position:absolute;top:290px;width:810px;height:100px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line);font-size:42px;font-weight:900;line-height:96px;white-space:nowrap}
    .x-chip .n{display:inline-block;width:62px;height:62px;margin:0 24px 0 24px;border-radius:50%;background:var(--brand);text-align:center;line-height:62px;font-size:34px;vertical-align:middle}
    .x-stat{position:absolute;left:990px;top:300px;width:810px;height:250px}
    .x-stat .a{position:absolute;left:0;right:0;top:40px;text-align:center;font-size:44px;font-weight:900;white-space:nowrap}
    .x-stat .b{position:absolute;left:0;right:0;top:130px;text-align:center;font-size:56px;font-weight:900;white-space:nowrap}
    .x-tile{position:absolute;top:400px;width:390px;height:250px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .x-tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .x-tile .f{margin-top:104px;font-size:64px;font-weight:900;line-height:1}
    .x-tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', WARM = '#f3a764', GOLD = '#f2c443', MUTED = '#a3abbd', GOOD = '#4cc781'
  const EQ = '<i class="x-eq"></i>'
  const HP = 'H<sup>+</sup>', OH = 'OH<sup>−</sup>', AM = 'A<sup>−</sup>', HBP = 'HB<sup>+</sup>', H3O = 'H<sub>3</sub>O<sup>+</sup>', H2O = 'H<sub>2</sub>O'
  const HAC = 'CH<sub>3</sub>COOH', AC = 'CH<sub>3</sub>COO<sup>−</sup>', KA = 'pK<sub>a</sub>'
  const CHECK = '<svg viewBox="0 0 64 64" style="display:block;width:100%;height:100%"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  // small particles: H+ (gold), OH- (teal), water (red O with two gray H)
  const hp = (x, y, r = 30) => ball(x, y, r, 'gold', sup('H', '+'), r * 0.8)
  const oh = (x, y, r = 34) => ball(x, y, r, 'teal', sup('OH', '−'), r * 0.62)
  const water = (x, y, s = 1) => `<g transform="translate(${x} ${y})">${ball(-24 * s, 18 * s, 15 * s, 'gray')}${ball(24 * s, 18 * s, 15 * s, 'gray')}${ball(0, 0, 26 * s, 'red')}</g>`
  const ha = (x, y, s = 1) => `<g transform="translate(${x} ${y})">${ball(0, 0, 17 * s, 'pur')}${ball(20 * s, -13 * s, 10 * s, 'gold')}</g>`

  // ---------- intro: a faint row where H+ meets OH- ----------
  const IX = [330, 560, 790, 1130, 1360, 1590]
  EZ.intro = {
    chips: [['1@0.45', 'React in moles'], ['1@0.65', 'What’s left over?'], ['1@0.85', 'Four cases']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.28">
      ${IX.map((x, i) => i % 2 ? oh(x, 890, 28) : hp(x, 890, 24)).join('')}
      <g class="x-i1">${hp(0, 0, 24)}</g><g class="x-i2">${oh(0, 0, 28)}</g></svg>`,
    update(c) {
      const p = 0.5 - 0.5 * Math.cos((c.t - c.sc.start) * 1.1)
      c.$('.x-i1').setAttribute('transform', `translate(${lerp(905, 945, p)} 890)`)
      c.$('.x-i2').setAttribute('transform', `translate(${lerp(1015, 975, p)} 890)`)
    },
  }

  // ---------- hook: five H+ meet three OH-; two H+ are left over ----------
  const AX = 300, BX = 900, MX = 600
  const ay = (i) => 394 + i * 104, by = (i) => 394 + i * 104
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">The big question</div><h2 class="h1" data-at="in+0.2">Mix an acid and a base</h2>
      <div class="card" style="left:120px;top:290px;width:960px;height:600px" data-at="in+0.3" data-fx="fade"></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="0@0.2" data-fx="fade">
        <text x="${AX}" y="335" text-anchor="middle" font-size="34" font-weight="900" class="f-gold">acid</text>
        <text x="${BX}" y="335" text-anchor="middle" font-size="34" font-weight="900" class="f-teal">base</text>
        ${[0, 1, 2].map((i) => `<g class="x-w${i}" style="opacity:0">${water(MX, ay(i))}</g>`).join('')}
        ${[0, 1, 2, 3, 4].map((i) => `<g class="x-a${i}" transform="translate(${AX} ${ay(i)})">${hp(0, 0)}</g>`).join('')}
        ${[0, 1, 2].map((i) => `<g class="x-b${i}" transform="translate(${BX} ${by(i)})">${oh(0, 0)}</g>`).join('')}
        <circle class="x-ring" cx="${AX}" cy="${(ay(3) + ay(4)) / 2}" r="120" fill="none" stroke="${GOLD}" stroke-width="5" style="opacity:0"/>
      </g>
        <text x="${MX}" y="${ay(2) + 70}" text-anchor="middle" font-size="30" font-weight="800" class="f-muted" data-at="2@0.75" data-fx="fade">water</text>
        <text x="${AX + 150}" y="${(ay(3) + ay(4)) / 2 + 12}" font-size="34" font-weight="900" class="f-gold" data-at="2@0.9" data-fx="fade">left over</text>
      </svg>
      <div class="x-q" style="top:330px" data-at="1">Who <span class="gold">wins</span>?</div>
      <div class="x-q" style="top:480px" data-at="1@0.5">What’s <span class="teal">left over</span>?</div>
      <div class="x-q" style="top:630px;font-size:42px" data-at="2@0.9" data-fx="pop">here: <span class="gold">the acid wins</span></div>
      <div class="banner" style="top:910px;left:120px" data-at="3" data-fx="pop">Then it is one of <span class="gold">four simple cases</span></div>`,
    update(c) {
      const b = c.b
      for (let i = 0; i < 3; i++) {
        const t0 = b[2].start + 0.2 + i * 0.3, p = eio(c.seg(t0, t0 + 0.8)), f = clamp((p - 0.8) / 0.2)
        c.$('.x-a' + i).setAttribute('transform', `translate(${lerp(AX, MX - 34, p)} ${ay(i)})`)
        c.$('.x-b' + i).setAttribute('transform', `translate(${lerp(BX, MX + 38, p)} ${by(i)})`)
        c.$('.x-a' + i).style.opacity = 1 - f; c.$('.x-b' + i).style.opacity = 1 - f
        c.$('.x-w' + i).style.opacity = f
      }
      c.$('.x-ring').style.opacity = eo(c.seg(b[2].start + 1.6, b[2].start + 2.0))
    },
  })

  // ---------- step 1: react completely, in moles ----------
  const ROWS = [
    ['strong + strong', `${HP}(aq) + ${OH}(aq) ${ARR} ${H2O}(l)`],
    ['weak acid + strong base', `HA(aq) + ${OH}(aq) ${ARR} ${AM}(aq) + ${H2O}(l)`],
    ['weak base + strong acid', `B(aq) + ${H3O}(aq) ${ARR} ${HBP}(aq) + ${H2O}(l)`],
  ]
  EZ.scene('react', {
    html: `<div class="kicker" data-at="in" data-fx="left">Step 1</div><h2 class="h1" data-at="0">Let them react completely</h2>
      <div class="x-lead" data-at="1">Strong acids and bases react <span class="gold">quantitatively</span> = completely</div>
      ${ROWS.map(([l, e], i) => `<div class="x-row" style="top:${390 + i * 118}px" data-at="${i + 2}" data-fx="left"><span class="lb">${l}</span><span class="e">${e}</span></div>`).join('')}
      <div class="card" style="left:120px;top:760px;width:1000px;height:120px;font-size:48px;font-weight:900;line-height:116px;text-align:center;white-space:nowrap" data-at="5">Use <span class="gold">moles</span> = M × L &nbsp;<span class="muted" style="font-size:38px">not molarity</span></div>
      <div class="card" style="left:1180px;top:760px;width:620px;height:120px;font-size:44px;font-weight:900;line-height:116px;text-align:center;white-space:nowrap" data-at="6" data-fx="pop">${ARR} what’s <span class="teal">left over</span>?</div>`,
  })

  // ---------- step 2: what's left decides the pH ----------
  const pic = (inner) => `<svg width="170" height="80" viewBox="0 5 170 90">${inner}</svg>`
  const CASES = [
    ['Excess strong acid or base', `moles excess ÷ <span class="gold">total volume</span>`, `${ARR} pH`, '', pic(`${hp(40, 45, 26)}${hp(110, 45, 26)}`)],
    ['Weak acid + its conjugate base', `both left over ${ARR} <span class="teal">buffer</span>`, 'use Henderson–Hasselbalch', '', pic(`${ball(45, 50, 30, 'pur', 'HA', 22)}${ball(125, 50, 30, 'teal', sup('A', '−'), 24)}`)],
    [`Only ${AM} left`, `${AM} + ${H2O} ${EQ} HA + ${OH}`, '<span class="teal">slightly basic</span>', '', pic(`${ball(85, 50, 32, 'teal', sup('A', '−'), 26)}`)],
    [`Only ${HBP} left`, `${HBP} + ${H2O} ${EQ} B + ${H3O}`, '<span class="warm">slightly acidic</span>', '', pic(`${ball(85, 50, 32, 'warm', sup('HB', '+'), 22)}`)],
  ]
  EZ.scene('left', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Step 2</div><h2 class="h1" data-at="0">What’s left decides the pH</h2>
      ${CASES.map(([a, b2, c2, , p], i) => `<div class="card x-case" style="left:${i % 2 ? 990 : 120}px;top:${i < 2 ? 300 : 580}px" data-at="${i + 1}">
        <div class="n">${i + 1}</div><div class="a">${a}</div><div class="b">${b2}</div><div class="c">${c2}</div>${p}</div>`).join('')}
      <div class="banner" style="top:870px;font-size:46px" data-at="5" data-fx="pop">Weak acid + weak base: HA + B<span class="gold">${EQ}</span>${AM} + ${HBP} &nbsp;<span class="gold">equilibrium</span></div>`,
  })

  // ---------- worked example: strong + strong, excess acid ----------
  const BX0 = 330, BS = 96
  EZ.scene('example', {
    html: `<div class="kicker" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="in+0.2">Strong + strong, excess acid</h2>
      <div class="x-lead" data-at="1">50.0 mL of 0.100 M <span class="gold">HCl</span> &nbsp;+&nbsp; 30.0 mL of 0.100 M <span class="teal">NaOH</span></div>
      <div class="card" style="left:120px;top:370px;width:820px;height:470px" data-at="2"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="2@0.3" data-fx="fade"><text x="190" y="476" font-size="40" font-weight="900" class="f-gold">${sup('H', '+')}</text>
          ${[0, 1, 2, 3, 4].map((i) => `<rect class="x-ha${i}" x="${BX0 + i * BS}" y="430" width="78" height="66" rx="12" fill="url(#g-gold)"/>`).join('')}</g>
        <g data-at="3" data-fx="fade"><text x="180" y="596" font-size="40" font-weight="900" class="f-teal">OH<tspan dy="-.5em" font-size=".62em">−</tspan></text>
          ${[0, 1, 2].map((i) => `<rect class="x-hb${i}" x="${BX0 + i * BS}" y="550" width="78" height="66" rx="12" fill="url(#g-teal)"/>`).join('')}</g>
        <text x="530" y="690" text-anchor="middle" font-size="28" font-weight="800" class="f-muted" data-at="2@0.6" data-fx="fade">each block = 1.00 × 10<tspan dy="-.5em" font-size=".62em">−3</tspan><tspan dy=".5em"> mol</tspan></text>
        <g data-at="4@0.4" data-fx="fade"><rect x="${BX0 + 3 * BS - 10}" y="420" width="${2 * BS + 2}" height="86" rx="18" fill="none" stroke="${GOLD}" stroke-width="5"/>
          <text x="${BX0 + 3 * BS + BS}" y="548" text-anchor="middle" font-size="30" font-weight="900" class="f-gold">left over</text>
          <text x="${BX0 + 1.5 * BS - 10}" y="530" text-anchor="middle" font-size="30" font-weight="900" class="f-muted">→ water</text></g>
        <text x="530" y="790" text-anchor="middle" font-size="40" font-weight="900" style="fill:#eef0f7" data-at="5" data-fx="fade">50.0 mL + 30.0 mL = 80.0 mL</text>
      </svg>
      <div class="x-st" style="top:370px;font-size:36px" data-at="2">mol ${HP} = 0.100 × 0.0500 = 5.00 × 10<sup>−3</sup></div>
      <div class="x-st" style="top:466px;font-size:36px" data-at="3">mol ${OH} = 0.100 × 0.0300 = 3.00 × 10<sup>−3</sup></div>
      <div class="x-st" style="top:562px" data-at="4">excess ${HP} = <span class="gold">2.00 × 10<sup>−3</sup> mol</span></div>
      <div class="x-st" style="top:658px" data-at="5">total volume = <span class="teal">0.0800 L</span></div>
      <div class="x-st" style="top:754px" data-at="6">[${HP}] = 2.00 × 10<sup>−3</sup> / 0.0800 = 0.0250 M</div>
      <div class="banner" style="top:880px" data-at="6@0.6" data-fx="pop">pH = <span class="gold">1.60</span></div>`,
    update(c) {
      const w = eo(c.seg(c.b[4].start, c.b[4].start + 0.6))
      for (let i = 0; i < 3; i++) { c.$('.x-ha' + i).style.opacity = 1 - 0.75 * w; c.$('.x-hb' + i).style.opacity = 1 - 0.75 * w }
    },
  })

  // ---------- the trick: moles first, mix later (the volume grows) ----------
  const BK = (x, w, h, lvl) => `<path d="M${x - w / 2} ${820 - h} V820 H${x + w / 2} V${820 - h}" fill="none" stroke="#c9cee0" stroke-width="5" stroke-linejoin="round"/>
    <rect x="${x - w / 2 + 5}" y="${820 - lvl}" width="${w - 10}" height="${lvl - 3}" fill="${TEAL}" opacity=".35"/>`
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Trick</div><h2 class="h1" data-at="0">Moles first, mix later</h2>
      <div class="x-chip" style="left:120px" data-at="1"><span class="n">1</span>convert to <span class="gold">moles</span> first</div>
      <div class="x-chip" style="left:990px" data-at="1@0.5"><span class="n">2</span>÷ the <span class="teal">new total volume</span></div>
      <div class="card" style="left:120px;top:430px;width:820px;height:420px" data-at="2"></div>
      <div class="x-lab warm" style="left:120px;width:820px;top:450px" data-at="2@0.2" data-fx="fade">mixing makes the volume grow</div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="3" data-fx="fade"><g class="x-s1">${BK(330, 170, 190, 90)}</g><g class="x-s2">${BK(730, 170, 190, 90)}</g></g>
        <g class="x-big" style="opacity:0">${BK(530, 300, 250, 180)}</g>
      </svg>
      <div data-at="3" data-out="5" data-fx="fade">
        <div class="x-lab" style="left:180px;width:300px;top:540px;font-size:28px" data-at="3@0.2" data-fx="fade">25.0 mL<br><span class="teal">0.20 M NaOH</span></div>
        <div class="x-lab" style="left:580px;width:300px;top:540px;font-size:28px" data-at="3@0.6" data-fx="fade">25.0 mL<br><span class="gold">0.10 M HCl</span></div></div>
      <div class="x-lab x-bl" style="left:380px;width:300px;top:515px;opacity:0">50.0 mL</div>
      <div class="x-st" style="top:450px;font-size:34px" data-at="4">excess ${OH} = 0.0050 − 0.0025 = <span class="teal">0.0025 mol</span></div>
      <div class="x-st" style="top:552px" data-at="5">÷ <span class="gold">0.0500 L</span> &nbsp;<span class="bad">not 0.0250 L</span></div>
      <div class="x-st" style="top:654px" data-at="6">[${OH}] = 0.050 M ${ARR} pOH = 1.30</div>
      <div class="banner" style="top:880px" data-at="6@0.6" data-fx="pop">pH = <span class="gold">12.70</span></div>`,
    update(c) {
      const t5 = c.b[5].start, p = eio(c.seg(t5, t5 + 0.9))
      c.$('.x-s1').setAttribute('transform', `translate(${lerp(0, 200, p)} 0)`)
      c.$('.x-s2').setAttribute('transform', `translate(${lerp(0, -200, p)} 0)`)
      c.$('.x-s1').style.opacity = 1 - p; c.$('.x-s2').style.opacity = 1 - p
      c.$('.x-big').style.opacity = p
      c.$('.x-bl').style.opacity = clamp((p - 0.6) / 0.4)    },
  })

  // ---------- weak acid with a strong base: part-way, then all the way ----------
  const MXs = Array.from({ length: 10 }, (_, i) => 250 + i * 150)
  const PHX = (v) => 300 + v * 94 // pH 0..14 -> px
  EZ.scene('weak', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Weak + strong</div><h2 class="h1" data-at="0">Acetic acid with NaOH</h2>
      <div class="x-lead" data-at="1">50.0 mL of 0.100 M <span class="pri">${HAC}</span> = <span class="pri">5.00 mmol</span></div>
      <div class="card" style="left:120px;top:370px;width:1680px;height:200px" data-at="1@0.2" data-fx="fade"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.3" data-fx="fade">${MXs.map((x, i) => `<g transform="translate(${x} 470)"><g class="x-ma${i}">${ball(0, 0, 32, 'pur')}</g><g class="x-mt${i}" style="opacity:0">${ball(0, 0, 32, 'teal')}</g><g class="x-mh${i}">${ball(0, 0, 18, 'gold')}</g></g>`).join('')}</g>
        <g data-at="3" data-fx="fade"><rect x="${PHX(0)}" y="880" width="${PHX(14) - PHX(0)}" height="22" rx="11" fill="#363c54"/>
          ${[0, 7, 14].map((v) => `<text x="${PHX(v)}" y="944" text-anchor="middle" font-size="28" font-weight="800" class="f-muted">${v}</text>`).join('')}
          <line x1="${PHX(7)}" y1="868" x2="${PHX(7)}" y2="914" stroke="#c9cee0" stroke-width="4"/>
          <text x="${PHX(0) - 30}" y="900" text-anchor="end" font-size="30" font-weight="900" class="f-muted">pH</text></g>
        <g data-at="3@0.5" data-out="4" data-fx="pop"><circle cx="${PHX(4.74)}" cy="891" r="20" fill="${GOLD}"/><text x="${PHX(4.74)}" y="856" text-anchor="middle" font-size="30" font-weight="900" class="f-gold">4.74</text></g>
        <g data-at="5@0.5" data-fx="pop"><circle cx="${PHX(8.72)}" cy="891" r="20" fill="${TEAL}"/><text x="${PHX(8.72)}" y="856" text-anchor="middle" font-size="30" font-weight="900" class="f-teal">≈ 8.72</text></g>
      </svg>
      <div class="x-lab" style="left:120px;width:1680px;top:590px;font-size:30px" data-at="1@0.4" data-fx="fade"><span class="pri">● ${HAC}</span> &nbsp;&nbsp; <span class="teal" data-at="2@0.3" data-fx="fade">● ${AC} (acetate)</span></div>
      <div data-at="2" data-out="4" data-fx="fade">
        <div class="x-lab" style="left:120px;width:1680px;top:660px;font-size:42px">+ 2.50 mmol NaOH ${ARR} <span class="pri">2.50 mmol HA</span> + <span class="teal">2.50 mmol ${AM}</span></div>
        <div class="x-lab" style="left:120px;width:1680px;top:740px;font-size:42px" data-at="3" data-fx="fade"><span class="gold">buffer</span>: pH = ${KA} = <span class="gold">4.74</span></div>
      </div>
      <div data-at="4" data-fx="fade">
        <div class="x-lab" style="left:120px;width:1680px;top:660px;font-size:42px">+ 5.00 mmol NaOH ${ARR} only <span class="teal">5.00 mmol ${AC}</span></div>
        <div class="x-lab" style="left:120px;width:1680px;top:740px;font-size:42px" data-at="5" data-fx="fade">weak base left ${ARR} <span class="teal">slightly basic</span>, pH ≈ 8.72</div>
      </div>`,
    update(c) {
      const b = c.b
      for (let i = 0; i < 10; i++) {
        const t0 = i < 5 ? b[2].start + 0.4 + i * 0.14 : b[4].start + 0.4 + (i - 5) * 0.14
        const p = eio(c.seg(t0, t0 + 0.6))
        c.$('.x-ma' + i).style.opacity = 1 - p; c.$('.x-mt' + i).style.opacity = p
        c.$('.x-mh' + i).setAttribute('transform', `translate(${lerp(34, 60, p)} ${lerp(-24, -70, p)})`)
        c.$('.x-mh' + i).style.opacity = 1 - p
      }
    },
  })

  // ---------- try it ----------
  const OPTS = [['A', 'acidic'], ['B', 'neutral'], ['C', 'basic'], ['D', 'a buffer']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">The resulting solution is…</h2>
      <div style="position:absolute;left:120px;top:278px;font-size:42px;font-weight:800;color:var(--muted);white-space:nowrap" data-at="1@0.05">Equal moles of <b class="pri">${HAC}</b> and <b class="teal">NaOH</b> are mixed</div>
      ${OPTS.map(([l, w], i) => `<div class="x-tile x-t${i}" style="left:${120 + i * 430}px" data-at="1@${(0.6 + i * 0.08).toFixed(2)}" data-fx="pop"><div class="l">${l}</div>
        ${i === 2 ? `<div class="ok" style="opacity:0">${CHECK}</div>` : ''}<div class="f">${w}</div></div>`).join('')}
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="820" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="820" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 820)"/>
        <text class="x-num" x="960" y="846" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="950" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:730px;font-size:46px" data-at="4" data-fx="pop">${HAC} + ${OH} ${ARR} ${AC} + ${H2O}</div>
      <div class="banner" style="top:870px;font-size:46px" data-at="5" data-fx="pop">Acetate is a <span class="teal">weak base</span> ${ARR} slightly <span class="teal">basic</span></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.5, b[3].start + 0.95))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.x-t' + i)
        if (i === 2) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="150" viewBox="0 0 460 150">${hp(70, 75, 34)}<text x="140" y="88" text-anchor="middle" font-size="44" font-weight="900" class="f-muted">+</text>${oh(210, 75, 38)}
    <path d="M268 75h60" stroke="${MUTED}" stroke-width="6" marker-end="url(#mk-muted)"/>${water(390, 70, 1.1)}</svg>`
  const r2 = `<svg width="460" height="150" viewBox="0 0 460 150">${hp(80, 75, 32)}${hp(150, 75, 32)}
    <line x1="230" y1="20" x2="230" y2="130" stroke="#363c54" stroke-width="4"/>${ball(310, 75, 36, 'pur', 'HA', 26)}${ball(395, 75, 36, 'teal', sup('A', '−'), 28)}</svg>`
  const r3 = `<svg width="460" height="150" viewBox="0 0 460 150">${ball(140, 75, 40, 'teal', sup('A', '−'), 30)}${ball(320, 75, 40, 'warm', sup('HB', '+'), 26)}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>React the <span class="gold">strong</span><br>species<br>completely,<br>in <span class="gold">moles</span></p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Excess strong ${ARR}<br>pH from the excess<br><br>Weak + conjugate ${ARR}<br><span class="teal">buffer</span></p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Only ${AM} left ${ARR}<br><span class="teal">basic</span><br><br>Only ${HBP} left ${ARR}<br><span class="warm">acidic</span></p></div>`,
  })
  void GOOD; void WARM; void ha
})()
