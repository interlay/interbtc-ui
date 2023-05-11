import { InterBtcApi } from '@interlay/interbtc-api';

enum Transaction {
  SWAP = 'swap',
  POOL_ADD_LIQUIDITY = 'pool-add-liquidity'
}

interface TransactionAction {
  timestamp: number;
  address: string;
}

interface SwapTransaction extends TransactionAction {
  type: Transaction.SWAP;
  args: Parameters<InterBtcApi['amm']['swap']>;
}

interface PoolAddLiquidityTransaction extends TransactionAction {
  type: Transaction.POOL_ADD_LIQUIDITY;
  args: Parameters<InterBtcApi['amm']['addLiquidity']>;
}

type TransactionActions = SwapTransaction | PoolAddLiquidityTransaction;

export type { TransactionActions };
export { Transaction };
