import Big from 'big.js';
import { TFunction } from 'i18next';
import * as z from 'zod';

import balance from '../common/balance';
import field from '../common/field';
import { CommonSchemaParams, MaxAmountSchemaParams } from '../types';
import { transformNaN } from '../utils';

type PoolWithdrawSchemaParams = CommonSchemaParams & MaxAmountSchemaParams;

const withdraw = (t: TFunction, params: PoolWithdrawSchemaParams): z.ZodEffects<any, any, any> =>
  z
    .string()
    .transform(transformNaN)
    .superRefine((value, ctx) => {
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
          action: t('withdraw').toLowerCase(),
          amount: maxAmount.toString()
        });
        return ctx.addIssue(issueArg);
      }
    });

export { withdraw };
export type { PoolWithdrawSchemaParams };
