const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
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
      displayLeaderboard(res.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

displayLeaderboard = (leaderboard) => {
  const leaderboardTable = document.getElementById("leaderboard");

  leaderboardTable.innerHTML = "";

  leaderboard.forEach((player, index) => {
    const row = leaderboardTable.insertRow(index);

    const cellNickname = row.insertCell(0);
    const cellPoints = row.insertCell(1);

    cellNickname.innerHTML = player.nickname;
    cellPoints.innerHTML = player.points;
  });
};

document
  .getElementById("form-leaderboard")
  .addEventListener("submit", getLeaderboard);
