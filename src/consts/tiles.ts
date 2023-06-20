import swordURL from '../assets/sword.png';
import potionURL from '../assets/potion.jpg';
import coinURL from '../assets/coin.png';
import shieldURL from '../assets/shield.png';

// Entities for tiles
export interface ITile {
  type: string;
  spriteURL?: string;
  rate: number; // Rate of appearance
}

export const TILE_SWORD: ITile = {
  type: 'sword',
  spriteURL: swordURL,
  rate: 1,
};

export const TILE_POTION: ITile = {
  type: 'potion',
  spriteURL: potionURL,
  rate: 1,
};

export const TILE_COIN: ITile = {
  type: 'coin',
  spriteURL: coinURL,
  rate: 1,
};

export const TILE_SHIELD: ITile = {
  type: 'shield',
  spriteURL: shieldURL,
  rate: 1,
};
