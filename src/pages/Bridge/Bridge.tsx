import { withErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '@/legacy-components/ErrorFallback';

import BridgeOverview from './BridgeOverview';

const Bridge = (): JSX.Element => {
  return <BridgeOverview />;
};

export default withErrorBoundary(Bridge, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
