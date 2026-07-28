import { MAX_ATTEMPTS } from '../../constants/config'
import { Row } from './Row'

export function GameBoard({ currentGuess, pastGuesses, shakeRow, hintIndices, solutionWord }) {
  return (
    <div className="board-wrap">
      <div className="game-board" aria-label="Word guess board" role="grid">
        {Array.from({ length: MAX_ATTEMPTS }, (_, index) => {
          const isCurrent = index === pastGuesses.length
          const guessData = pastGuesses[index] ?? (isCurrent ? { word: currentGuess } : null)
          return (
            <Row
              key={index}
              guess={guessData}
              isCurrent={isCurrent}
              isShake={shakeRow === index}
              hintIndices={isCurrent ? hintIndices : []}
              solutionWord={solutionWord}
            />
          )
        })}
      </div>
    </div>
  )
}
