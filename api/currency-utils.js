import {
    Bitcoin,
    InterBtc, // on Polkadot
    Interlay, // On Polkadot
    KBtc, // on Kusama
    Kintsugi, // On Kusama
    Kusama, // on Kusama
    Polkadot // on Polkadot
  } from '@interlay/monetary-js';
  
const COINGECKO_ID_BY_CURRENCY_TICKER = {
    [Bitcoin.ticker]: 'bitcoin',
    [Kintsugi.ticker]: 'kintsugi',
    [KBtc.ticker]: 'bitcoin',
    [Kusama.ticker]: 'kusama',
    [Polkadot.ticker]: 'polkadot',
    [Interlay.ticker]: 'interlay',
    [InterBtc.ticker]: 'bitcoin'
};

const getCoingeckoId = (currency) => {
    if (isForeignAsset(currency)) {
      // Force V[DOT/KSM] prices.
      switch (currency.ticker) {
        case 'VDOT':
          return 'voucher-dot';
        case 'VKSM':
          return 'voucher-ksm';
        default:
          return currency.foreignAsset.coingeckoId;
      }
    }
    return COINGECKO_ID_BY_CURRENCY_TICKER[currency.ticker];
};

export { getCoingeckoId };