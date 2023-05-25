import { InterBtcApi } from '@interlay/interbtc-api';

import { Transaction } from '../types';
import { TransactionAction } from '.';

interface SwapAction extends TransactionAction {
  type: Transaction.AMM_SWAP;
  args: Parameters<InterBtcApi['amm']['swap']>;
}

interface PoolAddLiquidityAction extends TransactionAction {
  type: Transaction.AMM_ADD_LIQUIDITY;
  args: Parameters<InterBtcApi['amm']['addLiquidity']>;
}

interface PoolRemoveLiquidityAction extends TransactionAction {
  type: Transaction.AMM_REMOVE_LIQUIDITY;
  args: Parameters<InterBtcApi['amm']['removeLiquidity']>;
}

interface PoolClaimRewardsAction extends TransactionAction {
  type: Transaction.AMM_CLAIM_REWARDS;
  args: Parameters<InterBtcApi['amm']['claimFarmingRewards']>;
}

type AMMActions = SwapAction | PoolAddLiquidityAction | PoolRemoveLiquidityAction | PoolClaimRewardsAction;

export type { AMMActions };
