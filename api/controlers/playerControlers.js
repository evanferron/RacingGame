const Database = require("../Database.js");
const DB_PATH = "./racingGame.db";
const rankControlers = require("./rankControlers");

const getIdByNickname = async (nickname) => {
  const id = await Database.Read(
    DB_PATH,
    "SELECT playerId FROM players WHERE nickname = ?;",
    nickname
  );
  if (id.length != 0) return id[0];
  return -1;
};

const getPlayerRankByGame = async (nickname, gamemodeId) => {
  const playerId = getIdByNickname(nickname);
  try {
    const playerRank = await Database.Read(
      DB_PATH,
      "SELECT points,rankId FROM playersRank WHERE playerId = ? AND gamemodeId = ?;",
      playerId,
      gamemodeId
    );
    const rankInfo = rankControlers.getRankById(playerRank.rankId);
    // const nextRankInfo = rankInfo.nextRank
    //   ? rankControlers.getRankByName(playerRank.rankId)
    //   : null;
    return {
      playerId: playerId,
      points: points,
      rankName: rankInfo.name,
      downPoints: rankInfo.downPoints,
      upPoints: rankInfo.upPoints,
      rankNumber: rankInfo.rankNumber,
      status: true,
    };
  } catch (error) {
    console.error(error);
  }
  return {
    status: false,
  };
};

const getPlayerSingleRankInfo = async (playerId, gamemodeId) => {
  try {
    const player = await Database.Read(
      DB_PATH,
      "SELECT points,gamemodeId,rankId,requestDate FROM playersRank LEFT JOIN matchmakings ON playersRank.playerId = matchmakings.player WHERE playerId = ? AND gamemodeId = ?;",
      playerId,
      gamemodeId
    );
    return player.length != 0 ? player[0] : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = {
  getIdByNickname,
  getPlayerRankByGame,
  getPlayerSingleRankInfo,
};
