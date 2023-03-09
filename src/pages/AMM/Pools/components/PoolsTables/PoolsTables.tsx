import { isCurrencyEqual, LiquidityPool } from '@interlay/interbtc-api';
import { Key, useState } from 'react';

import { Flex } from '@/component-library';
import { LiquidityPoolTable } from '@/components/LiquidityPoolTable';
import { AccountLiquidityPool } from '@/utils/hooks/api/amm/use-get-account-pools';

import { PoolModal } from '../PoolModal/PoolModal';

type PoolsTablesProps = {
  pools: LiquidityPool[];
  accountPools?: AccountLiquidityPool[];
};

const PoolsTables = ({ pools, accountPools }: PoolsTablesProps): JSX.Element => {
  const [liquidityPool, setLiquidityPool] = useState<LiquidityPool>();

  const handleRowAction = (ticker: Key) => {
    const pool = pools.find((pool) => pool.lpToken.ticker === ticker);
    setLiquidityPool(pool);
  };

  const handleClose = () => setLiquidityPool(undefined);

  const otherPools = accountPools
    ? pools.filter(
        (pool) => !accountPools.find((accountPool) => isCurrencyEqual(accountPool.amount.currency, pool.lpToken))
      )
    : pools;

  return (
    <>
      <Flex direction='column' gap='spacing6'>
        {!!accountPools?.length && (
          <LiquidityPoolTable variant='account-pools' pools={accountPools} onRowAction={handleRowAction} />
        )}
        {!!otherPools.length && (
          <LiquidityPoolTable
            variant='available-pools'
            pools={otherPools.map((pool) => ({ data: pool }))}
            onRowAction={handleRowAction}
          />
        )}
      </Flex>
      <PoolModal isOpen={!!liquidityPool} pool={liquidityPool} onClose={handleClose} />
    </>
  );
};

export { PoolsTables };
export type { PoolsTablesProps };
