const Database = require("../Database.js");
const DB_PATH = "./racingGame.db";

const addGame = async (req, res) => {
  const game = req.body;

  let err = await Database.Write(
    DB_PATH,
    "INSERT INTO history (winnerId,loserId,gamemodeId) VALUES (?,?,?);",
    game.winnerId,
    game.loserId,
    game.gamemodeId
  );
  if (err != null) {
    console.error(err);
    res.json({ status: false });
    return;
  }
  console.log("a game has been successfully add");
  res.json({ status: true });
};

const getGamemodes = async () => {
    const gamemodes = await Database.Read(
      DB_PATH,
      "SELECT gamemodeId,name FROM gamemode;"
    );
    return gamemodes;
};

module.exports = {
    addGame,
    getGamemodes
}