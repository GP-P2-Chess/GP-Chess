import { io } from "socket.io-client";

const socket = io("localhost:3000", { autoConnect: false }); // initialize websocket connection

export default socket;
