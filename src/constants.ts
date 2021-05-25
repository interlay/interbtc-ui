export const BALANCE_MAX_INTEGER_LENGTH = 13;

export const BTC_DECIMALS = 8;

// regtest btc address validation regex
export const BTC_REGTEST_REGEX = /\b([2mn][a-km-zA-HJ-NP-Z1-9]{25,34}|bcrt1[ac-hj-np-zAC-HJ-NP-Z02-9]{11,71})\b/;
// testnet btc address validation regex
export const BTC_TESTNET_REGEX = /\b([2mn][a-km-zA-HJ-NP-Z1-9]{25,34}|tb1[ac-hj-np-zAC-HJ-NP-Z02-9]{11,71})\b/;
// mainnet btc address validation regex
export const BTC_MAINNET_REGEX = /\b([13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[ac-hj-np-zAC-HJ-NP-Z02-9]{11,71})\b/;
// btc transaction validation regex
export const BTC_TRANSACTION_ID_REGEX = /[a-fA-F0-9]{64}/;

// regex for validating input strings as numbers
export const NUMERIC_STRING_REGEX = /^[0-9]+([.][0-9]+)?$/;

export const BITCOIN_NETWORK = (process.env.REACT_APP_BITCOIN_NETWORK || 'testnet') as
    | 'mainnet'
    | 'testnet'
    | 'regtest';
export const BITCOIN_REGTEST_URL = process.env.REACT_APP_BITCOIN_REGTEST_URL || 'http://localhost:3002';

export const STORE_NAME = 'pbtc-store-2';

export const BTC_ADDRESS_REGEX =
    BITCOIN_NETWORK === 'mainnet' ?
      BTC_MAINNET_REGEX :
      BITCOIN_NETWORK === 'testnet' ?
        BTC_TESTNET_REGEX :
        BTC_REGTEST_REGEX;

export const PARACHAIN_URL = process.env.REACT_APP_PARACHAIN_URL || 'ws://127.0.0.1:9944';
export const FAUCET_URL = process.env.REACT_APP_FAUCET_URL || 'http://localhost:3035';

export const STATS_URL = process.env.REACT_APP_STATS_SERVER_URL || 'http://localhost:3007';

export const FEEDBACK_URL = 'https://forms.gle/2eKFnq4j1fkBgejW7';

// ######################################
// STAKED RELAYER
// ######################################
export const STAKED_RELAYER_OK = 'Ok';
export const STAKED_RELAYER_OFFLINE = 'Offline';
export const STAKED_RELAYER_SLASHED = 'Slashed';

// ######################################
// VAULT
// ######################################
export const VAULT_STATUS_ACTIVE = 'Active';
export const VAULT_STATUS_BANNED = 'Banned until block ';
export const VAULT_STATUS_THEFT = 'CommittedTheft';
export const VAULT_STATUS_LIQUIDATED = 'Liquidated';
export const VAULT_STATUS_UNDER_COLLATERALIZED = 'Undercollateralized';
export const VAULT_STATUS_AUCTION = 'Auction';
export const VAULT_STATUS_LIQUIDATION = 'Being liquidated';

// ####################################################
// TODO: make sure the constants below are the same as in the BTC-Parachain
// Best to fetch from API
// ####################################################
export const BTC_RELAY_DELAY_WARNING = 6;
export const BTC_RELAY_DELAY_CRITICAL = 12;

// #######################################
// Beta
export const BETA_LAUNCH_DATE = 1614675600; // Tue Mar 02 2021 09:00:00 GMT+0000
