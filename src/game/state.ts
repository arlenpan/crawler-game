import { DEFAULT_HEIGHT, DEFAULT_WIDTH, TILE_TYPES } from './constants';

type TBoard = Array<Array<string | null>>;

const generateInitialState = (width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) => {
    const board: TBoard = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => {
            const types = Object.values(TILE_TYPES);
            const rand = Math.floor(Math.random() * types.length);
            return types[rand];
        })
    );
    return board;
};

const generateRandomTile = () => {
    const types = Object.values(TILE_TYPES);
    const rand = Math.floor(Math.random() * types.length);
    return types[rand];
};

export const game = {
    generateInitialState,
    generateRandomTile,
};
