import { GuessWord } from "../Guess/Guess";
import type { Guess } from "../../models/Guess";

export function Guesses({ guesses }: { guesses: Guess[] }) {
	return guesses.slice(0, 6).map((guess, i) => {
		return <GuessWord key={i} guess={guess} />;
	});
}
