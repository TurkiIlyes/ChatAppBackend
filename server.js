const express = require("express");
const cors = require("cors");
require("dotenv").config();
const dbConnect = require("./config/dbConnect");
const http = require("http");
const socketIo = require("socket.io");
const globalError = require("./middlewares/globalError");
const ApiError = require("./utils/ApiError");
const Message = require("./models/messageModel");

dbConnect();

const app = express();

app.use(cors());
app.options("*", cors());

app.use(express.json({ limit: "20kb" }));

const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
  console.log(`user ${socket.id} connected`);

  socket.on("joinRoom", ({ roomCode, username }) => {
    socket.join(roomCode);
    console.log(`user ${username} connected to room ${roomCode}`);
  });

  socket.on("sendMessage", async ({ roomCode, username, message }) => {
    io.to(roomCode).emit("message", { username, message });

    try {
      await Message.create({ roomCode, username, message });
    } catch (err) {
      console.error(err);
    }
  });
});

app.use("*", (req, res, next) => {
  next(new ApiError("Can't find this route ", 404));
});

app.use(globalError);

const AppServer = server.listen(process.env.PORT, () => {
  console.log(`APP STARTING ON PORT ${process.env.PORT}... ^^ `);
});

process.on("uncaughtException", () => {
  console.log("uncaughtException");
  AppServer.close(() => {
    console.log(`APP SHUTTING DOWN... *.* `);
    process.exit(1);
  });
});
