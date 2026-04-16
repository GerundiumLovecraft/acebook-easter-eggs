import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  auth: {
    token: localStorage.getItem("token")
  },
  autoConnect: false
});

export function connectSocket() {
  socket.auth = { token: localStorage.getItem("token") };
  socket.connect();
}

export function disconnectSocket() {
  socket.disconnect();
}

export default socket;