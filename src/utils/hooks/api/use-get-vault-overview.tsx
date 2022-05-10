import { useQueries } from 'react-query';
import { AccountId } from '@polkadot/types/interfaces';
import { CollateralIdLiteral, VaultExt, tickerToCurrencyIdLiteral } from '@interlay/interbtc-api';
import { BitcoinUnit } from '@interlay/monetary-js';

import { HYDRA_URL } from '../../../constants';
import issueCountQuery from 'services/queries/issue-count-query';
import { useGetVaults } from 'utils/hooks/api/use-get-vaults';

interface VaultOverview {
  apy: string;
  collateralization: string | undefined;
  issues: number;
  collateralToken: CollateralIdLiteral;
}

const getVaultOverview = async (
  accountId: AccountId,
  token: CollateralIdLiteral
): Promise<VaultOverview> => {
  const apy = await window.bridge.vaults.getAPY(accountId, token);
  const collateralization = await window.bridge.vaults.getVaultCollateralization(accountId, token);

  const issues = await fetch(HYDRA_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: issueCountQuery(`userParachainAddress_eq: "${accountId}"`)
    })
  });

  const issuesCount = await issues.json();

  return {
    apy: apy.toString(),
    collateralization: collateralization?.toString(),
    issues: issuesCount.data.issuesConnection.totalCount,
    collateralToken: token
  };
};

const useGetVaultOverview = ({ accountId }: { accountId: AccountId; }): Array<VaultOverview> => {
  const vaults: Array<VaultExt<BitcoinUnit>> = useGetVaults({ accountId });

  const vaultData: Array<any> = useQueries<Array<any>>(
    vaults.map(vault => {
      const token = tickerToCurrencyIdLiteral(vault.backingCollateral.currency.ticker) as CollateralIdLiteral;
      return {
        queryKey: ['vaultData', accountId, token],
        queryFn: () => getVaultOverview(accountId, token)
      };
    })
  );

  return vaultData.map((data: any) => data.data);
};

export { useGetVaultOverview };
