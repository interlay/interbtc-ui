import { CurrencyExt, LoanAsset, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { pickSmallerAmount } from '@/utils/helpers/currencies';

const getMaxLendableAmount = (
  assetBalance: MonetaryAmount<CurrencyExt> | undefined,
  asset: LoanAsset
): MonetaryAmount<CurrencyExt> => {
  if (assetBalance === undefined) {
    return newMonetaryAmount(0, asset.currency);
  }

  const { totalLiquidity, supplyCap, currency, totalBorrows } = asset;
  const amountInProtocol = totalLiquidity.sub(totalBorrows);
  const maximumAmountToSupply = supplyCap.sub(amountInProtocol);
  const maximumLendableAmount = pickSmallerAmount(assetBalance, maximumAmountToSupply);

  if (maximumLendableAmount.toBig().lte(0)) {
    return newMonetaryAmount(0, currency);
  }
  return maximumLendableAmount;
};

export { getMaxLendableAmount };
