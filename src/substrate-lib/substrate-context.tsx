// ray test touch <
// ray test touch <<
// import { createInterBtcApi } from '@interlay/interbtc-api';
// ray test touch >>
import {
  ApiPromise,
  // ray test touch <<
  WsProvider
  // ray test touch >>
} from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { KeyringPair } from '@polkadot/keyring/types';
import { TypeRegistry } from '@polkadot/types/create';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import type { DefinitionRpcExt } from '@polkadot/types/types';
import { keyring } from '@polkadot/ui-keyring';
import { Keyring } from '@polkadot/ui-keyring/Keyring';
import { isTestChain } from '@polkadot/util';
import * as React from 'react';

import config from '@/config/substrate-context';

// ray test touch <<
// import * as constants from '../constants';
// ray test touch >>

const UNABLE_TO_INITIALISE_OPTIONS_MORE_THAN_ONCE = 'Unable to initialise options more than once';

enum KeyringStatus {
  Idle = 'IDLE',
  Loading = 'LOADING',
  Ready = 'READY',
  Error = 'ERROR'
}

enum ApiStatus {
  Idle = 'IDLE',
  ConnectInit = 'CONNECT_INIT',
  Connecting = 'CONNECTING',
  Ready = 'READY',
  Error = 'ERROR'
}

enum ActionType {
  ConnectInit = 'CONNECT_INIT',
  Connect = 'CONNECT',
  ConnectSuccess = 'CONNECT_SUCCESS',
  ConnectError = 'CONNECT_ERROR',
  SetKeyringLoading = 'SET_KEYRING_LOADING',
  SetKeyringReady = 'SET_KEYRING_READY',
  SetKeyringError = 'SET_KEYRING_ERROR',
  SetSelectedAccount = 'SET_SELECTED_ACCOUNT'
}

interface APIError extends Error {
  target: {
    url: string;
  };
}

type Action =
  | { type: ActionType.ConnectInit }
  | { type: ActionType.Connect; payload: ApiPromise }
  | { type: ActionType.ConnectSuccess }
  | { type: ActionType.ConnectError; payload: APIError }
  | { type: ActionType.SetKeyringLoading }
  | { type: ActionType.SetKeyringReady; payload: Keyring }
  | { type: ActionType.SetKeyringError }
  | { type: ActionType.SetSelectedAccount; payload: KeyringPair };
type Dispatch = (action: Action) => void;
type State = {
  socket: string;
  jsonrpc: Record<string, Record<string, DefinitionRpcExt>>;
  keyring: Keyring | null;
  keyringStatus: KeyringStatus;
  api: ApiPromise | null;
  apiError: APIError | null;
  apiStatus: ApiStatus;
  selectedAccount: KeyringPair | null;
};
type SubstrateProviderProps = {
  children: React.ReactNode;
  socket?: string;
};
interface SubstrateStateContextInterface {
  state: State;
}

const parsedQuery = new URLSearchParams(window.location.search);
const connectedSocket = parsedQuery.get('rpc') || config.PROVIDER_SOCKET;

// /
// Initial state for `React.useReducer`
const initialState = {
  // These are the states
  socket: connectedSocket,
  jsonrpc: {
    ...jsonrpc,
    ...config.CUSTOM_RPC_METHODS
  },
  // ray test touch <
  // TODO: double-check `undefined` vs. `null`
  // ray test touch >
  keyring: null,
  keyringStatus: KeyringStatus.Idle,
  api: null,
  apiError: null,
  apiStatus: ApiStatus.Idle,
  selectedAccount: null
};

const registry = new TypeRegistry();

// /
// Reducer function for `React.useReducer`
const substrateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.ConnectInit:
      return {
        ...state,
        apiStatus: ApiStatus.ConnectInit
      };
    case ActionType.Connect:
      return {
        ...state,
        api: action.payload,
        apiStatus: ApiStatus.Connecting
      };
    case ActionType.ConnectSuccess:
      return {
        ...state,
        apiStatus: ApiStatus.Ready
      };
    case ActionType.ConnectError:
      return {
        ...state,
        apiStatus: ApiStatus.Error,
        apiError: action.payload
      };
    case ActionType.SetKeyringLoading:
      return {
        ...state,
        keyringStatus: KeyringStatus.Loading
      };
    case ActionType.SetKeyringReady:
      return {
        ...state,
        keyring: action.payload,
        keyringStatus: KeyringStatus.Ready
      };
    case ActionType.SetKeyringError:
      return {
        ...state,
        keyring: null,
        keyringStatus: KeyringStatus.Error
      };
    case ActionType.SetSelectedAccount:
      return {
        ...state,
        selectedAccount: action.payload
      };
    default:
      throw new Error(`Unknown type: ${action}`);
  }
};

// /
// Connecting to the Substrate node
const connect = async (state: State, dispatch: Dispatch) => {
  const { socket, jsonrpc } = state;

  dispatch({ type: ActionType.ConnectInit });

  console.log(`Connected socket: ${socket}`);
  // ray test touch <<
  console.log('ray : ***** jsonrpc => ', jsonrpc);
  // ray test touch >>

  // ray test touch <<
  const provider = new WsProvider(socket);

  // 1. working
  const _api = new ApiPromise({
    provider,
    rpc: jsonrpc
  });

  // 2. not working
  // const _api = await ApiPromise.create({
  //   provider,
  //   rpc: jsonrpc
  // });

  // 3. not working
  // const _api = (await createInterBtcApi(constants.PARACHAIN_URL, constants.BITCOIN_NETWORK)).api;
  // ray test touch >>

  // Set listeners for disconnection and reconnection event.
  _api.on('connected', () => {
    dispatch({
      type: ActionType.Connect,
      payload: _api
    });
    // `ready` event is not emitted upon reconnection and is checked explicitly here.
    _api.isReady.then((_api: ApiPromise) => {
      dispatch({ type: ActionType.ConnectSuccess });
      // Keyring accounts were not being loaded properly because the `api` needs to first load
      // the WASM file used for `sr25519`. Loading accounts at this point follows the recommended pattern:
      // https://polkadot.js.org/docs/ui-keyring/start/init/#using-with-the-api
      loadAccounts(_api, dispatch);
    });
  });
  _api.on('ready', () => dispatch({ type: ActionType.ConnectSuccess }));
  _api.on('error', (error) =>
    dispatch({
      type: ActionType.ConnectError,
      payload: error
    })
  );
};

const retrieveChainInfo = async (api: ApiPromise) => {
  const [systemChain, systemChainType] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.chainType ? api.rpc.system.chainType() : Promise.resolve(registry.createType('ChainType', 'Live'))
  ]);

  return {
    systemChain: (systemChain || '<unknown>').toString(),
    systemChainType
  };
};

// /
// Loading accounts from dev and polkadot-js extension
const loadAccounts = async (api: ApiPromise, dispatch: Dispatch): Promise<void> => {
  dispatch({ type: ActionType.SetKeyringLoading });

  try {
    await web3Enable(config.APP_NAME);

    let allAccounts = await web3Accounts();
    allAccounts = allAccounts.map(({ address, meta }) => ({
      address,
      meta: {
        ...meta,
        name: `${meta.name} (${meta.source})`
      }
    }));

    // Logics to check if the connecting chain is a dev chain, coming from polkadot-js Apps
    // ref: https://github.com/polkadot-js/apps/blob/15b8004b2791eced0dde425d5dc7231a5f86c682/packages/react-api/src/Api.tsx?_pjax=div%5Bitemtype%3D%22http%3A%2F%2Fschema.org%2FSoftwareSourceCode%22%5D%20%3E%20main#L101-L110
    const { systemChain, systemChainType } = await retrieveChainInfo(api);
    const isDevelopment = systemChainType.isDevelopment || systemChainType.isLocal || isTestChain(systemChain);

    keyring.loadAll({ isDevelopment }, allAccounts);

    dispatch({
      type: ActionType.SetKeyringReady,
      payload: keyring
    });
  } catch (error) {
    console.error('[loadAccounts] error.message => ', error.message);
    // TODO: workaround for now
    if (error.message === UNABLE_TO_INITIALISE_OPTIONS_MORE_THAN_ONCE) {
      window.location.reload();
    } else {
      dispatch({ type: ActionType.SetKeyringError });
    }
  }
};

const SubstrateStateContext = React.createContext<SubstrateStateContextInterface | undefined>(undefined);

const SubstrateProvider = ({ children, socket }: SubstrateProviderProps): JSX.Element => {
  const [state, dispatch] = React.useReducer(substrateReducer, {
    ...initialState,
    // Filtering props and merge with default param value
    socket: socket ?? initialState.socket
  });

  const stateRef = React.useRef(state);
  // MEMO: inspired by https://epicreact.dev/the-latest-ref-pattern-in-react/
  React.useLayoutEffect(() => {
    stateRef.current = state;
  });
  React.useEffect(() => {
    connect(stateRef.current, dispatch);
  }, []);

  function setSelectedAccount(newAccount: KeyringPair) {
    dispatch({ type: ActionType.SetSelectedAccount, payload: newAccount });
  }

  const value = {
    state,
    setSelectedAccount
  };

  return <SubstrateStateContext.Provider value={value}>{children}</SubstrateStateContext.Provider>;
};

const useSubstrate = (): SubstrateStateContextInterface => {
  const context = React.useContext(SubstrateStateContext);
  if (context === undefined) {
    throw new Error('useSubstrate must be used within a SubstrateProvider!');
  }
  return context;
};
const useSubstrateState = (): State => useSubstrate().state; // TODO: it could be redundant in favor of useSubstrate

export { ActionType, ApiStatus, KeyringStatus, SubstrateProvider, useSubstrate, useSubstrateState };
// ray test touch >
