import { CollateralCurrencyExt, CurrencyIdLiteral } from '@interlay/interbtc-api';
import { Kusama } from '@interlay/monetary-js';
import Big from 'big.js';
import { useEffect, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQueries, UseQueryResult } from 'react-query';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';

import { useGetCollateralCurrencies } from './use-get-collateral-currencies';

type AvailableVaultData = {
  collateralCurrency: CollateralCurrencyExt;
  wrappedCurrency: CurrencyIdLiteral;
  secureCollateralThreshold: Big;
  minimumCollateral: Big;
};

const getAvailableVaults = async (collateralCurrency: CollateralCurrencyExt): Promise<AvailableVaultData> => {
  const secureCollateralThreshold = await window.bridge.vaults.getSecureCollateralThreshold(collateralCurrency);

  const minimumCollateral = await window.bridge.vaults.getMinimumCollateral(Kusama);

  return {
    collateralCurrency,
    wrappedCurrency: WRAPPED_TOKEN_SYMBOL,
    minimumCollateral,
    secureCollateralThreshold
  };
};

const useGetAvailableVaults = (): Array<AvailableVaultData> => {
  const [queriesComplete, setQueriesComplete] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<Error | undefined>(undefined);

  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const { data: collateralCurrencies = [], isSuccess: isGetCollateralCurrenciesSuccess } = useGetCollateralCurrencies(
    bridgeLoaded
  );

  useErrorHandler(queryError);

  // TODO: updating react-query to > 3.28.0 will allow us type this without `any`
  const availableVaults: Array<any> = useQueries<Array<UseQueryResult<AvailableVaultData, Error>>>(
    collateralCurrencies.map((token) => {
      return {
        queryKey: ['availableVaults', token],
        queryFn: async () => await getAvailableVaults(token),
        options: {
          enabled: !!bridgeLoaded && isGetCollateralCurrenciesSuccess
        }
      };
    })
  );

  useEffect(() => {
    if (!availableVaults || availableVaults.length === 0) return;

    for (const vault of availableVaults) {
      if (vault.error) {
        setQueryError(vault.error);

        return;
      }
    }

    const haveQueriesCompleted = availableVaults.every((vault) => !vault.isLoading && vault.isSuccess);
    setQueriesComplete(haveQueriesCompleted);
  }, [availableVaults]);

  return queriesComplete ? availableVaults.map((vault) => vault.data) : [];
};

export { useGetAvailableVaults };
export type { AvailableVaultData };
