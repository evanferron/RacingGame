const checkData = require("../utils/checkData");
const SpeedTyping = require("../gamemode/speedTyping");
const Dice = require("../gamemode/Dice");

exports.joinRoom = (rooms, roomId, userId, gamemode, rank, socket) => {
  if (!rooms[roomId]) {
    if (checkData.checkGamemodeName(gamemode) && checkData.checkRank(rank)) {
      rooms[roomId] = {
        players: [],
        gamemode: gamemode,
        rank: rank,
      };
    } else {
      console.log(
        "A room attempted to be created with this gamemode name : " + gamemode,
        "And this rank : " + rank
      );
      return;
    }
  }
  if (rooms[roomId].players.length >= 2) {
    console.log(
      "A player attempted to join a room that already contains two players"
    );
    return;
  }
  rooms[roomId].players.push(userId);
  // !!!! DELETE this line
  rooms[roomId].players.push(7);
  //
  if (rooms[roomId].players.length == 2) {
    switch (rooms[roomId].gamemode) {
      case "SpeedTyping":
        rooms[roomId]["game"] = new SpeedTyping.SpeedTyping(
          rooms[roomId].players[0],
          rooms[roomId].players[1],
          rank
        );
        console.log(rooms[roomId]["game"]);
        break;
      case "Dice":
        rooms[roomId]["game"] = new Dice.Dice(
          rooms[roomId].players[0],
          rooms[roomId].players[1],
          rank
        );
        break;
    }
  }
  // TO DO : launch the game
};
