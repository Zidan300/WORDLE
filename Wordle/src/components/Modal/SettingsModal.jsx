import { Modal } from './Modal'

function Toggle({ checked, label, onChange, description }) {
  return <label className="setting-row"><span><b>{label}</b><small>{description}</small></span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><i /></label>
}

const MODES = [
  { id: 'easy', icon: '🌱', color: '#4caf50' },
  { id: 'medium', icon: '⭐', color: '#ff9800' },
  { id: 'hard', icon: '🔥', color: '#ed0a3f' },
]

export function SettingsModal({ isOpen, onClose, onChange, settings }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="settings-modal">
        <span className="modal-kicker">PREFERENCES</span>
        <h2>Make it yours</h2>
        <div className="settings-group">
          <div className="setting-select"><span><b>Difficulty</b><small>Choose your challenge level.</small></span>
            <div className="setting-modes">
              {MODES.map((mode) => (
                <button
                  key={mode.id}
                  className={`setting-mode-btn ${settings.gameMode === mode.id ? 'is-active' : ''}`}
                  onClick={() => onChange({ gameMode: mode.id })}
                  style={settings.gameMode === mode.id ? { borderColor: mode.color, borderBottomColor: mode.color } : {}}
                >
                  <span className="mode-indicator">{mode.icon}</span>
                  <span className="mode-label">{mode.id === 'easy' ? 'Easy' : mode.id === 'medium' ? 'Medium' : 'Hard'}</span>
                </button>
              ))}
            </div>
          </div>
          <Toggle label="Sound" description="Gentle interaction feedback." checked={settings.soundEnabled} onChange={(soundEnabled) => onChange({ soundEnabled })} />
          <Toggle label="Reduce motion" description="Minimize decorative movement." checked={settings.reduceMotion} onChange={(reduceMotion) => onChange({ reduceMotion })} />
        </div>
      </div>
    </Modal>
  )
}
