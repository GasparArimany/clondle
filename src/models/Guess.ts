export type LetterStatus = "MISPLACED" | "IN_PLACE" | "NOT_IN_WORD" | "EMPTY";
export type GuessLetter = { letter: string; status: LetterStatus };
export type Guess = Array<GuessLetter>;
