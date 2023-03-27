import { CurrencyExt, LoanAsset, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

const getMaxLendableAmount = (asset: LoanAsset): MonetaryAmount<CurrencyExt> => {
  const { totalLiquidity, supplyCap, currency, totalBorrows } = asset;
  const amountInProtocol = totalLiquidity.sub(totalBorrows);
  const maximumAmountToSupply = supplyCap.sub(amountInProtocol);

  if (maximumAmountToSupply.toBig().lte(0)) {
    return newMonetaryAmount(0, currency);
  }
  return maximumAmountToSupply;
};

export { getMaxLendableAmount };
