import { TRADEMARK_NOTICE } from '../../shared/brand'

/** College Board's notice. Goes on every screen that talks about AP courses or exams in general. */
export function Trademark({ className = 'small muted', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <p className={`trademark ${className}`} style={{ margin: 0, ...style }}>
      {TRADEMARK_NOTICE}
    </p>
  )
}
