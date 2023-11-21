import { Alert } from '@/component-library';
import { MainContainer } from '@/components';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
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
      <Alert status='warning'>
        Please be aware that there are currently no {GOVERNANCE_TOKEN.ticker} incentives being provided to the pools.
        The APR displayed represents the earnings based on solely on trading fees. These earnings are automatically
        reinvested into your positions.
      </Alert>
      <PoolsTables pools={pools} accountPools={accountPositions} />
    </MainContainer>
  );
};

export default Pools;
