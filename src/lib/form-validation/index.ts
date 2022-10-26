import loans from './loans';
import vaults from './vaults';

const validation = {
  vaults,
  loans
};

export type {
  LoanBorrowValidationParams,
  LoanLendValidationParams,
  LoanRepayValidationParams,
  LoanWithdrawValidationParams
} from './loans';
export type { VaultDepositValidationParams } from './vaults';
export default validation;
