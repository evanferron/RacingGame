# RacingGame

## 📝 Description

RacingGame est une plateforme logicielle proposant des jeux en face-à-face tels que des jeux de dés ou de rapidité de frappe. Les joueurs créer un compte pour des duels compétitifs grâce à un système de matchmaking équitable. Un système de classement et de rang permet aux joueurs de suivre leur performance, tandis qu'un leaderboard met en avant les meilleurs joueurs.

## 📦 Installation

Pour installer le projet, il faut cloner le repository `git clone https://github.com/evanferron/RacingGame.git`, puis installer les dépendances avec la commande `npm i` dans le dossier `appRacingGame` Ensuite, faite `cd ..` puis `cd api` -> `npm i` 

### ⚠️ Veuillez changer l'ip du serveur en fonction de la votre !

Dans le `.env` de `appRacingGame/` changer `API_ADRESS="http://VOTRE_IP(de l'api):3000/api` et `SOCKET_ADRESS="ws://VOTRE_IP(de l'api):3000"` pour l'app

Même chose dans le dossier `appracinggame-win32-x64` -> `resources` pour le logiciel

et lancer le serveur avec la commande `node index.js`.

## ⚠️ Attention il faut lancer le serveur api avant de lancer le logiciel ! ⚠️

Puis exécuter le .exe `appracinggame.exe` dans le dossier `appracinggame-win32-x64` pour lancer le logiciel

## ❓ Si vous souhaitez lancer electron en app ! ❓

Créer un autre terminal et accéder au dossier de l'application `cd appRacingGame` et lancer le front avec la commande `npm run start`.

## 🖥️ Technologies

- Electronjs
- Nodejs - Express
- Sqlite

## 🛠️ Outils

- Trello
- DBeaver
- DB Browser

## 📚 Auteurs

- `Evan Ferron`
- `Maxime Fuzeau`
