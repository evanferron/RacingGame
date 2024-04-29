const Store = require("electron-store");
const dotenv = require("dotenv");
dotenv.config();
const API_ADRESS = process.env.API_ADRESS;
const store = new Store();

nikname = store.get("nickname");
document.getElementById("nickname").innerHTML = nikname;

room = store.get("room");

opponentName = room.opponentName;
console.log(room.opponentName);
document.getElementById("opponent").innerHTML = opponentName;

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
