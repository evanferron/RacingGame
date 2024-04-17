// !!!! NEED TO REWORK THIS (not optimal and very simplistic)
const getNewPlayerPoints = (winnerPoints, looserPoints) => {
  const maxPointsLoose = 50;
  const maxPointsWin = 80;
  const minPointsWin = 5;
  const minPointsLoose = 4;
  const pointsWin = 9;
  const pointsLoose = 9;
  if (looserPoints - winnerPoints > 20) {
    pointsWin = Math.round((looserPoints - winnerPoints) / 2);
    pointsLoose = Math.round((looserPoints - winnerPoints) / 2);
    if (pointsWin > maxPointsWin) pointsWin = maxPointsWin;
    if (pointsWin < minPointsWin) pointsWin = minPointsWin;
    if (pointsLoose > maxPointsLoose) pointsLoose = maxPointsLoose;
  } else if (winnerPoints - looserPoints > 20) {
    pointsWin = minPointsWin;
    pointsLoose = minPointsLoose;
  }
  if (looserPoints - pointsLoose < 0) pointsLoose = looserPoints;
  return { pointsWin: pointsWin, pointsLoose: pointsLoose };
};

module.exports = {
  getNewPlayerPoints,
};
