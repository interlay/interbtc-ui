import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useQueries, UseQueryResult } from 'react-query';
import { useErrorHandler } from 'react-error-boundary';
import {
  newAccountId
} from '@interlay/interbtc-api';

import { useGetVaults } from 'utils/hooks/api/use-get-vaults';
import { StoreType } from 'common/types/util.types';

import { getVaultOverview, VaultData} from './get-vault-overview';

type VaultTotals = {
  totalLockedCollateral: number;
  totalUsdRewards: number;
  totalAtRisk: number;
}

interface VaultOverview {
  vaults: Array<VaultData> | undefined;
  totals: VaultTotals | undefined;
}

const getVaultTotals = (vaults: Array<VaultData>) => ({
    totalLockedCollateral: vaults.reduce((a, b) => a + b.collateral.usd, 0),
    totalUsdRewards: vaults.reduce((a, b) => a + b.governanceTokenRewards.usd + b.wrappedTokenRewards.usd, 0),
    totalAtRisk: vaults.map((vault) => vault.vaultAtRisk).filter(Boolean).length
});

const useGetVaultOverview = ({ address }: { address: string; }): VaultOverview | undefined => {
  const [queriesComplete, setQueriesComplete] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<any | undefined>(undefined);

  const { prices } = useSelector((state: StoreType) => state.general);
  const vaults = useGetVaults({ address });
  useErrorHandler(queryError);

  const vaultData: Array<any> = useQueries<Array<UseQueryResult<unknown, unknown>>>(
    vaults.map(vault => {
      return {
        queryKey: ['vaultsOverview', address, vault?.collateralId],
        queryFn: () => getVaultOverview(vault, newAccountId(window.bridge.api, address), prices),
        options: {
          enabled: vault
        }
      };
    })
  );

  useEffect(() => {
    if (!vaultData || vaultData.length === 0) return;
    
    for (const vault of vaultData) {
      if (vault.error) {
        setQueryError(vault.error);

        return;
      }
    }

    const haveQueriesCompleted = vaultData.every(vault => vault && !vault.isLoading);
    setQueriesComplete(haveQueriesCompleted);
  }, [vaultData]);
  
  return queriesComplete ? { vaults: vaultData.map((data: any) => data.data).filter(data => data !== undefined), totals: getVaultTotals(vaultData.map(vault => vault.data)) } : undefined;
};

export { useGetVaultOverview };
