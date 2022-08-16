import {
  CollateralCurrency,
  CollateralIdLiteral,
  CurrencyIdLiteral,
  tickerToCurrencyIdLiteral,
  VaultExt
} from '@interlay/interbtc-api';
import { BitcoinUnit } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';

import { Prices } from '@/common/types/util.types';
import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import {
  CollateralTokenMonetaryAmount,
  GOVERNANCE_TOKEN_SYMBOL,
  GovernanceTokenMonetaryAmount,
  WRAPPED_TOKEN_SYMBOL,
  WrappedTokenAmount
} from '@/config/relay-chains';
import { VAULT_GOVERNANCE, VAULT_WRAPPED } from '@/config/vaults';
import { HYDRA_URL } from '@/constants';
import issueCountQuery from '@/services/queries/issue-count-query';
import redeemCountQuery from '@/services/queries/redeem-count-query';
import { getTokenPrice } from '@/utils/helpers/prices';

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
  prices: Prices | undefined
): Promise<VaultData> => {
  const tokenIdLiteral = tickerToCurrencyIdLiteral(vault.backingCollateral.currency.ticker) as CollateralIdLiteral;
  const collateralPrice = getTokenPrice(prices, tokenIdLiteral);

  // TODO: api calls should be consolidated when vault data is available through GraphQL
  const apy = await window.bridge.vaults.getAPY(accountId, tokenIdLiteral);
  const collateralization = await window.bridge.vaults.getVaultCollateralization(accountId, tokenIdLiteral);
  const governanceTokenRewards = await window.bridge.vaults.getGovernanceReward(
    accountId,
    tokenIdLiteral,
    VAULT_GOVERNANCE
  );
  const wrappedTokenRewards = await window.bridge.vaults.getWrappedReward(accountId, tokenIdLiteral, VAULT_WRAPPED);
  const collateral = await window.bridge.vaults.getCollateral(accountId, tokenIdLiteral);
  const threshold = await window.bridge.vaults.getSecureCollateralThreshold(
    vault.backingCollateral.currency as CollateralCurrency
  );

  // ray test touch <
  const usdCollateral = convertMonetaryAmountToValueInUSD(collateral, collateralPrice?.usd);
  const usdGovernanceTokenRewards = convertMonetaryAmountToValueInUSD(
    governanceTokenRewards,
    getTokenPrice(prices, GOVERNANCE_TOKEN_SYMBOL)?.usd
  );
  const usdWrappedTokenRewards = convertMonetaryAmountToValueInUSD(
    wrappedTokenRewards,
    getTokenPrice(prices, WRAPPED_TOKEN_SYMBOL)?.usd
  );
  // ray test touch >

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
      // ray test touch <
      // usd: usdCollateral === '—' ? 0 : parseFloat(usdCollateral)
      usd: usdCollateral ?? 0
      // ray test touch >
    },
    governanceTokenRewards: {
      raw: governanceTokenRewards,
      // ray test touch <
      // usd: usdGovernanceTokenRewards === '—' ? 0 : parseFloat(usdGovernanceTokenRewards)
      usd: usdGovernanceTokenRewards ?? 0
      // ray test touch >
    },
    wrappedTokenRewards: {
      raw: wrappedTokenRewards,
      // ray test touch <
      // usd: usdWrappedTokenRewards === '—' ? 0 : parseFloat(usdWrappedTokenRewards)
      usd: usdWrappedTokenRewards ?? 0
      // ray test touch >
    },
    vaultAtRisk: collateralization ? collateralization?.lt(threshold) : false
  };
};

export type { VaultData };
export { getVaultOverview };
