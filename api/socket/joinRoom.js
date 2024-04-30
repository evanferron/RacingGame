const checkData = require("../utils/checkData");
const SpeedTyping = require("../gamemode/speedTyping");
const Dice = require("../gamemode/Dice");

exports.joinRoom = async (rooms, roomId, userId, gamemode, rank, socket) => {
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
    }
  }
  // if (rooms[roomId].players.length >= 2) {
  //   console.log(
  //     "A player attempted to join a room that already contains two players"
  //   );
  //   return;
  // }
  if (rooms[roomId].players.length != 2) {
    const playersId = roomId.split("-");
    rooms[roomId].players.push(parseInt(playersId[0]));
    rooms[roomId].players.push(parseInt(playersId[1]));
  }

  //
  if (rooms[roomId].players.length == 2) {
    switch (rooms[roomId].gamemode) {
      case "SpeedTyping":
        rooms[roomId]["game"] = new SpeedTyping.SpeedTyping(
          rooms[roomId].players[0],
          rooms[roomId].players[1],
          rank
        );
        await rooms[roomId]["game"].fillWords();
        socket.send(JSON.stringify(rooms[roomId]["game"].getGameData(userId)));
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
