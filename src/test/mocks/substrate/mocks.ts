import { mockInterBtcApi } from '../@interlay/interbtc-api';
import mockJsonRpc from './jsonrpc';

const DEFAULT_ACCOUNT_ADDRESS = 'a3aTRC4zs1djutYS9QuZSB3XmfRgNzFfyRtbZKaoQyv67Yzcc';

const DEFAULT_KEYRING_ACCOUNTS = [
  {
    key: 'header-accounts',
    name: 'Accounts',
    value: null
  },
  {
    key: '5CJy5bsZ1T9UTWqCAkrCyrPSjcvd5hYC8cs7mainmTiZcJmn',
    name: 'Wallet 1',
    value: '5CJy5bsZ1T9UTWqCAkrCyrPSjcvd5hYC8cs7mainmTiZcJmn'
  },
  {
    key: '5CUZWG8ZofqpPaGpcEF6Y9XM1r4d3qRUbPgECqTNLAfMNLii',
    name: 'Wallet 2',
    value: '5CUZWG8ZofqpPaGpcEF6Y9XM1r4d3qRUbPgECqTNLAfMNLii'
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

const DEFAULT_ACCOUNTS = [
  {
    address: DEFAULT_ACCOUNT_ADDRESS,
    meta: {
      genesisHash: '',
      name: 'Wallet 1',
      source: 'subwallet-js'
    },
    type: 'sr25519'
  },
  {
    address: 'a3ekLbX6dpbnF4VxBJZiF5m7GGaE6Go8Dp8hKQVj75WPZWsnP',
    meta: {
      name: 'Wallet 2',
      source: 'subwallet-js'
    },
    type: 'sr25519'
  }
];

const DEFAULT_EXTENSIONS = [
  {
    name: 'subwallet-js',
    version: '0.6.6-0',
    accounts: {},
    metadata: {},
    provider: {},
    signer: {}
  }
];

const DEFAULT_SELECTED_ACCOUNT = {
  address: DEFAULT_ACCOUNT_ADDRESS,
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
  meta: {
    genesisHash: '',
    name: 'Wallet 1',
    source: 'subwallet-js'
  },
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

export { DEFAULT_ACCOUNT_ADDRESS, DEFAULT_KEYRING, DEFAULT_SUBSTRATE };
