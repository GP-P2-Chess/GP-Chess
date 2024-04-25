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
          // JOIN ROOM
          socket.emit("joinRoom", { roomId: roomInput }, (r) => {
            if (r.error) {
              console.log(r.error);
              return setRoomError(r.message);
            }
            console.log("response:", r);
            setRoom(r?.roomId); // SET ROOM ID DARI BALIKAN R
            setPlayers(r?.players); // TAMBAHAIN PLAYERS
            setOrientation("black"); // KASIH DIA JADI HITAM
            setRoomDialogOpen(false); // CLOSE MODAL
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
