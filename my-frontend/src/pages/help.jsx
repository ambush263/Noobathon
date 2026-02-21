import { useState } from "react";
import pokemonImage from "../assets/images1.jpg";

function Help() {
  const gridSize = 9;

  const generateCorrectSquares = () => {
    const arr = [];
    while (arr.length < 3) {
      const rand = Math.floor(Math.random() * gridSize);
      if (!arr.includes(rand)) arr.push(rand);
    }
    return arr;
  };

  const [correctSquares, setCorrectSquares] = useState(generateCorrectSquares());
  const [selected, setSelected] = useState([]);
  const [round, setRound] = useState(1);

  const toggleSquare = (index) => {
    if (selected.includes(index)) {
      setSelected(selected.filter((i) => i !== index));
    } else {
      setSelected([...selected, index]);
    }
  };

 const handleVerify = () => {
  const sortedSelected = [...selected].sort();
  const sortedCorrect = [...correctSquares].sort();

  const isCorrect =
    JSON.stringify(sortedSelected) === JSON.stringify(sortedCorrect);

  if (isCorrect) {
    if (round < 3) {
      alert("Correct. Additional verification required...");
      setRound(round + 1);
      setCorrectSquares(generateCorrectSquares());
      setSelected([]);
    } else {
      alert("Verification timeout. Please try again later.");
      setRound(1);
      setCorrectSquares(generateCorrectSquares());
      setSelected([]);
    }
  } else {
    alert("Incorrect selection. Restarting verification.");
    setRound(1);
    setCorrectSquares(generateCorrectSquares());
    setSelected([]);
  }
};

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Help Center</h1>
      <p>Select all tiles containing Fire-type Pokémon</p>
      <p>Verification Round {round} of 3</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 25px)",
          gap: "2px",
          marginTop: "1rem",
          filter: "blur(0.5px)"
        }}
      >
        {Array.from({ length: gridSize }).map((_, index) => {
          const row = Math.floor(index / 3);
          const col = index % 3;

          return (
            <div
              key={index}
              onClick={() => toggleSquare(index)}
              style={{
                width: "25px",
                height: "25px",
                backgroundImage: `url(${pokemonImage})`,
                backgroundSize: "75px 75px",
                backgroundPosition: `-${col * 25 + Math.random() * 2}px -${row * 25 + Math.random() * 2}px`,
                border: selected.includes(index)
                  ? "2px solid red"
                  : "1px solid #aaa",
                cursor: "pointer",
                transition: "all 0.1s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(0.95)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          );
        })}
      </div>

      <button
        style={{
          marginTop: "1.5rem",
          padding: "6px 12px",
          cursor: "pointer"
        }}
        onClick={handleVerify}
      >
        Verify
      </button>
    </div>
  );
}

export default Help;