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
InitSocketSystem(io);

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", routes);

app.listen(PORT, () => {
  console.log("Server started ! http://localhost:3001");
  console.log(`Server now listening on ${PORT}`);
});

// // client.js

// const socket = require('socket.io-client')('http://localhost:3000');

// // Événement pour rejoindre une salle de jeu
// socket.emit('joinRoom', 'roomId', 'userId');

// // Événement pour envoyer une action
// socket.emit('playerAction', 'roomId', { /* action data */ });

// // Écouter les mises à jour du jeu depuis le serveur
// socket.on('updateGame', (data) => {
//     // Mettre à jour l'état du jeu en fonction des données reçues
// });

// // Gestion des déconnexions
// socket.on('disconnect', () => {
//     // Code de gestion de la déconnexion
// });
