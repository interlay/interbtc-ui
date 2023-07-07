import { withErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '@/legacy-components/ErrorFallback';

import BtcOverview from './BtcOverview';

const Btc = (): JSX.Element => {
  return <BtcOverview />;
};

export default withErrorBoundary(Btc, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
