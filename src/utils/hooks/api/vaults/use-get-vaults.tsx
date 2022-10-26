import { CollateralCurrencyExt, newAccountId, VaultExt } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';
import { useEffect, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQueries, UseQueryResult } from 'react-query';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';

import { useGetCollateralCurrencies } from '../use-get-collateral-currencies';

type VaultResponse = Array<VaultExt>;

// `getOrNull` returns null as a successful response if the vault does not exist
const getVaults = async (accountId: AccountId, collateralToken: CollateralCurrencyExt) =>
  // ray test touch <
  await window.bridge.vaults.getOrNull(accountId, collateralToken);
// ray test touch >

const useGetVaults = ({ address }: { address: string }): VaultResponse => {
  const [queriesComplete, setQueriesComplete] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<Error | undefined>(undefined);

  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const {
    data: collateralCurrencies,
    isSuccess: collateralCurrenciesSuccess,
    error: collateralCurrenciesError
  } = useGetCollateralCurrencies(bridgeLoaded);

  useErrorHandler(collateralCurrenciesError);
  useErrorHandler(queryError);

  // TODO: updating react-query to > 3.28.0 will allow us type this without `any`
  const vaults: Array<any> = useQueries<Array<UseQueryResult<VaultResponse, Error>>>(
    (collateralCurrencies || []).map((item) => {
      return {
        queryKey: ['vaults', address, item.ticker],
        // ray test touch <
        queryFn: async () => await getVaults(newAccountId(window.bridge.api, address), item),
        // ray test touch >
        options: {
          enabled: !!bridgeLoaded && collateralCurrenciesSuccess
        }
      };
    })
  );

  useEffect(() => {
    if (!vaults || vaults.length === 0) return;

    for (const vault of vaults) {
      if (vault.error) {
        setQueryError(vault.error);

        return;
      }
    }

    const haveQueriesCompleted = vaults.every((vault) => !vault.isLoading && vault.isSuccess);
    setQueriesComplete(haveQueriesCompleted);
  }, [vaults]);

  return queriesComplete ? vaults.filter((vault) => vault.data !== null).map((vault) => vault.data) : [];
};

export { useGetVaults };
