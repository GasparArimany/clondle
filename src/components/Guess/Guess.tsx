import classNames from "classnames";
import type { Guess, LetterStatus } from "../../models/Guess";
import { motion, MotionConfig, stagger } from "motion/react";

const LetterStatusStyleMap: Record<LetterStatus, string> = {
	IN_PLACE: "bg-lime-600",
	MISPLACED: "bg-amber-400",
	NOT_IN_WORD: "bg-zinc-500",
	EMPTY: "bg-transparent",
};

function GuessLetter({ letter, letterStatus }: { letter: string; letterStatus: LetterStatus }) {
	const boxAnimation = {
		...(letter !== "" ? { scale: ["85%", "100%"] } : { scale: ["115%", "100%"] }),
		...(letterStatus === "EMPTY" ? { rotateX: [0, 0] } : { rotateX: [0, 180] }),
	};

	const statusAnimation = {
		...(letterStatus === "MISPLACED" ? { backgroundColor: ["#e6d32c00", "#e6d32c"] } : {}),
		...(letterStatus === "NOT_IN_WORD" ? { backgroundColor: ["#8d8f8e00", "#8d8f8e"] } : {}),
		...(letterStatus === "IN_PLACE" ? { backgroundColor: ["#32a85200", "#32a852"] } : {}),
	};

	return (
		<motion.div initial={false} animate={boxAnimation} className="guess-letter">
			<motion.div animate={statusAnimation} className="h-full p-2">
				<span className="text-center">{letter.toUpperCase()}</span>
			</motion.div>
		</motion.div>
	);
}

export function GuessWord({ guess }: { guess: Guess }) {
	return (
		<div className="flex justify-center gap-4">
			{guess.letters.map(({ letter, status }, i) => {
				return <GuessLetter key={i} letter={letter} letterStatus={status} />;
			})}
		</div>
	);
}
