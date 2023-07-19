import { withErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '@/legacy-components/ErrorFallback';

import { StrategyPage } from './components';

const Strategies = (): JSX.Element => {
  return <StrategyPage />;
};

export default withErrorBoundary(Strategies, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
