import { LiquidityPoolTable } from '@/components/LiquidityPoolTable';
import FullLoadingSpinner from '@/legacy-components/FullLoadingSpinner';
import MainContainer from '@/parts/MainContainer';
import { useGetAccountPools } from '@/utils/hooks/api/amm/use-get-account-pools';
import { useGetAccountStakingData } from '@/utils/hooks/api/escrow/use-get-account-staking-data';
import { useGetAccountVotingBalance } from '@/utils/hooks/api/escrow/use-get-account-voting-balance';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import useAccountId from '@/utils/hooks/use-account-id';

import { AvailableAssetsTable, StakingTable, WalletInsights } from './components';

const WalletOverview = (): JSX.Element => {
  const accountId = useAccountId();
  const { data: balances } = useGetBalances();
  const { data: accountPoolsData } = useGetAccountPools();
  const { data: accountStakingData } = useGetAccountStakingData();
  const { data: accountVotingBalance } = useGetAccountVotingBalance();

  if (accountId !== undefined && !balances) {
    return <FullLoadingSpinner />;
  }

  const hasStakingTable =
    accountStakingData &&
    accountVotingBalance &&
    (!accountStakingData?.balance.isZero() || !accountVotingBalance?.isZero());

  return (
    <MainContainer>
      <WalletInsights balances={balances} />
      <AvailableAssetsTable balances={balances} />
      {!!accountPoolsData?.positions.length && (
        <LiquidityPoolTable variant='account-pools' title='Liquidity Pools' pools={accountPoolsData.positions} />
      )}
      {hasStakingTable && <StakingTable data={accountStakingData as any} votingBalance={accountVotingBalance as any} />}
    </MainContainer>
  );
};

export default WalletOverview;
