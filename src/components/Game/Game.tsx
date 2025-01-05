import { useState, useReducer, useRef, useMemo, useCallback } from "react";
import { GameState } from "../../models/GameState";
import { getRandomWord } from "../../utils";
import { evaluateGuess } from "../../utils/evaluateGuess";
import { words } from "../../words";
import { Guesses } from "../Guesses/Guesses";
import { ToastRef, Toast } from "../Toast/Toast";
import { Guess, GuessLetter } from "../../models/Guess";
import { createLettersStatsMap } from "../../utils/createLettersStatsMap";
import { AMOUNT_OF_GUESSES, WORD_LENGTH } from "../../constants";
import Keyboard from "../Keyboard/Keyboard";

type GuessesState = { guessCount: number; guesses: Guess[] };

type ClearGuessAction = { type: "CLEAR" };
type AddGuessAction = { type: "ADD_GUESS"; payload: Guess };

type GuessesStateActions = ClearGuessAction | AddGuessAction;

function createGuessesInitialState(): GuessesState {
	return {
		guessCount: 0,
		guesses: Array<Guess>(AMOUNT_OF_GUESSES).fill(
			Array<GuessLetter>(WORD_LENGTH).fill({ letter: "", status: "EMPTY" })
		),
	};
}

function GuessesReducer(state: GuessesState, action: GuessesStateActions): GuessesState {
	switch (action.type) {
		case "ADD_GUESS": {
			const newGuesses = [...state.guesses];
			newGuesses[state.guessCount] = action.payload;
			return {
				guesses: newGuesses,
				guessCount: state.guessCount + 1,
			};
		}
		case "CLEAR": {
			return createGuessesInitialState();
		}
		default:
			return state;
	}
}

export function Game() {
	const [word, setWord] = useState(getRandomWord(words));
	const [currentGuess, setCurrentGuess] = useState("");

	const [{ guesses, guessCount }, dispatch] = useReducer(
		GuessesReducer,
		null,
		createGuessesInitialState
	);

	const toastRef = useRef<ToastRef | null>(null);

	const wordLettersMap = useMemo(() => createLettersStatsMap(word), [word]);

	const gameState: GameState = useMemo(() => {
		const hasWon = guesses.some((guess) => guess.join() === word);

		if (hasWon) return "WON";

		if (guessCount === AMOUNT_OF_GUESSES) return "LOST";

		return "PLAYING";
	}, [word, guesses, guessCount]);

	const handleGameReset = useCallback(() => {
		setWord(getRandomWord(words));
		dispatch({ type: "CLEAR" });
	}, []);

	const handleSubmitGuess = useCallback(() => {
		const evaluatedGuess = evaluateGuess(currentGuess, wordLettersMap);

		dispatch({ type: "ADD_GUESS", payload: evaluatedGuess });
	}, [currentGuess, wordLettersMap]);

	const handleValidateGuess = useCallback(() => {
		if (currentGuess.length !== WORD_LENGTH) {
			toastRef.current?.show(`guess must be ${WORD_LENGTH} letters long`);
			return false;
		}

		if (!words.includes(currentGuess)) {
			toastRef.current?.show(`guess is not a word`);
			return false;
		}

		return true;
	}, [currentGuess]);

	const handleCurrentGuessChange = useCallback((content: string) => {
		setCurrentGuess(content);
	}, []);

	return (
		<section className="pt-4 max-w-lg mx-auto flex flex-col gap-4">
			<Guesses guesses={guesses} />
			{gameState === "PLAYING" && (
				<Keyboard
					onSubmit={handleSubmitGuess}
					lettersStateMap={new Map()}
					onChange={handleCurrentGuessChange}
					onValidate={handleValidateGuess}
					maxLength={WORD_LENGTH}
				/>
			)}
			{gameState === "WON" && <div className="flex flex-col gap-4">You won!</div>}
			{gameState === "LOST" && (
				<div className="flex flex-col gap-4">You lost! The word was {word}</div>
			)}
			<button onClick={handleGameReset}>Reset Game</button>
			<Toast ref={toastRef} />
		</section>
	);
}
