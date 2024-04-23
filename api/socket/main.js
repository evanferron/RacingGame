import playerAction from "./playerAction";
import joinRoom from "./joinRoom";

const rooms = {};

const InitSocketSystem = (io) => {
  io.on("connection", (socket) => {
    console.log("a player is connected to the room");

    socket.on("joinRoom", (roomId, userId, gamemode, rank, socket) => {
      joinRoom(rooms, roomId, userId, gamemode, rank, socket);
    });

    socket.on("playerAction", (roomId, data) => {
      playerAction(rooms, roomId, data);
    });

    socket.on("disconnected", () => {});
  });
};

export default InitSocketSystem;
