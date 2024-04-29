// SELECT players.nickname, playersRank.points
// FROM players
// JOIN playersRank ON players.playerId = playersRank.playerId
// WHERE playersRank.gamemodeId = 1
// ORDER BY playersRank.points DESC;

const Database = require("../Database.js");
const dotenv = require("dotenv");
dotenv.config();
const DB_PATH = process.env.DB_PATH;

async function getLeaderboard(req, res) {
  const gamemodeId = req.body.gamemodeId;
  const leaderboard = await Database.Read(
    DB_PATH,
    "SELECT players.nickname, playersRank.points FROM players JOIN playersRank ON players.playerId = playersRank.playerId WHERE playersRank.gamemodeId =? ORDER BY playersRank.points DESC;",
    gamemodeId
  );
  res.send(leaderboard);
}

module.exports = {
  getLeaderboard,
};
