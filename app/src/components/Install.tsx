import { useState } from 'react'
import { promptInstall, setDismissed, useInstall } from '../lib/install'

/** Home-screen card: add the app to the phone's home screen. Hidden once installed or dismissed. */
export function InstallCard() {
  const { kind, dismissed } = useInstall()
  const [steps, setSteps] = useState(false)
  const [done, setDone] = useState(false)
  if (kind === 'installed' || dismissed) return null

  async function add() {
    if (kind === 'prompt') {
      if (await promptInstall()) setDone(true)
    } else setSteps(true)
  }

  return (
    <div className="card install">
      <div className="row" style={{ alignItems: 'center' }}>
        <img src="/pwa-192.png" alt="" width={44} height={44} className="install-icon" />
        <div className="grow">
          <b>Add AP Learning to your Home screen</b>
          <div className="small muted">Opens like an app, full screen, and works offline.</div>
        </div>
      </div>
      {done ? (
        <p className="small" style={{ margin: '10px 0 0' }}>🎉 Added! Look for the AP Learning icon on your Home screen.</p>
      ) : steps ? (
        <ol className="install-steps small">
          {kind === 'ios' && (
            <>
              <li>
                Tap the <b>Share</b> button <svg className="ios-share" viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                  <path d="M12 3v12M8 7l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 10H5v11h14V10h-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg> at the bottom (or top) of Safari.
              </li>
              <li>
                Scroll down and tap <b>Add to Home Screen</b>.
              </li>
              <li>
                Tap <b>Add</b>.
              </li>
            </>
          )}
          {kind === 'ios-other' && (
            <>
              <li>
                Tap your browser's <b>Share</b> button. If you don't see <b>Add to Home Screen</b>, open this page in <b>Safari</b>.
              </li>
              <li>
                Tap <b>Add to Home Screen</b>, then <b>Add</b>.
              </li>
            </>
          )}
          {kind === 'manual' && (
            <>
              <li>
                Open your browser's menu (<b>⋮</b> or <b>☰</b>).
              </li>
              <li>
                Choose <b>Add to Home screen</b> or <b>Install app</b>.
              </li>
            </>
          )}
        </ol>
      ) : null}
      {!done && (
        <div className="row" style={{ marginTop: 10 }}>
          {!steps && (
            <button className="btn grow" onClick={add}>
              📲 Add to Home screen
            </button>
          )}
          <button className={`btn ghost ${steps ? 'grow' : ''}`} onClick={() => setDismissed(true)}>
            {steps ? 'Done' : 'Not now'}
          </button>
        </div>
      )}
    </div>
  )
}
