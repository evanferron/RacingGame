const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const API_ADRESS = process.env.API_ADRESS;

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

  await axios
    .post(API_ADRESS + "/auth/register", credentials)
    .then((res) => {
      console.log("Registration successful");
      // console.log(res.data);
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.log("Registration failed");
      console.log(error.response);
      switch (error.response.data.errorName) {
        case "alreadyRegisterWithEmail":
          if (error.response.data.errorName !== "alreadyRegisterWithNickname") {
            document.getElementById("pseudo-error").style.display = "none";
            document.getElementById("nickname").style.border =
              "1px solid green";
          }
          document.getElementById("mail-error").innerText = "Mail already used";
          document.getElementById("mail-error").style.display = "flex";
          document.getElementById("email").style.border = "1px solid red";
          break;
        case "alreadyRegisterWithNickname":
          if (error.response.data.errorName !== "alreadyRegisterWithEmail") {
            document.getElementById("mail-error").style.display = "none";
            document.getElementById("email").style.border = "1px solid green";
          }
          document.getElementById("pseudo-error").innerText =
            "Pseudo already used";
          document.getElementById("pseudo-error").style.display = "flex";
          document.getElementById("nickname").style.border = "1px solid red";
          break;
        case "alreadyRegisterWithEmailNickname":
          document.getElementById("mail-error").innerText =
            "Mail and Pseudo already used";
          document.getElementById("mail-error").style.display = "flex";
          document.getElementById("nickname").style.border = "1px solid red";
          document.getElementById("email").style.border = "1px solid red";
          break;
        default:
          console.error(error);
      }
    });
}

document.getElementById("form-register").addEventListener("submit", register);
