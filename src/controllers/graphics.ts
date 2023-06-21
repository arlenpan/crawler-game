import * as PIXI from 'pixi.js';
import { TBoard } from 'src/consts/board';
import {
  APP_HEIGHT_PX,
  APP_WIDTH_PX,
  BOARD_PADDING_PX,
  BOARD_SIZE,
  PANEL_POSITION_X,
  PANEL_POSITION_Y,
  PANEL_SIZE_X,
  PANEL_SIZE_Y,
  TILE_SIZE,
} from 'src/consts/config';
import { IPlayerState } from './game';
import secondsToFrames from 'src/utils/secondsToFrames';

interface IGraphicsState {
  app: PIXI.Application | null;
  gameContainer: PIXI.Container | null;
  boardContainer: PIXI.Container | null;
  overlayContainer: PIXI.Container | null;
  playerContainer: PIXI.Container | null;
  spriteBoard: (PIXI.Sprite | undefined)[][] | null;
  isDragging: boolean;
  onSelectTile: ((tiles: { x: number; y: number }) => void) | null;
  onDeselectTiles: (() => void) | null;
  isBlockingInteraction: boolean;
}

// rendering layer + input handler controller
const GraphicsController = (() => {
  const state: IGraphicsState = {
    app: null,
    gameContainer: null,
    boardContainer: null,
    overlayContainer: null,
    playerContainer: null,
    spriteBoard: null,
    isDragging: false,
    onSelectTile: null,
    onDeselectTiles: null,
    isBlockingInteraction: false,
  };

  const initialize = async () => {
    const app = new PIXI.Application<HTMLCanvasElement>({ width: APP_WIDTH_PX, height: APP_HEIGHT_PX });
    state.app = app;

    const gameContainer = new PIXI.Container();
    app.stage.addChild(gameContainer);
    state.gameContainer = gameContainer;

    const boardContainer = new PIXI.Container();
    gameContainer.addChild(boardContainer);
    state.boardContainer = boardContainer;

    const overlayContainer = new PIXI.Container();
    gameContainer.addChild(overlayContainer);
    state.overlayContainer = overlayContainer;

    const playerContainer = new PIXI.Container();
    gameContainer.addChild(playerContainer);
    state.playerContainer = playerContainer;

    return app;
  };

  const renderPlayer = async (playerState: IPlayerState) => {
    const { app, playerContainer } = state;
    if (!app || !playerContainer) return;

    // clear player
    playerContainer.removeChildren();

    // render backdrop
    const player = new PIXI.Graphics()
      .beginFill('gray')
      .drawRect(PANEL_POSITION_X, PANEL_POSITION_Y, PANEL_SIZE_X, PANEL_SIZE_Y)
      .endFill();
    player.alpha = 0.5;
    playerContainer.addChild(player);

    // render player
    const { currentHealth, maxHealth, coins } = playerState;
    const textStyle = { fontSize: 24, fill: 'white' };
    const text = new PIXI.Text(`Player Health: ${currentHealth}/${maxHealth}\nPlayer Coins: ${coins}`, textStyle);
    text.x = PANEL_POSITION_X + 10;
    text.y = PANEL_POSITION_Y + 10;
    playerContainer.addChild(text);
  };

  const renderBoard = async (board: TBoard) => {
    const { app, boardContainer } = state;
    if (!app || !boardContainer) return;

    // clear board
    boardContainer.removeChildren();

    // render backboard
    const backboard = new PIXI.Graphics()
      .beginFill('black')
      .drawRect(BOARD_PADDING_PX, BOARD_PADDING_PX, BOARD_SIZE, BOARD_SIZE)
      .endFill();
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
          sprite.x = j * TILE_SIZE + BOARD_PADDING_PX;
          sprite.y = i * TILE_SIZE + BOARD_PADDING_PX;
          boardContainer.addChild(sprite);
        }
      }
    }
  };

  const addTile = ({ x, y }: { x: number; y: number }, spriteURL: string) => {
    return new Promise<void>((resolve) => {
      const { app, boardContainer } = state;
      if (!app || !boardContainer) return;
      const sprite = PIXI.Sprite.from(spriteURL);
      sprite.width = TILE_SIZE;
      sprite.height = TILE_SIZE;
      sprite.x = x * TILE_SIZE + BOARD_PADDING_PX;
      sprite.y = y * TILE_SIZE + BOARD_PADDING_PX;
      boardContainer.addChild(sprite);
      if (state.spriteBoard) state.spriteBoard[y][x] = sprite;
      resolve();
    });
  };

  const moveTile = (oldCoords, newCoords, duration = secondsToFrames(0.1)) => {
    return new Promise<void>((resolve) => {
      const { app, spriteBoard, boardContainer } = state;
      if (!app || !spriteBoard || !boardContainer) return;

      const sprite = spriteBoard[oldCoords.y][oldCoords.x];
      if (!sprite) return;

      const newX = newCoords.x * TILE_SIZE + BOARD_PADDING_PX;
      const newY = newCoords.y * TILE_SIZE + BOARD_PADDING_PX;

      // start animation
      let elapsed = 0;
      state.isBlockingInteraction = true;
      const animateTickerMethod = (delta) => {
        if (elapsed < duration) {
          elapsed += delta;

          // get current position
          const { x, y } = sprite;
          const diffX = newX - x;
          const diffY = newY - y;

          // move across duration
          sprite.x = x + (diffX * delta) / duration;
          sprite.y = y + (diffY * delta) / duration;
        } else {
          app.ticker.remove(animateTickerMethod);
          state.isBlockingInteraction = false;
          sprite.x = newX;
          sprite.y = newY;

          // update spriteboard
          spriteBoard[oldCoords.y][oldCoords.x] = undefined;
          spriteBoard[newCoords.y][newCoords.x] = sprite;

          resolve();
        }
      };
      app.ticker.add(animateTickerMethod);
    });
  };

  const removeTile = async ({ x, y }: { x: number; y: number }, duration = secondsToFrames(0.1)) => {
    return new Promise<void>((resolve) => {
      const { app, spriteBoard, boardContainer } = state;
      if (!app || !spriteBoard || !boardContainer) return;

      const sprite = spriteBoard[y][x];
      if (!sprite) return;

      let elapsed = 0;
      state.isBlockingInteraction = true;
      const animateTickerMethod = (delta) => {
        if (elapsed < duration) {
          console.log('TICK', delta, elapsed);
          elapsed += delta;
          sprite.alpha = 1 - elapsed / duration;
        } else {
          spriteBoard[y][x] = undefined;
          state.isBlockingInteraction = false;
          boardContainer.removeChild(sprite);
          resolve();
        }
      };

      app.ticker.add(animateTickerMethod);
    });
  };

  const dragStart = (e) => {
    if (state.isBlockingInteraction) return;
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
      const boardX = Math.floor((x - BOARD_PADDING_PX) / TILE_SIZE);
      const boardY = Math.floor((y - BOARD_PADDING_PX) / TILE_SIZE);
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
    renderPlayer,
    initializeHandlers,
    addTile,
    moveTile,
    removeTile,

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
      spriteBoard.forEach((row) => row.forEach((sprite) => sprite && (sprite.alpha = 1)));
      tiles.forEach(({ x, y }) => {
        const sprite = spriteBoard[y][x];
        if (sprite) sprite.alpha = 0.5;
      });
    },
  };
})();

export default GraphicsController;
