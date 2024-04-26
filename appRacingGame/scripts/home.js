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
  // Display cancel button
  document.getElementById("btnCancelDice").style.display = "flex";
  // Disable all sections
  const sections = document.querySelectorAll("section");
  sections.forEach((section) => {
    section.onclick = null;
  });
  //Request to play
  console.log("test");
  axios
    .post("http://localhost:3000/api/play", {
      playerId: store.get("playerId"),
      gamemodeId: rankDice.gamemodeId,
    })
    .then((response) => {
    console.log("test");
    if (response.status === 201) {
        console.log("Game started");
        setTimeout(checkMatchmakingStatus(rankDice.gamemodeId), 5000);
        window.location.href = "dice.html";
      }
    });
};

checkMatchmakingStatus = async (gamemodeId) => {
  try {
    await axios
      .post("http://localhost:3000/api/play/awaiting", {
        playerId: store.get("playerId"),
        gamemodeId: gamemodeId,
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Match found");
          // function to redirect to the game page and break the loop
        }
      });
  } catch (error) {
    console.error("Error checkMatchmakingStatus:", error);
  }
};

playSpeedTyping = () => {
  axios
    .post("http://localhost:3000/api/play", {
      playerId: store.get("playerId"),
      gamemodeId: rankSpeedTyping.gamemodeId,
    })
    .then((response) => {
      if (response.status === 201) {
        console.log("Game started");
        setTimeout(checkMatchmakingStatus(rankSpeedTyping.gamemodeId), 5000);
        window.location.href = "speedTyping.html";
      }
    });
};
