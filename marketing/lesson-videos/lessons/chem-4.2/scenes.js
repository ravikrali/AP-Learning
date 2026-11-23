// Pictures for chem-4.2 "Net Ionic Equations". One EZ.scene per scene id in script.mjs.
// Every equation shown is the lesson's own (app/src/content/chem/u4.ts). Ions are drawn as shaded
// balls in a plausible size order, not to scale.
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .n-row{position:absolute;left:120px;width:1680px;height:150px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .n-lab{position:absolute;left:30px;top:14px;font-size:24px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);white-space:nowrap}
    .n-tag{position:absolute;right:26px;top:10px;padding:2px 18px;border-radius:999px;font-size:26px;font-weight:900;white-space:nowrap}
    .n-eq{position:absolute;left:0;right:0;top:54px;text-align:center;font-size:46px;font-weight:900;white-space:nowrap}
    .n-t{display:inline-block;position:relative;padding:0 4px}
    .n-st{font-size:.6em;font-weight:800;color:var(--muted);margin-left:2px}
    .n-op{display:inline-block;margin:0 20px;color:var(--muted)}
    .n-dim{color:#6b7288}
    .n-x{position:absolute;left:-2px;right:-2px;top:47%;height:7px;border-radius:4px;background:var(--bad)}
    .n-hl{position:absolute;left:-8px;right:-8px;top:-2px;bottom:-4px;border:3px solid var(--warm);border-radius:14px}
    .n-note{position:absolute;left:1100px;width:700px;height:112px;padding:14px 22px 0 92px;border-radius:22px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .n-note i{position:absolute;left:24px;top:30px;width:46px;height:46px;border-radius:50%}
    .n-note b{display:block;font-size:36px;font-weight:900;line-height:1.15;white-space:nowrap} .n-note span{display:block;font-size:27px;font-weight:700;color:var(--muted);white-space:nowrap}
    .n-netc{left:1100px;top:790px;width:700px;height:160px;text-align:center}
    .n-netc .n-lab{left:0;right:0;top:18px;text-align:center} .n-netc .n-eq{top:62px;font-size:44px}
    .n-it{position:absolute;left:40px;right:40px;padding-left:34px;border-left:8px solid}
    .n-it b{display:block;font-size:40px;font-weight:900;line-height:1.15;white-space:nowrap} .n-it span{display:block;margin-top:4px;font-size:31px;font-weight:800;color:var(--muted);white-space:nowrap}
    .n-chip{position:absolute;top:40px;height:78px;padding:0 30px;border-radius:20px;background:rgba(255,255,255,.05);border:3px solid var(--line);font-size:40px;font-weight:900;line-height:72px;white-space:nowrap}
    .n-step{position:absolute;left:40px;right:40px;height:118px;border-radius:24px;background:rgba(255,255,255,.04);border:2px solid var(--line);padding:0 24px 0 112px;display:flex;align-items:center;font-size:36px;font-weight:800;line-height:1.2}
    .n-step em{position:absolute;left:24px;top:24px;width:66px;height:66px;border-radius:50%;background:var(--brand);font-style:normal;font-size:38px;font-weight:900;line-height:66px;text-align:center}
    .n-ln{position:absolute;left:40px;right:40px;font-size:40px;font-weight:900;white-space:nowrap}
    .n-ln small{display:block;font-size:24px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:4px}
    .n-chg{position:absolute;left:40px;right:40px;height:104px;border-radius:22px;background:rgba(76,199,129,.12);border:3px solid var(--good);font-size:40px;font-weight:900;line-height:98px;text-align:center;white-space:nowrap}
    .n-foot{position:absolute;left:0;right:0;bottom:26px;text-align:center;font-size:34px;font-weight:900;white-space:nowrap}
    .n-opt{position:absolute;width:820px;height:130px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;padding:0 90px 0 106px;font-size:34px;font-weight:900;line-height:1.2;white-space:nowrap}
    .n-opt .l{position:absolute;left:26px;top:33px;width:60px;height:60px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:32px;font-weight:900;line-height:56px;text-align:center;color:var(--muted)}
    .n-opt .ok{position:absolute;right:18px;top:31px;width:64px;height:64px}
    .n-rc{top:320px;width:540px;height:580px;text-align:center} .n-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .n-rc svg{display:block;margin:14px auto 0} .n-rc p{margin:14px 16px 0;font-size:33px;font-weight:800;line-height:1.32;white-space:nowrap}
    .n-mini{height:210px;margin-top:14px;padding-top:22px;font-size:38px;font-weight:900;line-height:1.6;white-space:nowrap}
  `
  document.head.appendChild(css)

  const CHECK = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  // 'SO4^2-' -> SO<sub>4</sub><sup>2−</sup>
  const fm = (s) => { const [b, ch] = s.split('^'); return b.replace(/(\d+)/g, '<sub>$1</sub>') + (ch ? `<sup>${ch.replace('-', '−')}</sup>` : '') }
  // one species of an equation: formula, state, options { at, cls, co (coefficient), hl (outline at), x (strike at) }
  const tok = (s, st, o = {}) => `<span class="n-t ${o.cls || ''}"${o.at ? ` data-at="${o.at}" data-fx="fade"` : ''}>${o.co || ''}${fm(s)}${st ? `<span class="n-st">(${st})</span>` : ''}${o.hl ? `<i class="n-hl" data-at="${o.hl}" data-fx="fade"></i>` : ''}${o.x ? `<i class="n-x" data-at="${o.x}" data-fx="grow" data-dur="0.35"></i>` : ''}</span>`
  const op = (c, at) => `<span class="n-op"${at ? ` data-at="${at}" data-fx="fade"` : ''}>${c}</span>`
  const P = (at) => op('+', at), R = (at) => op('→', at)
  const row = (top, at, label, eq, extra = '', style = '') => `<div class="n-row" style="top:${top}px;${style}" data-at="${at}"><div class="n-lab">${label}</div>${extra}<div class="n-eq">${eq}</div></div>`
  const dimAfter = (c, spec) => { const on = c.t >= c.at(spec) + 0.2; for (const el of c.root.querySelectorAll('.n-sp')) el.classList.toggle('n-dim', on) }

  // ion balls, labelled
  const ION = { Ag: [34, 'gray', sup('Ag', '+')], Cl: [44, 'teal', sup('Cl', '−')], Na: [32, 'warm', sup('Na', '+')], NO3: [44, 'pur', 'NO₃<tspan dy="-.5em" font-size=".62em">−</tspan>'] }
  const ion = (k, fs) => { const [r, g, l] = ION[k]; return ball(0, 0, r, g, l, fs ?? (k === 'NO3' ? 24 : 28)) }

  // ---------- intro artwork: a few faint ions at the left and right edges ----------
  const IART = [['Ag', 150, 300], ['Cl', 250, 470], ['Na', 120, 640], ['NO3', 260, 820], ['Cl', 1700, 300], ['Na', 1800, 480], ['Ag', 1680, 660], ['NO3', 1790, 840]]
  EZ.intro = {
    chips: [['1@0.35', 'Three ways to write it'], ['1@0.6', 'What to split'], ['1@0.82', 'A 4-step checklist']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.24">${IART.map(([k], i) => `<g class="ia${i}">${ion(k)}</g>`).join('')}</svg>`,
    update(c) {
      IART.forEach(([, x, y], i) => c.$('.ia' + i).setAttribute('transform', `translate(${x + 8 * Math.sin(c.t * 0.9 + i)} ${y + 10 * Math.sin(c.t * 0.7 + i * 1.7)})`))
    },
  }

  // ---------- hook: the beaker ----------
  const PLAY = [['Ag', 360, 520, 550, 900], ['Ag', 780, 450, 710, 900], ['Ag', 560, 640, 630, 820], ['Cl', 900, 560, 630, 900], ['Cl', 420, 700, 550, 820], ['Cl', 700, 700, 710, 820]]
  const SPEC = [['Na', 480, 410], ['Na', 880, 700], ['Na', 340, 800], ['NO3', 620, 500], ['NO3', 930, 840], ['NO3', 440, 860]]
  const note = (top, at, color, a, b) => `<div class="n-note" style="top:${top}px" data-at="${at}" data-fx="right"><i style="background:${color}"></i><b>${a}</b><span>${b}</span></div>`
  EZ.scene('hook', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Players and spectators</div><h2 class="h1" data-at="in+0.2">Who is really reacting?</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <rect x="262" y="390" width="736" height="556" rx="40" fill="rgba(60,199,188,.07)"/>
        <path d="M250 310 V900 Q250 958 308 958 H952 Q1010 958 1010 900 V310" fill="none" stroke="#c9cee0" stroke-width="7" stroke-linecap="round" opacity=".75"/>
        ${SPEC.map(([k], i) => `<g class="sp${i}">${ion(k)}<circle r="${ION[k][0] + 12}" fill="none" stroke="#f3a764" stroke-width="4" stroke-dasharray="10 9" data-at="1@0.2" data-fx="fade"/></g>`).join('')}
        ${PLAY.map(([k], i) => `<g class="pl${i}">${ion(k)}</g>`).join('')}
        <text x="630" y="1012" text-anchor="middle" font-size="34" font-weight="900" class="f-teal" data-at="0@0.85" data-fx="fade">solid AgCl</text>
      </svg>
      ${note(310, '0@0.45', '#3cc7bc', 'Ag<sup>+</sup> and Cl<sup>−</sup> join', 'solid silver chloride forms')}
      ${note(446, '1', '#f3a764', 'Na<sup>+</sup> and NO<sub>3</sub><sup>−</sup> float around', 'unchanged: they do nothing')}
      ${note(582, '2', '#7d859c', 'Spectators', 'like spectators at a game')}
      <div class="card n-netc" data-at="4"><div class="n-lab">Net ionic equation: only the players</div><div class="n-eq">${tok('Ag^+', 'aq')}${P()}${tok('Cl^-', 'aq')}${R()}${tok('AgCl', 's')}</div></div>`,
    update(c) {
      const b = c.b, t = c.t, p = eio(c.seg(b[0].start + 0.6, b[0].start + 2.8))
      PLAY.forEach(([, x0, y0, x1, y1], i) => {
        const w = 1 - p, dx = 8 * Math.sin(t * 1.5 + i * 1.3) * w, dy = 9 * Math.sin(t * 1.2 + i * 2.1) * w
        c.$('.pl' + i).setAttribute('transform', `translate(${lerp(x0, x1, p) + dx} ${lerp(y0, y1, p) + dy})`)
      })
      SPEC.forEach(([, x, y], i) => c.$('.sp' + i).setAttribute('transform', `translate(${x + 9 * Math.sin(t * 1.4 + i * 1.9)} ${y + 9 * Math.sin(t * 1.1 + i * 1.3)})`))
    },
  })

  // ---------- three ways to write one reaction ----------
  const SP = (s, st, at) => tok(s, st, { cls: 'n-sp', hl: '5', x: '6', at })
  EZ.scene('three', {
    html: `<div class="kicker" data-at="in" data-fx="left">Three ways</div><h2 class="h1" data-at="0">One reaction, three equations</h2>
      ${row(300, '1', 'Molecular', `${tok('AgNO3', 'aq')}${P()}${tok('NaCl', 'aq')}${R()}${tok('AgCl', 's')}${P()}${tok('NaNO3', 'aq')}`)}
      ${row(480, '2', 'Complete ionic: split the strong electrolytes', `${tok('Ag^+', 'aq', { at: '3@0.15' })}${P('3@0.25')}${SP('NO3^-', 'aq', '3@0.3')}${P('3@0.4')}${SP('Na^+', 'aq', '3@0.5')}${P('3@0.6')}${tok('Cl^-', 'aq', { at: '3@0.7' })}`
        + `${R('4')}${tok('AgCl', 's', { at: '4@0.2' })}${P('4@0.4')}${SP('Na^+', 'aq', '4@0.5')}${P('4@0.6')}${SP('NO3^-', 'aq', '4@0.7')}`)}
      ${row(660, '7', 'Net ionic', `${tok('Ag^+', 'aq')}${P()}${tok('Cl^-', 'aq')}${R()}${tok('AgCl', 's')}`, `<div class="n-tag" style="color:var(--good);background:rgba(76,199,129,.14)">only the players</div>`, 'border-color:var(--good);background:rgba(76,199,129,.1)')}
      <div class="banner" style="top:850px" data-at="6" data-out="9" data-fx="pop"><span class="warm">Spectator ions</span>: unchanged on both sides ${ARR} cancel them</div>
      <div class="banner" style="top:850px" data-at="9" data-fx="pop">AgClO<sub>4</sub> + KCl ${ARR} the <span class="good">same</span> net ionic equation</div>`,
    update(c) { dimAfter(c, '6') },
  })

  // ---------- what to split ----------
  const QC = [['HF', 'aq', 100], ['NH3', 'aq', 330], ['KBr', 'aq', 580], ['H2O', 'l', 830]]
  EZ.scene('split', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">The rule</div><h2 class="h1" data-at="0">What to split, what not to split</h2>
      <div class="card" style="left:120px;top:290px;width:810px;height:470px;border-color:rgba(60,199,188,.6)" data-at="1-0.3"><h3 class="teal">Split into ions</h3>
        <div class="n-it" style="top:112px;border-color:var(--accent)" data-at="1"><b>Soluble ionic compounds</b><span>marked (aq)</span></div>
        <div class="n-it" style="top:232px;border-color:var(--accent)" data-at="2"><b>Strong acids</b><span>HCl, HBr, HI, HNO<sub>3</sub>, H<sub>2</sub>SO<sub>4</sub>, HClO<sub>4</sub></span></div>
        <div class="n-it" style="top:352px;border-color:var(--accent)" data-at="3"><b>Strong bases</b><span>Group 1 hydroxides; Ca, Sr, Ba hydroxides</span></div></div>
      <div class="card" style="left:990px;top:290px;width:810px;height:470px;border-color:rgba(243,167,100,.6)" data-at="4-0.3"><h3 class="warm">Keep together</h3>
        <div class="n-it" style="top:112px;border-color:var(--warm)" data-at="4"><b>Solids, liquids, gases</b><span>(s), (l), (g)</span></div>
        <div class="n-it" style="top:232px;border-color:var(--warm)" data-at="5"><b>Weak acids and bases</b><span>HC<sub>2</sub>H<sub>3</sub>O<sub>2</sub>, HF; NH<sub>3</sub></span></div>
        <div class="n-it" style="top:352px;border-color:var(--warm)" data-at="6"><b>Molecular compounds</b><span>sugar, H<sub>2</sub>O</span></div></div>
      <div class="card" style="left:120px;top:800px;width:1680px;height:158px" data-at="7">
        <div class="n-lab" style="top:58px">Quick check</div>
        ${QC.map(([s, st, x], i) => `<div class="n-chip q${i}" style="left:${x + 200}px">${fm(s)}<span class="n-st">(${st})</span></div>`).join('')}
        <div style="position:absolute;left:1340px;top:46px;font-size:44px;font-weight:900;white-space:nowrap" class="teal" data-at="8@0.3" data-fx="right">${ARR}K<sup>+</sup> + Br<sup>−</sup></div></div>`,
    update(c) {
      const w = eo(c.seg(c.b[7].start + 0.7 * (c.b[7].end - c.b[7].start), c.b[7].end))
      QC.forEach((_, i) => {
        const el = c.$('.q' + i)
        if (i === 2) { el.style.borderColor = w ? `rgba(60,199,188,${w})` : ''; el.style.boxShadow = `0 0 ${40 * w}px rgba(60,199,188,${0.5 * w})` }
        else el.style.opacity = 1 - 0.55 * w
      })
    },
  })

  // ---------- the checklist, tried on BaCl2 + Na2SO4 ----------
  const STEPS = ['Write the balanced molecular equation, with states', 'Split only strong<br>electrolytes (aq)', 'Cross out ions that are<br>identical on both sides', 'Check that atoms AND charges balance']
  EZ.scene('checklist', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">The net ionic checklist</h2>
      <div class="card" style="left:120px;top:290px;width:800px;height:660px" data-at="0@0.5">
        ${STEPS.map((s, i) => `<div class="n-step st${i}" style="top:${44 + i * 150}px" data-at="${i + 1}" data-fx="left"><em>${i + 1}</em><span>${s}</span></div>`).join('')}</div>
      <div class="card" style="left:960px;top:290px;width:840px;height:660px" data-at="5">
        <div class="n-ln" style="top:34px"><small>Try it</small>BaCl<sub>2</sub><span class="n-st">(aq)</span> + Na<sub>2</sub>SO<sub>4</sub><span class="n-st">(aq)</span></div>
        <div class="n-ln" style="top:160px;font-size:36px" data-at="6"><span class="teal">BaSO<sub>4</sub>(s)</span> precipitates</div>
        <div class="n-ln" style="top:220px;font-size:36px" data-at="6@0.45">Spectators: <span class="warm">Na<sup>+</sup></span> and <span class="warm">Cl<sup>−</sup></span></div>
        <div class="n-ln" style="top:300px" data-at="7"><small>Net ionic</small>Ba<sup>2+</sup><span class="n-st">(aq)</span> + SO<sub>4</sub><sup>2−</sup><span class="n-st">(aq)</span> → BaSO<sub>4</sub><span class="n-st">(s)</span></div>
        <div class="n-chg" style="top:440px" data-at="8"><span class="pri">(2+)</span> + <span class="pri">(2−)</span> = 0 &nbsp;${ARR}&nbsp; 0 &nbsp;<span class="good">balanced</span></div>
        <div class="n-foot gold" data-at="9" data-fx="fade">Charge balance: a free check</div></div>`,
    update(c) {
      const w = c.seg(c.at('8'), c.at('8') + 0.5)
      c.$('.st3').style.borderColor = w ? `rgba(242,196,67,${w})` : ''
      c.$('.st3').style.boxShadow = `0 0 ${40 * w}px rgba(242,196,67,${0.45 * w})`
    },
  })

  // ---------- worked example: weak acid + strong base ----------
  const AC = 'HC2H3O2', ACE = 'C2H3O2^-'
  EZ.scene('example', {
    html: `<div class="kicker" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Weak acid + strong base</h2>
      ${row(300, '1', 'Molecular', `${tok(AC, 'aq', { hl: '2' })}${P()}${tok('NaOH', 'aq')}${R()}${tok('NaC2H3O2', 'aq')}${P()}${tok('H2O', 'l')}`,
        `<div class="n-tag" style="color:var(--warm);background:rgba(243,167,100,.14)" data-at="2" data-fx="fade">weak acid: keep it together</div>`)}
      ${row(480, '3', 'Split only the strong electrolytes', `${tok(AC, 'aq')}${P()}${tok('Na^+', 'aq', { cls: 'n-sp', hl: '4', x: '4@0.5' })}${P()}${tok('OH^-', 'aq')}${R()}${tok('Na^+', 'aq', { cls: 'n-sp', hl: '4', x: '4@0.5' })}${P()}${tok(ACE, 'aq')}${P()}${tok('H2O', 'l')}`,
        `<div class="n-tag" style="color:var(--warm);background:rgba(243,167,100,.14)" data-at="4" data-fx="fade">Na<sup>+</sup> is a spectator</div>`)}
      ${row(660, '5', 'Net ionic', `${tok(AC, 'aq')}${P()}${tok('OH^-', 'aq')}${R()}${tok(ACE, 'aq')}${P()}${tok('H2O', 'l')}`, '', 'border-color:var(--good);background:rgba(76,199,129,.1)')}
      <div class="banner" style="top:850px" data-at="5@0.5" data-fx="pop">The <span class="warm">weak acid</span> stays whole; only <span class="warm">Na<sup>+</sup></span> cancels</div>`,
    update(c) { dimAfter(c, '4@0.5') },
  })

  // ---------- traps ----------
  const LAT = [[0, 0, 'Ag'], [80, 0, 'Cl'], [160, 0, 'Ag'], [0, 80, 'Cl'], [80, 80, 'Ag'], [160, 80, 'Cl']]
  const HF = [[110, 150], [300, 120], [200, 240], [390, 230]]
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Watch out</div><h2 class="h1" data-at="0">Two traps</h2>
      <div class="card" style="left:120px;top:290px;width:810px;height:450px" data-at="1"><h3><small>1</small>Don’t split a precipitate</h3>
        <svg style="position:absolute;left:0;top:110px" width="810" height="330" viewBox="0 0 810 330">
          <g transform="translate(190 90)">${LAT.map(([x, y, k]) => `<g transform="translate(${x} ${y})">${ion(k)}</g>`).join('')}</g>
          <text x="270" y="290" text-anchor="middle" font-size="36" font-weight="900" class="f-teal">AgCl(s) stays together</text>
          </svg>
        <div style="position:absolute;left:510px;top:205px;width:280px;text-align:center" data-at="1@0.5" data-fx="fade"><div style="position:relative;display:inline-block;font-size:46px;font-weight:900;color:var(--muted)">Ag<sup>+</sup> + Cl<sup>−</sup><i class="n-x"></i></div><div class="bad" style="font-size:30px;font-weight:900;margin-top:14px">not split</div></div></div>
      <div class="card" style="left:990px;top:290px;width:810px;height:450px" data-at="2"><h3><small>2</small>Weak acids stay whole</h3>
        <svg style="position:absolute;left:0;top:110px" width="810" height="330" viewBox="0 0 810 330">
          <rect x="40" y="40" width="480" height="270" rx="30" fill="rgba(60,199,188,.07)" stroke="#c9cee0" stroke-opacity=".4" stroke-width="3"/>
          ${HF.map((_, i) => `<g class="hf${i}"><line x1="-30" y1="0" x2="20" y2="0" stroke="#eef0f7" stroke-width="8"/>${ball(-30, 0, 22, 'gray', 'H', 24)}${ball(20, 0, 38, 'teal', 'F', 32)}</g>`).join('')}
          <text x="560" y="150" font-size="38" font-weight="900" class="f-teal" data-at="3" data-fx="fade">mostly</text>
          <text x="560" y="196" font-size="38" font-weight="900" class="f-teal" data-at="3" data-fx="fade">molecules</text>
          <text x="560" y="250" font-size="30" font-weight="800" class="f-muted" data-at="3@0.4" data-fx="fade">HF, HC₂H₃O₂</text>
        </svg></div>
      <div class="n-row" style="top:780px;height:170px" data-at="4"><div class="n-lab">Solid CaCO<sub>3</sub> in HCl: keep the solid, split the acid, cancel Cl<sup>−</sup></div>
        <div class="n-eq" style="top:66px" data-at="5">${tok('CaCO3', 's', { hl: '5@0.2' })}${P()}${tok('H^+', 'aq', { co: '2' })}${R()}${tok('Ca^2+', 'aq')}${P()}${tok('H2O', 'l')}${P()}${tok('CO2', 'g')}</div></div>`,
    update(c) {
      HF.forEach(([x, y], i) => c.$('.hf' + i).setAttribute('transform', `translate(${x + 7 * Math.sin(c.t * 1.3 + i * 1.7)} ${y + 6 * Math.sin(c.t * 1.1 + i)}) rotate(${12 * Math.sin(c.t * 0.9 + i * 2)})`))
    },
  })

  // ---------- try it ----------
  const OPTS = [
    `${fm('HNO3')}<span class="n-st">(aq)</span> + KOH<span class="n-st">(aq)</span> → KNO<sub>3</sub><span class="n-st">(aq)</span> + H<sub>2</sub>O<span class="n-st">(l)</span>`,
    `H<sup>+</sup><span class="n-st">(aq)</span> + OH<sup>−</sup><span class="n-st">(aq)</span> → H<sub>2</sub>O<span class="n-st">(l)</span>`,
    `K<sup>+</sup><span class="n-st">(aq)</span> + NO<sub>3</sub><sup>−</sup><span class="n-st">(aq)</span> → KNO<sub>3</sub><span class="n-st">(aq)</span>`,
    'No reaction',
  ]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">Net ionic equation for <span class="teal">HNO<sub>3</sub>(aq) + KOH(aq)</span>?</h2>
      ${OPTS.map((o, i) => `<div class="n-opt t${i}" style="left:${120 + (i % 2) * 860}px;top:${330 + Math.floor(i / 2) * 160}px" data-at="1@${0.45 + i * 0.12}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>
        ${i === 1 ? `<span class="ok">${CHECK}</span>` : ''}<span>${o}</span></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="800" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="800" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 800)"/>
        <text class="num" x="960" y="826" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="930" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:690px;font-size:46px" data-at="4" data-fx="pop">Both strong electrolytes ${ARR} <span class="warm">K<sup>+</sup></span> and <span class="warm">NO<sub>3</sub><sup>−</sup></span> are spectators</div>
      <div class="banner" style="top:830px;font-size:46px;background:rgba(76,199,129,.14);border-color:var(--good)" data-at="5" data-fx="pop">Any strong acid + strong base: <span class="good">H<sup>+</sup> + OH<sup>−</sup> → H<sub>2</sub>O</span></div>`,
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
  const pr = (x, y, a, b) => `<g transform="translate(${x} ${y})">${ball(-19, 0, 19, a)}${ball(19, 0, 19, b)}</g>`
  const m1 = `<svg width="460" height="210" viewBox="0 0 460 210">
    ${pr(150, 34, 'gray', 'pur')}${pr(300, 34, 'warm', 'teal')}
    <line x1="230" y1="58" x2="230" y2="80" stroke="#a3abbd" stroke-width="5" marker-end="url(#mk-muted)"/>
    ${ball(100, 105, 19, 'gray')}${ball(180, 105, 19, 'pur')}${ball(280, 105, 19, 'warm')}${ball(360, 105, 19, 'teal')}
    <line x1="160" y1="105" x2="200" y2="105" stroke="#f0707a" stroke-width="5"/><line x1="260" y1="105" x2="300" y2="105" stroke="#f0707a" stroke-width="5"/>
    <line x1="230" y1="130" x2="230" y2="152" stroke="#a3abbd" stroke-width="5" marker-end="url(#mk-muted)"/>
    ${ball(200, 180, 19, 'gray')}${ball(260, 180, 19, 'teal')}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card n-rc" style="left:120px" data-at="1"><div class="n">1</div>${m1}<p>Molecular ${ARR}<br>complete ionic ${ARR}<br>net ionic:<br><span class="warm">cancel the spectators</span></p></div>
      <div class="card n-rc" style="left:690px" data-at="2"><div class="n">2</div><div class="n-mini"><span class="teal">KBr(aq) ${ARR} K<sup>+</sup> + Br<sup>−</sup></span><br><span class="warm">AgCl(s), HF, NH<sub>3</sub></span></div><p>Split only soluble<br><span class="teal">strong electrolytes</span>.<br>Keep <span class="warm">(s), (l), (g)</span>, weak<br>acids and bases together.</p></div>
      <div class="card n-rc" style="left:1260px" data-at="3"><div class="n">3</div><div class="n-mini">Ba<sup>2+</sup> + SO<sub>4</sub><sup>2−</sup> → BaSO<sub>4</sub><br><span class="pri">(2+) + (2−) = 0</span> <span class="good">✓</span></div><p><span class="pri">Atoms</span> AND<br><span class="pri">charges</span><br>must balance.</p></div>`,
  })
})()
