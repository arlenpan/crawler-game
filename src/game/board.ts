import { getWeightedRandomIndex } from 'src/utils/getWeightedRandomIndex';
import { ENEMY_RAT, IEnemyTile, TYPE_ENEMY } from './enemies';
import { ITile, TILE_COIN, TILE_POTION, TILE_SHIELD, TILE_SWORD } from './tiles';

export const DEFAULT_HEIGHT = 8;
export const DEFAULT_WIDTH = 8;

export type TBoardTile = ITile | IEnemyTile | null;
export type TBoard = Array<Array<TBoardTile>>;

const BASE_TILES = [TILE_SHIELD, TILE_SWORD, TILE_COIN, TILE_POTION];
const ENEMY_TILES = [ENEMY_RAT];

export const generateRandomTile = () => {
    // choose random tile based on weight
    const ALL_TILES = [...BASE_TILES, ...ENEMY_TILES];
    const weights = ALL_TILES.map((tile) => tile.rate);
    const randomIndex = getWeightedRandomIndex(weights);
    return ALL_TILES[randomIndex];
};

export const generateInitialBoard = (width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) => {
    const board: TBoard = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => generateRandomTile())
    );
    return board;
};

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
