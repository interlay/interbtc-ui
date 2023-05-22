import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { ISubmittableResult } from '@polkadot/types/types';
import { useMutation, UseMutationResult } from 'react-query';

import { LoanAction } from '@/types/loans';
import { submitExtrinsicPromise } from '@/utils/helpers/extrinsic';

type CreateLoanVariables = { loanType: LoanAction; amount: MonetaryAmount<CurrencyExt>; isMaxAmount: boolean };

const mutateLoan = ({ loanType, amount, isMaxAmount }: CreateLoanVariables) => {
  const extrinsicData = (() => {
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
  })();

  return submitExtrinsicPromise(extrinsicData);
};

type UseLoanMutation = { onSuccess: () => void; onError: (error: Error) => void };

const useLoanMutation = ({
  onSuccess,
  onError
}: UseLoanMutation): UseMutationResult<ISubmittableResult, Error, CreateLoanVariables> => {
  return useMutation<ISubmittableResult, Error, CreateLoanVariables>(mutateLoan, {
    onSuccess,
    onError
  });
};

export { useLoanMutation };
export type { UseLoanMutation };
