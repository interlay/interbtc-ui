import { InterBtcApi } from '@interlay/interbtc-api';

import { Transaction } from '../types';
import { TransactionAction } from '.';

interface LoansClaimRewardsAction extends TransactionAction {
  type: Transaction.LOANS_CLAIM_REWARDS;
  args: Parameters<InterBtcApi['loans']['claimAllSubsidyRewards']>;
}

interface LoansEnabledCollateralAction extends TransactionAction {
  type: Transaction.LOANS_ENABLE_COLLATERAL;
  args: Parameters<InterBtcApi['loans']['enableAsCollateral']>;
}

interface LoansDisabledCollateralAction extends TransactionAction {
  type: Transaction.LOANS_DISABLE_COLLATERAL;
  args: Parameters<InterBtcApi['loans']['disableAsCollateral']>;
}

interface LoansLendAction extends TransactionAction {
  type: Transaction.LOANS_LEND;
  args: Parameters<InterBtcApi['loans']['lend']>;
}

interface LoansWithdrawAction extends TransactionAction {
  type: Transaction.LOANS_WITHDRAW;
  args: Parameters<InterBtcApi['loans']['withdraw']>;
}

interface LoansWithdrawAllAction extends TransactionAction {
  type: Transaction.LOANS_WITHDRAW_ALL;
  args: Parameters<InterBtcApi['loans']['withdrawAll']>;
}

interface LoansBorrowAction extends TransactionAction {
  type: Transaction.LOANS_BORROW;
  args: Parameters<InterBtcApi['loans']['borrow']>;
}

interface LoansRepayAction extends TransactionAction {
  type: Transaction.LOANS_REPAY;
  args: Parameters<InterBtcApi['loans']['repay']>;
}

interface LoansRepayAllAction extends TransactionAction {
  type: Transaction.LOANS_REPAY_ALL;
  args: Parameters<InterBtcApi['loans']['repayAll']>;
}

type LoansActions =
  | LoansClaimRewardsAction
  | LoansEnabledCollateralAction
  | LoansDisabledCollateralAction
  | LoansLendAction
  | LoansWithdrawAction
  | LoansWithdrawAllAction
  | LoansBorrowAction
  | LoansRepayAction
  | LoansRepayAllAction;

export type { LoansActions };
