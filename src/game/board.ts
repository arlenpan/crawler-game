import { IEnemyTile, TYPE_ENEMY } from '../newRenderer/consts/enemies';
import { TILE_SWORD } from '../newRenderer/consts/tiles';

export const canStartDragOnTile = (tile: TBoardTile) => {
  if (!tile) return false;
  if (tile.type === TYPE_ENEMY) return false;
  return true;
};

export const canDragToNextTile = (firstTile: TBoardTile, secondTile: TBoardTile) => {
  if (!firstTile || !secondTile) return false;
  if (firstTile.type === TYPE_ENEMY && secondTile.type === TILE_SWORD.type) return true;
  if (firstTile.type === TILE_SWORD.type && secondTile.type === TYPE_ENEMY) return true;
  if (firstTile.type === secondTile.type) return true;
  return false;
};

export const checkMonsterDamage = (board: TBoard) => {
  const damage = board.reduce((acc, row) => {
    const rowDamage = row.reduce((rowAcc, tile) => {
      if (tile && tile.type === TYPE_ENEMY) {
        return rowAcc + (tile as IEnemyTile).attack;
      }
      return rowAcc;
    }, 0);
    return acc + rowDamage;
  }, 0);
  return damage;
};
