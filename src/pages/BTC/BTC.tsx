import { withErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '@/legacy-components/ErrorFallback';

import BTCOverview from './BTCOverview';

const BTC = (): JSX.Element => {
  return <BTCOverview />;
};

export default withErrorBoundary(BTC, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
