import { newMonetaryAmount } from '@interlay/interbtc-api';
import { TFunction } from 'i18next';
import * as z from 'zod';

import balance from '../common/balance';
import field from '../common/field';
import { AvailableBalanceSchemaParams, CommonSchemaParams } from '../types';

type SwapSchemaParams = CommonSchemaParams & AvailableBalanceSchemaParams;

const swap = (t: TFunction, params: SwapSchemaParams): z.ZodEffects<z.ZodString, string, string> =>
  z.string().superRefine((value, ctx) => {
    const { governanceBalance, transactionFee, availableBalance } = params;

    if (!field.required.validate({ value })) {
      return ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        inclusive: true,
        type: 'string',
        message: `Enter ${availableBalance.currency.ticker} amount`
      });
    }

    const inputAmount = newMonetaryAmount(value, availableBalance.currency, true);

    // if (!field.min.validate({ inputAmount: inputAmount.toBig(), minAmount: minAmount.toBig() })) {
    //   const issueArg = field.min.issue(t, {
    //     action: t('amm.swap').toLowerCase(),
    //     amount: minAmount.toString()
    //   });
    //   return ctx.addIssue(issueArg);
    // }

    if (!balance.currency.validate({ availableBalance: availableBalance, inputAmount })) {
      return ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        inclusive: true,
        type: 'string',
        message: `Insufficient ${availableBalance.currency.ticker} balance`
      });
    }

    if (!balance.transactionFee.validate({ availableBalance: governanceBalance, transactionFee })) {
      return ctx.addIssue(balance.transactionFee.issue(t));
    }
  });

const select = (): z.ZodEffects<z.ZodString, string, string> =>
  z.string().superRefine((value, ctx) => {
    if (!field.required.validate({ value })) {
      return ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        inclusive: true,
        type: 'string',
        message: `Select Token`
      });
    }
  });

export { select, swap };
export type { SwapSchemaParams };
