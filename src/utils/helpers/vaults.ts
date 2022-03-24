
import Big from 'big.js';
import { TFunction } from 'react-i18next';
import {
  VaultExt,
  VaultStatusExt,
  CollateralUnit
} from '@interlay/interbtc-api';
import {
  Bitcoin,
  BitcoinAmount,
  BitcoinUnit,
  ExchangeRate,
  MonetaryAmount,
  Currency
} from '@interlay/monetary-js';

// ray test touch <<
type BTCToCollateralTokenRate =
  ExchangeRate<
    Bitcoin,
    BitcoinUnit,
    Currency<CollateralUnit>,
    CollateralUnit
  >;

const getCollateralization = (
  collateral: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>,
  tokens: BitcoinAmount,
  btcToCollateralTokenRate: BTCToCollateralTokenRate
): Big | undefined => {
  if (tokens.gt(BitcoinAmount.zero) && btcToCollateralTokenRate.toBig().gt(0)) {
    const tokensAsCollateral = btcToCollateralTokenRate.toCounter(tokens);
    return collateral.toBig().div(tokensAsCollateral.toBig()).mul(100);
  } else {
    return undefined;
  }
};

// TODO: it could be better to be a hook
const getVaultStatusLabel = (
  vaultExt: VaultExt<BitcoinUnit>,
  currentActiveBlockNumber: number,
  liquidationThreshold: Big,
  secureCollateralThreshold: Big,
  btcToCollateralTokenRate: BTCToCollateralTokenRate,
  t: TFunction
): string => {
  const vaultCollateral = vaultExt.backingCollateral;
  const settledTokens = vaultExt.issuedTokens;
  const settledCollateralization = getCollateralization(vaultCollateral, settledTokens, btcToCollateralTokenRate);

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
  // Should only display bannedUntil status if the bannedUntil block < current active block number
  // Otherwise, should not show this status.
  if (vaultExt.bannedUntil && currentActiveBlockNumber < vaultExt.bannedUntil) {
    statusLabel = t('dashboard.vault.banned_until', { blockHeight: vaultExt.bannedUntil });
  }
  if (vaultExt.status === VaultStatusExt.Inactive) {
    statusLabel = t('dashboard.vault.inactive');
  }
  if (vaultExt.status === VaultStatusExt.CommittedTheft) {
    statusLabel = t('dashboard.vault.theft');
  }
  if (vaultExt.status === VaultStatusExt.Liquidated) {
    statusLabel = t('dashboard.vault.liquidated');
  }

  return statusLabel;
};

export type {
  BTCToCollateralTokenRate
};

export {
  getCollateralization,
  getVaultStatusLabel
};
// ray test touch >>
