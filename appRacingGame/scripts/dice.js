const Store = require("electron-store");

const store = new Store();

nikname = store.get("nickname");
document.getElementById("nickname").innerHTML = nikname;

room = store.get("room");

oppenentName = room.oppenentName;
document.getElementById("oppenent").innerHTML = oppenentName;

// yourScore = store.get("yourScore");
// document.getElementById("yourScore").innerHTML = yourScore;

// oppenentScore = store.get("oppenentScore");
// document.getElementById("oppenentScore").innerHTML = oppenentScore;
