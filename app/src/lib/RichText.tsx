import { Fragment, type ReactNode } from 'react'

/** Format a chemical formula/equation string: H2SO4 -> H₂SO₄, Fe^3+ -> Fe³⁺, -> becomes an arrow. */
export function formatChem(src: string, keyBase = 'c'): ReactNode[] {
  const s = src.replace(/<=>/g, '⇌').replace(/->/g, '→')
  const out: ReactNode[] = []
  let buf = ''
  let k = 0
  const flush = () => {
    if (buf) out.push(buf)
    buf = ''
  }
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    const prev = i > 0 ? s[i - 1] : ''
    if (/\d/.test(ch) && /[A-Za-z)\]]/.test(prev)) {
      // subscript: digit right after an element symbol or closing bracket
      let d = ''
      while (i < s.length && /\d/.test(s[i])) d += s[i++]
      i--
      flush()
      out.push(<sub key={`${keyBase}${k++}`}>{d}</sub>)
    } else if (ch === '^') {
      let sup = ''
      if (s[i + 1] === '{') {
        const end = s.indexOf('}', i)
        sup = s.slice(i + 2, end)
        i = end
      } else {
        let j = i + 1
        while (j < s.length && /\d/.test(s[j])) sup += s[j++]
        if (s[j] === '+' || s[j] === '-') sup += s[j++]
        i = j - 1
      }
      flush()
      out.push(<sup key={`${keyBase}${k++}`}>{sup.replace('-', '−')}</sup>)
    } else {
      buf += ch
    }
  }
  flush()
  return out
}

const INLINE = /(\[\[eq:[^\]]+\]\]|\{\{[^}]+\}\}|\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\^\{[^}]*\}|_\{[^}]*\})/g

export function renderInline(text: string, keyBase = 'i'): ReactNode[] {
  const parts = text.split(INLINE)
  return parts.map((p, idx) => {
    const key = `${keyBase}-${idx}`
    if (!p) return null
    if (p.startsWith('[[eq:')) {
      return (
        <span key={key} className="eq">
          {formatChem(p.slice(5, -2).trim(), key)}
        </span>
      )
    }
    if (p.startsWith('{{')) return <span key={key} className="chem">{formatChem(p.slice(2, -2), key)}</span>
    if (p.startsWith('**')) return <strong key={key}>{renderInline(p.slice(2, -2), key)}</strong>
    if (p.startsWith('*') && p.endsWith('*') && p.length > 2) return <em key={key}>{renderInline(p.slice(1, -1), key)}</em>
    if (p.startsWith('^{')) return <sup key={key}>{p.slice(2, -1).replace(/-/g, '−')}</sup>
    if (p.startsWith('_{')) return <sub key={key}>{p.slice(2, -1)}</sub>
    return <Fragment key={key}>{p}</Fragment>
  })
}

/** Block-level renderer: paragraphs, bullet lists ("- "), numbered lists ("1. "), tables ("| a | b |"). */
export function RichText({ text, className }: { text: string; className?: string }) {
  const blocks = text.trim().split(/\n\s*\n/)
  return (
    <div className={className ? `rich ${className}` : 'rich'}>
      {blocks.map((block, bi) => {
        const lines = block.split('\n').map((l) => l.trim())
        if (lines.every((l) => l.startsWith('- '))) {
          return (
            <ul key={bi}>
              {lines.map((l, li) => (
                <li key={li}>{renderInline(l.slice(2), `${bi}-${li}`)}</li>
              ))}
            </ul>
          )
        }
        if (lines.every((l) => /^\d+\.\s/.test(l))) {
          return (
            <ol key={bi}>
              {lines.map((l, li) => (
                <li key={li}>{renderInline(l.replace(/^\d+\.\s/, ''), `${bi}-${li}`)}</li>
              ))}
            </ol>
          )
        }
        if (lines.every((l) => l.startsWith('|'))) {
          const rows = lines.map((l) => l.replace(/^\||\|$/g, '').split('|').map((c) => c.trim()))
          const [head, ...body] = rows
          return (
            <div className="table-wrap" key={bi}>
              <table>
                <thead>
                  <tr>{head.map((c, ci) => <th key={ci}>{renderInline(c, `${bi}-h${ci}`)}</th>)}</tr>
                </thead>
                <tbody>
                  {body.map((r, ri) => (
                    <tr key={ri}>{r.map((c, ci) => <td key={ci}>{renderInline(c, `${bi}-${ri}-${ci}`)}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
        return (
          <p key={bi}>
            {lines.map((l, li) => (
              <Fragment key={li}>
                {li > 0 && <br />}
                {renderInline(l, `${bi}-${li}`)}
              </Fragment>
            ))}
          </p>
        )
      })}
    </div>
  )
}
