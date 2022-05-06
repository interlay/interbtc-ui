import { useQueries, UseQueryResult } from 'react-query';
import { AccountId } from '@polkadot/types/interfaces';
import { CollateralIdLiteral } from '@interlay/interbtc-api';

import { COLLATERAL_TOKEN_ID_LITERAL } from 'utils/constants/currency';

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
const parseVaults = (vaults: Array<UseQueryResult<unknown, unknown>>) =>
  vaults.filter(vault => !vault.isLoading && vault.isSuccess).map(vault => vault.data);

const useGetVaults = ({ accountId }: { accountId: AccountId; }): any => {
  const vaults = useQueries<Array<any>>(
    vaultCollateralTokens.map(token => {
      return {
        queryKey: ['vaultCollateral', accountId, token],
        queryFn: () => getVaults(accountId, token)
      };
    })
  );

  console.log('vaults api response', vaults);

  return parseVaults(vaults);
};

export { useGetVaults };
