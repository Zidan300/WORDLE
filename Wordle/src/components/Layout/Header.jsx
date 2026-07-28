import { Button } from '../UI/Button'

function IconButton({ label, children, onClick }) {
  return <button className="icon-button" type="button" aria-label={label} title={label} onClick={onClick}>{children}</button>
}

const MODE_LABELS = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }

export function Header({ gameMode, hintsRemaining, onHint, onHelp, onNewGame, onSettings, onStats, onSoundToggle, soundEnabled }) {
  return (
    <header className="header">
      <div className="watermark" aria-label="Created by Zidan Thapaliya">
        <span aria-hidden="true">✦</span> Created by Zidan Thapaliya
      </div>
      <div className="header-center">
        <span className="mode-badge">{MODE_LABELS[gameMode] || 'Medium'}</span>
        <button className="hint-button" type="button" onClick={onHint} disabled={hintsRemaining <= 0} aria-label={`Use hint. ${hintsRemaining} remaining`}>
          <span className="hint-icon">💡</span> Hint <span className="hint-count" key={hintsRemaining}>{hintsRemaining}</span>
        </button>
      </div>
      <nav className="header-actions" aria-label="Game tools">
        <Button className="new-game" variant="quiet" onClick={onNewGame}><span>＋</span> New</Button>
        <IconButton label="Statistics" onClick={onStats}>▥</IconButton>
        <IconButton label="How to play" onClick={onHelp}>?</IconButton>
        <IconButton label="Settings" onClick={onSettings}>⚙</IconButton>
        <IconButton label={soundEnabled ? 'Mute sound' : 'Enable sound'} onClick={onSoundToggle}>{soundEnabled ? '◖' : '◌'}</IconButton>
      </nav>
    </header>
  )
}
