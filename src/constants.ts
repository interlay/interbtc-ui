export const APP_NAME = "PolkaBTC";

// Set to true to show only the static landing page
const getStaticPage = () => {
    if (process.env.REACT_APP_STATIC_PAGE_ONLY !== undefined) {
        if (process.env.REACT_APP_STATIC_PAGE_ONLY === "true") {
            return true;
        }
    }
    return false;
};

export const STATIC_PAGE_ONLY = getStaticPage();

export const FAUCET_AMOUNT = 1000;
export const FAUCET_ADDRESS_SEED = "//Alice";

// Set to true is on mainnet.
export const BTC_MAINNET = false;

// regtest btc address validation regex
export const BTC_REGTEST_REGEX = /\b([2mn][a-km-zA-HJ-NP-Z1-9]{25,34}|bcrt1[ac-hj-np-zAC-HJ-NP-Z02-9]{11,71})\b/;
// testnet btc address validation regex
export const BTC_TESTNET_REGEX = /\b([2mn][a-km-zA-HJ-NP-Z1-9]{25,34}|tb1[ac-hj-np-zAC-HJ-NP-Z02-9]{11,71})\b/;
// mainnet btc address validation regex
export const BTC_MAINNET_REGEX = /\b([13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[ac-hj-np-zAC-HJ-NP-Z02-9]{11,71})\b/;
// btc transaction validation regex
export const BTC_TRANSACTION_ID_REGEX = /[a-fA-F0-9]{64}/;

// regex for validating input strings as numbers
export const NUMERIC_STRING_REGEX = /^[0-9]+([.][0-9]+)?$/;

export const BITCOIN_NETWORK = process.env.REACT_APP_BITCOIN_NETWORK || "regtest";
export const BITCOIN_REGTEST_URL = process.env.REACT_APP_BITCOIN_REGTEST_URL || "http://localhost:3002";

export const BTC_ADDRESS_REGEX =
    BITCOIN_NETWORK === "mainnet"
        ? BTC_MAINNET_REGEX
        : BITCOIN_NETWORK === "testnet"
        ? BTC_TESTNET_REGEX
        : BTC_REGTEST_REGEX;

export const PARACHAIN_URL = process.env.REACT_APP_PARACHAIN_URL || "ws://127.0.0.1:9944";
export const STAKED_RELAYER_URL = process.env.REACT_APP_STAKED_RELAYER_URL || "http://localhost:3030";
export const VAULT_CLIENT_URL = process.env.REACT_APP_VAULT_CLIENT_URL || "http://localhost:3031";

export const BTC_EXPLORER_BLOCK_API = "https://blockstream.info/block/";
export const BTC_TEST_EXPLORER_BLOCK_API = "https://blockstream.info/testnet/block/";

export const BTC_EXPLORER_ADDRESS_API = "https://blockstream.info/address/";
export const BTC_TEST_EXPLORER_ADDRESS_API = "https://blockstream.info/testnet/address/";

//######################################
// STAKED RELAYER
//######################################
export const STAKED_RELAYER_OK = "Ok";
export const STAKED_RELAYER_OFFLINE = "Offline";
export const STAKED_RELAYER_SLASHED = "Slashed";

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

// Landing page
export const MARKDOWN_PATH = "../assets/polkBTCInfo.md";
