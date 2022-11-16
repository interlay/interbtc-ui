import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useMutation, UseMutationResult } from 'react-query';

import { LoanAction } from '@/types/loans';

type CreateLoanVariables = { loanType: LoanAction; amount: MonetaryAmount<CurrencyExt>; isMaxAmount: boolean };

const mutateLoan = ({ loanType, amount, isMaxAmount }: CreateLoanVariables) => {
  switch (loanType) {
    case 'lend':
      return window.bridge.loans.lend(amount.currency, amount);
    case 'withdraw':
      if (isMaxAmount) {
        return window.bridge.loans.withdrawAll(amount.currency);
      } else {
        return window.bridge.loans.withdraw(amount.currency, amount);
      }
    case 'borrow':
      return window.bridge.loans.borrow(amount.currency, amount);
    case 'repay':
      if (isMaxAmount) {
        return window.bridge.loans.repayAll(amount.currency);
      } else {
        return window.bridge.loans.repay(amount.currency, amount);
      }
  }
};

type UseLoanMutation = { onSuccess: () => void };

const useLoanMutation = ({ onSuccess }: UseLoanMutation): UseMutationResult<void, Error, CreateLoanVariables> => {
  return useMutation<void, Error, CreateLoanVariables>(mutateLoan, {
    onSuccess
  });
};

export { useLoanMutation };
export type { UseLoanMutation };
