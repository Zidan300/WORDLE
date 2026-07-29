export function Tile({ letter = '', state = 'empty', reveal, isHint }) {
  return (
    <div className={`tile tile-${state} ${letter && letter !== ' ' ? 'tile-filled' : ''} ${reveal ? 'tile-reveal' : ''}`}>
      <span className={isHint ? 'hint-letter' : ''}>{letter}</span>
    </div>
  )
}
