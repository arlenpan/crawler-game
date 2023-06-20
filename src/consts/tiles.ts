// Entities for tiles
export interface ITile {
  type: string;
  spriteURL?: string;
  rate: number; // Rate of appearance
}

export const TILE_SWORD: ITile = {
  type: 'sword',
  spriteURL: 'src/assets/sword.png',
  rate: 1,
};

export const TILE_POTION: ITile = {
  type: 'potion',
  spriteURL: 'src/assets/potion.jpg',
  rate: 1,
};

export const TILE_COIN: ITile = {
  type: 'coin',
  spriteURL: 'src/assets/coin.png',
  rate: 1,
};

export const TILE_SHIELD: ITile = {
  type: 'shield',
  spriteURL: 'src/assets/shield.png',
  rate: 1,
};
