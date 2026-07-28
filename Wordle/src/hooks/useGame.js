import { useCallback, useMemo, useRef, useState } from 'react'
import { ANSWER_WORDS, VALID_WORDS } from '../constants/words'
import { EMPTY_STATS, GAME_STATUS, MAX_ATTEMPTS, WORD_LENGTH } from '../constants/config'
import { evaluateGuess } from '../utils/evaluateGuess'
import { getKeyboardStates } from '../utils/keyboardState'
import { randomWord } from '../utils/randomWord'
import { getStorage, setStorage } from '../utils/storage'

const STATS_KEY = 'luma-wordle-stats'
const validWords = new Set(VALID_WORDS)

const messageForWin = (attempts) => ['Genius.', 'Magnificent.', 'Excellent.', 'Great.', 'Well played.', 'Made it.'][attempts - 1]

export function useGame({ onMessage }) {
  const revealTimer = useRef(null)
  const [solutionWord, setSolutionWord] = useState(() => randomWord(ANSWER_WORDS))
  const [currentGuess, setCurrentGuess] = useState('')
  const [pastGuesses, setPastGuesses] = useState([])
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.PLAYING)
  const [shakeRow, setShakeRow] = useState(-1)
  const [stats, setStats] = useState(() => ({ ...EMPTY_STATS, ...getStorage(STATS_KEY, {}) }))

  const saveStats = useCallback((updater) => {
    setStats((current) => {
      const next = updater(current)
      setStorage(STATS_KEY, next)
      return next
    })
  }, [])

  const newGame = useCallback(() => {
    window.clearTimeout(revealTimer.current)
    setSolutionWord((previous) => randomWord(ANSWER_WORDS, previous))
    setCurrentGuess('')
    setPastGuesses([])
    setGameStatus(GAME_STATUS.PLAYING)
    setShakeRow(-1)
  }, [])

  const handleKey = useCallback((key) => {
    if (gameStatus !== GAME_STATUS.PLAYING) return
    if (/^[A-Z]$/.test(key)) {
      setCurrentGuess((guess) => guess.length < WORD_LENGTH ? `${guess}${key}` : guess)
      return
    }
    if (key === 'BACKSPACE') {
      setCurrentGuess((guess) => guess.slice(0, -1))
      return
    }
    if (key !== 'ENTER') return

    if (currentGuess.length !== WORD_LENGTH) {
      setShakeRow(pastGuesses.length)
      onMessage({ text: 'Not enough letters', tone: 'warning' })
      window.setTimeout(() => setShakeRow(-1), 450)
      return
    }
    if (!validWords.has(currentGuess)) {
      setShakeRow(pastGuesses.length)
      onMessage({ text: 'Not in word list', tone: 'warning' })
      window.setTimeout(() => setShakeRow(-1), 450)
      return
    }

    const evaluation = evaluateGuess(currentGuess, solutionWord)
    const submittedGuess = { word: currentGuess, evaluation }
    const attempt = pastGuesses.length + 1
    const hasWon = currentGuess === solutionWord
    const hasLost = !hasWon && attempt === MAX_ATTEMPTS
    setPastGuesses((guesses) => [...guesses, submittedGuess])
    setCurrentGuess('')
    setGameStatus(GAME_STATUS.REVEALING)

    revealTimer.current = window.setTimeout(() => {
      if (hasWon) {
        setGameStatus(GAME_STATUS.WON)
        saveStats((current) => ({
          ...current,
          gamesPlayed: current.gamesPlayed + 1,
          wins: current.wins + 1,
          currentStreak: current.currentStreak + 1,
          bestStreak: Math.max(current.bestStreak, current.currentStreak + 1),
          distribution: current.distribution.map((count, index) => index === attempt - 1 ? count + 1 : count),
        }))
        onMessage({ text: messageForWin(attempt), tone: 'success' })
      } else if (hasLost) {
        setGameStatus(GAME_STATUS.LOST)
        saveStats((current) => ({
          ...current,
          gamesPlayed: current.gamesPlayed + 1,
          losses: current.losses + 1,
          currentStreak: 0,
        }))
        onMessage({ text: 'Better luck next time', tone: 'neutral' })
      } else {
        setGameStatus(GAME_STATUS.PLAYING)
      }
    }, 1450)
  }, [currentGuess, gameStatus, onMessage, pastGuesses.length, saveStats, solutionWord])

  const keyboardStates = useMemo(() => getKeyboardStates(pastGuesses), [pastGuesses])

  return {
    currentGuess,
    gameStatus,
    handleKey,
    keyboardStates,
    newGame,
    pastGuesses,
    shakeRow,
    solutionWord,
    stats,
  }
}
