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
import { useAnimations } from './hooks/useAnimations'
import { useGame } from './hooks/useGame'
import { useKeyboard } from './hooks/useKeyboard'
import { DEFAULT_SETTINGS } from './constants/config'
import { getStorage, setStorage } from './utils/storage'
import { playKeySound } from './utils/sound'
import './styles/global.css'

const SETTINGS_KEY = 'luma-wordle-settings'

function App() {
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState(null)
  const [settings, setSettings] = useState(() => ({
    ...DEFAULT_SETTINGS,
    ...getStorage(SETTINGS_KEY, {}),
  }))
  const game = useGame({ onMessage: setToast })
  const handleGameKey = game.handleKey
  const prefersReducedMotion = useAnimations(settings.reduceMotion)
  const handleInput = useCallback((key) => {
    if (settings.soundEnabled) playKeySound(key)
    handleGameKey(key)
  }, [handleGameKey, settings.soundEnabled])

  useKeyboard({
    onKey: handleInput,
    disabled: game.gameStatus !== 'playing',
  })

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme
    document.documentElement.dataset.contrast = settings.highContrast ? 'high' : 'normal'
    document.documentElement.dataset.motion = prefersReducedMotion ? 'reduce' : 'full'
    document.documentElement.dataset.speed = settings.animationSpeed
    setStorage(SETTINGS_KEY, settings)
  }, [prefersReducedMotion, settings])

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

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
      <section className="game-frame" aria-label="Luma Word game">
        <Header
          onHelp={() => setModal('help')}
          onNewGame={startNewGame}
          onSettings={() => setModal('settings')}
          onStats={() => setModal('stats')}
          theme={settings.theme}
          soundEnabled={settings.soundEnabled}
          onThemeToggle={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
          onSoundToggle={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
        />

        <div className="play-area">
          <div className="game-intro">
            <span className="eyebrow">Daily word ritual</span>
            <p>Find the hidden five-letter word in six thoughtful tries.</p>
          </div>
          <GameBoard
            currentGuess={game.currentGuess}
            pastGuesses={game.pastGuesses}
            shakeRow={game.shakeRow}
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
        {Array.from({ length: 18 }, (_, index) => <i key={index} className={`confetti-piece piece-${index % 6}`} />)}
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
