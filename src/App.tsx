import { useCallback, useMemo, useReducer, useRef, useState } from 'react';
import { words } from './words';
import { getRandomWord } from './utils';
import { Toast, ToastRef } from './components/Toast/Toast';
import { Guess, GuessLetter } from './components/Guess/Guess';

const AMOUNT_OF_GUESSES = 6;
export const WORD_LENGTH = 5;

export const MAIN_CONTENT_ID = 'wordle-main';

function App() {
  return (
    <main
      id={MAIN_CONTENT_ID}
      className='bg-gray-800 text-gray-200 h-screen w-full'
    >
      <Game />
    </main>
  );
}

type GameStatus = 'PLAYING' | 'WON' | 'LOST';

function evaluateGuess(guess: string, wordMap: WordLetterMap): Guess {
  const guessLetters = guess.split('');
  const mapCopy = new Map(wordMap);
  const result: Guess = [];

  // gather all in place letters
  guessLetters.forEach((letter, i) => {
    const letterInWord = mapCopy.get(letter);
    if (!letterInWord) {
      return;
    }
    const isLetterInPlace = letterInWord.pos.includes(i);
    if (!isLetterInPlace) {
      return;
    }

    result[i] = { letter, status: 'IN_PLACE' };
    mapCopy.set(letter, { ...letterInWord, qty: letterInWord.qty - 1 });
  });

  // gather all misplaced and not in word letters
  guessLetters.forEach((letter, i) => {
    // if there is something other to undefined in this position in the result it means this letter was found in place
    // we don't need to change it here
    if (result[i]) {
      return;
    }

    const letterInWord = mapCopy.get(letter);
    if (!letterInWord || letterInWord.qty === 0) {
      result[i] = { letter, status: 'NOT_IN_WORD' };
      return;
    }
    const isLetterInPlace = letterInWord.pos.includes(i);
    if (!isLetterInPlace) {
      result[i] = { letter, status: 'MISPLACED' };
      mapCopy.set(letter, { ...letterInWord, qty: letterInWord.qty - 1 });
    }
  });

  return result;
}

function createGuessesInitialState(): GuessesState {
  return {
    guessCount: 0,
    guesses: Array<Guess>(AMOUNT_OF_GUESSES).fill(
      Array<GuessLetter>(WORD_LENGTH).fill({ letter: '', status: 'EMPTY' })
    ),
  };
}

type GuessesState = { guessCount: number; guesses: Guess[] };

type ClearGuessAction = { type: 'CLEAR' };
type AddGuessAction = { type: 'ADD_GUESS'; payload: Guess };

type GuessesStateActions = ClearGuessAction | AddGuessAction;

function GuessesReducer(
  state: GuessesState,
  action: GuessesStateActions
): GuessesState {
  switch (action.type) {
    case 'ADD_GUESS': {
      const newGuesses = [...state.guesses];
      newGuesses[state.guessCount] = action.payload;
      return {
        guesses: newGuesses,
        guessCount: state.guessCount + 1,
      };
    }
    case 'CLEAR': {
      return createGuessesInitialState();
    }
    default:
      return state;
  }
}

type LetterStats = { qty: number; pos: number[] };
type WordLetterMap = Map<string, LetterStats>;

function Game() {
  const [word, setWord] = useState(getRandomWord(words));
  const [currentGuess, setCurrentGuess] = useState('');

  const [{ guesses, guessCount }, dispatch] = useReducer(
    GuessesReducer,
    null,
    createGuessesInitialState
  );

  const toastRef = useRef<ToastRef | null>(null);

  const wordLettersMap = useMemo(() => {
    const map: WordLetterMap = new Map();
    return word.split('').reduce((prevMap, letter, index) => {
      const newMap: WordLetterMap = new Map(prevMap);
      if (prevMap.has(letter)) {
        const letterStats = prevMap.get(letter)!;
        newMap.set(letter, {
          qty: letterStats.qty + 1,
          pos: [...letterStats.pos, index],
        });
      } else {
        newMap.set(letter, { pos: [index], qty: 1 });
      }

      return newMap;
    }, map);
  }, [word]);

  const status: GameStatus = useMemo(() => {
    const hasWon = guesses.some((guess) => guess.join() === word);

    if (hasWon) return 'WON';

    if (guessCount === AMOUNT_OF_GUESSES) return 'LOST';

    return 'PLAYING';
  }, [word, guesses, guessCount]);

  const handleGameReset = useCallback(() => {
    setWord(getRandomWord(words));
    dispatch({ type: 'CLEAR' });
  }, []);

  const handleSubmitGuess: React.FormEventHandler<HTMLFormElement> =
    useCallback(
      (e) => {
        e.preventDefault();

        if (currentGuess.length !== WORD_LENGTH) {
          toastRef.current?.show(`guess must be ${WORD_LENGTH} letters long`);
          return;
        }

        const evaluatedGuess = evaluateGuess(currentGuess, wordLettersMap);

        dispatch({ type: 'ADD_GUESS', payload: evaluatedGuess });
      },
      [currentGuess, wordLettersMap]
    );

  const handleCurrentGuessChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      const guess = e.currentTarget.value;
      if (guess.length > 5) {
        return;
      }

      setCurrentGuess(guess);
    }, []);

  return (
    <section className='pt-4 max-w-lg mx-auto flex flex-col gap-4'>
      <Guesses guesses={guesses} />
      {status === 'PLAYING' && (
        <div className='flex flex-col gap-4'>
          <form onSubmit={handleSubmitGuess}>
            <fieldset className='flex gap-4'>
              <legend className='sr-only'>Make your guesses here!</legend>
              <label htmlFor='guess'>Enter a guess:</label>
              <input
                className='text-black'
                name='guess'
                id='guess'
                maxLength={5}
                type='text'
                onChange={handleCurrentGuessChange}
              />
            </fieldset>
          </form>
        </div>
      )}
      {status === 'WON' && <div className='flex flex-col gap-4'>You won!</div>}
      {status === 'LOST' && (
        <div className='flex flex-col gap-4'>You lost! The word was {word}</div>
      )}
      <button onClick={handleGameReset}>Reset Game</button>
      <Toast ref={toastRef} />
    </section>
  );
}

function Guesses({ guesses }: { guesses: Guess[] }) {
  return guesses.map((guess, i) => {
    return <Guess key={i} guess={guess} />;
  });
}

export default App;
