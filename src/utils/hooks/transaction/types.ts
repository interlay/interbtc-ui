import { InterBtcApi } from '@interlay/interbtc-api';

enum Transaction {
  // AMM
  SWAP = 'swap',
  POOL_ADD_LIQUIDITY = 'pool-add-liquidity',
  POOL_REMOVE_LIQUIDITY = 'pool-remove-liquidity',
  POOL_CLAIM_REWARDS = 'pool-claim-rewards',
  // Issue
  ISSUE_REQUEST = 'issue-request',
  // Redeem
  REDEEM_REQUEST = 'redeem-request',
  REDEEM_CANCEL = 'redeem-cancel',
  REDEEM_BURN = 'redeem-burn'
}

type TransactionEvents = {
  onSigning?: () => void;
};

interface TransactionAction {
  accountAddress: string;
  events: TransactionEvents;
}

interface SwapTransaction extends TransactionAction {
  type: Transaction.SWAP;
  args: Parameters<InterBtcApi['amm']['swap']>;
}

interface PoolAddLiquidityTransaction extends TransactionAction {
  type: Transaction.POOL_ADD_LIQUIDITY;
  args: Parameters<InterBtcApi['amm']['addLiquidity']>;
}

interface PoolRemoveLiquidityTransaction extends TransactionAction {
  type: Transaction.POOL_REMOVE_LIQUIDITY;
  args: Parameters<InterBtcApi['amm']['removeLiquidity']>;
}

interface PoolClaimRewardsTransaction extends TransactionAction {
  type: Transaction.POOL_CLAIM_REWARDS;
  args: Parameters<InterBtcApi['amm']['claimFarmingRewards']>;
}

type TransactionActions =
  | SwapTransaction
  | PoolAddLiquidityTransaction
  | PoolRemoveLiquidityTransaction
  | PoolClaimRewardsTransaction;

type TransactionArgs<T extends Transaction> = Extract<TransactionActions, { type: T }>['args'];

export type { TransactionActions, TransactionArgs, TransactionEvents };
export { Transaction };
