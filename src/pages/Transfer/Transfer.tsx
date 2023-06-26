import { withErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '@/legacy-components/ErrorFallback';

import TransferForms from './TransferForms';

const Transfer = (): JSX.Element => {
  return <TransferForms />;
};

export default withErrorBoundary(Transfer, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
