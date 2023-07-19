import { withErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '@/legacy-components/ErrorFallback';

import SendAndReceiveForms from './SendAndReceiveForms';

const SendAndReceive = (): JSX.Element => {
  return <SendAndReceiveForms />;
};

export default withErrorBoundary(SendAndReceive, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
