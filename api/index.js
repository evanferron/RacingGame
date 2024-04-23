const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes");
const http = require("http");
const socketIo = require("socket.io");
const InitSocketSystem = require("./socket/main");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
InitSocketSystem.InitSocketSystem(io);

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", routes);

app.listen(PORT, () => {
  console.log("Server started ! http://localhost:3000");
  console.log(`Server now listening on ${PORT}`);
});
