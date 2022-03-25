// NOTE: all relay chain api and xcm transfers config will be moved to crosschain-api
import { BitcoinNetwork } from 'types/bitcoin';
import { BITCOIN_NETWORK } from '../../constants';

const PARACHAIN_ID = process.env.REACT_APP_PARACHAIN_ID;

const RELAY_CHAIN_TRANSFER_FEE =
  // First condition sets fee for both environments in testnet
  BITCOIN_NETWORK === BitcoinNetwork.Testnet ?
    '320000000' :
    process.env.REACT_APP_RELAY_CHAIN_NAME === 'kusama' ?
      '106666660' :
      process.env.REACT_APP_RELAY_CHAIN_NAME === 'polkadot' ?
        '320000000' :
        '';

const TRANSFER_WEIGHT = '4000000000';

export {
  PARACHAIN_ID,
  RELAY_CHAIN_TRANSFER_FEE,
  TRANSFER_WEIGHT
};
