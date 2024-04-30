const axios = require("axios");
const Store = require("electron-store");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
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
      console.log("Login successful");
      console.log(res.data);
      store.set("playerId", res.data.playerId);
      
      window.location.href = "home.html";
    })
    .catch((error) => {
      console.log("Login failed");
      console.log(error.response);
      switch (error.response.data) {
        case "inexistantNickname":
          if (error.response.data !== "invalidPassword") {
            document.getElementById("password-error").style.display = "none";
            document.getElementById("password").style.border =
              "1px solid green";
          }
          document.getElementById("pseudo-error").innerText =
            "Nickname doesn't exist";
          document.getElementById("pseudo-error").style.display = "flex";
          document.getElementById("nickname").style.border = "1px solid red";
          break;
        case "invalidPassword":
          if (error.response.data !== "inexistantNickname") {
            document.getElementById("pseudo-error").style.display = "none";
            document.getElementById("nickname").style.border =
              "1px solid green";
          }
          document.getElementById("password-error").innerText =
            "Invalid password";
          document.getElementById("password-error").style.display = "flex";
          document.getElementById("password").style.border = "1px solid red";
          break;
        default:
          console.error(error);
      }
    });
}

document.getElementById("form-login").addEventListener("submit", login);
