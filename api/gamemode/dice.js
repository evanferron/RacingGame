const MainGamemode = require("./mainGamemode");

class Dice extends MainGamemode.MainGamemode {
  constructor() {
    super();
    this.gamemode = "Dice";
  }

  playerAction(player, data) {
    switch (data.action) {
      case "click":
        if (player == this.player1.id) {
          this.playerActionStatus = "Success";
          this.play(this.player1);
        } else if (player == this.player2.id) {
          this.playerActionStatus = "Success";
          this.play(this.player2);
        } else {
          this.playerActionStatus = "Error";
        }
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

  play(player) {
    player.nb = Math.floor(Math.random() * 6) + 1;
  }

  checkWin() {
    if (this.player1.nb == this.player2.nb) return;
    if (this.player1.nb > this.player2.nb) {
      this.player1.lvl++;
      this.player2.lvl--;
    } else {
      this.player2.lvl++;
      this.player1.lvl--;
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
}

module.exports = {
  Dice,
};
