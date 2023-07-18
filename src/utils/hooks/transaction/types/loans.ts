import { CurrencyExt, InterBtcApi } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { Transaction } from '../types';

interface LoansClaimRewardsAction {
  type: Transaction.LOANS_CLAIM_REWARDS;
  args: Parameters<InterBtcApi['loans']['claimAllSubsidyRewards']>;
}

interface LoansEnabledCollateralAction {
  type: Transaction.LOANS_ENABLE_COLLATERAL;
  args: Parameters<InterBtcApi['loans']['enableAsCollateral']>;
}

interface LoansDisabledCollateralAction {
  type: Transaction.LOANS_DISABLE_COLLATERAL;
  args: Parameters<InterBtcApi['loans']['disableAsCollateral']>;
}

interface LoansLendAction {
  type: Transaction.LOANS_LEND;
  args: Parameters<InterBtcApi['loans']['lend']>;
}

interface LoansWithdrawAction {
  type: Transaction.LOANS_WITHDRAW;
  args: Parameters<InterBtcApi['loans']['withdraw']>;
}

interface LoansWithdrawAllAction {
  type: Transaction.LOANS_WITHDRAW_ALL;
  args: Parameters<InterBtcApi['loans']['withdrawAll']>;
}

interface LoansBorrowAction {
  type: Transaction.LOANS_BORROW;
  args: Parameters<InterBtcApi['loans']['borrow']>;
}

interface LoansRepayAction {
  type: Transaction.LOANS_REPAY;
  args: Parameters<InterBtcApi['loans']['repay']>;
}

type CustomLoansRepayAllArgs = [calculatedLimit: MonetaryAmount<CurrencyExt>];

interface LoansRepayAllAction {
  type: Transaction.LOANS_REPAY_ALL;
  args: [...Parameters<InterBtcApi['loans']['repayAll']>, ...CustomLoansRepayAllArgs];
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
