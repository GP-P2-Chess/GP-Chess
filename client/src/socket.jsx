import { io } from "socket.io-client"; // import connection function

const socket = io("https://34.124.195.26", { autoConnect: false }); // initialize websocket connection

export default socket;
