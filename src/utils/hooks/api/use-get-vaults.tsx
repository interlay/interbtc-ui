import { useQueries, UseQueryResult } from 'react-query';
import { AccountId } from '@polkadot/types/interfaces';
import { CollateralIdLiteral, GovernanceIdLiteral } from '@interlay/interbtc-api';

// TODO: these shouldn't be used, and should be replaced with a single
// vault collateral array
import {
  COLLATERAL_TOKEN_ID_LITERAL,
  GOVERNANCE_TOKEN_ID_LITERAL
} from 'utils/constants/currency';

const vaultCollateralTokens = [COLLATERAL_TOKEN_ID_LITERAL, GOVERNANCE_TOKEN_ID_LITERAL];

const getVaults = async (
  accountId: AccountId,
  token: CollateralIdLiteral | GovernanceIdLiteral
) => await window.bridge.vaults.get(accountId, token);

// TODO: do we need to parse data after all queries returned, rather than
// in parallel?
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

  return parseVaults(vaults);
};

export { useGetVaults };
