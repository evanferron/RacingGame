const { default: axios } = require("axios");
const Store = require("electron-store");
const dotenv = require("dotenv");
dotenv.config();
const API_ADRESS = process.env.API_ADRESS;

const store = new Store();

/* --- Get data from login --- */

nikname = store.get("nickname");

rank = store.get("rank");

const rankDice = rank.find((r) => r.gamemodeName === "Dice");
const rankSpeedTyping = rank.find((r) => r.gamemodeName === "SpeedTyping");

/* --- Set data --- */

store.set("rankDice", rankDice);
store.set("rankSpeedTyping", rankSpeedTyping);

/* --- Display data --- */

document.getElementById("nickname").innerHTML = nikname;
document.getElementById("rankDice").innerHTML = rankDice.points;
document.getElementById("rankSpeedTyping").innerHTML = rankSpeedTyping.points;

/* --- Btn Cancel --- */

let cancel = false;

document.getElementById("btnCancel").addEventListener("click", () => {
  cancel = true;
  document.getElementById("btnCancel").style.display = "none";
});

/* --- Set border color with rank--- */

function setBorderColor(element, points) {
  if (points <= 99) {
    element.style.borderColor = "brown";
  } else if (points >= 100 && points < 200) {
    element.style.borderColor = "silver";
  } else if (points >= 200 && points < 300) {
    element.style.borderColor = "yellow";
  } else if (points >= 300 && points < 1000) {
    element.style.borderColor = "skyblue";
  }
}

setBorderColor(document.getElementById("card-dice"), rankDice.points);
setBorderColor(document.getElementById("card-typing"), rankSpeedTyping.points);

/* -- Dice -- */

playDice = async () => {
  // Display cancel button
  btnCancel();
  await axios
    .post(API_ADRESS + "/play", {
      playerId: store.get("playerId"),
      gamemodeId: rankDice.gamemodeId,
    })
    .then(async (response) => {
      if (response.status === 201) {
        console.log("Game started");
        const game = await checkMatchmakingStatus(rankDice.gamemodeId);
        console.log(game);
        if (game) {
          window.location.href = "dice.html";
        } else {
          // window.location.href = "home.html";
          console.error("Error checkMatchmakingStatus");
        }
      }
    });
};

/* -- Speed Typing -- */

playSpeedTyping = async () => {
  // Display cancel button
  btnCancel();
  await axios
    .post(API_ADRESS + "/play", {
      playerId: store.get("playerId"),
      gamemodeId: rankSpeedTyping.gamemodeId,
    })
    .then(async (response) => {
      if (response.status === 201) {
        console.log("Game started");
        const game = await checkMatchmakingStatus(rankSpeedTyping.gamemodeId);
        if (game) {
          window.location.href = "speedTyping.html";
        } else {
          console.error("Error checkMatchmakingStatus");
          // window.location.href = "home.html";
        }
      }
    });
};

/* -- Check Matchmaking Status -- */

checkMatchmakingStatus = async (gamemodeId) => {
  let gameFound = false;
  while (!cancel) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log("Checking for match");
    await axios
      .post(API_ADRESS + "/play/waiting", {
        playerId: store.get("playerId"),
        gamemodeId: gamemodeId,
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Match found");
          console.log(response.data);
          store.set("room", response.data);
          alert("test");
          cancel = true;
          gameFound = true;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  cancel = false;
  return gameFound;
};

/* -- Cancel -- */

btnCancel = () => {
  // Display cancel button
  document.getElementById("btnCancel").style.display = "flex";
  // Disable all sections
  const sections = document.querySelectorAll("section");
  sections.forEach((section) => {
    section.onclick = null;
  });
};
