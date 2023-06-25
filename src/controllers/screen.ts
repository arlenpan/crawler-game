import { Button } from '@pixi/ui';
import * as PIXI from 'pixi.js';
import { APP_HEIGHT_PX, APP_WIDTH_PX } from 'src/consts/config';
import { GAME_TITLE } from 'src/consts/strings';

type TScreenType = 'home' | 'game' | 'gameOver';

interface IScreenState {
  app: PIXI.Application | null;
  screenContainer: PIXI.Container | null;
  currentScreenType: TScreenType;
  onGameStart: (() => void) | null;
}

// Controller for UI elements in menus and main screen
const ScreenController = (() => {
  const state: IScreenState = {
    app: null,
    screenContainer: null,
    currentScreenType: 'home',
    onGameStart: null,
  };

  // get app and bind to controller
  const initialize = async () => {
    const app = new PIXI.Application<HTMLCanvasElement>({ width: APP_WIDTH_PX, height: APP_HEIGHT_PX });
    state.app = app;

    const screenContainer = new PIXI.Container();
    app.stage.addChild(screenContainer);
    state.screenContainer = screenContainer;

    setCurrentScreen('home');
    return app;
  };

  const setCurrentScreen = (screen: TScreenType) => {
    state.currentScreenType = screen;
    switch (screen) {
      case 'home':
        renderHomeScreen();
        break;
      case 'game':
        renderGameScreen();
        break;
      case 'gameOver':
        renderGameOverScreen();
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

    const buttonGraphic = new PIXI.Graphics()
      .beginFill('white')
      .drawRoundedRect(APP_WIDTH_PX / 2 - 75, APP_HEIGHT_PX / 2 + 50, 150, 50, 50)
      .endFill();
    const startButton = new Button(buttonGraphic);
    startButton.onPress.connect(() => {
      setCurrentScreen('game');
    });
    screenContainer.addChild(startButton.view);

    const buttonText = new PIXI.Text('START', { fill: 'black' });
    buttonText.anchor.set(0.5);
    buttonText.position.set(APP_WIDTH_PX / 2, APP_HEIGHT_PX / 2 + 75);
    screenContainer.addChild(buttonText);
  };

  const renderGameScreen = async () => {
    const { app, screenContainer } = state;
    if (!app || !screenContainer) return;
    screenContainer.removeChildren();

    if (state.onGameStart) state.onGameStart();
  };

  const renderGameOverScreen = () => {
    console.log('gameover');
  };

  return {
    initialize,
    setCurrentScreen,

    onGameStart: (callback) => (state.onGameStart = callback),
    getApp: () => state.app,
    getContainer: () => state.screenContainer,
  };
})();

export default ScreenController;
