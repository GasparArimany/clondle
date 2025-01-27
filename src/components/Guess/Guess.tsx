import { useEffect, useRef } from "react";
import type { Guess, LetterStatus } from "../../models/Guess";
import { motion } from "framer-motion";
import { useAnimate } from "motion/react-mini";

const LetterStatusStyleMap: Record<LetterStatus, string> = {
	IN_PLACE: "bg-lime-600",
	MISPLACED: "bg-amber-400",
	NOT_IN_WORD: "bg-zinc-500",
	EMPTY: "bg-transparent",
};

function GuessLetter({ letter, letterStatus }: { letter: string; letterStatus: LetterStatus }) {
	const hasLetter = letter !== "";
	const [scope, animate] = useAnimate();
	const isMounted = useRef(false);

	useEffect(() => {
		if (!isMounted.current) {
			isMounted.current = true;
			return;
		}

		if (hasLetter) {
			animate(scope.current, { scale: ["85%", "100%"] });
		} else {
			animate(scope.current, { scale: ["115%", "100%"] });
		}
	}, [animate, hasLetter, scope]);

	const rotateVariants = {
		unveil: (isFace: boolean) => ({
			rotateX: isFace ? 180 : 0,
			transition: { duration: 0.7 },
		}),
	};

	return (
		<motion.div className="relative flex">
			<motion.div
				initial={false}
				variants={rotateVariants}
				custom={true}
				ref={scope}
				className="guess-letter"
				style={{ backfaceVisibility: "hidden" }}
			>
				<span className="text-center">{letter.toUpperCase()}</span>
			</motion.div>
			<motion.div
				variants={rotateVariants}
				custom={false}
				style={{ backfaceVisibility: "hidden", rotateX: 180 }}
				className={`guess-letter absolute top-0 left-0 w-full ${LetterStatusStyleMap[letterStatus]}`}
			>
				<span className="text-center">{letter.toUpperCase()}</span>
			</motion.div>
		</motion.div>
	);
}

export function GuessWord({ guess }: { guess: Guess }) {
	const parentVariants = {
		unveil: {
			transition: {
				delayChildren: 0.2,
				staggerChildren: 0.2,
			},
		},
	};

	return (
		<motion.div
			initial={false}
			variants={parentVariants}
			animate={guess.letters.some((letter) => letter.status !== "EMPTY") ? "unveil" : undefined}
			className="flex justify-center gap-4"
		>
			{guess.letters.map(({ letter, status }, i) => {
				return <GuessLetter key={i} letter={letter} letterStatus={status} />;
			})}
		</motion.div>
	);
}
