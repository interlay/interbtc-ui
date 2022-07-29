import { CollateralCurrencyExt, VaultExt, VaultStatusExt } from '@interlay/interbtc-api';
import { BitcoinAmount, MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { TFunction } from 'react-i18next';

import { BTCToCollateralTokenRate } from '@/types/currency';

const getCollateralization = (
  collateral: MonetaryAmount<CollateralCurrencyExt>,
  tokens: BitcoinAmount,
  btcToCollateralTokenRate: BTCToCollateralTokenRate
): Big | undefined => {
  if (tokens.gt(BitcoinAmount.zero()) && btcToCollateralTokenRate.toBig().gt(0)) {
    const tokensAsCollateral = btcToCollateralTokenRate.toCounter(tokens);
    return collateral.toBig().div(tokensAsCollateral.toBig()).mul(100);
  } else {
    return undefined;
  }
};

const getVaultStatusLabel = (
  vaultExt: VaultExt,
  currentActiveBlockNumber: number,
  liquidationThreshold: Big,
  secureCollateralThreshold: Big,
  btcToCollateralTokenRate: BTCToCollateralTokenRate,
  t: TFunction
): string => {
  const settledCollateralization = getCollateralization(
    vaultExt.backingCollateral,
    vaultExt.issuedTokens,
    btcToCollateralTokenRate
  );

  // Default to active
  let statusLabel = t('dashboard.vault.active');
  if (settledCollateralization) {
    if (settledCollateralization.lt(liquidationThreshold)) {
      statusLabel = t('dashboard.vault.liquidation');
    }
    if (settledCollateralization.lt(secureCollateralThreshold)) {
      statusLabel = t('dashboard.vault.undercollateralized');
    }
  }
  // Should only display bannedUntil status if current active block number < the bannedUntil block number.
  // Otherwise, should not show this status.
  if (vaultExt.bannedUntil && currentActiveBlockNumber < vaultExt.bannedUntil) {
    statusLabel = t('dashboard.vault.banned_until', { blockHeight: vaultExt.bannedUntil });
  }
  if (vaultExt.status === VaultStatusExt.Inactive) {
    statusLabel = t('dashboard.vault.issuing_disabled');
  }
  if (vaultExt.status === VaultStatusExt.Liquidated) {
    statusLabel = t('dashboard.vault.liquidated');
  }

  return statusLabel;
};

export { getCollateralization, getVaultStatusLabel };
