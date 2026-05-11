//frontend/src/utils/mockPredict.jsx

export const mockPredict = (data) => {
  const stress = Number(data.stress);
  const anxiety = Number(data.anxiety);
  const sleep = Number(data.sleep);

  let days = 14;
  let risk = "Low";
  let recommendation = "Maintain healthy habits";

  if (stress > 7 || anxiety > 7) {
    days = 3;
    risk = "High";
    recommendation = "Practice breathing exercises and reduce overload";
  }
  if (sleep < 5) {
    days -= 2;
  }

  return {
    days,
    trigger: data.trigger,
    risk,
    recommendation,
  };
};
