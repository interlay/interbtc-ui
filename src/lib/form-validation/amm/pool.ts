import Big from 'big.js';
import { TFunction } from 'i18next';
import * as z from 'zod';

import balance from '../common/balance';
import field from '../common/field';
import { CommonSchemaParams, MaxAmountSchemaParams } from '../types';

type PoolDepositSchemaParams = CommonSchemaParams & MaxAmountSchemaParams;

const deposit = (t: TFunction, params: PoolDepositSchemaParams): z.ZodEffects<any, any, any> =>
  z
    .preprocess((value) => Number(value), z.number())
    .superRefine((value, ctx) => {
      const { governanceBalance, transactionFee, minAmount, maxAmount } = params;

      if (!field.required.validate({ value })) {
        const issueArg = field.required.issue(t, { fieldName: t('deposit').toLowerCase(), fieldType: 'number' });
        return ctx.addIssue(issueArg);
      }

      if (!balance.transactionFee.validate({ availableBalance: governanceBalance, transactionFee })) {
        return ctx.addIssue(balance.transactionFee.issue(t));
      }

      const inputAmount = new Big(value);

      if (!field.min.validate({ inputAmount, minAmount: minAmount.toBig() })) {
        const issueArg = field.min.issue(t, {
          action: t('deposit').toLowerCase(),
          amount: minAmount.toString()
        });
        return ctx.addIssue(issueArg);
      }

      if (!field.max.validate({ inputAmount, maxAmount: maxAmount.toBig() })) {
        const issueArg = field.max.issue(t, {
          action: t('deposit').toLowerCase(),
          amount: maxAmount.toString()
        });
        return ctx.addIssue(issueArg);
      }
    });

type PoolWithdrawSchemaParams = CommonSchemaParams & MaxAmountSchemaParams;

const withdraw = (t: TFunction, params: PoolDepositSchemaParams): z.ZodEffects<z.ZodNumber, number, number> =>
  z.number().superRefine((value, ctx) => {
    const { governanceBalance, transactionFee, minAmount, maxAmount } = params;

    if (!field.required.validate({ value })) {
      const issueArg = field.required.issue(t, { fieldName: t('withdraw').toLowerCase(), fieldType: 'number' });
      return ctx.addIssue(issueArg);
    }

    if (!balance.transactionFee.validate({ availableBalance: governanceBalance, transactionFee })) {
      return ctx.addIssue(balance.transactionFee.issue(t));
    }

    const inputAmount = new Big(value);

    if (!field.min.validate({ inputAmount, minAmount: minAmount.toBig() })) {
      const issueArg = field.min.issue(t, {
        action: t('withdraw').toLowerCase(),
        amount: minAmount.toString()
      });
      return ctx.addIssue(issueArg);
    }

    if (!field.max.validate({ inputAmount, maxAmount: maxAmount.toBig() })) {
      const issueArg = field.max.issue(t, {
        action: t('deposit').toLowerCase(),
        amount: maxAmount.toString()
      });
      return ctx.addIssue(issueArg);
    }
  });

export { deposit, withdraw };
export type { PoolDepositSchemaParams, PoolWithdrawSchemaParams };
