import { WORD_LENGTH } from '../../constants/config'
import { Tile } from './Tile'

export function Row({ guess, isShake, hintIndices = [] }) {
  const letters = guess?.word?.split('') ?? []
  const isInvalid = guess?.invalid
  return (
    <div className={`board-row ${isShake ? 'row-shake' : ''} ${isInvalid ? 'row-invalid' : ''}`}>
      {Array.from({ length: WORD_LENGTH }, (_, index) => {
        const isHinted = hintIndices.includes(index)
        return (
          <Tile
            key={index}
            letter={letters[index]}
            state={isInvalid ? 'invalid' : (isHinted ? 'hint' : (guess?.evaluation?.[index] ?? 'empty'))}
            reveal={Boolean(guess) && !isHinted && !isInvalid}
            isHint={isHinted}
          />
        )
      })}
    </div>
  )
}
