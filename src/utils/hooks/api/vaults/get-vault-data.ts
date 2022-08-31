import {
  CollateralCurrencyExt,
  CollateralIdLiteral,
  VaultExt,
  VaultStatusExt,
  WrappedIdLiteral
} from '@interlay/interbtc-api';
import { BitcoinAmount, MonetaryAmount } from '@interlay/monetary-js';
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
import { ForeignAssetIdLiteral } from '@/types/currency';
import { getTokenPrice } from '@/utils/helpers/prices';

interface VaultData {
  apy: Big;
  collateralization: Big | undefined;
  issuableTokens: MonetaryAmount<CollateralCurrencyExt>;
  pendingRequests: number;
  collateralId: CollateralIdLiteral;
  wrappedId: WrappedIdLiteral;
  issuedTokens: {
    raw: BitcoinAmount;
    amount: Big;
    usd: number;
  };
  collateral: {
    raw: MonetaryAmount<CollateralCurrencyExt>;
    amount: Big;
    usd: number;
  };
  governanceTokenRewards: {
    raw: GovernanceTokenMonetaryAmount;
    amount: Big;
    usd: number;
  };
  wrappedTokenRewards: {
    raw: WrappedTokenAmount;
    amount: Big;
    usd: number;
  };
  vaultAtRisk: boolean;
  vaultStatus: VaultStatusExt;
  liquidationThreshold: Big;
  liquidationExchangeRate: Big | undefined;
  premiumRedeemThreshold: Big;
  secureThreshold: Big;
  remainingCapacity: {
    amount: MonetaryAmount<CollateralCurrencyExt>;
    percentage: number;
  };
}

const getVaultData = async (vault: VaultExt, accountId: AccountId, prices: Prices | undefined): Promise<VaultData> => {
  const collateralTokenIdLiteral = vault.backingCollateral.currency.ticker as CollateralIdLiteral;
  const collateralTokenPrice = getTokenPrice(prices, collateralTokenIdLiteral);
  const bitcoinPrice = getTokenPrice(prices, ForeignAssetIdLiteral.BTC);

  // TODO: api calls should be consolidated when vault data is available through GraphQL
  // or by extending the vaults.get (VaultExt) api call
  const vaultExt = await window.bridge.vaults.get(accountId, vault.backingCollateral.currency);
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
  const liquidationExchangeRate = await window.bridge.vaults.getExchangeRateForLiquidation(
    accountId,
    vault.backingCollateral.currency
  );
  const premiumRedeemThreshold = await window.bridge.vaults.getPremiumRedeemThreshold(vault.backingCollateral.currency);
  const secureThreshold = await window.bridge.vaults.getSecureCollateralThreshold(vault.backingCollateral.currency);

  const threshold = vaultExt.getSecureCollateralThreshold();
  const usdIssuedTokens = convertMonetaryAmountToValueInUSD(vaultExt.issuedTokens, bitcoinPrice?.usd);
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

  // Calculate remaning capacity
  const backedTokens = vaultExt.getBackedTokens();
  const divisor = issuableTokens.add(backedTokens).toBig();
  const remainingCapacity = issuableTokens.div(divisor);

  return {
    apy,
    collateralization,
    issuableTokens,
    issuedTokens: {
      raw: vaultExt.issuedTokens,
      amount: vaultExt.issuedTokens.toBig(),
      usd: usdIssuedTokens ?? 0
    },
    pendingRequests,
    collateralId: collateralTokenIdLiteral,
    wrappedId: WRAPPED_TOKEN_SYMBOL,
    collateral: {
      raw: collateral,
      amount: collateral.toBig(),
      usd: usdCollateral ?? 0
    },
    governanceTokenRewards: {
      raw: governanceTokenRewards,
      amount: governanceTokenRewards.toBig(),
      usd: usdGovernanceTokenRewards ?? 0
    },
    wrappedTokenRewards: {
      raw: wrappedTokenRewards,
      amount: wrappedTokenRewards.toBig(),
      usd: usdWrappedTokenRewards ?? 0
    },
    vaultAtRisk: collateralization ? collateralization?.lt(threshold) : false,
    vaultStatus: vaultExt.status,
    liquidationThreshold,
    liquidationExchangeRate,
    premiumRedeemThreshold,
    secureThreshold,
    remainingCapacity: {
      amount: issuableTokens,
      percentage: remainingCapacity.toBig().toNumber()
    }
  };
};

export type { VaultData };
export { getVaultData };
