const RANK = { empty: 0, absent: 1, present: 2, correct: 3 }

export function getKeyboardStates(pastGuesses) {
  return pastGuesses.reduce((states, guess) => {
    guess.word.split('').forEach((letter, index) => {
      const state = guess.evaluation[index]
      if (!states[letter] || RANK[state] > RANK[states[letter]]) states[letter] = state
    })
    return states
  }, {})
}
