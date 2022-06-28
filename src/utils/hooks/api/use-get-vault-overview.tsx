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

const getVaultTotals = (vaults: Array<VaultData>) => {
  return {
    totalLockedCollateral: vaults.reduce((a, b) => a + b.collateral.usd, 0),
    totalUsdRewards: vaults.reduce((a, b) => a + b.governanceTokenRewards.usd + b.wrappedTokenRewards.usd, 0),
    totalAtRisk: vaults.map((vault) => vault.vaultAtRisk).filter(Boolean).length
}}

const useGetVaultOverview = ({ address }: { address: string; }): VaultOverview => {
  const [queryError, setQueryError] = useState<Error | undefined>(undefined);
  const [parsedVaults, setParsedVaults] = useState<Array<VaultData> | undefined>(undefined);
  const [vaultTotals, setVaultTotals] = useState<VaultTotals | undefined>(undefined);

  const { bridgeLoaded, prices } = useSelector((state: StoreType) => state.general);
  const vaults = useGetVaults({ address });

  useErrorHandler(queryError);

  // TODO: updating react-query to > 3.28.0 will allow us to type this properly
  const vaultData: Array<any> = useQueries<Array<UseQueryResult<unknown, unknown>>>(
    vaults.map(vault => {
      return {
        queryKey: ['vaultsOverview', address, vault.backingCollateral.currency.ticker],
        queryFn: () => getVaultOverview(vault, newAccountId(window.bridge.api, address), prices),
        options: {
          enabled: !!bridgeLoaded
        }
      };
    })
  );

  useEffect(() => {
    if (!vaultData) return;

    for (const data of vaultData) {
      if (data.error) {
        setQueryError(data.error);

        return;
      }
    }

    const parsedVaults: Array<VaultData> = vaultData.map((data: any) => data.data).filter(data => data !== undefined);
    setParsedVaults(parsedVaults);
  }, [vaultData]);

  useEffect(() => {
    if (!parsedVaults) return;

    const vaultTotals = getVaultTotals(parsedVaults);
    setVaultTotals(vaultTotals);
  }, [parsedVaults]);

  return { vaults: parsedVaults, totals: vaultTotals };
};

export { useGetVaultOverview };
