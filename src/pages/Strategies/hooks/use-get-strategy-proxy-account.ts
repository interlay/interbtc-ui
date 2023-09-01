import { storageKeyToNthInner } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import useAccountId from '@/hooks/use-account-id';

import { StrategyType } from '../types';

interface UseGetStrategyProxyAccountResult {
  account: AccountId | undefined;
  isIdentitySet: boolean | undefined;
  isLoading: boolean;
  refetch: () => void;
}

const getStrategyProxyAccount = async (
  strategyType: StrategyType,
  primaryAccount: AccountId | undefined
): Promise<{ account: AccountId; isIdentitySet: boolean } | undefined> => {
  if (!primaryAccount) {
    return undefined;
  }

  // MEMO: Not possible to query proxy accounts by delegate,
  // therefore all are fetched and then filtered.

  const allProxies = await window.bridge.api.query.proxy.proxies.entries();
  const selectedAccountProxies = allProxies
    .filter((proxy) => proxy[1][0][0].delegate.toString() === primaryAccount.toString())
    .map((proxy) => storageKeyToNthInner(proxy[0]));

  const accountToStrategy = await new Promise<Array<[AccountId, StrategyType | undefined]>>((resolve) =>
    window.bridge.api.query.identity.identityOf.multi(selectedAccountProxies, (identities) => {
      const accountIdentities = identities.map((identity) => {
        if (identity.isNone) {
          return undefined;
        }
        console.log(identity.unwrap().info);
        return identity.unwrap().info.additional[0][0].toString() as StrategyType;
      });

      const accountsWithStrategies = selectedAccountProxies.map(
        (account, index) => [account, accountIdentities[index]] as [AccountId, StrategyType | undefined]
      );

      resolve(accountsWithStrategies);
    })
  );

  console.log(accountToStrategy.map(([a, b]) => [a.toString(), b]));

  const getAccountOfStrategyIdentity = () =>
    accountToStrategy.find(([, accountStrategyType]) => accountStrategyType === strategyType)?.[0];

  const getFirstUnusedProxy = () =>
    accountToStrategy.find(([, accountStrategyType]) => accountStrategyType === undefined)?.[0];

  const strategyAccount = getAccountOfStrategyIdentity();
  if (strategyAccount) {
    return { account: strategyAccount, isIdentitySet: true };
  }

  const firstUnusedProxy = getFirstUnusedProxy();

  if (!firstUnusedProxy) {
    throw new Error('Proxy account limit was exceeded.');
  }

  return { account: firstUnusedProxy, isIdentitySet: false };
};

const useGetStrategyProxyAccount = (strategyType: StrategyType): UseGetStrategyProxyAccountResult => {
  const primaryAccount = useAccountId();

  const { data, error, refetch, isLoading } = useQuery({
    queryKey: ['strategy-proxy-account', strategyType, primaryAccount?.toString()],
    queryFn: () => getStrategyProxyAccount(strategyType, primaryAccount),
    enabled: !!primaryAccount
  });

  useErrorHandler(error);

  return { account: data?.account, isIdentitySet: data?.isIdentitySet, isLoading, refetch };
};

export { useGetStrategyProxyAccount };
