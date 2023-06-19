import * as PIXI from 'pixi.js';
import { SPRITE_SRC } from './consts/sprites';
import { APP_HEIGHT_PX, APP_WIDTH_PX } from './consts/config';
import { TBoard } from './consts/board';

interface IRendererState {
  app: PIXI.Application | null;
  gameContainer: PIXI.Container | null;
  boardContainer: PIXI.Container | null;
  spriteBoard: (PIXI.Sprite | undefined)[][] | null;
  isDragging: boolean;
}

// rendering layer for game
const Renderer = (() => {
  const state: IRendererState = {
    app: null,
    gameContainer: null,
    boardContainer: null,
    isDragging: false,
    spriteBoard: null,
  };

  const initialize = async () => {
    const app = new PIXI.Application<HTMLCanvasElement>({ width: APP_WIDTH_PX, height: APP_HEIGHT_PX });
    const gameContainer = new PIXI.Container();
    const boardContainer = new PIXI.Container();
    app.stage.addChild(gameContainer);
    gameContainer.addChild(boardContainer);

    state.app = app;
    state.gameContainer = gameContainer;
    state.boardContainer = boardContainer;

    return app;
  };

  const initializeBoard = async (board: TBoard) => {
    const { app, boardContainer } = state;
    if (!app || !boardContainer) return;

    // set dimensions
    const BOARD_PADDING = app.screen.width * 0.05;
    const BOARD_SIZE = app.screen.width - BOARD_PADDING * 2;
    const TILE_SIZE = BOARD_SIZE / board.length;

    // map board to state
    const spriteBoard = board.map((row) =>
      row.map((tile) => {
        if (tile && tile.type && SPRITE_SRC[tile.type as keyof typeof SPRITE_SRC]) {
          const sprite = PIXI.Sprite.from(SPRITE_SRC[tile.type as keyof typeof SPRITE_SRC]);
          sprite.width = TILE_SIZE;
          sprite.height = TILE_SIZE;
          return sprite;
        }
      })
    );
    state.spriteBoard = spriteBoard;

    // render board
    for (let i = 0; i < state.spriteBoard.length; i++) {
      const row = state.spriteBoard[i];
      for (let j = 0; j < row.length; j++) {
        const sprite = row[j];
        if (sprite) {
          sprite.width = TILE_SIZE;
          sprite.height = TILE_SIZE;
          sprite.x = j * TILE_SIZE + BOARD_PADDING;
          sprite.y = i * TILE_SIZE + BOARD_PADDING;
          boardContainer.addChild(sprite);
        }
      }
    }
  };

  return { initialize, initializeBoard };
})();

export default Renderer;
