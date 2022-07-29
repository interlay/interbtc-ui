import { withErrorBoundary } from 'react-error-boundary';

import { CTA, InsightsList, InsightsListItem } from '@/component-library';
import ErrorFallback from '@/components/ErrorFallback';
import MainContainer from '@/parts/MainContainer';

const VaultDashboard = (): JSX.Element => {
  return (
    <MainContainer>
      <InsightsList>
        <InsightsListItem title='Locked Collateral KSM' label='400' />
        <InsightsListItem title='Remaining kBTC capacity' label='93.5%' sublabel='(2.59643046 kBTC)' />
        <InsightsListItem title='Locked BTC' label='0.54538777' sublabel='($339.05)' />
        <InsightsListItem>
          <CTA fullWidth variant='primary'>
            Deposit Collateral
          </CTA>
          <CTA fullWidth variant='outlined'>
            Withdraw Collateral
          </CTA>
        </InsightsListItem>
      </InsightsList>
    </MainContainer>
  );
};

export default withErrorBoundary(VaultDashboard, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
