import { createInterBtcApi } from '@interlay/interbtc-api';
import { ApiPromise } from '@polkadot/api';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { TypeRegistry } from '@polkadot/types/create';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import { keyring } from '@polkadot/ui-keyring';
import { isTestChain } from '@polkadot/util';
import * as React from 'react';
import { useLocalStorage } from 'react-use';

import { APP_NAME } from '@/config/relay-chains';
import * as constants from '@/constants';
import { SELECTED_ACCOUNT_LOCAL_STORAGE_KEY } from '@/utils/constants/account';

import { substrateReducer } from './reducer';
import {
  ActionType,
  ApiStatus,
  Dispatch,
  KeyringPair,
  KeyringStatus,
  PolkadotKeyringPair,
  State,
  SubstrateProviderProps,
  SubstrateStateContextInterface
} from './types';

const UNABLE_TO_INITIALISE_OPTIONS_MORE_THAN_ONCE = 'Unable to initialise options more than once';

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

// Connecting to the Substrate node
const connect = async (state: State, dispatch: Dispatch) => {
  try {
    const { socket } = state;

    dispatch({ type: ActionType.ConnectInit });

    if (socket) {
      console.log(`Connected socket: ${socket}`);
    }

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

// Loading accounts from dev and polkadot-js extension
const loadAccounts = async (api: ApiPromise, dispatch: Dispatch): Promise<void> => {
  dispatch({ type: ActionType.SetKeyringLoading });

  try {
    const theExtensions = await web3Enable(APP_NAME);
    dispatch({
      type: ActionType.SetExtensions,
      payload: theExtensions
    });

    const theAccounts = (await web3Accounts({ ss58Format: constants.SS58_FORMAT })) as KeyringPair[];
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
  const [lsValue, setLSValue, removeLS] = useLocalStorage<KeyringPair | undefined>(
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
    async (newAccount: PolkadotKeyringPair) => {
      if (!setLSValue) return;

      const typedNewAccount = newAccount as KeyringPair;
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

export { SubstrateProvider, SubstrateStateContext };
