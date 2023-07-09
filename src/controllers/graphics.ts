import * as PIXI from 'pixi.js';
import { TBoard } from 'src/consts/board';
import {
  BOARD_POSITION_X,
  BOARD_POSITION_Y,
  BOARD_SIZE,
  PANEL_POSITION_X,
  PANEL_POSITION_Y,
  PANEL_SIZE_X,
  PANEL_SIZE_Y,
  TILE_SIZE,
} from 'src/consts/config';
import { TYPE_ENEMY } from 'src/consts/tiles_enemies';
import { COLOR_APP_BG, COLOR_OVERLAY, HEALTH_BAR_HEIGHT, HEALTH_BAR_WIDTH, TEXT_STYLE_ENEMY } from 'src/consts/style';
import secondsToFrames from 'src/utils/secondsToFrames';
import { IPlayerState } from './game';
import { ILog } from './log';
import ScreenController from './screen';

interface IGraphicsState {
  gameContainer: PIXI.Container | null;
  boardContainer: PIXI.Container | null;
  overlayContainer: PIXI.Container | null;
  logContainer: PIXI.Container | null;
  playerContainer: PIXI.Container | null;
  spriteBoard: (PIXI.Sprite | undefined)[][] | null;
  isDragging: boolean;
  isBlockingInteraction: boolean;
}

// rendering layer + input handler controller
const GraphicsController = (() => {
  const state: IGraphicsState = {
    gameContainer: null,
    boardContainer: null,
    overlayContainer: null,
    logContainer: null,
    playerContainer: null,
    spriteBoard: null,
    isDragging: false,
    isBlockingInteraction: false,
  };

  const handlers = {
    onClickTile: null,
    onSelectTile: null,
    onDeselectTiles: null,
  };

  const initialize = async () => {
    const container = ScreenController.getContainer();

    const gameContainer = new PIXI.Container();
    container.addChild(gameContainer);
    state.gameContainer = gameContainer;

    const boardContainer = new PIXI.Container();
    gameContainer.addChild(boardContainer);
    boardContainer.position.set(BOARD_POSITION_X, BOARD_POSITION_Y);
    state.boardContainer = boardContainer;

    const overlayContainer = new PIXI.Container();
    gameContainer.addChild(overlayContainer);
    overlayContainer.position.set(BOARD_POSITION_X, BOARD_POSITION_Y);
    state.overlayContainer = overlayContainer;

    const playerContainer = new PIXI.Container();
    gameContainer.addChild(playerContainer);
    playerContainer.position.set(PANEL_POSITION_X, PANEL_POSITION_Y);
    state.playerContainer = playerContainer;

    const logContainer = new PIXI.Container();
    gameContainer.addChild(logContainer);
    logContainer.position.set(PANEL_POSITION_X + BOARD_SIZE / 2, PANEL_POSITION_Y);
    state.logContainer = logContainer;
  };

  const renderPlayer = async (playerState: IPlayerState) => {
    const { playerContainer } = state;
    if (!playerContainer) return;

    // clear player
    playerContainer.removeChildren();

    // render backdrop
    const player = new PIXI.Graphics().beginFill('gray').drawRect(0, 0, PANEL_SIZE_X, PANEL_SIZE_Y).endFill();
    player.alpha = 0.5;
    playerContainer.addChild(player);

    // render player
    const { currentHealth, maxHealth, armor, coins, turn } = playerState;
    ``;
    // render health bar
    const healthBarContainer = new PIXI.Container();
    const healthBarWrapper = new PIXI.Graphics()
      .beginFill('black')
      .drawRect(0, 0, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT)
      .endFill();
    const healthBar = new PIXI.Graphics()
      .beginFill('red')
      .drawRect(0, 0, (currentHealth / maxHealth) * HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT)
      .endFill();
    const healthBarText = new PIXI.Text(`HEALTH: ${currentHealth}/${maxHealth}`, { fontSize: 18, fill: 'white' });
    healthBarContainer.addChild(healthBarWrapper);
    healthBarContainer.addChild(healthBar);
    healthBarContainer.addChild(healthBarText);
    healthBarContainer.x = 10;
    healthBarContainer.y = 10;
    playerContainer.addChild(healthBarContainer);

    // render armor
    const armorBarContainer = new PIXI.Container();
    const armorBarWrapper = new PIXI.Graphics()
      .beginFill('black')
      .drawRect(0, 0, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT)
      .endFill();
    const armorBar = new PIXI.Graphics()
      .beginFill('lightblue')
      .drawRect(0, 0, (armor / maxHealth) * HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT);
    const armorBarText = new PIXI.Text(`ARMOR: ${armor}/${maxHealth}`, { fontSize: 18, fill: 'white' });
    armorBarContainer.addChild(armorBarWrapper);
    armorBarContainer.addChild(armorBar);
    armorBarContainer.addChild(armorBarText);
    armorBarContainer.x = 10;
    armorBarContainer.y = 10 + HEALTH_BAR_HEIGHT + 10;
    playerContainer.addChild(armorBarContainer);

    // render coins
    const coinsText = new PIXI.Text(`Coins: ${coins}`, { fontSize: 18, fill: 'gold' });
    coinsText.x = 10;
    coinsText.y = 10 + HEALTH_BAR_HEIGHT * 2 + 10 + 10;
    playerContainer.addChild(coinsText);

    // render turn
    const turnText = new PIXI.Text(`Turn: ${turn}`, { fontSize: 18, fill: 'white' });
    turnText.x = 10;
    turnText.y = 10 + HEALTH_BAR_HEIGHT * 2 + 10 + 10 + 20;
    playerContainer.addChild(turnText);
  };

  const renderBoard = async (board: TBoard) => {
    const { boardContainer } = state;
    if (!boardContainer) return;

    // clear board
    boardContainer.removeChildren();

    // render backboard
    const backboard = new PIXI.Graphics().beginFill(COLOR_APP_BG).drawRect(0, 0, BOARD_SIZE, BOARD_SIZE).endFill();
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
        addTile({ x: j, y: i }, board[i][j]);
      }
    }
  };

  const renderLog = async (logs: ILog[]) => {
    const { logContainer } = state;
    if (!logContainer) return;

    // clear log
    logContainer.removeChildren();

    // render log
    for (let i = logs.length - 1; i >= 0 && i > logs.length - 15; i--) {
      const fill = logs[i].style === 'danger' ? 'red' : 'white';
      const text = new PIXI.Text(logs[i].message, { fontSize: 18, fill });
      text.y = 10 + (logs.length - 1 - i) * 20;
      logContainer.addChild(text);
    }
  };

  const addTile = ({ x, y }: { x: number; y: number }, tile) => {
    return new Promise<void>((resolve) => {
      const { boardContainer } = state;
      if (!boardContainer) return;
      const sprite = PIXI.Sprite.from(tile.spriteURL);
      sprite.width = TILE_SIZE;
      sprite.height = TILE_SIZE;
      sprite.x = x * TILE_SIZE;
      sprite.y = y * TILE_SIZE;
      boardContainer.addChild(sprite);

      // if tile is enemy, let's draw on some text
      if (tile.type === TYPE_ENEMY) {
        const textStyle = TEXT_STYLE_ENEMY;
        const text = new PIXI.Text(`${tile.health}/${tile.maxHealth}`, textStyle);
        text.x = sprite.x + TILE_SIZE - 30;
        text.y = sprite.y + TILE_SIZE - 20;
        boardContainer.addChild(text);
      }

      if (state.spriteBoard) state.spriteBoard[y][x] = sprite;
      resolve();
    });
  };

  const moveTile = (oldCoords, newCoords, duration = secondsToFrames(0.1)) => {
    return new Promise<void>((resolve) => {
      const app = ScreenController.getApp();
      const { spriteBoard, boardContainer } = state;
      if (!spriteBoard || !boardContainer) return;

      const sprite = spriteBoard[oldCoords.y][oldCoords.x];
      if (!sprite) return;

      const newX = newCoords.x * TILE_SIZE;
      const newY = newCoords.y * TILE_SIZE;

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
      const app = ScreenController.getApp();
      const { spriteBoard, boardContainer } = state;
      if (!spriteBoard || !boardContainer) return;

      const sprite = spriteBoard[y][x];
      if (!sprite) return;

      let elapsed = 0;
      state.isBlockingInteraction = true;
      const animateTickerMethod = (delta) => {
        if (elapsed < duration) {
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

  const findTileCoordsFromTarget = (x: number, y: number) => {
    const { spriteBoard } = state;
    if (!spriteBoard) return;
    const relativeX = x - BOARD_POSITION_X;
    const relativeY = y - BOARD_POSITION_Y;

    // calculate which tile is selected
    const boardX = Math.floor(relativeX / TILE_SIZE);
    const boardY = Math.floor(relativeY / TILE_SIZE);
    if (boardX < 0 || boardY < 0 || boardX >= spriteBoard.length || boardY >= spriteBoard[0].length) return;

    return { x: boardX, y: boardY };
  };

  const dragStart = (e) => {
    if (state.isBlockingInteraction) return;
    state.isDragging = true;

    if (handlers.onClickTile) {
      const { x, y } = e.global;
      const coords = findTileCoordsFromTarget(x, y);
      if (coords) handlers.onClickTile(coords);
    }
  };

  const dragMove = (e) => {
    if (state.isDragging && state.overlayContainer) {
      const { x, y } = e.global;
      const { spriteBoard } = state;
      if (!spriteBoard) return;
      const relativeX = x - BOARD_POSITION_X;
      const relativeY = y - BOARD_POSITION_Y;

      // calculate which tile is selected
      const boardX = Math.floor(relativeX / TILE_SIZE);
      const boardY = Math.floor(relativeY / TILE_SIZE);
      if (boardX < 0 || boardY < 0 || boardX >= spriteBoard.length || boardY >= spriteBoard[0].length) return;

      // only allow a small zone in the middle of the tile to be selected
      const tileX = relativeX % TILE_SIZE;
      const tileY = relativeY % TILE_SIZE;
      if (tileX < 10 || tileX > TILE_SIZE - 10 || tileY < 10 || tileY > TILE_SIZE - 10) return;

      // fire handler based on tile
      if (handlers.onSelectTile) handlers.onSelectTile({ x: boardX, y: boardY });
    }
  };

  const dragEnd = (e) => {
    state.isDragging = false;
    if (state.overlayContainer) state.overlayContainer.removeChildren();
    if (handlers.onDeselectTiles) handlers.onDeselectTiles();
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

  const disableHandlers = async () => {
    const { boardContainer } = state;
    if (boardContainer) {
      boardContainer.eventMode = 'none';
    }
  };

  const drawOverlay = (tiles: { x: number; y: number }[], text?: string) => {
    const { spriteBoard } = state;
    if (!spriteBoard) return;

    // reset board
    if (tiles.length === 0) {
      spriteBoard.forEach((row) => row.forEach((sprite) => sprite && (sprite.alpha = 1)));
      return;
    }

    // update board style
    spriteBoard.forEach((row) => row.forEach((sprite) => sprite && (sprite.alpha = 0.5)));
    state.overlayContainer?.removeChildren();
    for (let i = 0; i < tiles.length; i++) {
      const { x, y } = tiles[i];
      const sprite = spriteBoard[y][x];
      if (sprite) sprite.alpha = 1;

      // draw dot on selected tile
      const circle = new PIXI.Graphics().beginFill(COLOR_OVERLAY).drawCircle(0, 0, 5).endFill();
      circle.x = x * TILE_SIZE + TILE_SIZE / 2;
      circle.y = y * TILE_SIZE + TILE_SIZE / 2;
      state.overlayContainer?.addChild(circle);

      // draw line to previous tile if it exists
      if (i > 0) {
        const previousTile = tiles[i - 1];
        const prevX = previousTile.x * TILE_SIZE + TILE_SIZE / 2;
        const prevY = previousTile.y * TILE_SIZE + TILE_SIZE / 2;
        const line = new PIXI.Graphics().lineStyle(3, COLOR_OVERLAY).moveTo(prevX, prevY).lineTo(circle.x, circle.y);
        state.overlayContainer?.addChild(line);
      }

      // draw text on last tile
      if (i === tiles.length - 1 && text) {
        const textSprite = new PIXI.Text(text, { fontSize: 24, fill: COLOR_OVERLAY });
        textSprite.x = circle.x + 10;
        textSprite.y = circle.y - 10;
        state.overlayContainer?.addChild(textSprite);
      }
    }
  };

  return {
    initialize,
    renderBoard,
    renderPlayer,
    renderLog,
    initializeHandlers,
    disableHandlers,
    addTile,
    moveTile,
    removeTile,

    // this fires when tiles are selected
    updateSelectedTiles: (tiles: { x: number; y: number }[], text?: string) => {
      drawOverlay(tiles, text);
    },

    // assign callbacks
    onClickTile: (callback: (tiles: { x: number; y: number }) => void) => {
      handlers.onClickTile = callback;
    },
    onSelectTile: (callback: (tiles: { x: number; y: number }) => void) => {
      handlers.onSelectTile = callback;
    },
    onDeselectTiles: (callback: () => void) => {
      handlers.onDeselectTiles = callback;
    },
  };
})();

export default GraphicsController;
