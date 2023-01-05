import { newMonetaryAmount } from '@interlay/interbtc-api';
import { TFunction } from 'i18next';
import * as z from 'zod';

import balance from '../common/balance';
import field from '../common/field';
import { AvailableBalanceSchemaParams, CommonSchemaParams } from '../types';

type SwapSchemaParams = CommonSchemaParams & AvailableBalanceSchemaParams;

const swap = (t: TFunction, params: SwapSchemaParams): z.ZodEffects<z.ZodString, string, string> =>
  z.string().superRefine((value, ctx) => {
    const { governanceBalance, transactionFee, availableBalance, minAmount } = params;

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
        action: t('amm.swap').toLowerCase(),
        amount: minAmount.toString()
      });
      return ctx.addIssue(issueArg);
    }

    if (!balance.currency.validate({ availableBalance: availableBalance, inputAmount })) {
      return ctx.addIssue(balance.currency.issue(t));
    }
  });

export { swap };
export type { SwapSchemaParams };
