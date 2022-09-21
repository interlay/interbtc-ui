import { createInterBtcApi } from '@interlay/interbtc-api';
import { ApiPromise } from '@polkadot/api';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';
import { KeyringPair, KeyringPair$Meta } from '@polkadot/keyring/types';
import { TypeRegistry } from '@polkadot/types/create';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import type { DefinitionRpcExt } from '@polkadot/types/types';
import { keyring } from '@polkadot/ui-keyring';
import { Keyring } from '@polkadot/ui-keyring/Keyring';
import { isTestChain } from '@polkadot/util';
import * as React from 'react';
import { useLocalStorage } from 'react-use';

import { APP_NAME } from '@/config/relay-chains';
import { SELECTED_ACCOUNT_LOCAL_STORAGE_KEY } from '@/config/wallets';

import * as constants from '../constants';

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
  Error = 'ERROR',
  Disconnected = 'DISCONNECTED'
}

enum ActionType {
  ConnectInit = 'CONNECT_INIT',
  Connect = 'CONNECT',
  ConnectSuccess = 'CONNECT_SUCCESS',
  ConnectError = 'CONNECT_ERROR',
  ConnectFail = 'CONNECT_FAIL',
  SetKeyringLoading = 'SET_KEYRING_LOADING',
  SetKeyringReady = 'SET_KEYRING_READY',
  SetKeyringError = 'SET_KEYRING_ERROR',
  SetSelectedAccount = 'SET_SELECTED_ACCOUNT',
  SetAccounts = 'SET_ACCOUNTS',
  SetExtensions = 'SET_EXTENSIONS'
}

interface APIError extends Error {
  target: {
    url: string;
  };
}

interface KeyringPairMeta extends KeyringPair$Meta {
  name: string;
}

interface _KeyringPair extends KeyringPair {
  meta: KeyringPairMeta;
}

type Action =
  | { type: ActionType.ConnectInit }
  | { type: ActionType.Connect; payload: ApiPromise }
  | { type: ActionType.ConnectSuccess }
  | { type: ActionType.ConnectError; payload: APIError }
  | { type: ActionType.ConnectFail }
  | { type: ActionType.SetKeyringLoading }
  | { type: ActionType.SetKeyringReady; payload: Keyring }
  | { type: ActionType.SetKeyringError }
  | { type: ActionType.SetSelectedAccount; payload: _KeyringPair | undefined }
  | { type: ActionType.SetAccounts; payload: Array<InjectedAccountWithMeta> }
  | { type: ActionType.SetExtensions; payload: Array<InjectedExtension> };
type Dispatch = (action: Action) => void;
type State = {
  socket: string | undefined;
  jsonrpc: Record<string, Record<string, DefinitionRpcExt>>;
  keyring: Keyring | undefined;
  keyringStatus: KeyringStatus;
  api: ApiPromise | undefined;
  apiError: APIError | undefined;
  apiStatus: ApiStatus;
  selectedAccount: _KeyringPair | undefined;
  accounts: Array<InjectedAccountWithMeta>;
  extensions: Array<InjectedExtension>;
};
type SecureState = Omit<State, 'keyring' | 'api'> & {
  keyring: Keyring;
  api: ApiPromise;
};
type SubstrateProviderProps = {
  children: React.ReactNode;
  socket?: string;
};
interface SubstrateStateContextInterface {
  state: State;
  setSelectedAccount: (newAccount: KeyringPair) => Promise<void>;
  removeSelectedAccount: () => void;
}

// /
// Initial state for `React.useReducer`
const initialState = {
  // These are the states
  socket: undefined,
  jsonrpc,
  keyring: undefined,
  keyringStatus: KeyringStatus.Idle,
  api: undefined,
  apiError: undefined,
  apiStatus: ApiStatus.Idle,
  selectedAccount: undefined,
  accounts: [],
  extensions: []
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
    case ActionType.ConnectFail:
      return {
        ...state,
        apiStatus: ApiStatus.Disconnected
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
        keyring: undefined,
        keyringStatus: KeyringStatus.Error
      };
    case ActionType.SetSelectedAccount:
      return {
        ...state,
        selectedAccount: action.payload
      };
    case ActionType.SetAccounts:
      return {
        ...state,
        accounts: action.payload
      };
    case ActionType.SetExtensions:
      return {
        ...state,
        extensions: action.payload
      };
    default:
      throw new Error(`Unknown type: ${action}`);
  }
};

// /
// Connecting to the Substrate node
const connect = async (state: State, dispatch: Dispatch) => {
  try {
    const { socket } = state;

    dispatch({ type: ActionType.ConnectInit });

    console.log(`Connected socket: ${socket}`);

    window.bridge = await createInterBtcApi(constants.PARACHAIN_URL, constants.BITCOIN_NETWORK);
    const _api = window.bridge.api;

    dispatch({
      type: ActionType.Connect,
      payload: _api
    });
    dispatch({ type: ActionType.ConnectSuccess });

    loadAccounts(_api, dispatch);

    // Set listeners for disconnection and reconnection event.
    _api.on('connected', () => {
      console.log('[substrate-context API] on:connected');
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
    _api.on('ready', () => {
      console.log('[substrate-context API] on:ready');
      dispatch({ type: ActionType.ConnectSuccess });
    });
    _api.on('error', (error) => {
      console.log('[substrate-context API] on:error');
      dispatch({
        type: ActionType.ConnectError,
        payload: error
      });
    });
    _api.on('disconnected', () => {
      console.log('[substrate-context API] on:disconnected');
      dispatch({ type: ActionType.ConnectFail });
    });
  } catch (error) {
    dispatch({
      type: ActionType.ConnectError,
      payload: error
    });
  }
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
    const theExtensions = await web3Enable(APP_NAME);
    dispatch({
      type: ActionType.SetExtensions,
      payload: theExtensions
    });

    const theAccounts = await web3Accounts({ ss58Format: constants.SS58_FORMAT });
    dispatch({
      type: ActionType.SetAccounts,
      payload: theAccounts
    });

    // Logics to check if the connecting chain is a dev chain, coming from polkadot-js Apps
    // ref: https://github.com/polkadot-js/apps/blob/15b8004b2791eced0dde425d5dc7231a5f86c682/packages/react-api/src/Api.tsx?_pjax=div%5Bitemtype%3D%22http%3A%2F%2Fschema.org%2FSoftwareSourceCode%22%5D%20%3E%20main#L101-L110
    const { systemChain, systemChainType } = await retrieveChainInfo(api);
    const isDevelopment = systemChainType.isDevelopment || systemChainType.isLocal || isTestChain(systemChain);

    keyring.loadAll({ isDevelopment }, theAccounts);

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
  const [lsValue, setLSValue, removeLS] = useLocalStorage<_KeyringPair | undefined>(
    SELECTED_ACCOUNT_LOCAL_STORAGE_KEY,
    undefined
  );

  const [state, dispatch] = React.useReducer(substrateReducer, {
    ...initialState,
    // Filtering props and merge with default param value
    socket: socket ?? initialState.socket,
    selectedAccount: lsValue
  });

  const stateRef = React.useRef(state);
  // MEMO: inspired by https://epicreact.dev/the-latest-ref-pattern-in-react/
  React.useLayoutEffect(() => {
    stateRef.current = state;
  });
  React.useEffect(() => {
    connect(stateRef.current, dispatch);
  }, []);

  const selectedAccountAddress = state.selectedAccount?.address;
  const keyringStatus = state.keyringStatus;
  const accounts = state.accounts;

  React.useEffect(() => {
    if (keyringStatus !== KeyringStatus.Ready) return;

    if (selectedAccountAddress) {
      (async () => {
        try {
          const { signer } = await web3FromAddress(selectedAccountAddress);
          window.bridge.setAccount(selectedAccountAddress, signer);
        } catch (error) {
          console.error('[SubstrateProvider] error => ', error);
        }
      })();
    } else {
      window.bridge.removeAccount();
    }
  }, [selectedAccountAddress, keyringStatus]);

  const removeSelectedAccount = React.useCallback(() => {
    if (!removeLS) return;

    dispatch({ type: ActionType.SetSelectedAccount, payload: undefined });
    removeLS();
  }, [removeLS]);

  React.useEffect(() => {
    if (keyringStatus !== KeyringStatus.Ready) return;
    if (!selectedAccountAddress) return;

    const matchedAccount = accounts.find((item) => item.address === selectedAccountAddress);
    if (!matchedAccount) {
      removeSelectedAccount();
    }
  }, [selectedAccountAddress, accounts, removeSelectedAccount, keyringStatus]);

  const setSelectedAccount = React.useCallback(
    async (newAccount: KeyringPair) => {
      if (!setLSValue) return;

      const typedNewAccount = newAccount as _KeyringPair;
      dispatch({ type: ActionType.SetSelectedAccount, payload: typedNewAccount });
      setLSValue(typedNewAccount);
    },
    [setLSValue]
  );

  const value = {
    state,
    setSelectedAccount,
    removeSelectedAccount
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

const useSubstrateSecureState = (): SecureState => {
  const state = useSubstrateState();

  return {
    ...state,
    api: state.api as ApiPromise,
    keyring: state.keyring as Keyring
  };
};

export type { _KeyringPair };

export {
  ActionType,
  ApiStatus,
  KeyringStatus,
  SubstrateProvider,
  useSubstrate,
  useSubstrateSecureState,
  useSubstrateState
};
