import { BitcoinNetwork } from '@/types/bitcoin';

import { BITCOIN_NETWORK } from '../constants';

const MAINNET_BTC_EXPLORER_BLOCK_API = 'https://blockstream.info/block/';
const TESTNET_BTC_EXPLORER_BLOCK_API = 'https://blockstream.info/testnet/block/';

const MAINNET_BTC_EXPLORER_ADDRESS_API = 'https://blockstream.info/address/';
const TESTNET_BTC_EXPLORER_ADDRESS_API = 'https://blockstream.info/testnet/address/';

const MAINNET_BTC_EXPLORER_TRANSACTION_API = 'https://blockstream.info/tx/';
const TESTNET_BTC_EXPLORER_TRANSACTION_API = 'https://blockstream.info/testnet/tx/';

const IS_BTC_MAINNET = BITCOIN_NETWORK === BitcoinNetwork.Mainnet;

const BTC_EXPLORER_BLOCK_API = IS_BTC_MAINNET ? MAINNET_BTC_EXPLORER_BLOCK_API : TESTNET_BTC_EXPLORER_BLOCK_API;
const BTC_EXPLORER_ADDRESS_API = IS_BTC_MAINNET ? MAINNET_BTC_EXPLORER_ADDRESS_API : TESTNET_BTC_EXPLORER_ADDRESS_API;
const BTC_EXPLORER_TRANSACTION_API = IS_BTC_MAINNET
  ? MAINNET_BTC_EXPLORER_TRANSACTION_API
  : TESTNET_BTC_EXPLORER_TRANSACTION_API;

export { BTC_EXPLORER_ADDRESS_API, BTC_EXPLORER_BLOCK_API, BTC_EXPLORER_TRANSACTION_API };
