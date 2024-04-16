const Database = require("../Database.js");
const DB_PATH = "./racingGame.db";

  const loginPlayer = async (req, res) => {
    const player = req.body;
    // TO DO : check data format
    const user = await Database.Read(
      DB_PATH,
      "SELECT playerId,password FROM players WHERE nickname=?;",
      player.nickname
    );
    if (user.length != 0) {
      if (
        user[0].password ==
        hashFunc.hashPassword("sha256", "base64", player.password)
      ) {
        const rank = await Database.Read(
          DB_PATH,
          "SELECT name,points,ranks.name,gamemode.name FROM playersRank LEFT JOIN gamemode ON playersRank.gamemodeId = gamemode.gamemodeId LEFT JOIN ranks ON playersRank.rankId = ranks.rankId WHERE playerId = ?;",
          user.playerId
        );
        res.json({ isLogin: true, rank: rank });
        return;
      }
      res.json({ error: "wrong password" });
      return;
    }
    res.json({ error: "wrong nickname" });
    return;
  }

  const getGamemodes =  async () => {
    const gamemodes = await Database.Read(
      DB_PATH,
      "SELECT gamemodeId,name FROM gamemode;"
    );
    return gamemodes;
  }
  const getRanks = async () => {
    const ranks = await Database.Read(DB_PATH, "SELECT rankId,name FROM rank;");
    return ranks;
  }
  const getIdByNickname= async (nickname) => {
    const id = await Database.Read(
      DB_PATH,
      "SELECT playerId FROM players WHERE nickname = ?;",
      nickname
    )
    if(id.length != 0) return id[0]
    return -1
  }