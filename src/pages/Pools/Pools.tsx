import { MainContainer } from '@/components';
import { useGetAccountPools } from '@/hooks/api/amm/use-get-account-pools';
import { useGetLiquidityPools } from '@/hooks/api/amm/use-get-liquidity-pools';
import useAccountId from '@/hooks/use-account-id';
import FullLoadingSpinner from '@/legacy-components/FullLoadingSpinner';

import { PoolsInsights, PoolsTables } from './components';

const Pools = (): JSX.Element => {
  const accountId = useAccountId();
  const { data: accountPoolsData, refetch: refetchAccountPools } = useGetAccountPools();
  const { data: pools } = useGetLiquidityPools();

  const accountPositions = accountPoolsData?.positions;
  const isLoadingAccountData = accountId !== undefined && accountPoolsData === undefined;

  if (pools === undefined || isLoadingAccountData) {
    return <FullLoadingSpinner />;
  }

  return (
    <MainContainer>
      <PoolsInsights pools={pools} accountPoolsData={accountPoolsData} refetch={refetchAccountPools} />
      <PoolsTables pools={pools} accountPools={accountPositions} />
    </MainContainer>
  );
};

export default Pools;
