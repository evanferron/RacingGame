const Database = require("../Database.js");
const DB_PATH = "./clubs.db";

exports.addPlayer = async (req,res) => {
    const player = req.body;
    // TO DO : verif data format
    const password = hashFunc.hashPassword("sha256", "base64", player.password);

    let err = await Database.Write(
        DB_PATH,
        "INSERT INTO players (nickname,email,password) VALUES (?,?,?);",
        player.nickname,
        player.email,
        password
    )
    if (err != null) {
        console.error(err);
        res.json({ status: false });
        return;
    }
    console.log("a player has been successfully add");
    res.json({ status: true });
}

exports.addGame = async (req,res) => {
    const game = req.body;

    let err = await Database.Write(
        DB_PATH,
        "INSERT INTO history (winnerId,loserId,gamemodeId) VALUES (?,?,?);",
        game.winnerId,
        game.loserId,
        game.gamemodeId
    )
}