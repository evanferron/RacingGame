const MainGamemode = require("./mainGamemode");
const gameControlers = require("../controlers/gameControlers");

class SpeedTyping extends MainGamemode.MainGamemode {
  words = [];

  constructor(player1, player2, rank) {
    super(player1, player2, rank);
    this.gamemode = "SpeedTyping";
  }

  async fillWords() {
    this.words = await gameControlers.getWords(this.rank);
  }

  playerAction(player, data) {
    console.log("checking the attemp : ", data.gameAction);
    switch (data.gameAction) {
      case "checkAttempt":
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
      if (this.player1.lvl == 10) {
        this.end(this.player1.id, this.player2.id);
        return {
          player1: this.player1,
          player2: this.player2,
          isGameEnd: this.isGameEnd,
        };
      } else {
        this.end(this.player2.id, this.player1.id);
        return {
          player1: this.player2,
          player2: this.player1,
          isGameEnd: this.isGameEnd,
        };
      }
    }
    return player == this.player1.id
      ? {
          you: this.player1,
          opponent: this.player2,
          isGameEnd: this.isGameEnd,
          currentWord: this.words[this.player1.lvl],
          error: this.playerActionStatus,
        }
      : {
          you: this.player2,
          opponent: this.player1,
          isGameEnd: this.isGameEnd,
          currentWord: this.words[this.player2.lvl],
          error: this.playerActionStatus,
        };
  }

  checkAttempt(player, word) {
    this.playerActionStatus = "";
    if (!this.isGameEnd) {
      if (player == this.player1.id) {
        if (this.words[this.player1.lvl].word.toLowerCase() === word) {
          console.log("4 ", player, word);
          this.player1.lvl++;
          if (this.player1.lvl == 10) {
            this.isGameEnd = true;
          }
        } else {
          this.playerActionStatus = "Mauvais mot";
        }
      } else if (player == this.player2.id) {
        if (this.words[this.player2.lvl].word.toLowerCase() === word) {
          console.log("player 2 gain one level");
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
