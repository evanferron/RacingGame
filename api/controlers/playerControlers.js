const Database = require("../Database.js");
const DB_PATH = "./racingGame.db";


const getIdByNickname = async (nickname) => {
    const id = await Database.Read(
      DB_PATH,
      "SELECT playerId FROM players WHERE nickname = ?;",
      nickname
    );
    if (id.length != 0) return id[0];
    return -1;
};

module.exports = {
    getIdByNickname
}