import { WORD_LENGTH } from '../../App';

export function Guess({ guess }: { guess: string }) {
  return (
    <div className='flex justify-center gap-4'>
      {[...Array.from({ length: WORD_LENGTH }, (_, index) => index + 1)].map(
        (_: number, i) => {
          return (
            <div
              key={i}
              className='box-content text-center text-2xl font-bold py-3 px-3 min-h-6 min-w-6 border-2 border-white'
            >
              L
            </div>
          );
        }
      )}
    </div>
  );
}
