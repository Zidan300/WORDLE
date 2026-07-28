import { KEYBOARD_ROWS } from '../../constants/keyboard'
import { KeyboardRow } from './KeyboardRow'

export function Keyboard({ keyStates, onKey, disabled }) {
  return (
    <div className="keyboard" aria-label="On-screen keyboard">
      {KEYBOARD_ROWS.map((keys) => (
        <KeyboardRow key={keys[0]} keys={keys} keyStates={keyStates} onKey={onKey} disabled={disabled} />
      ))}
    </div>
  )
}
