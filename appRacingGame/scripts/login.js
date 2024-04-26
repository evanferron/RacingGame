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

  try {
    const response = await axios.post(
      "http://localhost:3000/api/auth/login",
      credentials
    );
    console.log(response);
    if (response.status === 202) {
      console.log("Registration successful");
      console.log(response.data);
      store.set("playerId", response.data.playerId);
      store.set("rank", response.data.rank);
      window.location.href = "home.html";
    } else {
      console.error("Error: " + response.data);
    }
  } catch (error) {
    console.error("Error:", error);
    console.log("An error occurred. Please try again later.");
  }
}

document.getElementById("form-login").addEventListener("submit", login);
