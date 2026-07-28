import { Button } from '../UI/Button'

function IconButton({ label, children, onClick, active }) {
  return <button className={`icon-button ${active ? 'is-active' : ''}`} type="button" aria-label={label} title={label} onClick={onClick}>{children}</button>
}

export function Header({ onHelp, onNewGame, onSettings, onStats, onThemeToggle, onSoundToggle, soundEnabled, theme }) {
  return (
    <header className="header">
      <div className="brand" aria-label="Luma Word">
        <span className="brand-mark">L</span>
        <div><strong>Luma</strong><span>WORD</span></div>
      </div>
      <nav className="header-actions" aria-label="Game tools">
        <Button className="new-game" variant="quiet" onClick={onNewGame}><span>＋</span> New</Button>
        <IconButton label="Statistics" onClick={onStats}>▥</IconButton>
        <IconButton label="How to play" onClick={onHelp}>?</IconButton>
        <IconButton label="Settings" onClick={onSettings}>⚙</IconButton>
        <IconButton label={theme === 'dark' ? 'Use light theme' : 'Use dark theme'} onClick={onThemeToggle}>{theme === 'dark' ? '☼' : '☾'}</IconButton>
        <IconButton label={soundEnabled ? 'Mute sound' : 'Enable sound'} onClick={onSoundToggle} active={soundEnabled}>{soundEnabled ? '◖' : '◌'}</IconButton>
      </nav>
    </header>
  )
}
