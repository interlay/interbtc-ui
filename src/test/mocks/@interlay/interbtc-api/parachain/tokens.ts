import { ChainBalance, CurrencyExt, newMonetaryAmount, TokensAPI } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { EXTRINSIC_DATA } from '../extrinsic';

const BALANCE_VALUE = 1000000000000;

const BALANCE_FN = {
  EMPTY: (currency: CurrencyExt): ChainBalance => new ChainBalance(currency, 0, 0, 0),
  CUSTOM: (amount: MonetaryAmount<CurrencyExt>) => (currency: CurrencyExt): ChainBalance => {
    return new ChainBalance(
      currency,
      amount._rawAmount.toString(),
      amount._rawAmount.toString(),
      amount._rawAmount.toString()
    );
  },
  FULL: (currency: CurrencyExt): ChainBalance => new ChainBalance(currency, BALANCE_VALUE, BALANCE_VALUE, BALANCE_VALUE)
};

const TOTAL_VALUE = 10000000000000000000000;

const TOTAL_FN = {
  EMPTY: (currency: CurrencyExt): MonetaryAmount<CurrencyExt> => newMonetaryAmount(0, currency),
  FULL: (currency: CurrencyExt): MonetaryAmount<CurrencyExt> => newMonetaryAmount(TOTAL_VALUE, currency)
};

const DATA = { BALANCE_FN, TOTAL_FN };

const MODULE: Record<keyof TokensAPI, jest.Mock<any, any>> = {
  balance: jest.fn().mockImplementation(BALANCE_FN.FULL),
  total: jest.fn().mockImplementation(TOTAL_FN.FULL),
  // MUTATIONS
  buildTransferExtrinsic: jest.fn(),
  transfer: jest.fn().mockResolvedValue(EXTRINSIC_DATA),
  setBalance: jest.fn().mockResolvedValue(EXTRINSIC_DATA),
  subscribeToBalance: jest.fn().mockImplementation((currency: CurrencyExt, account, callback) => {
    const balance = new ChainBalance(currency, BALANCE_VALUE, BALANCE_VALUE);
    callback(account, balance);

    return () => undefined;
  })
};

const MOCK_TOKENS = {
  DATA,
  MODULE
};

export { MOCK_TOKENS };
