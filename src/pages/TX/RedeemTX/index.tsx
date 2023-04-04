import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import ErrorFallback from '@/legacy-components/ErrorFallback';
import PrimaryColorEllipsisLoader from '@/legacy-components/PrimaryColorEllipsisLoader';
import RedeemUI from '@/legacy-components/RedeemUI';
import redeemsFetcher, { getRedeemWithStatus, REDEEMS_FETCHER } from '@/services/fetchers/redeems-fetcher';
import useCurrentActiveBlockNumber from '@/services/hooks/use-current-active-block-number';
import useStableBitcoinConfirmations from '@/services/hooks/use-stable-bitcoin-confirmations';
import useStableParachainConfirmations from '@/services/hooks/use-stable-parachain-confirmations';
import { URL_PARAMETERS } from '@/utils/constants/links';

// MEMO: /tx/redeem/0xb1887a4e14567610aa9ca880e29c14a00a0def0f89843bf2fe9feb3b0690635f
const RedeemTX = (): JSX.Element => {
  const { [URL_PARAMETERS.TRANSACTION_HASH]: txHash } = useParams<Record<string, string>>();

  const {
    isIdle: stableBitcoinConfirmationsIdle,
    isLoading: stableBitcoinConfirmationsLoading,
    data: stableBitcoinConfirmations,
    error: stableBitcoinConfirmationsError
  } = useStableBitcoinConfirmations();
  useErrorHandler(stableBitcoinConfirmationsError);

  const {
    isIdle: stableParachainConfirmationsIdle,
    isLoading: stableParachainConfirmationsLoading,
    data: stableParachainConfirmations,
    error: stableParachainConfirmationsError
  } = useStableParachainConfirmations();
  useErrorHandler(stableParachainConfirmationsError);

  const {
    isIdle: currentActiveBlockNumberIdle,
    isLoading: currentActiveBlockNumberLoading,
    data: currentActiveBlockNumber,
    error: currentActiveBlockNumberError
  } = useCurrentActiveBlockNumber();
  useErrorHandler(currentActiveBlockNumberError);

  const {
    isIdle: redeemsIdle,
    isLoading: redeemsLoading,
    data: redeems,
    error: redeemsError
    // TODO: should type properly (`Relay`)
  } = useQuery<any, Error>(
    [
      REDEEMS_FETCHER,
      0, // offset
      1, // limit
      `id_eq: "${txHash}"` // `WHERE` condition
    ],
    redeemsFetcher
  );
  useErrorHandler(redeemsError);

  if (
    redeemsIdle ||
    redeemsLoading ||
    stableBitcoinConfirmationsIdle ||
    stableBitcoinConfirmationsLoading ||
    stableParachainConfirmationsIdle ||
    stableParachainConfirmationsLoading ||
    currentActiveBlockNumberIdle ||
    currentActiveBlockNumberLoading
  ) {
    return <PrimaryColorEllipsisLoader />;
  }
  if (
    redeems === undefined ||
    stableBitcoinConfirmations === undefined ||
    stableParachainConfirmations === undefined ||
    currentActiveBlockNumber === undefined
  ) {
    throw new Error('Something went wrong!');
  }

  const redeem = getRedeemWithStatus(
    redeems[0],
    stableBitcoinConfirmations,
    stableParachainConfirmations,
    currentActiveBlockNumber
  );

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return <RedeemUI redeem={redeem} onClose={() => {}} />;
};

export default withErrorBoundary(RedeemTX, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
