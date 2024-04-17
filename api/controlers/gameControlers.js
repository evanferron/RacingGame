const Database = require("../Database.js");
const DB_PATH = "./racingGame.db";
const playerControlers = require("./playerControlers.js");

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

const getGamemodeIdByName = async (name) => {
  const gamemodes = await Database.Read(
    DB_PATH,
    "SELECT gamemodeId FROM gamemode WHERE name =?;",
    name
  );
  return gamemodes[0].gamemodeId;
};

const handleEndGame = async (req, res) => {
  const game = req.body;
  // TO DO : check data format
  const gamemodeId = getGamemodeIdByName(game.gamemode);
  const winnerRank = playerControlers.getPlayerRankByGame(
    game.winner,
    gamemodeId
  );
  const looserRank = playerControlers.getPlayerRankByGame(
    game.looser,
    gamemodeId
  );
  if (!winnerRank.status || !looserRank.status) {
    res.status(401).send("Intern error");
    return;
  }
  // TO DO : calculate new score and add data to the database
};

module.exports = {
  addGame,
  getGamemodes,
};
