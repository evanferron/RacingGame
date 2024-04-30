const Store = require("electron-store");
const dotenv = require("dotenv");
dotenv.config();
const SOCKET_ADRESS = process.env.SOCKET_ADRESS;
const store = new Store();
const socket = new WebSocket(SOCKET_ADRESS);

nikname = store.get("nickname");
document.getElementById("nickname").innerHTML = nikname;

room = store.get("room");
game = store.get("game");
console.log(room);
console.log(game);
if (game.error != "") {
  document.getElementById("word-error").innerHTML = "Mauvais orthographe";
}
document.getElementById("progress1").value = game.you.lvl * 10;
document.getElementById("progress1").innerHTML = game.you.lvl * 10 + "%";
document.getElementById("pointsPlayer1").innerHTML = game.you.lvl * 10 + "%";
document.getElementById("progress2").value = game.opponent.lvl * 10;
document.getElementById("progress2").innerHTML = game.opponent.lvl * 10 + "%";
document.getElementById("pointsPlayer2").innerHTML =
  game.opponent.lvl * 10 + "%";
document.getElementById("word").innerHTML = game.currentWord.word.toLowerCase();

document.getElementById("opponent").innerHTML = room.opponentName;

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
    store.set("game", null);
    window.location.href = "home.html";
    return;
  } else {
    if (result.you != null) {
      store.set("game", result);
    }
    window.location.reload();
  }
};
