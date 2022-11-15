import { CurrencyExt, SubsidyReward } from '@interlay/interbtc-api';

import { GOVERNANCE_TOKEN } from '@/config/relay-chains';

import { Prices } from '../hooks/api/use-get-prices';
import { getTokenPrice } from './prices';

const getSubsidyRewardApy = (
  positionCurrency: CurrencyExt | undefined,
  reward: SubsidyReward | null,
  prices: Prices | undefined
): number | undefined => {
  if (reward === null || prices === undefined || positionCurrency === undefined) {
    return undefined;
  }
  // TODO: refactor this to use currency from monetary amount once fixed on the lib side
  const rewardCurrency = GOVERNANCE_TOKEN;
  const { amountPerUnitYearly } = reward;

  const rewardCurrencyPriceUSD = getTokenPrice(prices, rewardCurrency.ticker)?.usd;
  const positionCurrencyPriceUSD = getTokenPrice(prices, positionCurrency.ticker)?.usd;

  if (rewardCurrencyPriceUSD === undefined || positionCurrencyPriceUSD === undefined) {
    return undefined;
  }

  const exchangeRate = rewardCurrencyPriceUSD / positionCurrencyPriceUSD;
  const apy = amountPerUnitYearly.toBig().toNumber() * exchangeRate;

  return apy;
};

export { getSubsidyRewardApy };
