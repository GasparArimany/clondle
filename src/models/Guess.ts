export type LetterStatus = "MISPLACED" | "IN_PLACE" | "NOT_IN_WORD" | "EMPTY";
export type GuessLetter = { letter: string; status: LetterStatus };

import { WORD_LENGTH } from "../constants";
import { LetterStatsMap } from "./WordLetterStats";

export class Guess {
	letters: Array<GuessLetter>;

	constructor(initialValue?: string) {
		this.letters = initialValue
			? Array.from({ length: WORD_LENGTH }, (_, index) => ({
					letter: initialValue[index] || "",
					status: "EMPTY",
			  }))
			: Array.from({ length: WORD_LENGTH }, () => ({ letter: "", status: "EMPTY" }));
	}

	toString(): string {
		return this.letters.map((letter) => letter.letter).join("");
	}

	evaluateGuess(wordMap: LetterStatsMap): Guess {
		const mapCopy = new Map(wordMap);
		const result: Guess = new Guess();

		// gather all in place letters
		this.letters.forEach(({ letter }, i) => {
			const letterInWord = mapCopy.get(letter);
			if (!letterInWord) {
				return;
			}
			const isLetterInPlace = letterInWord.pos.includes(i);
			if (!isLetterInPlace) {
				return;
			}

			result.letters[i] = { letter, status: "IN_PLACE" };
			mapCopy.set(letter, { ...letterInWord, qty: letterInWord.qty - 1 });
		});

		// gather all misplaced and not in word letters
		this.letters.forEach(({ letter }, i) => {
			// if there is a defined letter in this position in the result it means this letter was foundto be in place
			// we don't need to change it here
			if (result.letters[i].letter) {
				return;
			}

			const letterInWord = mapCopy.get(letter);
			if (!letterInWord || letterInWord.qty === 0) {
				result.letters[i] = { letter, status: "NOT_IN_WORD" };
				return;
			}
			const isLetterInPlace = letterInWord.pos.includes(i);
			if (!isLetterInPlace) {
				result.letters[i] = { letter, status: "MISPLACED" };
				mapCopy.set(letter, { ...letterInWord, qty: letterInWord.qty - 1 });
			}
		});

		return result;
	}
}
