import { io } from "socket.io-client"; // import connection function

const socket = io("localhost:3000", { autoConnect: false }); // initialize websocket connection

export default socket;
