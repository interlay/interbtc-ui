const PRICES_API = Object.freeze({
  URL: 'https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd',
  QUERY_PARAMETERS: {
    ASSETS_IDS: 'ids'
  }
});

const COINGECKO_IDS = ['bitcoin', 'kintsugi', 'kusama', 'polkadot', 'interlay'] as const;

export { COINGECKO_IDS, PRICES_API };
