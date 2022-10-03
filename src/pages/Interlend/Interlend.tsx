import { withErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '@/components/ErrorFallback';

import InterlendOverview from './InterlendOverview';

const Vaults = (): JSX.Element => {
  return <InterlendOverview />;
};

export default withErrorBoundary(Vaults, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
