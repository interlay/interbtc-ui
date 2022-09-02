import { CollateralIdLiteral } from '@interlay/interbtc-api';
import { withErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router';

import { displayMonetaryAmount, formatNumber, formatUSD } from '@/common/utils/utils';
import { Stack } from '@/component-library';
import { ProgressCircle } from '@/component-library/ProgressCircle';
import ErrorFallback from '@/components/ErrorFallback';
import PrimaryColorEllipsisLoader from '@/components/PrimaryColorEllipsisLoader';
import MainContainer from '@/parts/MainContainer';
import { URL_PARAMETERS } from '@/utils/constants/links';
import { getCurrency } from '@/utils/helpers/currencies';
import { useGetVaultOverview } from '@/utils/hooks/api/vaults/use-get-vault-data';
import { useGetVaultTransactions } from '@/utils/hooks/api/vaults/use-get-vault-transactions';

import { InsightListItem, InsightsList, PageTitle, TransactionHistory, VaultInfo } from './components';
import { StyledCollateralSection, StyledRewards, StyledVaultCollateral } from './NewVaultDashboard.styles';

const VaultDashboard = (): JSX.Element => {
  const {
    [URL_PARAMETERS.VAULT.ACCOUNT]: selectedVaultAccountAddress,
    [URL_PARAMETERS.VAULT.COLLATERAL]: vaultCollateral
  } = useParams<Record<string, string>>();

  const vaultOverview = useGetVaultOverview({ address: selectedVaultAccountAddress });
  const transactions = useGetVaultTransactions(selectedVaultAccountAddress, vaultCollateral);

  const vaultData = vaultOverview?.vaults?.find((vault: any) => vault.collateralId === vaultCollateral);

  if (!vaultData || !transactions) {
    return (
      <MainContainer>
        <Stack>
          <PageTitle />
          <PrimaryColorEllipsisLoader />
        </Stack>
      </MainContainer>
    );
  }

  const collateralToken = getCurrency(vaultData.collateralId as CollateralIdLiteral);

  // TODO: should we leave the diameter as fixed pixels?
  const vaultCapacity = (
    <ProgressCircle
      aria-label='BTC remaining capacity'
      diameter='65'
      value={(1 - Number(vaultData.remainingCapacity.percentage)) * 100}
    />
  );

  const insightsItems: InsightListItem[] = [
    {
      title: `Locked Collateral ${collateralToken.ticker}`,
      label: formatNumber(vaultData.collateral.amount.toNumber()),
      sublabel: `(${formatUSD(vaultData.collateral.usd)})`
    },
    {
      title: 'Locked BTC',
      label: formatNumber(vaultData.issuedTokens.amount.toNumber()),
      sublabel: `(${formatUSD(vaultData.issuedTokens.usd)})`
    },
    {
      title: 'Remaining kBTC capacity',
      label: displayMonetaryAmount(vaultData.remainingCapacity.amount),
      sublabel: `(${new Intl.NumberFormat(undefined, {
        style: 'percent',
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      }).format(vaultData.remainingCapacity.percentage)})`,
      adornment: vaultCapacity
    }
  ];

  return (
    <MainContainer>
      <Stack>
        <PageTitle />
        <VaultInfo
          collateralAmount={vaultData.collateral.raw}
          vaultStatus={vaultData?.vaultStatus}
          vaultAddress={selectedVaultAccountAddress}
          collateralToken={collateralToken}
          lockedAmountBTC={vaultData.issuedTokens.amount}
        />
        <InsightsList items={insightsItems} />
        <StyledCollateralSection>
          <StyledVaultCollateral
            collateralToken={collateralToken}
            collateral={vaultData.collateral}
            collateralScore={vaultData.collateralization}
            liquidationThreshold={vaultData.liquidationThreshold}
            premiumRedeemThreshold={vaultData.premiumRedeemThreshold}
            secureThreshold={vaultData.secureThreshold}
            liquidationPrice={
              vaultData?.liquidationExchangeRate ? formatNumber(vaultData.liquidationExchangeRate.toNumber()) : '0'
            }
            remainingCapacity={vaultData.remainingCapacity.amount}
            lockedAmountBTC={vaultData.issuedTokens.amount}
            vaultAddress={selectedVaultAccountAddress}
          />
          <StyledRewards
            apy={vaultData.apy}
            collateralId={vaultData.collateralId}
            governanceTokenRewards={vaultData.governanceTokenRewards}
            wrappedTokenRewards={vaultData.wrappedTokenRewards}
            wrappedId={vaultData.wrappedId}
            collateralToken={collateralToken}
            vaultAddress={selectedVaultAccountAddress}
          />
        </StyledCollateralSection>
        <TransactionHistory transactions={transactions} />
      </Stack>
    </MainContainer>
  );
};

export default withErrorBoundary(VaultDashboard, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
