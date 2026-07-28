export function Tile({ letter = '', state = 'empty', reveal }) {
  return (
    <div className={`tile tile-${state} ${letter ? 'tile-filled' : ''} ${reveal ? 'tile-reveal' : ''}`}>
      <span>{letter}</span>
    </div>
  )
}
