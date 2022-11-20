import { CollateralCurrencyExt, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { Bitcoin, ExchangeRate } from '@interlay/monetary-js';
import Big from 'big.js';

import { WRAPPED_TOKEN } from '@/config/relay-chains';

const DEFAULT_MAX_BURNABLE_TOKENS = '100000000'; // 1 BTC
const DEFAULT_BURN_EXCHANGE_RATE = '150000';

const mockRedeemGetMaxBurnableTokens = jest.fn((_currency: CurrencyExt) =>
  newMonetaryAmount(DEFAULT_MAX_BURNABLE_TOKENS, WRAPPED_TOKEN)
);
const mockRedeemGetBurnExchangeRate = jest.fn(
  (collateralCurrency: CollateralCurrencyExt) =>
    new ExchangeRate(Bitcoin, collateralCurrency, Big(DEFAULT_BURN_EXCHANGE_RATE))
);
const mockRedeemBurn = jest.fn();

const mockRedeemGetDustValue = jest.fn();

const mockRedeemGetPremiumRedeemFeeRate = jest.fn();

const mockRedeemGetFeeRate = jest.fn();

const mockRedeemGetCurrentInclusionFee = jest.fn();

export {
  mockRedeemBurn,
  mockRedeemGetBurnExchangeRate,
  mockRedeemGetCurrentInclusionFee,
  mockRedeemGetDustValue,
  mockRedeemGetFeeRate,
  mockRedeemGetMaxBurnableTokens,
  mockRedeemGetPremiumRedeemFeeRate
};
