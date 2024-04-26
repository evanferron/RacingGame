const { default: axios } = require("axios");
const Store = require("electron-store");

const store = new Store();

nikname = store.get("nickname");

rank = store.get("rank");

rankDice = rank.find((element) => element.gamemodeName === "Dice").rank;
rankSpeedTyping = rank.find(
  (element) => element.gamemodeName === "SpeedTyping"
).rank;

document.getElementById("nickname").innerHTML = nikname;

rankDice = store.set("rankDice", rankDice);
rankSpeedTyping = store.set("rankSpeedTyping", rankSpeedTyping);

document.getElementById("rankDice").innerHTML = rankDice.points;
document.getElementById("rankSpeedTyping").innerHTML = rankSpeedTyping.points;

if (rankDice.points <= 99) {
  document.getElementById("rankDice").style.color = "brown";
} else if (rankDice.points >= 100 && rankDice.points < 200) {
  document.getElementById("rankDice").style.color = "silver";
} else if (rankDice.points >= 200 && rankDice.points < 300) {
  document.getElementById("rankDice").style.color = "yellow";
} else if (rankDice.points >= 300 && rankDice.points < 1000) {
  document.getElementById("rankDice").style.color = "skyblue";
}

if (rankSpeedTyping.points <= 99) {
  document.getElementById("rankSpeedTyping").style.color = "brown";
} else if (rankSpeedTyping.points >= 100 && rankSpeedTyping.points < 200) {
  document.getElementById("rankSpeedTyping").style.color = "silver";
} else if (rankSpeedTyping.points >= 200 && rankSpeedTyping.points < 300) {
  document.getElementById("rankSpeedTyping").style.color = "yellow";
} else if (rankSpeedTyping.points >= 300 && rankSpeedTyping.points < 1000) {
  document.getElementById("rankSpeedTyping").style.color = "skyblue";
}

playDice = () => {
  axios.post("http://localhost:3000/api/play", {
    playerId: store.get("playerId"),
    gamemodeId: rankDice.gamemodeId,
  });
  window.location.href = "dice.html";
};

playSpeedTyping = () => {
  axios.post("http://localhost:3000/api/play", {
    playerId: store.get("playerId"),
    gamemodeId: rankSpeedTyping.gamemodeId,
  });
  window.location.href = "speedTyping.html";
};
