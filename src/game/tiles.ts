// Entities for tiles

export interface ITile {
    type: string;
}

export const TILE_SWORD: ITile = {
    type: 'sword',
};
export const TILE_POTION: ITile = {
    type: 'potion',
};
export const TILE_COIN: ITile = {
    type: 'coin',
};
export const TILE_SHIELD: ITile = {
    type: 'shield',
};

export const TILES = {
    SWORD: TILE_SWORD,
    POTION: TILE_POTION,
    COIN: TILE_COIN,
    SHIELD: TILE_SHIELD,
};
