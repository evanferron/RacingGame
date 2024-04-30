const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes");
dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", routes);
const server = require("http").createServer(app);
const WebSocket = require("ws");
const ws = new WebSocket.Server({ server: server });

const playerAction = require("./socket/playerAction");
const joinRoom = require("./socket/joinRoom");

const rooms = {};

ws.on("connection", (socket) => {
  console.log("a player is connected to the room");
  // const connection = socket.accept(null, request.origin);
  socket.on("open", () => {
    console.log("opened!");
  });
  socket.on("close", () => {
    console.log("closed!");
  });
  socket.on("message", (message) => {
    const data = JSON.parse(message);
    console.log(data);
    switch (data.action) {
      case "joinRoom":
        console.log("joining room");
        joinRoom.joinRoom(
          rooms,
          data.roomId,
          data.userId,
          data.gamemode,
          data.rank,
          socket
        );
        break;
      case "playerAction":
        playerAction.playerAction(rooms, data.roomId, data, socket);
        break;
      default:
        socket.send("wrong action name in data send");
    }
  });

  socket.on("disconnected", () => {});
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server started ! http://localhost:3000");
  console.log(`Server now listening on ${PORT}`);
});
