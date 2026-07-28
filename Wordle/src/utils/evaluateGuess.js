export function evaluateGuess(guess, solution) {
  const letters = guess.split('')
  const solutionLetters = solution.split('')
  const result = Array(letters.length).fill('absent')

  letters.forEach((letter, index) => {
    if (letter === solutionLetters[index]) {
      result[index] = 'correct'
      solutionLetters[index] = null
    }
  })

  letters.forEach((letter, index) => {
    if (result[index] === 'correct') return
    const matchIndex = solutionLetters.indexOf(letter)
    if (matchIndex !== -1) {
      result[index] = 'present'
      solutionLetters[matchIndex] = null
    }
  })

  return result
}
