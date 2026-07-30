import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { EASY_WORDS, MEDIUM_WORDS, HARD_WORDS, VALID_WORDS } from '../constants/words'
import { EMPTY_STATS, GAME_STATUS, MASTER_SEQUENCE, MAX_ATTEMPTS, WORD_LENGTH } from '../constants/config'
import { evaluateGuess } from '../utils/evaluateGuess'
import { getKeyboardStates } from '../utils/keyboardState'
import { randomWord } from '../utils/randomWord'
import { getStorage, setStorage } from '../utils/storage'
import { playRevealSound, playWinSound, playLoseSound, playHintSound, playErrorSound } from '../utils/sound'

const emptyGuess = () => Array(WORD_LENGTH).fill('')

const STATS_KEY = 'luma-wordle-stats'
const MASTER_KEY = 'luma-wordle-master'
const validWords = new Set(VALID_WORDS)

const savedMaster = getStorage(MASTER_KEY, { progress: 0, unlocked: false, solutionIndex: 0 })

const WORD_LISTS = {
  easy: EASY_WORDS,
  medium: MEDIUM_WORDS,
  hard: HARD_WORDS,
}

const messageForWin = (attempts) => ['Genius.', 'Magnificent.', 'Excellent.', 'Great.', 'Well played.', 'Made it.'][attempts - 1]

export function useGame({ onMessage, gameMode, soundEnabled = true }) {
  const revealTimer = useRef(null)
  const masterProgress = useRef(savedMaster.progress)
  const masterUnlocked = useRef(savedMaster.unlocked)
  const masterSolutionIndex = useRef(savedMaster.solutionIndex)
  const [solutionWord, setSolutionWord] = useState(() => {
    if (savedMaster.unlocked) return MASTER_SEQUENCE[savedMaster.solutionIndex]
    return randomWord(WORD_LISTS[gameMode] || MEDIUM_WORDS)
  })
  const [currentGuess, setCurrentGuess] = useState(emptyGuess())
  const [pastGuesses, setPastGuesses] = useState([])
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.PLAYING)
  const [shakeRow, setShakeRow] = useState(-1)
  const [hintPositions, setHintPositions] = useState([])
  const [hintsRemaining, setHintsRemaining] = useState(5)
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
    if (masterUnlocked.current) {
      masterSolutionIndex.current = (masterSolutionIndex.current + 1) % MASTER_SEQUENCE.length
      setSolutionWord(MASTER_SEQUENCE[masterSolutionIndex.current])
      setStorage(MASTER_KEY, {
        progress: masterProgress.current,
        unlocked: true,
        solutionIndex: masterSolutionIndex.current,
      })
    } else {
      setSolutionWord(randomWord(WORD_LISTS[gameMode] || MEDIUM_WORDS))
    }
    setCurrentGuess(emptyGuess())
    setPastGuesses([])
    setGameStatus(GAME_STATUS.PLAYING)
    setShakeRow(-1)
    setHintPositions([])
    setHintsRemaining(5)
  }, [gameMode])

  useEffect(() => {
    window.clearTimeout(revealTimer.current)
    const wordList = WORD_LISTS[gameMode] || MEDIUM_WORDS
    const timer = window.setTimeout(() => {
      if (masterUnlocked.current) {
        masterSolutionIndex.current = (masterSolutionIndex.current + 1) % MASTER_SEQUENCE.length
        setSolutionWord(MASTER_SEQUENCE[masterSolutionIndex.current])
        setStorage(MASTER_KEY, {
          progress: masterProgress.current,
          unlocked: true,
          solutionIndex: masterSolutionIndex.current,
        })
      } else {
        setSolutionWord(randomWord(wordList))
      }
      setCurrentGuess(emptyGuess())
      setPastGuesses([])
      setGameStatus(GAME_STATUS.PLAYING)
      setShakeRow(-1)
      setHintPositions([])
      setHintsRemaining(5)
    }, 0)
    return () => window.clearTimeout(timer)
  }, [gameMode])

  const hintIndices = useMemo(() => hintPositions.map(h => h.index), [hintPositions])

  const useHint = useCallback(() => {
    if (hintsRemaining <= 0 || gameStatus !== GAME_STATUS.PLAYING) return
    const availableHints = solutionWord
      .split('')
      .map((letter, index) => {
        if (currentGuess[index] !== letter && !hintPositions.some(h => h.index === index)) {
          return index
        }
        return null
      })
      .filter(index => index !== null)
    if (availableHints.length === 0) return
    const randomIndex = availableHints[Math.floor(Math.random() * availableHints.length)]
    setCurrentGuess((prev) => {
      const next = [...prev]
      next[randomIndex] = solutionWord[randomIndex]
      return next
    })
    setHintPositions((prev) => [...prev, { index: randomIndex, letter: solutionWord[randomIndex] }])
    setHintsRemaining((prev) => prev - 1)
    if (soundEnabled) playHintSound()
    onMessage({ text: 'Hint used! A helpful letter has been revealed.', tone: 'hint' })
  }, [hintsRemaining, gameStatus, solutionWord, currentGuess, hintPositions, onMessage, soundEnabled])

  const handleKey = useCallback((key) => {
    if (gameStatus !== GAME_STATUS.PLAYING) return
    if (/^[A-Z]$/.test(key)) {
      setCurrentGuess((prev) => {
        const next = [...prev]
        const idx = next.indexOf('')
        if (idx !== -1) next[idx] = key
        return next
      })
      return
    }
    if (key === 'BACKSPACE') {
      for (let i = currentGuess.length - 1; i >= 0; i--) {
        if (currentGuess[i] !== '') {
          setCurrentGuess((prev) => {
            const next = [...prev]
            next[i] = ''
            return next
          })
          setHintPositions((prev) => prev.filter(h => h.index !== i))
          return
        }
      }
      return
    }
    if (key !== 'ENTER') return

    const guessStr = currentGuess.join('')
    if (guessStr.length !== WORD_LENGTH) {
      setShakeRow(pastGuesses.length)
      if (soundEnabled) playErrorSound()
      onMessage({ text: 'Not enough letters', tone: 'warning' })
      window.setTimeout(() => setShakeRow(-1), 450)
      return
    }
    if (!validWords.has(guessStr)) {
      const invalidEvaluation = Array(WORD_LENGTH).fill('invalid')
      setPastGuesses((guesses) => [...guesses, { word: guessStr, evaluation: invalidEvaluation, invalid: true }])
      setCurrentGuess(emptyGuess())
      if (soundEnabled) playErrorSound()
      onMessage({ text: 'Not a valid word', tone: 'warning' })
      return
    }

    const evaluation = evaluateGuess(guessStr, solutionWord)
    const submittedGuess = { word: guessStr, evaluation }
    const attempt = pastGuesses.length + 1
    const hasWon = guessStr === solutionWord
    const hasLost = !hasWon && attempt === MAX_ATTEMPTS
    setPastGuesses((guesses) => [...guesses, submittedGuess])

    if (!masterUnlocked.current) {
      const nextMasterWord = MASTER_SEQUENCE[masterProgress.current]
      if (guessStr === nextMasterWord) {
        masterProgress.current++
        if (masterProgress.current >= MASTER_SEQUENCE.length) {
          masterUnlocked.current = true
          masterSolutionIndex.current = 0
        }
        setStorage(MASTER_KEY, {
          progress: masterProgress.current,
          unlocked: masterUnlocked.current,
          solutionIndex: masterSolutionIndex.current,
        })
      } else {
        masterProgress.current = 0
        setStorage(MASTER_KEY, { progress: 0, unlocked: false, solutionIndex: 0 })
      }
    }
    setCurrentGuess(emptyGuess())
    setGameStatus(GAME_STATUS.REVEALING)
    if (soundEnabled) playRevealSound()

    revealTimer.current = window.setTimeout(() => {
      if (hasWon) {
        if (soundEnabled) playWinSound()
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
        if (soundEnabled) playLoseSound()
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
  }, [currentGuess, gameStatus, onMessage, pastGuesses.length, saveStats, solutionWord, soundEnabled])

  const keyboardStates = useMemo(() => getKeyboardStates(pastGuesses.filter(g => !g.invalid)), [pastGuesses])

  return {
    currentGuess: currentGuess.map(c => c || ' ').join(''),
    gameStatus,
    handleKey,
    hintIndices,
    hintsRemaining,
    solutionWord,
    useHint,
    keyboardStates,
    newGame,
    pastGuesses,
    shakeRow,
    stats,
  }
}
