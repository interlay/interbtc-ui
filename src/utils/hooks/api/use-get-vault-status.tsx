import { useEffect } from 'react';
import { useQueries } from 'react-query';
import { AccountId } from '@polkadot/types/interfaces';
import { CollateralIdLiteral, GovernanceIdLiteral, VaultExt, tickerToCurrencyIdLiteral } from '@interlay/interbtc-api';
import { BitcoinUnit } from '@interlay/monetary-js';

import { HYDRA_URL } from '../../../constants';
import issueCountQuery from 'services/queries/issue-count-query';
import { useGetVaults } from 'utils/hooks/api/use-get-vaults';

const getVaultData = async (
  accountId: AccountId,
  token: CollateralIdLiteral | GovernanceIdLiteral
) => {
  const apy = await window.bridge.vaults.getAPY(accountId, token);
  // const collateralization = await window.bridge.vaults.getVaultCollateralization(accountId, token);

  const issues = await fetch(HYDRA_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: issueCountQuery(`userParachainAddress_eq: "${accountId}"`)
    })
  });

  return { apy, issues };
};

const useGetVaultStatus = ({ accountId }: { accountId: AccountId; }): void => {
  const vaults: Array<VaultExt<BitcoinUnit>> = useGetVaults({ accountId });

  const vaultData: Array<any> = useQueries<Array<any>>(
    vaults.map(vault => {
      const token = tickerToCurrencyIdLiteral(vault.backingCollateral.currency.ticker) as any;
      return {
        queryKey: ['vaultData', accountId, token],
        queryFn: () => getVaultData(accountId, token)
      };
    })
  );

  useEffect(() => {
    console.log('vaultData', vaultData);
  }, [vaultData]);
};

export { useGetVaultStatus };
