import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, UseQueryResult } from 'react-query';

import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

import useAccountId from '../../use-account-id';

type AccountAccruedRewardsData = MonetaryAmount<CurrencyExt>;

const getAccountSubsidyRewards = (accountId: AccountId): Promise<AccountAccruedRewardsData> =>
  window.bridge.loans.getAccruedRewardsOfAccount(accountId);

const useGetAccountSubsidyRewards = (): UseQueryResult<AccountAccruedRewardsData | undefined, unknown> => {
  const accountId = useAccountId();
  const queryKey = ['accruedRewards', accountId?.toString()];

  const query = useQuery({
    queryKey,
    queryFn: () => accountId && getAccountSubsidyRewards(accountId),
    enabled: !!accountId,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });

  useErrorHandler(query.error);

  return query;
};

export { useGetAccountSubsidyRewards };
export type { AccountAccruedRewardsData };
