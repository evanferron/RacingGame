const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const GetControlers = require("./getControlers");
const PlayerControlers = require("./playerControlers");
const GameControlers = require("./gameControlers")

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
const DB_PATH = process.env.DB_PATH;

const register = async (req, res) => {
  const player = req.body;
  try {
    const password = await bcrypt.hash(player.password, 10);
    let err = await Database.Write(
      DB_PATH,
      "INSERT INTO players (nickname,email,password) VALUES (?,?,?);",
      player.nickname,
      player.email,
      password
    );
    if (err != null) {
      console.error(err);
      res.json({ status: false });
      return;
    }
    err = await initPlayerData(player.nickname);
    if (!err) {
      console.log("an error happend when trie to initialise data");
      return;
    }
    res.status(201).send("User registered successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error registering user");
  }
};

const login = async (req, res) => {
  const player = req.body;
  // TO DO : check data format
  const user = await Database.Read(
    DB_PATH,
    "SELECT playerId,password FROM players WHERE nickname=?;",
    player.nickname
  );
  if (user == null) return res.status(400).send("User not found");
  try {
    if (await bcrypt.compare(player.password, user.password)) {
      const rank = await Database.Read(
        DB_PATH,
        "SELECT name,points,ranks.name,gamemode.name FROM playersRank LEFT JOIN gamemode ON playersRank.gamemodeId = gamemode.gamemodeId LEFT JOIN ranks ON playersRank.rankId = ranks.rankId WHERE playerId = ?;",
        user.playerId
      );
      const accessToken = jwt.sign({ playerId: user.playerId }, SECRET_KEY);
      res.json({ accessToken: accessToken, rank: rank });
    } else {
      res.status(401).send("Invalid password");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error logging in");
  }
};

module.exports = {
  register,
  login,
};

// local function to initialise every data wich the player is related from
// return false if the operation hasn't succed
const initPlayerData = async (nickname) => {
  const ranks = await GetControlers.getRanks();
  const gamemodes = await GameControlers.getGamemodes();
  const playerId = await PlayerControlers.getIdByNickname(nickname);
  const silverRank = ranks.find((data) => data[1] === "silver"); // get silver data
  if (playerId == -1 || silverRank == null) return false;
  for (let gamemode of gamemodes) {
    const err = await Database.Write(
      DB_PATH,
      "INSERT INTO playersRank(playersId,points,gamemodeId,rankId;",
      playerId,
      silverRank[2],
      gamemode.gamemodeId,
      silverRank[0]
    );
    if (err != null) {
      console.error(err);
      return false;
    }
  }
  return true;
};
