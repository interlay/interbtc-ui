import { useQueries, UseQueryResult } from 'react-query';
import { AccountId } from '@polkadot/types/interfaces';
import { CollateralIdLiteral, newAccountId, VaultExt } from '@interlay/interbtc-api';
import { BitcoinUnit } from '@interlay/monetary-js';

import { COLLATERAL_TOKEN_ID_LITERAL } from 'utils/constants/currency';
import { StoreType } from 'common/types/util.types';
import { useSelector } from 'react-redux';

// TODO: this needs to be moved to config (not relay chain config) when we
// introduce support for KINT.
const vaultCollateralTokens = [COLLATERAL_TOKEN_ID_LITERAL];

const getVaults = async (
  accountId: AccountId,
  token: CollateralIdLiteral
) => await window.bridge.vaults.get(accountId, token);

// TODO: when introducing KINT support we should consider whether
// to parse the data from parallel queries immediately, or when all
// queries have completed.
const parseVaults = (vaults: Array<UseQueryResult<unknown, unknown>>): Array<VaultExt<BitcoinUnit>> =>
  vaults.filter(vault => !vault.isLoading && vault.isSuccess).map(vault => vault.data as VaultExt<BitcoinUnit>);

const useGetVaults = ({ address }: { address: string; }): Array<VaultExt<BitcoinUnit>> => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  // TODO: updating react-query to > 3.28.0 will allow us to type this properly
  const vaults = useQueries<Array<UseQueryResult<unknown, unknown>>>(
    vaultCollateralTokens.map(token => {
      return {
        queryKey: ['vaultCollateral', address, token],
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
