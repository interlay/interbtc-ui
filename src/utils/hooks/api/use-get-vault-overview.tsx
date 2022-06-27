import { useQueries, UseQueryResult } from 'react-query';
import { useSelector } from 'react-redux';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';
import {
  CollateralIdLiteral,
  tickerToCurrencyIdLiteral,
  newAccountId,
  VaultExt,
  CurrencyIdLiteral,
  WrappedIdLiteral,
  CollateralCurrency,
  GovernanceIdLiteral,
  CollateralUnit
} from '@interlay/interbtc-api';
import { BitcoinUnit, MonetaryAmount, Currency } from '@interlay/monetary-js';

import { HYDRA_URL } from '../../../constants';
import issueCountQuery from 'services/queries/issue-count-query';
import { useGetVaults } from 'utils/hooks/api/use-get-vaults';
import { Prices, StoreType } from 'common/types/util.types';
import { VAULT_GOVERNANCE, VAULT_WRAPPED } from 'config/vaults';
import { getUsdAmount } from 'common/utils/utils';
import { GovernanceTokenMonetaryAmount, WrappedTokenAmount } from 'config/relay-chains';

const getCollateralPrice = (prices: Prices, tokenIdLiteral: CollateralIdLiteral) => {
  switch (tokenIdLiteral) {
    case CurrencyIdLiteral.DOT:
      return prices.polkadot;
    case CurrencyIdLiteral.INTR:
      return prices.interlay;
    case CurrencyIdLiteral.KSM:
      return prices.kusama;
    case CurrencyIdLiteral.KINT:
      return prices.kintsugi;
    default:
      return undefined;
  }
}

interface VaultData {
  apy: Big;
  collateralization: Big | undefined;
  issues: number;
  collateralId: CurrencyIdLiteral;
  wrappedId: CurrencyIdLiteral;
  collateral: {
    raw: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>;
    usd: number;
  },
  governanceTokenRewards: {
    raw: GovernanceTokenMonetaryAmount;
    usd: number;
  }
  wrappedTokenRewards: {
    raw: WrappedTokenAmount;
    usd: number;
  }
  vaultAtRisk: boolean;
}

interface VaultOverview {
  vaults: Array<VaultData>;
  totalLockedCollateral: number;
  totalUsdRewards: number;
  totalAtRisk: number;
}

const getVaultTotals = (vaults: Array<VaultData>) => {
  return {
    totalLockedCollateral: vaults.reduce((a, b) => a + b.collateral.usd, 0),
    totalUsdRewards: vaults.reduce((a, b) => a + b.governanceTokenRewards.usd + b.wrappedTokenRewards.usd, 0),
    totalAtRisk: vaults.map((vault) => vault.vaultAtRisk).filter(Boolean).length
}}

const getVaultOverview = async (
  vault: VaultExt<BitcoinUnit>,
  accountId: AccountId,
  prices: Prices
): Promise<VaultData> => {
  const tokenIdLiteral = tickerToCurrencyIdLiteral(vault.backingCollateral.currency.ticker) as CollateralIdLiteral;
  const collateralPrice = getCollateralPrice(prices, tokenIdLiteral);

  const apy = await window.bridge.vaults.getAPY(accountId, tokenIdLiteral);
  const collateralization = await window.bridge.vaults.getVaultCollateralization(accountId, tokenIdLiteral);
  const governanceTokenRewards = await window.bridge.vaults.getGovernanceReward(accountId, tokenIdLiteral, VAULT_GOVERNANCE as GovernanceIdLiteral)
  const wrappedTokenRewards = await window.bridge.vaults.getWrappedReward(accountId, tokenIdLiteral, VAULT_WRAPPED as WrappedIdLiteral)
  const collateral = await window.bridge.vaults.getCollateral(accountId, tokenIdLiteral);
  const threshold = await window.bridge.vaults.getSecureCollateralThreshold(vault.backingCollateral.currency as CollateralCurrency);

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
    collateral: {
      raw: collateral,
      usd: parseFloat(getUsdAmount(collateral, collateralPrice?.usd))
    },
    governanceTokenRewards: {
      raw: governanceTokenRewards,
      usd: parseFloat(getUsdAmount(governanceTokenRewards, prices?.governanceToken?.usd)),
    },
    wrappedTokenRewards: {
      raw: wrappedTokenRewards,
      usd: parseFloat(getUsdAmount(wrappedTokenRewards, prices?.wrappedToken?.usd)),
    },
    vaultAtRisk: collateralization ? collateralization?.lt(threshold) : false
  };
};

const useGetVaultOverview = ({ address }: { address: string; }): VaultOverview => {
  // TODO: can we handle this check at the application level rather than in components and utilties?
  // https://www.notion.so/interlay/Handle-api-loaded-check-at-application-level-38fe5d146c8143a88cef2dde7b0e19d8
  const { bridgeLoaded, prices } = useSelector((state: StoreType) => state.general);
  const vaults = useGetVaults({ address });

  // TODO: updating react-query to > 3.28.0 will allow us to type this properly
  const vaultData: Array<any> = useQueries<Array<UseQueryResult<unknown, unknown>>>(
    vaults.map(vault => {
      return {
        queryKey: ['vaultsOverview', address, vault.backingCollateral.currency.ticker],
        queryFn: () => getVaultOverview(vault, newAccountId(window.bridge.api, address), prices),
        options: {
          enabled: !!bridgeLoaded
        }
      };
    })
  );

  const parsedVaults: Array<VaultData> = vaultData.map((data: any) => data.data).filter(data => data !== undefined);
  
  const { totalLockedCollateral, totalUsdRewards,totalAtRisk} = getVaultTotals(parsedVaults);

  return { vaults: parsedVaults, totalLockedCollateral, totalUsdRewards, totalAtRisk };
};

export { useGetVaultOverview };
