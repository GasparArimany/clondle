import { GuessWord } from "../Guess/Guess";
import type { Guess } from "../../models/Guess";

export function Guesses({
	guesses,
	onUnveilEnded,
}: {
	guesses: Guess[];
	onUnveilEnded: VoidFunction;
}) {
	return guesses.slice(0, 6).map((guess, i) => {
		return <GuessWord onUnveilEnded={onUnveilEnded} key={i} guess={guess} />;
	});
}
