const BLOCK_TIME = 12; // Seconds

// Number of blocks before we prevent issue and redeem requests
const BLOCKS_BEHIND_LIMIT = 6;

const ISSUE_REDEEM_REQUEST_REFETCH_INTERVAL = 10000; // Milliseconds

const REDEEM_BRIDGE_FEE_RATE = 0.005; // Should be the same as the one from the parachain

export { BLOCK_TIME, BLOCKS_BEHIND_LIMIT, ISSUE_REDEEM_REQUEST_REFETCH_INTERVAL, REDEEM_BRIDGE_FEE_RATE };
