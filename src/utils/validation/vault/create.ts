import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { TFunction } from 'i18next';
import * as z from 'zod';

import { displayMonetaryAmount } from '@/common/utils/utils';

import { validateGovernanceFunds } from '../common';

type ValidateDepositParams = {
  minAmount: MonetaryAmount<CurrencyExt>;
  balance: MonetaryAmount<CurrencyExt>;
  governanceBalance: MonetaryAmount<CurrencyExt>;
  transactionFee: MonetaryAmount<CurrencyExt>;
};

const deposit = (t: TFunction, params: ValidateDepositParams): z.ZodEffects<z.ZodString, string, string> =>
  z.string().superRefine((value, ctx) => {
    const { balance, governanceBalance, minAmount, transactionFee } = params;

    validateGovernanceFunds(ctx, t, { governanceBalance, transactionFee });

    // TODO: we should not validate if input is empty but simply disable button
    if (!value) {
      return ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        message: t('vault.please_enter_deposit_amount'),
        inclusive: true,
        type: 'string'
      });
    }

    const inputAmount = new Big(value);

    if (!inputAmount.gte(minAmount.toBig())) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('vault.minimum_required_collateral', {
          currentCollateral: displayMonetaryAmount(minAmount),
          collateralTokenSymbol: minAmount.currency.ticker
        })
      });
    }

    if (!inputAmount.lte(balance.toBig())) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('amount_exceeds_the_available_amount')
      });
    }
  });

export { deposit };
export type { ValidateDepositParams };
