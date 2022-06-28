import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useQueries, UseQueryResult } from 'react-query';
import { useErrorHandler } from 'react-error-boundary';
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
} from '@interlay/interbtc-api';
import { BitcoinUnit } from '@interlay/monetary-js';

import { HYDRA_URL } from '../../../constants';
import issueCountQuery from 'services/queries/issue-count-query';
import { useGetVaults } from 'utils/hooks/api/use-get-vaults';
import { Prices, StoreType } from 'common/types/util.types';
import { VAULT_GOVERNANCE, VAULT_WRAPPED } from 'config/vaults';
import { getUsdAmount } from 'common/utils/utils';
import { getCollateralPrice } from 'utils/helpers/prices';
import { GovernanceTokenMonetaryAmount, CollateralTokenMonetaryAmount, WrappedTokenAmount } from 'config/relay-chains';

type VaultTotals = {
  totalLockedCollateral: number;
  totalUsdRewards: number;
  totalAtRisk: number;
}

interface VaultData {
  apy: Big;
  collateralization: Big | undefined;
  issues: number;
  collateralId: CurrencyIdLiteral;
  wrappedId: CurrencyIdLiteral;
  collateral: {
    raw: CollateralTokenMonetaryAmount;
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
  vaults: Array<VaultData> | undefined;
  totals: VaultTotals | undefined;
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
  const [queryError, setQueryError] = useState<any>(undefined);
  const [parsedVaults, setParsedVaults] = useState<Array<VaultData> | undefined>(undefined);
  const [vaultTotals, setVaultTotals] = useState<VaultTotals | undefined>(undefined);

  const { bridgeLoaded, prices } = useSelector((state: StoreType) => state.general);
  const vaults = useGetVaults({ address });

  useErrorHandler(queryError);

  // TODO: updating react-query to > 3.28.0 will allow us to type this properly
  const vaultData: Array<any> = useQueries<Array<UseQueryResult<unknown, unknown>>>(
    vaults.map(vault => {
      return {
        queryKey: ['vaultsOverview', address, vault.backingCollateral.currency.ticker],
        queryFn: () => getVaultOverview(vault, newAccountId(window.bridge.api, address), prices),
        options: {
          enabled: !!bridgeLoaded,
        }
      };
    })
  );

  useEffect(() => {
    if (!vaultData) return;

    for (const data of vaultData) {
      if (data.error) {
        setQueryError(data.error);

        return;
      }
    }

    const parsedVaults: Array<VaultData> = vaultData.map((data: any) => data.data).filter(data => data !== undefined);
    setParsedVaults(parsedVaults);
  }, [vaultData]);

  useEffect(() => {
    if (!parsedVaults) return;

    const vaultTotals = getVaultTotals(parsedVaults);
    setVaultTotals(vaultTotals);
  }, [parsedVaults]);

  return { vaults: parsedVaults, totals: vaultTotals };
};

export { useGetVaultOverview };
