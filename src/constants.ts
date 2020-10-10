export const APP_NAME = "PolkaBTC";

// Set to true to show only the static landing page
export const STATIC_PAGE_ONLY = process.env.STATIC_PAGE_ONLY || false;

// Set to true is on mainnet.
export const BTC_MAINNET = false;

// testnet btc address validation regex
export const BTC_ADDRESS_TESTNET_REGEX = /\b([2mn][a-km-zA-HJ-NP-Z1-9]{25,34}|tb1[ac-hj-np-zAC-HJ-NP-Z02-9]{11,71})\b/;
// mainnet btc address validation regex
export const BTC_ADDRESS_MAINNET_REGEX = /\b([13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[ac-hj-np-zAC-HJ-NP-Z02-9]{11,71})\b/;

export const PARACHAIN_URL = process.env.REACT_APP_PARACHAIN_URL || "ws://127.0.0.1:9944";
export const STAKED_RELAYER_URL = process.env.REACT_APP_STAKED_RELAYER_URL || "http://localhost:3030";

export const BTC_EXPLORER_BLOCK_API = "https://blockstream.info/block/";
export const BTC_TEST_EXPLORER_BLOCK_API = "https://blockstream.info/testnet/block/";

//######################################
// VAULT
//######################################
export const VAULT_STATUS_ACTIVE = "Active";
export const VAULT_STATUS_THEFT = "CommittedTheft";
export const VAULT_STATUS_LIQUIDATED = "Liquidated";
export const VAULT_STATUS_UNDECOLLATERALIZED = "Undercollateralized";
export const VAULT_STATUS_AUCTION = "Auction";

// ####################################################
// TODO: make sure the constants below are the same as in the BTC-Parachain
// Best to fetch from API
// ####################################################
export const BTC_RELAY_DELAY_WARNING = 6;
export const BTC_RELAY_DELAY_CRITICAL = 12;

export const VAULT_IDEAL_COLLATERALIZATION = 200; // in %
export const VAULT_AUCTION_COLLATERALIZATION = 150; // in %
export const VAULT_LIQUIDATION_COLLATERALIZATION = 120; // in %

// ####################################################
// FOR TESTING PURPOSES ONLY
// TODO: Remove or update before deployment
// ####################################################

export const ALICE = "//Alice";
export const BOB = "5DTestUPts3kjeXSTMyerHihn1uwMfLj8vU8sqF7qYrFabHE";
export const ALICE_BTC = "tb1qmwv7aqktv5l44x65qmsk6u4z9wh66nazv9rgv3"; //Alexei's testnet BTC address
export const BOB_BTC = "tb1q4kspwcf42cqp66hrhw407djna4dgpw9lsnfx5e"; // Dom's testnet BTC address

// Landing page
export const MARKDOWN_PATH = "../assets/polkBTCInfo.md";
