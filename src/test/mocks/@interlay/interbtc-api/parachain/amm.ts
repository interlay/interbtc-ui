import {
  MultiPathElementStandard,
  MultiPathElementType,
  newMonetaryAmount,
  StandardLiquidityPool,
  StandardLpToken,
  Trade
} from '@interlay/interbtc-api';
import Big from 'big.js';

import { GOVERNANCE_TOKEN, RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';

const DEFAULT_LP_TOKEN_1_NAME = `LP ${GOVERNANCE_TOKEN.ticker}-${RELAY_CHAIN_NATIVE_TOKEN.ticker}`;

const DEFAULT_LP_TOKEN_1: StandardLpToken = {
  name: DEFAULT_LP_TOKEN_1_NAME,
  ticker: DEFAULT_LP_TOKEN_1_NAME,
  decimals: 12,
  lpToken: {
    token0: GOVERNANCE_TOKEN,
    token1: RELAY_CHAIN_NATIVE_TOKEN
  }
};

const DEFAULT_LP_TOKEN_2_NAME = `LP ${WRAPPED_TOKEN.ticker}-${RELAY_CHAIN_NATIVE_TOKEN.ticker}`;

const DEFAULT_LP_TOKEN_2: StandardLpToken = {
  name: DEFAULT_LP_TOKEN_2_NAME,
  ticker: DEFAULT_LP_TOKEN_2_NAME,
  decimals: 12,
  lpToken: {
    token0: WRAPPED_TOKEN,
    token1: RELAY_CHAIN_NATIVE_TOKEN
  }
};

const DEFAULT_POOLED_CURRENCIES_1 = [
  newMonetaryAmount(1, GOVERNANCE_TOKEN, true),
  newMonetaryAmount(5, RELAY_CHAIN_NATIVE_TOKEN, true)
];

const DEFAULT_POOLED_CURRENCIES_2 = [
  newMonetaryAmount(1, WRAPPED_TOKEN, true),
  newMonetaryAmount(5, RELAY_CHAIN_NATIVE_TOKEN, true)
];

const DEFAULT_LIQUIDITY_POOL_1 = new StandardLiquidityPool(
  DEFAULT_LP_TOKEN_1,
  DEFAULT_POOLED_CURRENCIES_1,
  [newMonetaryAmount(5, GOVERNANCE_TOKEN, true)],
  new Big('0.003'),
  true,
  newMonetaryAmount(1, DEFAULT_LP_TOKEN_1, true)
);

const DEFAULT_LIQUIDITY_POOL_2 = new StandardLiquidityPool(
  DEFAULT_LP_TOKEN_2,
  DEFAULT_POOLED_CURRENCIES_2,
  [newMonetaryAmount(5, GOVERNANCE_TOKEN, true)],
  new Big('0.003'),
  true,
  newMonetaryAmount(1, DEFAULT_LP_TOKEN_2, true)
);

const DEFAULT_LIQUIDITY_POOLS = [DEFAULT_LIQUIDITY_POOL_1, DEFAULT_LIQUIDITY_POOL_2];

const DEFAULT_ACCOUNT_LIQUIDITY = [newMonetaryAmount(0, DEFAULT_LP_TOKEN_1), newMonetaryAmount(0, DEFAULT_LP_TOKEN_2)];

const ACCOUNT_WITH_SOME_LIQUIDITY = [
  newMonetaryAmount(0, DEFAULT_LP_TOKEN_1),
  newMonetaryAmount(1, DEFAULT_LP_TOKEN_2)
];

const ACCOUNT_WITH_FULL_LIQUIDITY = [
  newMonetaryAmount(2, DEFAULT_LP_TOKEN_1),
  newMonetaryAmount(1, DEFAULT_LP_TOKEN_2)
];

const mockGetLiquidityPools = jest.fn().mockResolvedValue(DEFAULT_LIQUIDITY_POOLS);

const mockGetLiquidityProvidedByAccount = jest.fn().mockResolvedValue(DEFAULT_ACCOUNT_LIQUIDITY);

const DEFAULT_CLAIMABLE_REWARDS = new Map();

DEFAULT_CLAIMABLE_REWARDS.set(DEFAULT_LP_TOKEN_1, [newMonetaryAmount(1, WRAPPED_TOKEN, true)]);

const mockGetClaimableFarmingRewards = jest.fn().mockResolvedValue(DEFAULT_CLAIMABLE_REWARDS);

const mockClaimFarmingRewards = jest.fn();

const mockAddLiquidity = jest.fn();

const mockRemoveLiquidity = jest.fn();

const mockGetLpTokens = jest.fn().mockResolvedValue([DEFAULT_LP_TOKEN_1, DEFAULT_LP_TOKEN_2]);

const DEFAULT_TRADE_AMOUNT = {
  INPUT: newMonetaryAmount(1, RELAY_CHAIN_NATIVE_TOKEN, true),
  OUTPUT: newMonetaryAmount(0.1, WRAPPED_TOKEN, true)
};

const mockGetOutputAmount = jest.fn().mockReturnValue(DEFAULT_TRADE_AMOUNT.OUTPUT);

const DEFAULT_MULTI_PATH_ELEMENT: MultiPathElementStandard = {
  pair: {
    getOutputAmount: mockGetOutputAmount,
    pathOf: jest.fn(),
    token0: RELAY_CHAIN_NATIVE_TOKEN,
    token1: WRAPPED_TOKEN,
    reserve0: newMonetaryAmount(5, RELAY_CHAIN_NATIVE_TOKEN, true),
    reserve1: newMonetaryAmount(5, WRAPPED_TOKEN, true)
  },
  input: RELAY_CHAIN_NATIVE_TOKEN,
  output: WRAPPED_TOKEN,
  type: MultiPathElementType.STANDARD,
  pool: DEFAULT_LIQUIDITY_POOL_2
};

const DEFAULT_TRADE = new Trade([DEFAULT_MULTI_PATH_ELEMENT], DEFAULT_TRADE_AMOUNT.INPUT, DEFAULT_TRADE_AMOUNT.OUTPUT);
jest.spyOn(DEFAULT_TRADE, 'getMinimumOutputAmount').mockReturnValue(DEFAULT_TRADE_AMOUNT.OUTPUT);

const mockGetOptimalTrade = jest.fn().mockReturnValue(DEFAULT_TRADE);

const mockSwap = jest.fn();

export {
  ACCOUNT_WITH_FULL_LIQUIDITY,
  ACCOUNT_WITH_SOME_LIQUIDITY,
  DEFAULT_ACCOUNT_LIQUIDITY,
  DEFAULT_CLAIMABLE_REWARDS,
  DEFAULT_LIQUIDITY_POOL_1,
  DEFAULT_LIQUIDITY_POOL_2,
  DEFAULT_LIQUIDITY_POOLS,
  DEFAULT_LP_TOKEN_1,
  DEFAULT_LP_TOKEN_2,
  DEFAULT_POOLED_CURRENCIES_1,
  DEFAULT_POOLED_CURRENCIES_2,
  DEFAULT_TRADE,
  DEFAULT_TRADE_AMOUNT,
  mockAddLiquidity,
  mockClaimFarmingRewards,
  mockGetClaimableFarmingRewards,
  mockGetLiquidityPools,
  mockGetLiquidityProvidedByAccount,
  mockGetLpTokens,
  mockGetOptimalTrade,
  mockRemoveLiquidity,
  mockSwap
};
