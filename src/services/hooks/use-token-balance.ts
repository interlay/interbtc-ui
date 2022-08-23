import { ChainBalance, CurrencyExt } from '@interlay/interbtc-api';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, useQueryClient, UseQueryResult } from 'react-query';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import useAccountId from '@/utils/hooks/use-account-id';

interface UseTokenBalance {
  tokenBalanceIdle: UseQueryResult<ChainBalance, Error>['isIdle'];
  tokenBalanceLoading: UseQueryResult<ChainBalance, Error>['isLoading'];
  tokenBalance: UseQueryResult<ChainBalance, Error>['data'];
}

const useTokenBalance = (token: CurrencyExt, accountAddress: string | undefined): UseTokenBalance => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const accountId = useAccountId(accountAddress);

  const {
    isIdle: tokenBalanceIdle,
    isLoading: tokenBalanceLoading,
    data: tokenBalance,
    error: tokenBalanceError
  } = useQuery<ChainBalance, Error>(
    [GENERIC_FETCHER, 'tokens', 'balance', token, accountId],
    genericFetcher<ChainBalance>(),
    {
      enabled: !!bridgeLoaded && !!accountId
    }
  );
  useErrorHandler(tokenBalanceError);

  return {
    tokenBalanceIdle,
    tokenBalanceLoading,
    tokenBalance
  };
};

interface UseGovernanceTokenBalance {
  governanceTokenBalanceIdle: UseQueryResult<ChainBalance, Error>['isIdle'];
  governanceTokenBalanceLoading: UseQueryResult<ChainBalance, Error>['isLoading'];
  governanceTokenBalance: UseQueryResult<ChainBalance, Error>['data'];
}

const useGovernanceTokenBalance = (accountAddress?: string): UseGovernanceTokenBalance => {
  const {
    tokenBalanceIdle: governanceTokenBalanceIdle,
    tokenBalanceLoading: governanceTokenBalanceLoading,
    tokenBalance: governanceTokenBalance
  } = useTokenBalance(GOVERNANCE_TOKEN, accountAddress);

  return {
    governanceTokenBalanceIdle,
    governanceTokenBalanceLoading,
    governanceTokenBalance
  };
};

const useGovernanceTokenBalanceInvalidate = (accountAddress?: string): (() => void) | undefined => {
  const accountId = useAccountId(accountAddress);

  const queryClient = useQueryClient();

  return accountId
    ? () => {
        queryClient.invalidateQueries([GENERIC_FETCHER, 'tokens', 'balance', GOVERNANCE_TOKEN, accountId]);
      }
    : undefined;
};

// MEMO: should wrap components with `withErrorBoundary` from `react-error-boundary` where these hooks are placed for nearest error handling
export { useGovernanceTokenBalance, useGovernanceTokenBalanceInvalidate };

export default useTokenBalance;
