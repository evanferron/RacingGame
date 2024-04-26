const Store = require("electron-store");
const store = new Store();

nikname = store.get("nickname");
document.getElementById("nickname").innerHTML = nikname;

room = store.get("room");

opponentName = room.opponentName;
console.log(room.opponentName);
document.getElementById("opponent").innerHTML = opponentName;

// yourScore = store.get("yourScore");
// document.getElementById("yourScore").innerHTML = yourScore;

// oppenentScore = store.get("oppenentScore");
// document.getElementById("oppenentScore").innerHTML = oppenentScore;
