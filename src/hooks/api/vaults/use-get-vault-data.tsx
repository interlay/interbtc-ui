import { newAccountId } from '@interlay/interbtc-api';
import { useEffect, useState } from 'react';
// import { useErrorHandler } from 'react-error-boundary';
import { useQueries, UseQueryResult } from 'react-query';

import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { useGetVaults } from '@/utils/hooks/api/vaults/use-get-vaults';

import { getVaultData, VaultData } from './get-vault-data';

type VaultTotals = {
  totalLockedCollateral: number;
  totalUsdRewards: number;
  totalAtRisk: number;
};

interface VaultOverview {
  vaults: Array<VaultData> | undefined;
  totals: VaultTotals | undefined;
}

const getVaultTotals = (vaults: Array<VaultData>) => ({
  totalLockedCollateral: vaults.reduce((total, vault) => total + vault.collateral.usd, 0),
  totalUsdRewards: vaults.reduce(
    (total, vault) => total + vault.governanceTokenRewards.usd + vault.wrappedTokenRewards.usd,
    0
  ),
  totalAtRisk: vaults.reduce((total, vault) => (vault.vaultAtRisk ? total + 1 : total), 0)
});

const useGetVaultData = ({ address }: { address: string }): VaultOverview | undefined => {
  const [queriesComplete, setQueriesComplete] = useState<boolean>(false);
  // const [queryError, setQueryError] = useState<Error | undefined>(undefined);

  const prices = useGetPrices();

  const vaultsResponseData = useGetVaults({ address });
  // useErrorHandler(queryError);

  // TODO: updating react-query to > 3.28.0 will allow us type this without `any`
  const vaultData: Array<any> = useQueries<Array<UseQueryResult<VaultOverview, Error>>>(
    vaultsResponseData
      .filter((vault) => vault !== undefined)
      .map((vault) => {
        return {
          queryKey: ['vaultsOverview', address, vault.backingCollateral.currency.ticker],
          queryFn: () => getVaultData(vault, newAccountId(window.bridge.api, address), prices)
        };
      })
  );

  useEffect(() => {
    if (!vaultData || vaultData.length === 0) return;
    // TODO: This is a hotfix to prevent one erroring vault from preventing
    // all vaults being shown and should be removed as soon as possible.

    // for (const vault of vaultData) {
    //   if (vault.error) {
    //     setQueryError(vault.error);

    //     return;
    //   }
    // }

    // Only render vaults which are not in an error state
    const filteredVaultData = vaultData.filter((vault) => !vault.error);

    const haveQueriesCompleted = filteredVaultData.every((vault) => vault && !vault.isLoading);
    setQueriesComplete(haveQueriesCompleted);
  }, [vaultData]);

  return queriesComplete
    ? {
        vaults: vaultData.map((data: any) => data.data).filter((data) => data !== undefined),
        totals: getVaultTotals(vaultData.filter((vault) => vault.data !== undefined).map((vault) => vault.data))
      }
    : undefined;
};

export { useGetVaultData };
