const PRICES_API = Object.freeze({
  URL: 'https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd',
  QUERY_PARAMETERS: {
    ASSETS_IDS: 'ids'
  }
});

export { PRICES_API };
