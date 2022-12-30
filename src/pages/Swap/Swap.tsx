import { withErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '@/components/ErrorFallback';

import LoansOverview from './SwapOverview';

const Loans = (): JSX.Element => {
  return <LoansOverview />;
};

export default withErrorBoundary(Loans, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
