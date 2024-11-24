import { WORD_LENGTH } from "../../App";

export function Guess({ guess = "" }: { guess: string }) {
	return (
		<div className="flex justify-center gap-4">
			{[...Array.from({ length: WORD_LENGTH }, (_, index) => index + 1)].map(
				(_: number, i) => {
					return (
						<div
							key={i}
							className="inline-block text-center text-2xl font-bold py-2 px-2 size-14 border-2 border-white"
						>
							<span className="align-middle">{guess.charAt(i)}</span>
						</div>
					);
				}
			)}
		</div>
	);
}
