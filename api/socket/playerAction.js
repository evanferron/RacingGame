exports.playerAction = (rooms, roomId, playerAction) => {
  // action possible mode random:
  //  lance le dé
  //  quitte la partie
  // action possible mode fastTyping:
  //  entre un mot
  //  quitte la partie
  rooms[roomId].game.playerAction(playerAction.playerId, playerAction);
  io.to(roomId).emit("updateGame", rooms[rooms].game.getGameData());
};
