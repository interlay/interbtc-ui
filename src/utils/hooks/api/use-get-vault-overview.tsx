import { useQueries, UseQueryResult } from 'react-query';
import { useSelector } from 'react-redux';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';
import {
  CollateralIdLiteral,
  tickerToCurrencyIdLiteral,
  newAccountId,
  VaultExt,
  CurrencyIdLiteral
} from '@interlay/interbtc-api';
import { BitcoinUnit } from '@interlay/monetary-js';

import { HYDRA_URL } from '../../../constants';
import issueCountQuery from 'services/queries/issue-count-query';
import { useGetVaults } from 'utils/hooks/api/use-get-vaults';
import { StoreType } from 'common/types/util.types';
import { VAULT_WRAPPED } from 'config/vaults';

interface VaultData {
  apy: Big;
  collateralization: Big | undefined;
  issues: number;
  collateralId: CurrencyIdLiteral;
  wrappedId: CurrencyIdLiteral;
  lockedCollateral: number;
  usdRewards: number;
  vaultAtRisk: boolean;
}

interface VaultOverview {
  vaults: Array<VaultData>;
  totalLocked: number;
  totalUsdRewards: number;
  totalAtRisk: number;
}

const getVaultOverview = async (
  vault: VaultExt<BitcoinUnit>,
  accountId: AccountId
): Promise<VaultData> => {
  const tokenIdLiteral = tickerToCurrencyIdLiteral(vault.backingCollateral.currency.ticker) as CollateralIdLiteral;

  const apy = await window.bridge.vaults.getAPY(accountId, tokenIdLiteral);
  const collateralization = await window.bridge.vaults.getVaultCollateralization(accountId, tokenIdLiteral);

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
    apy,
    collateralization,
    issues: issuesCount.data.issuesConnection.totalCount,
    collateralId: tokenIdLiteral,
    wrappedId: VAULT_WRAPPED,
    lockedCollateral: 1324.24,
    usdRewards: 10.23,
    vaultAtRisk: true
  };
};

const useGetVaultOverview = ({ address }: { address: string; }): VaultOverview => {
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

  const parsedVaults: Array<VaultData> = vaultData.map((data: any) => data.data).filter(data => data !== undefined);
  
  const totalLocked = parsedVaults.reduce((a, b) => {
      return a + b.lockedCollateral;
    }, 0);

    const totalUsdRewards = parsedVaults.reduce((a, b) => {
      return a + b.usdRewards;
    }, 0);

    const totalAtRisk = parsedVaults.map((vault) => vault.vaultAtRisk).length;


  return { vaults: parsedVaults, totalLocked, totalUsdRewards, totalAtRisk };
};

export { useGetVaultOverview };
