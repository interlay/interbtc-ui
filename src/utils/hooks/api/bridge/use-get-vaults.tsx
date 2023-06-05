import { InterbtcPrimitivesVaultId } from '@interlay/interbtc-api';
import { Currency, MonetaryAmount } from '@interlay/monetary-js';
import { useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, UseQueryOptions } from 'react-query';

import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

type BridgeAction = 'issue' | 'redeem';

type BridgeVaultData = {
  id: InterbtcPrimitivesVaultId;
  amount: MonetaryAmount<Currency>;
};

const getVaults = async (action: BridgeAction): Promise<BridgeVaultData[]> => {
  const vaults = await (action === 'issue'
    ? window.bridge.vaults.getVaultsWithIssuableTokens()
    : window.bridge.vaults.getVaultsWithRedeemableTokens());

  return [...vaults].map(([vaultId, amount]) => ({ id: vaultId, amount }));
};

type UseGetDustValueResult = {
  data: BridgeVaultData[] | undefined;
  getAvailableVaults: (requiredCapacity: MonetaryAmount<Currency>) => BridgeVaultData[] | undefined;
  refetch: () => void;
};

type UseGetVaultsOptions = UseQueryOptions<BridgeVaultData[], unknown, BridgeVaultData[], string[]> & {
  action: BridgeAction;
};

const useGetVaults = ({ action, ...options }: UseGetVaultsOptions): UseGetDustValueResult => {
  const { data, error, refetch } = useQuery({
    queryKey: ['vaults', action],
    queryFn: () => getVaults(action),
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL,
    ...options
  });

  const getAvailableVaults = useCallback(
    (requiredCapacity: MonetaryAmount<Currency>) =>
      data
        ?.filter((vault) => vault.amount.gte(requiredCapacity))
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
export type { BridgeVaultData, UseGetDustValueResult };
