import { useEffect, useRef } from "react";
import type { Guess, LetterStatus } from "../../models/Guess";
import { motion, Variants, useAnimate } from "motion/react";

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

	const rotateVariants: Variants = {
		unveil: (isFace: boolean) => ({
			rotateX: isFace ? 90 : 0,
			transition: { duration: 0.5, ease: "easeInOut" },
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

export function GuessWord({ guess, onUnveilEnded }: { guess: Guess; onUnveilEnded: VoidFunction }) {
	const parentVariants = {
		unveil: {
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const animate = guess.letters.some((letter) => letter.status !== "EMPTY") ? "unveil" : undefined;

	return (
		<motion.div
			initial={false}
			variants={parentVariants}
			animate={animate}
			className="flex justify-center gap-4"
			onAnimationComplete={onUnveilEnded}
		>
			{guess.letters.map(({ letter, status }, i) => {
				return <GuessLetter key={i} letter={letter} letterStatus={status} />;
			})}
		</motion.div>
	);
}
