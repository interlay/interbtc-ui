import { Key, useState } from 'react';

import { Flex } from '@/component-library';
import { AccountLiquidityPool } from '@/utils/hooks/api/amm/use-get-account-pools';

import { PoolModal } from '../PoolModal/PoolModal';
import { PoolsTable } from './PoolsTable';

type PoolsTablesProps = {
  liquidityPools: AccountLiquidityPool[];
};

const PoolsTables = ({ liquidityPools }: PoolsTablesProps): JSX.Element => {
  const [liquidityPool, setLiquidityPool] = useState<AccountLiquidityPool>();

  const handleRowAction = (ticker: Key) => {
    const selectedLiquidityPool = liquidityPools.find((liquidityPool) => liquidityPool.lpToken.ticker === ticker);
    setLiquidityPool(selectedLiquidityPool);
  };

  const handleClose = () => setLiquidityPool(undefined);

  const hasProvidedLiquidity = !!liquidityPools.find((liquidityPools) => !!liquidityPools.amount);

  return (
    <>
      <Flex direction='column' gap='spacing6'>
        {hasProvidedLiquidity && (
          <PoolsTable variant='account-pools' liquidityPools={liquidityPools} onRowAction={handleRowAction} />
        )}
        <PoolsTable variant='available-pools' liquidityPools={liquidityPools} onRowAction={handleRowAction} />
      </Flex>
      <PoolModal isOpen={!!liquidityPool} liquidityPool={liquidityPool} onClose={handleClose} />
    </>
  );
};

export { PoolsTables };
export type { PoolsTablesProps };
