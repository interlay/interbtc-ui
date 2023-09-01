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

const getProxyIdentities = (proxyAccounts: Array<AccountId>) =>
  new Promise<Array<[AccountId, StrategyType | undefined]>>((resolve) =>
    window.bridge.api.query.identity.identityOf.multi(proxyAccounts, (identities) => {
      const accountIdentities = identities.map((identity) => {
        if (identity.isNone) {
          return undefined;
        }
        return identity.unwrap().info.additional[0][1].asRaw.toHuman() as StrategyType;
      });

      const accountsWithStrategies = proxyAccounts.map(
        (account, index) => [account, accountIdentities[index]] as [AccountId, StrategyType | undefined]
      );

      resolve(accountsWithStrategies);
    })
  );

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
  const proxiesOfUserAccount = allProxies
    .filter((proxy) => proxy[1][0][0].delegate.toString() === primaryAccount.toString())
    .map((proxy) => storageKeyToNthInner(proxy[0]));

  if (proxiesOfUserAccount.length === 0) {
    return undefined;
  }

  const accountToStrategy = await getProxyIdentities(proxiesOfUserAccount);

  const strategyAccount = accountToStrategy.find(
    ([, accountStrategyType]) => accountStrategyType === strategyType
  )?.[0];

  if (strategyAccount) {
    return { account: strategyAccount, isIdentitySet: true };
  }
  // If strategy is not connected with any proxy account return first unused proxy account
  // that will be assigned with first strategy deposit.

  const firstUnusedProxyAccount = accountToStrategy.find(
    ([, accountStrategyType]) => accountStrategyType === undefined
  )?.[0];

  if (!firstUnusedProxyAccount) {
    throw new Error('Proxy account limit was exceeded.');
  }

  return { account: firstUnusedProxyAccount, isIdentitySet: false };
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
