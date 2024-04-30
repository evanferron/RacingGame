const disconnect = (io, socket) => {
  const rooms = io.sockets.adapter.rooms;
  for (const roomId in rooms) {
    if (rooms[roomId].sockets.hasOwnProperty(socket.id)) {
      delete rooms[roomId];
      io.to(roomId).emit("playerHasBeenDisconnected", socket.id);
      break;
    }
  }
};

export default disconnect;
