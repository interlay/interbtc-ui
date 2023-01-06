import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';

enum PoolType {
  STANDARD = 'STANDARD',
  STABLE = 'STABLE'
}

enum TradeType {
  EXACT_OUTPUT = 'EXACT_OUTPUT',
  EXACT_INPUT = 'EXACT_INPUT'
}

type LPToken = CurrencyExt; // TODO: specify when the currencies are refactored to have LP token type

type PooledCurrencies = Array<MonetaryAmount<CurrencyExt>>;

interface LiquidityPool {
  type: PoolType;
  lpToken: LPToken;
  pooledCurrencies: PooledCurrencies; // Array of 2 for standard pools, array of 2+ for stable pools.
  apr: string; // Percentage.
  tradingFee: string; // Percentage.
  poolId: number;
}

interface PathElement {
  tokenIn: CurrencyExt;
  tokenOut: CurrencyExt;
  poolType: PoolType;
  poolId: number;
}

type TradePath = Array<PathElement>;

// TODO: Consider creating class for OptimalTrade object.
interface OptimalTrade {
  path: TradePath; // Is empty array if no path was found.
  executionPrice: Big;
  priceImpact: string; // Percentage.
  estimatedOtherAmount: MonetaryAmount<CurrencyExt>;
}

export { PoolType };

export type { LiquidityPool, OptimalTrade, TradeType };
