const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
API_ADRESS = process.env.API_ADRESS;

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
    const response = await axios
      .post(API_ADRESS + "/auth/register", credentials)
      .then((res) => {
        console.log("Registration successful");
        window.location.href = "login.html";
      })
      .catch((error) => {
        if (error.response.status == 400) {
          console.log(error);
          switch (error.data) {
            case "inexistantNickname":
              //
              break;
            default:
              console.error(error);
          }
          document.getElementById("pseudo-error").innerHTML =
            "Pseudo déjà utilisé";
          document.getElementById("pseudo-error").style.display = "flex";
          document.getElementById("pseudo-error").style.border =
            "2px solid red";

          document.getElementById("email-error").style.display = "flex";
          document.getElementById("email-error").style.border = "2px solid red";
          document.getElementById("email-error").innerHTML =
            "Email déjà utilisé";
        }
      });

    if (response.status === 201) {
      console.log("Registration successful");
      window.location.href = "login.html";
    } else if (response.status === 400) {
      console.error("Error: " + response.data);
      document.getElementById("pseudo-error").innerHTML = "Pseudo déjà utilisé";
      document.getElementById("pseudo-error").style.display = "flex";
      document.getElementById("pseudo-error").style.border = "2px solid red";

      document.getElementById("email-error").style.display = "flex";
      document.getElementById("email-error").style.border = "2px solid red";
      document.getElementById("email-error").innerHTML = "Email déjà utilisé";
    } else {
      console.error("Error: " + response.data);
    }
  } catch (error) {
    console.log("An error occurred. Please try again later.");
  }
}

document.getElementById("form-register").addEventListener("submit", register);
