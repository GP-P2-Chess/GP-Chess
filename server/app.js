require("dotenv").config();
const { Room, User } = require("./models/index");
const { Server } = require("socket.io");
const { createServer } = require("http");
const { v4: uuidV4 } = require("uuid");
const express = require("express");
const app = express();
const cors = require("cors");
const ErrorHandler = require("./middlewares/errorHandler");
const ControllerUser = require("./controllers/controllerUser");
const ControllerGame = require("./controllers/controllerGame");
const Authentication = require("./middlewares/authentication");
const authorization = require("./middlewares/authorization");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

app.post("/register", ControllerUser.Register);
app.post("/login", ControllerUser.Login);

//authentication
app.use(Authentication);

app.get("/rooms", ControllerGame.readRooms);
app.post("/room", ControllerGame.createRoom);
app.get("/room/:id", ControllerGame.readOneRoom);
app.put("/room/:id/join", authorization, ControllerGame.joinRoom);
app.put("/room/:id", ControllerGame.updateRoom);
app.put("/room/winner/:id", ControllerGame.updateWinner);
app.get("/leaderboard", ControllerGame.leaderBoard);

app.use(ErrorHandler);

const rooms = new Map();

io.on("connection", (socket) => {
  console.log(socket.id, "connected");

  socket.on("username", (username) => {
    console.log("username:", username);
    socket.data.username = username;
  });

  // createRoom
  socket.on("createRoom", async (callback) => {
    // callback here refers to the callback function from the client passed as data
    const roomId = uuidV4(); //GENERATE ID ROOM PAKE UUID
    await socket.join(roomId); // USER YANG CREATE BAKAL JOIN ROOMIDNYA

    //BIKIN ROOMID JADI KEY DAN KITA MASUKAN DATA USER
    rooms.set(roomId, {
      // <- 3
      roomId,
      players: [{ id: socket.id, username: socket.data?.username }],
    });
    // returns Map(1){'2b5b51a9-707b-42d6-9da8-dc19f863c0d0' => [{id: 'socketid', username: 'username1'}]}

    callback(roomId); // <- 4 respond with roomId to client by calling the callback function from the client
  });

  socket.on("joinRoom", async (args, callback) => {
    // check if room exists and has a player waiting
    const room = rooms.get(args.roomId);
    console.log(room);
    let error, message;

    //CEK ROOMNYA
    if (!room) {
      //KALO ROOM GA ADA
      error = true;
      message = "room does not exist";
    } /*else if (room.length <= 0) { 
      error = true;
      message = "room is empty";
    }*/ else if (room.players.length > 1) {
      //SET MAXIMAL PLAYER ITU 2
      error = true;
      message = "room is full";
    }

    if (error) {
      if (callback) {
        //KALO ADA ERROR & KALO KITA MASUKIN CALLBACK, KITA BALIKIN KE CALLBACKNYA
        callback({
          error,
          message,
        });
      }

      return;
    }

    await socket.join(args.roomId); // JOIN ROOM

    //KITA MASUKIN DATA KITA DI SPREAD SUPAYA GABUNG SAMA DATA SEBELUMNYA
    const roomUpdate = {
      ...room,
      players: [
        ...room.players,
        { id: socket.id, username: socket.data?.username },
      ],
    };

    //KITA SET ULANG ROOMS KITA DENGAN DATA TERBARU
    rooms.set(args.roomId, roomUpdate);

    callback(roomUpdate); //KITA PASSING DATA ROOMUPDATE

    //KITA KIRIM EVENT OPPONENTJOINED ISINYA DATA ROOMUPDATE KE ROOMID
    socket.to(args.roomId).emit("opponentJoined", roomUpdate);
  });

  socket.on("move", (data) => {
    // emit to all sockets in the room except the emitting socket.
    socket.to(data.room).emit("move", data.move);
  });

  socket.on("disconnect", () => {
    const gameRooms = Array.from(rooms.values()); // <- 1

    gameRooms.forEach((room) => {
      // <- 2
      const userInRoom = room.players.find((player) => player.id === socket.id); // <- 3

      if (userInRoom) {
        if (room.players.length < 2) {
          // if there's only 1 player in the room, close it and exit.
          rooms.delete(room.roomId);
          return;
        }

        socket.to(room.roomId).emit("playerDisconnected", userInRoom); // <- 4
      }
    });
  });

  socket.on("closeRoom", async (data) => {
    socket.to(data.roomId).emit("closeRoom", data); // <- 1 inform others in the room that the room is closing

    const clientSockets = await io.in(data.roomId).fetchSockets(); // <- 2 get all sockets in a room

    // loop over each socket client
    clientSockets.forEach((s) => {
      s.leave(data.roomId); // <- 3 and make them leave the room on socket.io
    });

    rooms.delete(data.roomId); // <- 4 delete room from rooms map
  });
});

module.exports = server;
