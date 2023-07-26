import {
  AMMAPI,
  MultiPathElementStandard,
  MultiPathElementType,
  newMonetaryAmount,
  StandardLiquidityPool,
  StandardLpToken,
  Trade
} from '@interlay/interbtc-api';
import Big from 'big.js';

import { GOVERNANCE_TOKEN, RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';

import { EXTRINSIC_DATA } from '../extrinsic';

const LP_TOKEN_A_NAME = `LP ${GOVERNANCE_TOKEN.ticker}-${RELAY_CHAIN_NATIVE_TOKEN.ticker}`;

const LP_TOKEN_A: StandardLpToken = {
  name: LP_TOKEN_A_NAME,
  ticker: LP_TOKEN_A_NAME,
  decimals: 12,
  lpToken: {
    token0: GOVERNANCE_TOKEN,
    token1: RELAY_CHAIN_NATIVE_TOKEN
  }
};

const LP_TOKEN_B_NAME = `LP ${WRAPPED_TOKEN.ticker}-${RELAY_CHAIN_NATIVE_TOKEN.ticker}`;

const LP_TOKEN_B: StandardLpToken = {
  name: LP_TOKEN_B_NAME,
  ticker: LP_TOKEN_B_NAME,
  decimals: 12,
  lpToken: {
    token0: WRAPPED_TOKEN,
    token1: RELAY_CHAIN_NATIVE_TOKEN
  }
};

const LP_TOKEN_EMPTY_NAME = `LP ${WRAPPED_TOKEN.ticker}-${GOVERNANCE_TOKEN.ticker}`;

const LP_TOKEN_EMPTY: StandardLpToken = {
  name: LP_TOKEN_EMPTY_NAME,
  ticker: LP_TOKEN_EMPTY_NAME,
  decimals: 12,
  lpToken: {
    token0: WRAPPED_TOKEN,
    token1: GOVERNANCE_TOKEN
  }
};

const LP_TOKENS = [LP_TOKEN_A, LP_TOKEN_B, LP_TOKEN_EMPTY];

const LIQUIDITY_POOL_A = new StandardLiquidityPool(
  LP_TOKEN_A,
  [newMonetaryAmount(1, GOVERNANCE_TOKEN, true), newMonetaryAmount(5, RELAY_CHAIN_NATIVE_TOKEN, true)],
  [newMonetaryAmount(5, GOVERNANCE_TOKEN, true)],
  new Big('0.003'),
  true,
  newMonetaryAmount(1, LP_TOKEN_A, true),
  false
);

const LIQUIDITY_POOL_B = new StandardLiquidityPool(
  LP_TOKEN_B,
  [newMonetaryAmount(1, WRAPPED_TOKEN, true), newMonetaryAmount(5, RELAY_CHAIN_NATIVE_TOKEN, true)],
  [newMonetaryAmount(5, GOVERNANCE_TOKEN, true)],
  new Big('0.003'),
  true,
  newMonetaryAmount(1, LP_TOKEN_B, true),
  false
);

const EMPTY_LIQUIDITY_POOL = new StandardLiquidityPool(
  LP_TOKEN_EMPTY,
  [newMonetaryAmount(0, WRAPPED_TOKEN), newMonetaryAmount(0, GOVERNANCE_TOKEN)],
  [newMonetaryAmount(5, GOVERNANCE_TOKEN, true)],
  Big(0),
  true,
  newMonetaryAmount(0, LP_TOKEN_EMPTY),
  true
);

const LIQUIDITY_POOLS = [LIQUIDITY_POOL_A, LIQUIDITY_POOL_B, EMPTY_LIQUIDITY_POOL];

const ACCOUNT_EMPTY_LIQUIDITY = [
  newMonetaryAmount(0, LP_TOKEN_A),
  newMonetaryAmount(0, LP_TOKEN_B),
  newMonetaryAmount(0, LP_TOKEN_EMPTY)
];

const ACCOUNT_AVERAGE_LIQUIDITY = [
  newMonetaryAmount(0, LP_TOKEN_A),
  newMonetaryAmount(1, LP_TOKEN_B),
  newMonetaryAmount(0, LP_TOKEN_EMPTY)
];

const ACCOUNT_FULL_LIQUIDITY = [
  newMonetaryAmount(2, LP_TOKEN_A),
  newMonetaryAmount(1, LP_TOKEN_B),
  newMonetaryAmount(1, LP_TOKEN_EMPTY)
];

const CLAIMABLE_REWARDS = new Map();

CLAIMABLE_REWARDS.set(LP_TOKEN_A, [newMonetaryAmount(1, WRAPPED_TOKEN, true)]);

const TRADE_AMOUNT = {
  INPUT: newMonetaryAmount(1, RELAY_CHAIN_NATIVE_TOKEN, true),
  OUTPUT: newMonetaryAmount(0.1, WRAPPED_TOKEN, true)
};

const MULTI_PATH_ELEMENT: MultiPathElementStandard = {
  pair: {
    getOutputAmount: jest.fn().mockReturnValue(TRADE_AMOUNT.OUTPUT),
    pathOf: jest.fn(),
    token0: RELAY_CHAIN_NATIVE_TOKEN,
    token1: WRAPPED_TOKEN,
    reserve0: newMonetaryAmount(5, RELAY_CHAIN_NATIVE_TOKEN, true),
    reserve1: newMonetaryAmount(5, WRAPPED_TOKEN, true)
  },
  input: RELAY_CHAIN_NATIVE_TOKEN,
  output: WRAPPED_TOKEN,
  type: MultiPathElementType.STANDARD,
  pool: LIQUIDITY_POOL_B
};

const TRADE = new Trade([MULTI_PATH_ELEMENT], TRADE_AMOUNT.INPUT, TRADE_AMOUNT.OUTPUT);

jest.spyOn(TRADE, 'getMinimumOutputAmount').mockReturnValue(TRADE_AMOUNT.OUTPUT);

const DATA = {
  LP_TOKEN_A,
  LP_TOKEN_B,
  LP_TOKEN_EMPTY,
  LIQUIDITY_POOLS: {
    ONE: LIQUIDITY_POOL_A,
    TWO: LIQUIDITY_POOL_B,
    EMPTY: EMPTY_LIQUIDITY_POOL
  },
  ACCOUNT_LIQUIDITY: {
    EMPTY: ACCOUNT_EMPTY_LIQUIDITY,
    AVERAGE: ACCOUNT_AVERAGE_LIQUIDITY,
    FULL: ACCOUNT_FULL_LIQUIDITY
  },
  CLAIMABLE_REWARDS,
  TRADE
};

const MODULE: Record<keyof AMMAPI, jest.Mock<any, any>> = {
  getLiquidityPools: jest.fn().mockResolvedValue(LIQUIDITY_POOLS),
  getLiquidityProvidedByAccount: jest.fn().mockResolvedValue(ACCOUNT_EMPTY_LIQUIDITY),
  getClaimableFarmingRewards: jest.fn().mockResolvedValue(CLAIMABLE_REWARDS),
  getLpTokens: jest.fn().mockResolvedValue(LP_TOKENS),
  getOptimalTrade: jest.fn().mockReturnValue(TRADE),
  // MUTATIONS
  addLiquidity: jest.fn().mockResolvedValue(EXTRINSIC_DATA),
  removeLiquidity: jest.fn().mockResolvedValue(EXTRINSIC_DATA),
  claimFarmingRewards: jest.fn().mockResolvedValue(EXTRINSIC_DATA),
  swap: jest.fn().mockResolvedValue(EXTRINSIC_DATA)
};

const MOCK_AMM = {
  DATA,
  MODULE
};

export { MOCK_AMM };
