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
          <div className="setting-select"><span><b>Appearance</b><small>Choose your preferred atmosphere.</small></span><select value={settings.theme} onChange={(event) => onChange({ theme: event.target.value })}><option value="dark">Dark</option><option value="light">Light</option></select></div>
          <div className="setting-select"><span><b>Animation speed</b><small>Controls the pace of tile reveals.</small></span><select value={settings.animationSpeed} onChange={(event) => onChange({ animationSpeed: event.target.value })}><option value="relaxed">Relaxed</option><option value="standard">Standard</option><option value="swift">Swift</option></select></div>
          <Toggle label="Sound" description="Gentle interaction feedback." checked={settings.soundEnabled} onChange={(soundEnabled) => onChange({ soundEnabled })} />
          <Toggle label="High contrast" description="Increase visual separation." checked={settings.highContrast} onChange={(highContrast) => onChange({ highContrast })} />
          <Toggle label="Reduce motion" description="Minimize decorative movement." checked={settings.reduceMotion} onChange={(reduceMotion) => onChange({ reduceMotion })} />
        </div>
      </div>
    </Modal>
  )
}
