import { withErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '@/legacy-components/ErrorFallback';

import { StrategyForm } from './components/StrategyForm';
import { StyledStrategiesLayout } from './Strategies.style';

const Strategies = (): JSX.Element => {
  return (
    <StyledStrategiesLayout>
      <StrategyForm riskVariant='low' />
    </StyledStrategiesLayout>
  );
};

export default withErrorBoundary(Strategies, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
