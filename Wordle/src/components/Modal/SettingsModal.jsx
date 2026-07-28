import { Modal } from './Modal'

function Toggle({ checked, label, onChange, description }) {
  return <label className="setting-row"><span><b>{label}</b><small>{description}</small></span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><i /></label>
}

export function SettingsModal({ isOpen, onClose, onChange, settings }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="settings-modal">
        <span className="modal-kicker">PREFERENCES</span>
        <h2>Make it yours</h2>
        <div className="settings-group">
          <div className="setting-select"><span><b>Difficulty</b><small>Choose your challenge level.</small></span><select value={settings.gameMode} onChange={(event) => onChange({ gameMode: event.target.value })}><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div>
          <Toggle label="Sound" description="Gentle interaction feedback." checked={settings.soundEnabled} onChange={(soundEnabled) => onChange({ soundEnabled })} />
          <Toggle label="Reduce motion" description="Minimize decorative movement." checked={settings.reduceMotion} onChange={(reduceMotion) => onChange({ reduceMotion })} />
        </div>
      </div>
    </Modal>
  )
}
