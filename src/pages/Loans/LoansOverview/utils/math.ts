import Big from 'big.js';

import { LoanAction } from '@/types/loans';

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

export { calculateBorrowedAmountUSD, calculateCollateralAmountUSD, calculateCollateralUSD };
