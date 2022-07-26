import { ChainBalance, CurrencyUnit, GovernanceUnit } from '@interlay/interbtc-api';
import { Currency } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import * as React from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, UseQueryResult } from 'react-query';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { GOVERNANCE_TOKEN, GovernanceToken } from '@/config/relay-chains';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import useAccountId from '@/utils/hooks/use-account-id';

interface UseTokenBalance<T extends CurrencyUnit> {
  tokenBalanceIdle: UseQueryResult<ChainBalance<T>, Error>['isIdle'];
  tokenBalanceLoading: UseQueryResult<ChainBalance<T>, Error>['isLoading'];
  tokenBalance: UseQueryResult<ChainBalance<T>, Error>['data'];
}

const useTokenBalance = <T extends CurrencyUnit>(
  token: Currency<T>,
  accountAddress: string | undefined
): UseTokenBalance<T> => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const accountId = useAccountId(accountAddress);

  const {
    isIdle: tokenBalanceIdle,
    isLoading: tokenBalanceLoading,
    data: tokenBalance,
    error: tokenBalanceError
  } = useQuery<ChainBalance<T>, Error>(
    [GENERIC_FETCHER, 'tokens', 'balance', token, accountId],
    genericFetcher<ChainBalance<T>>(),
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
  governanceTokenBalanceIdle: UseQueryResult<ChainBalance<GovernanceUnit>, Error>['isIdle'];
  governanceTokenBalanceLoading: UseQueryResult<ChainBalance<GovernanceUnit>, Error>['isLoading'];
  governanceTokenBalance: UseQueryResult<ChainBalance<GovernanceUnit>, Error>['data'];
}

const useGovernanceTokenBalance = (accountAddress?: string): UseGovernanceTokenBalance => {
  const {
    tokenBalanceIdle: governanceTokenBalanceIdle,
    tokenBalanceLoading: governanceTokenBalanceLoading,
    tokenBalance: governanceTokenBalance
  } = useTokenBalance<GovernanceUnit>(GOVERNANCE_TOKEN, accountAddress);

  return {
    governanceTokenBalanceIdle,
    governanceTokenBalanceLoading,
    governanceTokenBalance
  };
};

const useGovernanceTokenBalanceQueryKey = (
  accountAddress?: string
): [string, string, string, GovernanceToken, AccountId] | undefined => {
  const accountId = useAccountId(accountAddress);

  return React.useMemo(() => {
    if (!accountId) return;

    return [GENERIC_FETCHER, 'tokens', 'balance', GOVERNANCE_TOKEN, accountId];
  }, [accountId]);
};

// MEMO: should wrap components with `withErrorBoundary` from `react-error-boundary` where these hooks are placed for nearest error handling
export { useGovernanceTokenBalance, useGovernanceTokenBalanceQueryKey };

export default useTokenBalance;
