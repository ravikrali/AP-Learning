// Pictures for chem-3.12 "Properties of Photons". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u3.ts; the per-mole value and the
// emission-line idea are from book.ts). Energy levels, wavelengths and spectral lines are drawn
// schematically: right order, not to scale, and no line stands for a particular wavelength.
(() => {
  const { clamp, lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .p-foot{position:absolute;left:0;right:0;bottom:28px;text-align:center;font-size:36px;font-weight:900;white-space:nowrap}
    .p-sub{position:absolute;left:40px;top:92px;font-size:30px;font-weight:800;color:var(--muted);white-space:nowrap}
    .p-big{position:absolute;left:0;right:0;top:120px;text-align:center;font-size:120px;font-weight:900;letter-spacing:-1px}
    .p-leg{position:absolute;left:0;right:0;text-align:center;font-size:32px;font-weight:800;color:var(--muted);white-space:nowrap}
    .p-val{position:absolute;left:0;right:0;margin:0 auto;width:fit-content;top:356px;height:76px;padding:0 30px;border-radius:20px;background:rgba(255,255,255,.05);border:2px solid var(--line);font-size:40px;font-weight:900;line-height:72px;white-space:nowrap}
    .p-note{position:absolute;left:1340px;width:470px;padding:18px 26px;border-radius:24px;background:rgba(36,40,56,.92);border:3px solid var(--line)}
    .p-note b{display:block;font-size:38px;font-weight:900;line-height:1.15} .p-note span{display:block;font-size:30px;font-weight:800;color:var(--muted);line-height:1.3}
    .p-prob{left:120px;top:290px;width:1680px;height:130px;padding:38px 48px 0;font-size:46px;font-weight:800;white-space:nowrap}
    .p-row{position:absolute;left:120px;width:1680px;height:120px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .p-row .n{position:absolute;left:28px;top:26px;width:68px;height:68px;border-radius:50%;background:var(--brand);font-size:38px;font-weight:900;line-height:68px;text-align:center}
    .p-row .lb{position:absolute;left:124px;top:34px;font-size:38px;font-weight:900;color:var(--muted);white-space:nowrap}
    .p-row .eq{position:absolute;left:400px;top:32px;font-size:44px;font-weight:900;white-space:nowrap}
    .p-res{position:absolute;right:22px;top:18px;height:80px;padding:0 30px;border-radius:20px;font-size:44px;font-weight:900;line-height:76px;white-space:nowrap;background:rgba(91,91,214,.35);border:2px solid var(--primary)}
    .p-ln{position:absolute;left:50px;font-size:52px;font-weight:900;white-space:nowrap}
    .p-chx{position:absolute;height:72px;padding:0 26px;border-radius:20px;background:rgba(255,255,255,.05);border:2px solid var(--line);font-size:34px;font-weight:800;line-height:68px;white-space:nowrap}
    .p-ans{position:absolute;left:120px;top:460px;width:1680px;height:124px;border-radius:28px;background:rgba(76,199,129,.14);border:3px solid var(--good);text-align:center;font-size:62px;font-weight:900;line-height:118px}
    .p-ans svg{position:absolute;right:30px;top:28px;width:64px;height:64px}
    .p-mole{left:120px;top:790px;width:1680px;height:140px}
    .p-mole .lab{position:absolute;left:44px;top:46px;font-size:36px;font-weight:900;white-space:nowrap}
    .p-mole .m{position:absolute;right:44px;top:42px;font-size:42px;font-weight:900;white-space:nowrap}
    .p-rc{top:320px;width:540px;height:560px;text-align:center} .p-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .p-rc svg{display:block;margin:14px auto 0} .p-rc p{margin:14px 20px 0;font-size:33px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const CHECK = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const RED = '#f0707a', GOLD = '#f2c443', TEAL = '#3cc7bc', PUR = '#8d8df0', WARM = '#f3a764'
  // a sine wave from x0 to x1 around y: amplitude A, wavelength L, phase ph (radians)
  const wave = (x0, x1, y, A, L, ph = 0) => {
    let d = ''
    for (let x = x0; x <= x1 + 0.1; x += 4) d += (d ? 'L' : 'M') + x.toFixed(1) + ' ' + (y - A * Math.sin(((x - x0) / L) * 2 * Math.PI + ph)).toFixed(1)
    return d
  }
  // a short photon squiggle pointing right (starts at 0,0), with an arrowhead
  const squig = (len, A, L, color, mk, w = 7) => `<path d="${wave(0, len, 0, A, L)} h16" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" marker-end="url(#mk-${mk})"/>`
  const lvl = (x0, x1, y, label) => `<line x1="${x0}" x2="${x1}" y1="${y}" y2="${y}" stroke="#c9cee0" stroke-width="6" stroke-linecap="round"/>${label ? `<text x="${x0}" y="${y - 16}" font-size="26" font-weight="800" class="f-muted">${label}</text>` : ''}`
  const eDot = (cls) => `<g class="${cls}"><circle r="26" fill="${TEAL}" opacity=".25"/><circle r="15" fill="url(#g-teal)"/></g>`
  const place = (el, x, y) => el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`)

  // ---------- intro artwork: a faint light wave under the chips, energy levels at the edges ----------
  const edgeLevels = (x) => [300, 470, 560, 610].map((y) => `<line x1="${x}" x2="${x + 220}" y1="${y}" y2="${y}" stroke="#c9cee0" stroke-width="6" stroke-linecap="round"/>`).join('')
  EZ.intro = {
    chips: [['1@0.3', 'Absorb & emit'], ['1@0.55', 'c = λν and E = hν'], ['1@0.8', 'One photon’s energy']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.22">
      ${edgeLevels(70)}${edgeLevels(1630)}
      <g class="ie1">${eDot('')}</g><g class="ie2">${eDot('')}</g>
      <path class="iw" d="${wave(120, 1800, 880, 30, 170)}" fill="none" stroke="${PUR}" stroke-width="8" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/></svg>`,
    update(c) {
      const s = c.sc.start
      c.$('.iw').style.strokeDashoffset = 1 - eio(c.seg(s + 0.3, s + 3.3))
      const p = eio(c.seg(s + 1.2, s + 2.4))
      place(c.$('.ie1'), 180, lerp(300, 610, p)); place(c.$('.ie2'), 1740, lerp(300, 470, p))
    },
  }

  // ---------- hook: each glow is one photon energy ----------
  const lampCard = (i, left, name, colorName, color, mk, lamp) => `
    <div class="card" style="left:${left}px;top:300px;width:810px;height:560px" data-at="0@${0.1 + i * 0.45}">
      <h3>${name}</h3><div class="p-sub" style="top:96px">glows <span style="color:${color}">${colorName}</span></div>
      <svg style="position:absolute;left:0;top:150px" width="810" height="330" viewBox="0 0 810 330">
        <g data-at="2" data-fx="fade">${lvl(60, 320, 70, 'higher level')}${lvl(60, 320, 270, 'lower level')}
          <line x1="300" y1="98" x2="300" y2="238" stroke="${color}" stroke-width="5" stroke-dasharray="10 10" marker-end="url(#mk-${mk})"/></g>
        <g class="hl${i}" style="opacity:.35">${lamp}</g>
        <g class="he${i}" style="opacity:0">${eDot('')}</g>
        <g class="hp${i}" style="opacity:0">${squig(130, 14, 34, color, mk)}</g>
      </svg>
      <div class="p-foot" style="color:${color}" data-at="1@0.3" data-fx="fade">one photon, one exact energy</div></div>`
  const tube = `<path d="M580 150 q50 -90 100 0 t100 0" fill="none" stroke="${RED}" stroke-width="40" stroke-linecap="round" opacity=".25"/><path d="M580 150 q50 -90 100 0 t100 0" fill="none" stroke="${RED}" stroke-width="16" stroke-linecap="round"/>`
  const bulb = `<line x1="660" y1="220" x2="660" y2="320" stroke="#7d859c" stroke-width="12" stroke-linecap="round"/><circle cx="660" cy="150" r="96" fill="${GOLD}" opacity=".18"/><circle cx="660" cy="150" r="62" fill="url(#g-gold)"/>`
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Why things glow</div><h2 class="h1" data-at="0">Every color is a photon</h2>
      ${lampCard(0, 120, 'Neon sign', 'red', RED, 'bad', tube)}
      ${lampCard(1, 990, 'Sodium streetlight', 'orange-yellow', GOLD, 'gold', bulb)}
      <div class="banner" style="top:890px;padding:16px 40px" data-at="3" data-fx="pop">Light is how atoms <span class="teal">“talk”</span></div>`,
    update(c) {
      const b = c.b
      for (let i = 0; i < 2; i++) {
        const t0 = b[2].start + 0.3 + i * 0.25, drop = eio(c.seg(t0, t0 + 0.9))
        c.$('.he' + i).style.opacity = c.seg(b[2].start, b[2].start + 0.3)
        place(c.$('.he' + i), 240, lerp(70, 270, drop))
        const fly = eio(c.seg(t0 + 0.7, t0 + 1.8))
        place(c.$('.hp' + i), lerp(330, 380, fly), 170)
        c.$('.hp' + i).style.opacity = c.seg(t0 + 0.6, t0 + 0.8) * (1 - 0.4 * c.seg(t0 + 1.8, t0 + 2.3))
        c.$('.hl' + i).style.opacity = 0.35 + 0.65 * Math.max(c.seg(b[0].start + 0.6 + i * 0.6, b[0].start + 1.2 + i * 0.6) * (1 - c.seg(b[1].end, b[1].end + 0.3)), c.seg(t0 + 1.4, t0 + 1.9))
      }
    },
  })

  // ---------- absorb / emit, then energy levels and line spectra ----------
  const RAIN = `<linearGradient id="p-rain" x1="0" x2="1"><stop offset="0" stop-color="#f0707a"/><stop offset=".25" stop-color="#f3a764"/><stop offset=".45" stop-color="#f2c443"/><stop offset=".62" stop-color="#4cc781"/><stop offset=".8" stop-color="#3c8ff0"/><stop offset="1" stop-color="#8d6cf0"/></linearGradient>`
  const SPEC = [[0.16, RED], [0.43, GOLD], [0.58, '#4cc781'], [0.81, '#5b8ff0']]
  EZ.scene('levels', {
    html: `<div class="kicker" data-at="in" data-fx="left">Energy in, energy out</div><h2 class="h1" data-at="0">Atoms trade energy with light</h2>
      <div data-at="in" data-out="4" data-fx="fade">
        <div class="card" style="left:120px;top:300px;width:810px;height:520px" data-at="1"><h3><span class="teal">Absorb</span> a photon</h3>
          <svg style="position:absolute;left:0;top:110px" width="810" height="300" viewBox="0 0 810 300">
            ${lvl(380, 680, 60, '')}${lvl(380, 680, 250, '')}
            <g class="ap">${squig(150, 14, 36, TEAL, 'teal')}</g><g class="ae">${eDot('')}</g>
            <text x="720" y="166" font-size="40" font-weight="900" class="f-teal" data-at="1@0.75" data-fx="fade">+E</text></svg>
          <div class="p-foot teal" data-at="1@0.6" data-fx="fade">atom’s energy goes up</div></div>
        <div class="card" style="left:990px;top:300px;width:810px;height:520px" data-at="2"><h3><span class="warm">Emit</span> a photon</h3>
          <svg style="position:absolute;left:0;top:110px" width="810" height="300" viewBox="0 0 810 300">
            ${lvl(130, 430, 60, '')}${lvl(130, 430, 250, '')}
            <g class="ep">${squig(150, 14, 36, WARM, 'warm')}</g><g class="ee">${eDot('')}</g>
            <text x="40" y="166" font-size="40" font-weight="900" class="f-warm" data-at="2@0.6" data-fx="fade">−E</text></svg>
          <div class="p-foot warm" data-at="2@0.5" data-fx="fade">atom’s energy goes down</div></div>
        <div class="banner" style="top:860px;padding:18px 40px" data-at="3" data-fx="pop">ΔE <span class="muted" style="font-size:36px">(of the atom)</span> = E <span class="muted" style="font-size:36px">(of the photon)</span></div>
      </div>
      <div data-at="4" data-fx="fade">
        <div class="card" style="left:120px;top:300px;width:810px;height:640px"><h3>Only certain levels</h3>
          <svg style="position:absolute;left:0;top:96px" width="810" height="530" viewBox="0 0 810 530">
            ${lvl(50, 360, 60, '')}${lvl(50, 360, 110, '')}${lvl(50, 360, 200, '')}${lvl(50, 360, 440, '')}
            <g data-at="5@0.3" data-fx="fade"><line x1="200" y1="214" x2="200" y2="424" stroke="${TEAL}" stroke-width="7" marker-end="url(#mk-teal)"/>
              <text x="228" y="330" font-size="30" font-weight="900" class="f-teal">difference</text><text x="228" y="366" font-size="30" font-weight="900" class="f-teal">= E photon</text></g>
            <g data-at="7@0.15" data-fx="fade"><line x1="100" y1="74" x2="100" y2="424" stroke="${PUR}" stroke-width="7" marker-end="url(#mk-pri)"/>
              <path d="${wave(420, 760, 360, 18, 34)}" fill="none" stroke="${PUR}" stroke-width="6"/>
              <text x="420" y="282" font-size="30" font-weight="900" class="f-pri">larger drop</text><text x="420" y="318" font-size="28" font-weight="800" class="f-pri">higher ν, shorter λ</text></g>
            <g data-at="7@0.5" data-fx="fade"><line x1="320" y1="124" x2="320" y2="186" stroke="${RED}" stroke-width="7" marker-end="url(#mk-bad)"/>
              <path d="${wave(420, 760, 150, 18, 120)}" fill="none" stroke="${RED}" stroke-width="6"/>
              <text x="420" y="72" font-size="30" font-weight="900" class="f-bad">smaller drop</text><text x="420" y="108" font-size="28" font-weight="800" class="f-bad">lower ν, longer λ</text></g>
            <g class="le">${eDot('')}</g>
          </svg></div>
        <div class="card" style="left:990px;top:300px;width:810px;height:640px" data-at="6"><h3>Emission spectrum</h3>
          <svg style="position:absolute;left:0;top:96px" width="810" height="530" viewBox="0 0 810 530"><defs>${RAIN}</defs>
            <text x="60" y="56" font-size="30" font-weight="800" class="f-muted">not a continuous rainbow</text>
            <rect x="60" y="80" width="690" height="90" rx="14" fill="url(#p-rain)" opacity=".45"/>
            <line x1="50" y1="186" x2="760" y2="64" stroke="${RED}" stroke-width="9" stroke-linecap="round" data-at="6@0.35" data-fx="draw" data-dur="0.5"/>
            <text x="60" y="276" font-size="30" font-weight="900" class="f-good" data-at="6@0.5" data-fx="fade">specific lines</text>
            <g data-at="6@0.55" data-fx="fade"><rect x="60" y="300" width="690" height="90" rx="14" fill="#0b0d14" stroke="#363c54" stroke-width="2"/>
              ${SPEC.map(([f, col]) => `<rect x="${60 + f * 690 - 7}" y="300" width="14" height="90" fill="${col}"/><rect x="${60 + f * 690 - 18}" y="300" width="36" height="90" fill="${col}" opacity=".25"/>`).join('')}</g>
            <text x="60" y="456" font-size="28" font-weight="800" class="f-muted" data-at="6@0.75" data-fx="fade">each line = one allowed drop</text></svg></div>
      </div>`,
    update(c) {
      const b = c.b
      // absorb: photon flies in from the left, electron jumps up
      const a0 = b[1].start + 0.4, fa = eio(c.seg(a0, a0 + 1))
      place(c.$('.ap'), lerp(130, 320, fa), 155); c.$('.ap').style.opacity = c.seg(a0 - 0.2, a0) * (1 - c.seg(a0 + 0.9, a0 + 1.1))
      place(c.$('.ae'), 530, lerp(250, 60, eio(c.seg(a0 + 0.95, a0 + 1.6))))
      // emit: electron drops, photon flies out to the right
      const e0 = b[2].start + 0.4, de = eio(c.seg(e0, e0 + 0.7))
      place(c.$('.ee'), 280, lerp(60, 250, de))
      place(c.$('.ep'), lerp(450, 610, eio(c.seg(e0 + 0.6, e0 + 1.6))), 155); c.$('.ep').style.opacity = c.seg(e0 + 0.5, e0 + 0.7)
      // the ladder: electron drops from the third level to the bottom on sentence 5
      const l0 = b[5].start + 0.1
      place(c.$('.le'), 200, lerp(200, 440, eio(c.seg(l0, l0 + 0.8))))
    },
  })

  // ---------- the two photon equations, then wavelength vs energy ----------
  const W = { x0: 220, x1: 1260 }
  EZ.scene('equations', {
    html: `<div class="kicker" data-at="in" data-fx="left">The two photon equations</div><h2 class="h1" data-at="0">c = λν and E = hν</h2>
      <div data-at="in" data-out="6" data-fx="fade">
        <div class="card" style="left:120px;top:300px;width:810px;height:470px" data-at="1"><h3>Speed of light</h3>
          <div class="p-big"><span class="teal">c</span> = <span class="pri">λν</span></div>
          <div class="p-leg" style="top:280px">speed of light = wavelength × frequency</div>
          <div class="p-val" data-at="2@0.2" data-fx="pop">c = <span class="teal">2.998 × 10<sup>8</sup> m/s</span></div></div>
        <div class="card" style="left:990px;top:300px;width:810px;height:470px" data-at="3"><h3>Photon energy</h3>
          <div class="p-big"><span class="warm">E</span> = <span class="pri">hν</span></div>
          <div class="p-leg" style="top:280px">energy = Planck’s constant × frequency</div>
          <div class="p-val" data-at="4@0.2" data-fx="pop">h = <span class="warm">6.626 × 10<sup>−34</sup> J·s</span></div></div>
        <div class="banner" style="top:820px;padding:20px 40px;font-size:46px" data-at="5" data-fx="pop">ν = 1.0 × 10<sup>15</sup> s<sup>−1</sup> ${ARR} E = hν = <span class="warm">6.6 × 10<sup>−19</sup> J</span></div>
      </div>
      <div data-at="6" data-fx="fade">
        <svg class="full" viewBox="0 0 1920 1080">
          <g data-at="7"><path class="w1" fill="none" stroke="${PUR}" stroke-width="9" stroke-linecap="round"/>
            <line x1="${W.x0}" x2="${W.x0 + 150}" y1="${700 - 100}" y2="${700 - 100}" stroke="#eef0f7" stroke-width="4" marker-start="url(#mk-text)" marker-end="url(#mk-text)"/>
            <text x="${W.x0 + 75}" y="${700 - 118}" text-anchor="middle" font-size="34" font-weight="900">λ</text></g>
          <g data-at="8"><path class="w2" fill="none" stroke="${RED}" stroke-width="9" stroke-linecap="round"/>
            <line x1="${W.x0}" x2="${W.x0 + 420}" y1="${410 - 100}" y2="${410 - 100}" stroke="#eef0f7" stroke-width="4" marker-start="url(#mk-text)" marker-end="url(#mk-text)"/>
            <text x="${W.x0 + 210}" y="${410 - 118}" text-anchor="middle" font-size="34" font-weight="900">λ</text></g>
          <g data-at="9@0.1" data-fx="pop"><circle cx="150" cy="410" r="40" fill="url(#g-red)"/><text x="150" y="424" text-anchor="middle" font-size="40" font-weight="900" class="f-dark">X</text></g>
          <g data-at="9@0.25" data-fx="pop"><circle cx="150" cy="700" r="40" fill="url(#g-pur)"/><text x="150" y="714" text-anchor="middle" font-size="40" font-weight="900" class="f-dark">Y</text></g>
        </svg>
        <div class="p-note" style="top:330px;border-color:rgba(240,112,122,.7)" data-at="8@0.2" data-fx="right"><b class="bad">Longer λ</b><span>lower frequency<br>lower energy</span></div>
        <div class="p-note" style="top:620px;border-color:rgba(141,141,240,.7)" data-at="7@0.2" data-fx="right"><b class="pri">Shorter λ</b><span>higher frequency<br>higher energy</span></div>
        <div style="position:absolute;left:120px;top:880px;width:1680px;text-align:center;font-size:40px;font-weight:900" data-at="6@0.3" data-fx="fade">shorter λ ${ARR} higher ν ${ARR} <span class="warm">higher energy</span></div>
      </div>`,
    update(c) {
      const b = c.b, t = c.t, k = 2 * Math.PI * 0.9
      // both waves move at the same speed; the short one oscillates faster. They settle at the end.
      const run = Math.min(t, b[9].end) - b[6].start
      c.$('.w1').setAttribute('d', wave(W.x0, W.x1, 700, 50, 150, -k * run * 260 / 150))
      c.$('.w2').setAttribute('d', wave(W.x0, W.x1, 410, 50, 420, -k * run * 260 / 420))
    },
  })

  // ---------- worked example: green light ----------
  const srow = (i, top, at, label, eq, res) => `<div class="p-row" style="top:${top}px" data-at="${at}"><div class="n">${i}</div><div class="lb">${label}</div>
      <div class="eq" data-at="${at}@0.35" data-fx="fade">${eq}</div><div class="p-res" data-at="${res[1]}" data-fx="pop">${res[0]}</div></div>`
  EZ.scene('example', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Green light</h2>
      <div class="card p-prob" data-at="1">Energy of <span class="warm">one photon</span> of <span class="good">500. nm</span> light?
        <svg style="position:absolute;right:40px;top:30px" width="420" height="70" viewBox="0 0 420 70"><path d="${wave(0, 420, 35, 22, 70)}" fill="none" stroke="#4cc781" stroke-width="7"/></svg></div>
      ${srow(1, 450, '2', 'nm → m', '500. nm = 500. × 10<sup>−9</sup> m =', ['5.00 × 10<sup>−7</sup> m', '2@0.75'])}
      ${srow(2, 590, '3', 'ν = c/λ', '(2.998 × 10<sup>8</sup>) ÷ (5.00 × 10<sup>−7</sup>) =', ['6.00 × 10<sup>14</sup> s<sup>−1</sup>', '3@0.8'])}
      ${srow(3, 730, '4', 'E = hν', '(6.626 × 10<sup>−34</sup>)(6.00 × 10<sup>14</sup>) =', ['3.97 × 10<sup>−19</sup> J', '4@0.8'])}
      <div class="banner" style="top:880px;padding:16px 40px" data-at="5" data-fx="pop">One photon: <span class="good">3.97 × 10<sup>−19</sup> J</span> <span class="muted">· a tiny amount</span></div>`,
  })

  // ---------- shortcut and the unit trap ----------
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Shortcut &amp; trap</div><h2 class="h1" data-at="0">One formula, one unit check</h2>
      <div class="card" style="left:120px;top:290px;width:810px;height:470px" data-at="1"><h3><small>1</small>One combined formula</h3>
        <div class="p-ln" style="top:120px" data-at="1@0.2" data-fx="left"><span class="teal">c = λν</span> <span class="muted" style="font-size:40px">so</span> ν = c/λ</div>
        <div class="p-ln" style="top:200px" data-at="1@0.35" data-fx="left"><span class="pri">E = hν</span></div>
        <div style="position:absolute;left:50px;right:50px;top:300px;padding:14px;border-radius:24px;text-align:center;font-size:76px;font-weight:900;background:rgba(243,167,100,.14);border:3px solid var(--warm)" data-at="1@0.5" data-fx="pop"><span class="warm">E = hc/λ</span></div></div>
      <div class="card" style="left:990px;top:290px;width:810px;height:470px" data-at="2"><h3><small>2</small>Convert nm → m first</h3>
        <div class="p-ln" style="top:130px;left:60px" data-at="3@0.1" data-fx="left"><span class="warm">500. nm</span> <span class="muted" style="font-size:44px">× 10<sup>−9</sup></span></div>
        <div class="p-ln" style="top:240px;left:60px" data-at="3@0.5" data-fx="left">= <span class="good">5.00 × 10<sup>−7</sup> m</span></div>
        <div class="p-foot muted" style="font-size:32px" data-at="2@0.4" data-fx="fade">mismatched units: the most common mistake</div></div>
      <div class="card p-mole" data-at="4"><div class="lab">Per mole: <span class="muted">× Avogadro’s number</span></div>
        <div class="m" data-at="5@0.2" data-fx="fade">3.97 × 10<sup>−19</sup> J × 6.022 × 10<sup>23</sup> ≈ <span class="warm">239 kJ/mol</span></div></div>
      <div style="position:absolute;left:120px;top:952px;width:1680px;text-align:center;font-size:36px;font-weight:800;color:var(--muted)" data-at="6" data-fx="fade">comparable to the energy of some chemical bonds</div>`,
  })

  // ---------- try it ----------
  const prow = (i, top, at, label, eq) => `<div class="p-row" style="top:${top}px" data-at="${at}"><div class="n">${i}</div><div class="lb">${label}</div><div class="eq" style="left:420px" data-at="${at}@0.3" data-fx="fade">${eq}</div></div>`
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">What is the <span class="teal">frequency</span> of light with λ = 600. nm?</h2>
      <div class="p-chx" style="left:120px;top:330px" data-at="1@0.6" data-fx="pop">λ = <span class="teal">600. nm</span></div>
      <div class="p-chx" style="left:450px;top:330px" data-at="1@0.75" data-fx="pop">c = <span class="pri">2.998 × 10<sup>8</sup> m/s</span></div>
      <div class="p-chx" style="left:920px;top:330px" data-at="1@0.9" data-fx="pop">ν = <span class="warm">?</span></div>
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="640" r="66" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="640" r="66" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 640)"/>
        <text class="num" x="960" y="664" text-anchor="middle" font-size="70" font-weight="900">3</text><text x="960" y="760" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="p-ans" data-at="3" data-fx="pop">ν = <span class="good">5.00 × 10<sup>14</sup> s<sup>−1</sup></span>${CHECK}</div>
      ${prow(1, 620, '4', 'Convert', '600. nm = <span class="teal">6.00 × 10<sup>−7</sup> m</span>')}
      ${prow(2, 760, '5', 'ν = c/λ', '(2.998 × 10<sup>8</sup> m/s) ÷ (6.00 × 10<sup>−7</sup> m) = <span class="good">5.00 × 10<sup>14</sup> s<sup>−1</sup></span>')}`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const w = eo(c.seg(b[3].start + 0.4, b[3].start + 0.9))
      c.$('.p-ans').style.boxShadow = `0 0 ${60 * w}px rgba(76,199,129,${0.45 * w})`
    },
  })

  // ---------- recap ----------
  const m1 = `<svg width="460" height="210" viewBox="0 0 460 210">${lvl(60, 200, 40, '')}${lvl(60, 200, 170, '')}${lvl(260, 400, 40, '')}${lvl(260, 400, 170, '')}
    <line x1="130" y1="156" x2="130" y2="58" stroke="${TEAL}" stroke-width="7" marker-end="url(#mk-teal)"/><line x1="330" y1="54" x2="330" y2="152" stroke="${WARM}" stroke-width="7" marker-end="url(#mk-warm)"/>
    <text x="130" y="112" text-anchor="end" dx="-14" font-size="30" font-weight="900" class="f-teal">up</text><text x="344" y="112" font-size="30" font-weight="900" class="f-warm">down</text></svg>`
  const m2 = `<svg width="460" height="210" viewBox="0 0 460 210"><text x="230" y="90" text-anchor="middle" font-size="58" font-weight="900" class="f-teal">c = λν</text><text x="230" y="170" text-anchor="middle" font-size="58" font-weight="900" class="f-pri">E = hν</text></svg>`
  const m3 = `<svg width="460" height="210" viewBox="0 0 460 210"><path d="${wave(30, 430, 60, 26, 160)}" fill="none" stroke="${RED}" stroke-width="7"/><path d="${wave(30, 430, 160, 26, 56)}" fill="none" stroke="${PUR}" stroke-width="7"/></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card p-rc" style="left:120px" data-at="1"><div class="n">1</div>${m1}<p><span class="teal">Absorb</span> a photon:<br>atom’s energy goes<br>up by E<sub>photon</sub>.<br><span class="warm">Emit</span>: it goes down.</p></div>
      <div class="card p-rc" style="left:690px" data-at="2"><div class="n">2</div>${m2}<p>Combine them:<br><span class="warm" style="font-size:46px">E = hc/λ</span></p></div>
      <div class="card p-rc" style="left:1260px" data-at="3"><div class="n">3</div>${m3}<p>Shorter wavelength =<br><span class="pri">higher energy</span><br>Convert <span class="warm">nm → m</span>!</p></div>`,
  })
})()
