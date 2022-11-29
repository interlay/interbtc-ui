import { borrow, repay } from './borrow';
import { lend, withdraw } from './lend';

const loans = {
  borrow,
  repay,
  lend,
  withdraw
};

export default loans;
export type { LoanBorrowSchemaParams, LoanRepaySchemaParams } from './borrow';
export type { LoanLendSchemaParams, LoanWithdrawSchemaParams } from './lend';
