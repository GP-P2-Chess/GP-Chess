import { io } from "socket.io-client"; // import connection function

const socket = io("https://chess.saintmichael.cloud", { autoConnect: false }); // initialize websocket connection

export default socket;
