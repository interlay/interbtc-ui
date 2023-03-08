import { LiquidityPoolTable } from '@/components/LiquidityPoolTable';
import FullLoadingSpinner from '@/legacy-components/FullLoadingSpinner';
import MainContainer from '@/parts/MainContainer';
import { useGetAccountPools } from '@/utils/hooks/api/amm/use-get-account-pools';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import useAccountId from '@/utils/hooks/use-account-id';

import { AvailableAssetsTable, WalletInsights } from './components';

const WalletOverview = (): JSX.Element => {
  const accountId = useAccountId();
  const { data: balances } = useGetBalances();
  const { data: accountPoolsData } = useGetAccountPools();

  if (accountId !== undefined && !balances) {
    return <FullLoadingSpinner />;
  }

  return (
    <MainContainer>
      <WalletInsights balances={balances} />
      <AvailableAssetsTable balances={balances} />
      {accountPoolsData && (
        <LiquidityPoolTable variant='account-pools' title='Liquidity Pools' pools={accountPoolsData.positions} />
      )}
    </MainContainer>
  );
};

export default WalletOverview;
