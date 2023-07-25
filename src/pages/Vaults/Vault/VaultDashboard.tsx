import { withErrorBoundary } from 'react-error-boundary';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { StoreType } from '@/common/types/util.types';
import { formatNumber, formatPercentage, formatUSD } from '@/common/utils/utils';
import { Card, Stack } from '@/component-library';
import { ProgressCircle } from '@/component-library/ProgressCircle';
import { MainContainer } from '@/components';
import { useGetCurrencies } from '@/hooks/api/use-get-currencies';
import { useGetIdentities } from '@/hooks/api/use-get-identities';
import { useGetVaultData } from '@/hooks/api/vaults/use-get-vault-data';
import { useGetVaultTransactions } from '@/hooks/api/vaults/use-get-vault-transactions';
import ErrorFallback from '@/legacy-components/ErrorFallback';
import PrimaryColorEllipsisLoader from '@/legacy-components/PrimaryColorEllipsisLoader';
import { useSubstrateSecureState } from '@/lib/substrate';
import { URL_PARAMETERS } from '@/utils/constants/links';

import { InsightListItem, InsightsList, PageTitle, VaultInfo } from './components';
import ReplaceTable from './ReplaceTable';
import { StyledCollateralSection, StyledRewards, StyledVaultCollateral } from './VaultDashboard.styles';
import VaultIssueRequestsTable from './VaultIssueRequestsTable';
import VaultRedeemRequestsTable from './VaultRedeemRequestsTable';

const VaultDashboard = (): JSX.Element => {
  const { selectedAccount } = useSubstrateSecureState();
  const { vaultClientLoaded, bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const {
    [URL_PARAMETERS.VAULT.ACCOUNT]: selectedVaultAccountAddress,
    [URL_PARAMETERS.VAULT.COLLATERAL]: vaultCollateral
  } = useParams<Record<string, string>>();

  const vaultData = useGetVaultData({ address: selectedVaultAccountAddress });
  const transactions = useGetVaultTransactions(selectedVaultAccountAddress, vaultCollateral, bridgeLoaded);
  const { isIdle: identitiesIdle, isLoading: identitiesLoading, data: identities } = useGetIdentities(bridgeLoaded);

  const { getCurrencyFromTicker, isSuccess: currenciesSuccess } = useGetCurrencies(bridgeLoaded);

  const vault = vaultData?.vaults?.find((vault: any) => vault.collateralId === vaultCollateral);
  const displayName = identities?.get(selectedVaultAccountAddress);

  if (!vault || !transactions || !currenciesSuccess || identitiesIdle || identitiesLoading) {
    return (
      <MainContainer>
        <Stack>
          <PageTitle />
          <PrimaryColorEllipsisLoader />
        </Stack>
      </MainContainer>
    );
  }

  const collateralToken = getCurrencyFromTicker(vault.collateralId);

  // TODO: should we leave the diameter as fixed pixels?
  const vaultCapacity = (
    <ProgressCircle
      aria-label='BTC remaining capacity'
      diameter='65'
      value={100 - Number(vault.remainingCapacity.ratio)}
    />
  );

  const insightsItems: InsightListItem[] = [
    {
      title: `Locked Collateral ${collateralToken.ticker}`,
      label: formatNumber(vault.collateral.amount.toNumber()),
      sublabel: `(${formatUSD(vault.collateral.usd)})`
    },
    {
      title: 'Locked BTC',
      label: vault.issuedTokens.amount.toString(),
      sublabel: `(${formatUSD(vault.issuedTokens.usd)})`
    },
    {
      title: `Remaining ${vault.wrappedId} capacity`,
      label: vault.remainingCapacity.amount.toBig().toString(),
      sublabel: formatPercentage(vault.remainingCapacity.ratio, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      }),
      adornment: vaultCapacity
    }
  ];

  const isReadOnlyVault = !vaultClientLoaded || selectedAccount?.address !== selectedVaultAccountAddress;

  return (
    <MainContainer>
      <Stack>
        <PageTitle />
        <VaultInfo
          collateralAmount={vault.collateral.raw}
          vaultStatus={vault?.vaultStatus}
          vaultAddress={selectedVaultAccountAddress}
          vaultDisplayName={displayName}
          collateralToken={collateralToken}
          lockedAmountBTC={vault.issuedTokens.amount}
          hasManageVaultBtn={!isReadOnlyVault}
        />
        <InsightsList items={insightsItems} />
        <StyledCollateralSection>
          <StyledVaultCollateral
            collateralToken={collateralToken}
            collateral={vault.collateral}
            collateralScore={vault.collateralization}
            liquidationThreshold={vault.liquidationThreshold}
            premiumRedeemThreshold={vault.premiumRedeemThreshold}
            secureThreshold={vault.secureThreshold}
            liquidationPrice={
              vault?.liquidationExchangeRate ? formatNumber(vault.liquidationExchangeRate.toNumber()) : '0'
            }
            remainingCapacity={vault.remainingCapacity.amount}
            lockedAmountBTC={vault.issuedTokens.amount}
            vaultAddress={selectedVaultAccountAddress}
            hasVaultActions={!isReadOnlyVault}
            wrappedId={vault.wrappedId}
          />
          <StyledRewards
            apy={vault.apy}
            governanceTokenRewards={vault.governanceTokenRewards}
            wrappedTokenRewards={vault.wrappedTokenRewards}
            wrappedId={vault.wrappedId}
            collateralToken={collateralToken}
            vaultAddress={selectedVaultAccountAddress}
            hasWithdrawRewardsBtn={!isReadOnlyVault}
          />
        </StyledCollateralSection>
        <Card>
          {collateralToken && (
            <VaultIssueRequestsTable vaultAddress={selectedVaultAccountAddress} collateralToken={collateralToken} />
          )}
          {collateralToken && (
            <VaultRedeemRequestsTable vaultAddress={selectedVaultAccountAddress} collateralToken={collateralToken} />
          )}
          {collateralToken && (
            <ReplaceTable vaultAddress={selectedVaultAccountAddress} collateralTokenTicker={collateralToken.ticker} />
          )}
        </Card>
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
