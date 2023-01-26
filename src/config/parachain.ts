const BLOCK_TIME = 12; // Seconds

// Number of blocks before we prevent issue and redeem requests
const BLOCKS_BEHIND_LIMIT = 6;

const ISSUE_REDEEM_REQUEST_REFETCH_INTERVAL = 10000; // Milliseconds

// Should be the same as the ones from the parachain

const DEFAULT_REDEEM_BRIDGE_FEE_RATE = 0.005; // Set default to 0.5%

const DEFAULT_ISSUE_BRIDGE_FEE_RATE = 0.005; // Set default to 0.5%

const DEFAULT_ISSUE_GRIEFING_COLLATERAL_RATE = 0.00005; // Set default to 0.005%

const DEFAULT_ISSUE_DUST_AMOUNT = 0.00001;

// ray test touch <
const DEFAULT_REDEEM_DUST_AMOUNT = 0.00001;
// ray test touch >

export {
  BLOCK_TIME,
  BLOCKS_BEHIND_LIMIT,
  DEFAULT_ISSUE_BRIDGE_FEE_RATE,
  DEFAULT_ISSUE_DUST_AMOUNT,
  DEFAULT_ISSUE_GRIEFING_COLLATERAL_RATE,
  DEFAULT_REDEEM_BRIDGE_FEE_RATE,
  DEFAULT_REDEEM_DUST_AMOUNT,
  ISSUE_REDEEM_REQUEST_REFETCH_INTERVAL
};
