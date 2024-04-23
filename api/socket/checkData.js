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

module.exports = {
  checkGamemodeName,
  checkRank,
};
