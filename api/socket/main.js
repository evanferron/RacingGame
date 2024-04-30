// const playerAction = require("./playerAction");
// const joinRoom = require("./joinRoom");

// const rooms = {};

// exports.InitSocketSystem = (io) => {
//   io.on("connection", (socket) => {
//     console.log("a player is connected to the room");

//     socket.on("joinRoom", (roomId, userId, gamemode, rank) => {
//       joinRoom(rooms, roomId, userId, gamemode, rank, socket);
//     });

//     socket.on("playerAction", (roomId, data) => {
//       playerAction(rooms, roomId, data, socket);
//     });

//     socket.on("disconnected", () => {});
//   });
// };

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
