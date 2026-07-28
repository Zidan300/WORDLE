const symbols = {
  ENTER: '↵',
  BACKSPACE: '⌫',
}

export function KeyButton({ label, state, onClick, disabled }) {
  const isAction = label === 'ENTER' || label === 'BACKSPACE'
  const accessibleName = label === 'BACKSPACE' ? 'Delete letter' : label === 'ENTER' ? 'Submit guess' : label
  return (
    <button
      className={`key-button ${isAction ? 'key-action' : ''} key-${state ?? 'empty'}`}
      type="button"
      onClick={() => onClick(label)}
      disabled={disabled}
      aria-label={accessibleName}
    >
      {symbols[label] ?? label}
    </button>
  )
}
