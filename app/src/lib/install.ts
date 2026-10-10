// "Add to Home screen". Chrome/Edge/Android offer a real install prompt (beforeinstallprompt),
// which fires early, so it is caught at startup and kept for later. iPhone/iPad Safari has no
// prompt, so there we show the two taps it takes.

import { useSyncExternalStore } from 'react'

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export type InstallKind = 'prompt' | 'ios' | 'ios-other' | 'manual' | 'installed'

let deferred: InstallPromptEvent | null = null
let installed = false
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((fn) => fn())

const standalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true

/** Call once at startup, before the first render. */
export function listenForInstall() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault() // keep it for our own button instead of the browser's mini-bar
    deferred = e as InstallPromptEvent
    notify()
  })
  window.addEventListener('appinstalled', () => {
    installed = true
    deferred = null
    notify()
  })
}

function kind(): InstallKind {
  if (installed || standalone()) return 'installed'
  if (deferred) return 'prompt'
  const ua = navigator.userAgent
  const ios = /iPhone|iPad|iPod/.test(ua) || (ua.includes('Macintosh') && navigator.maxTouchPoints > 1)
  // on iOS only Safari (and, since iOS 16.4, some other browsers' Share menu) can add to Home Screen
  if (ios) return /CriOS|FxiOS|EdgiOS/.test(ua) ? 'ios-other' : 'ios'
  return 'manual'
}

const DISMISS_KEY = 'ap-learning-install-dismissed'
let version = 0
export function dismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}
export function setDismissed(v: boolean) {
  try {
    if (v) localStorage.setItem(DISMISS_KEY, '1')
    else localStorage.removeItem(DISMISS_KEY)
  } catch {
    /* private mode */
  }
  version++
  notify()
}

const subscribe = (fn: () => void) => {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

export function useInstall(): { kind: InstallKind; dismissed: boolean } {
  const k = useSyncExternalStore(subscribe, kind)
  useSyncExternalStore(subscribe, () => version)
  return { kind: k, dismissed: dismissed() }
}

/** Show the browser's install dialog (only when kind is "prompt"). */
export async function promptInstall(): Promise<boolean> {
  if (!deferred) return false
  const e = deferred
  await e.prompt()
  const { outcome } = await e.userChoice
  deferred = null
  if (outcome === 'accepted') installed = true
  notify()
  return outcome === 'accepted'
}
