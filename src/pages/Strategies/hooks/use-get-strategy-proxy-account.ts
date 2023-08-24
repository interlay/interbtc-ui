import { storageKeyToNthInner } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import useAccountId from '@/hooks/use-account-id';

import { StrategyType } from '../types';

interface UseGetStrategyProxyAccountResult {
  account: AccountId | undefined;
  isLoading: boolean;
  refetch: () => void;
}

const getStrategyProxyAccount = async (
  strategyType: StrategyType,
  primaryAccount: AccountId | undefined
): Promise<AccountId | undefined> => {
  if (!primaryAccount) {
    return undefined;
  }

  // MEMO: Not possible to query proxy accounts by delegate,
  // therefore all are fetched and then filtered.

  const allProxies = await window.bridge.api.query.proxy.proxies.entries(); // will give the created proxies, unsure how to identify correctlyw hich proxy is responsible for which strategy yet
  const selectedAccountProxies = allProxies.filter(
    (proxy) => proxy[1][0][0].delegate.toString() === primaryAccount.toString()
  );

  switch (strategyType) {
    case StrategyType.BTC_LOW_RISK:
      // TODO: determine how to distinguish which proxy belongs to which strategy
      if (selectedAccountProxies.length === 0) {
        return undefined;
      }
      return storageKeyToNthInner(selectedAccountProxies[0][0]);
    default:
      return undefined;
  }
};

const useGetStrategyProxyAccount = (strategyType: StrategyType): UseGetStrategyProxyAccountResult => {
  const primaryAccount = useAccountId();

  const { data, error, refetch, isLoading } = useQuery({
    queryKey: ['strategy-proxy-account', strategyType, primaryAccount?.toString()],
    queryFn: () => getStrategyProxyAccount(strategyType, primaryAccount),
    enabled: !!primaryAccount
  });

  useErrorHandler(error);

  return { isLoading, account: data, refetch };
};

export { useGetStrategyProxyAccount };
