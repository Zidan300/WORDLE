import { Badge } from '../UI/Badge'
import { Button } from '../UI/Button'
import { Modal } from './Modal'

export function GameOverModal({ attempts, isOpen, onClose, onNewGame, onStats, solutionWord, stats, status }) {
  const won = status === 'won'
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={won ? 'You solved it' : 'Round complete'}>
      <div className="game-over-modal">
        <Badge tone={won ? 'success' : 'muted'}>{won ? '✦ Puzzle complete' : 'Tomorrow is another word'}</Badge>
        <h2>{won ? 'A brilliant solve.' : 'So close.'}</h2>
        <p>{won ? `You found it in ${attempts} ${attempts === 1 ? 'try' : 'tries'}.` : 'The hidden word was'}</p>
        <div className="answer-word">{solutionWord}</div>
        <div className="round-summary">
          <div><strong>{stats.currentStreak}</strong><span>streak</span></div>
          <div><strong>{stats.bestStreak}</strong><span>best</span></div>
          <div><strong>{attempts}/6</strong><span>attempts</span></div>
        </div>
        <div className="modal-actions">
          <Button onClick={onNewGame}>Play again <span>→</span></Button>
          <Button variant="secondary" onClick={onStats}>View statistics</Button>
        </div>
      </div>
    </Modal>
  )
}
