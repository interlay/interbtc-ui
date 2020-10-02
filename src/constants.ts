export const APP_NAME = "PolkaBTC";
export const ALICE = "//Alice";
export const BOB = "5DTestUPts3kjeXSTMyerHihn1uwMfLj8vU8sqF7qYrFabHE";
export const ALICE_BTC = "tb1qmwv7aqktv5l44x65qmsk6u4z9wh66nazv9rgv3"; //Alexei's testnet BTC address
export const BOB_BTC = "tb1q4kspwcf42cqp66hrhw407djna4dgpw9lsnfx5e"; // Dom's testnet BTC address
// testnet btc address validation regex
export const BTC_ADDRESS_TESTNET_REGEX = /\b([2mn][a-km-zA-HJ-NP-Z1-9]{25,34}|tb1[ac-hj-np-zAC-HJ-NP-Z02-9]{11,71})\b/;
// mainnet btc address validation regex
export const BTC_ADDRESS_MAINNET_REGEX = /\b([13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[ac-hj-np-zAC-HJ-NP-Z02-9]{11,71})\b/;
export const PARACHAIN_URL = process.env.REACT_APP_PARACHAIN_URL || "ws://127.0.0.1:9944";
export const STAKED_RELAYER_URL = process.env.REACT_APP_STAKED_RELAYER_URL || "http://localhost:3030";
