import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import * as z from 'zod';

import { GOVERNANCE_TOKEN_SYMBOL } from '@/config/relay-chains';

import { Validation } from '../types';

type ValidateTransactionFeeBalanceParams = {
  availableBalance: MonetaryAmount<CurrencyExt>;
  transactionFee: MonetaryAmount<CurrencyExt>;
};

const transactionFee: Validation<ValidateTransactionFeeBalanceParams> = {
  validate: ({ availableBalance, transactionFee }) => availableBalance.lte(transactionFee),
  issue: (t) => ({
    code: z.ZodIssueCode.custom,
    message: t?.('insufficient_funds_governance_token', {
      governanceTokenSymbol: GOVERNANCE_TOKEN_SYMBOL
    })
  })
};

type ValidateCurrencyBalanceParams = {
  inputAmount: MonetaryAmount<CurrencyExt>;
  availableBalance: MonetaryAmount<CurrencyExt>;
};

const currency: Validation<ValidateCurrencyBalanceParams> = {
  validate: ({ availableBalance, inputAmount }) => availableBalance.lt(inputAmount),
  issue: (t) => ({
    code: z.ZodIssueCode.custom,
    message: t?.('amount_exceeds_the_available_amount')
  })
};

const balance = {
  transactionFee,
  currency
};

export default balance;
export type { ValidateCurrencyBalanceParams, ValidateTransactionFeeBalanceParams };
