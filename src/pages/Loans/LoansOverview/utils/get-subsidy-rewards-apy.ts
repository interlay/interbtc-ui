import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';

import { getTokenPrice } from '../../../../utils/helpers/prices';
import { Prices } from '../../../../utils/hooks/api/use-get-prices';

const getSubsidyRewardApy = (
  positionCurrency: CurrencyExt | undefined,
  reward: MonetaryAmount<CurrencyExt> | null,
  prices: Prices | undefined
): Big | undefined => {
  if (reward === null || prices === undefined || positionCurrency === undefined) {
    return undefined;
  }

  const rewardCurrencyPriceUSD = getTokenPrice(prices, reward.currency.ticker)?.usd;
  const positionCurrencyPriceUSD = getTokenPrice(prices, positionCurrency.ticker)?.usd;

  if (rewardCurrencyPriceUSD === undefined || positionCurrencyPriceUSD === undefined) {
    return undefined;
  }

  const exchangeRate = rewardCurrencyPriceUSD / positionCurrencyPriceUSD;
  const apy = reward.toBig().mul(exchangeRate);

  return apy;
};

export { getSubsidyRewardApy };
