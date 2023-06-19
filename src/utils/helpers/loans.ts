import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';

import { formatPercentage } from '@/common/utils/utils';

import { Prices } from '../hooks/api/use-get-prices';
import { getTokenPrice } from './prices';

const MIN_DECIMAL_NUMBER = 0.01;

// MEMO: returns formatted apy or better representation of a very small apy
const getApyLabel = (apy: Big): string => {
  if (apy.eq(0)) {
    return formatPercentage(0);
  }
  const isPositive = apy.gt(0);
  const isTinyApy = isPositive ? apy.lt(MIN_DECIMAL_NUMBER) : apy.gt(-MIN_DECIMAL_NUMBER);

  if (isTinyApy) {
    const tinyIndicator = apy.gt(0) ? '<' : '>';
    const minDecimal = isPositive ? MIN_DECIMAL_NUMBER : -MIN_DECIMAL_NUMBER;

    return `${tinyIndicator} ${minDecimal}%`;
  }

  return formatPercentage(apy.toNumber());
};

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
  const apy = reward.toBig().mul(exchangeRate).mul(100);

  return apy;
};

export { getApyLabel, getSubsidyRewardApy };
