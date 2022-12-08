import { withErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '@/components/ErrorFallback';

import LoansOverview from './LoansOverview';

const Loans = (): JSX.Element => {
  return <LoansOverview />;
};

export default withErrorBoundary(Loans, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
