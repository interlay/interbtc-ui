import { LiquidityPool } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';
import { Key, useState } from 'react';

import { Flex } from '@/component-library';
import { AccountLiquidityPool } from '@/utils/hooks/api/amm/use-get-account-pools';

import { PoolModal } from '../PoolModal/PoolModal';
import { PoolsTable } from './PoolsTable';

type PoolsTablesProps = {
  pools: AccountLiquidityPool[];
  accountId: AccountId;
};

const PoolsTables = ({ pools, accountId }: PoolsTablesProps): JSX.Element => {
  const [liquidityPool, setLiquidityPool] = useState<LiquidityPool>();

  const handleRowAction = (ticker: Key) => {
    const pool = pools.find((pool) => pool.data.lpToken.ticker === ticker);
    setLiquidityPool(pool?.data);
  };

  const handleClose = () => setLiquidityPool(undefined);

  const accountPools = pools.filter((pool) => !!pool.amount);
  const otherPools = pools.filter((pool) => !pool.amount);

  return (
    <>
      <Flex direction='column' gap='spacing6'>
        {!!accountPools.length && (
          <PoolsTable variant='account-pools' pools={accountPools} onRowAction={handleRowAction} />
        )}
        {!!otherPools.length && (
          <PoolsTable variant='available-pools' pools={otherPools} onRowAction={handleRowAction} />
        )}
      </Flex>
      <PoolModal isOpen={!!liquidityPool} pool={liquidityPool} accountId={accountId} onClose={handleClose} />
    </>
  );
};

export { PoolsTables };
export type { PoolsTablesProps };
