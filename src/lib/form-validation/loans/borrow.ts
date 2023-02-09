import { newMonetaryAmount } from '@interlay/interbtc-api';
import Big from 'big.js';
import { TFunction } from 'i18next';
import * as z from 'zod';

import balance from '../common/balance';
import field from '../common/field';
import { AvailableBalanceSchemaParams, CommonSchemaParams, MaxAmountSchemaParams } from '../types';
import { transformNaN } from '../utils';

type LoanBorrowSchemaParams = CommonSchemaParams & MaxAmountSchemaParams;

const borrow = (t: TFunction, params: LoanBorrowSchemaParams): z.ZodEffects<any, any, any> =>
  z
    .string()
    .transform(transformNaN)
    .superRefine((value, ctx) => {
      const { governanceBalance, transactionFee, minAmount, maxAmount } = params;

      if (!field.required.validate({ value })) {
        const issueArg = field.required.issue(t, { fieldName: t('loans.borrow').toLowerCase(), fieldType: 'number' });
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

type LoanRepaySchemaParams = CommonSchemaParams & MaxAmountSchemaParams & AvailableBalanceSchemaParams;

const repay = (t: TFunction, params: LoanRepaySchemaParams): z.ZodEffects<any, any, any> =>
  z
    .string()
    .transform(transformNaN)
    .superRefine((value, ctx) => {
      const { governanceBalance, transactionFee, availableBalance, minAmount, maxAmount } = params;

      if (!field.required.validate({ value })) {
        const issueArg = field.required.issue(t, { fieldName: t('loans.repay').toLowerCase(), fieldType: 'number' });
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

      if (!field.max.validate({ inputAmount: inputAmount.toBig(), maxAmount: maxAmount.toBig() })) {
        const issueArg = field.max.issue(t, {
          action: t('loans.repay').toLowerCase(),
          amount: maxAmount.toString()
        });
        return ctx.addIssue(issueArg);
      }

      if (!balance.currency.validate({ availableBalance, inputAmount })) {
        return ctx.addIssue(balance.currency.issue(t));
      }
    });

export { borrow, repay };
export type { LoanBorrowSchemaParams, LoanRepaySchemaParams };
