import React, { useEffect, useState } from 'react';
import { TileCoin, TilePotion, TileShield, TileSword } from 'src/components/Sprites';
import { game } from 'src/game/state';
import styles from './Game.module.css';
import { useDrag } from 'src/renderer/useDrag';
import classNames from 'classnames';

const TILE_TO_COMPONENT: Record<string, React.FC> = {
    sword: TileSword,
    shield: TileShield,
    coin: TileCoin,
    potion: TilePotion,
};

export const Game = () => {
    const [gameState, setGameState] = useState(game.generateInitialState());
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

    const releaseActiveTiles = () => {
        // ignore anything less than 3 tiles
        if (activeTiles.length < 3) {
            setActiveTiles([]);
            return;
        }

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
                    newGameState[i][j] = game.generateRandomTile();
                }
            }
        }

        setGameState(newGameState);
        setActiveTiles([]);
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
                                const TileComponent = TILE_TO_COMPONENT[tile];
                                return <TileComponent key={j} />;
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <div>Is dragging: {isDragging ? 'true' : 'false'}</div>
                <div>Active Tile: {JSON.stringify(activeTiles)}</div>
                <div>Coin percentage: {(gameState.flat().filter((tile) => tile === 'coin').length / 64) * 100}%</div>
            </div>
        </>
    );
};
