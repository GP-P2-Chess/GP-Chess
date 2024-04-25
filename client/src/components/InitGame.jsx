import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import CustomDialog from "./CustomDialog";
import socket from "../socket";

export default function InitGame({ setRoom, setOrientation, setPlayers }) {
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [roomInput, setRoomInput] = useState(""); // input state
  const [roomError, setRoomError] = useState("");

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{ py: 1, flexGrow: 1, height: "100%" }}
    >
      <CustomDialog
        open={roomDialogOpen}
        handleClose={() => setRoomDialogOpen(false)}
        title="Select Room to Join"
        contentText="Enter a valid room ID to join the room"
        handleContinue={() => {
          // join a room
          socket.emit("joinRoom", { roomId: roomInput }, (r) => {
            // r is the response from the server
            if (r.error) {
              console.log(r.error);
              return setRoomError(r.message);
            } // if an error is returned in the response set roomError to the error message and exit
            console.log("response:", r);
            setRoom(r?.roomId); // set room to the room ID
            setPlayers(r?.players); // set players array to the array of players in the room
            setOrientation("black"); // set orientation as black
            setRoomDialogOpen(false); // close dialog
          });
        }}
      >
        <TextField
          autoFocus
          margin="dense"
          id="room"
          label="Room ID"
          name="room"
          value={roomInput}
          required
          onChange={(e) => setRoomInput(e.target.value)}
          type="text"
          fullWidth
          variant="standard"
          error={Boolean(roomError)}
          helperText={
            !roomError ? "Enter a room ID" : `Invalid room ID: ${roomError}`
          }
        />
      </CustomDialog>

      {/* BUTTON BUAT CREATE GAME */}
      <button
        className="btn btn-primary text-slate-200"
        onClick={() => {
          // create a room
          socket.emit("createRoom", (r) => {
            console.log(r);
            setRoom(r);
            setOrientation("white");
          });
        }}
      >
        Start a game
      </button>
      <br />
      {/* BUTTON BUAT JOIN GAME */}
      <button
        className="btn btn-outline btn-primary"
        onClick={() => {
          setRoomDialogOpen(true);
        }}
      >
        Join a game
      </button>
    </Stack>
  );
}
