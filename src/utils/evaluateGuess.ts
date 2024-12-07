import { WORD_LENGTH } from "../constants";
import { Guess } from "../models/Guess";
import { LetterStatsMap } from "../models/WordLetterStats";

export function evaluateGuess(guess: string, wordMap: LetterStatsMap): Guess {
	const guessLetters = guess.split("");
	const mapCopy = new Map(wordMap);
	const result: Guess = Array(WORD_LENGTH).fill(undefined);

	// gather all in place letters
	guessLetters.forEach((letter, i) => {
		const letterInWord = mapCopy.get(letter);
		if (!letterInWord) {
			return;
		}
		const isLetterInPlace = letterInWord.pos.includes(i);
		if (!isLetterInPlace) {
			return;
		}

		result[i] = { letter, status: "IN_PLACE" };
		mapCopy.set(letter, { ...letterInWord, qty: letterInWord.qty - 1 });
	});

	// gather all misplaced and not in word letters
	guessLetters.forEach((letter, i) => {
		// if there is something other to undefined in this position in the result it means this letter was found in place
		// we don't need to change it here
		if (result[i]) {
			return;
		}

		const letterInWord = mapCopy.get(letter);
		if (!letterInWord || letterInWord.qty === 0) {
			result[i] = { letter, status: "NOT_IN_WORD" };
			return;
		}
		const isLetterInPlace = letterInWord.pos.includes(i);
		if (!isLetterInPlace) {
			result[i] = { letter, status: "MISPLACED" };
			mapCopy.set(letter, { ...letterInWord, qty: letterInWord.qty - 1 });
		}
	});

	return result;
}
