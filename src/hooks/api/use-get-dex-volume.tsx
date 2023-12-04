import { CurrencyExt, LiquidityPool, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { subDays } from 'date-fns';
import { GraphQLClient } from 'graphql-request';
import { useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, UseQueryResult } from 'react-query';

import { convertMonetaryAmountToBigUSD } from '@/common/utils/utils';
import { SQUID_URL } from '@/constants';
import { getPoolDataId, getPoolsVolumesQuery } from '@/services/queries/pools';
import { CurrencySquidFormat } from '@/types/currency';
import { REFETCH_INTERVAL } from '@/utils/constants/api';
import { getTokenPrice } from '@/utils/helpers/prices';

import { useGetLiquidityPools } from './amm/use-get-liquidity-pools';
import { useGetCurrencies } from './use-get-currencies';
import { useGetPrices } from './use-get-prices';

const graphQLClient = new GraphQLClient(SQUID_URL, {
  headers: {
    'Content-Type': 'application/json'
  }
});

enum DateRangeVolume {
  H24,
  D7
}

type DexVolumesData = Record<string, Big>;

type UseGetCurrenciesResult = UseQueryResult<DexVolumesData> & {
  getDexVolumeByPool: (pool: LiquidityPool | undefined) => number;
};

const getVolumes = (
  volumes: any,
  dataId: string,
  getCurrencyFromSquidFormat: (currencySquid: CurrencySquidFormat) => CurrencyExt
): Array<MonetaryAmount<CurrencyExt>> => {
  const startVolumes = volumes[`${dataId}__startVolumes`];
  const endVolumes = volumes[`${dataId}__endVolumes`];
  if (startVolumes.length === 0 || endVolumes.length === 0) {
    return [];
  }

  return startVolumes[0].amounts.map((amount: any, index: number) => {
    const currency = getCurrencyFromSquidFormat(amount.token);
    const endAmount = Big(endVolumes[0].amounts[index].amount);
    const amountDelta = endAmount.sub(Big(amount.amount));

    return newMonetaryAmount(amountDelta, currency);
  });
};

const useGetDexVolumes = (range: DateRangeVolume): UseGetCurrenciesResult => {
  const { getCurrencyFromSquidFormat } = useGetCurrencies(true);
  const { data: pools } = useGetLiquidityPools();
  const prices = useGetPrices();

  const getDexVolumes = useCallback(
    async (range: DateRangeVolume): Promise<DexVolumesData> => {
      if (!pools) {
        return {};
      }

      const start = subDays(new Date(), range === DateRangeVolume.D7 ? 7 : 1);
      const end = new Date();

      const query = getPoolsVolumesQuery(pools);

      const data = await graphQLClient.request(query, { start, end });

      const result = pools.map((pool: LiquidityPool) => {
        const dataId = getPoolDataId(pool);

        const volumes = getVolumes(data, dataId, getCurrencyFromSquidFormat);
        if (volumes.length === 0) {
          return { [dataId]: Big(0) };
        }

        const totalVolumeInUSD = volumes
          .reduce(
            (total, amount) =>
              total.add(convertMonetaryAmountToBigUSD(amount, getTokenPrice(prices, amount.currency.ticker)?.usd)),
            Big(0)
          )
          // Divide by amount of pooled currencies.
          .div(pool.pooledCurrencies.length);

        return { [dataId]: totalVolumeInUSD };
      });

      return result.reduce((result, pool) => ({ ...result, ...pool }));
    },
    [pools, getCurrencyFromSquidFormat, prices]
  );

  const queryResult = useQuery({
    queryKey: 'dex-volumes',
    queryFn: () => getDexVolumes(range),
    refetchInterval: REFETCH_INTERVAL.MINUTE
  });

  const getDexVolumeByPool = useCallback(
    (pool: LiquidityPool | undefined) =>
      queryResult.data && pool ? queryResult.data[getPoolDataId(pool)].toNumber() : 0,
    [queryResult]
  );

  useErrorHandler(queryResult.error);

  return { ...queryResult, getDexVolumeByPool };
};

export { DateRangeVolume, useGetDexVolumes };
