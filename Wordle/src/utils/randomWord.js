export function randomWord(words, previousWord) {
  const choices = words.filter((word) => word !== previousWord)
  return choices[Math.floor(Math.random() * choices.length)]
}
