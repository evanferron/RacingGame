const { default: axios, getAdapter } = require("axios");
const Store = require("electron-store");
const dotenv = require("dotenv");
dotenv.config();
const API_ADRESS = process.env.API_ADRESS;
const SOCKET_ADRESS = process.env.SOCKET_ADRESS;

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
        console.log(game);
        if (game != "noData") {
          joinRoom(game);
          window.location.href = "speedTyping.html";
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

// socket system
// const socketIo = require("socket.io-client");

// const socket = socketIo(SOCKET_ADRESS, {
//   transports: ["websocket"],
// });
const socket = new WebSocket(SOCKET_ADRESS);

socket.addEventListener("open", (e) => {
  console.log("Connected to the server");
});

socket.onmessage = (message) => {
  const result = JSON.parse(message);
  console.log(result);
};

const joinRoom = (game) => {
  console.log("try to joining a room");
  console.log(game);
  socket.send(
    JSON.stringify({
      action: "joinRoom",
      roomId: game.roomId,
      userId: game.userId,
      gamemode: game.gamemode,
      rank: game.rank,
    })
  );
  socket.addEventListener("updateGame", (data) => {
    // Mettre à jour l'état du jeu en fonction des données reçues
  });
  socket.addEventListener("disconnect", () => {
    // Code de gestion de la déconnexion
  });
};

const playerAction = (roomId, data) => {
  socket.send("playerAction", roomId, data);
};
