const axios = require("axios");

async function login(event) {
  event.preventDefault();

  console.log("Login button clicked");

  var nickname = document.getElementById("nickname").value;
  var password = document.getElementById("password").value;

  var credentials = {
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
      // Redirect to the login page
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
