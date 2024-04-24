import { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
// import CustomDialog from "./components/CustomDialog";

function Game({ players, room, orientation, cleanup }) {
  const chess = useMemo(() => new Chess(), []); // <- 1
  console.log(chess);
  const [fen, setFen] = useState(chess.fen()); // <- 2
  const [over, setOver] = useState("");
  console.log(chess.fen());

  // onDrop function
  const onDrop = async (sourceSquare, targetSquare) => {
    const moveData = {
      from: sourceSquare,
      to: targetSquare,
      color: chess.turn(),
      promotion: "q",
    };
    const move = makeAMove(moveData);

    if (move === null) return false;

    return true;
  };

  const makeAMove = useCallback((move) => {
    try {
      const result = chess.move(move);
      setFen(chess.fen());

      console.log("over, checkmate", chess.isGameOver(), chess.isCheckmate());

      if (chess.isGameOver()) {
        // check if move led to "game over"
        if (chess.isCheckmate()) {
          // if reason for game over is a checkmate
          // Set message to checkmate.
          setOver(
            `Checkmate! ${chess.turn() === "w" ? "black" : "white"} wins!`
          );
          // The winner is determined by checking which side made the last move
        } else if (chess.isDraw()) {
          // if it is a draw
          setOver("Draw"); // set message to "Draw"
        } else {
          setOver("Game over");
        }
      }

      return result;
    } catch (error) {
      return null;
    }
  });

  // Game component returned jsx
  return (
    <>
      <div className="board">
        <Chessboard position={fen} onPieceDrop={onDrop} /> {/**  <- 4 */}
      </div>
      {/* <CustomDialog // <- 5
        open={Boolean(over)}
        title={over}
        contentText={over}
        handleContinue={() => {
          setOver("");
        }}
      /> */}
    </>
  );
}

export default Game;
