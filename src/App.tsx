import { useState } from 'react';

const AMOUNT_OF_GUESSES = 6;

function App() {
  return (
    <main className='bg-gray-800 h-screen w-full'>
      <Game />
    </main>
  );
}

function Game() {
  return (
    <section className='max-w-lg border-2 border-slate-100 my-0 mx-auto'>
      <Guesses />
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
