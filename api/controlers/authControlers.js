const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const rankControlers = require("./rankControlers");
const playerControlers = require("./playerControlers");
const gameControlers = require("./gameControlers");
const AuthError = require("../error/authError.js");
const checkData = require("../utils/checkData.js");
const Database = require("../Database.js");

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
const DB_PATH = process.env.DB_PATH;

// error name :
//  - alreadyRegister
//  - cannotInsert
//  - cannotInitialise
//  - invalidEmailFormat
//  - invalidPasswordFormat
//  - invalidNicknameFormat
const register = async (req, res) => {
  const player = req.body;
  try {
    checkData.handleAuthTest(player.nickname, player.password, player.email); // it throw an error if ther is an invalid data format
    const players = await playerControlers.isAlreadyRegister(
      player.nickname,
      player.email
    );
    if (players != 0) {
      emailFound = false;
      passwordFound = false;
      for (playerFound of players) {
        if (playerFound.email == player.email) emailFound = true;
        if (playerFound.nickname == player.nickname) emailFound = true;
      }
      let errorName = emailFound ? "Email" : "";
      errorName += password ? "Password" : "";
      throw new AuthError.AuthError(
        "alreadyRegisterWith" + errorName,
        "A player already exist with one/both of id(s)(nickname/email)",
        400
      );
    }
    const password = await bcrypt.hash(player.password, 10);
    let err = await Database.Write(
      DB_PATH,
      "INSERT INTO players (nickname,email,password) VALUES (?,?,?);",
      player.nickname,
      player.email,
      password
    );
    if (err != null) {
      console.log(player.nickname, player.email, password);
      throw new AuthError.AuthError(
        "cannotInsert",
        "Cannot insert player in the database :" + err,
        500
      );
    }
    const isInitialise = await initPlayerData(player.nickname);
    if (!isInitialise) {
      throw new AuthError.AuthError(
        "cannotInitialise",
        "cannot initialise player data : " + err,
        500
      );
    }
    res.status(201).send("User registered successfully");
  } catch (err) {
    console.log(err);
    if (err.signal) {
      console.log(err.name, " : ", err.message);
      res
        .status(err.signal)
        .send({ errorName: err.name, message: err.message });
    } else {
      console.log(err);
      res.status(500).send("Error registering user");
    }
  }
};

// error name :
//  - inexistantNickname
//  - invalidPassword
const login = async (req, res) => {
  const player = req.body;
  try {
    checkData.handleAuthTest(player.nickname, player.password); // it throw an error if ther is an invalid data format
    const user = await Database.Read(
      DB_PATH,
      "SELECT playerId,password FROM players WHERE nickname=?;",
      player.nickname
    );
    if (user == null) {
      throw new AuthError.AuthError(
        "inexistantNickname",
        "There isn't any player with the nickname : " + player.nickname,
        400
      );
    }
    let bcryptStatus;
    bcrypt.compare(player.password, user[0].password, (err, result) => {
      bcryptStatus = result;
    });
    if (!bcryptStatus) {
      const rank = await Database.Read(
        DB_PATH,
        "SELECT points,ranks.name AS rankName,gamemode.name AS gamemodeName, gamemode.gamemodeId AS gamemodeId, ranks.rankId AS rankId FROM playersRank LEFT JOIN gamemode ON playersRank.gamemodeId = gamemode.gamemodeId LEFT JOIN ranks ON playersRank.rankId = ranks.rankId WHERE playerId = ?;",
        user[0].playerId
      );
      console.log(rank);
      // const accessToken = jwt.sign({ playerId: user.playerId }, SECRET_KEY);
      res.status(202).send({ playerId: user[0].playerId, rank: rank });
    } else {
      throw new AuthError.AuthError(
        "invalidPassword",
        "the password is not valide",
        401
      );
    }
  } catch (err) {
    if (err.signal) {
      console.log(err.name, " : ", err.message);
      res
        .status(err.signal)
        .send({ errorName: err.name, message: err.message });
    } else {
      console.log(err);
      res.status(500).send("Error logging in");
    }
  }
};

module.exports = {
  register,
  login,
};

// local function to initialise every data wich the player is related from
// return false if the operation hasn't succed
const initPlayerData = async (nickname) => {
  const ranks = await rankControlers.getRanks();
  const gamemodes = await gameControlers.getGamemodes();
  const playerId = await playerControlers.getIdByNickname(nickname);

  const silverRank = ranks.find((data) => data.name === "silver"); // get silver data

  if (playerId == -1 || silverRank == null) return false;
  for (let gamemode of gamemodes) {
    const err = await Database.Write(
      DB_PATH,
      "INSERT INTO playersRank(playerId,points,gamemodeId,rankId) VALUES (?,?,?,?);",
      playerId.playerId,
      silverRank.downPoints,
      gamemode.gamemodeId,
      silverRank.rankId
    );
    if (err != null) {
      console.error(err);
      return false;
    }
  }
  return true;
};
