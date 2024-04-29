const Store = require("electron-store");
const dotenv = require("dotenv");
dotenv.config();
const SOCKET_ADRESS = process.env.SOCKET_ADRESS;
const store = new Store();
// const socket = require("./home");
const socket = new WebSocket(SOCKET_ADRESS);

nikname = store.get("nickname");
document.getElementById("nickname").innerHTML = nikname;

room = store.get("room");
game = store.get("game");
if (game.error != "") {
  document.getElementById("word-error").innerHTML = "Mauvais orthographe";
}
console.log(game.currentWord.word);
document.getElementById("word").innerHTML = game.currentWord.word.toLowerCase();

opponentName = room.opponentName;
document.getElementById("opponent").innerHTML = opponentName;

playerTry = () => {
  const word = document.getElementById("input").value;
  console.log("palyer is trying : " + word);
  console.log(game);
  socket.send(
    JSON.stringify({
      action: "playerAction",
      gameAction: "checkAttempt",
      playerId: game.you.id,
      roomId: room.roomId,
      word: word,
    })
  );
};

socket.onmessage = (message) => {
  console.log("receiving message from server");
  const result = JSON.parse(message.data);
  console.log(result);
  if (result.isGameEnd) {
    window.location.href = "home.html";
    return;
  } else {
    if (result.you != null) {
      store.set("game", result);
    }
    window.location.reload();
  }
};
