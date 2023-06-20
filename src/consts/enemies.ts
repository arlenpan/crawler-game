import { ITile } from './tiles';
import ratURL from '../assets/rat.jpg';

export interface IEnemyTile extends ITile {
  enemyType: string;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  experience: number;
  size: number;
}

export const TYPE_ENEMY = 'enemy';

export const TILE_ENEMY_RAT: IEnemyTile = {
  type: TYPE_ENEMY,
  enemyType: 'rat',
  spriteURL: ratURL,
  rate: 0.5,
  health: 5,
  maxHealth: 5,
  attack: 1,
  defense: 0,
  experience: 1,
  size: 1,
};
