import { useQueries, UseQueryResult } from 'react-query';
import { AccountId } from '@polkadot/types/interfaces';
import { CurrencyIdLiteral, newAccountId, VaultExt } from '@interlay/interbtc-api';
import { BitcoinUnit } from '@interlay/monetary-js';

import { StoreType } from 'common/types/util.types';
import { VAULT_COLLATERAL } from 'config/vaults';
import { useSelector } from 'react-redux';

const getVaults = async (
  accountId: AccountId,
  token: CurrencyIdLiteral
) => await window.bridge.vaults.get(accountId, token);

// TODO: when introducing KINT support we should consider whether to parse the data from parallel
// queries immediately, or when all queries have completed.
const parseVaults = (vaults: Array<UseQueryResult<unknown, unknown>>): Array<VaultExt<BitcoinUnit>> =>
  vaults.filter(vault => !vault.isLoading && vault.isSuccess).map(vault => vault.data as VaultExt<BitcoinUnit>);

const useGetVaults = ({ address }: { address: string; }): Array<VaultExt<BitcoinUnit>> => {
  // TODO: can we handle this check at the application level rather than in components and utilties?
  // https://www.notion.so/interlay/Handle-api-loaded-check-at-application-level-38fe5d146c8143a88cef2dde7b0e19d8
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  // TODO: updating react-query to > 3.28.0 will allow us to type this properly
  const vaults = useQueries<Array<UseQueryResult<unknown, unknown>>>(
    VAULT_COLLATERAL.map(token => {
      return {
        queryKey: ['vaults', address, token],
        queryFn: () => getVaults(newAccountId(window.bridge.api, address), token),
        options: {
          enabled: !!bridgeLoaded
        }
      };
    })
  );

  return parseVaults(vaults);
};

export { useGetVaults };
