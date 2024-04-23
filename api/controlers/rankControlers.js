const Database = require("../Database.js");
const DB_PATH = "./racingGame.db";

const getRanks = async () => {
  const ranks = await Database.Read(
    DB_PATH,
    "SELECT rankId,name,downPoints,upPoints,rankNumber FROM ranks;"
  );
  return ranks;
};

const getRankById = async (id) => {
  const ranks = await Database.Read(
    DB_PATH,
    "SELECT rankId,name,downPoints,upPoints,rankNumber FROM rank WHERE rankId = ?;",
    id
  );
  return ranks ? ranks[0] : null;
};

const editRank = async (playerId, newPoints, gamemodeId, currentRank) => {
  const newRank = null;
  if (newPoints < currentRank.downPoints) {
    // down rank case
    newRank = getRankByRankNumber(currentRank.rankNumber - 1);
  } else if (currentRank.upPoints != null) {
    if (currentRank.upPoints < newPoints) {
      // up rank case
      newRank = getRankByRankNumber(currentRank.rankNumber + 1);
    }
  }
  if (newRank != null) {
    const err = Database.Write(
      DB_PATH,
      "UPDATE playersRank SET points=?,rankId=? WHERE gamemodeId=? AND playerId=?;",
      newPoints,
      newRank.rankId,
      gamemodeId,
      playerId
    );
    if (err != null) {
      console.error(err);
      res.status(500).send("Error editing player rank");
    }
  } else {
    const err = Database.Write(
      DB_PATH,
      "UPDATE playersRank SET points=? WHERE gamemodeId=? AND playerId=?;",
      newPoints,
      gamemodeId,
      playerId
    );
    if (err != null) {
      console.error(err);
      res.status(500).send("Error editing player rank");
    }
  }
};

const getRankByRankNumber = async (n) => {
  const ranks = await Database.Read(
    DB_PATH,
    "SELECT rankId,name,downPoints,upPoints,rankNumber FROM rank WHERE rankNumber = ?;",
    n
  );
  return ranks ? ranks[0] : null;
};

module.exports = {
  getRanks,
  getRankById,
  editRank,
};
