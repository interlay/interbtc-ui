import * as loans from './loans';
import * as vault from './vault';

const validation = {
  loans,
  vault
};

export type { ValidateBorrowParams, ValidateLendParams, ValidateRepayParams, ValidateWithdrawParams } from './loans';
export type { ValidateDepositParams } from './vault';
export default validation;
