interface ILogState {
  logs: ILog[];
}

type TStyle = 'danger' | 'success';

export interface ILog {
  message: string;
  style?: TStyle;
}

const LogController = (() => {
  const state: ILogState = {
    logs: [],
  };

  return {
    initialize: () => {
      state.logs.push({ message: 'Welcome to the game!' });
    },
    get: () => state.logs,
    add: (message: string, style?: TStyle) => {
      state.logs.push({ message, style });
    },
    pop: () => {
      state.logs.pop();
    },
    reset: () => (state.logs = []),
  };
})();

export default LogController;
