import { LoanPositionsTable, MainContainer, PoolsTable } from '@/components';
import { useGetAccountPools } from '@/hooks/api/amm/use-get-account-pools';
import { useGetLiquidityPools } from '@/hooks/api/amm/use-get-liquidity-pools';
import { useGetAccountStakingData } from '@/hooks/api/escrow/use-get-account-staking-data';
import { useGetAccountVotingBalance } from '@/hooks/api/escrow/use-get-account-voting-balance';
import { useGetAccountPositions } from '@/hooks/api/loans/use-get-account-positions';
import { useGetLoanAssets } from '@/hooks/api/loans/use-get-loan-assets';
import { useGetBalances } from '@/hooks/api/tokens/use-get-balances';
import useAccountId from '@/hooks/use-account-id';
import { LocalStorageKey, useLocalStorage } from '@/hooks/use-local-storage';
import FullLoadingSpinner from '@/legacy-components/FullLoadingSpinner';
import { getPooledTickers } from '@/utils/helpers/pools';

import { AvailableAssetsTable, StakingTable, WalletInsights, WelcomeBanner } from './components';

const WalletOverview = (): JSX.Element => {
  const [isBannerOpen, setBannerOpen] = useLocalStorage(LocalStorageKey.WALLET_WELCOME_BANNER, true);

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

  const handleCloseBanner = () => setBannerOpen(false);

  const hasStakingTable =
    accountStakingData &&
    accountVotingBalance &&
    (!accountStakingData?.balance.isZero() || !accountVotingBalance?.isZero());

  const pooledTickers = liquidityPools && getPooledTickers(liquidityPools);

  return (
    <MainContainer>
      {isBannerOpen && <WelcomeBanner onClose={handleCloseBanner} />}
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
