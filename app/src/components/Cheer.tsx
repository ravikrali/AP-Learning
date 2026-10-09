import { useState, type ReactNode } from 'react'
import { useApp } from '../lib/app'
import { CHEERS, pick, tierFor } from '../lib/cheer'
import { getSetting } from '../lib/progress'
import { DEFAULT_MASCOT, Mascot, type MascotLook, type MascotMood } from './Mascot'
import { Confetti } from './bits'

export function useMascotLook(): MascotLook {
  const { db } = useApp()
  return getSetting(db, 'mascot', DEFAULT_MASCOT) as MascotLook
}

/**
 * The end-of-activity moment: the bear plus one short message matched to how it went.
 * With no score (e.g. a review session) pass `message` and it simply celebrates.
 */
export function Cheer({
  score,
  total,
  message,
  headline,
  children,
}: {
  score?: number
  total?: number
  message?: string
  headline?: ReactNode
  children?: ReactNode
}) {
  const look = useMascotLook()
  const scored = score !== undefined && total !== undefined && total > 0
  const tier = scored ? tierFor(score, total) : 'great'
  const [text] = useState(() => message ?? pick(CHEERS[tier]))
  const mood: MascotMood = tier === 'great' ? 'cheer' : tier === 'good' ? 'happy' : 'encourage'
  return (
    <div className="cheer">
      {(tier === 'great' || tier === 'good') && <Confetti />}
      <Mascot look={look} mood={mood} size={128} />
      <div className="bubble">{text}</div>
      {headline && <div className="score">{headline}</div>}
      {children}
    </div>
  )
}
