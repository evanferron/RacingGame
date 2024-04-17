const Database = require("../Database.js");
const DB_PATH = "./racingGame.db";

const getRanks = async () => {
  const ranks = await Database.Read(
    DB_PATH,
    "SELECT rankId,name,stepPoint FROM rank;"
  );
  return ranks;
};

const getRankById = async (id) => {
  const ranks = await Database.Read(
    DB_PATH,
    "SELECT rankId,name,stepPoint,nextRank FROM rank WHERE rankId = ?;",
    id
  );
  return ranks ? ranks[0] : null;
};

module.exports = {
  getRanks,
};
