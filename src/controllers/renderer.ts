import * as PIXI from 'pixi.js';
import { TBoard } from 'src/consts/board';
import { APP_HEIGHT_PX, APP_WIDTH_PX, BOARD_PADDING_X_PX, BOARD_SIZE, TILE_SIZE } from 'src/consts/config';

interface IRendererState {
  app: PIXI.Application | null;
  gameContainer: PIXI.Container | null;
  boardContainer: PIXI.Container | null;
  overlayContainer: PIXI.Container | null;
  spriteBoard: (PIXI.Sprite | undefined)[][] | null;
  isDragging: boolean;
  onSelectTile: ((tiles: { x: number; y: number }) => void) | null;
  onDeselectTiles: (() => void) | null;
}

// rendering layer + input handler controller
const Renderer = (() => {
  const state: IRendererState = {
    app: null,
    gameContainer: null,
    boardContainer: null,
    overlayContainer: null,
    spriteBoard: null,
    isDragging: false,
    onSelectTile: null,
    onDeselectTiles: null,
  };

  const initialize = async () => {
    const app = new PIXI.Application<HTMLCanvasElement>({ width: APP_WIDTH_PX, height: APP_HEIGHT_PX });
    const gameContainer = new PIXI.Container();
    const boardContainer = new PIXI.Container();
    const overlayContainer = new PIXI.Container();
    app.stage.addChild(gameContainer);
    gameContainer.addChild(boardContainer);
    gameContainer.addChild(overlayContainer);

    // save to state
    state.app = app;
    state.gameContainer = gameContainer;
    state.boardContainer = boardContainer;
    state.overlayContainer = overlayContainer;

    return app;
  };

  const renderBoard = async (board: TBoard) => {
    const { app, boardContainer } = state;
    if (!app || !boardContainer) return;

    // clear board
    boardContainer.removeChildren();

    // render backboard
    const backboard = new PIXI.Graphics().beginFill('black').drawRect(0, 0, BOARD_SIZE, BOARD_SIZE).endFill();
    backboard.x = BOARD_PADDING_X_PX;
    backboard.y = BOARD_PADDING_X_PX;
    boardContainer.addChild(backboard);

    // map board to state
    const spriteBoard = board.map((row) =>
      row.map((tile) => {
        if (tile && tile.spriteURL) {
          const sprite = PIXI.Sprite.from(tile.spriteURL);
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
          sprite.x = j * TILE_SIZE + BOARD_PADDING_X_PX;
          sprite.y = i * TILE_SIZE + BOARD_PADDING_X_PX;
          boardContainer.addChild(sprite);
        }
      }
    }
  };

  const dragStart = (e) => {
    state.isDragging = true;
  };

  const dragMove = (e) => {
    if (state.isDragging && state.overlayContainer) {
      const { x, y } = e.global;
      const { spriteBoard } = state;
      if (!spriteBoard) return;

      // draw overlay
      const circle = new PIXI.Graphics();
      circle.beginFill(0x9966ff);
      circle.drawCircle(0, 0, 5);
      circle.endFill();
      circle.x = x;
      circle.y = y;
      state.overlayContainer.addChild(circle);

      // calculate which tile is selected
      const boardX = Math.floor((x - BOARD_PADDING_X_PX) / TILE_SIZE);
      const boardY = Math.floor((y - BOARD_PADDING_X_PX) / TILE_SIZE);
      if (boardX < 0 || boardY < 0 || boardX >= spriteBoard.length || boardY >= spriteBoard[0].length) return;

      // fire handler based on tile
      if (state.onSelectTile) state.onSelectTile({ x: boardX, y: boardY });
    }
  };

  const dragEnd = (e) => {
    state.isDragging = false;
    if (state.overlayContainer) state.overlayContainer.removeChildren();
    if (state.onDeselectTiles) state.onDeselectTiles();
  };

  const initializeHandlers = async () => {
    const { boardContainer } = state;
    if (boardContainer) {
      boardContainer.eventMode = 'static';
      boardContainer.on('pointerdown', dragStart);
      boardContainer.on('pointerup', dragEnd);
      boardContainer.on('pointerupoutside', dragEnd);
      boardContainer.on('pointermove', dragMove);
    }
  };

  return {
    initialize,
    renderBoard,
    initializeHandlers,

    // assign callbacks
    onSelectTile: (callback: (tiles: { x: number; y: number }) => void) => {
      state.onSelectTile = callback;
    },
    onDeselectTiles: (callback: () => void) => {
      state.onDeselectTiles = callback;
    },
    updateSelectedTiles: (tiles: { x: number; y: number }[]) => {
      const { spriteBoard } = state;
      if (!spriteBoard) return;
      // TODO: make more efficient?
      console.log('RENDERING', tiles);
      spriteBoard.forEach((row) => row.forEach((sprite) => sprite && (sprite.alpha = 1)));
      tiles.forEach(({ x, y }) => {
        const sprite = spriteBoard[y][x];
        if (sprite) sprite.alpha = 0.5;
      });
    },
  };
})();

export default Renderer;
