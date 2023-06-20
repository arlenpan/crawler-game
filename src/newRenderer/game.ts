import { getWeightedRandomIndex } from 'src/utils/getWeightedRandomIndex';
import { BASE_TILES, ENEMY_TILES, TBoard, TBoardTile } from './consts/board';
import { BOARD_HEIGHT, BOARD_WIDTH } from './consts/config';

interface IGameState {
  board: TBoard | null;
  selectedTiles: TBoardTile[];
  gameTurn: number;
}

const Game = (() => {
  const state: IGameState = {
    board: null,
    selectedTiles: [],
    gameTurn: 0,
  };

  const initialize = async () => {
    const board = generateInitialBoard();
    state.board = board;
    return board;
  };

  const generateInitialBoard = (width = BOARD_WIDTH, height = BOARD_HEIGHT) => {
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

  const setSelectedTiles = (tiles: { x: number; y: number }[]) => {
    const { board } = state;
    if (!board) return;

    const selectedTiles = tiles.map((tile) => board[tile.y][tile.x]);
    state.selectedTiles = selectedTiles;
  };

  return { initialize, setSelectedTiles };
})();

export default Game;
