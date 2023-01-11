import FullLoadingSpinner from '@/components/FullLoadingSpinner';
import MainContainer from '@/parts/MainContainer';
import { useGetAccountPools } from '@/utils/hooks/api/amm/use-get-account-pools';

import { PoolsInsights, PoolsTables } from './components';

const Pools = (): JSX.Element => {
  const { data: pools } = useGetAccountPools();

  if (pools === undefined) {
    return <FullLoadingSpinner />;
  }

  return (
    <MainContainer>
      <PoolsInsights />
      <PoolsTables pools={pools} />
    </MainContainer>
  );
};

export default Pools;
