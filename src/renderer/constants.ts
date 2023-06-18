import { TileCoin, TilePotion, TileShield, TileSword } from 'src/components/Sprites';
import { TILE_COIN, TILE_POTION, TILE_SHIELD, TILE_SWORD } from 'src/game/tiles';

export const TILE_SIZE = 40;

export const COMPONENT_TILE_MAP: Record<string, React.FC> = {
    [TILE_SWORD.type]: TileSword,
    [TILE_SHIELD.type]: TileShield,
    [TILE_COIN.type]: TileCoin,
    [TILE_POTION.type]: TilePotion,
};
