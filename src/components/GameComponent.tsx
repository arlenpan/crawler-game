import { useEffect, useState } from 'react';
import GameController from 'src/controllers/game';

const GameComponent = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function load() {
      const app = await GameController.initialize();
      const node = document.getElementById('pixi-root');
      if (node) {
        setIsInitialized(true);
        node.appendChild(app.view);
      }
    }

    if (!isInitialized) load();
  }, [isInitialized]);

  return <div id="pixi-root" />;
};

export default GameComponent;
