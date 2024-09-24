import { useCallback, useMemo, useState } from 'react';
import { words } from './words';
import { getRandomWord } from './utils';

const AMOUNT_OF_GUESSES = 6;

function App() {
  return (
    <main className='bg-gray-800 h-screen w-full'>
      <Game />
    </main>
  );
}

function Game() {
  const [word, setWord] = useState(getRandomWord(words));
  const [guesses, setGuesses] = useState<string[]>([]);

  const usedLetters = useMemo(() => {
    const letterSet = new Set();

    const lastGuess = guesses[guesses.length - 1];
    lastGuess.split('').forEach((letter) => {
      letterSet.add(letter);
    });

    return;
  }, [guesses]);

  const handleReset = useCallback(() => {
    setWord(getRandomWord(words));
    setGuesses([]);
  }, []);

  return (
    <section className='max-w-lg border-2 border-slate-100 my-0 mx-auto'>
      <Guesses />
      <div className='flex flex-col gap-4'>
        <button onClick={handleReset}>Reset the word</button>
        <span className='text-zinc-200'>{word}</span>
      </div>
    </section>
  );
}

function Guesses() {
  return [
    ...Array.from({ length: AMOUNT_OF_GUESSES }, (_, index) => index + 1),
  ].map((num: number) => {
    return <Guess key={num} guess={num} />;
  });
}

function Guess({ guess }: { guess: number }) {
  return <div>{guess}</div>;
}

export default App;
