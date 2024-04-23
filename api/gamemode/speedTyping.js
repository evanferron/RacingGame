import MainGamemode from "./mainGamemode";

class SpeedTyping extends MainGamemode {
  words = [];

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
  checkAttempt(player, word) {
    if (!this.isGameEnd) {
      if (player == player1) {
        if (words[this.player1Lvl] === word) {
          this.player1Lvl++;
          if (this.player1Lvl == 10) {
            this.isGameEnd = true;
            // player 1 win
          }
        } else if (player == player2) {
          if (words[this.player2Lvl] === word) {
            this.player2Lvl++;
            if (this.player2Lvl == 10) {
              this.isGameEnd = true;
              // player 2 win
            }
          }
        }
      }
    }
  }
}

export default SpeedTyping;
