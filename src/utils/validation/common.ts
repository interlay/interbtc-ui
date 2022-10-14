import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import * as z from 'zod';

import { GOVERNANCE_TOKEN_SYMBOL } from '@/config/relay-chains';

import { ValidationFunction } from './types';

type ValidateGovernanceFundsParams = {
  governanceBalance: MonetaryAmount<CurrencyExt>;
  transactionFee: MonetaryAmount<CurrencyExt>;
};

const validateGovernanceFunds: ValidationFunction<ValidateGovernanceFundsParams> = (ctx, t, params) => {
  const { governanceBalance, transactionFee } = params;

  if (governanceBalance.lte(transactionFee)) {
    return ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: t('insufficient_funds_governance_token', {
        governanceTokenSymbol: GOVERNANCE_TOKEN_SYMBOL
      })
    });
  }
};

export { validateGovernanceFunds };
