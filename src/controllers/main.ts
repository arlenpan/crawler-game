import GameController from './game';
import ScreenController from './screen';

// Root controller for handling initialization
const MainController = (() => {
  const handleGameStart = () => {
    GameController.initialize();
  };

  const handleGameEnd = ({ stats }) => {
    ScreenController.setCurrentScreen('gameOver', { stats });
  };

  return {
    initialize: async () => {
      ScreenController.onGameStart(handleGameStart);
      GameController.onGameOver(handleGameEnd);
      const app = await ScreenController.initialize();
      return app;
    },
  };
})();

export default MainController;
