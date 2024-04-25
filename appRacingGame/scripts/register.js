const axios = require("axios");

async function register(event) {
  event.preventDefault();

  console.log("Register button clicked");

  const nickname = document.getElementById("nickname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const credentials = {
    nickname: nickname,
    email: email,
    password: password,
  };

  try {
    const response = await axios.post(
      "http://localhost:3000/api/auth/register",
      credentials
    );

    if (response.status === 201) {
      console.log("Registration successful");
      window.location.href = "login.html";
    } else {
      console.error("Error: " + response.data);
    }
  } catch (error) {
    console.error("Error:", error);
    console.log("An error occurred. Please try again later.");
  }
}

document.getElementById("form-register").addEventListener("submit", register);
