import { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import CustomDialog from "./CustomDialog";
import socket from "../socket";
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import useSound from "use-sound";
import dropSfx from "../assets/sound/dropChess.mp3";

function Game({ players, room, orientation, cleanup }) {
  const [playDrop] = useSound(dropSfx);
  const chess = useMemo(() => new Chess(), []); // SUPAYA CHESS INI BISA INGET PERHITUNGAN TERAKHIRNYA

  const [fen, setFen] = useState(chess.fen()); // POSISI CHESSNYA
  const [over, setOver] = useState(""); //BUAT NENTUIN SELESAI APA BELOM

  const makeAMove = useCallback(
    (move) => {
      try {
        const result = chess.move(move); // update Chess instance
        setFen(chess.fen()); // UPDATE FEN STATE BUAT RE-RENDER NANTI

        console.log("over, checkmate", chess.isGameOver(), chess.isCheckmate());

        //CHECK GAMENYA SELESAI ATAU BELUM
        if (chess.isGameOver()) {
          if (chess.isCheckmate()) {
            setOver(
              `Checkmate! ${chess.turn() === "w" ? "black" : "white"} wins!`
            );
          } else if (chess.isDraw()) {
            setOver("Draw");
          } else {
            setOver("Game over");
          }
        }

        return result;
      } catch (e) {
        return null;
        //KALAU ILLEGAL RETURN NULL TIDAK TERJADI APA2
      }
    },
    [chess]
  );

  // onDrop function
  function onDrop(sourceSquare, targetSquare) {
    //CEK TURNNYA SAMA APA NGGA SAMA WARNA CATUR KITA
    if (chess.turn() !== orientation[0]) return false;

    //BUAT NUNGGU USER YANG JOIN
    if (players.length < 2) return false;

    const moveData = {
      from: sourceSquare,
      to: targetSquare,
      color: chess.turn(),
      promotion: "q", // BUAT PROMOSI QUEEN PEON SAMPE UJUNG
    };

    const move = makeAMove(moveData);

    // CEK MOVENYA ILLEGAL APA NGGA
    if (move === null) return false;

    //KIRIM KE SERVER MOVENYA
    socket.emit("move", {
      move,
      room,
    });

    playDrop();

    return true;
  }

  useEffect(() => {
    socket.on("move", (move) => {
      makeAMove(move); //
    });
  }, [makeAMove]);

  useEffect(() => {
    socket.on("playerDisconnected", (player) => {
      setOver(`${player.username} has disconnected`); // set game over
    });
  }, []);

  useEffect(() => {
    socket.on("closeRoom", ({ roomId }) => {
      if (roomId === room) {
        cleanup();
      }
    });
  }, [room, cleanup]);

  // Game component returned jsx
  return (
    <Stack>
      <Card>
        <CardContent>
          <Typography variant="h5">Room ID: {room}</Typography>
        </CardContent>
      </Card>
      <Stack flexDirection="row" sx={{ pt: 2 }}>
        <div
          className="board"
          style={{
            maxWidth: 600,
            maxHeight: 600,
            flexGrow: 1,
          }}
        >
          <Chessboard
            position={fen}
            onPieceDrop={onDrop}
            boardOrientation={orientation}
          />
        </div>
        {players.length > 0 && (
          <Box>
            <List>
              <ListSubheader>Players</ListSubheader>
              {players.map((p) => (
                <ListItem key={p.id}>
                  <ListItemText primary={p.username} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Stack>
      <div>
        <h1>Turn : {chess.turn() === "w" ? "White" : "Black"}</h1>
      </div>
      <CustomDialog // Game Over CustomDialog
        open={Boolean(over)}
        title={over}
        contentText={over}
        handleContinue={() => {
          socket.emit("closeRoom", { roomId: room });
          cleanup();
        }}
      />
    </Stack>
  );
}

export default Game;
