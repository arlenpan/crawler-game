import { getWeightedRandomIndex } from 'src/utils/getWeightedRandomIndex';
import { BASE_TILES, ENEMY_TILES, TBoard, TBoardTile } from 'src/consts/board';
import { BOARD_HEIGHT, BOARD_WIDTH } from 'src/consts/config';
import { TYPE_ENEMY } from 'src/consts/enemies';
import { TILE_SWORD } from 'src/consts/tiles';
import Renderer from './renderer';

interface IGameState {
  board: TBoard | null;
  selectedTiles: { x: number; y: number }[];
  gameTurn: number;
}

// game logic and base controller
const GameController = (() => {
  const state: IGameState = {
    board: null,
    selectedTiles: [],
    gameTurn: 0,
  };

  const initialize = async () => {
    const app = await Renderer.initialize();
    const board = generateBoard();
    state.board = board;
    Renderer.renderBoard(board);
    Renderer.onSelectTile(handleSelectTile);
    Renderer.onDeselectTiles(handleDeselectTiles);
    Renderer.initializeHandlers();
    return app;
  };

  const generateBoard = (width = BOARD_WIDTH, height = BOARD_HEIGHT) => {
    const board: TBoard = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => generateRandomTile())
    );
    return board;
  };

  const generateRandomTile = () => {
    // choose random tile based on weight
    const ALL_TILES = [...BASE_TILES, ...ENEMY_TILES];
    const weights = ALL_TILES.map((tile) => tile.rate);
    const randomIndex = getWeightedRandomIndex(weights);
    return ALL_TILES[randomIndex];
  };

  const canStartDragOnTile = (tile: TBoardTile) => {
    if (!tile) return false;
    if (tile.type === TYPE_ENEMY) return false;
    return true;
  };

  const canDragToNextTile = (firstTile?: TBoardTile, secondTile?: TBoardTile) => {
    if (!firstTile || !secondTile) return false;
    if (firstTile.type === TYPE_ENEMY && secondTile.type === TILE_SWORD.type) return true;
    if (firstTile.type === TILE_SWORD.type && secondTile.type === TYPE_ENEMY) return true;
    if (firstTile.type === secondTile.type) return true;
    return false;
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
          Renderer.updateSelectedTiles(selectedTiles);
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
      Renderer.updateSelectedTiles(selectedTiles);
    }
  };

  // resolve action
  const handleDeselectTiles = () => {
    const { selectedTiles, board } = state;
    console.log(selectedTiles);

    // require minimum of three tiles to resolve action
    if (selectedTiles.length > 2) {
      handleResolveAction(selectedTiles);
    }
    state.selectedTiles = [];
    Renderer.updateSelectedTiles([]);
  };

  const handleResolveAction = (selectedTiles: { x: number; y: number }[]) => {
    // remove tiles from board
    const { board } = state;
    if (board) {
      selectedTiles.forEach((tile) => {
        board[tile.y][tile.x] = null;
      });

      // collapse columns down
      for (let x = 0; x < BOARD_WIDTH; x++) {
        for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
          if (board[y][x] === null) {
            for (let y2 = y - 1; y2 >= 0; y2--) {
              if (board[y2][x] !== null) {
                board[y][x] = board[y2][x];
                board[y2][x] = null;
                break;
              }
            }
          }
        }
      }

      // generate new tiles
      for (let x = 0; x < BOARD_WIDTH; x++) {
        for (let y = 0; y < BOARD_HEIGHT; y++) {
          if (board[y][x] === null) {
            board[y][x] = generateRandomTile();
          }
        }
      }

      Renderer.renderBoard(board);
    }
  };

  return { initialize, canStartDragOnTile, canDragToNextTile };
})();

export default GameController;
