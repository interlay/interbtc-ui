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

// `getOrNull` returns null as a successful response if the vault does not exist
const getVaults = async (accountId: AccountId, token: CurrencyIdLiteral) =>
  await window.bridge.vaults.getOrNull(accountId, token);

const useGetVaults = ({ address }: { address: string }): VaultResponse => {
  const [queriesComplete, setQueriesComplete] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<Error | undefined>(undefined);

  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  useErrorHandler(queryError);

  // TODO: updating react-query to > 3.28.0 will allow us type this without `any`
  const vaults: Array<any> = useQueries<Array<UseQueryResult<VaultResponse, Error>>>(
    VAULT_COLLATERAL.map((token) => {
      console.log('address from get vaults hook', address);
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
    console.log('queriesComplete', queriesComplete);
  }, [queriesComplete]);

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
