import { io } from "socket.io-client";
import { BASE_URL } from "./config";

let socket = null;

export const connectSocket = (userId) => {
  if (socket) return socket;

  socket = io(BASE_URL, {
    query: { userId },
    withCredentials: true,
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
