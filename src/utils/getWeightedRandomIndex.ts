// choose random index based on weight
export const getWeightedRandomIndex = (weights: number[]) => {
  const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
  const randomIndex = Math.floor(Math.random() * totalWeight);
  let weightSum = 0;
  for (let i = 0; i < weights.length; i++) {
    weightSum += weights[i];
    if (randomIndex < weightSum) {
      return i;
    }
  }
  return 0;
};

export const testGetWeighted = () => {
  const allResults = [0, 0, 0, 0];
  for (let i = 0; i < 10000; i++) {
    const randomIndex = getWeightedRandomIndex([1, 2, 3, 4]);
    allResults[randomIndex]++;
  }
  const sum = allResults.reduce((acc, val) => acc + val, 0);
  const allPercentages = allResults.map((val) => (val / sum) * 100);
  return allPercentages;
};
