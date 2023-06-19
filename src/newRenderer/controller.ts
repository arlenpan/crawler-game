import renderer from './renderer';
import game from './game';

const Controller = (() => {
  const initialize = async () => {
    const app = await renderer.initialize();
    const board = await game.initialize();
    renderer.initializeBoard(board);
    return app;
  };

  return { initialize };
})();

export default Controller;
