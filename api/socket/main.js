const playerAction = require("./playerAction");
const joinRoom = require("./joinRoom");

const rooms = {};

const InitSocketSystem = (io) => {
  io.on("connection", (socket) => {
    console.log("a player is connected to the room");

    socket.on("joinRoom", joinRoom(roomId, userId, gamemode, rank, socket));

    socket.on("playerAction", playerAction(rooms, roomId, playerAction));
  });
};

export default InitSocketSystem;
