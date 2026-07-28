import { WORD_LENGTH } from '../../constants/config'
import { Tile } from './Tile'

export function Row({ guess, isShake, hintIndices = [], solutionWord = '' }) {
  const letters = guess?.word?.split('') ?? []
  return (
    <div className={`board-row ${isShake ? 'row-shake' : ''}`}>
      {Array.from({ length: WORD_LENGTH }, (_, index) => {
        const isHinted = hintIndices.includes(index)
        const hintLetter = isHinted ? solutionWord[index] || letters[index] : undefined
        return (
          <Tile
            key={index}
            letter={isHinted ? hintLetter : letters[index]}
            state={isHinted ? 'hint' : (guess?.evaluation?.[index] ?? 'empty')}
            reveal={Boolean(guess) && !isHinted}
          />
        )
      })}
    </div>
  )
}
