import { Button } from '@pixi/ui';
import * as PIXI from 'pixi.js';
import { APP_HEIGHT_PX, APP_WIDTH_PX, BOARD_MAX_WIDTH, GAME_HEIGHT_TO_WIDTH_RATIO } from 'src/consts/config';
import { GAME_OVER, GAME_TITLE } from 'src/consts/strings';
import { renderButton } from 'src/helpers/graphicsUtils';

type TScreenType = 'home' | 'game' | 'gameOver';

interface IScreenState {
  app: PIXI.Application | null;
  screenContainer: PIXI.Container | null;
  currentScreenType: TScreenType;
}

// Controller for UI elements in menus and main screen
const ScreenController = (() => {
  const state: IScreenState = {
    app: null,
    screenContainer: null,
    currentScreenType: 'home',
  };

  const handlers = {
    onGameStart: null,
  };

  // get app and bind to controller
  const initialize = async () => {
    const app = new PIXI.Application<HTMLCanvasElement>({ width: APP_WIDTH_PX, height: APP_HEIGHT_PX });
    state.app = app;

    const background = new PIXI.Graphics().beginFill('red').drawRect(0, 0, app.view.width, app.view.height);
    app.stage.addChild(background);

    const screenContainer = new PIXI.Container();
    app.stage.addChild(screenContainer);
    state.screenContainer = screenContainer;

    setCurrentScreen('home');
    return app;
  };

  const setCurrentScreen = (screen: TScreenType, context?: any) => {
    state.currentScreenType = screen;
    switch (screen) {
      case 'home':
        renderHomeScreen();
        break;
      case 'game':
        renderGameScreen();
        break;
      case 'gameOver':
        renderGameOverScreen(context);
        break;
    }
  };

  const renderSplashScreen = () => {
    console.log('splash');
  };

  const renderHomeScreen = () => {
    const { screenContainer } = state;
    if (!screenContainer) return;
    screenContainer.removeChildren();

    const title = new PIXI.Text(GAME_TITLE, { fill: 0xffffff });
    title.anchor.set(0.5);
    title.position.set(APP_WIDTH_PX / 2, APP_HEIGHT_PX / 2);
    screenContainer.addChild(title);

    const button = renderButton({ text: 'START', onClick: () => setCurrentScreen('game') });
    button.position.set(APP_WIDTH_PX / 2 - 75, APP_HEIGHT_PX / 2 + 50);
    screenContainer.addChild(button);
  };

  const renderGameScreen = async () => {
    const { screenContainer } = state;
    if (!screenContainer) return;
    screenContainer.removeChildren();

    if (handlers.onGameStart) handlers.onGameStart();
  };

  const renderGameOverScreen = (context) => {
    const { screenContainer } = state;
    if (!screenContainer) return;
    screenContainer.removeChildren();

    const text = new PIXI.Text(GAME_OVER, { fill: 'white' });
    text.anchor.set(0.5);
    text.position.set(APP_WIDTH_PX / 2, APP_HEIGHT_PX / 2);
    screenContainer.addChild(text);

    if (context?.stats) {
      const { stats } = context;
      const statsText = new PIXI.Text(`Score: ${stats.coins} Coins\nTurns: ${stats.turns}`, { fill: 'white' });
      statsText.anchor.set(0.5);
      statsText.position.set(APP_WIDTH_PX / 2, APP_HEIGHT_PX / 2 + 75);
      screenContainer.addChild(statsText);
    }

    const button = renderButton({ text: 'RESTART', onClick: () => setCurrentScreen('game') });
    button.position.set(APP_WIDTH_PX / 2 - 75, APP_HEIGHT_PX / 2 + 125);
    screenContainer.addChild(button);
  };

  return {
    initialize,
    setCurrentScreen,

    getApp: () => state.app,
    getContainer: () => state.screenContainer,

    onGameStart: (callback) => (handlers.onGameStart = callback),
  };
})();

export default ScreenController;
