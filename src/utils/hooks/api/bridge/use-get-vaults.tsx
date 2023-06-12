import { CurrencyExt, InterbtcPrimitivesVaultId } from '@interlay/interbtc-api';
import { Currency, MonetaryAmount } from '@interlay/monetary-js';
import { useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, UseQueryOptions } from 'react-query';

import { BridgeActions } from '@/types/bridge';
import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

import { useGetCurrencies } from '../use-get-currencies';

type BridgeVaultData = {
  id: number;
  vaultId: InterbtcPrimitivesVaultId;
  amount: MonetaryAmount<Currency>;
  collateralCurrency: CurrencyExt;
};

type GetBridgeVaultData = { vaults: BridgeVaultData[]; raw: Map<InterbtcPrimitivesVaultId, MonetaryAmount<Currency>> };

type UseGetBridgeVaultResult = {
  data: GetBridgeVaultData | undefined;
  getAvailableVaults: (requiredCapacity: MonetaryAmount<Currency>) => BridgeVaultData[] | undefined;
  refetch: () => void;
};

type UseGetVaultsOptions = UseQueryOptions<GetBridgeVaultData, unknown, GetBridgeVaultData, string[]> & {
  action: Exclude<BridgeActions, BridgeActions.BURN>;
};

const useGetVaults = ({ action, ...options }: UseGetVaultsOptions): UseGetBridgeVaultResult => {
  const { getCurrencyFromIdPrimitive } = useGetCurrencies(true);

  const getVaults = useCallback(
    async (action: Exclude<BridgeActions, BridgeActions.BURN>): Promise<GetBridgeVaultData> => {
      const raw = await (action === 'issue'
        ? window.bridge.vaults.getVaultsWithIssuableTokens()
        : window.bridge.vaults.getVaultsWithRedeemableTokens());

      const vaults: BridgeVaultData[] = [...raw].map(([vaultId, amount], idx) => ({
        id: idx,
        vaultId,
        amount,
        collateralCurrency: getCurrencyFromIdPrimitive(vaultId.currencies.collateral)
      }));

      return {
        vaults,
        raw
      };
    },
    [getCurrencyFromIdPrimitive]
  );

  const { data, error, refetch } = useQuery({
    queryKey: ['vaults', action],
    queryFn: () => getVaults(action),
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL,
    ...options
  });

  const getAvailableVaults = useCallback(
    (requiredCapacity: MonetaryAmount<Currency>) =>
      data?.vaults
        .filter((vault) => vault.amount.gte(requiredCapacity))
        .sort((vaultA, vaultB) => {
          const vaultAId = vaultA.vaultId.accountId.toString();
          const vaultBId = vaultB.vaultId.accountId.toString();
          return vaultAId < vaultBId ? -1 : vaultAId > vaultBId ? 1 : 0;
        }),
    [data]
  );

  useErrorHandler(error);

  return {
    data,
    refetch,
    getAvailableVaults
  };
};

export { useGetVaults };
export type { BridgeVaultData, UseGetBridgeVaultResult };
