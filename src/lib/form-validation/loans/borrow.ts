import { CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { TFunction } from 'i18next';
import * as z from 'zod';

import balance from '../common/balance';
import field from '../common/field';
import { CommonValidationParams } from '../common/type';

type LoanBorrowValidationParams = CommonValidationParams;

const borrow = (t: TFunction, params: LoanBorrowValidationParams): z.ZodEffects<z.ZodString, string, string> =>
  z.string().superRefine((value, ctx) => {
    const { governanceBalance, transactionFee, minAmount } = params;

    if (!field.required.validate({ value })) {
      const issueArg = field.required.issue(t, { fieldName: t('loans.form_fields.borrow_amount') });
      return ctx.addIssue(issueArg);
    }

    if (!balance.transactionFee.validate({ availableBalance: governanceBalance, transactionFee })) {
      return ctx.addIssue(balance.transactionFee.issue(t));
    }

    const inputAmount = new Big(value);

    if (!field.min.validate({ inputAmount, minAmount: minAmount.toBig() })) {
      const issueArg = field.min.issue(t, {
        action: t('loans.borrow').toLowerCase(),
        // TODO: should we display full amount or shortter version?
        amount: minAmount.toString()
      });
      return ctx.addIssue(issueArg);
    }
  });

type LoanRepayValidationParams = CommonValidationParams & {
  borrowedAssetBalance: MonetaryAmount<CurrencyExt>;
};

const repay = (t: TFunction, params: LoanRepayValidationParams): z.ZodEffects<z.ZodString, string, string> =>
  z.string().superRefine((value, ctx) => {
    const { governanceBalance, transactionFee, borrowedAssetBalance, minAmount } = params;

    if (!field.required.validate({ value })) {
      const issueArg = field.required.issue(t, { fieldName: t('loans.form_fields.repay_amount') });
      return ctx.addIssue(issueArg);
    }

    if (!balance.transactionFee.validate({ availableBalance: governanceBalance, transactionFee })) {
      return ctx.addIssue(balance.transactionFee.issue(t));
    }

    const inputAmount = newMonetaryAmount(value, borrowedAssetBalance.currency, true);

    if (!field.min.validate({ inputAmount: inputAmount.toBig(), minAmount: minAmount.toBig() })) {
      const issueArg = field.min.issue(t, {
        action: t('loans.repay').toLowerCase(),
        // TODO: should we display full amount or shortter version?
        amount: minAmount.toString()
      });
      return ctx.addIssue(issueArg);
    }

    if (!balance.currency.validate({ availableBalance: borrowedAssetBalance, inputAmount })) {
      return ctx.addIssue(balance.currency.issue(t));
    }
  });

export { borrow, repay };
export type { LoanBorrowValidationParams, LoanRepayValidationParams };

// More than minimum amount and cannot put more than borrow limit for both withdraw and borrow
