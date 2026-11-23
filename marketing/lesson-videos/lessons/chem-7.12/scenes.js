// Pictures for chem-7.12 "The Common-Ion Effect". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u7.ts and chem/book.ts): AgCl in 0.10 M
// NaCl (Ksp = 1.8 × 10⁻¹⁰, s = 1.8 × 10⁻⁹ M, 1.3 × 10⁻⁵ M in pure water, about 7,500 times less), the
// CaF2 quick check (3.9 × 10⁻¹¹, 0.010 M NaF, 3.9 × 10⁻⁷ M), the BaSO4 quick check and the PbCl2 try
// question. Ion counts in the beakers are pictures, not amounts; bars and sizes are not to scale.
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-eq{display:inline-block;width:1.15em;height:.72em;margin:0 .24em;vertical-align:-.02em;background:currentColor;-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 22'%3E%3Cpath d='M2 7h29l-7-5.5M32 15H3l7 5.5' fill='none' stroke='black' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/contain no-repeat}
    .x-larr{display:inline-block;width:.9em;height:.62em;margin:0 .22em;background:currentColor;transform:scaleX(-1);-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 20'%3E%3Cpath d='M1 10h25M18 2l9 8-9 8' fill='none' stroke='black' stroke-width='3.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/contain no-repeat}
    .x-f{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 .12em;line-height:1.12}
    .x-f>span{display:block;padding:0 .14em}
    .x-f>span+span{border-top:.07em solid currentColor}
    .x-line{position:absolute;left:0;width:1920px;text-align:center;font-size:48px;font-weight:900;white-space:nowrap}
    .x-al{position:absolute;left:120px;font-size:54px;font-weight:900;white-space:nowrap}
    .x-row{position:absolute;left:120px;width:1680px;height:100px;border-radius:24px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .x-row .L{position:absolute;left:28px;top:0;line-height:96px;font-size:30px;font-weight:900;color:var(--muted);white-space:nowrap;letter-spacing:.06em}
    .x-row .E{position:absolute;left:220px;top:0;line-height:96px;font-size:48px;font-weight:900;white-space:nowrap}
    .x-res{position:absolute;left:1180px;width:620px;height:150px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center}
    .x-res .H{margin-top:18px;font-size:26px;font-weight:900;letter-spacing:.1em;color:var(--muted)}
    .x-res .V{margin-top:6px;font-size:54px;font-weight:900;white-space:nowrap}
    .x-note{position:absolute;left:1180px;width:620px;padding:22px 30px;border-radius:26px;background:rgba(243,167,100,.10);border:3px solid rgba(243,167,100,.6);font-size:38px;font-weight:900;line-height:1.25;text-align:center}
    .x-s{position:relative;color:var(--muted)} .x-s i{position:absolute;left:-6px;right:-6px;top:52%;height:7px;border-radius:4px;background:var(--bad)}
    .x-leg{position:absolute;font-size:34px;font-weight:800;white-space:nowrap;color:var(--muted)}
    .x-leg div{height:62px;line-height:62px} .x-leg svg{vertical-align:middle;margin-right:14px}
    .x-cmp{top:300px;width:700px;height:470px;text-align:center}
    .x-cmp .V{font-size:52px;font-weight:900;white-space:nowrap}
    .x-mid{position:absolute;left:820px;top:430px;width:280px;text-align:center;font-size:44px;font-weight:900;line-height:1.2}
    .x-chip{display:inline-block;padding:14px 32px;border-radius:22px;background:var(--surface2);border:2px solid var(--line)}
    .x-st{position:absolute;left:900px;width:900px;height:120px;border-radius:24px;background:rgba(36,40,56,.92);border:2px solid var(--line);padding:0 24px 0 100px;display:flex;align-items:center;font-size:44px;font-weight:900;white-space:nowrap}
    .x-st>i{position:absolute;left:24px;top:30px;width:56px;height:56px;border-radius:50%;background:var(--brand);font-style:normal;font-size:32px;font-weight:900;line-height:56px;text-align:center}
    .x-tc{top:430px;width:800px;height:380px;text-align:center}
    .x-tc .B{margin-top:40px;font-size:96px;font-weight:900;line-height:1} .x-tc .S{margin-top:34px;font-size:52px;font-weight:900;white-space:nowrap} .x-tc .m{margin-top:16px;font-size:34px;font-weight:800;color:var(--muted)}
    .x-opt{position:absolute;width:820px;height:130px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;padding:0 96px 0 106px;font-size:44px;font-weight:800;line-height:1.2}
    .x-opt .l{position:absolute;left:26px;top:31px;width:60px;height:60px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:32px;font-weight:900;line-height:56px;text-align:center;color:var(--muted)}
    .x-opt .ok{position:absolute;right:20px;top:29px;width:64px;height:64px;opacity:0}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:36px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', WARM = '#f3a764', TXT = '#eef0f7', GOLD = '#f2c443', PRI = '#8d8df0', MUTED = '#a3abbd'
  const CHECK = '<svg viewBox="0 0 64 64" style="display:block;width:100%;height:100%"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const EQ = '<i class="x-eq"></i>', LARR = '<i class="x-larr"></i>'
  const KSP = 'K<sub>sp</sub>', AG = 'Ag<sup>+</sup>', CL = 'Cl<sup>−</sup>'
  const SO4 = 'SO<sub>4</sub><sup>2−</sup>', BASO4 = 'BaSO<sub>4</sub>'
  const e = (n) => `10<sup>−${n}</sup>` // 10 to a negative power
  const fr = (top, bot, style = '') => `<span class="x-f" style="${style}"><span>${top}</span><span>${bot}</span></span>`
  const kspS = `K<tspan dy=".3em" font-size=".62em">sp</tspan>` // SVG, last thing in its <text>
  const PILE = '#d9dce6'

  // a beaker: glass outline, water, and a pile of solid of height h at the bottom
  const beaker = (cx, h, top = 340, bot = 790) => `
    <path d="M${cx - 206} 420 V${bot - 36} Q${cx - 206} ${bot - 4} ${cx - 174} ${bot - 4} H${cx + 174} Q${cx + 206} ${bot - 4} ${cx + 206} ${bot - 36} V420 Z" fill="rgba(60,199,188,.09)"/>
    ${h ? `<path class="x-pile${cx}" d="M${cx - 150} ${bot - 4} Q${cx} ${bot - 4 - 2 * h} ${cx + 150} ${bot - 4} Z" fill="${PILE}" opacity=".85"/>` : ''}
    <path d="M${cx - 210} ${top} V${bot - 40} Q${cx - 210} ${bot} ${cx - 170} ${bot} H${cx + 170} Q${cx + 210} ${bot} ${cx + 210} ${bot - 40} V${top}" fill="none" stroke="#c9cee0" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>`
  const dot = (g, r = 20) => `<svg width="${2 * r + 4}" height="${2 * r + 4}" viewBox="${-r - 2} ${-r - 2} ${2 * r + 4} ${2 * r + 4}">${ball(0, 0, r, g)}</svg>`
  const swatch = `<svg width="44" height="30" viewBox="0 0 44 30"><path d="M2 28 Q22 -8 42 28 Z" fill="${PILE}" opacity=".85"/></svg>`

  // ---------- intro artwork: faint beakers at the left and right edges ----------
  EZ.intro = {
    chips: [['1@0.5', 'Common ion'], ['1@0.64', 'Le Châtelier'], ['1@0.78', 'Solubility']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2"><g transform="translate(-30 0)">
      <path d="M60 400 V760 Q60 790 90 790 H250 Q280 790 280 760 V400" fill="rgba(60,199,188,.3)" stroke="${MUTED}" stroke-width="6"/>
      <path d="M90 790 Q170 740 250 790 Z" fill="${PILE}"/>
      ${ball(120, 520, 22, 'gray')}${ball(210, 600, 22, 'teal')}${ball(140, 680, 22, 'teal')}${ball(220, 480, 22, 'gray')}</g><g transform="translate(40 0)">
      <path d="M1640 400 V760 Q1640 790 1670 790 H1830 Q1860 790 1860 760 V400" fill="rgba(60,199,188,.3)" stroke="${MUTED}" stroke-width="6"/>
      <path d="M1670 790 Q1750 700 1830 790 Z" fill="${PILE}"/>
      ${ball(1690, 470, 22, 'teal')}${ball(1780, 520, 22, 'teal')}${ball(1700, 600, 22, 'teal')}${ball(1810, 640, 22, 'teal')}${ball(1750, 690, 18, 'pur')}${ball(1800, 450, 18, 'pur')}</g>
    </svg>`,
  }

  // ---------- hook: AgCl in pure water vs salt water ----------
  const LA = [[440, 500], [610, 580], [490, 690], [680, 500]], LC = [[540, 490], [680, 680], [420, 610], [560, 640]]
  const RN = [[1240, 500], [1420, 560], [1300, 650], [1500, 690], [1360, 470]], RC = [[1300, 560], [1460, 480], [1220, 700], [1430, 660], [1520, 600], [1250, 610]]
  EZ.scene('hook', {
    html: `<div class="kicker" data-at="in" data-fx="left">Two beakers</div><h2 class="h1" data-at="0">Silver chloride in water... or salt water?</h2>
      <svg class="full" viewBox="0 0 1920 1080" font-weight="900" text-anchor="middle">
        <g data-at="0@0.4" data-fx="fade">${beaker(560, 22)}
          ${LA.map(([x, y]) => ball(x, y, 22, 'gray')).join('')}${LC.map(([x, y]) => ball(x, y, 22, 'teal')).join('')}</g>
        <g data-at="1" data-fx="fade"><text x="560" y="852" font-size="40" class="f-muted">pure water</text></g>
        <g data-at="1@0.5" data-fx="fade">${beaker(1360, 0)}
          ${RN.map(([x, y]) => ball(x, y, 18, 'pur')).join('')}${RC.map(([x, y]) => ball(x, y, 22, 'teal')).join('')}
          <text x="1360" y="852" font-size="40" class="f-muted">salt water (NaCl)</text></g>
        <g data-at="2" data-fx="fade"><path d="M1210 786 Q1360 666 1510 786 Z" fill="${PILE}" opacity=".85"/>${ball(1380, 620, 22, 'gray')}
          <text x="1360" y="318" font-size="40" class="f-warm">even less AgCl dissolves</text></g>
        <g data-at="3" data-fx="fade">${RC.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="33" fill="none" stroke="${TEAL}" stroke-width="5" stroke-dasharray="9 7"/>`).join('')}</g>
      </svg>
      <div class="x-leg" style="left:830px;top:440px" data-at="0@0.6" data-fx="fade">
        <div>${dot('gray')}<span>${AG}</span></div><div>${dot('teal')}<span>${CL}</span></div>
        <div data-at="1@0.5" data-fx="fade">${dot('pur', 17)}<span>Na<sup>+</sup></span></div><div>${swatch}<span>AgCl(s)</span></div></div>
      <div class="banner" style="top:900px" data-at="4" data-fx="pop">The <span class="teal">common-ion effect</span></div>`,
  })

  // ---------- why: a common ion pushes the equilibrium toward the solid ----------
  EZ.scene('why', {
    html: `<div class="kicker" data-at="in" data-fx="left">Why it happens</div><h2 class="h1" data-at="0">Le Châtelier at work</h2>
      <svg class="full" viewBox="0 0 1920 1080" font-weight="900" text-anchor="middle">
        <g data-at="1" data-fx="fade" font-size="64">
          <text x="330" y="420" style="fill:${TXT}">AgCl(s)</text>
          <path d="M505 392 H615 L595 377 M615 410 H505 L525 425" fill="none" stroke="${TXT}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
          <text x="780" y="420" style="fill:${TXT}">${sup('Ag', '+')}<tspan dy=".31em">(aq)</tspan></text>
          <text x="950" y="420" style="fill:${TXT}">+</text>
          <text x="1120" y="420" class="f-teal">${sup('Cl', '−')}<tspan dy=".31em">(aq)</tspan></text>
        </g>
        <g data-at="2" data-fx="fade">
          <line x1="1120" y1="540" x2="1120" y2="462" stroke="${TEAL}" stroke-width="8" stroke-linecap="round" marker-end="url(#mk-teal)"/>
          <text x="1120" y="595" font-size="44" class="f-teal">+ ${sup('Cl', '−')}<tspan dy=".31em"> from NaCl</tspan></text>
        </g>
        <g data-at="4" data-fx="fade">
          <line x1="1000" y1="660" x2="320" y2="660" stroke="${WARM}" stroke-width="12" stroke-linecap="round" marker-end="url(#mk-warm)"/>
          <text x="660" y="730" font-size="44" class="f-warm">shifts left, toward the solid</text>
        </g>
        <g data-at="5" data-fx="fade"><text x="660" y="820" font-size="48" style="fill:${TXT}">less AgCl dissolves</text></g>
        <g data-at="1@0.5" data-fx="fade">
          <line x1="1600" y1="820" x2="1600" y2="320" stroke="#c9cee0" stroke-width="5" stroke-linecap="round" marker-end="url(#mk-text)"/>
          <line x1="1540" y1="600" x2="1660" y2="600" stroke="${TEAL}" stroke-width="8" stroke-linecap="round"/>
          <text x="1676" y="614" font-size="44" text-anchor="start" class="f-teal">${kspS}</text>
        </g>
        <g data-at="1@0.6" data-fx="fade"><g class="x-wq"><circle cx="1600" cy="0" r="22" fill="${WARM}"/><text x="1526" y="14" font-size="44" text-anchor="end" class="f-warm">Q</text></g></g>
        <g data-at="3" data-out="4@0.55" data-fx="fade"><text x="1600" y="300" font-size="40" class="f-warm">Q &gt; ${kspS}</text></g>
        <g data-at="4@0.65" data-fx="fade"><text x="1600" y="300" font-size="40" class="f-teal">back to ${kspS}</text></g>
      </svg>
      <div class="banner" style="top:880px" data-at="6" data-fx="pop">A common ion <span class="warm">lowers solubility</span></div>`,
    update(c) {
      const b = c.b
      const up = eio(c.seg(b[3].start + 0.2, b[3].start + 1.2)), down = eio(c.seg(b[4].start + 0.6, b[4].start + 2.0))
      c.$('.x-wq').setAttribute('transform', `translate(0 ${600 - 190 * up + 190 * down})`)
    },
  })

  // ---------- worked example: AgCl in 0.10 M NaCl ----------
  EZ.scene('example', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">AgCl in 0.10 M NaCl</h2>
      <div class="x-row" style="top:290px" data-at="1"><div class="L">GIVEN</div><div class="E">${KSP}(AgCl) = 1.8 × ${e(10)} &nbsp;&nbsp; in <span class="teal">0.10 M NaCl</span></div></div>
      <div class="x-al" style="top:440px" data-at="2">[${AG}] = <span class="pri">s</span></div>
      <div class="x-al" style="top:560px" data-at="3">[${CL}] = 0.10 <span class="x-s">+ s<i data-at="3@0.55" data-fx="grow"></i></span> <span data-at="3@0.6" data-fx="fade">≈ <span class="teal">0.10</span></span></div>
      <div class="x-al" style="top:680px" data-at="4">${KSP} = <span class="pri">s</span>(0.10) = 1.8 × ${e(10)}</div>
      <div class="x-note" style="top:440px" data-at="3@0.4" data-fx="pop">s is tiny, so<br>0.10 + s ≈ 0.10</div>
      <div class="x-res" style="top:680px;border-color:rgba(242,196,67,.7)" data-at="5" data-fx="pop"><div class="H">DIVIDE BY 0.10</div><div class="V gold">s = 1.8 × ${e(9)} M</div></div>`,
  })

  // ---------- compare: pure water vs 0.10 M NaCl ----------
  EZ.scene('compare', {
    html: `<div class="kicker" data-at="in" data-fx="left">Compare</div><h2 class="h1" data-at="0">How much less?</h2>
      <div class="card x-cmp" style="left:120px" data-at="0@0.3"><h3>Pure water</h3>
        <svg width="600" height="250" viewBox="0 0 600 250"><line x1="120" y1="236" x2="480" y2="236" stroke="#c9cee0" stroke-width="4"/><rect class="x-bar" x="230" y="236" width="140" height="0" rx="10" fill="${PRI}"/></svg>
        <div class="V pri" data-at="1@0.3" data-fx="fade">s = 1.3 × ${e(5)} M</div></div>
      <div class="card x-cmp" style="left:1100px" data-at="0@0.3"><h3>0.10 M NaCl</h3>
        <svg width="600" height="250" viewBox="0 0 600 250"><line x1="120" y1="236" x2="480" y2="236" stroke="#c9cee0" stroke-width="4"/><rect x="230" y="232" width="140" height="4" fill="${GOLD}"/></svg>
        <div class="V gold">s = 1.8 × ${e(9)} M</div></div>
      <div class="x-mid" data-at="2" data-fx="pop">about<br><span class="warm" style="font-size:60px">7,500×</span><br>less</div>
      <div class="x-line" style="top:830px;font-size:40px" data-at="3">[${CL}] already high ${ARR} only a tiny [${AG}] can exist before Q reaches ${KSP}</div>`,
    update(c) {
      const h = 210 * eio(c.seg(c.b[1].start, c.b[1].start + 1.0))
      const el = c.$('.x-bar')
      el.setAttribute('height', h); el.setAttribute('y', 236 - h)
    },
  })

  // ---------- the shortcut: ignore the tiny s ----------
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Ignore the tiny s</h2>
      <div class="x-line" style="top:290px;font-size:46px" data-at="1">Common ion <span class="teal">much bigger</span> than s ${ARR} drop the <span class="warm">“+ s”</span></div>
      <svg class="full" viewBox="0 0 1920 1080" font-weight="900" text-anchor="middle">
        <g data-at="2" data-fx="fade">
          <rect x="360" y="430" width="1200" height="64" rx="12" fill="${TEAL}"/>
          <text x="960" y="476" font-size="38" class="f-dark">0.10</text>
          <rect x="1561" y="430" width="3" height="64" fill="${WARM}"/>
          <line x1="1562" y1="424" x2="1562" y2="400" stroke="${WARM}" stroke-width="4"/>
          <text x="1562" y="390" font-size="38" class="f-warm">+ s</text>
        </g>
      </svg>
      <div class="x-line" style="top:540px;font-size:56px" data-at="2@0.3">0.10 <span class="x-s">+ 1.8 × ${e(9)}<i data-at="2@0.75" data-fx="grow"></i></span> ≈ <span class="teal">0.10</span></div>
      <div class="x-line" style="top:670px;font-size:46px" data-at="3"><span class="x-chip">cubic or quadratic</span> ${ARR} <span class="x-chip gold">simple division</span></div>
      <div class="banner" style="top:820px;font-size:46px" data-at="4" data-fx="pop">Check: 1.8 × ${e(9)} is far less than 5% of 0.10 <span class="good">✓</span></div>`,
  })

  // ---------- a squared common ion: CaF2 in 0.010 M NaF ----------
  EZ.scene('squared', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Watch out</div><h2 class="h1" data-at="0">When the common ion is squared</h2>
      <div class="x-row" style="top:290px" data-at="1"><div class="L">GIVEN</div><div class="E">${KSP}(CaF<sub>2</sub>) = 3.9 × ${e(11)} &nbsp;&nbsp; in <span class="teal">0.010 M NaF</span></div></div>
      <div class="x-al" style="top:430px" data-at="2">${KSP} = [Ca<sup>2+</sup>][F<sup>−</sup>]<sup class="gold">2</sup></div>
      <div class="x-al" style="top:540px" data-at="3">[Ca<sup>2+</sup>] = <span class="pri">s</span> &nbsp;&nbsp; [F<sup>−</sup>] ≈ <span class="teal">0.010</span></div>
      <div class="x-al" style="top:650px" data-at="4"><span class="pri">s</span>(0.010)<sup class="gold">2</sup> = 3.9 × ${e(11)}</div>
      <div class="x-al" style="top:770px" data-at="5"><span class="pri">s</span> = ${fr(`3.9 × ${e(11)}`, `1.0 × ${e(4)}`, 'font-size:44px')} = <span class="gold">3.9 × ${e(7)} M</span></div>
      <div class="x-note" style="top:430px" data-at="2@0.5" data-fx="pop">The F<sup>−</sup> term<br>is <span class="gold">squared</span>!</div>`,
  })

  // ---------- precipitation: Na2SO4 added to saturated BaSO4 ----------
  const PB = [[380, 500], [560, 610], [460, 700]], PS = [[520, 470], [370, 630], [620, 700]]
  const NS = [[310, 560], [640, 560]], NN = [[460, 440], [440, 580], [610, 450], [310, 700]]
  EZ.scene('precip', {
    html: `<div class="kicker" data-at="in" data-fx="left">Precipitation</div><h2 class="h1" data-at="0">A common ion can make a solid</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.3" data-fx="fade">${beaker(480, 0)}<path class="x-pp" d="M330 786 Q480 746 630 786 Z" fill="${PILE}" opacity=".85"/></g>
        <g data-at="0@0.4" data-fx="fade">
          ${PB.map(([x, y], i) => `<g class="x-pb${i}">${ball(x, y, 22, 'gold')}</g>`).join('')}
          ${PS.map(([x, y], i) => `<g class="x-ps${i}">${ball(x, y, 26, 'warm')}</g>`).join('')}</g>
        <g data-at="1" data-fx="fade">
          ${NS.map(([x, y], i) => `<g class="x-ns${i}">${ball(x, y, 26, 'warm')}</g>`).join('')}
          ${NN.map(([x, y], i) => `<g class="x-nn${i}">${ball(x, y, 17, 'pur')}</g>`).join('')}</g>
      </svg>
      <div class="x-leg" style="left:200px;top:820px" data-at="0@0.5" data-fx="fade"><div>${dot('gold')}<span>Ba<sup>2+</sup></span> &nbsp; ${dot('warm')}<span>${SO4}</span> &nbsp; <span data-at="1" data-fx="fade">${dot('pur', 17)}<span>Na<sup>+</sup></span></span></div></div>
      <div class="x-st" style="top:330px" data-at="1"><i>1</i><span>Add <span class="warm">${SO4}</span> from Na<sub>2</sub>SO<sub>4</sub></span></div>
      <div class="x-st" style="top:480px" data-at="2"><i>2</i><span>Q &gt; ${KSP}</span></div>
      <div class="x-st" style="top:630px" data-at="3"><i>3</i><span>Shifts left ${LARR}</span></div>
      <div class="x-st" style="top:780px;border-color:rgba(242,196,67,.7)" data-at="3@0.5"><i>4</i><span class="gold">${BASO4} precipitates</span></div>`,
    update(c) {
      const b = c.b
      const drop = -260 * (1 - eo(c.seg(b[1].start, b[1].start + 1.0)))
      const p = eio(c.seg(b[3].start + 0.5, b[3].start + 2.0)), fade = 1 - clamp((p - 0.7) / 0.3)
      const go = (sel, [x, y], moves, dy = 0) => {
        const el = c.$(sel)
        el.setAttribute('transform', moves ? `translate(${(480 - x) * p} ${(760 - y) * p + dy})` : `translate(0 ${dy})`)
        if (moves) el.style.opacity = fade
      }
      NS.forEach((xy, i) => go('.x-ns' + i, xy, i === 1, drop))
      NN.forEach((xy, i) => go('.x-nn' + i, xy, false, drop))
      PB.forEach((xy, i) => go('.x-pb' + i, xy, i > 0))
      PS.forEach((xy, i) => go('.x-ps' + i, xy, i === 2))
      const h = lerp(20, 50, p)
      c.$('.x-pp').setAttribute('d', `M330 786 Q480 ${786 - 2 * h} 630 786 Z`)
    },
  })

  // ---------- trap: Ksp does not change ----------
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Common trap</div><h2 class="h1" data-at="0">What changes, and what doesn’t?</h2>
      <div class="x-line" style="top:300px;font-size:60px" data-at="1">Does a common ion change ${KSP}?</div>
      <div class="card x-tc" style="left:120px;border-color:rgba(76,199,129,.7)" data-at="2"><div class="B teal">${KSP}</div>
        <div class="S good">No change</div><div class="m">same temperature</div></div>
      <div class="card x-tc" style="left:1000px;border-color:rgba(243,167,100,.7)" data-at="3"><div class="B">Solubility</div>
        <div class="S warm">Lower</div><div class="m">only this changes</div></div>`,
  })

  // ---------- try it ----------
  const OPTS = ['Pure water', '0.10 M NaNO<sub>3</sub>', '0.10 M NaCl', '0.10 M HNO<sub>3</sub>']
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">In which solution is PbCl<sub>2</sub> <span class="teal">least</span> soluble?</h2>
      ${OPTS.map((o, i) => `<div class="x-opt x-t${i}" style="left:${120 + (i % 2) * 860}px;top:${320 + Math.floor(i / 2) * 160}px" data-at="1@${0.4 + i * 0.13}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>
        ${i === 2 ? `<div class="ok">${CHECK}</div>` : ''}<span>${o}</span></div>`).join('')}
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="790" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="790" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 790)"/>
        <text class="x-num" x="960" y="816" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="920" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="x-line" style="top:670px;font-size:46px" data-at="4">NaCl supplies <span class="teal">${CL}</span>, a common ion</div>
      <div class="x-line" style="top:765px;font-size:46px" data-at="4@0.5">PbCl<sub>2</sub>(s) ${EQ} Pb<sup>2+</sup> + 2${CL} &nbsp;<span class="warm">shifts ${LARR}</span></div>
      <div class="x-line muted" style="top:870px;font-size:42px" data-at="5">The others contain no common ion</div>`,
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
  const r1 = `<svg width="440" height="170" viewBox="0 0 440 170" font-weight="900" text-anchor="middle">
    <path d="M40 140 Q110 70 180 140 Z" fill="${PILE}" opacity=".85"/>
    <line x1="400" y1="90" x2="210" y2="90" stroke="${WARM}" stroke-width="9" stroke-linecap="round" marker-end="url(#mk-warm)"/>
    <text x="320" y="62" font-size="34" style="fill:${TEAL}">+ common ion</text><text x="110" y="166" font-size="28" style="fill:${MUTED}">solid</text></svg>`
  const r2 = `<svg width="440" height="170" viewBox="0 0 440 170" font-weight="900" text-anchor="middle">
    <text x="220" y="100" font-size="80" style="fill:${TEAL}">${kspS}</text>
    <text x="220" y="160" font-size="38" style="fill:${GOLD}">same temperature</text></svg>`
  const r3 = `<svg width="440" height="170" viewBox="0 0 440 170" font-weight="900" text-anchor="middle">
    <text x="220" y="100" font-size="52" style="fill:${TXT}">0.10 <tspan style="fill:${MUTED}">+ s</tspan> ≈ <tspan style="fill:${TEAL}">0.10</tspan></text>
    <text x="220" y="156" font-size="32" style="fill:${MUTED}">s is tiny</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>A common ion<br><span class="warm">lowers solubility</span><br>(shift toward solid)</p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>${KSP} stays the same.<br>Only the <span class="warm">solubility</span><br>changes.</p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>[common ion] + s<br>≈ <span class="teal">[common ion]</span></p></div>`,
  })
  void TXT; void clamp; void lerp
})()
