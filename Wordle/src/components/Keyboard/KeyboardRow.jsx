import { KeyButton } from './KeyButton'

export function KeyboardRow({ keys, keyStates, onKey, disabled }) {
  return (
    <div className="keyboard-row">
      {keys.map((key) => (
        <KeyButton key={key} label={key} state={keyStates[key]} onClick={onKey} disabled={disabled} />
      ))}
    </div>
  )
}
