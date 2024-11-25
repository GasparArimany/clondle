import classNames from "classnames";
import { WORD_LENGTH } from "../../App";

// LetterMatch?
type LetterStatus = "MISPLACED" | "CORRECT" | "INCORRECT" | "COVERED";

const LetterStatusStyleMap: Record<LetterStatus, string> = {
	CORRECT: "bg-lime-300",
	COVERED: "bg-transparent",
	INCORRECT: "bg-red-500",
	MISPLACED: "bg-amber-400 ",
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
			<span className="align-middle">{letter}</span>
		</div>
	);
}

export function Guess({
	guess,
	getLetterStatusInWord,
}: {
	guess: string;
	getLetterStatusInWord(letter: string): LetterStatus;
}) {
	let content;
	if (!guess) {
		content = [
			...Array.from({ length: WORD_LENGTH }, (_, index) => index + 1),
		].map((_: number, i) => {
			return (
				<GuessLetter letter="" key={i} letterStatus="COVERED"></GuessLetter>
			);
		});
	} else {
		content = guess.split("").map((letter: string, i) => {
			return (
				<GuessLetter
					key={i}
					letter={letter}
					letterStatus={getLetterStatusInWord(letter)}
				/>
			);
		});
	}

	return <div className="flex justify-center gap-4">{content}</div>;
}
