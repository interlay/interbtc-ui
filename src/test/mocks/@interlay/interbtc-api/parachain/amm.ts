import { newMonetaryAmount, StandardLiquidityPool, StandardLpToken } from '@interlay/interbtc-api';
import Big from 'big.js';

import { GOVERNANCE_TOKEN, RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';

const LP_TOKEN_1_NAME = `LP ${GOVERNANCE_TOKEN.ticker}-${RELAY_CHAIN_NATIVE_TOKEN.ticker}`;

const LP_TOKEN_1 = {
  name: LP_TOKEN_1_NAME,
  ticker: LP_TOKEN_1_NAME,
  decimals: 12,
  lpToken: {
    token0: GOVERNANCE_TOKEN,
    token1: RELAY_CHAIN_NATIVE_TOKEN
  }
} as StandardLpToken;

const LIQUIDITY_POOLED_CURRENCIES_1 = [
  newMonetaryAmount(10, GOVERNANCE_TOKEN, true),
  newMonetaryAmount(50, RELAY_CHAIN_NATIVE_TOKEN, true)
];

const LIQUIDITY_POOL_1 = new StandardLiquidityPool(
  LP_TOKEN_1,
  LIQUIDITY_POOLED_CURRENCIES_1,
  [newMonetaryAmount(50, GOVERNANCE_TOKEN, true)],
  new Big('0.003'),
  true,
  newMonetaryAmount(10, LP_TOKEN_1, true)
);

const LP_TOKEN_2_NAME = `LP ${WRAPPED_TOKEN.ticker}-${RELAY_CHAIN_NATIVE_TOKEN.ticker}`;

const LP_TOKEN_2 = {
  name: LP_TOKEN_2_NAME,
  ticker: LP_TOKEN_2_NAME,
  decimals: 12,
  lpToken: {
    token0: WRAPPED_TOKEN,
    token1: RELAY_CHAIN_NATIVE_TOKEN
  }
} as StandardLpToken;

const LIQUIDITY_POOLED_CURRENCIES_2 = [
  newMonetaryAmount(10, WRAPPED_TOKEN, true),
  newMonetaryAmount(50, RELAY_CHAIN_NATIVE_TOKEN, true)
];

const LIQUIDITY_POOL_2 = new StandardLiquidityPool(
  LP_TOKEN_2,
  LIQUIDITY_POOLED_CURRENCIES_2,
  [newMonetaryAmount(50, GOVERNANCE_TOKEN, true)],
  new Big('0.003'),
  true,
  newMonetaryAmount(10, LP_TOKEN_2, true)
);

const mockGetLiquidityPools = jest.fn().mockResolvedValue([LIQUIDITY_POOL_1, LIQUIDITY_POOL_2]);

const mockGetLiquidityProvidedByAccount = jest
  .fn()
  .mockResolvedValue([newMonetaryAmount(0, LP_TOKEN_1), newMonetaryAmount(0, LP_TOKEN_2)]);

const mockGetClaimableFarmingRewards = jest.fn().mockResolvedValue([]);

export { mockGetClaimableFarmingRewards, mockGetLiquidityPools, mockGetLiquidityProvidedByAccount };
