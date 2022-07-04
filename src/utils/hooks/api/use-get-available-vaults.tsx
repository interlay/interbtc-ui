import { useEffect, useState } from 'react';
import { useQueries, UseQueryResult } from 'react-query';
import { useErrorHandler } from 'react-error-boundary';
import { CollateralCurrency, CollateralIdLiteral } from '@interlay/interbtc-api';

import { StoreType } from 'common/types/util.types';
import { VAULT_COLLATERAL } from 'config/vaults';
import { useSelector } from 'react-redux';
import { getCurrencies } from 'utils/helpers/currencies';
import Big from 'big.js';

type AvailableVault = {
  collateralIdLiteral: CollateralIdLiteral;
  secureCollateralThreshold: Big;
  minimumCollateral: Big;
};

const getAvailableVaults = async (collateralIdLiteral: CollateralIdLiteral): Promise<AvailableVault> => {
  const currency = getCurrencies(collateralIdLiteral);

  const secureCollateralThreshold = await window.bridge.vaults.getSecureCollateralThreshold(
    currency?.currency as CollateralCurrency
  );

  const minimumCollateral = await window.bridge.vaults.getMinimumCollateral(currency?.currency as CollateralCurrency);

  return {
    collateralIdLiteral,
    secureCollateralThreshold,
    minimumCollateral
  };
};

const useGetAvailableVaults = (): Array<AvailableVault> => {
  const [queriesComplete, setQueriesComplete] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<Error | undefined>(undefined);

  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  useErrorHandler(queryError);

  // TODO: updating react-query to > 3.28.0 will allow us type this without `any`
  const availableVaults: Array<any> = useQueries<Array<UseQueryResult<AvailableVault, Error>>>(
    VAULT_COLLATERAL.map((token) => {
      return {
        queryKey: ['availableVaults', token],
        queryFn: async () => await getAvailableVaults(token),
        options: {
          enabled: !!bridgeLoaded
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

  useEffect(() => {
    console.log(queriesComplete);
  }, [queriesComplete]);

  return queriesComplete ? availableVaults.map((vault) => vault.data) : [];
};

export { useGetAvailableVaults };
