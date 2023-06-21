// contains checks for game logic - no state based utilities

import { BASE_TILES, ENEMY_TILES, TBoard, TBoardTile } from 'src/consts/board';
import { BOARD_HEIGHT, BOARD_WIDTH } from 'src/consts/config';
import { TYPE_ENEMY } from 'src/consts/enemies';
import { TILE_SWORD } from 'src/consts/tiles';
import { getWeightedRandomIndex } from 'src/utils/getWeightedRandomIndex';

export const generateBoard = (width = BOARD_WIDTH, height = BOARD_HEIGHT) => {
  const board: TBoard = Array.from({ length: height }, () => Array.from({ length: width }, () => generateRandomTile()));
  return board;
};

export const generateRandomTile = () => {
  // choose random tile based on weight
  const ALL_TILES = [...BASE_TILES, ...ENEMY_TILES];
  const weights = ALL_TILES.map((tile) => tile.rate);
  const randomIndex = getWeightedRandomIndex(weights);
  return ALL_TILES[randomIndex];
};

export const canStartDragOnTile = (tile: TBoardTile) => {
  if (!tile) return false;
  // if (tile.type === TYPE_ENEMY) return false;
  return true;
};

export const canDragToNextTile = (firstTile?: TBoardTile, secondTile?: TBoardTile) => {
  if (!firstTile || !secondTile) return false;
  if (firstTile.type === TYPE_ENEMY && secondTile.type === TILE_SWORD.type) return true;
  if (firstTile.type === TILE_SWORD.type && secondTile.type === TYPE_ENEMY) return true;
  if (firstTile.type === secondTile.type) return true;
  return false;
};
