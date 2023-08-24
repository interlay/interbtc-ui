import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { REFETCH_INTERVAL } from '@/utils/constants/api';

import useAccountId from '../../use-account-id';

const getAccountVotingBalance = async (accountId: AccountId): Promise<MonetaryAmount<CurrencyExt>> =>
  window.bridge.escrow.votingBalance(accountId);

interface GetAccountVotingBalanceResult {
  data: MonetaryAmount<CurrencyExt> | undefined;
  refetch: () => void;
}

const useGetAccountVotingBalance = (): GetAccountVotingBalanceResult => {
  const accountId = useAccountId();

  const queryKey = ['voting', accountId];

  const { data, error, refetch } = useQuery({
    queryKey,
    queryFn: () => accountId && getAccountVotingBalance(accountId),
    refetchInterval: REFETCH_INTERVAL.BLOCK,
    enabled: !!accountId
  });

  useErrorHandler(error);

  return { data, refetch };
};

export { useGetAccountVotingBalance };
export type { GetAccountVotingBalanceResult };
