import { GuessWord } from "../Guess/Guess";
import type { Guess } from "../../models/Guess";

export function Guesses({ guesses }: { guesses: Guess[] }) {
	return guesses.map((guess, i) => {
		return <GuessWord key={i} guess={guess} />;
	});
}
