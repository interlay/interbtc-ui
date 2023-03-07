import FullLoadingSpinner from '@/legacy-components/FullLoadingSpinner';
import MainContainer from '@/parts/MainContainer';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import useAccountId from '@/utils/hooks/use-account-id';

import { AvailableAssetsTable, WalletInsights } from './components';

const WalletOverview = (): JSX.Element => {
  const accountId = useAccountId();
  const { data: balances } = useGetBalances();

  if (accountId !== undefined && !balances) {
    return <FullLoadingSpinner />;
  }

  return (
    <MainContainer>
      <WalletInsights balances={balances} />
      <AvailableAssetsTable balances={balances} />
    </MainContainer>
  );
};

export default WalletOverview;
