import { WORD_LENGTH } from '../../constants/config'
import { Tile } from './Tile'

export function Row({ guess, isShake }) {
  const letters = guess?.word?.split('') ?? []
  return (
    <div className={`board-row ${isShake ? 'row-shake' : ''}`}>
      {Array.from({ length: WORD_LENGTH }, (_, index) => (
        <Tile
          key={index}
          letter={letters[index]}
          state={guess?.evaluation?.[index] ?? 'empty'}
          reveal={Boolean(guess)}
        />
      ))}
    </div>
  )
}
