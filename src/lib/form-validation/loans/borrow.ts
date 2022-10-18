import { CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { TFunction } from 'i18next';
import * as z from 'zod';

import balance from '../common/balance';
import field from '../common/field';

type LoanBorrowValidationParams = {
  governanceBalance: MonetaryAmount<CurrencyExt>;
  transactionFee: MonetaryAmount<CurrencyExt>;
};

const borrow = (t: TFunction, params: LoanBorrowValidationParams): z.ZodEffects<z.ZodString, string, string> =>
  z.string().superRefine((value, ctx) => {
    const { governanceBalance, transactionFee } = params;

    if (field.required.validate({ value })) {
      const issueArg = field.required.issue(t, { fieldName: t('loans.form_fields.borrow_amount') });
      return ctx.addIssue(issueArg);
    }

    if (balance.transactionFee.validate({ availableBalance: governanceBalance, transactionFee })) {
      return ctx.addIssue(balance.transactionFee.issue(t));
    }
  });

type LoanRepayValidationParams = {
  governanceBalance: MonetaryAmount<CurrencyExt>;
  transactionFee: MonetaryAmount<CurrencyExt>;
  borrowedAssetBalance: MonetaryAmount<CurrencyExt>;
};

const repay = (t: TFunction, params: LoanRepayValidationParams): z.ZodEffects<z.ZodString, string, string> =>
  z.string().superRefine((value, ctx) => {
    const { governanceBalance, transactionFee, borrowedAssetBalance } = params;

    if (field.required.validate({ value })) {
      const issueArg = field.required.issue(t, { fieldName: t('loans.form_fields.repay_amount') });
      return ctx.addIssue(issueArg);
    }

    if (balance.transactionFee.validate({ availableBalance: governanceBalance, transactionFee })) {
      return ctx.addIssue(balance.transactionFee.issue(t));
    }

    const inputAmount = newMonetaryAmount(value, borrowedAssetBalance.currency, true);

    if (balance.currency.validate({ availableBalance: borrowedAssetBalance, inputAmount })) {
      return ctx.addIssue(balance.currency.issue(t));
    }
  });

export { borrow, repay };
export type { LoanBorrowValidationParams, LoanRepayValidationParams };
