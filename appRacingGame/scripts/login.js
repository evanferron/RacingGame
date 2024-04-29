const axios = require("axios");
const Store = require("electron-store");
const dotenv = require("dotenv");
dotenv.config();
const API_ADRESS = process.env.API_ADRESS;
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
    .post(API_ADRESS + "/auth/login", credentials)
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
          document.getElementById("pseudo-error").innerText =
            "Nickname doesn't exist";
          document.getElementById("nickname").style.border = "1px solid red";
          break;
        case "invalidPassword":
          document.getElementById("password-error").innerText =
            "Invalid password";
          document.getElementById("password").style.border = "1px solid red";
          break;
        default:
          console.error(error);
      }
    });
}

document.getElementById("form-login").addEventListener("submit", login);
