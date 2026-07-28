export const WORD_LENGTH = 5
export const MAX_ATTEMPTS = 6
export const GAME_STATUS = {
  PLAYING: 'playing',
  REVEALING: 'revealing',
  WON: 'won',
  LOST: 'lost',
}

export const GAME_MODE = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
}

export const DEFAULT_SETTINGS = {
  soundEnabled: true,
  gameMode: GAME_MODE.MEDIUM,
  hintsRemaining: 3,
  reduceMotion: false,
}

export const EMPTY_STATS = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  currentStreak: 0,
  bestStreak: 0,
  distribution: [0, 0, 0, 0, 0, 0],
}
