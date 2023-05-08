import React, { useEffect, useState } from 'react';
import { TileCoin, TilePotion, TileShield, TileSword } from 'src/components/Sprites';
import { game } from 'src/game/state';
import styles from './Game.module.css';
import { useMouseDrag } from 'src/renderer/useMouseDrag';
import classNames from 'classnames';

const TILE_TO_COMPONENT: Record<string, React.FC> = {
    sword: TileSword,
    shield: TileShield,
    coin: TileCoin,
    potion: TilePotion,
};

export const Game = () => {
    // console.log(game);

    const { isDragging, event } = useMouseDrag();
    const [activeTiles, setActiveTiles] = useState<[number, number][]>([]);

    useEffect(() => {
        // console.log(event);
        // get active tile
        if (event) {
            //  if mouse event
            let target;
            if (event instanceof MouseEvent) {
                target = event.target;
            }
            if (event instanceof TouchEvent) {
                const touch = event.changedTouches[0];
                target = document.elementFromPoint(touch.clientX, touch.clientY);
            }
            if (!target || !(target instanceof HTMLElement)) return;

            const dataset = target.dataset;
            if (!dataset) return;
            const { row, column } = dataset;
            if (!row || !column) return;
            const rowNumber = parseInt(row);
            const columnNumber = parseInt(column);
            console.log(row, column);
            pushToActiveTiles(rowNumber, columnNumber);

            // track next active tile
        } else {
            // reset active tile
            setActiveTiles([]);
        }
    }, [event]);

    const pushToActiveTiles = (row: number, column: number) => {
        if (activeTiles.length === 0) {
            // if active tiles is empty, push to active tiles
            setActiveTiles([[row, column]]);
        } else {
            // if active tiles is not empty, check if new tile is adjacent to last tile
            const [lastRow, lastColumn] = activeTiles[activeTiles.length - 1];
            // check that it's not the same tile
            if (row === lastRow && column === lastColumn) return;
            if (activeTiles.some(([activeRow, activeColumn]) => activeRow === row && activeColumn === column)) return;
            const isAdjacent = Math.abs(row - lastRow) <= 1 && Math.abs(column - lastColumn) <= 1;
            if (isAdjacent) {
                // if adjacent, push to active tiles
                setActiveTiles([...activeTiles, [row, column]]);
            }
        }

        // if adjacent, push to active tiles
    };

    // const handleActiveDrag = (row, column) => {};

    const cellHasActiveTile = (row: number, column: number) => {
        return activeTiles.some(([activeRow, activeColumn]) => activeRow === row && activeColumn === column);
    };

    return (
        <>
            <div className={styles.wrapper}>
                {/* TOUCH HANDLER */}
                <div className={styles.touchGrid}>
                    {game.state.map((row, i) => (
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
                    {game.state.map((row, i) => (
                        <div key={i} className="d-flex align-center">
                            {row.map((tile, j) => {
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
            </div>
        </>
    );
};
