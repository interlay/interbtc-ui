import { isForeignAsset, LiquidityPool, PooledCurrencies } from '@interlay/interbtc-api';
import { gql } from 'graphql-request';

const getPoolDataId = (pool: LiquidityPool): string =>
  `${pool.type}_${pool.pooledCurrencies.map(({ currency }) => currency.ticker).join('_')}`;

const getPooledCurrenciesCondition = (pooledCurrencies: PooledCurrencies) =>
  `${pooledCurrencies
    .map(({ currency }) => {
      const currencyId = isForeignAsset(currency) ? currency.foreignAsset.id.toString() : currency.ticker;
      return `AND: {poolId_contains: "${currencyId}"`;
    })
    .join()}${pooledCurrencies.map((_) => '}').join('')}`;

const getPoolsVolumesQuery = (pools: Array<LiquidityPool>): string => gql`
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

  fragment PoolVolumeFields on CumulativeDexTradingVolumePerPool {
    poolId
    poolType
    tillTimestamp
    amounts {
      ...AmountFields
    }
  }

  query poolVolumes($start: DateTime, $end: DateTime) {
    ${pools
      .map((pool: LiquidityPool) => {
        const poolDataId = getPoolDataId(pool);
        const pooledCurrenciesCondition = getPooledCurrenciesCondition(pool.pooledCurrencies);
        return `${poolDataId}__startVolumes: cumulativeDexTradingVolumePerPools(limit: 1, orderBy: tillTimestamp_ASC, where: {tillTimestamp_gte: $start, ${pooledCurrenciesCondition}}) {
        ...PoolVolumeFields
      }
      ${poolDataId}__endVolumes:cumulativeDexTradingVolumePerPools(limit: 1, orderBy: tillTimestamp_DESC, where: {tillTimestamp_lte: $end, ${pooledCurrenciesCondition}}) {
        ...PoolVolumeFields
      }
      `;
      })
      .join('\n')}
  }
`;

export { getPoolDataId, getPoolsVolumesQuery };
