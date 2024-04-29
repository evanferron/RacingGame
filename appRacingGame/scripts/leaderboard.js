async function getLeaderboard(event) {
  event.preventDefault();

  console.log("Leaderboard button clicked");

  const gamemodeId = document.getElementById("gamemodeId").value;

  const data = {
    gamemodeId: gamemodeId,
  };

  await axios
    .post(API_ADRESS + "/leaderboard", data)
    .then((res) => {
      console.log("Leaderboard successful");
      console.log(res.data);
      displayLeaderboard(res.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

document
  .getElementById("form-leaderboard")
  .addEventListener("submit", getLeaderboard(e));
