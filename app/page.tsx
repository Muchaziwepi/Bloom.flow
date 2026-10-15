'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ChevronDown,
  Clock3,
  Check,
  Expand,
  FileText,
  Headphones,
  ListTodo,
  Maximize2,
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
  const [activeTool, setActiveTool] = useState<'none' | 'tasks' | 'notes' | 'music'>('none')
  const [tasks, setTasks] = useState<{ title: string; minutes: number; done: boolean }[]>([])
  const [taskTitle, setTaskTitle] = useState('')
  const [taskMinutes, setTaskMinutes] = useState('25')
  const [note, setNote] = useState('')
  const [language, setLanguage] = useState('English')
  const [music, setMusic] = useState('none')
  const [breakType, setBreakType] = useState<'short' | 'long'>('short')
  const [streak, setStreak] = useState(7)

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
    window.open(window.location.href, 'bloomflow-mini', 'popup,width=420,height=320,resizable=yes')
  }

  function addTask(event: React.FormEvent) {
    event.preventDefault()
    if (!taskTitle.trim()) return
    setTasks((items) => [...items, { title: taskTitle.trim(), minutes: Math.max(1, Number(taskMinutes) || 25), done: false }])
    setTaskTitle('')
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
    else document.exitFullscreen?.()
  }

  return (
    <main className="focus-shell" data-theme={theme.name.toLowerCase()} style={{ backgroundImage: `url(${activeBackground})` }}>
      <div className="backdrop" />
      <header className="topbar">
        <div className="brand"><span className={`brand-mark bg-gradient-to-br ${theme.color}`}><Sparkles /></span><span>bloom<span className="brand-dot">.</span>flow</span></div>
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

        <div className="streak-card"><div className="streak-flame">✦</div><div><strong>{streak} day streak</strong><span>Keep your bloom going</span></div><button onClick={() => setStreak((value) => value + 1)} aria-label="Log today's focus">Log today</button></div>
        <div className="tool-dock"><button className={activeTool === 'tasks' ? 'active' : ''} onClick={() => setActiveTool(activeTool === 'tasks' ? 'none' : 'tasks')}><ListTodo /> Tasks <span>{tasks.filter((task) => !task.done).length}</span></button><button className={activeTool === 'notes' ? 'active' : ''} onClick={() => setActiveTool(activeTool === 'notes' ? 'none' : 'notes')}><FileText /> Notes</button><button className={activeTool === 'music' ? 'active' : ''} onClick={() => setActiveTool(activeTool === 'music' ? 'none' : 'music')}><Headphones /> Music</button></div>
        {activeTool === 'tasks' && <div className="tool-panel"><div className="tool-heading"><div><span className="panel-kicker">YOUR FLOW</span><h3>Today&apos;s tasks</h3></div><span className="tool-count">{tasks.filter((task) => task.done).length}/{tasks.length}</span></div><form className="task-form" onSubmit={addTask}><input value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} placeholder="Add a task..." aria-label="Task name" /><input value={taskMinutes} onChange={(event) => setTaskMinutes(event.target.value)} type="number" min="1" max="999" aria-label="Task minutes" /><button type="submit" aria-label="Add task"><Check /></button></form><div className="task-list">{tasks.length === 0 ? <span className="empty-tool">Your next win belongs here.</span> : tasks.map((task, index) => <label className={task.done ? 'task-row done' : 'task-row'} key={`${task.title}-${index}`}><input type="checkbox" checked={task.done} onChange={() => setTasks((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, done: !item.done } : item))} /><span>{task.title}</span><small>{task.minutes}m</small></label>)}</div></div>}
        {activeTool === 'notes' && <div className="tool-panel notes-panel"><div className="tool-heading"><div><span className="panel-kicker">QUIET THOUGHTS</span><h3>Little notepad</h3></div><FileText /></div><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Capture a thought, intention, or idea..." aria-label="Notes" /></div>}
        {activeTool === 'music' && <div className="tool-panel"><div className="tool-heading"><div><span className="panel-kicker">SET THE TONE</span><h3>Soundtrack</h3></div><Headphones /></div><div className="music-options"><button className={music === 'spotify' ? 'selected' : ''} onClick={() => setMusic('spotify')}>Spotify <small>{music === 'spotify' ? 'Connected' : 'Open'}</small></button><button className={music === 'apple' ? 'selected' : ''} onClick={() => setMusic('apple')}>Apple Music <small>{music === 'apple' ? 'Connected' : 'Open'}</small></button><button className={music === 'ambient' ? 'selected' : ''} onClick={() => setMusic('ambient')}>Ambient sounds <small>{music === 'ambient' ? 'Playing' : 'Play'}</small></button></div></div>}
        <div className="break-row"><span>Need a reset?</span><button className={breakType === 'short' ? 'active' : ''} onClick={() => { setBreakType('short'); updateHours('0.08') }}>Short break · 5m</button><button className={breakType === 'long' ? 'active' : ''} onClick={() => { setBreakType('long'); updateHours('0.25') }}>Long break · 15m</button></div>
        <div className="quick-settings">
          <div className="setting-card"><span className="setting-icon"><Clock3 /></span><div><span className="card-label">SESSION LENGTH</span><label><input type="number" min="0.25" max="999" step="0.25" value={(duration / 3600).toString()} onChange={(event) => updateHours(event.target.value)} /> <span>hours</span></label></div><ChevronDown /></div>
          <div className="setting-card"><span className="setting-icon"><ImagePlus /></span><div><span className="card-label">SCENE</span><label>{customBackground ? 'Your uploaded image' : backgrounds.find((item) => item.value === background)?.name}</label></div><button className="mini-link" onClick={() => setShowSettings(true)}>Change</button></div>
        </div>
      </section>

      <footer className="bottombar"><div className="footer-actions"><button className="floating-control"><Volume2 /></button><button className="floating-control" onClick={toggleFullscreen} aria-label="Full screen"><Maximize2 /></button><button className="floating-control" onClick={openMiniPlayer} aria-label="Open floating timer"><Expand /></button></div><span>made for moments that matter</span><div className="footer-actions"><button className="floating-control" onClick={() => setShowSettings(true)}><Settings2 /></button></div></footer>

      {showSettings && <aside className="settings-panel"><div className="panel-heading"><div><span className="panel-kicker">PERSONALIZE</span><h2>Your atmosphere</h2></div><button className="close-button" onClick={() => setShowSettings(false)}><X /></button></div><div className="panel-section"><span className="panel-label">VIBRANT THEME</span><div className="theme-grid">{themes.map((item) => <button key={item.name} className={`theme-swatch bg-gradient-to-br ${item.color} ${theme.name === item.name ? 'selected' : ''}`} onClick={() => setTheme(item)} aria-label={`Use ${item.name} theme`}><span>{item.name}</span></button>)}</div></div><div className="panel-section"><span className="panel-label">BACKGROUND SCENE</span><div className="scene-list">{backgrounds.map((item) => <button key={item.name} className={background === item.value && !customBackground ? 'scene-option selected' : 'scene-option'} onClick={() => { setBackground(item.value); setCustomBackground('') }}><img src={item.value} alt="" /><span>{item.name}</span></button>)}</div><label className="upload-button"><Upload /> Upload your own image<input type="file" accept="image/*" onChange={uploadBackground} /></label></div><div className="panel-section language-section"><span className="panel-label">LANGUAGE</span><select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label="Language"><option>English</option><option>Spanish</option><option>French</option><option>Japanese</option><option>German</option><option>Portuguese</option><option>Italian</option><option>Korean</option></select></div><div className="panel-section popup-tip"><Maximize2 /><div><strong>Full screen focus</strong><p>Remove distractions and let bloom.flow fill your screen.</p><button onClick={toggleFullscreen}>Enter full screen</button></div></div><div className="panel-section popup-tip"><Expand /><div><strong>Keep it visible</strong><p>Open a compact timer window so your focus stays nearby while you work in another app.</p><button onClick={openMiniPlayer}>Open floating timer</button></div></div></aside>}
    </main>
  )
}
