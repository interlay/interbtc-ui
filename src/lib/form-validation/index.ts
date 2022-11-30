import loans from './loans';
import vaults from './vaults';

const validation = {
  vaults,
  loans
};

export type {
  LoanBorrowSchemaParams,
  LoanLendSchemaParams,
  LoanRepaySchemaParams,
  LoanWithdrawSchemaParams
} from './loans';
export type { VaultDepositSchemaParams } from './vaults';
export default validation;
