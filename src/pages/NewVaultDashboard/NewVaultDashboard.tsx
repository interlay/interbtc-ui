import { CollateralIdLiteral } from '@interlay/interbtc-api';
import { withErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router';

import { formatNumber, formatPercentage, formatUSD } from '@/common/utils/utils';
import { CTA, Stack } from '@/component-library';
import { ProgressCircle } from '@/component-library/ProgressCircle';
import ErrorFallback from '@/components/ErrorFallback';
import PrimaryColorEllipsisLoader from '@/components/PrimaryColorEllipsisLoader';
import MainContainer from '@/parts/MainContainer';
import { URL_PARAMETERS } from '@/utils/constants/links';
import { getCurrency } from '@/utils/helpers/currencies';
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

  if (!vaultData) {
    return <PrimaryColorEllipsisLoader />;
  }

  const collateralToken = getCurrency(vaultData.collateralId as CollateralIdLiteral);

  const stakingTitle = (
    <StyledStakingTitleWrapper>
      <StyledStakingTitle>Rewards</StyledStakingTitle>
      <CTA size='small' variant='outlined'>
        Withdraw all rewards
      </CTA>
    </StyledStakingTitleWrapper>
  );

  // TODO: should we leave the diameter as fixed pixels?
  const vaultCapacity = <ProgressCircle aria-label='BTC remaining capacity' diameter='65' value={93} />;

  const lockedAmountBTC = formatNumber(vaultData.issuedTokens.amount.toNumber());

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
      label: formatPercentage(0.935),
      sublabel: '(2.59643046 kBTC)',
      adornment: vaultCapacity
    }
  ];

  const stakingItems: InsightListItem[] = [
    { title: 'APR', label: formatPercentage(vaultData.apy?.toNumber()) },
    {
      title: `Fees earned ${vaultData?.wrappedId}`,
      label: formatNumber(vaultData.wrappedTokenRewards.amount.toNumber()),
      sublabel: `(${formatUSD(vaultData.wrappedTokenRewards.usd)})`
    },
    {
      title: `Fees earned ${vaultData?.collateralId}`,
      label: formatNumber(vaultData.governanceTokenRewards.amount.toNumber()),
      sublabel: `(${formatUSD(vaultData.governanceTokenRewards.usd)})`
    }
  ];

  return (
    <MainContainer>
      <Stack>
        <PageTitle />
        <VaultInfo vaultStatus={vaultData?.vaultStatus ?? ''} />
        <InsightsList items={insightsItems} />
        <StyledCollateralSection>
          <StyledVaultCollateral
            collateralToken={collateralToken}
            collateral={vaultData.collateral}
            collateralScore={vaultData?.collateralization?.toNumber() ?? 0}
            liquidationThreshold={vaultData.liquidationThreshold}
            premiumRedeemThreshold={vaultData.premiumRedeemThreshold}
            secureThreshold={vaultData.secureThreshold}
            liquidationPrice={
              vaultData?.liquidationExchangeRate ? formatNumber(vaultData.liquidationExchangeRate.toNumber()) : '0'
            }
            remainingCapacity={vaultData.remainingCapacity.amount}
            lockedAmountBTC={lockedAmountBTC}
          />
          <StyledStackingInsightsList title={stakingTitle} direction='column' items={stakingItems} />
        </StyledCollateralSection>
        <TransactionHistory address={selectedVaultAccountAddress} vaultCollateral={vaultCollateral} />
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
