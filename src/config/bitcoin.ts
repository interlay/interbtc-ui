
// TODO: (https://github.com/interlay/interbtc-ui/pull/212#discussion_r619005713)
const BTC_MAINNET = false;

const BTC_EXPLORER_BLOCK_API = 'https://blockstream.info/block/';
const BTC_TEST_EXPLORER_BLOCK_API = 'https://blockstream.info/testnet/block/';

const BTC_EXPLORER_ADDRESS_API = 'https://blockstream.info/address/';
const BTC_TEST_EXPLORER_ADDRESS_API = 'https://blockstream.info/testnet/address/';

const BTC_EXPLORER_TRANSACTION_API = 'https://blockstream.info/tx/';
const BTC_TEST_EXPLORER_TRANSACTION_API = 'https://blockstream.info/testnet/tx/';

const BTC_BLOCK_API = BTC_MAINNET ? BTC_EXPLORER_BLOCK_API : BTC_TEST_EXPLORER_BLOCK_API;
const BTC_ADDRESS_API = BTC_MAINNET ? BTC_EXPLORER_ADDRESS_API : BTC_TEST_EXPLORER_ADDRESS_API;
const BTC_TRANSACTION_API = BTC_MAINNET ? BTC_EXPLORER_TRANSACTION_API : BTC_TEST_EXPLORER_TRANSACTION_API;

export {
  BTC_BLOCK_API,
  BTC_ADDRESS_API,
  BTC_TRANSACTION_API
};
