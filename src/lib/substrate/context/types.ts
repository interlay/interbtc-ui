import { ApiPromise } from '@polkadot/api';
import { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';
import { KeyringPair, KeyringPair$Meta } from '@polkadot/keyring/types';
import type { DefinitionRpcExt } from '@polkadot/types/types';
import { Keyring } from '@polkadot/ui-keyring/Keyring';

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

export type {
  _KeyringPair,
  Action,
  Dispatch,
  SecureState,
  State,
  SubstrateProviderProps,
  SubstrateStateContextInterface
};

export { ActionType, ApiStatus, KeyringStatus };
