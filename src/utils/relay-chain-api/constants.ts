// NOTE: all code relating to the relay chain api and xcm transfers
// is being kept together until we decide whether to keep it in the UI
// or move it to the lib. If we keep it in the UI, these values will be
// moved to the configuration and const files.
import { BITCOIN_NETWORK } from '../../constants';
import { BitcoinNetwork } from 'types/bitcoin';

const RELAY_CHAIN_TRANSFER_FEE =
  process.env.REACT_APP_RELAY_CHAIN_NAME === 'kusama' ?
    '4000000000' :
    process.env.REACT_APP_RELAY_CHAIN_NAME === 'polkadot' ?
      '320000000' :
      '';

const TRANSFER_WEIGHT = BITCOIN_NETWORK === BitcoinNetwork.Testnet ? '32000000000' : RELAY_CHAIN_TRANSFER_FEE;

export { TRANSFER_WEIGHT };
