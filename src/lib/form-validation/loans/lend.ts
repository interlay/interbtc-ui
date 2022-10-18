import { CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { TFunction } from 'i18next';
import * as z from 'zod';

import balance from '../common/balance';
import field from '../common/field';

type LoanLendValidationParams = {
  governanceBalance: MonetaryAmount<CurrencyExt>;
  transactionFee: MonetaryAmount<CurrencyExt>;
  lendAssetBalance: MonetaryAmount<CurrencyExt>;
};

const lend = (t: TFunction, params: LoanLendValidationParams): z.ZodEffects<z.ZodString, string, string> =>
  z.string().superRefine((value, ctx) => {
    const { governanceBalance, transactionFee, lendAssetBalance } = params;

    if (field.required.validate({ value })) {
      const issueArg = field.required.issue(t, { fieldName: t('loans.form_fields.lend_amount') });
      return ctx.addIssue(issueArg);
    }

    if (balance.transactionFee.validate({ availableBalance: governanceBalance, transactionFee })) {
      return ctx.addIssue(balance.transactionFee.issue(t));
    }

    const inputAmount = newMonetaryAmount(value, lendAssetBalance.currency, true);

    if (balance.currency.validate({ availableBalance: lendAssetBalance, inputAmount })) {
      return ctx.addIssue(balance.currency.issue(t));
    }
  });

type LoanWithdrawValidationParams = {
  governanceBalance: MonetaryAmount<CurrencyExt>;
  transactionFee: MonetaryAmount<CurrencyExt>;
};

const withdraw = (t: TFunction, params: LoanWithdrawValidationParams): z.ZodEffects<z.ZodString, string, string> =>
  z.string().superRefine((value, ctx) => {
    const { governanceBalance, transactionFee } = params;

    if (field.required.validate({ value })) {
      const issueArg = field.required.issue(t, { fieldName: t('loans.form_fields.withdraw_amount') });
      return ctx.addIssue(issueArg);
    }

    if (balance.transactionFee.validate({ availableBalance: governanceBalance, transactionFee })) {
      return ctx.addIssue(balance.transactionFee.issue(t));
    }
  });

export { lend, withdraw };
export type { LoanLendValidationParams, LoanWithdrawValidationParams };
