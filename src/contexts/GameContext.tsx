import { createContext } from 'react';

interface IGameContext {
    title: string | undefined;
}

const GAME_CONTEXT_INITIAL_STATE: IGameContext = {
    title: undefined,
};
export const GameContext = createContext(GAME_CONTEXT_INITIAL_STATE);
