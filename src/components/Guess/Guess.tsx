import classNames from "classnames";
import type { Guess, LetterStatus } from "../../models/Guess";

const LetterStatusStyleMap: Record<LetterStatus, string> = {
	IN_PLACE: "bg-lime-600",
	MISPLACED: "bg-amber-400",
	NOT_IN_WORD: "bg-zinc-500",
	EMPTY: "bg-transparent",
};

function GuessLetter({
	letter,
	letterStatus,
}: {
	letter: string;
	letterStatus: LetterStatus;
}) {
	return (
		<div
			className={classNames("guess-letter", LetterStatusStyleMap[letterStatus])}
		>
			<span className="">{letter}</span>
		</div>
	);
}

export function GuessWord({ guess }: { guess: Guess }) {
	return (
		<div className="flex justify-center gap-4">
			{guess.map(({ letter, status }, i) => {
				return <GuessLetter key={i} letter={letter} letterStatus={status} />;
			})}
		</div>
	);
}
