import { isCurrencyEqual, LiquidityPool } from '@interlay/interbtc-api';
import { Key, useState } from 'react';

import { Flex } from '@/component-library';
import { PoolsTable } from '@/components';
import { AccountLiquidityPool } from '@/utils/hooks/api/amm/use-get-account-pools';

import { PoolModal } from '../PoolModal/PoolModal';

type ModalState = {
  isOpen: boolean;
  data?: LiquidityPool;
};

type PoolsTablesProps = {
  pools: LiquidityPool[];
  accountPools?: AccountLiquidityPool[];
};

const PoolsTables = ({ pools, accountPools }: PoolsTablesProps): JSX.Element => {
  const [state, setState] = useState<ModalState>({ isOpen: false });

  const handleRowAction = (ticker: Key) => {
    const pool = pools.find((pool) => pool.lpToken.ticker === ticker);
    setState({ isOpen: true, data: pool });
  };

  const handleClose = () => setState((s) => ({ ...s, isOpen: false }));

  const otherPools = accountPools
    ? pools.filter(
        (pool) => !accountPools.find((accountPool) => isCurrencyEqual(accountPool.amount.currency, pool.lpToken))
      )
    : pools;

  return (
    <>
      <Flex direction='column' gap='spacing6'>
        {!!accountPools?.length && (
          <PoolsTable variant='account-pools' pools={accountPools} onRowAction={handleRowAction} />
        )}
        {!!otherPools.length && (
          <PoolsTable
            variant='available-pools'
            pools={otherPools.map((pool) => ({ data: pool }))}
            onRowAction={handleRowAction}
          />
        )}
      </Flex>
      <PoolModal isOpen={state.isOpen} pool={state.data} onClose={handleClose} />
    </>
  );
};

export { PoolsTables };
export type { PoolsTablesProps };
