import { withErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '@/legacy-components/ErrorFallback';

import { EarnStrategyForm } from './components/EarnStrategyForm';

const EarnStrategies = (): JSX.Element => {
  return (
    <h1>
      Earn Strategies
      <EarnStrategyForm riskVariant='low' />
    </h1>
  );
};

export default withErrorBoundary(EarnStrategies, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
