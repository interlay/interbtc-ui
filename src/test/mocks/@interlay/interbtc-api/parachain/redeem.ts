import { CollateralCurrencyExt, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { Bitcoin, BitcoinAmount, ExchangeRate } from '@interlay/monetary-js';
import Big from 'big.js';

import { REDEEM_BRIDGE_FEE_RATE } from '@/config/parachain';
import { WRAPPED_TOKEN } from '@/config/relay-chains';

const DEFAULT_MAX_BURNABLE_TOKENS = '100000000'; // 1 BTC
const DEFAULT_BURN_EXCHANGE_RATE = '150000';

// ray test touch <<
const CURRENT_INCLUSION_FEE = new BitcoinAmount(0.0000038);
// ray test touch >>

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

const mockRedeemGetFeeRate = jest.fn(() => Big(REDEEM_BRIDGE_FEE_RATE));

// ray test touch <<
const mockRedeemGetCurrentInclusionFee = jest.fn(() => CURRENT_INCLUSION_FEE);
// ray test touch >>

const mockRedeemRequest = jest.fn();

export {
  CURRENT_INCLUSION_FEE,
  mockRedeemBurn,
  mockRedeemGetBurnExchangeRate,
  mockRedeemGetCurrentInclusionFee,
  mockRedeemGetDustValue,
  mockRedeemGetFeeRate,
  mockRedeemGetMaxBurnableTokens,
  mockRedeemGetPremiumRedeemFeeRate,
  mockRedeemRequest
};
