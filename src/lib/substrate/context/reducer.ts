import { Action, ActionType, ApiStatus, KeyringStatus, State } from './types';

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

export { substrateReducer };
