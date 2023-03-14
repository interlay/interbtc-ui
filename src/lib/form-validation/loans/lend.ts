import { newMonetaryAmount } from '@interlay/interbtc-api';
import Big from 'big.js';
import { TFunction } from 'i18next';
import * as z from 'zod';

import balance from '../common/balance';
import field from '../common/field';
import { AvailableBalanceSchemaParams, CommonSchemaParams, MaxAmountSchemaParams } from '../types';

type LoanLendSchemaParams = CommonSchemaParams & AvailableBalanceSchemaParams & MaxAmountSchemaParams;

const lend = (t: TFunction, params: LoanLendSchemaParams): z.ZodEffects<z.ZodString, string, string> =>
  z.string().superRefine((value, ctx) => {
    const { governanceBalance, transactionFee, availableBalance, minAmount, maxAmount } = params;

    if (!field.required.validate({ value })) {
      const issueArg = field.required.issue(t, { fieldName: t('loans.lend').toLowerCase(), fieldType: 'number' });
      return ctx.addIssue(issueArg);
    }

    if (!balance.transactionFee.validate({ availableBalance: governanceBalance, transactionFee })) {
      return ctx.addIssue(balance.transactionFee.issue(t));
    }

    const inputAmount = newMonetaryAmount(value, availableBalance.currency, true);

    if (!field.min.validate({ inputAmount: inputAmount.toBig(), minAmount: minAmount.toBig() })) {
      const issueArg = field.min.issue(t, {
        action: t('loans.lend').toLowerCase(),
        amount: minAmount.toString()
      });
      return ctx.addIssue(issueArg);
    }

    if (!balance.currency.validate({ availableBalance: availableBalance, inputAmount })) {
      return ctx.addIssue(balance.currency.issue(t));
    }

    if (!field.max.validate({ inputAmount: inputAmount.toBig(), maxAmount: maxAmount.toBig() })) {
      const issueArg = field.max.issue(t, {
        action: t('loans.lend').toLowerCase(),
        amount: maxAmount.toString()
      });
      return ctx.addIssue(issueArg);
    }
  });

type LoanWithdrawSchemaParams = CommonSchemaParams & MaxAmountSchemaParams;

const withdraw = (t: TFunction, params: LoanWithdrawSchemaParams): z.ZodEffects<z.ZodString, string, string> =>
  z.string().superRefine((value, ctx) => {
    const { governanceBalance, transactionFee, minAmount, maxAmount } = params;

    if (!field.required.validate({ value })) {
      const issueArg = field.required.issue(t, { fieldName: t('loans.withdraw').toLowerCase(), fieldType: 'number' });
      return ctx.addIssue(issueArg);
    }

    if (!balance.transactionFee.validate({ availableBalance: governanceBalance, transactionFee })) {
      return ctx.addIssue(balance.transactionFee.issue(t));
    }

    const inputAmount = new Big(value);

    if (!field.min.validate({ inputAmount, minAmount: minAmount.toBig() })) {
      const issueArg = field.min.issue(t, {
        action: t('loans.withdraw').toLowerCase(),
        amount: minAmount.toString()
      });
      return ctx.addIssue(issueArg);
    }

    if (!field.max.validate({ inputAmount, maxAmount: maxAmount.toBig() })) {
      const issueArg = field.max.issue(t, {
        action: t('loans.withdraw').toLowerCase(),
        amount: maxAmount.toString()
      });
      return ctx.addIssue(issueArg);
    }
  });

export { lend, withdraw };
export type { LoanLendSchemaParams, LoanWithdrawSchemaParams };
