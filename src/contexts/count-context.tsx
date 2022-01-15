
import * as React from 'react';

type Action =
  { type: 'increment-count'; } |
  { type: 'decrement-count'; } |
  { type: 'reset-count'; } |
  { type: 'set-start-time'; } |
  { type: 'reset-start-time'; };
type Dispatch = (action: Action) => void;
type State = {
  count: number;
  startTime: Date | null;
};
type CountProviderProps = { children: React.ReactNode; };

interface CountStateContextInterface {
  state: State;
  dispatch: Dispatch;
}

const CountStateContext = React.createContext<CountStateContextInterface | undefined>(undefined);

function countReducer(state: State, action: Action) {
  switch (action.type) {
  case 'increment-count': {
    return {
      ...state,
      count: state.count + 1
    };
  }
  case 'decrement-count': {
    return {
      ...state,
      count: state.count - 1
    };
  }
  case 'reset-count': {
    return {
      ...state,
      count: 0
    };
  }
  case 'set-start-time': {
    return {
      ...state,
      startTime: new Date()
    };
  }
  case 'reset-start-time': {
    return {
      ...state,
      startTime: null
    };
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
      {
        count: 0,
        startTime: null
      }
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
