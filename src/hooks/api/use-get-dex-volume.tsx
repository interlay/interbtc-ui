import { CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { subDays } from 'date-fns';
import { gql, GraphQLClient } from 'graphql-request';
import { useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, UseQueryResult } from 'react-query';

import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import { SQUID_URL } from '@/constants';
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

// TODO: add this to a dedicated schemas folder
const AMOUNT_FIELDS = gql`
  fragment AmountFields on PooledAmount {
    amount
    amountHuman
    token {
      ... on NativeToken {
        __typename
        token
      }
      ... on ForeignAsset {
        __typename
        asset
      }
      ... on StableLpToken {
        __typename
        poolId
      }
    }
  }
`;

// TODO: add this to a dedicated schemas folder
const GET_DEX_VOLUMES = gql`
  ${AMOUNT_FIELDS}
  query poolVolumes($start: DateTime, $end: DateTime) {
    startVolumes: cumulativeDexTradingVolumes(
      limit: 1
      orderBy: tillTimestamp_ASC
      where: { tillTimestamp_gte: $start }
    ) {
      tillTimestamp
      amounts {
        ...AmountFields
      }
    }
    endVolumes: cumulativeDexTradingVolumes(limit: 1, orderBy: tillTimestamp_DESC, where: { tillTimestamp_lte: $end }) {
      tillTimestamp
      amounts {
        ...AmountFields
      }
    }
  }
`;

enum DateRangeVolume {
  H24,
  D7
}

type DexCurrencyVolume = {
  amount: MonetaryAmount<CurrencyExt>;
  usd: number;
};

type DexVolumesData = Record<string, DexCurrencyVolume>;

type UseGetCurrenciesResult = UseQueryResult<DexVolumesData> & {
  getDexVolumeByTicker: (ticker: string) => DexCurrencyVolume | undefined;
  getDexTotalVolumeUSD: (tickers: string[]) => number;
};

const useGetDexVolumes = (range: DateRangeVolume): UseGetCurrenciesResult => {
  const { getCurrencyFromTicker, getForeignCurrencyFromId } = useGetCurrencies(true);
  const { getStableLiquidityPoolById } = useGetLiquidityPools();
  const prices = useGetPrices();

  const getDexVolumes = useCallback(
    async (range: DateRangeVolume): Promise<DexVolumesData> => {
      const start = subDays(new Date(), range === DateRangeVolume.D7 ? 7 : 1);
      const end = new Date();

      const data = await graphQLClient.request(GET_DEX_VOLUMES, { start, end });

      const [startVolumes] = data.startVolumes;
      const [endVolumes] = data.endVolumes;

      if (!startVolumes || !endVolumes) {
        return {};
      }

      return startVolumes.amounts.reduce((acc: DexVolumesData, item: any) => {
        let currency: CurrencyExt;
        let endVolume;

        switch (item.token.__typename) {
          case 'NativeToken': {
            const { token } = item.token;
            currency = getCurrencyFromTicker(token);
            endVolume = endVolumes.amounts.find((endAmount: any) => endAmount.token.token === token);
            break;
          }
          case 'ForeignAsset': {
            const { asset } = item.token;
            currency = getForeignCurrencyFromId(asset);
            endVolume = endVolumes.amounts.find((endAmount: any) => endAmount.token.asset === asset);
            break;
          }
          case 'StableLpToken': {
            const { poolId } = item.token;
            currency = getStableLiquidityPoolById(poolId).lpToken;
            endVolume = endVolumes.amounts.find((endAmount: any) => endAmount.token.poolId === poolId);
            break;
          }
          default:
            return acc;
        }

        if (!endVolume) {
          return acc;
        }

        const volumeAmount = newMonetaryAmount(endVolume.amount - item.amount, currency);

        const volume: DexCurrencyVolume = {
          amount: volumeAmount,
          usd: convertMonetaryAmountToValueInUSD(volumeAmount, getTokenPrice(prices, currency.ticker)?.usd) || 0
        };

        return { ...acc, [currency.ticker]: volume };
      }, {});
    },
    [getCurrencyFromTicker, getForeignCurrencyFromId, getStableLiquidityPoolById, prices]
  );

  const queryResult = useQuery({
    queryKey: 'dex-volumes',
    queryFn: () => getDexVolumes(range),
    refetchInterval: REFETCH_INTERVAL.MINUTE
  });

  const getDexVolumeByTicker = useCallback((ticker: string) => queryResult.data?.[ticker], [queryResult.data]);

  const getDexTotalVolumeUSD = useCallback(
    (tickers: string[]) => tickers.reduce((sum, ticker) => sum + (getDexVolumeByTicker(ticker)?.usd || 0), 0),
    [getDexVolumeByTicker]
  );

  useErrorHandler(queryResult.error);

  return { ...queryResult, getDexTotalVolumeUSD, getDexVolumeByTicker };
};

export { DateRangeVolume, useGetDexVolumes };
