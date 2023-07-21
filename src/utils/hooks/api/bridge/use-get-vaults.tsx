import { CurrencyExt, InterbtcPrimitivesVaultId } from '@interlay/interbtc-api';
import { Currency, MonetaryAmount } from '@interlay/monetary-js';
import { useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, UseQueryOptions } from 'react-query';

import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

import { useGetCurrencies } from '../use-get-currencies';

enum GetVaultType {
  ISSUE = 'issue',
  REDEEM = 'redeem'
}

const getPremiumRedeemVaults = async (): Promise<Map<InterbtcPrimitivesVaultId, MonetaryAmount<Currency>>> =>
  window.bridge.vaults.getPremiumRedeemVaults().catch(() => new Map());

type BridgeVaultData = {
  id: string;
  vaultId: InterbtcPrimitivesVaultId;
  amount: MonetaryAmount<Currency>;
  collateralCurrency: CurrencyExt;
};

type GetBridgeVaultData<T extends GetVaultType> = {
  list: BridgeVaultData[];
  map: Map<InterbtcPrimitivesVaultId, MonetaryAmount<Currency>>;
  premium: T extends GetVaultType.REDEEM
    ? {
        list: BridgeVaultData[];
        map: Map<InterbtcPrimitivesVaultId, MonetaryAmount<Currency>>;
      }
    : never;
};

type UseGetBridgeVaultResult<T extends GetVaultType> = {
  data: GetBridgeVaultData<T> | undefined;
  getAvailableVaults: T extends GetVaultType.REDEEM
    ? (requiredCapacity: MonetaryAmount<Currency>, onlyPremiumVaults?: boolean) => BridgeVaultData[] | undefined
    : (requiredCapacity: MonetaryAmount<Currency>) => BridgeVaultData[] | undefined;

  refetch: () => void;
};

type UseGetVaultsOptions<T extends GetVaultType> = UseQueryOptions<
  GetBridgeVaultData<T>,
  unknown,
  GetBridgeVaultData<T>,
  string[]
>;

const useGetVaults = <T extends GetVaultType>(
  action: T,
  options?: UseGetVaultsOptions<T>
): UseGetBridgeVaultResult<T> => {
  const { getCurrencyFromIdPrimitive, isLoading: isLoadingCurrencies } = useGetCurrencies(true);

  const composeVaultData = useCallback(
    (map: Map<InterbtcPrimitivesVaultId, MonetaryAmount<Currency>>): BridgeVaultData[] =>
      [...map].map(([vaultId, amount], idx) => ({
        id: idx.toString(),
        vaultId,
        amount,
        collateralCurrency: getCurrencyFromIdPrimitive(vaultId.currencies.collateral)
      })),
    [getCurrencyFromIdPrimitive]
  );

  const getVaults = useCallback(async (): Promise<GetBridgeVaultData<T>> => {
    const isRedeem = action === GetVaultType.REDEEM;
    const map = await (isRedeem
      ? window.bridge.vaults.getVaultsWithRedeemableTokens()
      : window.bridge.vaults.getVaultsWithIssuableTokens());

    const list = composeVaultData(map);

    switch (action) {
      case GetVaultType.REDEEM: {
        const premiumVaultsMap = await getPremiumRedeemVaults();
        const premiumVaultsList = composeVaultData(premiumVaultsMap);

        const data: GetBridgeVaultData<GetVaultType.REDEEM> = {
          list,
          map,
          premium: {
            map: premiumVaultsMap,
            list: premiumVaultsList
          }
        };

        return data as GetBridgeVaultData<T>;
      }
      default:
      case GetVaultType.ISSUE:
        return {
          list,
          map
        } as GetBridgeVaultData<T>;
    }
  }, [action, composeVaultData]);

  const { data, error, refetch } = useQuery({
    queryKey: ['vaults', action],
    queryFn: getVaults,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL,
    enabled: !isLoadingCurrencies,
    ...options
  });

  const getAvailableVaults = useCallback(
    (requiredCapacity: MonetaryAmount<Currency>, onlyPremiumVaults?: boolean | never) => {
      const list = onlyPremiumVaults ? data?.premium.list : data?.list;

      return list
        ?.filter((vault) => vault.amount.gte(requiredCapacity))
        .sort((vaultA, vaultB) => {
          const vaultAId = vaultA.vaultId.accountId.toString();
          const vaultBId = vaultB.vaultId.accountId.toString();
          return vaultAId < vaultBId ? -1 : vaultAId > vaultBId ? 1 : 0;
        });
    },
    [data]
  );

  useErrorHandler(error);

  return {
    data,
    refetch,
    getAvailableVaults
  };
};

export { GetVaultType, useGetVaults };
export type { BridgeVaultData, GetBridgeVaultData, UseGetBridgeVaultResult };
