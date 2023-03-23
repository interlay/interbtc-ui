import { BLOCK_TIME } from '@/config/parachain';

const PRICES_API = Object.freeze({
  URL: 'https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd',
  QUERY_PARAMETERS: {
    ASSETS_IDS: 'ids'
  }
});

const COINGECKO_IDS = ['bitcoin', 'kintsugi', 'kusama', 'polkadot', 'interlay'] as const;

const BLOCKTIME_REFETCH_INTERVAL = BLOCK_TIME * 1000;

// TODO: start using this instead of `BLOCKTIME_REFETCH_INTERVAL`
const REFETCH_INTERVAL = {
  MINUTE: 60000,
  BLOCK: BLOCK_TIME * 1000
};

const AMM_DEADLINE_INTERVAL = 30 * 60;

export { AMM_DEADLINE_INTERVAL, BLOCKTIME_REFETCH_INTERVAL, COINGECKO_IDS, PRICES_API, REFETCH_INTERVAL };
