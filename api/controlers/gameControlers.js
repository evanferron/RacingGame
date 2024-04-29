const Database = require("../Database.js");
const DB_PATH = "./racingGame.db";
const playerControlers = require("./playerControlers.js");
const rankUtils = require("../utils/rank.js");
const rankControlers = require("./rankControlers.js");

const addGame = async (winner, looser, gamemode) => {
  const err = await Database.Write(
    DB_PATH,
    "INSERT INTO history (winnerId,loserId,gamemodeId) VALUES (?,?,?);",
    winner,
    looser,
    gamemode
  );
  if (err != null) {
    console.error(err);
    res.json({ status: false });
    return;
  }
  console.log("a game has been successfully add");
  res.json({ status: true });
};

const getWords = async (rank) => {
  try {
    let difficulty;
    if (rank == "Bronze") difficulty = 1;
    else if (rank == "Silver" || rank == "Gold") difficulty = 2;
    else difficulty = 3;
    const words = await Database.Read(
      DB_PATH,
      "SELECT word FROM words WHERE difficulty = ? LIMIT 10;",
      difficulty
    );
    return words;
  } catch (error) {
    console.err(error);
  }
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

const getGamemodeById = async (id) => {
  const gamemodes = await Database.Read(
    DB_PATH,
    "SELECT gamemodeId,name FROM gamemode WHERE gamemodeId =?;",
    id
  );
  return gamemodes[0].name;
};

const handleEndGame = async (winner, looser, gamemode) => {
  const gamemodeId = getGamemodeIdByName(gamemode);
  const winnerRank = await playerControlers.getPlayerRankByGame(
    winner,
    gamemodeId
  );
  const looserRank = await playerControlers.getPlayerRankByGame(
    looser,
    gamemodeId
  );
  if (!winnerRank.status || !looserRank.status) {
    res
      .status(401)
      .send("Intern error while getting winner and/or looser rank");
    return;
  }
  await addGame(winner, looser, gamemodeId);
  const newScore = rankUtils.getNewPlayerPoints(
    winnerRank.points,
    looserRank.points
  );
  await rankControlers.editRank(
    winner,
    winnerRank.points + newScore.pointsWin,
    gamemodeId,
    winnerRank.rankNumber
  );
  await rankControlers.editRank(
    looser,
    looserRank.points + newScore.pointsLoose,
    gamemodeId,
    looserRank.rankNumber
  );
};

module.exports = {
  addGame,
  getGamemodes,
  getGamemodeById,
  handleEndGame,
  getWords
};
