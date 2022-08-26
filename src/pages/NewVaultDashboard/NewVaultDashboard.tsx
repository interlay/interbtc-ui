import { withErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router';

import { formatNumber, formatPercentage, formatUSD } from '@/common/utils/utils';
import { CTA, Stack } from '@/component-library';
import { ProgressCircle } from '@/component-library/ProgressCircle';
import ErrorFallback from '@/components/ErrorFallback';
import MainContainer from '@/parts/MainContainer';
import { URL_PARAMETERS } from '@/utils/constants/links';
import { useGetVaultOverview } from '@/utils/hooks/api/vaults/use-get-vault-data';

import { InsightListItem, InsightsList, PageTitle, TransactionHistory, VaultInfo } from './components';
import {
  StyledCollateralSection,
  StyledStackingInsightsList,
  StyledStakingTitle,
  StyledStakingTitleWrapper,
  StyledVaultCollateral
} from './NewVaultDashboard.styles';

const VaultDashboard = (): JSX.Element => {
  const {
    [URL_PARAMETERS.VAULT.ACCOUNT]: selectedVaultAccountAddress,
    [URL_PARAMETERS.VAULT.COLLATERAL]: vaultCollateral
  } = useParams<Record<string, string>>();

  const vaultOverview = useGetVaultOverview({ address: selectedVaultAccountAddress });
  const vaultData = vaultOverview?.vaults?.find((vault: any) => vault.collateralId === vaultCollateral);

  const stakingTitle = (
    <StyledStakingTitleWrapper>
      <StyledStakingTitle>Rewards</StyledStakingTitle>
      <CTA size='small' variant='outlined'>
        Withdraw all rewards
      </CTA>
    </StyledStakingTitleWrapper>
  );

  // TODO: should we leave the diameter as fixed pixels?
  const vaultCapacity = <ProgressCircle diameter='65' value={93} />;

  const insightsItems: InsightListItem[] = [
    {
      title: `Locked Collateral ${vaultData?.collateralId}`,
      label: vaultData ? formatNumber(vaultData.collateral.amount.toNumber()) : undefined
    },
    {
      title: 'Locked BTC',
      label: vaultData ? formatNumber(vaultData.issuedTokens.amount.toNumber()) : undefined,
      sublabel: vaultData ? `(${formatUSD(vaultData.issuedTokens.usd)})` : undefined
    },
    {
      title: 'Remaining kBTC capacity',
      label: formatPercentage(0.935),
      sublabel: '(2.59643046 kBTC)',
      adornment: vaultCapacity
    }
  ];

  const stakingItems: InsightListItem[] = [
    { title: 'APR', label: vaultData ? formatPercentage(vaultData.apy?.toNumber()) : undefined },
    {
      title: `Fees earned ${vaultData?.wrappedId}`,
      label: vaultData ? formatNumber(vaultData.wrappedTokenRewards.amount.toNumber()) : undefined,
      sublabel: vaultData ? `(${formatUSD(vaultData.wrappedTokenRewards.usd)})` : undefined
    },
    {
      title: `Fees earned ${vaultData?.collateralId}`,
      label: vaultData ? formatNumber(vaultData.governanceTokenRewards.amount.toNumber()) : undefined,
      sublabel: vaultData ? `(${formatUSD(vaultData.governanceTokenRewards.usd)})` : undefined
    }
  ];

  return (
    <MainContainer>
      <Stack>
        <PageTitle />
        <VaultInfo />
        <InsightsList items={insightsItems} />
        <StyledCollateralSection>
          <StyledVaultCollateral
            collateralScore={vaultData?.collateralization?.toNumber() ?? 0}
            liquidationPrice={
              vaultData?.liquidationExchangeRate ? formatNumber(vaultData.liquidationExchangeRate.toNumber()) : '0'
            }
          />
          <StyledStackingInsightsList title={stakingTitle} direction='column' items={stakingItems} />
        </StyledCollateralSection>
        <TransactionHistory />
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
