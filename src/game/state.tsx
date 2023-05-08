// base game state

const DEFAULT_WIDTH = 8;
const DEFAULT_HEIGHT = 8;

const TILE_TYPES = {
    SWORD: 'sword',
    SHIELD: 'shield',
    POTION: 'potion',
    MONSTER: 'monster',
};

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
