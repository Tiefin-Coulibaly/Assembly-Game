import { useState } from "react";
import clsx from "clsx";
import { languages } from "./assets/data/languages";
import { getFarewellText, getRandomWord } from "./utils/utils";

export default function AssemblyGame() {
  // STATE VALUES
  // State to store the current word
  const [currentWord, setCurrentWOrd] = useState(() => getRandomWord());

  // State to store user's guessed letters
  const [guessedLetters, setGuessedLetters] = useState([]);

  // DERIVED VALUES
  const numGuessesLeft = languages.length - 1;
  const wrongGuessCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;
  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const isGameLost = wrongGuessCount >= numGuessesLeft;
  const isGameOver = isGameWon || isGameLost;
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
  const isLastGuessIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  // STATIC VALUES
  // Function to handle user interactions : store the letter clicked into state
  const addGuessedLetter = (letter) => {
    setGuessedLetters((prevGuessedLetters) => [
      ...new Set([...prevGuessedLetters, letter]),
    ]);
  };

  const resetGame = () => {
    setGuessedLetters([]);
    setCurrentWOrd(getRandomWord());
  };

  //Create languages chips by mapping through the languages array
  const languageChips = languages.map((language, index) => {
    const styles = {
      backgroundColor: language.backgroundColor,
      color: language.color,
    };

    const isLanguageLost = index < wrongGuessCount;
    const lostLanguageClassName = clsx(
      isLanguageLost &&
        "before:content-['💀'] before:absolute before:flex before:justify-center before:items-center before:top-0 before:left-0 before:bottom-0 before:right-0 before:bg-black/70 before:text-sm before:rounded"
    );

    return (
      <span
        style={styles}
        key={language.name}
        className={`font-bold text-xs text-center p-2 rounded relative ${lostLanguageClassName}`}
      >
        {language.name}
      </span>
    );
  });

  //   Create letter elements by mapping through the state converted into an array of letters
  const letterElements = currentWord.split("").map((letter, index) => {
    const shouldRevealLetter = isGameLost || guessedLetters.includes(letter);

    const revealMissingLettersClassName = clsx(
      isGameLost && !guessedLetters.includes(letter) && "text-rose-600"
    );

    return (
      <span
        key={index}
        className={`size-11 flex justify-center items-center text-center border-b border-b-[#F9F4DA] uppercase bg-[#323232] inline-block ${revealMissingLettersClassName}`}
      >
        {shouldRevealLetter ? letter.toUpperCase() : ""}
      </span>
    );
  });

  // Create alphabet elements
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const alphabetElements = alphabet.split("").map((letter) => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !currentWord.includes(letter);
    const className = clsx({
      "bg-green-700": isCorrect,
      "bg-rose-600": isWrong,
      "hover:cursor-not-allowed opacity-50": isGameOver,
    });

    return (
      <button
        key={letter}
        disabled={isGameOver}
        aria-disabled={guessedLetters.includes(letter)}
        aria-label={`Letter ${letter}`}
        className={`font-semibold text-[#1E1E1E] size-11 flex justify-center items-center uppercase rounded border border-[#D7D7D7] bg-[#FCBA29] ${className}`}
        onClick={() => addGuessedLetter(letter)}
      >
        {letter}
      </button>
    );
  });

  const gameStatusClassName = clsx({
    "bg-green-500": isGameWon,
    "bg-[#BA2A2A]": isGameLost,
    "bg-purple-400 border border-dashed border-[#323232] italic ":
      !isGameOver && isLastGuessIncorrect,
  });

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return <p>"{getFarewellText(languages[wrongGuessCount - 1].name)}"</p>;
    }

    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      );
    }

    if (isGameLost) {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      );
    }

    return null;
  }

  return (
    <main className="flex justify-center items-center min-h-screen w-full font-['Hanken_Grotesk'] text-sm md:text-base lg:text-lg">
      {/* Game container */}
      <div className=" w-16/17 md:w-[594px] md:h-[726px]  bg-[#282726] flex flex-col py-10 md:py-0 justify-center items-center gap-2 md:gap-5 font-medium">
        {/* Header */}
        <header className=" text-center px-2 w-3/4 md:w-2/3">
          <h1 className=" text-xl md:text-2xl lg:text-3xl text-[#F9F4DA] mb-2">
            Assembly: Endgame
          </h1>
          <p className="text-[#8E8E8E] ">
            Guess the word in under 8 attempts to keep the programming world
            safe from Assembly!
          </p>
        </header>

        {/* Status Section */}
        <section
          aria-live="polite"
          role="Status"
          className={`px-2 w-2/3 rounded flex flex-col justify-center items-center text-[#F9F4DA] text-sm md:text-base lg:text-lg ${gameStatusClassName}`}
        >
          {renderGameStatus()}
        </section>

        {/* Languages Section */}
        <section className="flex flex-wrap justify-center items-center w-3/4 md:w-2/4 gap-1 my-4">
          {/* Render the language chips array */}
          {languageChips}
        </section>

        {/* Current Word Section */}
        <section className="w-3/4 text-[#F9F4DA] font-bold  flex justify-center gap-0.5 mb-10">
          {letterElements}
        </section>

        {/* Screen readers only section */}
        <section className="sr-only" aria-live="polite" role="Status">
          <p>
            {currentWord.includes(lastGuessedLetter)
              ? `Correct! The letter ${lastGuessedLetter} is in the word.`
              : `Sorry, the letter ${lastGuessedLetter} is not in the word.`}
            You have {numGuessesLeft} attempts left.
          </p>
          <p>
            Current word:{" "}
            {currentWord
              .split("")
              .map((letter) =>
                guessedLetters.includes(letter) ? letter + "." : "blank."
              )
              .join(" ")}
          </p>
        </section>

        {/* Alphabet letters section */}
        <section className="flex justify-center mx-1 flex-wrap md:w-7/8 gap-1 items-center">
          {alphabetElements}
        </section>

        {/* New Game button */}
        {isGameOver && (
          <section>
            <button
              onClick={resetGame}
              className="w-[228px] h-10 text-[#1E1E1E] font-semibold capitalize rounded border border-[#D7D7D7] flex justify-center items-center bg-[#11B5E5] mt-4"
            >
              New Game
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
