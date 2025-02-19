import { useState, useReducer, useRef, useMemo, useCallback } from "react";
import { GameState } from "../../models/GameState";
import { getRandomWord } from "../../utils";
import { wordList } from "../../words2";
import { Guesses } from "../Guesses/Guesses";
import { ToastRef, Toast } from "../Toast/Toast";
import { Guess, LetterStatus } from "../../models/Guess";
import { createLettersStatsMap } from "../../utils/createLettersStatsMap";
import { AMOUNT_OF_GUESSES, WORD_LENGTH } from "../../constants";
import Keyboard from "../Keyboard/Keyboard";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "../../hooks/useWindowSize";

type GuessesState = { guessCount: number; guesses: Guess[] };

type ClearGuessAction = { type: "CLEAR" };
type AddGuessAction = { type: "ADD_GUESS"; payload: Guess };

type GuessesStateActions = ClearGuessAction | AddGuessAction;

function createGuessesInitialState(): GuessesState {
	return {
		guessCount: 0,
		guesses: Array<Guess>(AMOUNT_OF_GUESSES).fill(new Guess()),
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
	const [word, setWord] = useState(getRandomWord(wordList));
	const [currentGuess, setCurrentGuess] = useState<Guess>(new Guess());
	const [lettersStateMap, setLettersStateMap] = useState(new Map<string, LetterStatus>());
	const [gameState, setGameState] = useState<GameState>("PLAYING");
	const { width: w, height: h } = useWindowSize();
	const [{ guesses, guessCount }, dispatch] = useReducer(
		GuessesReducer,
		null,
		createGuessesInitialState
	);

	const toastRef = useRef<ToastRef | null>(null);

	const wordLettersMap = useMemo(() => createLettersStatsMap(word), [word]);

	const handleGameReset = useCallback(() => {
		setWord(getRandomWord(wordList));
		setCurrentGuess(new Guess());
		setGameState("PLAYING");
		dispatch({ type: "CLEAR" });
		setLettersStateMap(new Map<string, LetterStatus>());
	}, []);

	const handleSubmitGuess = useCallback(() => {
		const evaluatedGuess = currentGuess.evaluateGuess(wordLettersMap);
		setCurrentGuess(new Guess());
		dispatch({ type: "ADD_GUESS", payload: evaluatedGuess });
	}, [currentGuess, wordLettersMap]);

	const handleValidateGuess = useCallback(() => {
		if (currentGuess.toString().length !== WORD_LENGTH) {
			toastRef.current?.show(`guess must be ${WORD_LENGTH} letters long`);
			return false;
		}

		if (!wordList.includes(currentGuess.toString())) {
			toastRef.current?.show(`${currentGuess.toString()} is not a word`);
			return false;
		}

		return true;
	}, [currentGuess]);

	const handleCurrentGuessChange = useCallback((newGuess: string) => {
		setCurrentGuess(new Guess(newGuess.toLowerCase()));
	}, []);

	const shownGuesses = useMemo(() => {
		const result = guesses.slice();
		result[guessCount] = currentGuess;

		return result;
	}, [guesses, currentGuess, guessCount]);

	const handleUnveilEnded = () => {
		const newLettersStateMap = guesses.reduce((acc, guess) => {
			guess.letters.forEach(({ letter, status }) => {
				if (acc.has(letter) && acc.get(letter) === "IN_PLACE") return;

				acc.set(letter, status);
			});
			return acc;
		}, new Map<string, LetterStatus>());
		setLettersStateMap(newLettersStateMap);

		const lastGuess = guesses[guessCount - 1];

		if (lastGuess) {
			const hasWon = lastGuess.toString() === word;

			if (hasWon) {
				setGameState("WON");
			} else if (guessCount === AMOUNT_OF_GUESSES) {
				setGameState("LOST");
			}
		}
	};

	const handleResetKeyup = (e: React.KeyboardEvent<HTMLButtonElement>) => {
		if (e.key === "Enter") {
			e.stopPropagation();
			handleGameReset();
		}
	};

	return (
		<section className="pt-4 max-w-lg mx-auto flex flex-col gap-4">
			<Guesses onUnveilEnded={handleUnveilEnded} guesses={shownGuesses} />
			{gameState === "PLAYING" && (
				<Keyboard
					key={word}
					onChange={handleCurrentGuessChange}
					onSubmit={handleSubmitGuess}
					onValidate={handleValidateGuess}
					lettersStateMap={lettersStateMap}
					maxLength={WORD_LENGTH}
				/>
			)}
			{gameState === "WON" && <div className="flex flex-col gap-4">You won!</div>}
			{gameState === "LOST" && (
				<div className="flex flex-col gap-4">You lost! The word was {word}</div>
			)}
			<button onClick={handleGameReset} onKeyUp={handleResetKeyup}>
				Reset Game
			</button>
			<Toast ref={toastRef} />
			{gameState === "WON" && <ReactConfetti width={w} height={h} />}
		</section>
	);
}
