import { useCallback, useEffect, useMemo, useState } from 'react'
import { GameBoard } from './components/Game/GameBoard'
import { Keyboard } from './components/Keyboard/Keyboard'
import { Footer } from './components/Layout/Footer'
import { Header } from './components/Layout/Header'
import { GameOverModal } from './components/Modal/GameOverModal'
import { HelpModal } from './components/Modal/HelpModal'
import { SettingsModal } from './components/Modal/SettingsModal'
import { StatsModal } from './components/Modal/StatsModal'
import { Toast } from './components/UI/Toast'
import { useGame } from './hooks/useGame'
import { useKeyboard } from './hooks/useKeyboard'
import { DEFAULT_SETTINGS, GAME_MODE } from './constants/config'
import { getStorage, setStorage } from './utils/storage'
import { playKeySound } from './utils/sound'
import './styles/global.css'

const SETTINGS_KEY = 'luma-wordle-settings'

const MODE_OPTIONS = [
  { id: GAME_MODE.EASY, icon: '🌱', title: 'Easy', desc: 'Simple common words — perfect for beginners and young learners.' },
  { id: GAME_MODE.MEDIUM, icon: '⭐', title: 'Medium', desc: 'Normal Wordle difficulty — a balanced challenge.' },
  { id: GAME_MODE.HARD, icon: '🔥', title: 'Hard', desc: 'Tough words for seasoned word detectives.' },
]

function App() {
  const [screen, setScreen] = useState('mode-select')
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState(null)
  const [settings, setSettings] = useState(() => ({
    ...DEFAULT_SETTINGS,
    ...getStorage(SETTINGS_KEY, {}),
  }))
  const game = useGame({ onMessage: setToast, gameMode: settings.gameMode, soundEnabled: settings.soundEnabled })
  const handleGameKey = game.handleKey

  const handleInput = useCallback((key) => {
    if (settings.soundEnabled) playKeySound(key)
    handleGameKey(key)
  }, [handleGameKey, settings.soundEnabled])

  useKeyboard({
    onKey: handleInput,
    disabled: game.gameStatus !== 'playing' || screen !== 'game',
  })

  useEffect(() => {
    document.documentElement.dataset.motion = settings.reduceMotion ? 'reduce' : 'full'
    setStorage(SETTINGS_KEY, settings)
  }, [settings])

  useEffect(() => {
    if (game.gameStatus === 'won' || game.gameStatus === 'lost') {
      const timer = window.setTimeout(() => setModal('game-over'), 760)
      return () => window.clearTimeout(timer)
    }
    return undefined
  }, [game.gameStatus])

  const keyboardStates = useMemo(
    () => game.keyboardStates,
    [game.keyboardStates],
  )

  const updateSettings = (updates) => {
    setSettings((current) => ({ ...current, ...updates }))
  }

  const startNewGame = () => {
    game.newGame()
    setModal(null)
  }

  const selectMode = (mode) => {
    updateSettings({ gameMode: mode })
    setScreen('game')
  }

  if (screen === 'mode-select') {
    return (
      <main className="app-shell">
        <div className="ambient ambient-one" aria-hidden="true" />
        <div className="ambient ambient-two" aria-hidden="true" />
        <div className="noise" aria-hidden="true" />
        <section className="game-frame" aria-label="Wordle game">
          <header className="header">
            <div className="watermark" aria-label="Created by Zidan Thapaliya">
              <span aria-hidden="true">✦</span> Created by Zidan Thapaliya
            </div>
          </header>
          <div className="play-area">
            <div className="mode-select">
              <span className="modal-kicker">WELCOME TO</span>
              <h2>Word Puzzle</h2>
              <p>Choose your difficulty and start guessing!</p>
              <div className="mode-cards">
                {MODE_OPTIONS.map((mode) => (
                  <button key={mode.id} className="mode-card" onClick={() => selectMode(mode.id)}>
                    <div className="mode-card-title">
                      <span className="mode-card-icon">{mode.icon}</span>
                      {mode.title}
                    </div>
                    <div className="mode-card-desc">{mode.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <Footer />
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
      <section className="game-frame" aria-label="Wordle game">
        <Header
          gameMode={settings.gameMode}
          hintsRemaining={game.hintsRemaining}
          onHint={game.useHint}
          onHelp={() => setModal('help')}
          onNewGame={startNewGame}
          onSettings={() => setModal('settings')}
          onStats={() => setModal('stats')}
          soundEnabled={settings.soundEnabled}
          onSoundToggle={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
        />

        <div className="play-area">
          <div className="game-intro">
            <span className="eyebrow">Find the hidden word</span>
            <p>Five letters, six chances. Choose wisely.</p>
          </div>
          <GameBoard
            currentGuess={game.currentGuess}
            pastGuesses={game.pastGuesses}
            shakeRow={game.shakeRow}
            hintIndices={game.hintIndices}
            solutionWord={game.solutionWord}
          />
          <Keyboard
            keyStates={keyboardStates}
            onKey={handleInput}
            disabled={game.gameStatus !== 'playing'}
          />
        </div>
        <Footer />
      </section>

      {game.gameStatus === 'won' && <div className="confetti" aria-hidden="true">
        {Array.from({ length: 30 }, (_, index) => <i key={index} className={`confetti-piece piece-${index % 10}`} />)}
      </div>}

      <Toast toast={toast} onDismiss={() => setToast(null)} />
      <GameOverModal
        isOpen={modal === 'game-over'}
        status={game.gameStatus}
        solutionWord={game.solutionWord}
        attempts={game.pastGuesses.length}
        stats={game.stats}
        onClose={() => setModal(null)}
        onNewGame={startNewGame}
        onStats={() => setModal('stats')}
      />
      <StatsModal isOpen={modal === 'stats'} stats={game.stats} onClose={() => setModal(null)} />
      <HelpModal isOpen={modal === 'help'} onClose={() => setModal(null)} />
      <SettingsModal
        isOpen={modal === 'settings'}
        settings={settings}
        onClose={() => setModal(null)}
        onChange={updateSettings}
      />
    </main>
  )
}

export default App
