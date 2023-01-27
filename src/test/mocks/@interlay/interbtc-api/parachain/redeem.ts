import { CollateralCurrencyExt, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { Bitcoin, ExchangeRate } from '@interlay/monetary-js';
import Big from 'big.js';

import { DEFAULT_REDEEM_DUST_AMOUNT } from '@/config/parachain';
import { WRAPPED_TOKEN } from '@/config/relay-chains';

const MOCK_MAX_BURNABLE_TOKENS = '100000000'; // 1 BTC
const MOCK_BURN_EXCHANGE_RATE = '150000';

const mockRedeemGetMaxBurnableTokens = jest.fn((_currency: CurrencyExt) =>
  newMonetaryAmount(MOCK_MAX_BURNABLE_TOKENS, WRAPPED_TOKEN)
);
const mockRedeemGetBurnExchangeRate = jest.fn(
  (collateralCurrency: CollateralCurrencyExt) =>
    new ExchangeRate(Bitcoin, collateralCurrency, Big(MOCK_BURN_EXCHANGE_RATE))
);
const mockRedeemBurn = jest.fn();

// ray test touch <
const mockRedeemGetDustValue = jest.fn(() => newMonetaryAmount(DEFAULT_REDEEM_DUST_AMOUNT, WRAPPED_TOKEN));
// ray test touch >

const mockRedeemRequest = jest.fn();

export {
  mockRedeemBurn,
  mockRedeemGetBurnExchangeRate,
  mockRedeemGetDustValue,
  mockRedeemGetMaxBurnableTokens,
  mockRedeemRequest
};
