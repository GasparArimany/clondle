import { useCallback, useEffect, useState } from "react";
import { LetterStatus } from "../../models/Guess";
import classNames from "classnames";
import { Backspace } from "../Icons/Backspace";

const keys = [
	"Q",
	"W",
	"E",
	"R",
	"T",
	"Y",
	"U",
	"I",
	"O",
	"P",
	"A",
	"S",
	"D",
	"F",
	"G",
	"H",
	"J",
	"K",
	"L",
	"Z",
	"X",
	"C",
	"V",
	"B",
	"N",
	"M",
] as const;

// type Letter = (typeof keys)[number];

const letterStatusClassMap: Record<LetterStatus, string> = {
	IN_PLACE: "bg-lime-600",
	MISPLACED: "bg-amber-400",
	NOT_IN_WORD: "bg-zinc-500",
	// TODO fix
	EMPTY: "",
};

type KeyboardProps = {
	onSubmit: (content: string) => void;
	onChange: (content: string) => void;
	lettersStateMap: Map<string, LetterStatus>;
	onValidate?: (content: string) => boolean;
	maxLength?: number;
};

function Keyboard({
	onSubmit,
	onChange,
	maxLength,
	onValidate = () => true,
	lettersStateMap,
}: KeyboardProps) {
	const [content, setContent] = useState("");

	const submit = useCallback(() => {
		if (onValidate(content)) {
			setContent("");
			onSubmit(content);
		}
	}, [onSubmit, content, onValidate]);

	const handleChange = useCallback(
		(pressedKey: string) => {
			let newContent = "";
			if (pressedKey === "Enter") {
				return;
			} else if (pressedKey === "Backspace") {
				newContent = content.slice(0, -1);
			} else if (!/^[a-zA-Z]$/.test(pressedKey)) {
				return;
			} else {
				if (maxLength && maxLength <= content.length) {
					return;
				}
				newContent = content + pressedKey;
			}

			setContent(newContent);
			onChange(newContent);
		},
		[onChange, content, maxLength]
	);

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
		(e) => {
			e.preventDefault();
			submit();
		},
		[submit]
	);

	useEffect(() => {
		const handleKeyUp = (event: KeyboardEvent) => {
			if (event.key === "Enter") {
				submit();
				return;
			}
			handleChange(event.key);
		};

		document.body.addEventListener("keyup", handleKeyUp);

		return () => {
			document.body.removeEventListener("keyup", handleKeyUp);
		};
	}, [handleChange, submit]);

	return (
		<form onSubmit={handleSubmit} className="flex flex-col items-center space-y-2">
			<div className="flex space-x-1">
				{keys.slice(0, 10).map((key) => {
					const status = lettersStateMap.get(key.toLowerCase()) || "EMPTY";
					return (
						<button
							key={key}
							type="button"
							className={classNames("keyboard-letter", letterStatusClassMap[status])}
							onClick={() => handleChange(key)}
						>
							{key}
						</button>
					);
				})}
			</div>
			<div className="flex space-x-1">
				{keys.slice(10, 19).map((key) => {
					const status = lettersStateMap.get(key.toLowerCase()) || "EMPTY";

					return (
						<button
							key={key}
							type="button"
							className={classNames("keyboard-letter", letterStatusClassMap[status])}
							onClick={() => handleChange(key)}
						>
							{key}
						</button>
					);
				})}
			</div>
			<div className="flex space-x-1">
				{keys.slice(19).map((key) => {
					const status = lettersStateMap.get(key.toLowerCase()) || "EMPTY";

					return (
						<button
							key={key}
							type="button"
							className={classNames("keyboard-letter", letterStatusClassMap[status])}
							onClick={() => handleChange(key)}
						>
							{key}
						</button>
					);
				})}
				<button
					type="button"
					className="keyboard-letter w-10"
					onClick={() => {
						handleChange("Backspace");
					}}
				>
					<Backspace />
				</button>
			</div>
			<input
				/**
				 * stopPropagation is for users pressing enter while focused on the input
				 * the submit event is fired on the form, and the keyup event is stopped from propagating to the handler in the body
				 */
				onKeyUp={(e) => {
					if (e.key === "Enter") {
						e.stopPropagation();
					}
				}}
				value={"Submit"}
				type="submit"
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			/>
		</form>
	);
}

export default Keyboard;
