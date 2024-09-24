export function getRandomWord(words: string[]) {
  const idx = Math.floor(Math.random() * words.length);
  return words[idx];
}
