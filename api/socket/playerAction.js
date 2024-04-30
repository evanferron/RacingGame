exports.playerAction = (rooms, roomId, data, socket) => {
  rooms[roomId].game.playerAction(data.playerId, data);
  socket.send(JSON.stringify(rooms[roomId].game.getGameData(data.playerId)));
};
