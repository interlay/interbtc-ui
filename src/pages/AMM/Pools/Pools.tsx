import FullLoadingSpinner from '@/components/FullLoadingSpinner';
import MainContainer from '@/parts/MainContainer';
import { useGetAccountPools } from '@/utils/hooks/api/amm/use-get-account-pools';

import { PoolsInsights, PoolsTables } from './components';

const Pools = (): JSX.Element => {
  const { data: liquidityPools } = useGetAccountPools();

  if (liquidityPools === undefined) {
    return <FullLoadingSpinner />;
  }

  return (
    <MainContainer>
      <PoolsInsights />
      <PoolsTables liquidityPools={liquidityPools} />
    </MainContainer>
  );
};

export default Pools;
