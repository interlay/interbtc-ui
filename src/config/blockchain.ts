
const BTC_MAINNET = false;

const BTC_EXPLORER_ADDRESS_API = 'https://blockstream.info/address/';
const BTC_TEST_EXPLORER_ADDRESS_API = 'https://blockstream.info/testnet/address/';

const BTC_ADDRESS_API = BTC_MAINNET ? BTC_EXPLORER_ADDRESS_API : BTC_TEST_EXPLORER_ADDRESS_API;

export {
  BTC_ADDRESS_API
};
