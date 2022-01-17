
import * as React from 'react';

type Action =
  { type: 'add-toast-info'; toastID: string; } |
  { type: 'remove-toast-info'; toastID: string; } |
  { type: 'increment-count'; toastID: string; };
type Dispatch = (action: Action) => void;
type ToastInfo = {
  count: number;
  startTime: Date | null;
};
type State = Map<string, ToastInfo>;
type CountProviderProps = { children: React.ReactNode; };

interface CountStateContextInterface {
  state: State;
  dispatch: Dispatch;
}

const CountStateContext = React.createContext<CountStateContextInterface | undefined>(undefined);

function countReducer(state: State, action: Action) {
  switch (action.type) {
  case 'increment-count': {
    const toastInfo = state.get(action.toastID);
    if (toastInfo === undefined) {
      return new Map(state);
    }

    state.set(action.toastID, {
      ...toastInfo,
      count: toastInfo.count + 1
    });

    return new Map(state);
  }
  case 'remove-toast-info': {
    state.delete(action.toastID);

    return new Map(state);
  }
  case 'add-toast-info': {
    state.set(action.toastID, {
      count: 0,
      startTime: new Date()
    });

    return new Map(state);
  }
  default: {
    throw new Error(`Unhandled action type: ${action}!`);
  }
  }
}

function CountProvider({ children }: CountProviderProps): JSX.Element {
  const [state, dispatch] =
    React.useReducer(
      countReducer,
      new Map<string, ToastInfo>()
    );
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = {
    state,
    dispatch
  };

  return (
    <CountStateContext.Provider value={value}>
      {children}
    </CountStateContext.Provider>
  );
}

function useCount(): CountStateContextInterface {
  const context = React.useContext(CountStateContext);
  if (context === undefined) {
    throw new Error('useCount must be used within a CountProvider!');
  }
  return context;
}

export {
  CountProvider,
  useCount
};
