require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const ErrorHandler = require("./middlewares/errorHandler");
const { Server } = require("socket.io");
const { createServer } = require("http");
const ControllerUser = require("./controllers/controllerUser");
const ControllerGame = require("./controllers/controllerGame");
const Authentication = require("./middlewares/authentication");
const authorization = require("./middlewares/authorization");
const { Socket } = require("dgram");

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

io.on("connection", (socket) => {
  console.log(socket.id, "connected");
});

module.exports = server;
