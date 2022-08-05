// NOTE: all relay chain api and xcm transfers config will be moved to crosschain-api
import { BITCOIN_NETWORK } from '@/constants';
import { BitcoinNetwork } from '@/types/bitcoin';

const PARACHAIN_ID = process.env.REACT_APP_PARACHAIN_ID;

const RELAY_CHAIN_TRANSFER_FEE =
  // First condition sets fee for both environments in testnet
  BITCOIN_NETWORK === BitcoinNetwork.Testnet
    ? '1291039733'
    : process.env.REACT_APP_RELAY_CHAIN_NAME === 'kusama'
    ? '165940672'
    : process.env.REACT_APP_RELAY_CHAIN_NAME === 'polkadot'
    ? '482771107'
    : '';

const TRANSFER_WEIGHT = '4000000000';

export { PARACHAIN_ID, RELAY_CHAIN_TRANSFER_FEE, TRANSFER_WEIGHT };
