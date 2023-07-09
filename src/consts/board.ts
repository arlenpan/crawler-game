import { IEnemyTile, TILE_ENEMY_RAT } from './tiles_enemies';
import { ITile, TILE_COIN, TILE_POTION, TILE_SHIELD, TILE_SWORD } from './tiles';

export type TBoardTile = ITile | IEnemyTile | null;
export type TBoard = Array<Array<TBoardTile>>;

export const BASE_TILES = [TILE_SHIELD, TILE_SWORD, TILE_COIN, TILE_POTION];
export const ENEMY_TILES = [TILE_ENEMY_RAT];
