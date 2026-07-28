import { MAX_ATTEMPTS } from '../../constants/config'
import { Row } from './Row'

export function GameBoard({ currentGuess, pastGuesses, shakeRow }) {
  return (
    <div className="board-wrap">
      <div className="game-board" aria-label="Word guess board" role="grid">
        {Array.from({ length: MAX_ATTEMPTS }, (_, index) => (
          <Row
            key={index}
            guess={pastGuesses[index] ?? (index === pastGuesses.length ? { word: currentGuess } : null)}
            isCurrent={index === pastGuesses.length}
            isShake={shakeRow === index}
          />
        ))}
      </div>
    </div>
  )
}
