import { useQueries } from 'react-query';
import { AccountId } from '@polkadot/types/interfaces';
import { CollateralIdLiteral, VaultExt, tickerToCurrencyIdLiteral, newAccountId } from '@interlay/interbtc-api';
import { BitcoinUnit } from '@interlay/monetary-js';

import { HYDRA_URL } from '../../../constants';
import issueCountQuery from 'services/queries/issue-count-query';
import { useGetVaults } from 'utils/hooks/api/use-get-vaults';
import { StoreType } from 'common/types/util.types';
import { useSelector } from 'react-redux';

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

const useGetVaultOverview = ({ address }: { address: string; }): Array<VaultOverview> => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const vaults: Array<VaultExt<BitcoinUnit>> = useGetVaults({ address });

  const vaultData: Array<any> = useQueries<Array<any>>(
    vaults.map(vault => {
      const token = tickerToCurrencyIdLiteral(vault.backingCollateral.currency.ticker) as CollateralIdLiteral;
      return {
        queryKey: ['vaultData', address, token],
        queryFn: () => getVaultOverview(newAccountId(window.bridge.api, address), token),
        options: {
          enabled: !!bridgeLoaded
        }
      };
    })
  );

  return vaultData.map((data: any) => data.data).filter(data => data !== undefined);
};

export { useGetVaultOverview };
