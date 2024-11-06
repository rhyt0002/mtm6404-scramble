/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
// React App
const { useState, useEffect } = React;

function App() {
  // Game Constants
  const WORDS = ["apple", "banana", "orange", "grape", "lemon", "melon", "berry", "peach", "mango", "kiwi"];
  const MAX_STRIKES = 3;
  const MAX_PASSES = 2;

  // State Variables
  const [words, setWords] = useState([]);
  const [scrambledWord, setScrambledWord] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [guess, setGuess] = useState("");
  const [points, setPoints] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [passes, setPasses] = useState(MAX_PASSES);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);

  // Load Game State from Local Storage
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("scrambleGameState"));
    if (savedState) {
      setWords(savedState.words);
      setScrambledWord(savedState.scrambledWord);
      setCurrentWord(savedState.currentWord);
      setPoints(savedState.points);
      setStrikes(savedState.strikes);
      setPasses(savedState.passes);
      setGameOver(savedState.gameOver);
    } else {
      resetGame();
    }
  }, []);

  // Save Game State to Local Storage
  useEffect(() => {
    const gameState = {
      words,
      scrambledWord,
      currentWord,
      points,
      strikes,
      passes,
      gameOver,
    };
    localStorage.setItem("scrambleGameState", JSON.stringify(gameState));
  }, [words, scrambledWord, currentWord, points, strikes, passes, gameOver]);

  // Generate a Scrambled Word
  const getScrambledWord = (word) => {
    return shuffle(word.split("")).join("");
  };

  // Start New Game
  const resetGame = () => {
    const shuffledWords = shuffle(WORDS);
    setWords(shuffledWords);
    setCurrentWord(shuffledWords[0]);
    setScrambledWord(getScrambledWord(shuffledWords[0]));
    setGuess("");
    setPoints(0);
    setStrikes(0);
    setPasses(MAX_PASSES);
    setMessage("");
    setGameOver(false);
  };

  // Handle Guess
  const handleGuess = (event) => {
    event.preventDefault();
    if (gameOver) return;

    if (guess.toLowerCase() === currentWord.toLowerCase()) {
      setPoints(points + 1);
      moveToNextWord();
    } else {
      setStrikes(strikes + 1);
      setMessage("Incorrect guess. Try again!");
      if (strikes + 1 >= MAX_STRIKES) {
        endGame();
      }
    }
    setGuess("");
  };

  // Move to Next Word
  const moveToNextWord = () => {
    const remainingWords = words.slice(1);
    if (remainingWords.length === 0) {
      endGame();
    } else {
      setWords(remainingWords);
      setCurrentWord(remainingWords[0]);
      setScrambledWord(getScrambledWord(remainingWords[0]));
      setMessage("Correct! Next word.");
    }
  };

  // Handle Pass
  const handlePass = () => {
    if (passes > 0) {
      setPasses(passes - 1);
      moveToNextWord();
    } else {
      setMessage("No passes remaining.");
    }
  };

  // End Game
  const endGame = () => {
    setGameOver(true);
    setMessage("Game Over. Final Score: " + points);
  };

  // Handle Play Again
  const handlePlayAgain = () => {
    resetGame();
  };

  return (
    <div className="game">
      <h1>Scramble Game</h1>
      {!gameOver && (
        <>
          <p>Scrambled Word: <strong>{scrambledWord}</strong></p>
          <form onSubmit={handleGuess}>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Type your guess"
              autoFocus
            />
            <button type="submit">Guess</button>
          </form>
          <button onClick={handlePass} disabled={passes === 0}>Pass ({passes} left)</button>
          <p>{message}</p>
          <p>Points: {points} | Strikes: {strikes}/{MAX_STRIKES}</p>
        </>
      )}
      {gameOver && (
        <>
          <p>{message}</p>
          <button onClick={handlePlayAgain}>Play Again</button>
        </>
      )}
    </div>
  );
}

// Render App
ReactDOM.createRoot(document.body).render(<App />);
