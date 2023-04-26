import { WalletName } from '@/utils/constants/wallets';

import { mockInterBtcApi } from '../@interlay/interbtc-api';
import mockJsonRpc from './jsonrpc';

const DEFAULT_ACCOUNT_1 = {
  address: 'a3aTRC4zs1djutYS9QuZSB3XmfRgNzFfyRtbZKaoQyv67Yzcc',
  meta: {
    genesisHash: '',
    name: 'Wallet SubWallet',
    source: WalletName.SubWallet
  },
  type: 'sr25519'
};

const DEFAULT_ACCOUNT_2 = {
  address: 'a3ekLbX6dpbnF4VxBJZiF5m7GGaE6Go8Dp8hKQVj75WPZWsnP',
  meta: {
    genesisHash: '',
    name: 'Wallet PolkadotJS',
    source: WalletName.PolkadotJS
  },
  type: 'sr25519'
};

const DEFAULT_ACCOUNTS = [DEFAULT_ACCOUNT_1, DEFAULT_ACCOUNT_2];

const DEFAULT_KEYRING_ACCOUNTS = [
  {
    key: 'header-accounts',
    name: 'Accounts',
    value: null
  },
  {
    key: DEFAULT_ACCOUNT_1.address,
    name: DEFAULT_ACCOUNT_1.meta.name,
    value: DEFAULT_ACCOUNT_1.address
  },
  {
    key: DEFAULT_ACCOUNT_2.address,
    name: DEFAULT_ACCOUNT_2.meta.name,
    value: DEFAULT_ACCOUNT_2.address
  }
];

const DEFAULT_KEYRING = {
  _genesisHashAdd: [],
  _store: {},
  keyringOption: {
    optionsSubject: {
      closed: false,
      currentObservers: [],
      observers: [],
      isStopped: false,
      hasError: false,
      thrownError: null,
      _value: {
        account: DEFAULT_KEYRING_ACCOUNTS,
        address: [],
        all: DEFAULT_KEYRING_ACCOUNTS,
        allPlus: DEFAULT_KEYRING_ACCOUNTS,
        contract: [],
        recent: [],
        testing: []
      }
    }
  }
};

const DEFAULT_SUBWALLET_EXTENSION = {
  name: WalletName.SubWallet,
  version: '0.6.6-0',
  accounts: {},
  metadata: {},
  provider: {},
  signer: {}
};

const DEFAULT_POLKADOTJS_EXTENSION = {
  name: WalletName.PolkadotJS,
  version: '0.6.6-0',
  accounts: {},
  metadata: {},
  provider: {},
  signer: {}
};

const DEFAULT_EXTENSIONS = [DEFAULT_SUBWALLET_EXTENSION, DEFAULT_POLKADOTJS_EXTENSION];

const DEFAULT_SELECTED_ACCOUNT = {
  address: DEFAULT_ACCOUNT_1.address,
  addressRaw: {
    '0': 10,
    '1': 224,
    '2': 174,
    '3': 73,
    '4': 84,
    '5': 146,
    '6': 26,
    '7': 236,
    '8': 51,
    '9': 160,
    '10': 140,
    '11': 39,
    '12': 27,
    '13': 158,
    '14': 193,
    '15': 207,
    '16': 84,
    '17': 24,
    '18': 177,
    '19': 81,
    '20': 46,
    '21': 82,
    '22': 8,
    '23': 147,
    '24': 112,
    '25': 24,
    '26': 215,
    '27': 47,
    '28': 133,
    '29': 237,
    '30': 143,
    '31': 13
  },
  isLocked: true,
  meta: DEFAULT_ACCOUNT_1.meta,
  publicKey: {
    '0': 10,
    '1': 224,
    '2': 174,
    '3': 73,
    '4': 84,
    '5': 146,
    '6': 26,
    '7': 236,
    '8': 51,
    '9': 160,
    '10': 140,
    '11': 39,
    '12': 27,
    '13': 158,
    '14': 193,
    '15': 207,
    '16': 84,
    '17': 24,
    '18': 177,
    '19': 81,
    '20': 46,
    '21': 82,
    '22': 8,
    '23': 147,
    '24': 112,
    '25': 24,
    '26': 215,
    '27': 47,
    '28': 133,
    '29': 237,
    '30': 143,
    '31': 13
  },
  type: 'sr25519'
};

const DEFAULT_SUBSTRATE = {
  socket: undefined,
  jsonrpc: mockJsonRpc,
  keyring: DEFAULT_KEYRING,
  keyringStatus: 'READY',
  api: mockInterBtcApi,
  apiError: undefined,
  apiStatus: 'READY',
  selectedAccount: DEFAULT_SELECTED_ACCOUNT,
  accounts: DEFAULT_ACCOUNTS,
  extensions: DEFAULT_EXTENSIONS
};

export {
  DEFAULT_ACCOUNT_1,
  DEFAULT_ACCOUNT_2,
  DEFAULT_ACCOUNTS,
  DEFAULT_EXTENSIONS,
  DEFAULT_KEYRING,
  DEFAULT_POLKADOTJS_EXTENSION,
  DEFAULT_SUBSTRATE,
  DEFAULT_SUBWALLET_EXTENSION
};
