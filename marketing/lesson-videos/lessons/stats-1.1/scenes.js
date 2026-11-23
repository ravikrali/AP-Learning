// Pictures for stats-1.1 "What Can We Learn from Data?". One EZ.scene per scene id in script.mjs.
// Words and numbers shown are the lesson's own (app/src/content/stats/u1.ts and stats/book.ts).
// Crowds of people are pictures, not counts: only the sample of 60 in the gym example is drawn to count.
(() => {
  const { clamp, lerp, eio, eo, back, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    svg .f-pri{fill:var(--primary)} svg .f-teal{fill:var(--accent)} svg .f-warm{fill:var(--warm)} svg .f-bad{fill:var(--bad)}
    svg .f-muted{fill:var(--muted)} svg .f-gold{fill:var(--gold)} svg .f-good{fill:var(--good)}
    .note{position:absolute;left:1360px;width:490px;min-height:112px;padding:14px 20px 14px 84px;border-radius:22px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .note i{position:absolute;left:22px;top:28px;width:46px;height:46px;border-radius:50%}
    .note b{display:block;font-size:31px;font-weight:900;line-height:1.15} .note span{display:block;margin-top:4px;font-size:25px;font-weight:700;line-height:1.2;color:var(--muted)}
    .big{position:absolute;left:1360px;width:440px;padding:26px 30px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid var(--line)}
    .big b{display:block;font-size:40px;font-weight:900;line-height:1.1} .big span{display:block;margin-top:10px;font-size:30px;font-weight:700;line-height:1.25;color:var(--muted)}
    .tag{position:absolute;padding:10px 24px;border-radius:999px;font-size:31px;font-weight:800;white-space:nowrap;background:rgba(36,40,56,.92);border:2px solid var(--line);color:var(--muted)}
    .tag b{color:var(--text);font-weight:900}
    .tag.bad{border-color:var(--bad);color:var(--bad);background:rgba(240,112,122,.12)} .tag.teal{border-color:var(--accent);color:var(--accent);background:rgba(60,199,188,.12)}
    .tag.pri{border-color:var(--primary);color:var(--primary);background:rgba(141,141,240,.14)}
    .stage4{position:absolute;top:340px;width:390px;height:390px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .stage4 .n{position:absolute;left:22px;top:18px;width:60px;height:60px;border-radius:50%;background:var(--brand);font-size:34px;font-weight:900;line-height:60px}
    .stage4 svg{display:block;margin:34px auto 0} .stage4 b{display:block;margin-top:6px;font-size:54px;font-weight:900}
    .stage4 span{display:block;margin:8px 24px 0;font-size:29px;font-weight:700;line-height:1.25;color:var(--muted)}
    .link{position:absolute;top:512px;width:40px;text-align:center;font-size:38px;color:var(--muted)} .link .arr{margin:0}
    .qrow{position:absolute;left:120px;width:1680px;height:120px;border-radius:26px;border:3px solid;display:flex;align-items:center;gap:34px;padding:0 36px;font-size:46px;font-weight:900}
    .qrow small{flex:none;width:200px;padding:8px 0;border-radius:16px;text-align:center;font-size:28px;letter-spacing:.12em;text-transform:uppercase;color:#10131c}
    .vague{position:absolute;left:120px;width:520px;height:150px;border-radius:26px;background:rgba(36,40,56,.75);border:3px solid var(--line);display:flex;align-items:center;justify-content:center;font-size:46px;font-weight:900;color:var(--muted)}
    .vague .q{position:relative} .vague .strike{position:absolute;left:-10px;right:-10px;top:54%;height:7px;border-radius:4px;background:var(--bad)}
    .real{position:absolute;left:760px;width:1040px;height:150px;border-radius:26px;background:rgba(76,199,129,.12);border:3px solid var(--good);display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:900;white-space:nowrap}
    .to{position:absolute;left:640px;width:120px;text-align:center;font-size:54px;color:var(--good)}
    .opt{position:absolute;width:820px;height:130px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;padding:0 96px 0 106px;font-size:33px;font-weight:800;line-height:1.2}
    .opt .l{position:absolute;left:26px;top:33px;width:60px;height:60px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:32px;font-weight:900;line-height:56px;text-align:center;color:var(--muted)}
    .opt .ok{position:absolute;right:20px;top:31px;width:64px;height:64px}
    .pillbox{position:absolute;top:850px;width:810px;height:110px;border-radius:28px;border:3px solid;display:flex;align-items:center;justify-content:center;font-size:44px;font-weight:900;white-space:nowrap}
    .rc{top:320px;width:540px;height:560px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc svg{display:block;margin:14px auto 0} .rc p{margin:14px 20px 0;font-size:35px;font-weight:800;line-height:1.3;white-space:nowrap}
  `
  document.head.appendChild(css)

  // ---------- helpers ----------
  const rng = (s) => () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296
  const pick = (n, k, seed) => { const r = rng(seed), a = Array.from({ length: n }, (_, i) => i)
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
    return a.slice(0, k) }
  const GRAY = '#6b7390', TEAL = '#3cc7bc', PUR = '#8d8df0'
  const BODY = '<circle cy="-10" r="7"/><path d="M-12 14a12 12 0 0 1 24 0z"/>'
  /** a small person: head and shoulders, about 24 x 31 px at scale 1 */
  const person = (x, y, fill, s = 1, cls = '') => `<g ${cls ? `class="${cls}" data-x="${x}" data-y="${y}" ` : ''}transform="translate(${x} ${y}) scale(${s})" style="fill:${fill}">${BODY}</g>`
  const grid = (cols, rows, x0, y0, dx, dy) => Array.from({ length: cols * rows }, (_, i) => [x0 + (i % cols) * dx, y0 + Math.floor(i / cols) * dy])
  const tick = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle r="22" fill="#4cc781"/><path d="M-10 1l7 7 13-15" fill="none" stroke="#10131c" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/></g>`
  const cross = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle r="22" fill="#f0707a"/><path d="M-9 -9l18 18M9 -9l-18 18" fill="none" stroke="#10131c" stroke-width="5.5" stroke-linecap="round"/></g>`
  const all = (c, q) => (c['_' + q] ??= [...c.root.querySelectorAll(q)])
  const note = (top, at, color, a, b) => `<div class="note" style="top:${top}px" data-at="${at}" data-fx="right"><i style="background:${color}"></i><b>${a}</b><span>${b}</span></div>`

  // ---------- intro artwork: a crowd, with a sample lighting up (all of it above y = 950) ----------
  const IG = grid(28, 11, 96, 150, 64, 74), IS = pick(IG.length, 44, 11)
  EZ.intro = {
    chips: [['1@0.2', 'Parts of a study'], ['1@0.52', 'Good questions'], ['1@0.86', 'In context']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">${IG.map(([x, y]) => person(x, y, PUR, 1.1)).join('')}${IS.map((i) => person(IG[i][0], IG[i][1], TEAL, 1.5, 'is')).join('')}</svg>`,
    update(c) {
      all(c, '.is').forEach((el, k) => { el.style.opacity = c.seg(c.sc.start + 0.6 + k * 0.09, c.sc.start + 1 + k * 0.09) })
    },
  }

  // ---------- hook: you cannot ask every teen ----------
  const HG = grid(44, 8, 140, 340, 38.1, 48), HS = pick(HG.length, 38, 5)
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">The big question</div>
      <h2 class="h1" style="font-size:62px" data-at="1">How much time do teens spend on screens each day?</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.35" data-fx="fade"><g class="field">${HG.map(([x, y]) => person(x, y, GRAY, 1.05)).join('')}</g></g>
        ${HS.map((i) => person(HG[i][0], HG[i][1], TEAL, 0, 'hs')).join('')}
      </svg>
      <div class="tag" style="left:120px;top:738px" data-at="1@0.7" data-fx="fade">every teen in your country: <b>millions</b></div>
      <div class="tag bad" style="left:830px;top:738px" data-at="2" data-fx="pop">You can’t ask every teen</div>
      <div class="tag teal" style="right:120px;top:738px" data-at="3@0.12" data-fx="pop">a well-chosen few hundred</div>
      <div class="banner" style="top:832px" data-at="3@0.5" data-fx="pop">Ask a <span class="teal">few hundred</span> ${ARR} say something trustworthy about <span class="pri">millions</span></div>
      <div style="position:absolute;left:0;top:968px;width:1920px;text-align:center;font-size:42px;font-weight:900" data-at="4">That is what <span class="gold">statistics</span> is for.</div>`,
    update(c) {
      const b = c.b, t0 = b[3].start + 0.25
      c.$('.field').style.opacity = lerp(1, 0.4, c.seg(b[3].start, b[3].start + 0.7))
      all(c, '.hs').forEach((el, k) => {
        const p = c.seg(t0 + k * 0.03, t0 + 0.4 + k * 0.03), s = 1.3 * back(p) * (1 + 0.06 * Math.sin(c.t * 3 + k))
        el.setAttribute('transform', `translate(${el.dataset.x} ${el.dataset.y}) scale(${Math.max(s, 0)})`)
        el.style.opacity = p > 0 ? 1 : 0
      })
    },
  })

  // ---------- the parts of a study ----------
  const PG = grid(13, 9, 168, 440, 40.3, 48), PS = pick(PG.length, 15, 23)
  const SG = grid(5, 3, 940, 560, 65, 70)
  EZ.scene('parts', {
    html: `<div class="kicker" data-at="in" data-fx="left">The big idea</div><h2 class="h1" data-at="0">The parts of a statistical study</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.3" data-fx="fade"><rect x="120" y="330" width="580" height="540" rx="36" fill="rgba(141,141,240,.08)" stroke="#8d8df0" stroke-opacity=".55" stroke-width="3"/>
          ${PG.map(([x, y]) => person(x, y, GRAY, 1.05)).join('')}</g>
        <text x="152" y="392" font-size="30" font-weight="900" letter-spacing="3" class="f-pri" data-at="1@0.82" data-fx="fade">POPULATION</text>
        <text x="668" y="394" text-anchor="end" font-size="40" font-weight="900" class="f-pri" data-at="2@0.62" data-fx="fade">size N</text>
        <g data-at="3" data-fx="fade"><rect x="880" y="420" width="380" height="370" rx="32" fill="rgba(60,199,188,.08)" stroke="#3cc7bc" stroke-opacity=".7" stroke-width="3"/>
          <text x="912" y="480" font-size="30" font-weight="900" letter-spacing="3" class="f-teal">SAMPLE</text>
          <line x1="716" y1="605" x2="860" y2="605" stroke="#3cc7bc" stroke-width="7" marker-end="url(#mk-teal)"/></g>
        <text x="1228" y="482" text-anchor="end" font-size="40" font-weight="900" class="f-teal" data-at="3@0.62" data-fx="fade">size n</text>
        ${PS.map((i, k) => `<g class="fly" data-sx="${PG[i][0]}" data-sy="${PG[i][1]}" data-dx="${SG[k][0]}" data-dy="${SG[k][1]}" style="fill:${TEAL}">${BODY}</g>`).join('')}
        <g data-at="5" data-fx="fade"><rect x="900" y="515" width="340" height="232" rx="22" fill="none" stroke="#f3a764" stroke-width="4" stroke-dasharray="12 10"/>
          <text x="1258" y="852" text-anchor="end" font-size="34" font-weight="900" class="f-warm">a data set</text></g>
        <g data-at="4" data-fx="fade"><circle cx="940" cy="698" r="36" fill="none" stroke="#f2c443" stroke-width="5"/><line x1="940" y1="736" x2="940" y2="814" stroke="#f2c443" stroke-width="4"/>
          <text x="882" y="852" font-size="34" font-weight="900" class="f-gold">one datum</text></g>
      </svg>
      ${note(300, '2', PUR, 'Population · size N', 'all the items or individuals of interest')}
      ${note(440, '3', TEAL, 'Sample · size n', 'the subset we actually get data from')}
      ${note(580, '4', '#f2c443', 'Datum', 'one piece of information about one individual')}
      ${note(720, '5', '#f3a764', 'Data set', 'many data')}
      <div class="banner" style="top:900px;font-size:38px;white-space:nowrap" data-at="6@0.3" data-fx="pop">Population <span class="pri">too large</span>, or <span class="warm">too difficult</span> to get data from every member ${ARR} a study</div>`,
    update(c) {
      const b = c.b, show = c.p('1@0.3', 0.4)
      all(c, '.fly').forEach((el, k) => {
        const d = el.dataset, t0 = b[3].start + 0.2 + k * 0.05, p = eio(c.seg(t0, t0 + 1))
        el.setAttribute('transform', `translate(${lerp(+d.sx, +d.dx, p)} ${lerp(+d.sy, +d.dy, p) - 60 * Math.sin(Math.PI * p)}) scale(${lerp(1.15, 1.5, p)})`)
        el.style.opacity = show
      })
    },
  })

  // ---------- the four stages ----------
  const ICON = [
    `<svg width="150" height="120" viewBox="0 0 150 120"><circle cx="75" cy="60" r="56" fill="rgba(141,141,240,.16)" stroke="#8d8df0" stroke-width="4"/><text x="75" y="92" text-anchor="middle" font-size="92" font-weight="900" class="f-pri">?</text></svg>`,
    `<svg width="150" height="120" viewBox="0 0 150 120">${grid(5, 3, 23, 34, 26, 36).map(([x, y], i) => person(x, y, [1, 4, 7, 10, 13].includes(i) ? TEAL : GRAY, 0.95)).join('')}</svg>`,
    `<svg width="150" height="120" viewBox="0 0 150 120"><line x1="10" y1="110" x2="140" y2="110" stroke="#c9cee0" stroke-width="4" stroke-linecap="round"/>${[[18, 38], [48, 76], [78, 96], [108, 54]].map(([x, h]) => `<rect x="${x}" y="${108 - h}" width="24" height="${h}" rx="5" fill="#f3a764"/>`).join('')}</svg>`,
    `<svg width="150" height="120" viewBox="0 0 150 120"><path d="M18 12h114a12 12 0 0 1 12 12v50a12 12 0 0 1-12 12H70l-26 26v-26H18a12 12 0 0 1-12-12V24a12 12 0 0 1 12-12z" fill="rgba(76,199,129,.16)" stroke="#4cc781" stroke-width="4"/><path d="M50 50l17 17 34-36" fill="none" stroke="#4cc781" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  ]
  const STAGES = [['Ask', 'an investigative question about a population', '141,141,240'], ['Collect', 'data in a way that can answer it', '60,199,188'],
    ['Analyze', 'with graphs and summary statistics', '243,167,100'], ['Interpret', 'answer the original question, in context', '76,199,129']]
  EZ.scene('process', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">How a study works</div><h2 class="h1" data-at="0">Four stages of every investigation</h2>
      ${STAGES.map(([t, s], i) => `<div class="stage4 s${i}" style="left:${120 + i * 430}px" data-at="${i + 1}" data-fx="pop"><div class="n">${i + 1}</div>${ICON[i]}<b>${t}</b><span>${s}</span></div>
        ${i < 3 ? `<div class="link" style="left:${510 + i * 430}px" data-at="${i + 2}" data-fx="fade">${ARR}</div>` : ''}`).join('')}
      <div class="banner" style="top:790px;font-size:44px" data-at="5" data-fx="pop">The conclusion answers <span class="pri">the question that was asked</span>,<br>about <span class="teal">the population that was actually sampled</span></div>`,
    update(c) {
      const b = c.b
      STAGES.forEach(([, , rgb], i) => {
        const a = c.seg(b[i + 1].start, b[i + 1].start + 0.3) * (1 - c.seg(b[i + 2].start, b[i + 2].start + 0.4)), el = c.$('.s' + i)
        el.style.borderColor = `rgba(${rgb},${0.35 + 0.65 * a})`
        el.style.boxShadow = `0 0 ${54 * a}px rgba(${rgb},${0.5 * a})`
      })
    },
  })

  // ---------- good investigative questions ----------
  const pill = (x, w, label, stroke, fillc) => `<rect x="${x}" y="10" width="${w}" height="66" rx="33" fill="${fillc}" stroke="${stroke}" stroke-width="3"/><text x="${x + w / 2}" y="55" text-anchor="middle" font-size="34" font-weight="900">${label}</text>`
  EZ.scene('question', {
    html: `<div class="kicker" data-at="in" data-fx="left">Investigative questions</div><h2 class="h1" data-at="0">What makes a good question?</h2>
      <div class="card" style="left:120px;top:310px;width:810px;height:340px" data-at="2"><h3><small>1</small><span class="pri">A defined purpose</span></h3>
        <svg style="position:absolute;left:0;top:112px" width="810" height="228">
          <g data-at="2@0.15" data-fx="pop">${pill(40, 230, 'Question', '#8d8df0', 'rgba(141,141,240,.25)')}</g>
          <g data-at="2@0.55" data-fx="fade"><line x1="282" y1="43" x2="330" y2="43" stroke="#a3abbd" stroke-width="6" marker-end="url(#mk-muted)"/>${pill(346, 170, 'Data', '#363c54', 'rgba(36,40,56,.9)')}
            <line x1="528" y1="43" x2="576" y2="43" stroke="#a3abbd" stroke-width="6" marker-end="url(#mk-muted)"/>${pill(592, 180, 'Results', '#363c54', 'rgba(36,40,56,.9)')}</g>
          <text x="40" y="128" font-size="32" font-weight="800" class="f-teal" data-at="2@0.6" data-fx="fade">set before you look at the data</text>
          <g data-at="3" data-fx="fade">${cross(62, 176, 0.9)}<text x="96" y="187" font-size="32" font-weight="800" class="f-bad">never changed to fit the results</text></g>
        </svg></div>
      <div class="card" style="left:990px;top:310px;width:810px;height:340px" data-at="4"><h3><small>2</small><span class="teal">Data you can really get</span></h3>
        <svg style="position:absolute;left:0;top:112px" width="810" height="228">
          <g data-at="4@0.55" data-fx="pop">${pill(40, 300, 'collected', '#3cc7bc', 'rgba(60,199,188,.16)')}${tick(318, 43, 0.9)}</g>
          <g data-at="4@0.8" data-fx="pop">${pill(400, 300, 'analyzed', '#3cc7bc', 'rgba(60,199,188,.16)')}${tick(678, 43, 0.9)}</g>
          <text x="40" y="128" font-size="32" font-weight="800" class="f-muted" data-at="4@0.3" data-fx="fade">posed so the needed data can actually</text>
          <text x="40" y="170" font-size="32" font-weight="800" class="f-muted" data-at="4@0.3" data-fx="fade">be collected and analyzed</text>
        </svg></div>
      <div class="qrow" style="top:690px;border-color:var(--bad);background:rgba(240,112,122,.1)" data-at="5"><small style="background:var(--bad)">Weak</small><span>“Are phones bad?”</span></div>
      <div class="qrow" style="top:834px;font-size:40px;white-space:nowrap;border-color:var(--good);background:rgba(76,199,129,.12)" data-at="6"><small style="background:var(--good)">Better</small><span>“What is the mean daily screen time of students at our school?”</span></div>`,
  })

  // ---------- worked example: the gym ----------
  const GG = grid(20, 8, 176, 498, 55.2, 50), GS = pick(GG.length, 60, 42)
  EZ.scene('example', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Name the parts, in context</h2>
      <div style="position:absolute;left:120px;top:292px;display:flex;gap:16px">
        <div class="tag" style="position:relative" data-at="1@0.03" data-fx="fade"><b>A gym manager</b></div>
        <div class="tag" style="position:relative" data-at="1@0.2" data-fx="fade">randomly selects <b>60</b> members who use the pool</div>
        <div class="tag" style="position:relative" data-at="1@0.62" data-fx="fade">asks: satisfied with the <b>pool hours</b>?</div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="in+0.3" data-fx="fade"><rect class="box" x="120" y="380" width="1160" height="520" rx="36" fill="rgba(141,141,240,.06)" stroke="#8d8df0" stroke-opacity=".4" stroke-width="3"/>
          <text x="156" y="440" font-size="32" font-weight="800" class="f-muted">all members of this gym who use the pool</text>
          ${GG.map(([x, y]) => person(x, y, GRAY, 1.15)).join('')}</g>
        <text x="1246" y="440" text-anchor="end" font-size="32" font-weight="900" letter-spacing="3" class="f-pri" data-at="2" data-fx="fade">= POPULATION</text>
        ${GS.map((i) => person(GG[i][0], GG[i][1], TEAL, 0, 'gs')).join('')}
        <g data-at="3" data-fx="fade">${person(140, 956, TEAL, 1.3)}<text x="170" y="968" font-size="32" font-weight="900" class="f-teal">the 60 who were selected = SAMPLE</text></g>
        <text x="1280" y="966" text-anchor="end" font-size="24" font-weight="700" class="f-muted" data-at="1" data-fx="fade">the crowd is a picture, not a count</text>
      </svg>
      ${note(400, '2', PUR, 'Population', 'all members of this gym who use the pool')}
      ${note(540, '3', TEAL, 'Sample', 'the 60 pool-using members who were selected')}
      ${note(680, '4', TEAL, 'n = 60', 'the sample size')}
      ${note(800, '5', '#7d859c', 'N is unknown', 'all pool users: that is normal')}`,
    update(c) {
      const b = c.b, t0 = b[1].start + 0.2 * (b[1].end - b[1].start), pulse = c.seg(b[3].start, b[3].start + 0.4) * (1 - c.seg(b[3].end, b[3].end + 0.4))
      all(c, '.gs').forEach((el, k) => {
        const p = c.seg(t0 + k * 0.035, t0 + 0.35 + k * 0.035), s = 1.3 * back(p) * (1 + 0.14 * pulse * Math.sin(c.t * 6 + k * 0.5))
        el.setAttribute('transform', `translate(${el.dataset.x} ${el.dataset.y}) scale(${Math.max(s, 0)})`)
        el.style.opacity = p > 0 ? 1 : 0
      })
      const g = c.seg(b[2].start, b[2].start + 0.4), box = c.$('.box')
      box.setAttribute('stroke-opacity', 0.4 + 0.6 * g); box.setAttribute('stroke-width', 3 + 3 * g)
    },
  })

  // ---------- trap: too wide a population ----------
  const TG = grid(14, 5, 340, 596, 57, 56), TS = pick(TG.length, 16, 9)
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Trap</div><h2 class="h1" data-at="1">Don’t make the population too wide</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.6" data-fx="fade"><rect x="120" y="300" width="1180" height="670" rx="44" fill="rgba(163,171,189,.05)" stroke="#7d859c" stroke-width="3" stroke-dasharray="14 10"/>
          <text x="160" y="356" font-size="34" font-weight="900" class="f-muted">All people</text></g>
        <g data-at="1@0.25" data-fx="fade"><rect x="200" y="384" width="1020" height="546" rx="40" fill="rgba(163,171,189,.06)" stroke="#7d859c" stroke-width="3" stroke-dasharray="14 10"/>
          <text x="240" y="440" font-size="34" font-weight="900" class="f-muted">All members of the gym</text></g>
        <g data-at="in" data-fx="fade"><rect class="inner" x="280" y="468" width="860" height="422" rx="36" fill="rgba(60,199,188,.08)" stroke="#3cc7bc" stroke-width="3"/>
          <text x="320" y="524" font-size="34" font-weight="900" class="f-teal">Members who use the pool</text>
          ${TG.map(([x, y], i) => person(x, y, TS.includes(i) ? TEAL : GRAY, 1.2)).join('')}</g>
        <g data-at="2@0.55" data-fx="pop">${tick(816, 512, 1)}<text x="850" y="524" font-size="34" font-weight="900" class="f-good">the population</text></g>
        <g data-at="3@0.1" data-fx="pop">${cross(686, 428, 0.9)}<text x="718" y="440" font-size="32" font-weight="900" class="f-bad">too wide</text></g>
        <g data-at="3@0.6" data-fx="pop">${cross(370, 344, 0.9)}<text x="402" y="356" font-size="32" font-weight="900" class="f-bad">too wide</text></g>
      </svg>
      <div class="big" style="top:330px;border-color:rgba(60,199,188,.7)" data-at="2" data-fx="right"><b class="teal">Population =<br>pool users</b><span>only pool users could be selected</span></div>
      <div class="big" style="top:640px;border-color:rgba(240,112,122,.7)" data-at="3" data-fx="right"><b class="bad">Too wide</b><span>not “all members”<br>not “all people”</span></div>`,
    update(c) {
      const g = c.seg(c.b[2].start + 0.3, c.b[2].start + 0.8)
      c.$('.inner').setAttribute('stroke-width', 3 + 4 * g)
      c.$('.inner').style.filter = `drop-shadow(0 0 ${26 * g}px rgba(60,199,188,${0.6 * g}))`
    },
  })

  // ---------- answer in context ----------
  EZ.scene('context', {
    html: `<div class="kicker" data-at="in" data-fx="left">Exam habit</div><h2 class="h1" data-at="0">“In context” = name the real thing</h2>
      <div class="tag pri" style="left:120px;top:296px" data-at="1" data-fx="fade">tie every statistical word to the story</div>
      <div class="vague" style="top:390px" data-at="2"><span class="q">“the population”<i class="strike" data-at="2@0.42" data-fx="grow" data-dur="0.35"></i></span></div>
      <div class="to" style="top:428px" data-at="2@0.45" data-fx="fade">${ARR}</div>
      <div class="real" style="top:390px" data-at="2@0.5" data-fx="pop">“all pool-using members of the gym”</div>
      <div class="vague" style="top:580px" data-at="3"><span class="q">“the mean”<i class="strike" data-at="3@0.35" data-fx="grow" data-dur="0.35"></i></span></div>
      <div class="to" style="top:618px" data-at="3@0.38" data-fx="fade">${ARR}</div>
      <div class="real" style="top:580px" data-at="3@0.42" data-fx="pop">“the mean daily screen time of the sampled teens”</div>
      <div class="banner" style="top:800px" data-at="4" data-fx="pop">When in doubt, add <span class="pri">who</span> and <span class="teal">what</span></div>`,
  })

  // ---------- try it ----------
  const OPTS = ['Statistical studies are always required by law', 'Collecting data from every adult resident would be too difficult', 'A study guarantees every resident is included', 'A study avoids collecting any data from residents']
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1@0.62">Why is a <span class="teal">statistical study</span> needed?</h2>
      <div style="position:absolute;left:120px;top:272px;font-size:36px;font-weight:800;color:var(--muted)" data-at="1">A city wants the average commute time of all of its <b style="color:var(--text)">2 million</b> adult residents.</div>
      ${OPTS.map((o, i) => `<div class="opt t${i}" style="left:${120 + (i % 2) * 860}px;top:${350 + Math.floor(i / 2) * 150}px" data-at="${i + 2}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>
        ${i === 1 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        <span>${o}</span></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="790" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="790" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 790)"/>
        <text class="num" x="960" y="816" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="920" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:690px;font-size:44px" data-at="8" data-fx="pop">The population is <span class="pri">huge</span> ${ARR} data from <span class="warm">every</span> adult is too difficult</div>
      <div class="pillbox" style="left:120px;border-color:var(--accent);background:rgba(60,199,188,.12)" data-at="9" data-fx="pop">A study uses a&nbsp;<span class="teal">sample</span>&nbsp;instead</div>
      <div class="pillbox" style="left:990px;border-color:var(--warm);background:rgba(243,167,100,.12)" data-at="10" data-fx="pop">Everyone included = a&nbsp;<span class="warm">census</span></div>`,
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
  const m1 = `<svg width="460" height="210" viewBox="0 0 460 210"><rect x="14" y="14" width="250" height="182" rx="22" fill="rgba(141,141,240,.1)" stroke="#8d8df0" stroke-width="3"/>
    ${grid(7, 4, 40, 50, 33, 40).map(([x, y], i) => person(x, y, [3, 9, 12, 19, 22, 26].includes(i) ? TEAL : GRAY, 0.95)).join('')}
    <line x1="276" y1="105" x2="318" y2="105" stroke="#3cc7bc" stroke-width="6" marker-end="url(#mk-teal)"/>
    <rect x="336" y="44" width="110" height="122" rx="18" fill="rgba(60,199,188,.1)" stroke="#3cc7bc" stroke-width="3"/>${grid(2, 3, 372, 76, 38, 36).map(([x, y]) => person(x, y, TEAL, 0.95)).join('')}</svg>`
  const m2 = `<svg width="460" height="210" viewBox="0 0 460 210">${grid(19, 6, 22, 30, 23, 31).map(([x, y]) => person(x, y, GRAY, 0.66)).join('')}</svg>`
  const m3 = `<svg width="460" height="210" viewBox="0 0 460 210"><rect x="16" y="38" width="196" height="62" rx="31" fill="rgba(141,141,240,.25)" stroke="#8d8df0" stroke-width="3"/><text x="114" y="80" text-anchor="middle" font-size="30" font-weight="900">Question</text>
    <line x1="222" y1="69" x2="262" y2="69" stroke="#a3abbd" stroke-width="6" marker-end="url(#mk-muted)"/>
    <rect x="278" y="38" width="166" height="62" rx="31" fill="rgba(36,40,56,.9)" stroke="#363c54" stroke-width="3"/><text x="361" y="80" text-anchor="middle" font-size="30" font-weight="900">Analysis</text>
    <text x="114" y="26" text-anchor="middle" font-size="24" font-weight="900" class="f-pri">first</text>
    <text x="230" y="166" text-anchor="middle" font-size="34" font-weight="900" class="f-teal">who + what</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div>${m1}<p>A <span class="teal">sample</span> (size n)<br>answers a question<br>about a <span class="pri">population</span><br>(size N)</p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div>${m2}<p>A study is needed when<br>the population is<br><span class="pri">too big</span> or <span class="warm">too hard</span><br>to reach fully</p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div>${m3}<p>Set the <span class="pri">question</span><br>before the analysis.<br>Answer <span class="teal">in context</span>.</p></div>`,
  })
})()
