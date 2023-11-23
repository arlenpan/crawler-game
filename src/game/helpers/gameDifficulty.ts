// TODO: rework into const or have more complicated difficulty curves

export const turnToHealthMultiplier = (turn: number, baseHealth: number) => {
  return baseHealth + Math.floor(turn / 5);
};

export const turnToAttackMultiplier = (turn: number, baseAttack: number) => {
  return baseAttack;
};

export const turnToRateMultiplier = (turn: number, baseRate: number) => {
  return baseRate + Math.floor(turn / 10) * 0.1;
};
