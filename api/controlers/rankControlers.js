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
  console.log(id);
  const ranks = await Database.Read(
    DB_PATH,
    "SELECT rankId,name,downPoints,upPoints,rankNumber FROM ranks WHERE rankId = ?;",
    id
  );
  console.log("ranks", ranks);
  return ranks ? ranks[0] : null;
};

const editRank = async (playerId, newPoints, gamemodeId, currentRank) => {
  const newRank = null;
  console.log(playerId, newPoints, gamemodeId, currentRank);
  if (newPoints < currentRank.downPoints) {
    // down rank case
    newRank = await getRankByRankNumber(currentRank.rankNumber - 1);
  } else if (currentRank.upPoints != null) {
    if (currentRank.upPoints < newPoints) {
      // up rank case
      newRank = await getRankByRankNumber(currentRank.rankNumber + 1);
    }
  }
  if (newRank != null) {
    const err = await Database.Write(
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
    const err = await Database.Write(
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
    "SELECT rankId,name,downPoints,upPoints,rankNumber FROM ranks WHERE rankNumber = ?;",
    n
  );
  return ranks ? ranks[0] : null;
};

module.exports = {
  getRanks,
  getRankById,
  editRank,
};
