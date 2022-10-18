import { borrow, repay } from './borrow';
import { lend, withdraw } from './lend';

const loans = {
  borrow,
  repay,
  lend,
  withdraw
};

export default loans;
export type { LoanBorrowValidationParams, LoanRepayValidationParams } from './borrow';
export type { LoanLendValidationParams, LoanWithdrawValidationParams } from './lend';
