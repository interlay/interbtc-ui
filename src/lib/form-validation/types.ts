import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

type CommonSchemaParams = {
  governanceBalance: MonetaryAmount<CurrencyExt>;
  transactionFee: MonetaryAmount<CurrencyExt>;
  minAmount: MonetaryAmount<CurrencyExt>;
};

type AvailableBalanceSchemaParams = {
  availableBalance: MonetaryAmount<CurrencyExt>;
};

type MaxAmountSchemaParams = {
  maxAmount: MonetaryAmount<CurrencyExt>;
};

export type { AvailableBalanceSchemaParams, CommonSchemaParams, MaxAmountSchemaParams };
