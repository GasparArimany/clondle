export function getRandomWord(words: string[]) {
	return function () {
		const idx = Math.floor(Math.random() * words.length);
		return words[idx];
	};
}
