// import { useContext } from 'react';
import { GameContext } from 'src/contexts/GameContext';
import { game } from 'src/game/state';
import styles from './Game.module.css';

export const GamePage = () => {
    return (
        <GameContext.Provider value={{ title: 'Game' }}>
            <GamePageContent />
        </GameContext.Provider>
    );
};

const GamePageContent = () => {
    // const { title } = useContext(GameContext);
    console.log(game);

    return (
        <div>
            {game.state.map((row, i) => (
                <div key={i} className="d-flex align-center">
                    {row.map((tile, j) => (
                        <div key={j} className={styles.tile}>
                            {tile}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
