// The study-buddy bear. Four looks, three moods, all plain SVG (no images to load).

export type MascotLook = 'bunsen' | 'polly' | 'mochi' | 'honey'
export type MascotMood = 'happy' | 'cheer' | 'encourage'

export const MASCOTS: { id: MascotLook; name: string; blurb: string }[] = [
  { id: 'bunsen', name: 'Bunsen', blurb: 'A cocoa-brown cub with lab goggles, always ready to experiment.' },
  { id: 'polly', name: 'Polly', blurb: 'A polar bear cub (yes, polar like water molecules) in a cozy scarf.' },
  { id: 'mochi', name: 'Mochi', blurb: 'A panda cub with a molecule hair clip. Calm, kind, never in a hurry.' },
  { id: 'honey', name: 'Honey', blurb: 'A golden cub in a graduation cap: where all this practice leads.' },
]

/** The bear new users see (and the landing page uses). */
export const DEFAULT_MASCOT: MascotLook = 'bunsen'

interface Palette {
  fur: string
  line: string
  ear: string
  muzzle: string
  nose: string
  belly: string
  limbs: string
  cheek: string
}

const PALETTES: Record<MascotLook, Palette> = {
  bunsen: { fur: '#b9773f', line: '#6b3f1d', ear: '#f0b98a', muzzle: '#f6dcb6', nose: '#3b2314', belly: '#f6dcb6', limbs: '#b9773f', cheek: '#ff8f8f' },
  polly: { fur: '#f7f9fd', line: '#93a0b8', ear: '#f7c3d0', muzzle: '#ffffff', nose: '#2c3242', belly: '#e7edf6', limbs: '#f7f9fd', cheek: '#ff9fb4' },
  mochi: { fur: '#fbfbfd', line: '#2a2b33', ear: '#2a2b33', muzzle: '#ffffff', nose: '#2a2b33', belly: '#fbfbfd', limbs: '#2a2b33', cheek: '#ff9fb4' },
  honey: { fur: '#e9a84a', line: '#8a5a1c', ear: '#f8d49e', muzzle: '#fce5bf', nose: '#3a2410', belly: '#fce5bf', limbs: '#e9a84a', cheek: '#ff8f7a' },
}

export function Mascot({
  look = DEFAULT_MASCOT,
  mood = 'happy',
  size = 120,
  animate = true,
  title,
}: {
  look?: MascotLook
  mood?: MascotMood
  size?: number
  animate?: boolean
  title?: string
}) {
  const p = PALETTES[look]
  const panda = look === 'mochi'
  const eyesClosed = mood === 'cheer'
  const sw = 4

  const restingPaw = (cx: number) => <circle cx={cx} cy={186} r={15} fill={p.limbs} stroke={p.line} strokeWidth={sw} />
  const raisedArm = (side: 1 | -1, cls?: string) => {
    const sx = 100 + side * 36
    const px = 100 + side * 76
    return (
      <g className={cls}>
        <path d={`M${sx} 176 L${px} 124`} stroke={p.line} strokeWidth={30} strokeLinecap="round" />
        <path d={`M${sx} 176 L${px} 124`} stroke={p.limbs} strokeWidth={22} strokeLinecap="round" />
        <circle cx={px} cy={122} r={9} fill={panda ? '#3a3b45' : p.ear} opacity={panda ? 1 : 0.9} />
      </g>
    )
  }

  return (
    <svg
      viewBox="0 0 200 210"
      width={size}
      height={(size * 210) / 200}
      className={`mascot ${animate ? 'animated' : ''} mood-${mood}`}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <g className="m-body">
        {/* body */}
        <ellipse cx={100} cy={204} rx={58} ry={46} fill={panda ? p.limbs : p.fur} stroke={p.line} strokeWidth={sw} />
        <ellipse cx={100} cy={208} rx={34} ry={30} fill={p.belly} />
        {look === 'bunsen' && (
          <g>
            <path d="M94 180 h12 v9 l10 17 q2 4 -3 4 h-26 q-5 0 -3 -4 l10 -17z" fill="#ffffff" stroke={p.line} strokeWidth={2.5} />
            <path d="M88 200 h24 l3 6 q1 3 -3 3 h-24 q-4 0 -3 -3z" fill="#3cc7bc" />
          </g>
        )}

        {/* arms */}
        {mood === 'happy' && (
          <>
            {restingPaw(56)}
            {restingPaw(144)}
          </>
        )}
        {mood === 'cheer' && (
          <>
            {raisedArm(-1)}
            {raisedArm(1)}
          </>
        )}
        {mood === 'encourage' && (
          <>
            {restingPaw(56)}
            {raisedArm(1, 'm-wave')}
          </>
        )}

        {/* ears */}
        {[52, 148].map((x) => (
          <g key={x}>
            <circle cx={x} cy={46} r={26} fill={panda ? p.ear : p.fur} stroke={p.line} strokeWidth={sw} />
            {!panda && <circle cx={x} cy={46} r={14} fill={p.ear} />}
          </g>
        ))}

        {/* head */}
        <ellipse cx={100} cy={98} rx={72} ry={64} fill={p.fur} stroke={p.line} strokeWidth={sw} />

        {/* panda eye patches */}
        {panda && (
          <>
            <ellipse cx={70} cy={98} rx={15} ry={20} transform="rotate(30 70 98)" fill={p.ear} />
            <ellipse cx={130} cy={98} rx={15} ry={20} transform="rotate(-30 130 98)" fill={p.ear} />
          </>
        )}

        {/* eyes */}
        {eyesClosed ? (
          <g fill="none" stroke={panda ? '#ffffff' : p.nose} strokeWidth={4.5} strokeLinecap="round">
            <path d="M63 100 Q72 89 81 100" />
            <path d="M119 100 Q128 89 137 100" />
          </g>
        ) : (
          <g className="m-eyes">
            {[72, 128].map((x) => (
              <g key={x}>
                {panda && <circle cx={x} cy={97} r={8} fill="#ffffff" />}
                <circle cx={x} cy={97} r={panda ? 5 : 8.5} fill={p.nose} />
                <circle cx={x + 3} cy={94} r={panda ? 1.8 : 3} fill="#ffffff" />
              </g>
            ))}
          </g>
        )}
        {mood === 'encourage' && !panda && (
          <g fill="none" stroke={p.line} strokeWidth={3} strokeLinecap="round" opacity={0.8}>
            <path d="M62 80 Q70 75 79 78" />
            <path d="M121 78 Q130 75 138 80" />
          </g>
        )}

        {/* cheeks */}
        <ellipse cx={52} cy={118} rx={11} ry={7} fill={p.cheek} opacity={0.5} />
        <ellipse cx={148} cy={118} rx={11} ry={7} fill={p.cheek} opacity={0.5} />

        {/* muzzle, nose, mouth */}
        <ellipse cx={100} cy={124} rx={30} ry={22} fill={p.muzzle} stroke={look === 'polly' || panda ? p.line : 'none'} strokeOpacity={0.25} strokeWidth={2} />
        <path d="M90 113 Q100 107 110 113 Q107 122 100 123 Q93 122 90 113Z" fill={p.nose} />
        <ellipse cx={97} cy={112} rx={3.5} ry={2} fill="#ffffff" opacity={0.55} />
        {mood === 'cheer' ? (
          <g>
            <path d="M100 123 L100 128" stroke={p.nose} strokeWidth={3.5} strokeLinecap="round" />
            <path d="M87 129 Q100 148 113 129 Z" fill="#7a2e2e" stroke={p.nose} strokeWidth={3} strokeLinejoin="round" />
            <ellipse cx={100} cy={138} rx={6} ry={4} fill="#ff8fa0" />
          </g>
        ) : (
          <g fill="none" stroke={p.nose} strokeWidth={3.5} strokeLinecap="round">
            <path d="M100 123 L100 129" />
            <path d="M88 129 Q94 136 100 129 Q106 136 112 129" />
          </g>
        )}

        {/* accessories */}
        {look === 'bunsen' && (
          <g>
            <path d="M31 84 Q100 30 169 84" fill="none" stroke="#3d4a5c" strokeWidth={7} strokeLinecap="round" />
            <path d="M96 60 h8" stroke="#3d4a5c" strokeWidth={6} />
            {[80, 120].map((x) => (
              <g key={x}>
                <circle cx={x} cy={60} r={16} fill="#a8e1f5" stroke="#3d4a5c" strokeWidth={5} />
                <path d={`M${x - 8} ${56} q4 -6 10 -6`} stroke="#ffffff" strokeWidth={3} fill="none" strokeLinecap="round" />
              </g>
            ))}
          </g>
        )}
        {look === 'polly' && (
          <g>
            <path d="M42 150 Q100 178 158 150 L160 166 Q100 194 40 166Z" fill="#4f8cf0" stroke="#2f63c0" strokeWidth={3} strokeLinejoin="round" />
            <path d="M126 168 L136 202 L122 204 L116 172Z" fill="#4f8cf0" stroke="#2f63c0" strokeWidth={3} strokeLinejoin="round" />
            <path d="M60 162 Q100 180 140 162" stroke="#ffffff" strokeWidth={3} fill="none" strokeDasharray="6 6" opacity={0.8} />
          </g>
        )}
        {look === 'mochi' && (
          <g>
            <path d="M136 26 L160 14" stroke="#9aa3b5" strokeWidth={4} />
            <circle cx={134} cy={27} r={8} fill="#ef6b6b" stroke="#2a2b33" strokeWidth={2.5} />
            <circle cx={162} cy={13} r={6} fill="#ffffff" stroke="#2a2b33" strokeWidth={2.5} />
            <path d="M112 30 L134 27" stroke="#9aa3b5" strokeWidth={4} />
            <circle cx={110} cy={31} r={6} fill="#ffffff" stroke="#2a2b33" strokeWidth={2.5} />
          </g>
        )}
        {look === 'honey' && (
          <g>
            <path d="M68 44 L68 60 Q100 72 132 60 L132 44Z" fill="#26283a" />
            <path d="M100 12 L164 34 L100 56 L36 34Z" fill="#33364d" stroke="#1b1c28" strokeWidth={3} strokeLinejoin="round" />
            <circle cx={100} cy={34} r={4} fill="#f2c443" />
            <path d="M100 34 L150 44 L152 66" fill="none" stroke="#f2c443" strokeWidth={3} strokeLinecap="round" />
            <path d="M148 64 h8 l2 12 h-12z" fill="#f2c443" />
          </g>
        )}
      </g>

      {mood === 'encourage' && (
        <path
          className="m-heart"
          d="M182 82 c-4 -8 -16 -6 -15 3 c1 7 15 14 15 14 s14 -7 15 -14 c1 -9 -11 -11 -15 -3z"
          fill="#ff6b8a"
        />
      )}
      {mood === 'cheer' && (
        <g className="m-sparkles" fill="#f2c443">
          <path d="M14 70 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" />
          <path d="M186 64 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" />
          <path d="M100 2 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" />
        </g>
      )}
    </svg>
  )
}
