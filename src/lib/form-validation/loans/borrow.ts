import { newMonetaryAmount } from '@interlay/interbtc-api';
import Big from 'big.js';
import { TFunction } from 'i18next';
import * as z from 'zod';

import balance from '../common/balance';
import field from '../common/field';
import { CommonValidationParams } from '../common/type';

type LoanBorrowValidationParams = Required<CommonValidationParams>;

const borrow = (t: TFunction, params: LoanBorrowValidationParams): z.ZodEffects<z.ZodString, string, string> =>
  z.string().superRefine((value, ctx) => {
    const { governanceBalance, transactionFee, minAmount, maxAmount } = params;

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
        amount: minAmount.toString()
      });
      return ctx.addIssue(issueArg);
    }

    if (!field.max.validate({ inputAmount, maxAmount: maxAmount.toBig() })) {
      const issueArg = field.max.issue(t, {
        action: t('loans.borrow').toLowerCase(),
        amount: maxAmount.toString()
      });
      return ctx.addIssue(issueArg);
    }
  });

type LoanRepayValidationParams = CommonValidationParams;

const repay = (t: TFunction, params: LoanRepayValidationParams): z.ZodEffects<z.ZodString, string, string> =>
  z.string().superRefine((value, ctx) => {
    const { governanceBalance, transactionFee, availableBalance, minAmount } = params;

    if (!field.required.validate({ value })) {
      const issueArg = field.required.issue(t, { fieldName: t('loans.form_fields.repay_amount') });
      return ctx.addIssue(issueArg);
    }

    if (!balance.transactionFee.validate({ availableBalance: governanceBalance, transactionFee })) {
      return ctx.addIssue(balance.transactionFee.issue(t));
    }

    const inputAmount = newMonetaryAmount(value, availableBalance.currency, true);

    if (!field.min.validate({ inputAmount: inputAmount.toBig(), minAmount: minAmount.toBig() })) {
      const issueArg = field.min.issue(t, {
        action: t('loans.repay').toLowerCase(),
        amount: minAmount.toString()
      });
      return ctx.addIssue(issueArg);
    }

    if (!balance.currency.validate({ availableBalance, inputAmount })) {
      return ctx.addIssue(balance.currency.issue(t));
    }
  });

export { borrow, repay };
export type { LoanBorrowValidationParams, LoanRepayValidationParams };
