import { useEffect, useState } from 'react';
import MainController from 'src/controllers/main';

const GameComponent = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function load() {
      const app = await MainController.initialize();
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
