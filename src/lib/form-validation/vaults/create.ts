import { newMonetaryAmount } from '@interlay/interbtc-api';
import { TFunction } from 'i18next';
import * as z from 'zod';

import balance from '../common/balance';
import field from '../common/field';
import { AvailableBalanceSchemaParams, CommonSchemaParams } from '../types';
import { transformNaN } from '../utils';

type VaultDepositSchemaParams = CommonSchemaParams & AvailableBalanceSchemaParams;

const deposit = (t: TFunction, params: VaultDepositSchemaParams): z.ZodEffects<any, any, any> =>
  z
    .string()
    .transform(transformNaN)
    .superRefine((value, ctx) => {
      const { availableBalance, governanceBalance, minAmount, transactionFee } = params;

      if (!field.required.validate({ value })) {
        const issueArg = field.required.issue(t, { fieldName: t('vault.deposit').toLowerCase(), fieldType: 'number' });
        return ctx.addIssue(issueArg);
      }

      if (!balance.transactionFee.validate({ availableBalance: governanceBalance, transactionFee })) {
        return ctx.addIssue(balance.transactionFee.issue(t));
      }

      const inputAmount = newMonetaryAmount(value, availableBalance.currency, true);

      if (!field.min.validate({ inputAmount: inputAmount.toBig(), minAmount: minAmount.toBig() })) {
        const issueArg = field.min.issue(t, {
          action: t('vault.deposit').toLowerCase(),
          amount: minAmount.toBig().toString()
        });
        return ctx.addIssue(issueArg);
      }

      if (!balance.currency.validate({ availableBalance, inputAmount })) {
        return ctx.addIssue(balance.currency.issue(t));
      }
    });

export { deposit };
export type { VaultDepositSchemaParams };
