import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';

import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import { LoanAction } from '@/types/loans';
import { getTokenPrice } from '@/utils/helpers/prices';
import { Prices } from '@/utils/hooks/api/use-get-prices';

const calculateCollateralUSD = (amountUSD: Big, collateralThreshold: Big): Big => amountUSD.mul(collateralThreshold);

const calculateBorrowedAmountUSD = (
  loanAction: LoanAction,
  currentBorrowedAmountUSD: Big,
  actionAmountUSD: Big
): Big => {
  switch (loanAction) {
    case 'borrow':
      return currentBorrowedAmountUSD.add(actionAmountUSD);
    case 'repay':
      return currentBorrowedAmountUSD.sub(actionAmountUSD);
    default:
      return currentBorrowedAmountUSD;
  }
};

const calculateCollateralAmountUSD = (
  loanAction: LoanAction,
  currentCollateralAmountUSD: Big,
  actionAmountUSD: Big
): Big => {
  switch (loanAction) {
    case 'lend':
      return currentCollateralAmountUSD.add(actionAmountUSD);
    case 'withdraw':
      return currentCollateralAmountUSD.sub(actionAmountUSD);
    default:
      return currentCollateralAmountUSD;
  }
};

const calcutateCollateralBorrowedAmountUSD = (
  actionType: LoanAction,
  prices: Prices,
  borrowedAssetsUSD: Big,
  collateralAssetsUSD: Big,
  amount: MonetaryAmount<CurrencyExt>,
  collateralThreshold: Big
): { totalBorrowedAmountUSD: Big; collateralAssetsUSD: Big } => {
  const {
    currency: { ticker }
  } = amount;

  const currencyPrice = getTokenPrice(prices, ticker)?.usd;
  const actionAmountUSD = Big(convertMonetaryAmountToValueInUSD(amount, currencyPrice) || 0);

  const newTotalBorrowedAmountUSD = calculateBorrowedAmountUSD(actionType, borrowedAssetsUSD, actionAmountUSD);

  const assetMinCollateralUSD = calculateCollateralUSD(actionAmountUSD, collateralThreshold);
  const newCollateralAssetsUSD = calculateCollateralAmountUSD(actionType, collateralAssetsUSD, assetMinCollateralUSD);

  return {
    totalBorrowedAmountUSD: newTotalBorrowedAmountUSD,
    collateralAssetsUSD: newCollateralAssetsUSD
  };
};

export {
  calculateBorrowedAmountUSD,
  calculateCollateralAmountUSD,
  calculateCollateralUSD,
  calcutateCollateralBorrowedAmountUSD
};
