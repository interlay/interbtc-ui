import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, useQueryClient } from 'react-query';

import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

import useAccountId from '../../use-account-id';

interface AccountAccruedRewards {
  data: MonetaryAmount<CurrencyExt> | undefined;
  refetch: () => void;
}

const getAccountSubsidyRewards = (accountId: AccountId) => window.bridge.loans.getAccruedRewardsOfAccount(accountId);

const useGetAccountSubsidyRewards = (): AccountAccruedRewards => {
  const accountId = useAccountId();
  const queryKey = ['accruedRewards', accountId?.toString()];

  const { data, error } = useQuery({
    queryKey,
    queryFn: () => accountId && getAccountSubsidyRewards(accountId),
    enabled: !!accountId,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });

  useErrorHandler(error);

  const queryClient = useQueryClient();

  const refetch = () => queryClient.invalidateQueries(queryKey);

  return { data, refetch };
};

export { useGetAccountSubsidyRewards };
