import { LiquidityPool } from '@interlay/interbtc-api';

const getPooledTickers = (liquidityPools: LiquidityPool[]): Set<string> =>
  liquidityPools.reduce((acc, pool) => {
    pool.pooledCurrencies.forEach((curr) => acc.add(curr.currency.ticker));

    return acc;
  }, new Set<string>());

export { getPooledTickers };
