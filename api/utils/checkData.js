const AuthError = require("../error/authError.js");

const checkGamemodeName = (gamedemode) => {
  switch (gamedemode) {
    case "Dice":
      return true;
    case "SpeedTyping":
      return true;
    default:
      return false;
  }
};

const checkRank = (rank) => {
  switch (rank) {
    case "bronze":
      return true;
    case "silver":
      return true;
    case "gold":
      return true;
    case "diamond":
      return true;
    default:
      return false;
  }
};

const handleAuthTest = (nickname, password, email = "exemple@exemple.com") => {
  if (!testEmail(email)) {
    throw new AuthError.AuthError(
      "invalidEmailFormat",
      "The format is not valid for the email : " + player.email,
      400
    );
  }
  if (!testNickname(nickname)) {
    throw new AuthError.AuthError(
      "invalidNicknameFormat",
      "The format is not valid for the nickname : " + player.nickname,
      400
    );
  }
  if (testPassword(password)) {
    throw new AuthError.AuthError(
      "invalidPasswordFormat",
      "caracters ( [ ' ; ] ) are not allowed : " + password,
      400
    );
  }
  return "";
};

const testEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
const testNickname = (nickname) => {
  return /^[a-zA-Z0-9_-]{3,16}$/.test(nickname);
};

const testPassword = (password) => {
  return /([';])/.test(password);
};

module.exports = {
  checkGamemodeName,
  checkRank,
  handleAuthTest,
};
