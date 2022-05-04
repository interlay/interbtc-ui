import { useQueries } from 'react-query';
import { CollateralIdLiteral, GovernanceIdLiteral, newAccountId } from '@interlay/interbtc-api';

// TODO: these shouldn't be used, and should be replaced with a single
// vault collateral array
import {
  COLLATERAL_TOKEN_ID_LITERAL,
  GOVERNANCE_TOKEN_ID_LITERAL
} from 'utils/constants/currency';

const vaultCollateralTokens = [COLLATERAL_TOKEN_ID_LITERAL, GOVERNANCE_TOKEN_ID_LITERAL];

const getVaults = async (
  token: CollateralIdLiteral | GovernanceIdLiteral,
  address: string
) => await window.bridge.vaults.get(
  newAccountId(window.bridge.api, address),
  token
);

const useGetVaults = ({ address }: { address: string; }): any => {
  const vaults = useQueries<Array<any>>(
    vaultCollateralTokens.map(token => {
      return {
        queryKey: ['vaultCollateral', address, token],
        queryFn: () => getVaults(token, address)
      };
    })
  );

  return vaults;
};

export { useGetVaults };
