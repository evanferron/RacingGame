const playerControlers = require("../controlers/playerControlers");
const Database = require("../Database.js");
const DB_PATH = "./racingGame.db";

// !!!! NEED TO REWORK THIS (not optimal and very simplistic)
const getNewPlayerPoints = (winnerPoints, looserPoints) => {
  const maxPointsLoose = 50;
  const maxPointsWin = 80;
  const minPointsWin = 5;
  const minPointsLoose = 4;
  const pointsWin = 9;
  const pointsLoose = 9;
  if (looserPoints - winnerPoints > 20) {
    pointsWin = Math.round((looserPoints - winnerPoints) / 2);
    pointsLoose = Math.round((looserPoints - winnerPoints) / 2);
    if (pointsWin > maxPointsWin) pointsWin = maxPointsWin;
    if (pointsWin < minPointsWin) pointsWin = minPointsWin;
    if (pointsLoose > maxPointsLoose) pointsLoose = maxPointsLoose;
  } else if (winnerPoints - looserPoints > 20) {
    pointsWin = minPointsWin;
    pointsLoose = minPointsLoose;
  }
  if (looserPoints - pointsLoose < 0) pointsLoose = looserPoints;
  return { pointsWin: pointsWin, pointsLoose: pointsLoose };
};

// the range is equal to the double of the time that the player is in the queue
// get the range allowed us to match a player who have his points in the range
const getPlayerMatchRange = async (playerId, gamemodeId) => {
  try {
    const data = await playerControlers.getPlayerSingleRankInfo(
      playerId,
      gamemodeId
    );
    const matchmaking = await Database.Read(
      DB_PATH,
      "SELECT requestDate FROM matchmaking WHERE playerId = ?",
      playerId
    );
    if (data == null || matchmaking[0].requestDate == undefined) return null;
    const range = Math.floor(Date.now() / 1000);
    console.log({
      minRange: data.points - (range - matchmaking[0].requestDate) / 2,
      maxRange: data.points + (range - matchmaking[0].requestDate) / 2,
    });
    return {
      minRange: data.points - (range - matchmaking[0].requestDate) / 2,
      maxRange: data.points + (range - matchmaking[0].requestDate) / 2,
    };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getNewPlayerPoints,
  getPlayerMatchRange,
};
