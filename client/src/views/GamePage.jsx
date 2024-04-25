import { useEffect, useState, useCallback } from "react";
import Container from "@mui/material/Container";
import Game from "../components/Game";
import InitGame from "../components/InitGame";
import socket from "../socket";

const GamePage = () => {
  const [room, setRoom] = useState("");
  const [orientation, setOrientation] = useState("");
  const [players, setPlayers] = useState([]);

  // resets the states responsible for initializing a game
  const cleanup = useCallback(() => {
    setRoom("");
    setOrientation("");
    setPlayers("");
  }, []);

  useEffect(() => {
    //edit
    socket.connect();
    socket.emit("username", localStorage.username);

    socket.on("opponentJoined", (roomData) => {
      console.log("roomData", roomData);
      setPlayers(roomData.players);
    });

    return () => {
      socket.off("opponentJoined");
      socket.disconnect();
    };
  }, []);

  return (
    <Container>
      {room ? (
        <Game
          room={room}
          orientation={orientation}
          username={localStorage.username}
          players={players}
          //CLEANUP DIPAKAI HANYA UNTUK RESET GAME SETELAH SELESAI PERMAINAN
          cleanup={cleanup}
        />
      ) : (
        <InitGame
          setRoom={setRoom}
          setOrientation={setOrientation}
          setPlayers={setPlayers}
        />
      )}
    </Container>
  );
};

export default GamePage;
