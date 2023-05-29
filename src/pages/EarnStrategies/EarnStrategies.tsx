import { withErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '@/legacy-components/ErrorFallback';

import { StrategyBanner } from './components';

const EarnStrategies = (): JSX.Element => {
  return (
    <StrategyBanner
      title='Deposit IBTC & earn Dot'
      description='Earn daily staking rewards by depositing IBTC and receiving auto compounding vDOT. Low management required.'
    />
  );
};

export default withErrorBoundary(EarnStrategies, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
