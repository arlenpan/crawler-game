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
    getLogs: () => state.logs,
    addLog: (message: string, style?: TStyle) => {
      state.logs.push({ message, style });
    },
    popLog: () => {
      state.logs.pop();
    },
  };
})();

export default LogController;
