import { CollateralCurrencyExt, CollateralIdLiteral, VaultExt, WrappedIdLiteral } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';

import { Prices } from '@/common/types/util.types';
import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import {
  GOVERNANCE_TOKEN,
  GOVERNANCE_TOKEN_SYMBOL,
  GovernanceTokenMonetaryAmount,
  WRAPPED_TOKEN,
  WRAPPED_TOKEN_SYMBOL,
  WrappedTokenAmount
} from '@/config/relay-chains';
import { HYDRA_URL } from '@/constants';
import issueCountQuery from '@/services/queries/issue-count-query';
import redeemCountQuery from '@/services/queries/redeem-count-query';
import { getTokenPrice } from '@/utils/helpers/prices';

interface VaultData {
  apy: Big;
  collateralization: Big | undefined;
  issuableTokens: MonetaryAmount<CollateralCurrencyExt>;
  pendingRequests: number;
  collateralId: CollateralIdLiteral;
  wrappedId: WrappedIdLiteral;
  collateral: {
    raw: MonetaryAmount<CollateralCurrencyExt>;
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
  vaultStatus: number; // TODO: return string
  liquidationThreshold: Big;
  premiumRedeemThreshold: Big;
  secureThreshold: Big;
}

const getVaultData = async (vault: VaultExt, accountId: AccountId, prices: Prices | undefined): Promise<VaultData> => {
  const collateralTokenIdLiteral = vault.backingCollateral.currency.ticker as CollateralIdLiteral;
  const collateralTokenPrice = getTokenPrice(prices, collateralTokenIdLiteral);

  // TODO: api calls should be consolidated when vault data is available through GraphQL
  // or by extending the vaults.get (VaultExt) api call
  const vaultExt = await window.bridge.vaults.get(accountId, vault.backingCollateral.currency);

  const threshold = vaultExt.getSecureCollateralThreshold();

  const apy = await window.bridge.vaults.getAPY(accountId, vault.backingCollateral.currency);
  const collateralization = await window.bridge.vaults.getVaultCollateralization(
    accountId,
    vault.backingCollateral.currency
  );
  const issuableTokens = await window.bridge.vaults.getIssuableTokensFromVault(
    accountId,
    vault.backingCollateral.currency
  );
  const governanceTokenRewards = await window.bridge.vaults.getGovernanceReward(
    accountId,
    vault.backingCollateral.currency,
    GOVERNANCE_TOKEN
  );
  const wrappedTokenRewards = await window.bridge.vaults.getWrappedReward(
    accountId,
    vault.backingCollateral.currency,
    WRAPPED_TOKEN
  );
  const collateral = await window.bridge.vaults.getCollateral(accountId, vault.backingCollateral.currency);
  const liquidationThreshold = await window.bridge.vaults.getLiquidationCollateralThreshold(
    vault.backingCollateral.currency
  );
  const premiumRedeemThreshold = await window.bridge.vaults.getPremiumRedeemThreshold(vault.backingCollateral.currency);
  const secureThreshold = await window.bridge.vaults.getSecureCollateralThreshold(vault.backingCollateral.currency);

  const usdCollateral = convertMonetaryAmountToValueInUSD(collateral, collateralTokenPrice?.usd);
  const usdGovernanceTokenRewards = convertMonetaryAmountToValueInUSD(
    governanceTokenRewards,
    getTokenPrice(prices, GOVERNANCE_TOKEN_SYMBOL)?.usd
  );
  const usdWrappedTokenRewards = convertMonetaryAmountToValueInUSD(
    wrappedTokenRewards,
    getTokenPrice(prices, WRAPPED_TOKEN_SYMBOL)?.usd
  );

  // TODO: move issues and redeems to separate hook
  const issues = await fetch(HYDRA_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: issueCountQuery(
        `vault: {accountId_eq: "${accountId.toString()}", collateralToken: {token_eq: ${collateralTokenIdLiteral}}}, status_eq: Pending` // TODO: add condition for asset_eq when the page is refactored for accepting ForeignAsset currencies too (cf. e.g. issued graph in dashboard for example)
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
        `vault: {accountId_eq: "${accountId.toString()}", collateralToken: {token_eq: ${collateralTokenIdLiteral}}}, status_eq: Pending` // TODO: add asset_eq, see comment above
      )
    })
  });

  const issuesCount = await issues.json();
  const redeemsCount = await redeems.json();

  const pendingRequests = issuesCount.data.issuesConnection.totalCount + redeemsCount.data.redeemsConnection.totalCount;

  return {
    apy,
    collateralization,
    issuableTokens,
    pendingRequests,
    collateralId: collateralTokenIdLiteral,
    wrappedId: WRAPPED_TOKEN_SYMBOL,
    collateral: {
      raw: collateral,
      usd: usdCollateral ?? 0
    },
    governanceTokenRewards: {
      raw: governanceTokenRewards,
      usd: usdGovernanceTokenRewards ?? 0
    },
    wrappedTokenRewards: {
      raw: wrappedTokenRewards,
      usd: usdWrappedTokenRewards ?? 0
    },
    vaultAtRisk: collateralization ? collateralization?.lt(threshold) : false,
    vaultStatus: vaultExt.status,
    liquidationThreshold,
    premiumRedeemThreshold,
    secureThreshold
  };
};

export type { VaultData };
export { getVaultData };
