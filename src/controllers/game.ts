import { TBoard } from 'src/consts/board';
import { BOARD_HEIGHT, BOARD_WIDTH } from 'src/consts/config';
import { IEnemyTile, TYPE_ENEMY } from 'src/consts/enemies';
import { TILE_COIN, TILE_POTION, TILE_SHIELD, TILE_SWORD } from 'src/consts/tiles';
import { canDragToNextTile, canStartDragOnTile, generateBoard, generateRandomTile } from 'src/helpers/gameLogic';
import GraphicsController from './graphics';
import LogController from './log';

interface IGameState {
  board: TBoard | null;
  selectedTiles: { x: number; y: number }[];
  player: IPlayerState;
}

export interface IPlayerState {
  currentHealth: number;
  maxHealth: number;
  armor: number;
  coins: number;
  turn: number;
}

// game logic and base controller
const GameController = (() => {
  const state: IGameState = {
    board: null,
    selectedTiles: [],
    player: {
      currentHealth: 50,
      maxHealth: 50,
      armor: 0,
      coins: 0,
      turn: 0,
    },
  };

  const handlers = {
    onGameOver: null,
  };

  const initialize = async () => {
    await GraphicsController.initialize();
    const board = generateBoard();
    state.board = board;
    GraphicsController.renderPlayer(state.player);
    GraphicsController.renderBoard(board);
    GraphicsController.onSelectTile(handleSelectTile);
    GraphicsController.onDeselectTiles(handleDeselectTiles);
    GraphicsController.initializeHandlers();
    LogController.initialize();
    GraphicsController.renderLog(LogController.get());
  };

  // validate logic whether user is allowed to select next tile
  const handleSelectTile = (tileCoords: { x: number; y: number }) => {
    const { selectedTiles, board } = state;
    const { x, y } = tileCoords;
    const tile = board?.[y][x];
    if (tile) {
      // check if two tiles ago - if so, undo previous selection
      if (selectedTiles.length > 1) {
        const previousTile = selectedTiles[selectedTiles.length - 2];
        const isTwoTilesAgo = previousTile.x === x && previousTile.y === y;
        if (isTwoTilesAgo) {
          selectedTiles.pop();
          GraphicsController.updateSelectedTiles(selectedTiles, calculateSelectedTilesText(selectedTiles));
          return;
        }
      }

      // check that tile is not already selected
      const isTileAlreadySelected = selectedTiles.some((selectedTile) => selectedTile.x === x && selectedTile.y === y);
      if (isTileAlreadySelected) return;

      // if board is not empty we're continuing drag and validating tile
      if (selectedTiles.length > 0) {
        const previousTile = selectedTiles[selectedTiles.length - 1];
        const isTileAdjacent = Math.abs(previousTile.x - x) <= 1 && Math.abs(previousTile.y - y) <= 1;
        const canDrag = canDragToNextTile(board?.[previousTile.y][previousTile.x], tile);
        if (isTileAdjacent && canDrag) {
          selectedTiles.push(tileCoords);
        }
      }

      // if board is empty we're starting drag
      if (selectedTiles.length === 0 && canStartDragOnTile(tile)) {
        selectedTiles.push(tileCoords);
      }

      // update state
      GraphicsController.updateSelectedTiles(selectedTiles, calculateSelectedTilesText(selectedTiles));
    }
  };

  const calculateSelectedTilesText = (selectedTiles: { x: number; y: number }[]) => {
    if (selectedTiles.length < 3) return;

    const tiles = selectedTiles.map((tile) => state.board?.[tile.y][tile.x]);

    // count tiles and render text accordingly
    if (tiles.every((tile) => tile.type === TILE_COIN.type)) return `+${tiles.length} coins`;
    if (tiles.every((tile) => tile.type === TILE_SHIELD.type)) return `+${tiles.length} shield`;
    if (tiles.every((tile) => tile.type === TILE_POTION.type)) return `+${tiles.length} health`;
    if (tiles.some((tile) => tile.type === TILE_SWORD.type) && tiles.some((tile) => tile.type === TYPE_ENEMY)) {
      const swords = tiles.filter((tile) => tile.type === TILE_SWORD.type).length;
      return `${swords} damage`;
    }
    return;
  };

  const handleDeselectTiles = () => {
    const { selectedTiles } = state;
    const tiles = selectedTiles.map((tile) => state.board?.[tile.y][tile.x]);
    if (tiles.length > 2 && !tiles.every((t) => t.type === TYPE_ENEMY)) processSelectedTiles(selectedTiles);

    state.selectedTiles = [];
    GraphicsController.updateSelectedTiles([]);
  };

  const processSelectedTiles = async (selectedTiles: { x: number; y: number }[]) => {
    await resolvePlayerActions(selectedTiles);
    await resolveEnemyActions();
    await updateBoard(selectedTiles);
  };

  const resolvePlayerActions = async (selectedTiles) => {
    const { board } = state;
    if (!board) return;
    let logMessage = '';

    // calculate damage against enemies
    if (selectedTiles.some((tile) => board[tile.y][tile.x].type === TYPE_ENEMY)) {
      const damage = selectedTiles.filter((tile) => board[tile.y][tile.x].type === TILE_SWORD.type).length;
      const enemyTiles = selectedTiles.filter((tile) => board[tile.y][tile.x].type === TYPE_ENEMY);
      enemyTiles.forEach((tile) => {
        const enemy = board[tile.y][tile.x] as IEnemyTile;
        if (enemy) enemy.health -= damage;
        board[tile.y][tile.x] = enemy;
      });
      logMessage = `${damage} damage to ${enemyTiles.length} enemies`;
    }

    // resolve potions
    if (selectedTiles.some((tile) => board[tile.y][tile.x].type === TILE_POTION.type)) {
      const potions = selectedTiles.filter((tile) => board[tile.y][tile.x].type === TILE_POTION.type).length;
      state.player.currentHealth += potions;
      if (state.player.currentHealth > state.player.maxHealth) state.player.currentHealth = state.player.maxHealth;
      logMessage += `+${potions} health`;
    }

    // resolve shields
    if (selectedTiles.some((tile) => board[tile.y][tile.x].type === TILE_SHIELD.type)) {
      const shields = selectedTiles.filter((tile) => board[tile.y][tile.x].type === TILE_SHIELD.type).length;
      state.player.armor += shields;
      logMessage += `+${shields} shield`;
    }

    // resolve coins
    if (selectedTiles.some((tile) => board[tile.y][tile.x].type === TILE_COIN.type)) {
      const coins = selectedTiles.filter((tile) => board[tile.y][tile.x].type === TILE_COIN.type).length;
      state.player.coins += coins;
      logMessage += `+${coins} coins`;
    }

    state.player.turn += 1;

    LogController.add(logMessage);
    GraphicsController.renderLog(LogController.get());
    GraphicsController.renderPlayer(state.player);
  };

  const resolveEnemyActions = async () => {
    const { board } = state;
    if (!board) return;

    // calculate damage against player
    const aliveEnemies = board.flat().filter((tile) => tile?.type === TYPE_ENEMY && (tile as IEnemyTile).health > 0);
    const damage = aliveEnemies.reduce((acc, enemy) => acc + (enemy as IEnemyTile).attack, 0);

    // break shields first
    state.player.armor -= damage;
    if (state.player.armor < 0) {
      const diff = Math.abs(state.player.armor);
      state.player.armor = 0;
      state.player.currentHealth -= diff;
    }

    LogController.add(`${damage} damage from enemies`, 'danger');
    GraphicsController.renderLog(LogController.get());
    GraphicsController.renderPlayer(state.player);

    // check if player is dead
    if (state.player.currentHealth <= 0) {
      handleGameOver();
      return;
    }
  };

  const handleGameOver = async () => {
    GraphicsController.disableHandlers();
    if (handlers.onGameOver) {
      handlers.onGameOver({
        stats: { coins: state.player.coins, turns: state.player.turn },
      });
    }
    resetGame();
  };

  const resetGame = async () => {
    state.board = generateBoard();
    state.player = {
      currentHealth: 50,
      maxHealth: 50,
      armor: 0,
      coins: 0,
      turn: 0,
    };
    LogController.reset();
  };

  const updateBoard = async (selectedTiles: { x: number; y: number }[]) => {
    const { board, player } = state;
    if (!board) return;

    // remove tiles and dead enemies
    const removePromises = [];
    selectedTiles.forEach(async (tile) => {
      if (board[tile.y][tile.x].type === TYPE_ENEMY) {
        if ((board[tile.y][tile.x] as IEnemyTile).health <= 0) {
          board[tile.y][tile.x] = null;
          removePromises.push(GraphicsController.removeTile(tile));
        }
      } else {
        board[tile.y][tile.x] = null;
        removePromises.push(GraphicsController.removeTile(tile));
      }
    });
    await Promise.all(removePromises);

    // collapse columns down
    const movePromises = [];
    for (let x = 0; x < BOARD_WIDTH; x++) {
      for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        if (board[y][x] === null) {
          for (let y2 = y - 1; y2 >= 0; y2--) {
            if (board[y2][x] !== null) {
              board[y][x] = board[y2][x];
              board[y2][x] = null;
              movePromises.push(GraphicsController.moveTile({ x, y: y2 }, { x, y }));
              break;
            }
          }
        }
      }
    }
    await Promise.all(movePromises);

    // generate new tiles
    const addPromises = [];
    for (let x = 0; x < BOARD_WIDTH; x++) {
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        if (board[y][x] === null) {
          const tile = generateRandomTile(player.turn);
          board[y][x] = tile;
          addPromises.push(GraphicsController.addTile({ x, y }, tile));
        }
      }
    }
    await Promise.all(addPromises);

    GraphicsController.renderBoard(board);
  };

  return {
    initialize,
    canStartDragOnTile,
    canDragToNextTile,

    onGameOver: (callback) => (handlers.onGameOver = callback),
  };
})();

export default GameController;
