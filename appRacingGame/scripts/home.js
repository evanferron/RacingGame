const { default: axios, getAdapter } = require("axios");
const Store = require("electron-store");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const API_ADRESS = process.env.API_ADRESS;
const SOCKET_ADRESS = process.env.SOCKET_ADRESS;

const store = new Store();
store.set("game", null);

let rankDice;
let rankSpeedTyping;
let nikname;
let rank;
/* --- Get data from login --- */
axios
  .post(API_ADRESS + "/gamemode/getall", { playerId: store.get("playerId") })
  .then((res) => {
    store.set("rank", res.data.rank);

    nikname = store.get("nickname");
    rank = store.get("rank");
    rankDice = rank.find((r) => r.gamemodeName === "Dice");
    rankSpeedTyping = rank.find((r) => r.gamemodeName === "SpeedTyping");
    /* --- Set data --- */
    store.set("rankDice", rankDice);
    store.set("rankSpeedTyping", rankSpeedTyping);
    setBorderColor(document.getElementById("card-dice"), rankDice.points);
    setBorderColor(
      document.getElementById("card-typing"),
      rankSpeedTyping.points
    );
    /* --- Display data --- */
    document.getElementById("nickname").innerHTML = nikname;
    document.getElementById("rankDice").innerHTML = rankDice.points;
    document.getElementById("rankSpeedTyping").innerHTML =
      rankSpeedTyping.points;
  })
  .catch((err) => {
    console.err(err);
  });

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
        const game = await checkMatchmakingStatus(rankDice.gamemodeId);
        if (game != "noData") {
          joinRoom(game);
          window.location.href = "dice.html";
        } else {
          window.location.href = "home.html";
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
        const game = await checkMatchmakingStatus(rankSpeedTyping.gamemodeId);
        if (game != "noData") {
          joinRoom(game);
          setTimeout(() => {
            window.location.href = "speedTyping.html";
          }, 2000);
        } else {
          window.location.href = "home.html";
          console.error("Error checkMatchmakingStatus");
        }
      }
    });
};

/* -- Check Matchmaking Status -- */

checkMatchmakingStatus = async (gamemodeId) => {
  let data = "noData";
  while (!cancel) {
    await new Promise((resolve) => setTimeout(resolve, 4000));
    console.log("Checking for match");
    await axios
      .post(API_ADRESS + "/play/waiting", {
        playerId: store.get("playerId"),
        gamemodeId: gamemodeId,
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Match found");
          data = response.data;
          store.set("room", response.data);
          cancel = true;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  cancel = false;
  return data;
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

const socket = new WebSocket(SOCKET_ADRESS);
store.set("socket", socket);

socket.addEventListener("open", (e) => {
  console.log("Connected to the server");
});

socket.onmessage = (message) => {
  console.log("receiving message from server");
  const result = JSON.parse(message.data);
  if (result.you != null) {
    store.set("game", result);
  }
};

const joinRoom = (game) => {
  console.log("try to joining a room");
  socket.send(
    JSON.stringify({
      action: "joinRoom",
      roomId: game.roomId,
      userId: game.userId,
      gamemode: game.gamemode,
      rank: game.rank,
    })
  );
};

const playerAction = (playerAction, roomId, data) => {
  socket.send("playerAction", roomId, data);
};

module.exports = {
  playerAction,
};
