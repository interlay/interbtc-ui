
// ray test touch <<
import * as React from 'react';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import { Keyring } from '@polkadot/ui-keyring/Keyring';
import type {
  DefinitionRpcExt,
  RegistryTypes
} from '@polkadot/types/types';
import {
  ApiPromise,
  WsProvider
} from '@polkadot/api';
import {
  web3Accounts,
  web3Enable
} from '@polkadot/extension-dapp';
import keyring from '@polkadot/ui-keyring';
import {
  withErrorBoundary,
  useErrorHandler
} from 'react-error-boundary';

import PolkadotExtensionModal from './components/PolkadotExtensionModal';
import FullLoadingSpinner from 'components/FullLoadingSpinner';
import ErrorFallback from 'components/ErrorFallback';
import config from 'config/connection';
import {
  APP_NAME,
  RELAY_CHAIN_NAME
} from 'config/relay-chains';

const UNABLE_TO_INITIALIZE_OPTIONS_MORE_THAN_ONCE = 'Unable to initialize options more than once';

const queryString = require('query-string');

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

type Action =
  { type: 'CONNECT_INIT'; } |
  { type: 'CONNECT'; payload: ApiPromise; } |
  { type: 'CONNECT_SUCCESS'; } |
  { type: 'CONNECT_ERROR'; payload: Error; } |
  { type: 'SET_KEYRING_LOADING'; } |
  { type: 'SET_KEYRING_READY'; payload: Keyring; } |
  { type: 'SET_KEYRING_ERROR'; };
type Dispatch = (action: Action) => void;
type State = {
  socket: string;
  jsonrpc: Record<string, Record<string, DefinitionRpcExt>>;
  types: RegistryTypes;
  keyring: Keyring | null;
  keyringStatus: KeyringStatus;
  api: ApiPromise | null;
  apiError: Error | null;
  apiStatus: ApiStatus;
}
type SubstrateProviderProps = {
  children: React.ReactNode;
  socket?: string;
  types?: RegistryTypes;
}
type SecureState = Omit<State, 'keyring' | 'api'> & {
  keyring: Keyring;
  api: ApiPromise;
}
type SecureSetSelectedAccountAddress = React.Dispatch<React.SetStateAction<string>>;
interface SubstrateStateContextInterface {
  state: SecureState;
  selectedAccountAddress: string;
  setSelectedAccountAddress: SecureSetSelectedAccountAddress;
}

const parsedQuery = queryString.parse(window.location.search);
const connectedSocket = parsedQuery.rpc || config.PARACHAIN_URL;
// eslint-disable-next-line no-console
console.log(`Connected socket: ${connectedSocket}`);

///
// Initial state for `React.useReducer`
const INIT_STATE = {
  socket: connectedSocket,
  jsonrpc: {
    ...jsonrpc,
    ...config.RPC
  },
  types: config.types,
  keyring: null,
  keyringStatus: KeyringStatus.Idle,
  api: null,
  apiError: null,
  apiStatus: ApiStatus.Idle
};

///
// Reducer function for `React.useReducer`
const substrateReducer = (state: State, action: Action): State => {
  switch (action.type) {
  case 'CONNECT_INIT':
    return {
      ...state,
      apiStatus: ApiStatus.ConnectInit
    };
  case 'CONNECT':
    return {
      ...state,
      api: action.payload,
      apiStatus: ApiStatus.Connecting
    };
  case 'CONNECT_SUCCESS':
    return {
      ...state,
      apiStatus: ApiStatus.Ready
    };
  case 'CONNECT_ERROR':
    return {
      ...state,
      apiStatus: ApiStatus.Error,
      apiError: action.payload
    };
  case 'SET_KEYRING_LOADING':
    return {
      ...state,
      keyringStatus: KeyringStatus.Loading
    };
  case 'SET_KEYRING_READY':
    return {
      ...state,
      keyring: action.payload,
      keyringStatus: KeyringStatus.Ready
    };
  case 'SET_KEYRING_ERROR':
    return {
      ...state,
      keyring: null,
      keyringStatus: KeyringStatus.Error
    };
  default:
    throw new Error(`Unhandled action type: ${action}`);
  }
};

///
// Connecting to the Substrate node
const connect = (state: State, dispatch: Dispatch) => {
  const {
    socket,
    jsonrpc,
    types
  } = state;

  dispatch({ type: 'CONNECT_INIT' });

  const provider = new WsProvider(socket);
  const _api = new ApiPromise({
    provider,
    types,
    rpc: jsonrpc
  });

  // Set listeners for disconnection and reconnection event.
  _api.on('connected', () => {
    dispatch({
      type: 'CONNECT',
      payload: _api
    });
    // `ready` event is not emitted upon reconnection and is checked explicitly here.
    _api.isReady.then(_api => {
      dispatch({ type: 'CONNECT_SUCCESS' });
      // Keyring accounts were not being loaded properly because the `api` needs to first load
      // the WASM file used for `sr25519`. Loading accounts at this point follows the recommended pattern:
      // https://polkadot.js.org/docs/ui-keyring/start/init/#using-with-the-api
      loadAccounts(dispatch);
    });
  });
  _api.on('ready', () => dispatch({ type: 'CONNECT_SUCCESS' }));
  // TODO: should type properly (`Error` is not for it)
  _api.on('error', (error: Error) => dispatch({
    type: 'CONNECT_ERROR',
    payload: error
  }));
};

///
// Loading accounts from dev and polkadot-js extension
const loadAccounts = async (dispatch: Dispatch) => {
  dispatch({ type: 'SET_KEYRING_LOADING' });
  try {
    await web3Enable(APP_NAME);
    let allAccounts = await web3Accounts();
    allAccounts = allAccounts.map(({
      address,
      meta
    }) => ({
      address,
      meta: {
        ...meta,
        name: `${meta.name} (${meta.source})`
      }
    }));
    keyring.loadAll(
      {
        isDevelopment: config.DEVELOPMENT_KEYRING
      },
      allAccounts
    );
    dispatch({
      type: 'SET_KEYRING_READY',
      payload: keyring
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[asyncLoadAccounts] error.message => ', error.message);
    // TODO: workaround for now
    if (error.message === UNABLE_TO_INITIALIZE_OPTIONS_MORE_THAN_ONCE) {
      window.location.reload();
    } else {
      dispatch({ type: 'SET_KEYRING_ERROR' });
    }
  }
};

const SubstrateStateContext = React.createContext<
  SubstrateStateContextInterface | undefined
>(undefined);

const SubstrateProvider = ({
  children,
  socket,
  types
}: SubstrateProviderProps): JSX.Element => {
  const handleError = useErrorHandler();

  const [state, dispatch] = React.useReducer<(state: State, action: Action) => State>(substrateReducer, {
    ...INIT_STATE,
    // Filtering props and merge with default param value
    socket: socket ?? INIT_STATE.socket,
    types: types ?? INIT_STATE.types
  });

  const stateRef = React.useRef(state);
  // MEMO: inspired by https://epicreact.dev/the-latest-ref-pattern-in-react/
  React.useLayoutEffect(() => {
    stateRef.current = state;
  });
  React.useEffect(() => {
    connect(stateRef.current, dispatch);
  }, []);

  const [selectedAccountAddress, setSelectedAccountAddress] = React.useState<string | null>();

  const keyringPairs = state.keyring?.getPairs();
  let defaultSelectedAccountAddress: string | undefined | null;
  if (keyringPairs === undefined) {
    defaultSelectedAccountAddress = undefined;
  } else {
    if (keyringPairs.length > 0) {
      defaultSelectedAccountAddress = keyringPairs[0].address;
    } else {
      defaultSelectedAccountAddress = null;
    }
  }

  React.useEffect(() => {
    if (defaultSelectedAccountAddress === undefined) return;

    setSelectedAccountAddress(defaultSelectedAccountAddress);
  }, [defaultSelectedAccountAddress]);

  switch (state.apiStatus) {
  case ApiStatus.Idle:
  case ApiStatus.ConnectInit:
  case ApiStatus.Connecting:
    return (
      <FullLoadingSpinner text={`Connecting to ${RELAY_CHAIN_NAME}`} />
    );
  case ApiStatus.Ready:
    break;
  case ApiStatus.Error:
    handleError(state.apiError);
    break;
  default:
    throw new Error('Invalid ApiStatus!');
  }

  switch (state.keyringStatus) {
  case KeyringStatus.Idle:
  case KeyringStatus.Loading:
    return (
      <FullLoadingSpinner text='Loading accounts (please review any extensions authorization)' />
    );
  case KeyringStatus.Ready:
    break;
  case KeyringStatus.Error:
    throw new Error('SET_KEYRING_ERROR!');
  default:
    throw new Error('Invalid KeyringStatus!');
  }

  if (
    state.keyring === null ||
    state.api === null
  ) {
    throw new Error('Something went wrong!');
  }

  if (selectedAccountAddress === undefined) {
    return (
      <FullLoadingSpinner text='Initializing accounts' />
    );
  }

  if (selectedAccountAddress === null) {
    return <PolkadotExtensionModal open />;
  }

  const value = {
    state: {
      ...state,
      keyring: state.keyring,
      api: state.api
    },
    selectedAccountAddress,
    setSelectedAccountAddress: (setSelectedAccountAddress as SecureSetSelectedAccountAddress)
  };

  return (
    <SubstrateStateContext.Provider value={value}>
      {children}
    </SubstrateStateContext.Provider>
  );
};

const useSubstrate = (): SubstrateStateContextInterface => {
  const context = React.useContext(SubstrateStateContext);
  if (context === undefined) {
    throw new Error('useSubstrate must be used within a SubstrateProvider!');
  }
  return context;
};

const ErrorBoundaryWrappedSubstrateProvider = withErrorBoundary(SubstrateProvider, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});

export {
  KeyringStatus,
  ApiStatus
};

export {
  ErrorBoundaryWrappedSubstrateProvider as SubstrateProvider,
  useSubstrate
};
// ray test touch >>
