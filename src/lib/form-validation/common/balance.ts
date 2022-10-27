import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import * as z from 'zod';

import { GOVERNANCE_TOKEN_SYMBOL } from '@/config/relay-chains';

import { Validation } from '../types';

type TransactionFeeBalanceValidationParams = {
  availableBalance: MonetaryAmount<CurrencyExt>;
  transactionFee: MonetaryAmount<CurrencyExt>;
};

const transactionFee: Validation<TransactionFeeBalanceValidationParams> = {
  validate: ({ availableBalance, transactionFee }) => availableBalance.gte(transactionFee),
  issue: (t) => ({
    code: z.ZodIssueCode.custom,
    message: t('insufficient_funds_governance_token', {
      governanceTokenSymbol: GOVERNANCE_TOKEN_SYMBOL
    })
  })
};

type CurrencyBalanceValidationParams = {
  inputAmount: MonetaryAmount<CurrencyExt>;
  availableBalance: MonetaryAmount<CurrencyExt>;
};

const currency: Validation<CurrencyBalanceValidationParams> = {
  validate: ({ availableBalance, inputAmount }) => inputAmount.lte(availableBalance),
  issue: (t) => ({
    code: z.ZodIssueCode.custom,
    message: t('forms.please_enter_no_higher_available_balance')
  })
};

const balance = {
  transactionFee,
  currency
};

export default balance;
export type { CurrencyBalanceValidationParams, TransactionFeeBalanceValidationParams };
