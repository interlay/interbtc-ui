import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router-dom';

import ErrorFallback from '@/legacy-components/ErrorFallback';
import PrimaryColorEllipsisLoader from '@/legacy-components/PrimaryColorEllipsisLoader';
import RedeemUI from '@/legacy-components/RedeemUI';
import { useRedeemRequests } from '@/services/hooks/redeem-requests';
import { URL_PARAMETERS } from '@/utils/constants/links';

// MEMO: /tx/redeem/0xb1887a4e14567610aa9ca880e29c14a00a0def0f89843bf2fe9feb3b0690635f
const RedeemTX = (): JSX.Element => {
  const { [URL_PARAMETERS.TRANSACTION_HASH]: txHash } = useParams<Record<string, string>>();

  const {
    isIdle: redeemRequestsIdle,
    isLoading: redeemRequestsLoading,
    data: redeemRequests,
    error: redeemRequestsError
  } = useRedeemRequests(0, 1, `id_eq: "${txHash}"`);
  useErrorHandler(redeemRequestsError);

  if (redeemRequestsIdle || redeemRequestsLoading) {
    return <PrimaryColorEllipsisLoader />;
  }
  if (redeemRequests === undefined) {
    throw new Error('Something went wrong!');
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return <RedeemUI redeem={redeemRequests[0]} onClose={() => {}} />;
};

export default withErrorBoundary(RedeemTX, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
