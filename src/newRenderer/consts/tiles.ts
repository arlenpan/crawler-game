// Entities for tiles
export interface ITile {
  type: string;
  rate: number; // Rate of appearance
}

export const TILE_SWORD: ITile = {
  type: 'sword',
  rate: 1,
};

export const TILE_POTION: ITile = {
  type: 'potion',
  rate: 1,
};

export const TILE_COIN: ITile = {
  type: 'coin',
  rate: 1,
};

export const TILE_SHIELD: ITile = {
  type: 'shield',
  rate: 1,
};
