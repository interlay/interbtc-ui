import { rootReducer } from './common/reducers/index';
import { toast } from 'react-toastify';
import { AppState, StoreType, StoreState, ParachainStatus } from './common/types/util.types';
import { createLogger } from 'redux-logger';
import { applyMiddleware, createStore } from 'redux';
import { initializeState } from './common/actions/general.actions';
import { FaucetClient, InterBTCAPI } from '@interlay/interbtc';
import { mapToArray, arrayToMap } from './common/utils/requests';
import * as constants from './constants';

declare global {
    interface Window {
        interBTC: InterBTCAPI;
        faucet: FaucetClient;
        isFetchingActive: boolean;
    }
}

export const getInitialState = (): StoreType => {
  const emptyStore: StoreType = {
    general: {
      interBtcLoaded: false,
      relayerLoaded: false,
      vaultClientLoaded: false,
      showAccountModal: false,
      address: '',
      totalLockedDOT: '',
      totalInterBTC: '',
      balanceInterBTC: '',
      balanceDOT: '',
      extensions: [],
      btcRelayHeight: 0,
      bitcoinHeight: 0,
      parachainStatus: ParachainStatus.Loading,
      prices: { bitcoin: { usd: 0 }, polkadot: { usd: 0 } }
    },
    issue: {
      address: '',
      step: 'ENTER_BTC_AMOUNT',
      id: '',
      issueRequests: new Map(),
      issuePeriod: 86400
    },
    redeem: {
      premiumRedeem: false,
      address: '',
      step: 'AMOUNT_AND_ADDRESS',
      id: '',
      redeemRequests: new Map()
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
        interBtcLoaded: false,
        relayerLoaded: false
      }
    };
    return {
      ...deserializedState,
      issue: {
        ...deserializedState.issue,
        issueRequests: arrayToMap(deserializedState.issue.issueRequests)
      },
      redeem: {
        ...deserializedState.redeem,
        redeemRequests: arrayToMap(deserializedState.redeem.redeemRequests)
      }
    };
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
    const preparedState = {
      ...store,
      issue: {
        ...store.issue,
        issueRequests: mapToArray(store.issue.issueRequests)
      },
      redeem: {
        ...store.redeem,
        redeemRequests: mapToArray(store.redeem.redeemRequests)
      }
    };
    const serializedState = JSON.stringify(preparedState);
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
