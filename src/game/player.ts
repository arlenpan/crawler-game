import { ITile, TILE_COIN, TILE_POTION, TILE_SHIELD } from '../newRenderer/consts/tiles';
import { WEAPON_SWORD } from './weapons';
import { IWeapon } from './weapons';

export interface IPlayerState {
    health: number;
    maxHealth: number;
    armor: number;
    coins: number;
    weapon: IWeapon;
}

export const generateInitialPlayer = () => {
    const playerState: IPlayerState = {
        health: 50,
        maxHealth: 50,
        armor: 0,
        coins: 0,
        weapon: WEAPON_SWORD,
    };
    return playerState;
};

export const tileReducer = (playerState: IPlayerState, tile: ITile) => {
    switch (tile.type) {
        case TILE_COIN.type:
            return {
                ...playerState,
                coins: playerState.coins + 1,
            };
        case TILE_POTION.type:
            if (playerState.health === playerState.maxHealth) return playerState;
            return {
                ...playerState,
                health: playerState.health + 1,
            };
        case TILE_SHIELD.type:
            return {
                ...playerState,
                armor: playerState.armor + 1,
            };
        default:
            return playerState;
    }
};
