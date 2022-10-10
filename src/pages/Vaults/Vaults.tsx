import { withErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '@/components/ErrorFallback';

import VaultsOverview from './VaultsOverview';

const Vaults = (): JSX.Element => {
  return <VaultsOverview />;
};

export default withErrorBoundary(Vaults, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
