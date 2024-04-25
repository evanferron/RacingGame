import axios from "axios";

document.getElementById("form-register").addEventListener("submit", register);

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

    if (response.status === 200) {
      alert("Registration successful");
      window.location.href = "login.html";
    } else {
      alert("Error: " + response.data);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again later.");
  }
}
