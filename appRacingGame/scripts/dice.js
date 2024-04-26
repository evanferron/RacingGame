const Store = require("electron-store");

const store = new Store();

nikname = store.get("nickname");
document.getElementById("nickname").innerHTML = nikname;

// oppenent = store.get("oppenent");
// document.getElementById("oppenent").innerHTML = oppenent;

// yourScore = store.get("yourScore");
// document.getElementById("yourScore").innerHTML = yourScore;

// oppenentScore = store.get("oppenentScore");
// document.getElementById("oppenentScore").innerHTML = oppenentScore;
