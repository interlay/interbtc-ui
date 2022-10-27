import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

type CommonValidationParams = {
  governanceBalance: MonetaryAmount<CurrencyExt>;
  transactionFee: MonetaryAmount<CurrencyExt>;
  availableBalance: MonetaryAmount<CurrencyExt>;
  minAmount: MonetaryAmount<CurrencyExt>;
  maxAmount?: MonetaryAmount<CurrencyExt>;
};

export type { CommonValidationParams };
