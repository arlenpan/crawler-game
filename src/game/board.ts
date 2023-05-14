import { ITile, TILES } from './tiles';

export const DEFAULT_HEIGHT = 8;
export const DEFAULT_WIDTH = 8;

type TBoard = Array<Array<ITile | null>>;

export const generateInitialBoard = (width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) => {
    const board: TBoard = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => {
            const types = Object.values(TILES);
            const rand = Math.floor(Math.random() * types.length);
            return types[rand];
        })
    );
    return board;
};

export const generateRandomTile = () => {
    const types = Object.values(TILES);
    const rand = Math.floor(Math.random() * types.length);
    return types[rand];
};
