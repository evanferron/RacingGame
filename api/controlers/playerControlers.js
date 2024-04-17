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
    const rankInfo = rankControlers.getRankByName(playerRank.rankId);
    const nextRankInfo = rankInfo.nextRank
      ? rankControlers.getRankByName(playerRank.rankId)
      : null;
    return {
      playerId: playerId,
      points: points,
      rankName: rankInfo.name,
      downPoints: rankInfo.stepPoint,
      upPoints: nextRankInfo ? nextRankInfo.stepPoint : null,
      status: true,
    };
  } catch (error) {
    console.error(error);
  }
  return {
    status: false,
  };
};

module.exports = {
  getIdByNickname,
};
