import { WORD_LENGTH } from '../../constants/config'
import { Tile } from './Tile'

export function Row({ guess, isShake, hintIndices = [] }) {
  const letters = guess?.word?.split('') ?? []
  return (
    <div className={`board-row ${isShake ? 'row-shake' : ''}`}>
      {Array.from({ length: WORD_LENGTH }, (_, index) => {
        const isHinted = hintIndices.includes(index)
        return (
          <Tile
            key={index}
            letter={letters[index]}
            state={isHinted ? 'hint' : (guess?.evaluation?.[index] ?? 'empty')}
            reveal={Boolean(guess) && !isHinted}
            isHint={isHinted}
          />
        )
      })}
    </div>
  )
}
