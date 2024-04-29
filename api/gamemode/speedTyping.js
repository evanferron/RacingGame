const MainGamemode = require("./mainGamemode");
const gameControlers = require("../controlers/gameControlers");

class SpeedTyping extends MainGamemode.MainGamemode {
  words = [];

  constructor(player1, player2, rank) {
    super(player1, player2, rank);
    this.gamemode = "SpeedTyping";
    this.initData();
  }

  initData() {
    this.fillWords;
  }

  fillWords() {
    this.words = gameControlers.getWords(rank);
    console.log(words);
  }

  playerAction(player, data) {
    switch (data.action) {
      case "word":
        this.checkAttempt(player, data.word);
        break;
      case "disconnected":
        if (player == this.player1.id) {
          this.isGameEnd = true;
          this.player1.lvl = 0;
          this.player2.lvl = 10;
        } else if (player == this.player2.id) {
          this.isGameEnd = true;
          this.player2.lvl = 0;
          this.player1.lvl = 10;
        }
        break;
    }
  }

  getGameData(player) {
    if (this.isGameEnd) {
      if (this.player1.lvl == 10) this.end(this.player1.id, this.player2.id);
      else this.end(this.player2.id, this.player1.id);
      return {
        player1: this.player1,
        player2: this.player2,
        isGameEnd: this.isGameEnd,
      };
    }
    return player == this.player1.id
      ? {
          you: this.player1,
          opponent: this.player2,
          isGameEnd: this.isGameEnd,
          currentWord: words[this.player1.lvl],
          error: this.playerActionStatus,
        }
      : {
          you: this.player2,
          opponent: this.player1,
          isGameEnd: this.isGameEnd,
          currentWord: words[this.player1.lvl],
          error: this.playerActionStatus,
        };
  }

  checkAttempt(player, word) {
    this.playerActionStatus = "";
    if (!this.isGameEnd) {
      if (player == this.player1.id) {
        if (words[this.player1.lvl] === word) {
          this.player1.lvl++;
          if (this.player1.lvl == 10) {
            this.isGameEnd = true;
          }
        } else {
          this.playerActionStatus = "Mauvais mot";
        }
      } else if (player == this.player2.id) {
        if (words[this.player2.lvl] === word) {
          this.player2.lvl++;
          if (this.player2.lvl == 10) {
            this.isGameEnd = true;
          }
        } else {
          this.playerActionStatus = "Mauvais mot";
        }
      }
    }
  }
}

module.exports = {
  SpeedTyping,
};
