const axios = require("axios");
const Store = require("electron-store");

const store = new Store();

async function login(event) {
  event.preventDefault();

  console.log("Login button clicked");

  const nickname = document.getElementById("nickname").value;
  store.set("nickname", nickname);
  const password = document.getElementById("password").value;

  const credentials = {
    nickname: nickname,
    password: password,
  };

  await axios
    .post("http://localhost:3000/api/auth/login", credentials)
    .then((res) => {
      console.log("Registration successful");
      console.log(res.data);
      store.set("playerId", res.data.playerId);
      store.set("rank", res.data.rank);
      window.location.href = "home.html";
    })
    .catch((error) => {
      console.log(error);
      switch (error.data) {
        case "inexistantNickname":
          //
          break;
        default:
          console.error(error);
      }
    });
}

document.getElementById("form-login").addEventListener("submit", login);
