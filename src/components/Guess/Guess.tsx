// import classNames from "classnames";
import type { Guess, LetterStatus } from "../../models/Guess";
import { motion } from "motion/react";

// const LetterStatusStyleMap: Record<LetterStatus, string> = {
// 	IN_PLACE: "bg-lime-600",
// 	MISPLACED: "bg-amber-400",
// 	NOT_IN_WORD: "bg-zinc-500",
// 	EMPTY: "bg-transparent",
// };

function GuessLetter({ letter, letterStatus }: { letter: string; letterStatus: LetterStatus }) {
	const faceDown = letterStatus === "EMPTY";

	const rotateAnimation = faceDown ? { rotateY: 0 } : { rotateY: 180 };

	const hasLetter = letter !== "";

	const boxAnimation = {
		...(hasLetter ? { scale: ["85%", "100%"] } : { scale: ["115%", "100%"] }),
		...rotateAnimation,
	};

	const statusAnimation = {
		// TODO: use tailwind variables
		...(letterStatus === "IN_PLACE" ? { backgroundColor: ["#32a85200", "#32a852"] } : {}),
		...(letterStatus === "MISPLACED" ? { backgroundColor: ["#e6d32c00", "#e6d32c"] } : {}),
		...(letterStatus === "NOT_IN_WORD" ? { backgroundColor: ["#8d8f8e00", "#8d8f8e"] } : {}),
		...(letterStatus !== "EMPTY" ? { rotateY: [0] } : { rotateY: [180] }),
	};

	return (
		<motion.div className="guess-letter" transition={{ duration: 0.7 }} animate={rotateAnimation}>
			<motion.div
				className="h-full relative border-2 border-white"
				transition={{ duration: 0.7 }}
				animate={boxAnimation}
			>
				<motion.div
					transition={{ duration: 0.7 }}
					animate={rotateAnimation}
					className="h-full p-2"
					style={{ backfaceVisibility: "hidden" }}
				>
					<span className="text-center">{letter.toUpperCase()}</span>
				</motion.div>
				<motion.div
					transition={{ duration: 0.7 }}
					initial={{ rotateY: 180 }}
					animate={statusAnimation}
					style={{ backfaceVisibility: "hidden" }}
					className="h-full p-2 absolute top-0 left-0 w-full"
				>
					<span className="text-center">{letter.toUpperCase()}</span>
				</motion.div>
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
