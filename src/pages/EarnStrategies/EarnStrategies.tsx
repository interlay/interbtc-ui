import { withErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '@/legacy-components/ErrorFallback';

const EarnStrategies = (): JSX.Element => {
  return <h1>Earn Strategies</h1>;
};

export default withErrorBoundary(EarnStrategies, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
