import { useEffect, useState } from 'react';
import { useQueries, UseQueryResult } from 'react-query';
import { useErrorHandler } from 'react-error-boundary';
import { AccountId } from '@polkadot/types/interfaces';
import { CurrencyIdLiteral, newAccountId, VaultExt } from '@interlay/interbtc-api';
import { BitcoinUnit } from '@interlay/monetary-js';

import { StoreType } from 'common/types/util.types';
import { VAULT_COLLATERAL } from 'config/vaults';
import { useSelector } from 'react-redux';

type VaultResponse = Array<VaultExt<BitcoinUnit>>;

const getVaults = async (accountId: AccountId, token: CurrencyIdLiteral) =>
  await window.bridge.vaults.get(accountId, token);

const useGetVaults = ({ address }: { address: string }): VaultResponse => {
  const [queriesComplete, setQueriesComplete] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<Error | undefined>(undefined);

  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  useErrorHandler(queryError);

  // TODO: upgrade react-query to handle instances of casting
  const vaults = useQueries<Array<UseQueryResult<VaultResponse, Error>>>(
    VAULT_COLLATERAL.map((token) => {
      return {
        queryKey: ['vaults', address, token],
        queryFn: async () => await getVaults(newAccountId(window.bridge.api, address), token),
        options: {
          enabled: !!bridgeLoaded
        }
      };
    })
  );

  useEffect(() => {
    if (!vaults || vaults.length === 0) return;

    for (const vault of vaults) {
      if (vault.error) {
        setQueryError(vault.error as Error);

        return;
      }
    }

    const haveQueriesCompleted = vaults.every((vault) => !vault.isLoading && vault.isSuccess);
    setQueriesComplete(haveQueriesCompleted);
  }, [vaults]);

  // TODO: casting can be removed after react-query update
  return queriesComplete ? (vaults.map((vault) => vault.data) as VaultResponse) : [];
};

export { useGetVaults };
