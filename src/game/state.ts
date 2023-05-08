import { DEFAULT_HEIGHT, DEFAULT_WIDTH, TILE_TYPES } from './constants';

const generateInitialState = ({ width, height }: { width: number; height: number }) => {
    const board = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => {
            const types = Object.values(TILE_TYPES);
            const rand = Math.floor(Math.random() * types.length);
            return types[rand];
        })
    );
    return board;
};

export const game = {
    state: generateInitialState({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT }),
};
