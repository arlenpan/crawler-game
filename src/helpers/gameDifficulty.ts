// TODO: rework into const or have more complicated difficulty curves

export const turnToHealthMultiplier = (turn: number, baseHealth: number) => {
  // add 1 health per 5 turns
  return baseHealth + Math.floor(turn / 5);
};

export const turnToAttackMultiplier = (turn: number, baseAttack: number) => {
  return baseAttack;
};

export const turnToRateMultiplier = (turn: number, baseRate: number) => {
  // increase rate by 0.1 per 5 turns
  return baseRate + Math.floor(turn / 5) * 0.1;
};
