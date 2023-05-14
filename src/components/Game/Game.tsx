import React, { useEffect, useState } from 'react';
import { TileCoin, TilePotion, TileShield, TileSword } from 'src/components/Sprites';
import styles from './Game.module.css';
import { useDrag } from 'src/renderer/useDrag';
import classNames from 'classnames';
import { generateInitialBoard, generateRandomTile } from 'src/game/board';
import { generateInitialPlayer, tileReducer } from 'src/game/player';
import { ITile, TILE_COIN, TILE_POTION, TILE_SHIELD, TILE_SWORD } from 'src/game/tiles';

const TILE_TYPE_COMPONENT: Record<string, React.FC> = {
    [TILE_SWORD.type]: TileSword,
    [TILE_SHIELD.type]: TileShield,
    [TILE_COIN.type]: TileCoin,
    [TILE_POTION.type]: TilePotion,
};

export const Game = () => {
    const [gameState, setGameState] = useState(generateInitialBoard());
    const [playerState, setPlayerState] = useState(generateInitialPlayer());
    const [turnCount, setTurnCount] = useState(0);
    const { isDragging, event, target } = useDrag();
    const [activeTiles, setActiveTiles] = useState<[number, number][]>([]);

    useEffect(() => {
        if (event && target) {
            const dataset = target.dataset;
            if (!dataset) return;
            const { row, column } = dataset;
            if (!row || !column) return;

            const rowNumber = parseInt(row);
            const columnNumber = parseInt(column);
            pushToActiveTiles(rowNumber, columnNumber);
        } else if (activeTiles.length > 0) {
            releaseActiveTiles();
        }
    }, [event, target]);

    // continues the drag if the mouse is down
    const pushToActiveTiles = (row: number, column: number) => {
        if (activeTiles.length === 0) {
            setActiveTiles([[row, column]]);
        } else {
            // if active tiles is not empty, check if new tile is adjacent to last tile
            const [lastRow, lastColumn] = activeTiles[activeTiles.length - 1];
            if (row === lastRow && column === lastColumn) return; // not same tile
            if (gameState[row][column] !== gameState[lastRow][lastColumn]) return; // not same type

            // check if two tiles ago - if so, undo previous tile
            if (activeTiles.length > 1) {
                const [twoTilesAgoRow, twoTilesAgoColumn] = activeTiles[activeTiles.length - 2];
                if (row === twoTilesAgoRow && column === twoTilesAgoColumn) {
                    setActiveTiles(activeTiles.slice(0, activeTiles.length - 1));
                    return;
                }
            }

            // if adjacent, push to active tiles
            const isAdjacent = Math.abs(row - lastRow) <= 1 && Math.abs(column - lastColumn) <= 1;
            if (isAdjacent) {
                setActiveTiles([...activeTiles, [row, column]]);
            }
        }
    };

    // releases the drag and clears the active tiles
    const releaseActiveTiles = () => {
        // ignore anything less than 3 tiles
        if (activeTiles.length < 3) {
            setActiveTiles([]);
            return;
        }

        // collect active tile data
        const activeTileContents = activeTiles.map(([row, column]) => gameState[row][column]);

        // remove tiles from game state
        const newGameState = [...gameState];
        activeTiles.forEach(([row, column]) => {
            newGameState[row][column] = null;
        });

        // collapse columns down
        for (let i = 0; i < newGameState.length; i++) {
            for (let j = 0; j < newGameState[i].length; j++) {
                if (newGameState[i][j] === null) {
                    for (let k = i; k > 0; k--) {
                        newGameState[k][j] = newGameState[k - 1][j];
                    }
                    newGameState[0][j] = null;
                }
            }
        }

        // generate new tiles
        for (let i = 0; i < newGameState.length; i++) {
            for (let j = 0; j < newGameState[i].length; j++) {
                if (newGameState[i][j] === null) {
                    newGameState[i][j] = generateRandomTile();
                }
            }
        }

        // update states
        processActiveTiles(activeTileContents);
        setActiveTiles([]);
        setGameState(newGameState);
        setTurnCount(turnCount + 1);
    };

    // processes the active tiles and clears the active tiles - update player state here
    /// this also represents one turn
    const processActiveTiles = (activeTileContents: (ITile | null)[] = []) => {
        // time to process tiles!
        let newPlayerState = { ...playerState };

        // armor disappears on each turn tick
        newPlayerState.armor = 0;

        activeTileContents.map((tile) => {
            if (tile !== null) {
                newPlayerState = tileReducer(newPlayerState, tile);
            }
        });
        setPlayerState(newPlayerState);
    };

    const cellHasActiveTile = (row: number, column: number) => {
        return activeTiles.some(([activeRow, activeColumn]) => activeRow === row && activeColumn === column);
    };

    return (
        <>
            <div className={styles.wrapper}>
                {/* TOUCH HANDLER */}
                <div className={styles.touchGrid}>
                    {gameState.map((row, i) => (
                        <div key={i} className="d-flex align-center">
                            {row.map((_, j) => (
                                <div
                                    key={j}
                                    className={classNames(
                                        styles.tileOverlay,
                                        cellHasActiveTile(i, j) && styles.activeTile
                                    )}
                                    data-row={i}
                                    data-column={j}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                {/* VISUAL STATE */}
                <div>
                    {gameState.map((row, i) => (
                        <div key={i} className="d-flex align-center">
                            {row.map((tile, j) => {
                                if (tile === null) return null;
                                const TileComponent = TILE_TYPE_COMPONENT[tile.type];
                                return <TileComponent key={j} />;
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <strong>Player</strong>
                <div>Health: {playerState.health}</div>
                <div>Attack: {playerState.weapon.damage}</div>
                <div>Armor: {playerState.armor}</div>
                <div>Coins: {playerState.coins}</div>
            </div>

            <div>
                <strong>Debug</strong>
                <div>Turn: {turnCount}</div>
                <div>Is dragging: {isDragging ? 'true' : 'false'}</div>
                <div>Active Tile: {JSON.stringify(activeTiles)}</div>
                <div>
                    Coin percentage: {(gameState.flat().filter((tile) => tile?.type === 'coin').length / 64) * 100}%
                </div>
            </div>
        </>
    );
};
