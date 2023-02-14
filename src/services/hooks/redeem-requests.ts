import { useQuery } from 'react-query';

import redeemsFetcher, { getRedeemWithStatus, REDEEMS_FETCHER } from '@/services/fetchers/redeems-fetcher';
import useCurrentActiveBlockNumber from '@/services/hooks/use-current-active-block-number';
import useStableBitcoinConfirmations from '@/services/hooks/use-stable-bitcoin-confirmations';
import useStableParachainConfirmations from '@/services/hooks/use-stable-parachain-confirmations';
import { RedeemRequest, RedeemRequestWithStatusDecoded } from '@/types/redeem.d';

const useRedeemRequests = (
  offset: number,
  limit: number,
  whereCondition: string | undefined,
  refetchInterval?: number | false | undefined
): {
  isIdle: boolean;
  isLoading: boolean;
  data: Array<RedeemRequestWithStatusDecoded> | undefined;
  error: Error | null;
  refetch: () => Promise<void>;
} => {
  const {
    isIdle: stableBitcoinConfirmationsIdle,
    isLoading: stableBitcoinConfirmationsLoading,
    data: stableBitcoinConfirmations,
    error: stableBitcoinConfirmationsError
  } = useStableBitcoinConfirmations(); // Relatively static value so refetch is not necessary

  const {
    isIdle: stableParachainConfirmationsIdle,
    isLoading: stableParachainConfirmationsLoading,
    data: stableParachainConfirmations,
    error: stableParachainConfirmationsError
  } = useStableParachainConfirmations(); // Relatively static value so refetch is not necessary

  const {
    isIdle: currentActiveBlockNumberIdle,
    isLoading: currentActiveBlockNumberLoading,
    data: currentActiveBlockNumber,
    error: currentActiveBlockNumberError,
    refetch: currentActiveBlockNumberRefetch
  } = useCurrentActiveBlockNumber(refetchInterval);

  const {
    isIdle: redeemRequestsIdle,
    isLoading: redeemRequestsLoading,
    data: redeemRequests,
    error: redeemRequestsError,
    refetch: redeemRequestsRefetch
  } = useQuery<Array<RedeemRequest>, Error>(
    whereCondition === undefined ? [REDEEMS_FETCHER, offset, limit] : [REDEEMS_FETCHER, offset, limit, whereCondition],
    redeemsFetcher,
    {
      refetchInterval
    }
  );

  const data: Array<RedeemRequestWithStatusDecoded> | undefined =
    redeemRequests === undefined ||
    stableBitcoinConfirmations === undefined ||
    stableParachainConfirmations === undefined ||
    currentActiveBlockNumber === undefined
      ? undefined
      : redeemRequests.map((item) =>
          getRedeemWithStatus(item, stableBitcoinConfirmations, stableParachainConfirmations, currentActiveBlockNumber)
        );

  return {
    isIdle:
      stableBitcoinConfirmationsIdle ||
      stableParachainConfirmationsIdle ||
      currentActiveBlockNumberIdle ||
      redeemRequestsIdle,
    isLoading:
      stableBitcoinConfirmationsLoading ||
      stableParachainConfirmationsLoading ||
      currentActiveBlockNumberLoading ||
      redeemRequestsLoading,
    data,
    error:
      stableBitcoinConfirmationsError ||
      stableParachainConfirmationsError ||
      currentActiveBlockNumberError ||
      redeemRequestsError,
    refetch: async () => {
      await currentActiveBlockNumberRefetch();
      await redeemRequestsRefetch();
    }
  };
};

export { useRedeemRequests };
