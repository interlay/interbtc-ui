import FullLoadingSpinner from '@/components/FullLoadingSpinner';
import MainContainer from '@/parts/MainContainer';
import { useGetAccountPools } from '@/utils/hooks/api/amm/use-get-account-pools';
import { useGetLiquidityPools } from '@/utils/hooks/api/amm/use-get-liquidity-pools';
import useAccountId from '@/utils/hooks/use-account-id';

import { PoolsInsights, PoolsTables } from './components';

const Pools = (): JSX.Element => {
  const accountId = useAccountId();
  const { data: accountPools } = useGetAccountPools();
  const { data: pools } = useGetLiquidityPools();

  const isLoadingAccountData = accountId !== undefined && accountPools === undefined;

  if (pools === undefined || isLoadingAccountData) {
    return <FullLoadingSpinner />;
  }

  return (
    <MainContainer>
      <PoolsInsights pools={pools} accountPools={accountPools} />
      <PoolsTables pools={pools} accountPools={accountPools} />
    </MainContainer>
  );
};

export default Pools;
