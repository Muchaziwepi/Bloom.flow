'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ChevronDown,
  Clock3,
  Expand,
  ImagePlus,
  Leaf,
  LogIn,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  Sparkles,
  TimerReset,
  Upload,
  Volume2,
  X,
} from 'lucide-react'

const backgrounds = [
  {
    name: 'Aurora',
    value:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download%20%284%29-DukrAXNaxTYeO6vW2jx5omCaG4Ghhu.jpg',
  },
]

const themes = [
  { name: 'Neon', color: 'from-fuchsia-500 via-purple-500 to-indigo-500' },
  { name: 'Sunset', color: 'from-orange-400 via-rose-500 to-fuchsia-600' },
  { name: 'Ocean', color: 'from-cyan-400 via-blue-500 to-indigo-600' },
  { name: 'Lime', color: 'from-lime-300 via-emerald-400 to-teal-600' },
]

function formatTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':')
}

export default function Page() {
  const [mode, setMode] = useState<'focus' | 'clock'>('focus')
  const [isRunning, setIsRunning] = useState(false)
  const [duration, setDuration] = useState(90 * 60)
  const [remaining, setRemaining] = useState(90 * 60)
  const [background, setBackground] = useState(backgrounds[0].value)
  const [customBackground, setCustomBackground] = useState('')
  const [theme, setTheme] = useState(themes[0])
  const [showSettings, setShowSettings] = useState(false)
  const [clock, setClock] = useState(new Date())

  useEffect(() => {
    const interval = window.setInterval(() => setClock(new Date()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!isRunning || mode !== 'focus') return
    const interval = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          setIsRunning(false)
          return 0
        }
        return value - 1
      })
    }, 1000)
    return () => window.clearInterval(interval)
  }, [isRunning, mode])

  const progress = useMemo(() => ((duration - remaining) / duration) * 100, [duration, remaining])
  const activeBackground = customBackground || background

  function updateHours(value: string) {
    const hours = Math.max(0.25, Math.min(999, Number(value) || 0.25))
    const seconds = Math.round(hours * 3600)
    setDuration(seconds)
    setRemaining(seconds)
  }

  function uploadBackground(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) setCustomBackground(URL.createObjectURL(file))
  }

  function openMiniPlayer() {
    window.open(window.location.href, 'focusflow-mini', 'popup,width=420,height=320,resizable=yes')
  }

  return (
    <main className="focus-shell" data-theme={theme.name.toLowerCase()} style={{ backgroundImage: `url(${activeBackground})` }}>
      <div className="backdrop" />
      <header className="topbar">
        <div className="brand"><span className={`brand-mark bg-gradient-to-br ${theme.color}`}><Sparkles /></span><span>focus<span className="brand-dot">.</span>flow</span></div>
        <div className="top-actions">
          <span className="status-pill"><span className="status-dot" /> synced locally</span>
          <button className="icon-button" aria-label="Sign in" title="Sign in"><LogIn /><span className="desktop-only">Sign in</span></button>
          <button className="icon-button" aria-label="Open settings" onClick={() => setShowSettings(!showSettings)}><Settings2 /></button>
        </div>
      </header>

      <section className="workspace">
        <div className="eyebrow"><span className="eyebrow-line" /> YOUR CLEAR SPACE <span className="eyebrow-line" /></div>
        <div className="session-title"><Leaf /> <span>Deep work session</span><button aria-label="Edit session title">✎</button></div>

        <div className="mode-switcher" role="tablist" aria-label="Timer mode">
          <button className={mode === 'focus' ? 'active' : ''} onClick={() => setMode('focus')}><TimerReset /> Focus mode</button>
          <button className={mode === 'clock' ? 'active' : ''} onClick={() => setMode('clock')}><Clock3 /> Digital clock</button>
        </div>

        {mode === 'focus' ? (
          <div className="timer-stage">
            <div className="progress-ring" style={{ '--progress': `${progress * 3.6}deg` } as React.CSSProperties}>
              <div className="timer-copy"><span className="timer-label">REMAINING</span><strong>{formatTime(remaining)}</strong><span className="timer-subtitle">{isRunning ? 'stay with it' : remaining === duration ? 'ready when you are' : 'paused'}</span></div>
            </div>
            <div className="timer-controls">
              <button className="primary-action" onClick={() => setIsRunning(!isRunning)}>{isRunning ? <Pause /> : <Play />} {isRunning ? 'Pause focus' : 'Start focus'}</button>
              <button className="round-action" aria-label="Reset timer" onClick={() => { setRemaining(duration); setIsRunning(false) }}><RotateCcw /></button>
            </div>
          </div>
        ) : (
          <div className="clock-stage"><span className="timer-label">LOCAL TIME</span><strong>{clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</strong><span>{clock.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</span></div>
        )}

        <div className="quick-settings">
          <div className="setting-card"><span className="setting-icon"><Clock3 /></span><div><span className="card-label">SESSION LENGTH</span><label><input type="number" min="0.25" max="999" step="0.25" value={(duration / 3600).toString()} onChange={(event) => updateHours(event.target.value)} /> <span>hours</span></label></div><ChevronDown /></div>
          <div className="setting-card"><span className="setting-icon"><ImagePlus /></span><div><span className="card-label">SCENE</span><label>{customBackground ? 'Your uploaded image' : backgrounds.find((item) => item.value === background)?.name}</label></div><button className="mini-link" onClick={() => setShowSettings(true)}>Change</button></div>
        </div>
      </section>

      <footer className="bottombar"><div className="footer-actions"><button className="floating-control"><Volume2 /></button><button className="floating-control" onClick={openMiniPlayer}><Expand /></button></div><span>made for moments that matter</span><div className="footer-actions"><button className="floating-control" onClick={() => setShowSettings(true)}><Settings2 /></button></div></footer>

      {showSettings && <aside className="settings-panel"><div className="panel-heading"><div><span className="panel-kicker">PERSONALIZE</span><h2>Your atmosphere</h2></div><button className="close-button" onClick={() => setShowSettings(false)}><X /></button></div><div className="panel-section"><span className="panel-label">VIBRANT THEME</span><div className="theme-grid">{themes.map((item) => <button key={item.name} className={`theme-swatch bg-gradient-to-br ${item.color} ${theme.name === item.name ? 'selected' : ''}`} onClick={() => setTheme(item)} aria-label={`Use ${item.name} theme`}><span>{item.name}</span></button>)}</div></div><div className="panel-section"><span className="panel-label">BACKGROUND SCENE</span><div className="scene-list">{backgrounds.map((item) => <button key={item.name} className={background === item.value && !customBackground ? 'scene-option selected' : 'scene-option'} onClick={() => { setBackground(item.value); setCustomBackground('') }}><img src={item.value} alt="" /><span>{item.name}</span></button>)}</div><label className="upload-button"><Upload /> Upload your own image<input type="file" accept="image/*" onChange={uploadBackground} /></label></div><div className="panel-section popup-tip"><Expand /><div><strong>Keep it visible</strong><p>Open a compact timer window so your focus stays nearby while you work in another app.</p><button onClick={openMiniPlayer}>Open floating timer</button></div></div></aside>}
    </main>
  )
}
