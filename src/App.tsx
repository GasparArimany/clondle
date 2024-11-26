import { useCallback, useMemo, useRef, useState } from 'react';
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

function evaluateGuess(guess: string, word: string): Guess {
  return guess.split('').reduce((count, letter, i) => {
    const evaluatedLetter: GuessLetter = { letter, status: 'COVERED' };

    if (word.includes(letter) && word[i] === letter) {
      evaluatedLetter.status = 'IN_PLACE';
    }

    if (word.includes(letter) && word[i] !== letter) {
      evaluatedLetter.status = 'MISPLACED';
    }

    if (!word.includes(letter)) {
      evaluatedLetter.status = 'NOT_IN_WORD';
    }

    return [...count, evaluatedLetter];
  }, [] as Guess);
}

function createsGuessesInitialState(): Guess[] {
  return Array<Guess>(AMOUNT_OF_GUESSES).fill(
    Array<GuessLetter>(WORD_LENGTH).fill({ letter: '', status: 'COVERED' })
  );
}

function hasRemainingGuesses(guesses: Guess[]): boolean {
  return guesses.some((guess) =>
    guess.find((guessLetter) => guessLetter.status === 'COVERED')
  );
}

// todo try having a state for the amount of guesses made given that the array of guesses now includes unused guesses and can't be used to derive game state
function Game() {
  const [word, setWord] = useState(getRandomWord(words));
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<Guess[]>(createsGuessesInitialState);
  const toastRef = useRef<ToastRef | null>(null);

  const status: GameStatus = useMemo(() => {
    const hasWon = guesses.some((guess) => guess.join() === word);

    if (hasWon) return 'WON';

    if (!hasRemainingGuesses(guesses)) return 'LOST';

    return 'PLAYING';
  }, [word, guesses]);

  const handleGameReset = useCallback(() => {
    setWord(getRandomWord(words));
    setGuesses([]);
  }, []);

  const handleSubmitGuess: React.FormEventHandler<HTMLFormElement> =
    useCallback(
      (e) => {
        e.preventDefault();

        if (currentGuess.length !== WORD_LENGTH) {
          toastRef.current?.show(`guess must be ${WORD_LENGTH} letters long`);
          return;
        }

        const evaluatedGuess = evaluateGuess(currentGuess, word);

        setGuesses((prevGuesses) => [...prevGuesses, evaluatedGuess]);
      },
      [currentGuess, word]
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
