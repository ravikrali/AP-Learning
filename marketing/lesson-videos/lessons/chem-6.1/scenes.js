// Pictures for chem-6.1 "Endothermic vs. Exothermic". One EZ.scene per scene id in script.mjs.
// Every fact shown is the lesson's own (app/src/content/chem/u6.ts and chem/book.ts). The lesson gives
// no numbers, so thermometers, energy levels and attractions are drawn without values.
// Colours: warm = exothermic (energy out), teal = endothermic (energy in), as in the lesson's
// 'energy-levels' diagram (app/src/content/diagrams.tsx), which is the shape of the diagram scene.
(() => {
  const { clamp, lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-ax{stroke:#c9cee0;stroke-width:4;stroke-linecap:round}
    .x-axl{font-size:30px;font-weight:800;fill:var(--muted)!important;text-anchor:middle}
    .x-lvl{stroke:#eef0f7;stroke-width:8;stroke-linecap:round}
    .x-lab{font-size:32px;font-weight:900}
    .x-note{position:absolute;left:1360px;width:490px;height:106px;padding:16px 22px 0 84px;border-radius:22px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .x-note > i{position:absolute;left:22px;top:26px;width:46px;height:46px;border-radius:50%}
    .x-note b{display:block;font-size:30px;font-weight:900;line-height:1.15;white-space:nowrap} .x-note span{display:block;font-size:25px;font-weight:700;color:var(--muted);white-space:nowrap}
    .x-big{position:absolute;left:1300px;width:540px;padding:22px 28px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid var(--line)}
    .x-big b{display:block;font-size:38px;font-weight:900;line-height:1.15;white-space:nowrap} .x-big span{display:block;margin-top:8px;font-size:29px;font-weight:700;color:var(--muted);line-height:1.3;white-space:nowrap} .x-big em{font-style:normal;font-weight:900}
    .x-col{position:absolute;left:470px;width:320px}
    .x-col small{display:block;font-size:26px;font-weight:800;color:var(--muted);letter-spacing:.06em;text-transform:uppercase}
    .x-col b{display:block;font-size:38px;font-weight:900;line-height:1.15;margin-bottom:22px;white-space:nowrap}
    .x-dh{position:absolute;left:40px;right:40px;top:440px;height:90px;border-radius:22px;text-align:center;font-size:58px;font-weight:900;line-height:86px;border:2px solid}
    .x-foot{position:absolute;left:0;width:1920px;text-align:center;font-size:40px;font-weight:800;color:var(--muted)}
    .x-chip{position:absolute;top:880px;height:84px;padding:0 28px;border-radius:22px;background:rgba(36,40,56,.92);border:2px solid var(--line);font-size:32px;font-weight:800;line-height:80px;white-space:nowrap}
    .x-pillbox{position:absolute;top:750px;width:810px;height:190px;border-radius:28px;border:3px solid;text-align:center;padding-top:22px}
    .x-pillbox > b{display:block;font-size:42px;font-weight:900;white-space:nowrap} .x-pillbox > span{display:block;margin-top:10px;font-size:34px;font-weight:800;white-space:nowrap}
    .x-opt{position:absolute;width:820px;height:130px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;padding:0 96px 0 106px;font-size:36px;white-space:nowrap;font-weight:800;line-height:1.2}
    .x-opt .l{position:absolute;left:26px;top:33px;width:60px;height:60px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:32px;font-weight:900;line-height:56px;text-align:center;color:var(--muted)}
    .x-opt .ok{position:absolute;right:20px;top:31px;width:64px;height:64px}
    .x-rc{top:320px;width:540px;height:560px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const PUR = '#8d8df0', TEAL = '#3cc7bc', WARM = '#f3a764'
  const CHECK = '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'

  /** a thermometer: tube from top to bot at x, bulb below; the liquid column carries class cls */
  const thermo = (x, top, bot, cls, color, w = 34) => `
    <rect x="${x - w / 2}" y="${top}" width="${w}" height="${bot - top + 20}" rx="${w / 2}" fill="#1a1d2a" stroke="#c9cee0" stroke-width="4"/>
    ${[0.2, 0.4, 0.6, 0.8].map((f) => `<line x1="${x + w / 2 + 4}" x2="${x + w / 2 + 20}" y1="${bot - f * (bot - top)}" y2="${bot - f * (bot - top)}" stroke="#7d859c" stroke-width="3"/>`).join('')}
    <rect class="${cls}" x="${x - w / 4}" y="${(top + bot) / 2}" width="${w / 2}" height="${bot - (top + bot) / 2 + 24}" rx="${w / 4}" style="fill:${color}"/>
    <circle cx="${x}" cy="${bot + 34}" r="${w * 1.05}" fill="#1a1d2a" stroke="#c9cee0" stroke-width="4"/><circle class="${cls}-b" cx="${x}" cy="${bot + 34}" r="${w * 0.8}" style="fill:${color}"/>`
  /** set a thermometer's liquid to frac (0..1) of its tube */
  function level(c, cls, top, bot, frac, color) {
    const y = bot - frac * (bot - top), el = c.$('.' + cls)
    el.setAttribute('y', y); el.setAttribute('height', bot + 24 - y)
    if (color) { el.style.fill = color; c.$('.' + cls + '-b').style.fill = color }
  }
  /** a beaker outline with water; the water rect carries class cls */
  const beaker = (x0, x1, top, bot, water, cls) => `
    <rect class="${cls}" x="${x0 + 4}" y="${water}" width="${x1 - x0 - 8}" height="${bot - water - 4}" rx="18" fill="rgba(60,199,188,.16)"/>
    <path d="M${x0 - 18} ${top} L${x0} ${top + 14} L${x0} ${bot - 24} Q${x0} ${bot} ${x0 + 24} ${bot} L${x1 - 24} ${bot} Q${x1} ${bot} ${x1} ${bot - 24} L${x1} ${top}" fill="none" stroke="#c9cee0" stroke-width="6" stroke-linejoin="round"/>
    <line x1="${x0 + 4}" x2="${x1 - 4}" y1="${water}" y2="${water}" stroke="#3cc7bc" stroke-width="3" opacity=".6"/>`
  /** the system: a dashed circle of particles */
  const system = (cx, cy, r, n = 6) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(141,141,240,.16)" stroke="${PUR}" stroke-width="4" stroke-dasharray="14 10"/>
    ${Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 + 0.4, d = i % 2 ? r * 0.5 : r * 0.22
      return ball(cx + d * Math.cos(a), cy + d * Math.sin(a), r * 0.17, i % 3 ? 'pur' : 'gold') }).join('')}`
  /** arrows across the system boundary: out (warm) or in (teal) */
  const flow = (cx, cy, r, out, n = 6, len = 56, sw = 8) => Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + Math.PI / n, r1 = out ? r + 14 : r + 14 + len, r2 = out ? r + 14 + len : r + 14
    return `<line x1="${cx + r1 * Math.cos(a)}" y1="${cy + r1 * Math.sin(a)}" x2="${cx + r2 * Math.cos(a)}" y2="${cy + r2 * Math.sin(a)}" stroke="${out ? WARM : TEAL}" stroke-width="${sw}" stroke-linecap="round" marker-end="url(#mk-${out ? 'warm' : 'teal'})"/>` }).join('')
  const note = (i, at, color, a, b, top = 378) => `<div class="x-note" style="top:${top + i * 124}px" data-at="${at}" data-fx="right"><i style="background:${color}"></i><b>${a}</b><span>${b}</span></div>`

  // ---------- intro artwork: two faint thermometers at the far edges, one rising, one falling ----------
  EZ.intro = {
    chips: [['1@0.35', 'Which way heat flows'], ['1@0.6', 'Follow the thermometer'], ['1@0.85', 'The sign of ΔH']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.22">
      ${thermo(70, 330, 760, 'it1', WARM, 36)}${thermo(1850, 330, 760, 'it2', TEAL, 36)}</svg>`,
    update(c) {
      const p = eio(c.seg(c.sc.start + 0.4, c.sc.start + 4))
      level(c, 'it1', 330, 760, lerp(0.35, 0.85, p))
      level(c, 'it2', 330, 760, lerp(0.65, 0.15, p))
    },
  }

  // ---------- hook: hand warmer vs cold pack ----------
  const pack = (cls, fill, stroke) => `<rect x="-150" y="-95" width="300" height="190" rx="34" fill="${fill}" stroke="${stroke}" stroke-width="5"/>
    <path d="M-150 -55 L150 -55 M-150 55 L150 55" stroke="${stroke}" stroke-width="3" stroke-dasharray="8 10" opacity=".7"/><circle class="${cls}" r="150" fill="none"/>`
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Hot or cold?</div><h2 class="h1" data-at="0">Two everyday packs</h2>
      <div class="card" style="left:120px;top:320px;width:810px;height:560px" data-at="0">
        <h3 class="warm">Hand warmer</h3>
        <svg style="position:absolute;left:0;top:96px" width="810" height="320" viewBox="0 0 810 320">
          <g class="hw-glow" style="opacity:0"><circle cx="405" cy="160" r="150" fill="rgba(243,167,100,.22)"/></g>
          <g transform="translate(405 160)">${pack('', 'rgba(243,167,100,.22)', WARM)}</g>
          <g data-at="0@0.5" data-fx="fade">${[-1, 1].map((s) => `<line x1="${405 + s * 175}" y1="160" x2="${405 + s * 245}" y2="160" stroke="${WARM}" stroke-width="9" stroke-linecap="round" marker-end="url(#mk-warm)"/>`).join('')}
            <line x1="405" y1="52" x2="405" y2="6" stroke="${WARM}" stroke-width="9" stroke-linecap="round" marker-end="url(#mk-warm)"/></g>
          <text x="405" y="172" text-anchor="middle" font-size="44" font-weight="900" class="f-warm" data-at="0@0.6" data-fx="fade">gets hot</text>
        </svg>
        <div class="x-foot" style="top:430px;width:810px;color:var(--text)" data-at="2" data-fx="up">releases energy</div>
        <div class="x-foot" style="top:486px;width:810px;font-weight:900;color:var(--warm)" data-at="3" data-fx="pop">exothermic</div></div>
      <div class="card" style="left:990px;top:320px;width:810px;height:560px" data-at="1">
        <h3 class="teal">Instant cold pack</h3>
        <svg style="position:absolute;left:0;top:96px" width="810" height="320" viewBox="0 0 810 320">
          <g transform="translate(405 160)">${pack('', 'rgba(60,199,188,.2)', TEAL)}</g>
          <g data-at="1@0.5" data-fx="fade">${[-1, 1].map((s) => `<line x1="${405 + s * 245}" y1="160" x2="${405 + s * 175}" y2="160" stroke="${TEAL}" stroke-width="9" stroke-linecap="round" marker-end="url(#mk-teal)"/>`).join('')}
            <line x1="405" y1="6" x2="405" y2="52" stroke="${TEAL}" stroke-width="9" stroke-linecap="round" marker-end="url(#mk-teal)"/></g>
          <text x="405" y="172" text-anchor="middle" font-size="44" font-weight="900" class="f-teal" data-at="1@0.6" data-fx="fade">gets icy</text>
        </svg>
        <div class="x-foot" style="top:430px;width:810px;color:var(--text)" data-at="2@0.5" data-fx="up">absorbs energy</div>
        <div class="x-foot" style="top:486px;width:810px;font-weight:900;color:var(--accent)" data-at="3@0.5" data-fx="pop">endothermic</div></div>
      <div class="x-foot" style="top:930px" data-at="4">Where should you look? ${ARR}</div>`,
    update(c) {
      c.$('.hw-glow').style.opacity = c.seg(c.b[0].start + 0.4, c.b[0].end) * (0.8 + 0.2 * Math.sin(c.t * 3))
    },
  })

  // ---------- system vs surroundings ----------
  const SX = 620, SY = 700
  EZ.scene('system', {
    html: `<div class="kicker" data-at="in" data-fx="left">Where to look</div><h2 class="h1" data-at="0">System vs. surroundings</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="in" data-fx="fade">${beaker(300, 940, 360, 940, 470, 'sys-w')}</g>
        <g data-at="1" data-fx="pop">${system(SX, SY, 140)}</g>
        <text x="${SX}" y="${SY - 168}" text-anchor="middle" font-size="38" font-weight="900" class="f-pri" data-at="1@0.3" data-fx="fade">system</text>
        <g data-at="2" data-fx="fade"><text x="980" y="520" font-size="38" font-weight="900" class="f-teal">surroundings</text>
          <line x1="975" y1="540" x2="870" y2="600" stroke="${TEAL}" stroke-width="5" marker-end="url(#mk-teal)"/></g>
        <g class="sys-out" style="opacity:0">${flow(SX, SY, 140, true, 4, 50)}</g>
        <g class="sys-in" style="opacity:0">${flow(SX, SY, 140, false, 4, 50)}</g>
      </svg>
      ${note(0, '1', PUR, 'System', 'the chemicals you study')}
      ${note(1, '2', TEAL, 'Surroundings', 'water, beaker, your hand')}
      ${note(2, '4', WARM, 'System loses energy', `${ARR}surroundings gain it`, 410)}
      ${note(3, '4@0.55', TEAL, 'System gains energy', `${ARR}surroundings lose it`, 410)}`,
    update(c) {
      const b = c.b
      // energy moves both ways (sentence 3), then out, then in (sentence 4)
      const t3 = c.seg(b[3].start, b[3].start + 0.4), mid = b[4].start + 0.55 * (b[4].end - b[4].start)
      const pulse = 0.65 + 0.35 * Math.sin(c.t * 4)
      const out = c.t < b[4].start ? t3 * pulse : c.t < mid ? 1 : 1 - c.seg(mid, mid + 0.3)
      const inn = c.t < b[4].start ? t3 * (1 - pulse + 0.3) : c.seg(mid, mid + 0.3)
      c.$('.sys-out').style.opacity = clamp(out)
      c.$('.sys-in').style.opacity = clamp(inn)
    },
  })

  // ---------- exothermic vs endothermic: the sign of ΔH ----------
  const side = (exo) => {
    const k = exo ? 'ex' : 'en', col = exo ? WARM : TEAL, s = exo ? 0 : 3
    return `<div class="card" style="left:${exo ? 120 : 990}px;top:300px;width:810px;height:560px" data-at="${s}">
      <h3 class="${exo ? 'warm' : 'teal'}">${exo ? 'Exothermic' : 'Endothermic'}</h3>
      <svg style="position:absolute;left:0;top:90px" width="460" height="340" viewBox="0 0 460 340">
        ${beaker(40, 330, 20, 320, 70, k + '-w')}
        <g>${system(185, 195, 55, 5)}</g>
        <g class="${k}-fl" style="opacity:0">${flow(185, 195, 55, exo, 6, 30)}</g>
        ${thermo(395, 30, 250, k + '-t', col, 28)}
      </svg>
      <div class="x-col" style="top:120px"><small data-at="${s}@0.2" data-fx="fade">System</small><b data-at="${s}@0.3" data-fx="fade">${exo ? 'loses energy' : 'gains energy'}</b>
        <small data-at="${s + 1}" data-fx="fade">Surroundings</small><b class="${exo ? 'warm' : 'teal'}" data-at="${s + 1}@0.2" data-fx="fade">${exo ? 'warm up' : 'cool down'}</b></div>
      <div class="x-dh" style="border-color:${col};background:${exo ? 'rgba(243,167,100,.12)' : 'rgba(60,199,188,.12)'}" data-at="${s + 2}" data-fx="pop">ΔH <span class="${exo ? 'warm' : 'teal'}">${exo ? '&lt; 0' : '&gt; 0'}</span></div></div>`
  }
  EZ.scene('signs', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">The sign of ΔH</div><h2 class="h1" data-at="0">Exothermic vs. endothermic</h2>
      ${side(true)}${side(false)}
      <div class="banner" style="top:890px;font-size:46px" data-at="6" data-fx="pop">The sign of ΔH describes the <span class="pri">system</span>, never the surroundings</div>`,
    update(c) {
      const b = c.b
      const pe = eio(c.seg(b[1].start, b[1].end)), pn = eio(c.seg(b[4].start, b[4].end))
      level(c, 'ex-t', 30, 250, lerp(0.4, 0.85, pe))
      level(c, 'en-t', 30, 250, lerp(0.6, 0.15, pn))
      c.$('.ex-w').style.fill = `rgba(${Math.round(lerp(60, 243, pe))},${Math.round(lerp(199, 167, pe))},${Math.round(lerp(188, 100, pe))},${lerp(0.16, 0.24, pe)})`
      c.$('.en-w').style.fill = `rgba(60,199,188,${lerp(0.16, 0.34, pn)})`
      c.$('.ex-fl').style.opacity = c.seg(b[0].start + 0.3, b[0].start + 0.8)
      c.$('.en-fl').style.opacity = c.seg(b[3].start + 0.5, b[3].start + 1)
    },
  })

  // ---------- energy diagrams ----------
  // panel: axis at ox; reactants and products levels
  const panel = (ox, exo) => {
    const rY = exo ? 450 : 790, pY = exo ? 790 : 450, col = exo ? WARM : TEAL, s = exo ? 2 : 4, mk = exo ? 'warm' : 'teal'
    return `<g data-at="${exo ? '1' : '1@0.3'}" data-fx="fade">
        <text x="${ox + 360}" y="352" text-anchor="middle" font-size="44" font-weight="900" class="${exo ? 'f-warm' : 'f-teal'}">${exo ? 'Exothermic' : 'Endothermic'}</text>
        <line x1="${ox}" y1="400" x2="${ox}" y2="900" class="x-ax" marker-start="url(#mk-text)"/><line x1="${ox}" y1="900" x2="${ox + 720}" y2="900" class="x-ax"/>
        <text transform="translate(${ox - 36} 650) rotate(-90)" class="x-axl">energy of the system</text></g>
      <g data-at="${s}" data-fx="fade"><line x1="${ox + 50}" y1="${rY}" x2="${ox + 270}" y2="${rY}" class="x-lvl"/><text x="${ox + 160}" y="${rY + 48}" text-anchor="middle" class="x-lab">reactants</text></g>
      <g data-at="${s}@0.6" data-fx="fade"><line x1="${ox + 450}" y1="${pY}" x2="${ox + 670}" y2="${pY}" class="x-lvl"/><text x="${ox + 560}" y="${pY + 48}" text-anchor="middle" class="x-lab">products</text></g>
      <g data-at="${s + 1}" data-fx="fade"><line x1="${ox + 270}" y1="${rY}" x2="${ox + 400}" y2="${rY}" stroke="#7d859c" stroke-width="3" stroke-dasharray="10 10"/>
        <line x1="${ox + 360}" y1="${rY + (exo ? 10 : -10)}" x2="${ox + 360}" y2="${pY + (exo ? -14 : 14)}" stroke="${col}" stroke-width="9" marker-end="url(#mk-${mk})"/>
        <text x="${ox + 384}" y="${exo ? 610 : 640}" class="x-lab ${exo ? 'f-warm' : 'f-teal'}" style="font-size:42px">ΔH ${exo ? '&lt;' : '&gt;'} 0</text>
        <text x="${ox + 384}" y="${exo ? 652 : 682}" font-size="30" font-weight="800" class="f-muted">${exo ? 'released to surroundings' : 'absorbed from surroundings'}</text></g>
      <g class="${exo ? 'dx' : 'dn'}" style="opacity:0"><circle r="22" fill="${col}"/><circle r="36" fill="${col}" opacity=".25"/></g>`
  }
  EZ.scene('diagram', {
    html: `<div class="kicker" data-at="in" data-fx="left">Energy diagrams</div><h2 class="h1" data-at="0">Before and after</h2>
      <svg class="full" viewBox="0 0 1920 1080">${panel(170, true)}${panel(1030, false)}</svg>`,
    update(c) {
      const b = c.b
      const move = (sel, ox, rY, pY, s0, s1) => {
        const p = eio(c.seg(b[s0].start + 0.3, b[s1].start + 0.6)), el = c.$(sel)
        const x = p < 0.5 ? lerp(ox + 160, ox + 360, p * 2) : lerp(ox + 360, ox + 560, p * 2 - 1)
        const y = lerp(rY, pY, eio(clamp(p * 1.6 - 0.3)))
        el.setAttribute('transform', `translate(${x} ${y - 34})`)
        el.style.opacity = c.seg(b[s0].start + 0.1, b[s0].start + 0.4)
      }
      move('.dx', 170, 450, 790, 2, 3)
      move('.dn', 1030, 790, 450, 4, 5)
    },
  })

  // ---------- the thermometer trick ----------
  const HX = 690, HTOP = 300, HBOT = 760
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Follow the thermometer</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.3" data-fx="fade">${beaker(220, 980, 400, 960, 500, 'hk-w')}</g>
        <g data-at="0@0.3" data-fx="fade">${system(440, 760, 110, 6)}</g>
        <text x="440" y="618" text-anchor="middle" font-size="32" font-weight="900" class="f-pri" data-at="1@0.6" data-fx="fade">system</text>
        <g class="hk-out" style="opacity:0">${flow(440, 760, 110, true, 4, 40)}</g>
        <g class="hk-in" style="opacity:0">${flow(440, 760, 110, false, 4, 40)}</g>
        <g data-at="0@0.3" data-fx="fade">${thermo(HX, HTOP, HBOT, 'hk-t', '#eef0f7', 40)}</g>
        <g data-at="1" data-fx="fade"><text x="748" y="560" font-size="34" font-weight="900" class="f-teal">in the water</text><text x="748" y="602" font-size="30" font-weight="800" class="f-muted">(surroundings)</text></g>
        <g class="hk-up" style="opacity:0"><line x1="${HX - 90}" y1="460" x2="${HX - 90}" y2="340" stroke="${WARM}" stroke-width="12" stroke-linecap="round" marker-end="url(#mk-warm)"/></g>
        <g class="hk-dn" style="opacity:0"><line x1="${HX - 90}" y1="340" x2="${HX - 90}" y2="460" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" marker-end="url(#mk-teal)"/></g>
      </svg>
      <div class="x-big" style="top:330px;border-color:rgba(243,167,100,.7)" data-at="2" data-fx="right"><b class="warm">Goes up</b><span>heat flowed <em style="color:var(--text)">out</em> of the system<br>${ARR}<em class="warm">exothermic</em></span></div>
      <div class="x-big" style="top:560px;border-color:rgba(60,199,188,.7)" data-at="3" data-fx="right"><b class="teal">Goes down</b><span>heat flowed <em style="color:var(--text)">into</em> the system<br>${ARR}<em class="teal">endothermic</em></span></div>
      <div class="x-big" style="top:790px;border-color:rgba(242,196,67,.7);text-align:center" data-at="4" data-fx="pop"><b><span style="display:inline;margin:0;font-size:38px;font-weight:900;color:var(--gold)">EX</span>it = <span style="display:inline;margin:0;font-size:38px;font-weight:900;color:var(--gold)">EX</span>othermic</b><span>heat exits the system</span></div>`,
    update(c) {
      const b = c.b
      const up = eio(c.seg(b[2].start + 0.3, b[2].start + 2.3)), dn = eio(c.seg(b[3].start + 0.3, b[3].start + 2.6))
      const f = 0.45 + 0.35 * up - 0.6 * dn
      const col = c.t < b[3].start ? (up > 0 ? WARM : '#eef0f7') : TEAL
      level(c, 'hk-t', HTOP, HBOT, f, col)
      const inUp = c.t >= b[2].start && c.t < b[3].start
      c.$('.hk-up').style.opacity = inUp ? c.seg(b[2].start + 0.2, b[2].start + 0.5) : 0
      c.$('.hk-out').style.opacity = inUp ? c.seg(b[2].start + 0.2, b[2].start + 0.5) : 0
      const inDn = c.t >= b[3].start
      c.$('.hk-dn').style.opacity = inDn ? c.seg(b[3].start + 0.2, b[3].start + 0.5) : 0
      c.$('.hk-in').style.opacity = inDn ? c.seg(b[3].start + 0.2, b[3].start + 0.5) : 0
      c.$('.hk-w').style.fill = c.t < b[2].start ? 'rgba(60,199,188,.16)' : c.t < b[3].start ? `rgba(243,167,100,${0.1 + 0.12 * up})` : `rgba(60,199,188,${0.16 + 0.16 * dn})`
    },
  })

  // ---------- phase changes ----------
  const CXS = [300, 960, 1620], CY = 590, CR = 120
  const solid = () => [0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => ball(CXS[0] - 50 + i * 50, CY - 50 + j * 50, 23, 'pur'))).join('')
  const liquid = () => [[-55, -30], [0, -50], [52, -22], [-40, 30], [12, 18], [60, 40], [-8, 70], [-70, 75]].map(([x, y]) => ball(CXS[1] + x, CY + y, 23, 'pur')).join('')
  const gas = () => [[-70, -60], [55, -70], [5, 5], [-60, 65], [70, 55]].map(([x, y]) => ball(CXS[2] + x, CY + y, 23, 'pur')).join('')
  const arcUp = (x0, x1) => `M${x0} ${CY - 50} Q${(x0 + x1) / 2} ${CY - 170} ${x1} ${CY - 50}`
  const arcDn = (x0, x1) => `M${x0} ${CY + 50} Q${(x0 + x1) / 2} ${CY + 170} ${x1} ${CY + 50}`
  EZ.scene('phase', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Physical changes</div><h2 class="h1" data-at="0">Phase changes have a ΔH too</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.4" data-fx="fade">${CXS.map((x) => `<circle cx="${x}" cy="${CY}" r="${CR}" fill="rgba(36,40,56,.9)" stroke="#363c54" stroke-width="3"/>`).join('')}
          ${solid()}${liquid()}${gas()}
          ${['solid', 'liquid', 'gas'].map((n, i) => `<text x="${CXS[i]}" y="${CY + CR + 50}" text-anchor="middle" font-size="36" font-weight="900" class="f-muted">${n}</text>`).join('')}</g>
        <g data-at="1" data-fx="fade">
          <path d="${arcUp(CXS[0] + 110, CXS[1] - 110)}" fill="none" stroke="${TEAL}" stroke-width="9" marker-end="url(#mk-teal)"/>
          <path d="${arcUp(CXS[1] + 110, CXS[2] - 110)}" fill="none" stroke="${TEAL}" stroke-width="9" marker-end="url(#mk-teal)"/>
          <text x="${(CXS[0] + CXS[1]) / 2}" y="${CY - 130}" text-anchor="middle" font-size="38" font-weight="900">melting</text>
          <text x="${(CXS[1] + CXS[2]) / 2}" y="${CY - 130}" text-anchor="middle" font-size="38" font-weight="900">boiling</text>
          <text x="${(CXS[0] + CXS[1]) / 2}" y="${CY - 10}" text-anchor="middle" font-size="30" font-weight="900" class="f-teal">energy in</text>
          <text x="${(CXS[1] + CXS[2]) / 2}" y="${CY - 10}" text-anchor="middle" font-size="30" font-weight="900" class="f-teal">energy in</text></g>
        <g data-at="3" data-fx="fade">
          <path d="${arcDn(CXS[1] - 110, CXS[0] + 110)}" fill="none" stroke="${WARM}" stroke-width="9" marker-end="url(#mk-warm)"/>
          <path d="${arcDn(CXS[2] - 110, CXS[1] + 110)}" fill="none" stroke="${WARM}" stroke-width="9" marker-end="url(#mk-warm)"/>
          <text x="${(CXS[0] + CXS[1]) / 2}" y="${CY + 160}" text-anchor="middle" font-size="38" font-weight="900">freezing</text>
          <text x="${(CXS[1] + CXS[2]) / 2}" y="${CY + 160}" text-anchor="middle" font-size="38" font-weight="900">condensing</text>
          <text x="${(CXS[0] + CXS[1]) / 2}" y="${CY + 36}" text-anchor="middle" font-size="30" font-weight="900" class="f-warm">energy out</text>
          <text x="${(CXS[1] + CXS[2]) / 2}" y="${CY + 36}" text-anchor="middle" font-size="30" font-weight="900" class="f-warm">energy out</text></g>
        <text x="${(CXS[0] + CXS[1]) / 2}" y="${CY + 202}" text-anchor="middle" font-size="30" font-weight="900" class="f-warm" data-at="3@0.4" data-fx="fade">exothermic</text>
        <text x="${(CXS[1] + CXS[2]) / 2}" y="${CY + 202}" text-anchor="middle" font-size="30" font-weight="900" class="f-warm" data-at="3@0.6" data-fx="fade">exothermic</text>
        <text x="${(CXS[0] + CXS[1]) / 2}" y="${CY - 182}" text-anchor="middle" font-size="30" font-weight="900" class="f-teal" data-at="1@0.4" data-fx="fade">endothermic</text>
        <text x="${(CXS[1] + CXS[2]) / 2}" y="${CY - 182}" text-anchor="middle" font-size="30" font-weight="900" class="f-teal" data-at="1@0.6" data-fx="fade">endothermic</text>
      </svg>
      <div class="x-foot" style="top:880px" data-at="2" data-out="4" data-fx="fade">Energy in <span class="teal">overcomes the attractions</span> between molecules</div>
      <div class="x-chip" style="left:120px;border-color:rgba(60,199,188,.7)" data-at="4@0.05" data-fx="pop">Ice melting: <span class="teal">endothermic</span></div>
      <div class="x-chip" style="left:640px;border-color:rgba(243,167,100,.7)" data-at="4@0.4" data-fx="pop">Steam condensing: <span class="warm">exothermic</span></div>
      <div class="x-chip" style="left:1250px;border-color:rgba(243,167,100,.7)" data-at="4@0.7" data-fx="pop">Wood burning: <span class="warm">exothermic</span></div>`,
  })

  // ---------- dissolving ----------
  // a 4×2 block of alternating ions that pulls apart
  const IONS = [0, 1, 2, 3].flatMap((i) => [0, 1].map((j) => [i, j, (i + j) % 2]))
  const ion = (pos) => (pos ? ball(0, 0, 22, 'gold', '+', 30) : ball(0, 0, 30, 'gray', '−', 34))
  const water = () => `${ball(0, 0, 20, 'red')}${ball(-18, 22, 11, 'gray')}${ball(18, 22, 11, 'gray')}`
  EZ.scene('dissolve', {
    html: `<div class="kicker" data-at="in" data-fx="left">Dissolving</div><h2 class="h1" data-at="0">It can go either way</h2>
      <div style="position:absolute;left:880px;top:206px;font-size:40px;font-weight:800;color:var(--muted)" data-at="1" data-fx="fade">${ARR}it depends on the <span style="color:var(--text)">balance of interactions</span></div>
      <div class="card" style="left:120px;top:300px;width:810px;height:420px" data-at="2">
        <h3 class="teal">Energy absorbed</h3>
        <svg style="position:absolute;left:0;top:80px" width="810" height="260" viewBox="0 0 810 260">
          ${IONS.map(([i, j, p], k) => `<g class="dv-i${k}">${ion(p)}</g>`).join('')}
          <line x1="640" y1="130" x2="640" y2="60" stroke="${TEAL}" stroke-width="9" stroke-linecap="round" marker-end="url(#mk-teal)" data-at="2@0.3" data-fx="fade"/>
        </svg>
        <div style="position:absolute;left:670px;top:120px;font-size:32px;font-weight:900;line-height:1.25" class="teal" data-at="2@0.3" data-fx="fade">energy<br>in</div>
        <div style="position:absolute;left:40px;top:330px;font-size:29px;font-weight:800;line-height:1.3;color:var(--muted)"><span data-at="2@0.3" data-fx="fade">break <b style="color:var(--text)">solute–solute</b> attractions,</span><br><span data-at="2@0.75" data-fx="fade">and make room in the solvent</span></div></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:420px" data-at="3">
        <h3 class="warm">Energy released</h3>
        <svg style="position:absolute;left:0;top:80px" width="810" height="260" viewBox="0 0 810 260">
          <g transform="translate(260 130)">${ball(0, 0, 30, 'gold', '+', 40)}</g>
          ${[0, 1, 2, 3, 4, 5].map((i) => { const a = (i / 6) * 360, r = 92, x = 260 + r * Math.cos((a * Math.PI) / 180), y = 130 + r * Math.sin((a * Math.PI) / 180)
            return `<g data-at="3@${0.15 + i * 0.07}" data-fx="pop"><g transform="translate(${x} ${y}) rotate(${a - 90})">${water()}</g></g>` }).join('')}
          <line x1="520" y1="60" x2="520" y2="130" stroke="${WARM}" stroke-width="9" stroke-linecap="round" marker-end="url(#mk-warm)" data-at="3@0.6" data-fx="fade"/>
        </svg>
        <div style="position:absolute;left:560px;top:120px;font-size:32px;font-weight:900;line-height:1.25" class="warm" data-at="3@0.6" data-fx="fade">energy<br>out</div>
        <div style="position:absolute;left:40px;top:330px;font-size:29px;font-weight:800;line-height:1.3;color:var(--muted)" data-at="3@0.4" data-fx="fade">new <b style="color:var(--text)">solute–solvent</b> attractions<br>form (like <b style="color:var(--text)">ion–dipole</b>)</div></div>
      <div class="x-pillbox" style="left:120px;border-color:var(--warm);background:rgba(243,167,100,.12)" data-at="4" data-fx="pop"><b>New attractions <span class="warm">stronger</span> ${ARR} <span class="warm">exo</span></b><span>CaCl<sub>2</sub> in water <span class="warm">heats up</span></span></div>
      <div class="x-pillbox" style="left:990px;border-color:var(--accent);background:rgba(60,199,188,.12)" data-at="5" data-fx="pop"><b>New attractions <span class="teal">weaker</span> ${ARR} <span class="teal">endo</span></b><span>NH<sub>4</sub>NO<sub>3</sub> in water <span class="teal">cools down</span><span data-at="6" data-fx="fade" style="display:inline;margin:0;font-size:30px;color:var(--muted)"> (cold packs)</span></span></div>`,
    update(c) {
      const b = c.b, p = eio(c.seg(b[2].start + 0.3, b[2].start + 2.2))
      IONS.forEach(([i, j], k) => {
        const x0 = 160 + i * 62, y0 = 100 + j * 62
        const x = lerp(x0, 80 + i * 130 + (j ? 40 : 0), p), y = lerp(y0, j ? 190 : 50, p)
        c.$('.dv-i' + k).setAttribute('transform', `translate(${x} ${y})`)
      })
    },
  })

  // ---------- try it ----------
  const OPTS = ['exothermic, ΔH &lt; 0', 'endothermic, ΔH &gt; 0', 'neither', 'a physical change with no energy']
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:60px" data-at="1">The temperature <span class="teal">drops</span>. The dissolving is…</h2>
      <div style="position:absolute;left:120px;top:272px;font-size:36px;font-weight:800;color:var(--muted)" data-at="1@0.2">A salt dissolves in water and the temperature of the solution <b style="color:var(--text)">drops</b>.</div>
      ${OPTS.map((o, i) => `<div class="x-opt t${i}" style="left:${120 + (i % 2) * 860}px;top:${350 + Math.floor(i / 2) * 150}px" data-at="2@${0.05 + i * 0.22}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>
        ${i === 1 ? CHECK : ''}<span>${o}</span></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="790" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="790" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 790)"/>
        <text class="num" x="960" y="816" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="920" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:690px;font-size:44px" data-at="5" data-fx="pop">The water (<span class="teal">surroundings</span>) got colder ${ARR} it gave energy to the process</div>
      <div class="x-pillbox" style="left:555px;top:850px;height:110px;padding-top:0;line-height:104px;border-color:var(--accent);background:rgba(60,199,188,.12)" data-at="6" data-fx="pop"><b style="display:inline">Thermometer down ${ARR} <span class="teal">endothermic</span></b></div>`,
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
  const mini = (exo) => `<svg width="440" height="210" viewBox="0 0 440 210">${beaker(60, 280, 20, 196, 50, '')}<g>${system(170, 125, 38, 4)}</g>${flow(170, 125, 32, exo, 4, 16, 5)}
    ${thermo(360, 26, 150, '', exo ? WARM : TEAL, 22).replace(`y="${(26 + 150) / 2}"`, `y="${exo ? 46 : 128}"`).replace(`height="${150 - (26 + 150) / 2 + 24}"`, `height="${exo ? 128 : 46}"`)}</svg>`
  const dis = `<svg width="440" height="210" viewBox="0 0 440 210">${ball(70, 80, 22, 'gold', '+', 28)}${ball(122, 80, 28, 'gray', '−', 30)}${ball(70, 140, 28, 'gray', '−', 30)}${ball(122, 140, 22, 'gold', '+', 28)}
    <line x1="160" y1="110" x2="212" y2="110" stroke="#eef0f7" stroke-width="6" marker-end="url(#mk-text)"/>
    <g transform="translate(330 110)">${ball(0, 0, 24, 'gold', '+', 30)}</g>${[0, 90, 180, 270].map((a) => `<g transform="translate(${330 + 66 * Math.cos((a * Math.PI) / 180)} ${110 + 66 * Math.sin((a * Math.PI) / 180)}) rotate(${a - 90}) scale(.8)">${water()}</g>`).join('')}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${mini(true)}<p><span class="warm">Exothermic</span>:<br>system releases heat,<br>surroundings warm,<br><span class="warm">ΔH &lt; 0</span></p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${mini(false)}<p><span class="teal">Endothermic</span>:<br>system absorbs heat,<br>surroundings cool,<br><span class="teal">ΔH &gt; 0</span></p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${dis}<p>Dissolving:<br><span class="warm">exo</span> or <span class="teal">endo</span>,<br>depending on attractions<br>broken vs. formed</p></div>`,
  })
})()
