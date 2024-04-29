// SELECT players.nickname, playersRank.points
// FROM players
// JOIN playersRank ON players.playerId = playersRank.playerId
// WHERE playersRank.gamemodeId = 1
// ORDER BY playersRank.points DESC;

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
