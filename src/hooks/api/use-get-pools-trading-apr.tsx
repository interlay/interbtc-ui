import { CurrencyExt, LiquidityPool, newMonetaryAmount, TickerToData } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { GraphQLClient } from 'graphql-request';
import { useCallback } from 'react';
import { useQuery } from 'react-query';

import { convertMonetaryAmountToBigUSD } from '@/common/utils/utils';
import { SQUID_URL } from '@/constants';
import { getPoolDataId, getPoolsVolumesQuery } from '@/services/queries/pools';
import { CurrencySquidFormat } from '@/types/currency';
import { MILLISECONDS_PER_DAY } from '@/utils/constants/date-time';
import { calculateTotalLiquidityUSD } from '@/utils/helpers/pool';
import { getTokenPrice } from '@/utils/helpers/prices';

import { useGetLiquidityPools } from './amm/use-get-liquidity-pools';
import { useGetCurrencies } from './use-get-currencies';
import { useGetPrices } from './use-get-prices';

const graphQLClient = new GraphQLClient(SQUID_URL, {
  headers: {
    'Content-Type': 'application/json'
  }
});

const getYearlyVolume = (
  volumes: any,
  dataId: string,
  getCurrencyFromSquidFormat: (currencySquid: CurrencySquidFormat) => CurrencyExt
): Array<MonetaryAmount<CurrencyExt>> => {
  const startVolumes = volumes[`${dataId}__startVolumes`];
  const endVolumes = volumes[`${dataId}__endVolumes`];
  if (startVolumes.length === 0 || endVolumes.length === 0) {
    return [];
  }

  const startDate = new Date(startVolumes[0].tillTimestamp);
  const endDate = new Date(endVolumes[0].tillTimestamp);
  const daysDelta = (endDate.getTime() - startDate.getTime()) / MILLISECONDS_PER_DAY;
  if (daysDelta < 1) {
    return [];
  }
  // Extrapolate to yearly volume amount.
  const toYearFactor = 365 / daysDelta;

  return startVolumes[0].amounts.map((amount: any, index: number) => {
    const currency = getCurrencyFromSquidFormat(amount.token);
    const endAmount = Big(endVolumes[0].amounts[index].amount);
    const amountDelta = endAmount.sub(Big(amount.amount));

    const yearlyVolumeAmount = amountDelta.mul(toYearFactor);

    return newMonetaryAmount(yearlyVolumeAmount, currency);
  });
};

interface UseGetPoolsTradingAPR {
  isLoading: boolean;
  getTradingAprOfPool: (pool: LiquidityPool) => number;
}

const useGetPoolsTradingApr = (): UseGetPoolsTradingAPR => {
  const { data: pools } = useGetLiquidityPools();
  const { isLoading: isLoadingCurrencies, getCurrencyFromSquidFormat } = useGetCurrencies(true);
  const prices = useGetPrices();

  const getPoolsTradingAPR = useCallback(async (): Promise<TickerToData<number>> => {
    if (!pools || !prices || isLoadingCurrencies) {
      return {};
    }

    const query = getPoolsVolumesQuery(pools);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 1);

    const volumes = await graphQLClient.request(query, { start: startDate.toISOString(), end: endDate.toISOString() });

    const result = pools.map((pool: LiquidityPool) => {
      const dataId = getPoolDataId(pool);

      const yearlyVolumes = getYearlyVolume(volumes, dataId, getCurrencyFromSquidFormat);
      if (yearlyVolumes.length === 0) {
        return { [dataId]: 0 };
      }

      const totalVolumeInUSD = yearlyVolumes
        .reduce(
          (total, amount) =>
            total.add(convertMonetaryAmountToBigUSD(amount, getTokenPrice(prices, amount.currency.ticker)?.usd)),
          Big(0)
        )
        // Divide by amount of pooled currencies.
        .div(pool.pooledCurrencies.length);

      const totalLiquidityUSD = calculateTotalLiquidityUSD(pool.pooledCurrencies, prices);

      const yearlyAPR = totalVolumeInUSD.mul(pool.tradingFee).div(totalLiquidityUSD).mul(100).toNumber();
      return { [dataId]: yearlyAPR };
    });

    return result.reduce((result, pool) => ({ ...result, ...pool }));
  }, [pools, prices, isLoadingCurrencies, getCurrencyFromSquidFormat]);

  const { isLoading, data } = useQuery({
    queryKey: 'amm-pools-trading-apr',
    queryFn: getPoolsTradingAPR,
    enabled: !!pools || !!prices || !isLoadingCurrencies
  });

  const getTradingAprOfPool = useCallback(
    (pool: LiquidityPool): number => {
      if (!data) {
        return 0;
      }
      const poolDataId = getPoolDataId(pool);
      return data[poolDataId] || 0;
    },
    [data]
  );

  return { isLoading, getTradingAprOfPool };
};

export { useGetPoolsTradingApr };
