const Database = require("../Database.js");
const DB_PATH = "./racingGame.db";

const getRanks = async () => {
  const ranks = await Database.Read(
    DB_PATH,
    "SELECT rankId,name,stepPoint FROM rank;"
  );
  return ranks;
};

module.exports = {
  getRanks,
};
