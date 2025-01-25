import type { Guess, LetterStatus } from "../../models/Guess";
import { motion } from "motion/react";

const LetterStatusStyleMap: Record<LetterStatus, string> = {
	IN_PLACE: "bg-lime-600",
	MISPLACED: "bg-amber-400",
	NOT_IN_WORD: "bg-zinc-500",
	EMPTY: "bg-transparent",
};

function GuessLetter({ letter, letterStatus }: { letter: string; letterStatus: LetterStatus }) {
	const faceDown = letterStatus === "EMPTY";

	const rotateAnimation = faceDown ? { rotateY: 0 } : { rotateY: 180 };

	const hasLetter = letter !== "";

	const statusAnimation = {
		// TODO: use tailwind variables
		// ...(letterStatus === "IN_PLACE" ? { backgroundColor: ["#32a85200", "#32a852"] } : {}),
		// ...(letterStatus === "MISPLACED" ? { backgroundColor: ["#e6d32c00", "#e6d32c"] } : {}),
		// ...(letterStatus === "NOT_IN_WORD" ? { backgroundColor: ["#8d8f8e00", "#8d8f8e"] } : {}),
		...(!faceDown ? { rotateY: [0] } : { rotateY: [180] }),
	};

	const variants = {
		box: {
			...(hasLetter ? { scale: ["85%", "100%"] } : { scale: ["115%", "100%"] }),
			...{ transition: { duration: 0.3 } },
		},
		faceUp: {
			...(!faceDown ? { rotateY: 0 } : { rotateY: 180 }),
			...{ transition: { duration: 1 } },
		},
		faceDown: {
			...(faceDown ? { rotateY: 0 } : { rotateY: 180 }),
			...{ transition: { duration: 1 } },
		},
	};

	return (
		// <motion.div
		// 	initial={false}
		// 	className={`guess-letter relative border-2 border-white`}
		// 	animate={["box", "rotate"]}
		// 	variants={variants}
		// >
		// </motion.div>
		<motion.div className="relative flex">
			<motion.div
				initial={false}
				variants={variants}
				animate={["faceDown", "box"]}
				transition={{ duration: 1 }}
				className="guess-letter"
				style={{ backfaceVisibility: "hidden" }}
			>
				<span className="text-center">{letter.toUpperCase()}</span>
			</motion.div>
			<motion.div
				variants={variants}
				animate={["faceUp", "box"]}
				transition={{ duration: 1 }}
				// initial={{ rotateY: 180 }}
				style={{ backfaceVisibility: "hidden", rotateY: 180 }}
				className={`guess-letter absolute top-0 left-0 w-full ${LetterStatusStyleMap[letterStatus]}`}
			>
				<span className="text-center">{letter.toUpperCase()}</span>
			</motion.div>
		</motion.div>
	);
}

export function GuessWord({ guess }: { guess: Guess }) {
	return (
		<motion.div
			initial={false}
			animate={guess.letters.some(({ status }) => status !== "EMPTY") ? "faceUp" : "faceDown"}
		>
			<motion.div
				variants={{
					faceUp: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
					faceDown: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
				}}
				className="flex justify-center gap-4"
			>
				{guess.letters.map(({ letter, status }, i) => {
					return <GuessLetter key={i} letter={letter} letterStatus={status} />;
				})}
			</motion.div>
		</motion.div>
	);
}
