import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';

import { formatPercentage } from '@/common/utils/utils';

import { Prices } from '../hooks/api/use-get-prices';
import { getTokenPrice } from './prices';

const getApyLabel = (apy: Big): string => {
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
