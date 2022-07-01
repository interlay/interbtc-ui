import { AccountId } from '@polkadot/types/interfaces';
import {
  CollateralIdLiteral,
  CurrencyIdLiteral,
  tickerToCurrencyIdLiteral,
  VaultExt,
  WrappedIdLiteral,
  CollateralCurrency,
  GovernanceIdLiteral
} from '@interlay/interbtc-api';
import { BitcoinUnit } from '@interlay/monetary-js';
import Big from 'big.js';

import { getUsdAmount } from 'common/utils/utils';
import { getCollateralPrice } from 'utils/helpers/prices';
import { Prices } from 'common/types/util.types';
import issueCountQuery from 'services/queries/issue-count-query';
import redeemCountQuery from 'services/queries/redeem-count-query';
import { VAULT_GOVERNANCE, VAULT_WRAPPED } from 'config/vaults';
import { GovernanceTokenMonetaryAmount, CollateralTokenMonetaryAmount, WrappedTokenAmount } from 'config/relay-chains';
import { HYDRA_URL } from '../../../constants';

interface VaultData {
  apy: Big;
  collateralization: Big | undefined;
  pendingRequests: number;
  collateralId: CurrencyIdLiteral;
  wrappedId: CurrencyIdLiteral;
  collateral: {
    raw: CollateralTokenMonetaryAmount;
    usd: number;
  };
  governanceTokenRewards: {
    raw: GovernanceTokenMonetaryAmount;
    usd: number;
  };
  wrappedTokenRewards: {
    raw: WrappedTokenAmount;
    usd: number;
  };
  vaultAtRisk: boolean;
}

const getVaultOverview = async (
  vault: VaultExt<BitcoinUnit>,
  accountId: AccountId,
  prices: Prices
): Promise<VaultData> => {
  const tokenIdLiteral = tickerToCurrencyIdLiteral(vault.backingCollateral.currency.ticker) as CollateralIdLiteral;
  const collateralPrice = getCollateralPrice(prices, tokenIdLiteral);

  // TODO: api calls should be consolidated when vault data is available through GraphQL
  const apy = await window.bridge.vaults.getAPY(accountId, tokenIdLiteral);
  const collateralization = await window.bridge.vaults.getVaultCollateralization(accountId, tokenIdLiteral);
  const governanceTokenRewards = await window.bridge.vaults.getGovernanceReward(
    accountId,
    tokenIdLiteral,
    VAULT_GOVERNANCE as GovernanceIdLiteral
  );
  const wrappedTokenRewards = await window.bridge.vaults.getWrappedReward(
    accountId,
    tokenIdLiteral,
    VAULT_WRAPPED as WrappedIdLiteral
  );
  const collateral = await window.bridge.vaults.getCollateral(accountId, tokenIdLiteral);
  const threshold = await window.bridge.vaults.getSecureCollateralThreshold(
    vault.backingCollateral.currency as CollateralCurrency
  );

  const usdCollateral = getUsdAmount(collateral, collateralPrice?.usd);
  const usdGovernanceTokenRewards = getUsdAmount(governanceTokenRewards, prices.governanceToken?.usd);
  const usdWrappedTokenRewards = getUsdAmount(wrappedTokenRewards, prices.wrappedToken?.usd);

  const issues = await fetch(HYDRA_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: issueCountQuery(
        `vault: {accountId_eq: "${accountId.toString()}", collateralToken_eq: ${tokenIdLiteral}}, status_eq: Pending`
      )
    })
  });

  const redeems = await fetch(HYDRA_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: redeemCountQuery(
        `vault: {accountId_eq: "${accountId.toString()}", collateralToken_eq: ${tokenIdLiteral}}, status_eq: Pending`
      )
    })
  });

  const issuesCount = await issues.json();
  const redeemsCount = await redeems.json();

  const pendingRequests = issuesCount.data.issuesConnection.totalCount + redeemsCount.data.redeemsConnection.totalCount;

  return {
    apy,
    collateralization,
    pendingRequests,
    collateralId: tokenIdLiteral,
    wrappedId: VAULT_WRAPPED,
    collateral: {
      raw: collateral,
      usd: usdCollateral === '—' ? 0 : parseFloat(usdCollateral)
    },
    governanceTokenRewards: {
      raw: governanceTokenRewards,
      usd: usdGovernanceTokenRewards === '—' ? 0 : parseFloat(usdGovernanceTokenRewards)
    },
    wrappedTokenRewards: {
      raw: wrappedTokenRewards,
      usd: usdWrappedTokenRewards === '—' ? 0 : parseFloat(usdWrappedTokenRewards)
    },
    vaultAtRisk: collateralization ? collateralization?.lt(threshold) : false
  };
};

export type { VaultData };
export { getVaultOverview };
