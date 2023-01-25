import FullLoadingSpinner from '@/components/FullLoadingSpinner';
import MainContainer from '@/parts/MainContainer';
import { useGetAccountPools } from '@/utils/hooks/api/amm/use-get-account-pools';
import useAccountId from '@/utils/hooks/use-account-id';

import { PoolsInsights, PoolsTables } from './components';

const Pools = (): JSX.Element => {
  const accountId = useAccountId();
  const { data: pools } = useGetAccountPools();

  if (pools === undefined || !accountId) {
    return <FullLoadingSpinner />;
  }

  return (
    <MainContainer>
      <PoolsInsights />
      <PoolsTables pools={pools} accountId={accountId} />
    </MainContainer>
  );
};

export default Pools;
