import GameController from './game';
import ScreenController from './screen';

// Root controller for handling initialization
const MainController = (() => {
  const handleGameStart = () => {
    GameController.initialize();
  };

  return {
    initialize: async () => {
      ScreenController.onGameStart(handleGameStart);
      const app = await ScreenController.initialize();
      return app;
    },
  };
})();

export default MainController;
