if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
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
  cors: { origin: "https://gp-chess-client.vercel.app/" },
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
    // CALLBACK DIPAKE UNTUK PASSING DATA KE CLIENT
    const roomId = uuidV4(); //GENERATE ID ROOM PAKE UUID
    await socket.join(roomId); // USER YANG CREATE BAKAL JOIN ROOMIDNYA

    //BIKIN ROOMID JADI KEY DAN KITA MASUKAN DATA USER
    rooms.set(roomId, {
      roomId,
      players: [{ id: socket.id, username: socket.data?.username }],
    });

    callback(roomId); // OPER ROOMID KE CLIENT LEWAT CALLBACK
  });

  socket.on("joinRoom", async (args, callback) => {
    const room = rooms.get(args.roomId);
    let error, message;

    //CEK ROOMNYA
    if (!room) {
      //KALO ROOM GA ADA
      error = true;
      message = "room does not exist";
    } else if (room.players.length > 1) {
      //SET MAXIMAL PLAYER ITU 2 || 1 DARI JOIN || 1 DARI CREATE JADI > 1 ATAU < 1 ATAU == 0
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
    //KITA KIRIM KE ROOMNYA SAMA BROADCAST KE SEMUA YANG ADA DI ROOM MOVENYA
    socket.to(data.room).emit("move", data.move);
  });

  //SOCKET IO PUNYA EVENT SPECIAL DISCONNECT YANG DIMANA USER KALO KELUAR LANGSUNG DISCONNECT LANGSUNG KETERIMA SAMA INI
  socket.on("disconnect", () => {
    const gameRooms = Array.from(rooms.values()); //KITA AMBIL SEMUA ROOMS YANG ADA BENTUK ARRAY

    gameRooms.forEach((room) => {
      //KITA MAP KITA CARI ID PLAYERNYA DISETIAP ROOM YANG ADA
      const userInRoom = room.players.find((player) => player.id === socket.id); // <- 3

      if (userInRoom) {
        //KALAU TRUE, PLAYERNYA KETEMU
        if (room.players.length < 2) {
          //KALAU PLAYERNYA CUMAN ADA 1 BERARTI KITA LANGSUNG DELETE ROOMNYA
          rooms.delete(room.roomId);
          return;
        }
        //KITA KIRIM KALO USERNYA TUH DISCONNECT
        socket.to(room.roomId).emit("playerDisconnected", userInRoom); // <- 4
      }
    });
  });

  socket.on("closeRoom", async (data) => {
    socket.to(data.roomId).emit("closeRoom", data); //INI BUAT KIRIM ROOMID YANG DITERIMA SAMA CLIENT YANG MAU CLOSE ROOM

    const clientSockets = await io.in(data.roomId).fetchSockets(); // BUAT DAPETIN SEMUA SOCKETS YANG ADA DI ROOMNYA
    // LOOPING SOCKETNYA BUAT KELUARIN SOCKETNYA DARI ROOMIDNYA
    clientSockets.forEach((s) => {
      s.leave(data.roomId);
    });

    rooms.delete(data.roomId); // KALAU SEMUA UDAH KELUAR TINGGAL DI DELETE ROOMNYA
  });
});

module.exports = server;
