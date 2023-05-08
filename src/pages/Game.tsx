import { Game } from 'src/components/Game';
import { GameContext } from 'src/contexts/GameContext';

export const GamePage = () => {
    return (
        <div className="d-flex align-center">
            <GameContext.Provider value={{ title: 'Game' }}>
                <Game />
            </GameContext.Provider>
        </div>
    );
};
