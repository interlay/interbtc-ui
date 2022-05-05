import { useQueries, UseQueryResult } from 'react-query';
import { AccountId } from '@polkadot/types/interfaces';
import { CollateralIdLiteral, tickerToCurrencyIdLiteral } from '@interlay/interbtc-api';
// import { Kusama, Kintsugi } from '@interlay/monetary-js';
import { Kusama } from '@interlay/monetary-js';

// TODO: these need to be moved to config (not chain config) and specified at the chain level
const vaultCollateralTokens = [
  tickerToCurrencyIdLiteral(Kusama.ticker) as CollateralIdLiteral
  // tickerToCurrencyIdLiteral(Kintsugi.ticker) as CollateralIdLiteral
];

const getVaults = async (
  accountId: AccountId,
  token: CollateralIdLiteral
) => await window.bridge.vaults.get(accountId, token);

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
