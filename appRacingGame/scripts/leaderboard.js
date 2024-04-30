const axios = require("axios");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const API_ADRESS = process.env.API_ADRESS;

async function getLeaderboard(event) {
  event.preventDefault();

  console.log("Leaderboard button clicked");

  const gamemodeId = event.submitter.previousElementSibling.value; // get the value of the input before the button

  const data = {
    gamemodeId: gamemodeId,
  };

  await axios
    .post(API_ADRESS + "/leaderboard", data)
    .then((res) => {
      console.log("Leaderboard successful");
      displayLeaderboard(res.data, gamemodeId);
    })
    .catch((error) => {
      console.log(error);
    });
}

displayLeaderboard = (leaderboard, gamemodeId) => {
  const leaderboardTable = document.getElementById("leaderboard");

  leaderboardTable.innerHTML = "";

  leaderboard.forEach((player, index) => {
    const row = leaderboardTable.insertRow(index);

    const cellNickname = row.insertCell(0);
    const cellPoints = row.insertCell(1);

    cellNickname.innerHTML = player.nickname;
    cellPoints.innerHTML = player.points;
  });

  switch (gamemodeId) {
    case "1":
      document.getElementById("speedTyping").style.backgroundColor = "#3e3e3e";

      document.getElementById("dice").style.backgroundColor = "#fb4444";
      break;
    case "2":
      document.getElementById("dice").style.backgroundColor = "#3e3e3e";

      document.getElementById("speedTyping").style.backgroundColor = "#3a61eb";
      break;
    default:
      console.error("Invalid gamemodeId");
  }
};

document
  .getElementById("form-leaderboard")
  .addEventListener("submit", getLeaderboard);
