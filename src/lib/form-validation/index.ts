import amm from './amm';
import loans from './loans';
import vaults from './vaults';

const validation = {
  vaults,
  loans,
  amm
};

export type { SwapSchemaParams } from './amm';
export type {
  LoanBorrowSchemaParams,
  LoanLendSchemaParams,
  LoanRepaySchemaParams,
  LoanWithdrawSchemaParams
} from './loans';
export type { VaultDepositSchemaParams } from './vaults';
export default validation;
