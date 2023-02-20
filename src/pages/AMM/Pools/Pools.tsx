import FullLoadingSpinner from '@/legacy-components/FullLoadingSpinner';
import MainContainer from '@/parts/MainContainer';
import { useGetAccountPools } from '@/utils/hooks/api/amm/use-get-account-pools';
import { useGetLiquidityPools } from '@/utils/hooks/api/amm/use-get-liquidity-pools';
import useAccountId from '@/utils/hooks/use-account-id';

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
