import { ExtrinsicStatus } from '@polkadot/types/interfaces';

import { AMMActions } from './amm';
import { EscrowActions } from './escrow';
import { IssueActions } from './issue';
import { LoansActions } from './loans';
import { RedeemActions } from './redeem';
import { ReplaceActions } from './replace';
import { RewardsActions } from './rewards';
import { StrategiesActions } from './strategies';
import { TokensActions } from './tokens';
import { VaultsActions } from './vaults';
import { VestingActions } from './vesting';
import { XCMActions } from './xcm';

enum Transaction {
  // Issue
  ISSUE_REQUEST = 'ISSUE_REQUEST',
  ISSUE_EXECUTE = 'ISSUE_EXECUTE',
  // Redeem
  REDEEM_REQUEST = 'REDEEM_REQUEST',
  REDEEM_CANCEL = 'REDEEM_CANCEL',
  REDEEM_BURN = 'REDEEM_BURN',
  // Replace
  REPLACE_REQUEST = 'REPLACE_REQUEST',
  // Escrow
  ESCROW_CREATE_LOCK = 'ESCROW_CREATE_LOCK',
  ESCROW_INCREASE_LOCKED_TIME = 'ESCROW_INCREASE_LOCKED_TIME',
  ESCROW_INCREASE_LOCKED_AMOUNT = 'ESCROW_INCREASE_LOCKED_AMOUNT',
  ESCROW_INCREASE_LOOKED_TIME_AND_AMOUNT = 'ESCROW_INCREASE_LOOKED_TIME_AND_AMOUNT',
  ESCROW_WITHDRAW_REWARDS = 'ESCROW_WITHDRAW_REWARDS',
  ESCROW_WITHDRAW = 'ESCROW_WITHDRAW',
  // Tokens
  TOKENS_TRANSFER = 'TOKENS_TRANSFER',
  // XCM
  XCM_TRANSFER = 'XCM_TRANSFER',
  // Vaults
  VAULTS_DEPOSIT_COLLATERAL = 'VAULTS_DEPOSIT_COLLATERAL',
  VAULTS_WITHDRAW_COLLATERAL = 'VAULTS_WITHDRAW_COLLATERAL',
  VAULTS_REGISTER_NEW_COLLATERAL = 'VAULTS_REGISTER_NEW_COLLATERAL',
  // Rewards
  REWARDS_WITHDRAW = 'REWARDS_WITHDRAW',
  // Loans
  LOANS_CLAIM_REWARDS = 'LOANS_CLAIM_REWARDS',
  LOANS_ENABLE_COLLATERAL = 'LOANS_ENABLE_COLLATERAL',
  LOANS_DISABLE_COLLATERAL = 'LOANS_DISABLE_COLLATERAL',
  LOANS_LEND = 'LOANS_LEND',
  LOANS_WITHDRAW = 'LOANS_WITHDRAW',
  LOANS_WITHDRAW_ALL = 'LOANS_WITHDRAW_ALL',
  LOANS_BORROW = 'LOANS_BORROW',
  LOANS_REPAY = 'LOANS_REPAY',
  LOANS_REPAY_ALL = 'LOANS_REPAY_ALL',
  // Stategies
  STRATEGIES_DEPOSIT = 'STRATEGIES_DEPOSIT',
  STRATEGIES_WITHDRAW = 'STRATEGIES_WITHDRAW',
  STRATEGIES_ALL_WITHDRAW = 'STRATEGIES_ALL_WITHDRAW',
  // AMM
  AMM_SWAP = 'AMM_SWAP',
  AMM_ADD_LIQUIDITY = 'AMM_ADD_LIQUIDITY',
  AMM_REMOVE_LIQUIDITY = 'AMM_REMOVE_LIQUIDITY',
  AMM_CLAIM_REWARDS = 'AMM_CLAIM_REWARDS',
  // Vesting
  VESTING_CLAIM = 'VESTING_CLAIM',
  // Faucet
  FAUCET_FUND_WALLET = 'FAUCET_FUND_WALLET'
}

type TransactionEvents = {
  onReady?: () => void;
};

interface TransactionAction {
  accountAddress: string;
  timestamp: number;
  customStatus?: ExtrinsicStatus['type'];
}

type LibActions =
  | EscrowActions
  | IssueActions
  | RedeemActions
  | ReplaceActions
  | TokensActions
  | LoansActions
  | StrategiesActions
  | AMMActions
  | VaultsActions
  | RewardsActions
  | VestingActions;

type Actions = XCMActions | LibActions;

type TransactionActions = Actions & TransactionAction;

type TransactionArgs<T extends Transaction> = Extract<TransactionActions, { type: T }>['args'];

enum TransactionStatus {
  CONFIRM,
  SUBMITTING,
  SUCCESS,
  ERROR
}

export { Transaction, TransactionStatus };
export type {
  Actions,
  LibActions,
  TransactionAction,
  TransactionActions,
  TransactionArgs,
  TransactionEvents,
  XCMActions
};
