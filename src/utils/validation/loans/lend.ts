import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { TFunction } from 'i18next';
import * as z from 'zod';

import { validateGovernanceFunds } from '../common';

type ValidateLendParams = {
  governanceBalance: MonetaryAmount<CurrencyExt>;
  transactionFee: MonetaryAmount<CurrencyExt>;
};

const lend = (t: TFunction, params: ValidateLendParams): z.ZodEffects<z.ZodString, string, string> =>
  z.string().superRefine((value, ctx) => {
    const { governanceBalance, transactionFee } = params;

    if (!value) return;

    validateGovernanceFunds(ctx, t, { governanceBalance, transactionFee });

    // const inputAmount = new Big(value);
  });

type ValidateWithdrawParams = {
  governanceBalance: MonetaryAmount<CurrencyExt>;
  transactionFee: MonetaryAmount<CurrencyExt>;
};

const withdraw = (t: TFunction, params: ValidateWithdrawParams): z.ZodEffects<z.ZodString, string, string> =>
  z.string().superRefine((value, ctx) => {
    const { governanceBalance, transactionFee } = params;

    if (!value) return;

    validateGovernanceFunds(ctx, t, { governanceBalance, transactionFee });

    // const inputAmount = new Big(value);
  });

export { lend, withdraw };
export type { ValidateLendParams, ValidateWithdrawParams };
