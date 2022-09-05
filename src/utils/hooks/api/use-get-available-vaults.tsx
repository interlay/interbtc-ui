import { CollateralIdLiteral, CurrencyIdLiteral } from '@interlay/interbtc-api';
import { Kusama } from '@interlay/monetary-js';
import Big from 'big.js';
import { useEffect, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQueries, UseQueryResult } from 'react-query';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import { VAULT_COLLATERAL_TOKENS } from '@/config/vaults';
import { getCurrency } from '@/utils/helpers/currencies';

type AvailableVaultData = {
  collateralCurrency: CollateralIdLiteral;
  wrappedCurrency: CurrencyIdLiteral;
  secureCollateralThreshold: Big;
  minimumCollateral: Big;
};

const getAvailableVaults = async (collateralIdLiteral: CollateralIdLiteral): Promise<AvailableVaultData> => {
  const currency = getCurrency(collateralIdLiteral);

  const secureCollateralThreshold = await window.bridge.vaults.getSecureCollateralThreshold(currency);

  const minimumCollateral = await window.bridge.vaults.getMinimumCollateral(Kusama);

  return {
    collateralCurrency: collateralIdLiteral,
    wrappedCurrency: WRAPPED_TOKEN_SYMBOL,
    minimumCollateral,
    secureCollateralThreshold
  };
};

const useGetAvailableVaults = (): Array<AvailableVaultData> => {
  const [queriesComplete, setQueriesComplete] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<Error | undefined>(undefined);

  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  useErrorHandler(queryError);

  // TODO: updating react-query to > 3.28.0 will allow us type this without `any`
  const availableVaults: Array<any> = useQueries<Array<UseQueryResult<AvailableVaultData, Error>>>(
    VAULT_COLLATERAL_TOKENS.map((token) => {
      return {
        queryKey: ['availableVaults', token],
        queryFn: async () => await getAvailableVaults((token.ticker as unknown) as CollateralIdLiteral),
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

  return queriesComplete ? availableVaults.map((vault) => vault.data) : [];
};

export { useGetAvailableVaults };
export type { AvailableVaultData };
