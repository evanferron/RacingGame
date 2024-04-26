const Store = require("electron-store");

const store = new Store();

nikname = store.get("nickname");

document.getElementById("nickname").innerHTML = nikname;

// rankDice = store.get("rankDice");
// rankSpeedTyping = store.get("rankSpeedTyping");

// document.getElementById("rankDice").innerHTML = rankDice;
// document.getElementById("rankSpeedTyping").innerHTML = rankSpeedTyping;

// if (rankDice <= 99) {
//   document.getElementById("rankDice").style.color = "brown";
// } else if (rankDice >= 100 && rankDice < 200) {
//   document.getElementById("rankDice").style.color = "silver";
// } else if (rankDice >= 200 && rankDice < 300) {
//   document.getElementById("rankDice").style.color = "yellow";
// } else if (rankDice >= 300 && rankDice < 1000) {
//   document.getElementById("rankDice").style.color = "skyblue";
// }

// if (rankSpeedTyping <= 99) {
//   document.getElementById("rankSpeedTyping").style.color = "brown";
// } else if (rankSpeedTyping >= 100 && rankSpeedTyping < 200) {
//   document.getElementById("rankSpeedTyping").style.color = "silver";
// } else if (rankSpeedTyping >= 200 && rankSpeedTyping < 300) {
//   document.getElementById("rankSpeedTyping").style.color = "yellow";
// } else if (rankSpeedTyping >= 300 && rankSpeedTyping < 1000) {
//   document.getElementById("rankSpeedTyping").style.color = "skyblue";
// }
