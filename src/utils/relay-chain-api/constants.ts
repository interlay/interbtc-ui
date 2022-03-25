// NOTE: all code relating to the relay chain api and xcm transfers
// is being kept together until we decide whether to keep it in the UI
// or move it to the lib. If we keep it in the UI, these values will be
// moved to the configuration and const files.
const PARACHAIN_ID = process.env.REACT_APP_PARACHAIN_ID;
const RELAY_CHAIN_TRANSFER_FEE =
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
