import { CurrencyExt, InterbtcPrimitivesVaultId } from '@interlay/interbtc-api';
import { Currency, MonetaryAmount } from '@interlay/monetary-js';
import { useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, UseQueryOptions } from 'react-query';

import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

import { useGetCurrencies } from '../use-get-currencies';

type BridgeAction = 'issue' | 'redeem';

type BridgeVaultData = {
  id: InterbtcPrimitivesVaultId;
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
  action: BridgeAction;
};

const useGetVaults = ({ action, ...options }: UseGetVaultsOptions): UseGetBridgeVaultResult => {
  const { getCurrencyFromIdPrimitive } = useGetCurrencies(true);

  const getVaults = useCallback(
    async (action: BridgeAction): Promise<GetBridgeVaultData> => {
      const raw = await (action === 'issue'
        ? window.bridge.vaults.getVaultsWithIssuableTokens()
        : window.bridge.vaults.getVaultsWithRedeemableTokens());

      const vaults: BridgeVaultData[] = [...raw].map(([vaultId, amount]) => ({
        id: vaultId,
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
          const vaultAId = vaultA.id.accountId.toString();
          const vaultBId = vaultB.id.accountId.toString();
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
