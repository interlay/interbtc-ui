import { withErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '@/legacy-components/ErrorFallback';

import TransferOverview from './TransferOverview';

const Transfer = (): JSX.Element => {
  return <TransferOverview />;
};

export default withErrorBoundary(Transfer, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
