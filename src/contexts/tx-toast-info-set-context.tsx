
import * as React from 'react';

type Action =
  { type: 'add-tx-toast-info'; txToastID: string; } |
  { type: 'remove-tx-toast-info'; txToastID: string; } |
  { type: 'increment-count'; txToastID: string; };
type Dispatch = (action: Action) => void;
type TXToastInfo = {
  count: number;
  startTime: Date | null;
};
type State = Map<string, TXToastInfo>;
type TXToastInfoSetProviderProps = { children: React.ReactNode; };

interface TXToastInfoSetStateContextInterface {
  state: State;
  dispatch: Dispatch;
}

const TXToastInfoSetStateContext = React.createContext<TXToastInfoSetStateContextInterface | undefined>(undefined);

function txToastInfoSetReducer(state: State, action: Action) {
  switch (action.type) {
  case 'increment-count': {
    const txToastInfo = state.get(action.txToastID);
    if (txToastInfo === undefined) {
      return new Map(state);
    }

    state.set(action.txToastID, {
      ...txToastInfo,
      count: txToastInfo.count + 1
    });

    return new Map(state);
  }
  case 'remove-tx-toast-info': {
    state.delete(action.txToastID);

    return new Map(state);
  }
  case 'add-tx-toast-info': {
    state.set(action.txToastID, {
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

function TXToastInfoSetProvider({ children }: TXToastInfoSetProviderProps): JSX.Element {
  const [state, dispatch] =
    React.useReducer(
      txToastInfoSetReducer,
      new Map<string, TXToastInfo>()
    );
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = {
    state,
    dispatch
  };

  return (
    <TXToastInfoSetStateContext.Provider value={value}>
      {children}
    </TXToastInfoSetStateContext.Provider>
  );
}

function useTXToastInfoSet(): TXToastInfoSetStateContextInterface {
  const context = React.useContext(TXToastInfoSetStateContext);
  if (context === undefined) {
    throw new Error('useTXToastInfoSet must be used within a TXToastInfoSetProvider!');
  }
  return context;
}

export {
  TXToastInfoSetProvider,
  useTXToastInfoSet
};
