import { CollateralCurrencyExt, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { Bitcoin, ExchangeRate } from '@interlay/monetary-js';
import Big from 'big.js';

import { REDEEM_FEE_RATE } from '@/config/parachain';
import { WRAPPED_TOKEN } from '@/config/relay-chains';

const DEFAULT_MAX_BURNABLE_TOKENS = '100000000'; // 1 BTC
const DEFAULT_BURN_EXCHANGE_RATE = '150000';

const zeroWrappedTokenAmount = newMonetaryAmount(0, WRAPPED_TOKEN);

const mockRedeemGetMaxBurnableTokens = jest.fn((_currency: CurrencyExt) =>
  newMonetaryAmount(DEFAULT_MAX_BURNABLE_TOKENS, WRAPPED_TOKEN)
);
const mockRedeemGetBurnExchangeRate = jest.fn(
  (collateralCurrency: CollateralCurrencyExt) =>
    new ExchangeRate(Bitcoin, collateralCurrency, Big(DEFAULT_BURN_EXCHANGE_RATE))
);
const mockRedeemBurn = jest.fn();

const mockRedeemGetDustValue = jest.fn(() => zeroWrappedTokenAmount);

const mockRedeemGetPremiumRedeemFeeRate = jest.fn(() => Big(0));

// ray test touch <
const mockRedeemGetFeeRate = jest.fn(() => Big(REDEEM_FEE_RATE));
// ray test touch >

const mockRedeemGetCurrentInclusionFee = jest.fn(() => zeroWrappedTokenAmount);

const mockRedeemRequest = jest.fn();

export {
  mockRedeemBurn,
  mockRedeemGetBurnExchangeRate,
  mockRedeemGetCurrentInclusionFee,
  mockRedeemGetDustValue,
  mockRedeemGetFeeRate,
  mockRedeemGetMaxBurnableTokens,
  mockRedeemGetPremiumRedeemFeeRate,
  mockRedeemRequest
};
