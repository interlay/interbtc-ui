import { withErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '@/legacy-components/ErrorFallback';

import { EarnStrategyForm } from './components/form/EarnStrategyForm';
import { StyledEarnStrategiesLayout } from './EarnStrategies.style';

const EarnStrategies = (): JSX.Element => {
  return (
    <StyledEarnStrategiesLayout>
      <EarnStrategyForm riskVariant='low' />
    </StyledEarnStrategiesLayout>
  );
};

export default withErrorBoundary(EarnStrategies, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
