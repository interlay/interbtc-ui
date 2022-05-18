import { useQueries, UseQueryResult } from 'react-query';
import { AccountId } from '@polkadot/types/interfaces';
import {
  CollateralIdLiteral,
  tickerToCurrencyIdLiteral,
  newAccountId,
  VaultExt,
  CurrencyIdLiteral
} from '@interlay/interbtc-api';
import { BitcoinUnit } from '@interlay/monetary-js';

import { currencyIdToCurrencyPair, CurrencyPair } from 'utils/helpers/currency-id-to-currency-pair';
import { HYDRA_URL } from '../../../constants';
import issueCountQuery from 'services/queries/issue-count-query';
import { useGetVaults } from 'utils/hooks/api/use-get-vaults';
import { StoreType } from 'common/types/util.types';
import { useSelector } from 'react-redux';

interface VaultOverview {
  apy: string;
  collateralization: string | undefined;
  issues: number;
  collateral: CurrencyPair | undefined;
  wrapped: CurrencyPair | undefined;
}

const getVaultOverview = async (
  vault: VaultExt<BitcoinUnit>,
  accountId: AccountId
): Promise<VaultOverview> => {
  const token = tickerToCurrencyIdLiteral(vault.backingCollateral.currency.ticker) as CollateralIdLiteral;

  const apy = await window.bridge.vaults.getAPY(accountId, token);
  const collateralization = await window.bridge.vaults.getVaultCollateralization(accountId, token);

  const issues = await fetch(HYDRA_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: issueCountQuery(`vault: {accountId_eq: "${accountId.toString()}"}, status_eq: Pending`)
    })
  });

  const issuesCount = await issues.json();

  return {
    apy: apy.toString(),
    collateralization: collateralization?.mul(100).toString(),
    issues: issuesCount.data.issuesConnection.totalCount,
    collateral: currencyIdToCurrencyPair(token),
    wrapped: currencyIdToCurrencyPair(CurrencyIdLiteral.KBTC)
  };
};

const useGetVaultOverview = ({ address }: { address: string; }): Array<VaultOverview> => {
  // TODO: can we handle this check at the application level rather than in components and utilties?
  // https://www.notion.so/interlay/Handle-api-loaded-check-at-application-level-38fe5d146c8143a88cef2dde7b0e19d8
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const vaults = useGetVaults({ address });

  // TODO: updating react-query to > 3.28.0 will allow us to type this properly
  const vaultData: Array<any> = useQueries<Array<UseQueryResult<unknown, unknown>>>(
    vaults.map(vault => {
      return {
        queryKey: ['vaultsOverview', address, vault.backingCollateral.currency.ticker],
        queryFn: () => getVaultOverview(vault, newAccountId(window.bridge.api, address)),
        options: {
          enabled: !!bridgeLoaded
        }
      };
    })
  );

  return vaultData.map((data: any) => data.data).filter(data => data !== undefined);
};

export { useGetVaultOverview };
