import { Modal } from './Modal'

function Stat({ value, label }) {
  return <div className="stat"><strong>{value}</strong><span>{label}</span></div>
}

export function StatsModal({ isOpen, onClose, stats }) {
  const winRate = stats.gamesPlayed ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0
  const peak = Math.max(...stats.distribution, 1)
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Your statistics">
      <div className="stats-modal">
        <span className="modal-kicker">YOUR PROGRESS</span>
        <h2>By the numbers</h2>
        <p className="modal-description">A small record of your word-finding rituals.</p>
        <div className="stats-grid">
          <Stat value={stats.gamesPlayed} label="played" />
          <Stat value={`${winRate}%`} label="win rate" />
          <Stat value={stats.currentStreak} label="current streak" />
          <Stat value={stats.bestStreak} label="best streak" />
        </div>
        <div className="distribution">
          <h3>Guess distribution</h3>
          {stats.distribution.map((value, index) => {
            const level = value ? Math.max(1, Math.ceil((value / peak) * 10)) : 0
            return (
            <div className="distribution-row" key={index}>
              <span>{index + 1}</span><div className="distribution-track"><div className={`distribution-fill level-${level}`}><b>{value}</b></div></div>
            </div>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}
