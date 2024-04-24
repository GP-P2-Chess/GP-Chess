import { useEffect, useState, useCallback } from "react";
import Container from "@mui/material/Container";
import Game from "../components/Game";
import InitGame from "../components/InitGame";
import CustomDialog from "../components/CustomDialog";
import socket from "../socket";
import { TextField } from "@mui/material";

const GamePage = () => {
  const [username, setUsername] = useState("");
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);

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
    // const username = prompt("Username");
    // setUsername(username);
    // socket.emit("username", username);

    socket.on("opponentJoined", (roomData) => {
      console.log("roomData", roomData);
      setPlayers(roomData.players);
    });
  }, []);

  return (
    <Container>
      <CustomDialog
        open={!usernameSubmitted}
        handleClose={() => setUsernameSubmitted(true)}
        title="Pick a username"
        contentText="Please select a username"
        handleContinue={() => {
          if (!username) return;
          socket.emit("username", username);
          setUsernameSubmitted(true);
        }}
      >
        <TextField
          autoFocus
          margin="dense"
          id="username"
          label="Username"
          name="username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          fullWidth
          variant="standard"
        />
      </CustomDialog>
      {room ? (
        <Game
          room={room}
          orientation={orientation}
          username={username}
          players={players}
          // the cleanup function will be used by Game to reset the state when a game is over
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
  // const { id } = useParams();
  // const [orientation, setOrientation] = useState("");
  // const [room, setRoom] = useState("");
  // const [username, setUsername] = useState("");
  // const [players, setPlayers] = useState([]);
  // const [roomData, setRoomData] = useState({});
  // // const [loading, setLoading] = useState(false);
  // // const [room, SetRoom] = useState(undefined);
  // // console.log(id);

  // //FETCH ROOM
  // const fetchRoom = async () => {
  //   try {
  //     const { data } = await axios.get(`http://localhost:3000/room/${id}`, {
  //       headers: { Authorization: `Bearer ${localStorage.access_token}` },
  //     });
  //     setRoomData(data);
  //     if (data.FirstUser.username === username) setOrientation("white");
  //     if (data.SecondUser.username === username) setOrientation("black");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   //FETCH ROOM

  //   socket.auth = {
  //     username: localStorage.username,
  //   };

  //   setUsername(localStorage.username);
  //   fetchRoom();

  //   socket.on("refresh game", () => {
  //     fetchRoom();
  //   });
  // }, []);

  // console.log(roomData.history);

  // return (
  //   <section className="w-full grow flex flex-row justify-center items-center">
  //     {roomData ? (
  //       <>
  //         <div className="w-1/4 h-full flex flex-col justify-end items-center pb-12">
  //           <div>
  //             <img src="" alt="" />
  //           </div>
  //           <div>
  //             <p>Player Name</p>
  //             <p>Win Rate</p>
  //             <p>MMR</p>
  //           </div>
  //         </div>
  //         <div className="w-2/5">
  //           <Game
  //             room={room}
  //             orientation={orientation}
  //             username={username}
  //             history={roomData.history}
  //           />
  //         </div>
  //         <div className="w-1/4 h-full flex flex-col justify-start items-center pt-12 ">
  //           <div>
  //             <img src="" alt="" />
  //           </div>
  //           <div>
  //             <p>Opponent Name</p>
  //             <p>Win Rate</p>
  //             <p>MMR</p>
  //           </div>
  //         </div>
  //       </>
  //     ) : (
  //       ""
  //     )}
  //   </section>
  // );
};

export default GamePage;
