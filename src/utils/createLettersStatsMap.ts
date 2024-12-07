import { LetterStatsMap } from "../models/WordLetterStats";

export function createLettersStatsMap(word: string) {
	const map: LetterStatsMap = new Map();
	return word.split("").reduce((prevMap, letter, index) => {
		const newMap: LetterStatsMap = new Map(prevMap);
		if (prevMap.has(letter)) {
			const letterStats = prevMap.get(letter)!;
			newMap.set(letter, {
				qty: letterStats.qty + 1,
				pos: [...letterStats.pos, index],
			});
		} else {
			newMap.set(letter, { pos: [index], qty: 1 });
		}

		return newMap;
	}, map);
}
