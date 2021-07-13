import { rootReducer } from './common/reducers/index';
import { toast } from 'react-toastify';
import { AppState, StoreType, StoreState, ParachainStatus } from './common/types/util.types';
import { createLogger } from 'redux-logger';
import { applyMiddleware, createStore } from 'redux';
import { initializeState } from './common/actions/general.actions';
import { FaucetClient, InterBTCAPI } from '@interlay/interbtc';
import * as constants from './constants';

declare global {
  interface Window {
    polkaBTC: InterBTCAPI;
    faucet: FaucetClient;
    isFetchingActive: boolean;
  }
}

export const getInitialState = (): StoreType => {
  const emptyStore: StoreType = {
    general: {
      polkaBtcLoaded: false,
      relayerLoaded: false,
      vaultClientLoaded: false,
      showAccountModal: false,
      address: '',
      totalLockedDOT: '',
      totalPolkaBTC: '',
      balancePolkaBTC: '',
      balanceDOT: '',
      extensions: [],
      btcRelayHeight: 0,
      bitcoinHeight: 0,
      parachainStatus: ParachainStatus.Loading,
      prices: { bitcoin: { usd: 0 }, polkadot: { usd: 0 } }
    },
    issue: {
      address: '',
      issuePeriod: 86400
    },
    redeem: {
      address: '',
      premiumRedeem: false
    },
    vault: {
      requests: [],
      collateralization: undefined,
      collateral: '0',
      lockedBTC: '0',
      sla: '0',
      apy: '0'
    }
  };
  return emptyStore;
};

export const loadState = (): StoreType => {
  try {
    const serializedState = localStorage.getItem(constants.STORE_NAME);
    if (serializedState === null) {
      const initialState = getInitialState();
      return initialState;
    }
    const rawStore = JSON.parse(serializedState);
    const deserializedState = {
      ...rawStore,
      general: {
        ...rawStore.general,
        polkaBtcLoaded: false,
        relayerLoaded: false
      }
    };
    return deserializedState;
  } catch (error) {
    setTimeout(
      () => toast.error('Local storage is disabled. In order to use platform please enable local storage'),
      2000
    );
    const initialState = getInitialState();
    return initialState;
  }
};

export const saveState = (store: AppState): void => {
  try {
    const serializedState = JSON.stringify(store);
    localStorage.setItem(constants.STORE_NAME, serializedState);
  } catch (error) {
    setTimeout(
      () => toast.error('Local storage is disabled. In order to use platform please enable local storage'),
      2000
    );
  }
};

export const configureStore = (): StoreState => {
  const storeLogger = createLogger();
  const state = loadState();
  const store = createStore(rootReducer, state, applyMiddleware(storeLogger));
  store.dispatch(initializeState(state));
  store.subscribe(() => {
    saveState(store.getState());
  });
  return store;
};
