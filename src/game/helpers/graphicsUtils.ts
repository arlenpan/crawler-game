import * as PIXI from 'pixi.js';
import { Button } from '@pixi/ui';

export const renderButton = ({ text, onClick }) => {
  const buttonContainer = new PIXI.Container();
  const buttonGraphic = new PIXI.Graphics().beginFill('white').drawRoundedRect(0, 0, 150, 50, 50).endFill();
  const startButton = new Button(buttonGraphic);
  startButton.onPress.connect(onClick);
  buttonContainer.addChild(startButton.view);
  const buttonText = new PIXI.Text(text, { fill: 'black' });
  buttonText.anchor.set(0.5);
  buttonText.position.set(75, 25);
  buttonContainer.addChild(buttonText);
  buttonContainer.position.set(75, 25);
  return buttonContainer;
};
