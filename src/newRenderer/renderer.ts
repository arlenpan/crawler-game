import * as PIXI from 'pixi.js';
import { SPRITE_SRC } from './consts/sprites';
import { APP_HEIGHT_PX, APP_WIDTH_PX, BOARD_PADDING_X_PX, BOARD_SIZE, TILE_SIZE } from './consts/config';
import { TBoard } from './consts/board';

interface IRendererState {
  app: PIXI.Application | null;
  gameContainer: PIXI.Container | null;
  boardContainer: PIXI.Container | null;
  overlayContainer: PIXI.Container | null;
  spriteBoard: (PIXI.Sprite | undefined)[][] | null;
  isDragging: boolean;
  selectedTiles: { x: number; y: number }[];
  onSelectTiles: ((tiles: { x: number; y: number }[]) => void) | null;
}

// rendering layer for game
const Renderer = (() => {
  const state: IRendererState = {
    app: null,
    gameContainer: null,
    boardContainer: null,
    overlayContainer: null,
    spriteBoard: null,
    isDragging: false,
    selectedTiles: [],
    onSelectTiles: null,
  };

  const initialize = async () => {
    const app = new PIXI.Application<HTMLCanvasElement>({ width: APP_WIDTH_PX, height: APP_HEIGHT_PX });
    const gameContainer = new PIXI.Container();
    const boardContainer = new PIXI.Container();
    const overlayContainer = new PIXI.Container();
    app.stage.addChild(gameContainer);
    gameContainer.addChild(boardContainer);
    gameContainer.addChild(overlayContainer);

    state.app = app;
    state.gameContainer = gameContainer;
    state.boardContainer = boardContainer;
    state.overlayContainer = overlayContainer;

    return app;
  };

  const initializeBoard = async (board: TBoard) => {
    const { app, boardContainer } = state;
    if (!app || !boardContainer) return;

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
    const backboard = new PIXI.Graphics().beginFill('black').drawRect(0, 0, BOARD_SIZE, BOARD_SIZE).endFill();
    backboard.x = BOARD_PADDING_X_PX;
    backboard.y = BOARD_PADDING_X_PX;
    boardContainer.addChild(backboard);

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

  // set callbacks for handlers
  const onSelectTiles = (callback: (tiles: { x: number; y: number }[]) => void) => {
    state.onSelectTiles = callback;
  };

  const dragStart = (e) => {
    state.isDragging = true;
    console.log('pointerdown');
    console.log(e.global);
  };

  const dragEnd = (e) => {
    state.isDragging = false;
    if (state.overlayContainer) state.overlayContainer.removeChildren();
    if (state.onSelectTiles) state.onSelectTiles(state.selectedTiles);
    state.selectedTiles.forEach(({ x, y }) => {
      const sprite = state?.spriteBoard?.[y][x];
      if (sprite) sprite.alpha = 1;
    });
    state.selectedTiles = [];
  };

  const dragMove = (e) => {
    if (state.isDragging && state.overlayContainer) {
      const { x, y } = e.global;
      const { spriteBoard, selectedTiles } = state;
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

      // find if the tile is already selected
      const isAlreadySelected = selectedTiles.some((tile) => tile.x === boardX && tile.y === boardY);
      if (!isAlreadySelected) {
        // add the tile to selectedTiles
        state.selectedTiles.push({ x: boardX, y: boardY });
        const sprite = spriteBoard[boardY][boardX];
        if (sprite) sprite.alpha = 0.5;
      }
    }
  };

  const initializeHandler = async () => {
    const { boardContainer } = state;
    if (boardContainer) {
      boardContainer.eventMode = 'static';
      boardContainer.on('pointerdown', dragStart);
      boardContainer.on('pointerup', dragEnd);
      boardContainer.on('pointerupoutside', dragEnd);
      boardContainer.on('pointermove', dragMove);
    }
  };

  return { initialize, initializeBoard, initializeHandler, onSelectTiles };
})();

export default Renderer;
