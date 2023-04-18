import { LoanPositionsTable, PoolsTable } from '@/components';
import FullLoadingSpinner from '@/legacy-components/FullLoadingSpinner';
import MainContainer from '@/parts/MainContainer';
import { getPooledTickers } from '@/utils/helpers/pools';
import { useGetAccountPools } from '@/utils/hooks/api/amm/use-get-account-pools';
import { useGetLiquidityPools } from '@/utils/hooks/api/amm/use-get-liquidity-pools';
import { useGetAccountStakingData } from '@/utils/hooks/api/escrow/use-get-account-staking-data';
import { useGetAccountVotingBalance } from '@/utils/hooks/api/escrow/use-get-account-voting-balance';
import { useGetAccountPositions } from '@/utils/hooks/api/loans/use-get-account-positions';
import { useGetLoanAssets } from '@/utils/hooks/api/loans/use-get-loan-assets';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import useAccountId from '@/utils/hooks/use-account-id';

import { AvailableAssetsTable, StakingTable, WalletInsights } from './components';

const WalletOverview = (): JSX.Element => {
  const accountId = useAccountId();
  const { data: balances } = useGetBalances();
  const { data: accountPoolsData } = useGetAccountPools();
  const { data: liquidityPools } = useGetLiquidityPools();
  const { data: accountStakingData } = useGetAccountStakingData();
  const { data: accountVotingBalance } = useGetAccountVotingBalance();
  const {
    data: { borrowPositions, lendPositions }
  } = useGetAccountPositions();
  const { data: assets } = useGetLoanAssets();

  if (accountId !== undefined && !balances) {
    return <FullLoadingSpinner />;
  }

  const hasStakingTable =
    accountStakingData &&
    accountVotingBalance &&
    (!accountStakingData?.balance.isZero() || !accountVotingBalance?.isZero());

  const pooledTickers = liquidityPools && getPooledTickers(liquidityPools);

  return (
    <MainContainer>
      <WalletInsights balances={balances} />
      <AvailableAssetsTable balances={balances} pooledTickers={pooledTickers} />
      {!!lendPositions?.length && assets && (
        <LoanPositionsTable title='Lend Positions' positions={lendPositions} variant='lend' assets={assets} />
      )}
      {!!borrowPositions?.length && assets && (
        <LoanPositionsTable title='Borrow Positions' positions={borrowPositions} variant='borrow' assets={assets} />
      )}
      {!!accountPoolsData?.positions.length && (
        <PoolsTable variant='account-pools' title='Liquidity Pools' pools={accountPoolsData.positions} />
      )}
      {hasStakingTable && <StakingTable data={accountStakingData as any} votingBalance={accountVotingBalance as any} />}
    </MainContainer>
  );
};

export default WalletOverview;
