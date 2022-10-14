import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { TFunction } from 'i18next';
import * as z from 'zod';

import { validateGovernanceFunds } from '../common';

type ValidateBorrowParams = {
  governanceBalance: MonetaryAmount<CurrencyExt>;
  transactionFee: MonetaryAmount<CurrencyExt>;
};

const borrow = (t: TFunction, params: ValidateBorrowParams): z.ZodEffects<z.ZodString, string, string> =>
  z.string().superRefine((value, ctx) => {
    const { governanceBalance, transactionFee } = params;

    if (!value) return;

    validateGovernanceFunds(ctx, t, { governanceBalance, transactionFee });

    // const inputAmount = new Big(value);
  });

type ValidateRepayParams = {
  governanceBalance: MonetaryAmount<CurrencyExt>;
  transactionFee: MonetaryAmount<CurrencyExt>;
};

const repay = (t: TFunction, params: ValidateRepayParams): z.ZodEffects<z.ZodString, string, string> =>
  z.string().superRefine((value, ctx) => {
    const { governanceBalance, transactionFee } = params;

    if (!value) return;

    validateGovernanceFunds(ctx, t, { governanceBalance, transactionFee });

    // const inputAmount = new Big(value);
  });

export { borrow, repay };
export type { ValidateBorrowParams, ValidateRepayParams };
