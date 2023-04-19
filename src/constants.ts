import { BitcoinNetwork } from '@/types/bitcoin';

const ANALYTICS_CODE = process.env.REACT_APP_ANALYTICS_CODE;

const BALANCE_MAX_INTEGER_LENGTH = 13;

const BTC_DECIMALS = 8;

// regtest btc address validation regex
const BTC_REGTEST_REGEX = /\b([2mn][a-km-zA-HJ-NP-Z1-9]{25,34}|bcrt1[ac-hj-np-zAC-HJ-NP-Z02-9]{11,71})\b/;
// testnet btc address validation regex
const BTC_TESTNET_REGEX = /\b([2mn][a-km-zA-HJ-NP-Z1-9]{25,34}|tb1[ac-hj-np-zAC-HJ-NP-Z02-9]{11,71})\b/;
// mainnet btc address validation regex
const BTC_MAINNET_REGEX = /\b([13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[ac-hj-np-zAC-HJ-NP-Z02-9]{11,71})\b/;
// btc transaction validation regex
const BTC_TRANSACTION_ID_REGEX = /[a-fA-F0-9]{64}/;

const BITCOIN_NETWORK = (process.env.REACT_APP_BITCOIN_NETWORK || BitcoinNetwork.Testnet) as BitcoinNetwork;
const BITCOIN_REGTEST_URL = process.env.REACT_APP_BITCOIN_REGTEST_URL || 'http://localhost:3002';

const STORE_NAME = 'pbtc-store-2';

const BTC_ADDRESS_REGEX =
  BITCOIN_NETWORK === BitcoinNetwork.Mainnet
    ? BTC_MAINNET_REGEX
    : BITCOIN_NETWORK === BitcoinNetwork.Testnet
    ? BTC_TESTNET_REGEX
    : BTC_REGTEST_REGEX;

const PARACHAIN_URL = process.env.REACT_APP_PARACHAIN_URL || 'ws://127.0.0.1:9944';
const RELAY_CHAIN_URL = process.env.REACT_APP_RELAY_CHAIN_URL;
const DEFAULT_ACCOUNT_SEED = process.env.REACT_APP_DEFAULT_ACCOUNT_SEED;
const FAUCET_URL = process.env.REACT_APP_FAUCET_URL || 'http://localhost:3035';

const SQUID_URL = process.env.REACT_APP_SQUID_URL || 'http://localhost:4000/graphql';

const FEEDBACK_URL = 'https://forms.gle/2eKFnq4j1fkBgejW7';

const SIGNER_API_URL = process.env.REACT_APP_SIGNER_API_URL || '';

// FIXME: hacky workaround to get the right ss58 prefix. Should be fetched at runtime instead
// Possible example below:
// // Load the basic bridge data without depending on interbtc-api
// const api = await ApiPromise.create({ provider: new WsProvider(constants.PARACHAIN_URL) });
// // Default ss58 prefix is 42 for generic substrate chains
// const rawSs58Format = await (await api.rpc.system.properties()).ss58Format;
// const ss58Format = parseInt(rawSs58Format.unwrapOr('42').toString());
let ss58Format;
if (BITCOIN_NETWORK === BitcoinNetwork.Mainnet || BITCOIN_NETWORK === BitcoinNetwork.Testnet) {
  if (process.env.REACT_APP_RELAY_CHAIN_NAME === 'kusama') {
    // kintsugi or kintnet
    ss58Format = 2092;
  } else {
    // interlay or interlay testnet
    ss58Format = 2032;
  }
  // generic substrate
} else {
  ss58Format = 42;
}
const SS58_FORMAT = ss58Format;

// ######################################
// VAULT
// ######################################
const VAULT_STATUS_ACTIVE = 'Active';
const VAULT_STATUS_BANNED = 'Banned until block ';
const VAULT_STATUS_THEFT = 'Theft detected';
const VAULT_STATUS_LIQUIDATED = 'Liquidated';
const VAULT_STATUS_UNDER_COLLATERALIZED = 'Undercollateralized';
const VAULT_STATUS_LIQUIDATION = 'Being liquidated';

// ####################################################
// TODO: make sure the constants below are the same as in the BTC-Parachain
// Best to fetch from API
// ####################################################
const BTC_RELAY_DELAY_WARNING = 6;
const BTC_RELAY_DELAY_CRITICAL = 12;

export {
  ANALYTICS_CODE,
  BALANCE_MAX_INTEGER_LENGTH,
  BITCOIN_NETWORK,
  BITCOIN_REGTEST_URL,
  BTC_ADDRESS_REGEX,
  BTC_DECIMALS,
  BTC_RELAY_DELAY_CRITICAL,
  BTC_RELAY_DELAY_WARNING,
  BTC_TRANSACTION_ID_REGEX,
  DEFAULT_ACCOUNT_SEED,
  FAUCET_URL,
  FEEDBACK_URL,
  PARACHAIN_URL,
  RELAY_CHAIN_URL,
  SIGNER_API_URL,
  SQUID_URL,
  SS58_FORMAT,
  STORE_NAME,
  VAULT_STATUS_ACTIVE,
  VAULT_STATUS_BANNED,
  VAULT_STATUS_LIQUIDATED,
  VAULT_STATUS_LIQUIDATION,
  VAULT_STATUS_THEFT,
  VAULT_STATUS_UNDER_COLLATERALIZED
};
