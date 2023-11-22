import {
    MonetaryAmount,
    ExchangeRate,
    Bitcoin,
    InterBtc,
    Interlay,
    KBtc,
    Kintsugi,
    Kusama,
    Polkadot
} from '@interlay/monetary-js';
import { isForeignAsset } from "@interlay/interbtc-api";
import Big from "big.js";

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

const getCoingeckoQueryUrl = (vsId, coingeckoIds) => {
    const idsString = coingeckoIds.join(",");
    return `https://api.coingecko.com/api/v3/simple/price?vs_currencies=${vsId}&ids=${idsString}`;
};

const getUsdMonetaryAmount = (monetaryAmount, usdPrice) => {
    assert(usdPrice != undefined);
    
    const usdCurrency = {
        name: "US Dollar",
        decimals: 2,
        ticker: "USD",
        humanDecimals: 2
    };

    const rate = new Big(usdPrice);

    const xToUsd = new ExchangeRate(monetaryAmount.currency, usdCurrency, Big(usdPrice));
    return xToUsd.toCounter(monetaryAmount);
}

export { getCoingeckoId, getCoingeckoQueryUrl, getUsdMonetaryAmount };