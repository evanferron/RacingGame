const Database = require("../Database.js");
const DB_PATH = "./racingGame.db";
const rankControlers = require("./rankControlers");

const getIdByNickname = async (nickname) => {
  console.log(nickname);
  const id = await Database.Read(
    DB_PATH,
    "SELECT playerId FROM players WHERE nickname = ?;",
    nickname
  );
  console.log(id);
  if (id.length != 0) return id[0];
  return -1;
};

const getNameById = async (id) => {
  const nickname = await Database.Read(
    DB_PATH,
    "SELECT nickname FROM players WHERE playerId = ?;",
    id
  );
  if (nickname.length != 0) return nickname[0];
  return -1;
};

const getPlayerRankByGame = async (playerId, gamemodeId) => {
  try {
    const playerRank = await Database.Read(
      DB_PATH,
      "SELECT points,rankId FROM playersRank WHERE playerId = ? AND gamemodeId = ?;",
      playerId,
      gamemodeId
    );
    const rankInfo = await rankControlers.getRankById(playerRank[0].rankId);
    return {
      playerId: playerId,
      points: playerRank[0].points,
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
      "SELECT points,ranks.name AS rankName,gamemode.name AS gamemodeName, gamemode.gamemodeId AS gamemodeId, ranks.rankId AS rankId FROM playersRank LEFT JOIN gamemode ON playersRank.gamemodeId = gamemode.gamemodeId LEFT JOIN ranks ON playersRank.rankId = ranks.rankId WHERE playerId = ? AND gamemode.gamemodeId = ?;",
      playerId,
      gamemodeId
    );
    return player.length != 0 ? player[0] : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getPlayerData = async (req, res) => {
  const playerId = req.body.playerId;
  try {
    // TO DO : make the request to get player data that are necessary to the client
    const rank = await Database.Read(
      DB_PATH,
      "SELECT points,ranks.name AS rankName,gamemode.name AS gamemodeName, gamemode.gamemodeId AS gamemodeId, ranks.rankId AS rankId FROM playersRank LEFT JOIN gamemode ON playersRank.gamemodeId = gamemode.gamemodeId LEFT JOIN ranks ON playersRank.rankId = ranks.rankId WHERE playerId = ?;",
      playerId
    );
    res.json({ playerId: playerId, rank: rank });
  } catch (error) {
    console.error(error);
    res.status(501).send("Cannot get player data");
  }
};

// return true if a player already exist with one of the ids in parametre
const isAlreadyRegister = async (nickname, email) => {
  try {
    const players = await Database.Read(
      DB_PATH,
      "SELECT playerId,email,nickname FROM players WHERE nickname = ? OR email = ?;",
      nickname,
      email
    );
    return players;
  } catch (error) {
    console.error(
      "Cannot check if an user is already register with ids : ",
      nickname,
      email,
      "\n error :",
      error
    );
    return true;
  }
};

module.exports = {
  getIdByNickname,
  getPlayerRankByGame,
  getPlayerSingleRankInfo,
  getPlayerData,
  isAlreadyRegister,
  getNameById,
};
