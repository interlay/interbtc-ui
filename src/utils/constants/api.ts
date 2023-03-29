import { BLOCK_TIME } from '@/config/parachain';

const PRICES_API = Object.freeze({
  URL: process.env.REACT_APP_MARKET_DATA_URL || '',
  QUERY_PARAMETERS: {
    ASSETS_IDS: 'ids'
  }
});

const COINGECKO_IDS = ['bitcoin', 'kintsugi', 'kusama', 'polkadot', 'interlay'] as const;

const BLOCKTIME_REFETCH_INTERVAL = BLOCK_TIME * 1000;

export { BLOCKTIME_REFETCH_INTERVAL, COINGECKO_IDS, PRICES_API };
