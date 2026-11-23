// Pictures for chem-6.3 "Heat Transfer & Thermal Equilibrium". One EZ.scene per scene id in script.mjs.
// Words shown are the lesson's own (app/src/content/chem/u6.ts and chem/book.ts). No temperatures
// or energies are given in the lesson, so speeds, bars and the temperature line carry no numbers.
(() => {
  const { clamp, lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .h-note{position:absolute;left:1180px;width:620px;min-height:112px;padding:16px 22px 16px 84px;border-radius:22px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .h-note i{position:absolute;left:22px;top:30px;width:46px;height:46px;border-radius:50%}
    .h-note b{display:block;font-size:33px;font-weight:900;line-height:1.15} .h-note span{display:block;margin-top:4px;font-size:27px;font-weight:700;line-height:1.2;color:var(--muted)}
    .h-tag{position:absolute;padding:10px 24px;border-radius:999px;font-size:31px;font-weight:800;white-space:nowrap;background:rgba(36,40,56,.92);border:2px solid var(--line);color:var(--muted)}
    .h-tag b{color:var(--text);font-weight:900}
    .h-def{position:absolute;top:300px;width:540px;height:236px;padding:24px 30px;border-radius:28px;background:rgba(36,40,56,.92);border:3px solid var(--line)}
    .h-def b{display:block;font-size:42px;font-weight:900} .h-def span{display:block;margin-top:10px;font-size:30px;font-weight:700;line-height:1.25;color:var(--muted)} .h-def em{font-style:normal;font-weight:900;color:var(--text)}
    .h-opt{position:absolute;width:820px;height:130px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;padding:0 96px 0 106px;font-size:33px;font-weight:800;line-height:1.2}
    .h-opt .l{position:absolute;left:26px;top:33px;width:60px;height:60px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:32px;font-weight:900;line-height:56px;text-align:center;color:var(--muted)}
    .h-opt .ok{position:absolute;right:20px;top:31px;width:64px;height:64px}
    .h-pillbox{position:absolute;top:850px;width:810px;height:110px;border-radius:28px;border:3px solid;display:flex;align-items:center;justify-content:center;font-size:42px;font-weight:900;white-space:nowrap}
    .h-rc{top:320px;width:540px;height:560px;text-align:center} .h-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .h-rc svg{display:block;margin:14px auto 0} .h-rc p{margin:14px 20px 0;font-size:35px;font-weight:800;line-height:1.3;white-space:nowrap}
  `
  document.head.appendChild(css)

  // ---------- particles in a box: a pure function of the distance each one has travelled ----------
  const rng = (s) => () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296
  const reflect = (v, lo, hi) => { const L = hi - lo, m = (((v - lo) % (2 * L)) + 2 * L) % (2 * L); return lo + (m < L ? m : 2 * L - m) }
  const parts = (n, seed, w, h) => { const r = rng(seed)
    return Array.from({ length: n }, () => { const a = r() * Math.PI * 2; return { x: r() * w, y: r() * h, cx: Math.cos(a), cy: Math.sin(a), m: 0.7 + r() * 0.6 } }) }
  const R = 15 // particle radius
  const dots = (cls, n, g) => `<g class="${cls}">${Array.from({ length: n }, () => `<g>${ball(0, 0, R, g)}</g>`).join('')}</g>`
  function move(c, sel, list, s, w, h) {
    const els = c.$(sel).children
    list.forEach((p, i) => els[i].setAttribute('transform', `translate(${reflect(p.x + p.cx * s * p.m, R + 4, w - R - 4).toFixed(1)} ${reflect(p.y + p.cy * s * p.m, R + 4, h - R - 4).toFixed(1)})`))
  }
  // distance travelled at time t when the speed eases from v0 to v1 between t0 and t1
  const travelled = (t, ts, v0, v1, t0, t1) => { let s = 0
    for (let u = ts; u < t; u += 0.05) s += lerp(v0, v1, eio(clamp((u - t0) / (t1 - t0)))) * Math.min(0.05, t - u)
    return s }
  const VH = 300, VC = 75, VM = 165 // drawn speeds only: hot, cool, shared at the end
  const BW = 470, BH = 470, EH = 400
  const HOT = parts(11, 7, BW, BH), COLD = parts(11, 19, BW, BH)
  const box = (cls, stroke, fillc, l1, l2, l1cls, h = BH) => `<g class="${cls}"><rect width="${BW}" height="${h}" rx="26" fill="${fillc}" stroke="${stroke}" stroke-width="5"/>
    <text x="${BW / 2}" y="${l2 ? -62 : -24}" text-anchor="middle" font-size="38" font-weight="900" class="${l1cls}">${l1}</text>
    ${l2 ? `<text x="${BW / 2}" y="-20" text-anchor="middle" font-size="28" font-weight="800" class="f-muted">${l2}</text>` : ''}
    ${dots(cls + 'p', 11, cls.startsWith('hb') ? 'warm' : 'teal')}</g>`

  // ---------- intro artwork: faint particles at the edges and under the chips ----------
  const IH = parts(9, 3, 300, 220), IC = parts(9, 5, 300, 220)
  EZ.intro = {
    chips: [['1@0.5', 'Collisions'], ['1@0.68', 'Equilibrium'], ['1@0.86', 'Heat vs. temperature']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.28">
      <g transform="translate(40 160)"><rect width="300" height="220" rx="24" fill="none" stroke="#f3a764" stroke-width="4"/>${dots('ih', 9, 'warm')}</g>
      <g transform="translate(1580 160)"><rect width="300" height="220" rx="24" fill="none" stroke="#3cc7bc" stroke-width="4"/>${dots('ic', 9, 'teal')}</g>
      ${Array.from({ length: 13 }, (_, i) => ball(560 + i * 66, 890, 14, i < 6 ? 'warm' : i > 6 ? 'teal' : 'gold')).join('')}</svg>`,
    update(c) {
      const t = c.t - c.sc.start
      move(c, '.ih', IH, t * 120, 300, 220); move(c, '.ic', IC, t * 35, 300, 220)
    },
  }

  // ---------- hook: an ice cube in lemonade ----------
  const thermo = (x, cls, color) => `<g transform="translate(${x} 0)"><rect x="-22" y="340" width="44" height="420" rx="22" fill="#242838" stroke="#363c54" stroke-width="3"/>
    <circle cy="790" r="44" fill="${color}"/><rect class="${cls}" x="-12" width="24" rx="12" fill="${color}"/></g>`
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Think about it</div><h2 class="h1" data-at="0">Ice in lemonade</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <path d="M250 360 L300 900 Q304 930 334 930 L646 930 Q676 930 680 900 L730 360" fill="rgba(255,255,255,.05)" stroke="#c9cee0" stroke-width="6" stroke-linejoin="round"/>
        <path d="M268 470 L306 892 Q309 914 334 914 L646 914 Q671 914 674 892 L712 470 Z" fill="rgba(242,196,67,.35)"/>
        <g class="ice"><rect x="-70" y="-70" width="140" height="140" rx="22" fill="rgba(200,240,255,.55)" stroke="#e8f8ff" stroke-width="4"/><path d="M-40 -46 L10 -46" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".7"/></g>
        <g data-at="1" data-fx="fade">${thermo(1060, 'hk1', '#f2c443')}<text x="1060" y="900" text-anchor="middle" font-size="36" font-weight="900" class="f-gold">drink</text></g>
        <g data-at="2" data-fx="fade">${thermo(1420, 'hk2', '#3cc7bc')}<text x="1420" y="900" text-anchor="middle" font-size="36" font-weight="900" class="f-teal">ice</text></g>
        <g data-at="1@0.3" data-fx="fade"><line x1="1140" y1="420" x2="1140" y2="560" stroke="#f2c443" stroke-width="8" marker-end="url(#mk-gold)"/><text x="1170" y="500" font-size="34" font-weight="900" class="f-gold">cools</text></g>
        <g data-at="2@0.3" data-fx="fade"><line x1="1500" y1="700" x2="1500" y2="560" stroke="#3cc7bc" stroke-width="8" marker-end="url(#mk-teal)"/><text x="1530" y="640" font-size="34" font-weight="900" class="f-teal">warms</text></g>
        <g data-at="3@0.4" data-fx="fade"><line x1="1010" y1="560" x2="1470" y2="560" stroke="#eef0f7" stroke-width="4" stroke-dasharray="12 12"/></g>
      </svg>
      <div class="h-tag" style="left:1110px;top:250px;border-color:var(--good);color:var(--good)" data-at="3@0.5" data-fx="pop">same temperature</div>
      <div class="banner" style="top:960px;padding:16px 40px;font-size:44px" data-at="4" data-fx="pop">What is happening between the <span class="teal">particles</span>?</div>`,
    update(c) {
      const b = c.b
      const drop = eo(c.seg(b[0].start + 0.1, b[0].start + 0.9))
      const bob = c.t > b[0].start + 0.9 ? 6 * Math.sin((c.t - b[0].start) * 2) : 0
      c.$('.ice').setAttribute('transform', `translate(500 ${lerp(150, 540, drop) + bob}) rotate(${lerp(-25, 8, drop)})`)
      const p = eio(c.seg(b[1].start + 0.4, b[3].start + 1.4))
      const top1 = lerp(380, 560, p), top2 = lerp(720, 560, p)
      c.$('.hk1').setAttribute('y', top1); c.$('.hk1').setAttribute('height', 800 - top1)
      c.$('.hk2').setAttribute('y', top2); c.$('.hk2').setAttribute('height', 800 - top2)
    },
  })

  // ---------- collisions pass energy along ----------
  EZ.scene('collide', {
    html: `<div class="kicker" data-at="in" data-fx="left">Zoom in</div><h2 class="h1" data-at="0">Heat is passed along by collisions</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1" data-fx="fade"><g class="hbx">${box('hb', '#f3a764', 'rgba(243,167,100,.08)', 'Warmer object', 'greater average KE', 'f-warm')}</g></g>
        <g data-at="3" data-fx="fade"><g class="cbx">${box('cb', '#3cc7bc', 'rgba(60,199,188,.08)', 'Cooler object', 'lower average KE', 'f-teal')}</g></g>
        <g class="spark"><circle r="26" fill="#f2c443" opacity=".35"/><circle r="11" fill="#fff2b8"/></g>
      </svg>
      <div class="h-tag" style="left:236px;top:906px;border-color:var(--warm);color:var(--warm)" data-at="2" data-fx="pop">faster, on average</div>
      <div class="h-tag" style="left:790px;top:906px;border-color:var(--accent);color:var(--accent)" data-at="3@0.6" data-fx="pop">slower</div>
      <div class="card" style="left:1240px;top:330px;width:560px;height:470px" data-at="5"><h3>One collision</h3>
        <svg style="position:absolute;left:0;top:100px" width="560" height="360" viewBox="0 0 560 360">
          <line x1="40" y1="250" x2="520" y2="250" stroke="#363c54" stroke-width="3"/>
          <g class="c1">${ball(0, 0, 46, 'warm')}</g><g class="c2">${ball(0, 0, 46, 'teal')}</g>
          <line class="v1" y1="70" y2="70" stroke="#f3a764" stroke-width="8" marker-end="url(#mk-warm)"/><line class="v2" y1="70" y2="70" stroke="#3cc7bc" stroke-width="8" marker-end="url(#mk-teal)"/>
          <text class="w1 f-warm" y="40" text-anchor="middle" font-size="30" font-weight="900">fast</text><text class="w2 f-teal" y="40" text-anchor="middle" font-size="30" font-weight="900">slow</text>
          <g class="burst"><circle cx="280" cy="180" r="30" fill="#f2c443" opacity=".5"/><text x="280" y="300" text-anchor="middle" font-size="30" font-weight="900" class="f-gold">energy passes</text></g>
        </svg></div>
      <div class="h-tag" style="left:1310px;top:820px;border-color:var(--gold);color:var(--gold)" data-at="7@0.6" data-fx="pop">= <b style="color:var(--gold)">heat transfer</b></div>
      <div class="banner" style="left:1000px;width:800px;top:930px;padding:14px 30px;font-size:34px" data-at="9" data-fx="pop">No atoms cross. Only <span class="gold">energy</span> moves.</div>`,
    update(c) {
      const b = c.b, t = c.t, ts = c.sc.start
      const join = eio(c.seg(b[4].start + 0.3, b[4].start + 1.4))
      const hx = lerp(110, 170, join), cx = lerp(700, 170 + BW, join)
      c.$('.hbx').setAttribute('transform', `translate(${hx} 420)`); c.$('.cbx').setAttribute('transform', `translate(${cx} 420)`)
      move(c, '.hbp', HOT, (t - ts) * VH, BW, BH); move(c, '.cbp', COLD, (t - ts) * VC, BW, BH)
      // a flash on the shared wall now and then, once the objects touch
      const ph = ((t - b[5].start) % 1.1) / 1.1, k = Math.floor((t - b[5].start) / 1.1)
      c.$('.spark').style.opacity = t < b[5].start ? 0 : Math.sin(Math.PI * ph)
      c.$('.spark').setAttribute('transform', `translate(${170 + BW} ${470 + ((k * 137) % 370)})`)
      // the inset: a fast warm particle hits a slow teal one; afterwards the warm one is slower, the teal one faster
      const L = 3.2, u = t < b[5].start + 0.5 ? 0 : ((t - b[5].start - 0.5) % L), hit = 1.2
      const x1 = u < hit ? lerp(40, 234, u / hit) : 234 - (u - hit) * 30, x2 = u < hit ? lerp(360, 326, u / hit) : 326 + (u - hit) * 50
      c.$('.c1').setAttribute('transform', `translate(${x1} 180)`); c.$('.c2').setAttribute('transform', `translate(${x2} 180)`)
      const after = u >= hit, l1 = after ? 40 : 120, l2 = after ? 90 : 30
      const v1 = c.$('.v1'), v2 = c.$('.v2')
      if (after) { v1.setAttribute('x1', x1); v1.setAttribute('x2', x1 - l1); v2.setAttribute('x1', x2); v2.setAttribute('x2', x2 + l2) }
      else { v1.setAttribute('x1', x1); v1.setAttribute('x2', x1 + l1); v2.setAttribute('x1', x2); v2.setAttribute('x2', x2 - l2) }
      c.$('.w1').setAttribute('x', x1); c.$('.w2').setAttribute('x', x2)
      c.$('.w1').textContent = after ? 'slower' : 'fast'; c.$('.w2').textContent = after ? 'faster' : 'slow'
      c.$('.burst').style.opacity = after ? Math.max(0, 1 - (u - hit) / 0.9) : 0
    },
  })

  // ---------- thermal equilibrium ----------
  const meter = (x, cls, color) => `<rect x="${x}" y="350" width="400" height="26" rx="13" fill="#2c3145"/><rect class="${cls}" x="${x}" y="350" height="26" rx="13" fill="${color}"/>`
  const note = (top, at, color, a, s) => `<div class="h-note" style="top:${top}px" data-at="${at}" data-fx="right"><i style="background:${color}"></i><b>${a}</b><span>${s}</span></div>`
  EZ.scene('equil', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Thermal equilibrium</div><h2 class="h1" data-at="0">When does the transfer stop?</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g transform="translate(120 480)">${box('hbe', '#f3a764', 'rgba(243,167,100,.08)', 'started hot', '', 'f-warm', EH)}</g>
        <g transform="translate(${120 + BW} 480)">${box('cbe', '#3cc7bc', 'rgba(60,199,188,.08)', 'started cool', '', 'f-teal', EH)}</g>
        <g data-at="1" data-fx="fade">${meter(155, 'm1', '#f3a764')}${meter(155 + BW, 'm2', '#3cc7bc')}
          <text x="355" y="330" text-anchor="middle" font-size="26" font-weight="800" class="f-muted">average KE</text><text x="${355 + BW}" y="330" text-anchor="middle" font-size="26" font-weight="800" class="f-muted">average KE</text></g>
        <g data-at="3" data-fx="pop"><circle cx="${120 + BW}" cy="363" r="34" fill="#4cc781"/><text x="${120 + BW}" y="378" text-anchor="middle" font-size="46" font-weight="900" class="f-dark">=</text></g>
      </svg>
      ${note(420, '1', '#f3a764', 'Hot one cools, cool one warms', 'collisions keep passing energy')}
      ${note(560, '2', '#4cc781', 'Same average KE', 'so the temperatures are equal')}
      <div class="card" style="left:1180px;top:710px;width:620px;height:190px" data-at="5">
        <div style="position:absolute;left:34px;top:26px;font-size:46px;font-weight:900"><span class="warm">hot</span> ${ARR} <span class="teal">cold</span></div>
        <div style="position:absolute;left:34px;top:100px;font-size:29px;font-weight:800;color:var(--muted)" data-at="6@0.3" data-fx="fade">never the other way on its own</div></div>
      <div class="banner" style="top:924px;padding:14px 30px;font-size:44px" data-at="4" data-fx="pop">Thermal equilibrium: <span class="good">equal temperatures</span></div>`,
    update(c) {
      const b = c.b, t = c.t, ts = c.sc.start, t0 = b[1].start, t1 = b[3].start
      move(c, '.hbep', HOT, travelled(t, ts, VH, VM, t0, t1), BW, EH)
      move(c, '.cbep', COLD, travelled(t, ts, VC, VM, t0, t1), BW, EH)
      const p = eio(clamp((t - t0) / (t1 - t0)))
      c.$('.m1').setAttribute('width', lerp(370, 220, p)); c.$('.m2').setAttribute('width', lerp(70, 220, p))
    },
  })

  // ---------- where the final temperature ends up ----------
  const XC = 360, XH = 1560, XF = 470
  EZ.scene('between', {
    html: `<div class="kicker" data-at="in" data-fx="left">Final temperature</div><h2 class="h1" data-at="0">Where does it end up?</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <defs><linearGradient id="h-scale" x1="0" x2="1"><stop offset="0" stop-color="#3cc7bc"/><stop offset="1" stop-color="#f3a764"/></linearGradient></defs>
        <g data-at="in+0.2" data-fx="fade"><rect x="240" y="748" width="1440" height="24" rx="12" fill="url(#h-scale)" opacity=".85"/>
          <text x="240" y="720" font-size="28" font-weight="800" class="f-muted">colder</text><text x="1680" y="720" text-anchor="end" font-size="28" font-weight="800" class="f-muted">hotter</text>
          <circle cx="${XC}" cy="760" r="20" fill="#3cc7bc" stroke="#10131c" stroke-width="5"/><text x="${XC}" y="822" text-anchor="middle" font-size="30" font-weight="900" class="f-teal">cool start</text>
          <circle cx="${XH}" cy="760" r="20" fill="#f3a764" stroke="#10131c" stroke-width="5"/><text x="${XH}" y="822" text-anchor="middle" font-size="30" font-weight="900" class="f-warm">hot start</text></g>
        <g data-at="1@0.4" data-fx="fade"><path d="M${XC} 664 L${XC} 650 L${XH} 650 L${XH} 664" fill="none" stroke="#a3abbd" stroke-width="4"/><text x="${(XC + XH) / 2}" y="634" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">the final temperature lies in between</text></g>
        <g data-at="1@0.2" data-fx="fade"><g class="fin"><path d="M-22 -48 L22 -48 L0 -14 Z" fill="#f2c443"/><circle r="16" fill="#f2c443" stroke="#10131c" stroke-width="5"/><text y="-56" text-anchor="middle" font-size="32" font-weight="900" class="f-gold">final</text></g></g>
        <text x="${XC}" y="862" text-anchor="middle" font-size="26" font-weight="800" class="f-teal" data-at="2@0.5" data-fx="fade">larger heat capacity</text>
        <g data-at="4" data-fx="pop"><path d="M${XC - 150} 380 L${XC - 130} 600 Q${XC - 128} 616 ${XC - 110} 616 L${XC + 110} 616 Q${XC + 128} 616 ${XC + 130} 600 L${XC + 150} 380" fill="rgba(60,199,188,.1)" stroke="#c9cee0" stroke-width="5"/>
          <path d="M${XC - 142} 430 L${XC - 125} 598 Q${XC - 124} 608 ${XC - 110} 608 L${XC + 110} 608 Q${XC + 124} 608 ${XC + 125} 598 L${XC + 142} 430 Z" fill="rgba(60,199,188,.35)"/>
          <text x="${XC}" y="535" text-anchor="middle" font-size="32" font-weight="900">lots of water</text></g>
        <g data-at="4@0.4" data-fx="pop"><rect x="${XH - 40}" y="520" width="80" height="80" rx="10" fill="url(#g-gray)" stroke="#f3a764" stroke-width="5"/><text x="${XH}" y="490" text-anchor="middle" font-size="32" font-weight="900">small hot metal</text></g>
        <g data-at="5@0.3" data-fx="fade"><line x1="${XC}" y1="900" x2="${XF + 6}" y2="900" stroke="#3cc7bc" stroke-width="8" marker-end="url(#mk-teal)"/><text x="${XC - 40}" y="960" font-size="30" font-weight="900" class="f-teal">water: changes only slightly</text></g>
        <g data-at="6@0.3" data-fx="fade"><line x1="${XH}" y1="900" x2="${XF + 30}" y2="900" stroke="#f3a764" stroke-width="8" marker-end="url(#mk-warm)"/><text x="${XH}" y="960" text-anchor="end" font-size="30" font-weight="900" class="f-warm">metal: cools almost to the water’s start</text></g>
      </svg>
      <div class="card" style="left:660px;top:320px;width:640px;height:220px;padding:26px 34px" data-at="3">
        <div style="font-size:26px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)">Heat capacity</div>
        <div style="margin-top:8px;font-size:44px;font-weight:900">mass × specific heat</div>
        <div style="margin-top:10px;font-size:29px;font-weight:800;color:var(--muted)" data-at="3@0.55" data-fx="fade">larger ${ARR} <span class="teal">temperature changes least</span></div></div>`,
    update(c) {
      const b = c.b
      const x = lerp((XC + XH) / 2, XF, eio(c.seg(b[2].start + 0.3, b[2].start + 1.8)))
      c.$('.fin').setAttribute('transform', `translate(${x} 760)`)
    },
  })

  // ---------- the trap: temperature vs. heat ----------
  const cupDots = rng(41), tubDots = rng(43)
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Common trap</div><h2 class="h1" data-at="0">Temperature is not heat</h2>
      <div class="h-def" style="left:120px;border-color:rgba(141,141,240,.6)" data-at="1"><b class="pri">Temperature</b><span>the <em>average</em> kinetic energy of the particles</span></div>
      <div class="h-def" style="left:690px;border-color:rgba(242,196,67,.6)" data-at="2"><b class="gold">Thermal energy</b><span>the <em>total</em> kinetic energy of all the particles</span></div>
      <div class="h-def" style="left:1260px;border-color:rgba(243,167,100,.6)" data-at="3"><b class="warm">Heat (q)</b><span>the energy <em>transferred</em>,<br>warmer ${ARR} cooler</span></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="4" data-fx="pop"><path d="M170 640 L190 880 Q192 900 212 900 L368 900 Q388 900 390 880 L410 640" fill="rgba(243,167,100,.12)" stroke="#c9cee0" stroke-width="5"/>
          ${Array.from({ length: 6 }, () => ball(210 + cupDots() * 160, 690 + cupDots() * 180, 12, 'warm')).join('')}
          <text x="290" y="950" text-anchor="middle" font-size="32" font-weight="900">cup, boiling</text></g>
        <g data-at="4@0.5" data-fx="pop"><rect x="500" y="640" width="500" height="260" rx="60" fill="rgba(141,141,240,.1)" stroke="#c9cee0" stroke-width="5"/>
          ${Array.from({ length: 40 }, () => ball(530 + tubDots() * 440, 670 + tubDots() * 200, 12, 'gold')).join('')}
          <text x="750" y="950" text-anchor="middle" font-size="32" font-weight="900">bathtub, warm</text></g>
        <g data-at="5" data-fx="fade"><text x="1100" y="640" font-size="32" font-weight="900" class="f-pri">Temperature</text>
          <text x="1100" y="694" font-size="28" font-weight="800" class="f-muted">cup</text><rect x="1260" y="672" width="520" height="28" rx="14" fill="#2c3145"/><rect x="1260" y="672" width="500" height="28" rx="14" fill="#8d8df0"/>
          <text x="1100" y="744" font-size="28" font-weight="800" class="f-muted">bathtub</text><rect x="1260" y="722" width="520" height="28" rx="14" fill="#2c3145"/><rect x="1260" y="722" width="250" height="28" rx="14" fill="#7d859c"/></g>
        <g data-at="6" data-fx="fade"><text x="1100" y="820" font-size="32" font-weight="900" class="f-gold">Thermal energy</text>
          <text x="1100" y="874" font-size="28" font-weight="800" class="f-muted">cup</text><rect x="1260" y="852" width="520" height="28" rx="14" fill="#2c3145"/><rect x="1260" y="852" width="90" height="28" rx="14" fill="#7d859c"/>
          <text x="1100" y="924" font-size="28" font-weight="800" class="f-muted">bathtub</text><rect x="1260" y="902" width="520" height="28" rx="14" fill="#2c3145"/><rect x="1260" y="902" width="500" height="28" rx="14" fill="#f2c443"/></g>
      </svg>
      <div class="h-tag" style="left:1100px;top:960px;border-color:var(--gold);color:var(--gold)" data-at="6@0.6" data-fx="pop">more particles ${ARR} can transfer more heat</div>`,
  })

  // ---------- try it ----------
  const OPTS = ['the metal is still hotter than the water', 'the metal and water have the same temperature', 'the metal and water have the same total energy', 'heat flows from the water to the metal forever']
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:58px" data-at="1">A hot metal block is placed in cool water. At <span class="teal">thermal equilibrium</span>…</h2>
      ${OPTS.map((o, i) => `<div class="h-opt t${i}" style="left:${120 + (i % 2) * 860}px;top:${350 + Math.floor(i / 2) * 150}px" data-at="${i + 2}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>
        ${i === 1 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        <span>${o}</span></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="790" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="790" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 790)"/>
        <text class="num" x="960" y="816" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="920" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:690px;font-size:44px" data-at="8" data-fx="pop">Same <span class="teal">average KE</span> ${ARR} same <span class="teal">temperature</span></div>
      <div class="h-pillbox" style="left:120px;border-color:var(--good);background:rgba(76,199,129,.12)" data-at="8@0.5" data-fx="pop">Temperatures:&nbsp;<span class="good">equal</span></div>
      <div class="h-pillbox" style="left:990px;border-color:var(--warm);background:rgba(243,167,100,.12)" data-at="9" data-fx="pop">Total energies:&nbsp;<span class="warm">need not be equal</span></div>`,
    update(c) {
      const b = c.b, t0 = b[6].start + 0.3, t1 = b[7].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[7].start + 0.5, b[7].start + 0.95))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 1) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="210" viewBox="0 0 460 210"><rect x="20" y="20" width="190" height="170" rx="20" fill="rgba(243,167,100,.08)" stroke="#f3a764" stroke-width="4"/>
    ${[[70, 70], [150, 60], [100, 140], [170, 150]].map(([x, y]) => `<line x1="${x - 46}" y1="${y}" x2="${x - 18}" y2="${y}" stroke="#f3a764" stroke-width="5" stroke-linecap="round" opacity=".6"/>${ball(x, y, 14, 'warm')}`).join('')}
    <rect x="250" y="20" width="190" height="170" rx="20" fill="rgba(60,199,188,.08)" stroke="#3cc7bc" stroke-width="4"/>
    ${[[300, 70], [390, 60], [330, 140], [400, 150]].map(([x, y]) => `<line x1="${x - 24}" y1="${y}" x2="${x - 16}" y2="${y}" stroke="#3cc7bc" stroke-width="5" stroke-linecap="round" opacity=".6"/>${ball(x, y, 14, 'teal')}`).join('')}</svg>`
  const r2 = `<svg width="460" height="210" viewBox="0 0 460 210">${ball(120, 105, 44, 'warm')}${ball(340, 105, 44, 'teal')}<circle cx="230" cy="105" r="24" fill="#f2c443" opacity=".5"/>
    <line x1="176" y1="40" x2="286" y2="40" stroke="#f2c443" stroke-width="7" marker-end="url(#mk-gold)"/><text x="230" y="190" text-anchor="middle" font-size="30" font-weight="900" class="f-gold">hot ${'→'} cold</text></svg>`
  const r3 = `<svg width="460" height="210" viewBox="0 0 460 210">${[130, 330].map((x, i) => `<rect x="${x - 18}" y="20" width="36" height="150" rx="18" fill="#242838" stroke="#363c54" stroke-width="3"/><rect x="${x - 9}" y="80" width="18" height="96" rx="9" fill="${i ? '#3cc7bc' : '#f3a764'}"/><circle cx="${x}" cy="176" r="26" fill="${i ? '#3cc7bc' : '#f3a764'}"/>`).join('')}
    <circle cx="230" cy="90" r="32" fill="#4cc781"/><text x="230" y="106" text-anchor="middle" font-size="44" font-weight="900" class="f-dark">=</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card h-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p><span class="warm">Warmer</span> =<br>higher average KE<br>of the particles</p></div>
      <div class="card h-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p><span class="gold">Collisions</span><br>transfer energy<br>from hot to cold</p></div>
      <div class="card h-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p><span class="good">Thermal equilibrium</span><br>= equal temperatures<br>(equal average KE)</p></div>`,
  })
})()
