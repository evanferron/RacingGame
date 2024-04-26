const gameControlers = require("../controlers/gameControlers");

class MainGamemode {
  player1 = {
    id: "",
    lvl: 0,
    nb: 0,
  };
  player2 = {
    id: "",
    lvl: 0,
    nb: 0,
  };
  rank;
  isGameEnd = false;
  playerActionStatus = "";
  gamemode;

  constructor(player1, player2, rank) {
    this.player1.id = player1;
    this.player2.id = player2;
    this.rank = rank;
    this.initData();
  }

  // those method are

  getGameData() {}

  initData() {}

  //   player == playerId
  //   data is an object that contain the name of the action
  playerAction(player, data) {}

  end(winner, looser) {
    gameControlers.handleEndGame(winner, looser, this.gamemode);
  }
}

module.exports = {
  MainGamemode,
};
