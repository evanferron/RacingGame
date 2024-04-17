const getNewPlayerPoints = (winnerPoints, looserPoints) => {
  const maxPointsLoose = 50;
  const maxPointsWin = 80;
  const minPointsWin = 5;
  const pointsWin = 9;
  const pointsLoose = 9;
  if (looserPoints - winnerPoints > 20) {
    const pointsWin = Math.round((looserPoints - winnerPoints) / 2);
    const pointsLoose = Math.round((looserPoints - winnerPoints) / 2);
    if (pointsWin > maxPointsWin) pointsWin = maxPointsWin;
    if (pointsWin < minPointsWin) pointsWin = minPointsWin;
    if (pointsLoose > maxPointsLoose) pointsLoose = maxPointsLoose;
  }
};
