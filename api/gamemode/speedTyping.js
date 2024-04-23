import MainGamemode from "./mainGamemode";

class SpeedTyping extends MainGamemode {
  words = [];

  constructor() {
    super();
  }

  initData() {
    this.fillWords;
  }

  fillWords() {
    // TO DO get 10 words in words (difficulty depending on game rank)
  }

  playerAction(player, data) {
    switch (data.action) {
      case "word":
        this.checkAttempt(player, data.word);
        break;
      case "disconnected":
      // To do
    }
  }

  getGameData(player) {
    if (this.isGameEnd) {
      return {
        player1: this.player1,
        player2: this.player2,
        isGameEnd: this.isGameEnd,
      };
    }
    return {
      player1: this.player1,
      player2: this.player2,
      isGameEnd: this.isGameEnd,
      currentWord:
        player == this.player1.id
          ? words[this.player1.lvl]
          : words[this.player2.lvl],
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

export default SpeedTyping;
