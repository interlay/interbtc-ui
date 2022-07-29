import { withErrorBoundary } from 'react-error-boundary';

import { CTA, Stack } from '@/component-library';
import ErrorFallback from '@/components/ErrorFallback';
import MainContainer from '@/parts/MainContainer';

import { InsightListItem, InsightsList, PageTitle, TransactionHistory, VaultInfo } from './components';
import {
  StyledCollateralSection,
  StyledStackingInsightsList,
  StyledStakingTitle,
  StyledStakingTitleWrapper,
  StyledVaultCollateral
} from './NewVaultDashboard.styles';

const insightsItems: InsightListItem[] = [
  { title: 'Locked Collateral KSM', label: '400' },
  { title: 'Locked BTC', label: '0.54538777', sublabel: '($339.05)' },
  { title: 'Remaining kBTC capacity', label: '93.5%', sublabel: '(2.59643046 kBTC)' }
];

const VaultDashboard = (): JSX.Element => {
  const stakingTitle = (
    <StyledStakingTitleWrapper>
      <StyledStakingTitle>Rewards</StyledStakingTitle>
      <CTA size='small' variant='outlined'>
        Withdraw all rewards
      </CTA>
    </StyledStakingTitleWrapper>
  );

  return (
    <MainContainer>
      <Stack>
        <PageTitle />
        <VaultInfo />
        <InsightsList items={insightsItems} />
        <StyledCollateralSection>
          <StyledVaultCollateral />
          <StyledStackingInsightsList title={stakingTitle} direction='column' items={insightsItems} />
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
