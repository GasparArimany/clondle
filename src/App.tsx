import { useCallback, useMemo, useState } from 'react';
import { words } from './words';
import { getRandomWord } from './utils';
import { Toast } from './components/Toast/Toast';

const AMOUNT_OF_GUESSES = 6;

function App() {
  return (
    <main className='bg-gray-800 text-zinc-200 h-screen w-full'>
      <Game />
    </main>
  );
}

type GameStatus = 'playing' | 'won' | 'lost';

function Game() {
  const [word, setWord] = useState(getRandomWord(words));
  const [currentGuess, setCurrentGuess] = useState('');

  const [guesses, setGuesses] = useState<string[]>([]);

  const [errorMessage, setErrorMessage] = useState('');

  const isToastOpen = useMemo(() => errorMessage !== '', [errorMessage]);

  const status: GameStatus = useMemo(() => {
    const hasWon = guesses.some((guess) => guess === word);

    if (hasWon) return 'won';

    if (guesses.length === AMOUNT_OF_GUESSES) return 'lost';

    return 'playing';
  }, [word, guesses]);

  const handleGameReset = useCallback(() => {
    // todo reset game status
    setWord(getRandomWord(words));
    setGuesses([]);
  }, []);

  const handleSubmitGuess: React.FormEventHandler<HTMLFormElement> =
    useCallback(
      (e) => {
        e.preventDefault();

        if (currentGuess.length !== 5) {
          setErrorMessage('guess must be 5 letters long');
          return;
        }

        setGuesses((prevGuesses) => [...prevGuesses, currentGuess]);
      },
      [currentGuess]
    );

  const handleCurrentGuessChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      const guess = e.currentTarget.value;
      if (guess.length > 5) {
        return;
      }

      setCurrentGuess(guess);
    }, []);

  const clearError = useCallback(() => {
    setErrorMessage('');
  }, []);

  return (
    <section className='max-w-lg my-0 mx-auto flex flex-col gap-4'>
      <Guesses guesses={guesses} />
      {status === 'playing' && (
        <div className='flex flex-col gap-4'>
          <form onSubmit={handleSubmitGuess}>
            <fieldset className='flex gap-4'>
              <legend className='sr-only'>Make your guesses here!</legend>
              <label htmlFor='guess'>Enter a guess:</label>
              <input
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
      {status === 'won' && <div className='flex flex-col gap-4'>You won!</div>}
      {status === 'lost' && (
        <div className='flex flex-col gap-4'>You lost! The word was {word}</div>
      )}
      <button onClick={handleGameReset}>Reset Game</button>
      <Toast
        isOpen={isToastOpen}
        message={errorMessage}
        onDismiss={clearError}
      />
    </section>
  );
}

function Guesses({ guesses }: { guesses: string[] }) {
  return [
    ...Array.from({ length: AMOUNT_OF_GUESSES }, (_, index) => index + 1),
  ].map((num: number, i) => {
    return <Guess key={num} guess={guesses[i]} />;
  });
}

function Guess({ guess }: { guess: string }) {
  return <div>{guess}</div>;
}

export default App;
