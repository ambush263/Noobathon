import { useState } from "react";
import { useNavigate } from "react-router-dom";
import pokemonImage from "../assets/images1.jpg";

import img1 from "../assets/images1.jpg";
import img2 from "../assets/images2.jpg";
import img3 from "../assets/images3.jpg";
import img4 from "../assets/images4.jpg";
import img5 from "../assets/images5.jpg";
import img6 from "../assets/images6.jpg";
import img7 from "../assets/images 7.jpg";
import img8 from "../assets/images8.jpg";
import img9 from "../assets/images9.jpg";

function Help() {
  const navigate = useNavigate();

  const gridSize = 9;

  const [selected, setSelected] = useState([]);
  const [round, setRound] = useState(1);
  const [textInput, setTextInput] = useState("");

  const correctSquaresMap = {
    1: [0, 1, 2, 3, 4, 5, 7, 8],
    2: [2, 4, 7]
  };

  const getInstruction = () => {
    if (round === 1) return "Select all Fire-type Pokémon";
    if (round === 2) return "Select all Water-type Pokémon";
    return "Type the original Pokémon slogan exactly:";
  };

  const toggleSquare = (index) => {
    if (selected.includes(index)) {
      setSelected(selected.filter((i) => i !== index));
    } else {
      setSelected([...selected, index]);
    }
  };

  const handleVerify = () => {

    // 🔥 ROUND 3 (TEXT CAPTCHA)
    if (round === 3) {
      const correctText = "gotta catch 'em all";

      if (textInput.trim().toLowerCase() === correctText) {
        alert("Internal Server Error. Please try again later.");
        navigate("/");   // 🔥 Redirect to Feed
      } else {
        alert("Incorrect slogan. Restarting verification.");
        setRound(1);
        setSelected([]);
        setTextInput("");
      }

      return;
    }

    // 🔥 ROUND 1 & 2
    const correctSquares = correctSquaresMap[round];

    const sortedSelected = [...selected].sort();
    const sortedCorrect = [...correctSquares].sort();

    const isCorrect =
      JSON.stringify(sortedSelected) === JSON.stringify(sortedCorrect);

    if (isCorrect) {
      alert("Correct. Additional verification required...");
      setRound(round + 1);
      setSelected([]);
    } else {
      alert("Incorrect selection. Restarting verification.");
      setRound(1);
      setSelected([]);
      setTextInput("");
    }
  };

  const round2Images = [
    img1, img2, img3,
    img4, img5, img6,
    img7, img8, img9
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Help Center</h1>
      <p>{getInstruction()}</p>
      <p>Round {round} of 3</p>

      {round === 1 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 60px)",
            gap: "5px",
            marginTop: "1rem"
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
                  width: "60px",
                  height: "60px",
                  backgroundImage: `url(${pokemonImage})`,
                  backgroundSize: "180px 180px",
                  backgroundPosition: `-${col * 60}px -${row * 60}px`,
                  border: selected.includes(index)
                    ? "2px solid red"
                    : "1px solid #aaa",
                  cursor: "pointer"
                }}
              />
            );
          })}
        </div>
      )}

      {round === 2 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 60px)",
            gap: "5px",
            marginTop: "1rem"
          }}
        >
          {round2Images.map((img, index) => (
            <div
              key={index}
              onClick={() => toggleSquare(index)}
              style={{
                width: "60px",
                height: "60px",
                border: selected.includes(index)
                  ? "2px solid red"
                  : "1px solid #aaa",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff"
              }}
            >
              <img
                src={img}
                alt="pokemon"
                style={{ width: "55px", height: "55px" }}
              />
            </div>
          ))}
        </div>
      )}

      {round === 3 && (
        <div style={{ marginTop: "1rem" }}>
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter slogan..."
            style={{ padding: "6px", width: "250px" }}
          />
        </div>
      )}

      <button
        style={{ marginTop: "1rem", padding: "6px 12px" }}
        onClick={handleVerify}
      >
        Verify
      </button>
    </div>
  );
}

export default Help;