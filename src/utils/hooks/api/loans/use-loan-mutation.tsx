import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useMutation, UseMutationResult } from 'react-query';

import { LoanAction } from '@/types/loans';

type CreateLoanVariables = { loanType: LoanAction; amount: MonetaryAmount<CurrencyExt> };

const mutateLoan = ({ loanType, amount }: CreateLoanVariables) => {
  switch (loanType) {
    case 'lend':
      return window.bridge.loans.borrow(amount.currency, amount);
    case 'withdraw':
      return window.bridge.loans.withdraw(amount.currency, amount);
    case 'borrow':
      return window.bridge.loans.borrow(amount.currency, amount);
    case 'repay':
      return window.bridge.loans.repay(amount.currency, amount);
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
