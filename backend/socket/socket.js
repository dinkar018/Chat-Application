import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
import  {redis,redisSub}  from "../config/redis.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export const getReceiverSocketId = async (receiverId) => {
  return await redis.hGet("user_socket_map", receiverId);
};

/* ---- Subscribe once ---- */
redisSub.subscribe("chat_messages", async (data) => {
  const { receiverId, message } = JSON.parse(data);

  const socketId = await redis.hGet("user_socket_map", receiverId);

  if (socketId) {
    io.to(socketId).emit("newMessage", message);
  }
});

/* ---- Socket lifecycle ---- */
io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;
  if (!userId) return;

  await redis.sAdd(`user_sockets:${userId}`, socket.id);
  await redis.sAdd("online_users", userId);

  const onlineUsers = await redis.sMembers("online_users");
  io.emit("getOnlineUsers", onlineUsers);

  socket.on("disconnect", async () => {
    await redis.sRem(`user_sockets:${userId}`, socket.id);

    const remaining = await redis.sCard(`user_sockets:${userId}`);

    if (remaining === 0) {
      await redis.sRem("online_users", userId);
      await redis.del(`user_sockets:${userId}`);
    }

    const updatedUsers = await redis.sMembers("online_users");
    io.emit("getOnlineUsers", updatedUsers);
  });
});


export { app, io, server };
