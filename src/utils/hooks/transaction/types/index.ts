import { AMMActions } from './amm';
import { EscrowActions } from './escrow';
import { IssueActions } from './issue';
import { LoansActions } from './loans';
import { RedeemActions } from './redeem';
import { ReplaceActions } from './replace';
import { TokensActions } from './tokens';
import { VaultsActions } from './vaults';

enum Transaction {
  // Issue
  ISSUE_REQUEST = 'issue-request',
  ISSUE_EXECUTE = 'issue-execute',
  // Redeem
  REDEEM_REQUEST = 'redeem-request',
  REDEEM_CANCEL = 'redeem-cancel',
  REDEEM_BURN = 'redeem-burn',
  // Replace
  REPLACE_REQUEST = 'replace-request',
  // Escrow
  ESCROW_CREATE_LOCK = 'escrow-create-lock',
  ESCROW_INCREASE_LOCKED_TIME = 'escrow-inscrease-locked-time',
  ESCROW_INCREASE_LOCKED_AMOUNT = 'escrow-inscrease-locked-amount',
  ESCROW_INCREASE_LOOKED_TIME_AND_AMOUNT = 'escrow-inscrease-locked-time-and-amount',
  ESCROW_WITHDRAW_REWARDS = 'escrow-withdraw-rewards',
  ESCROW_WITHDRAW = 'escrow-withdraw',
  // Tokens
  TRANSFER = 'transfer',
  // Vaults
  VAULTS_DEPOSIT_COLLATERAL = 'vaults-deposit-collateral',
  VAULTS_WITHDRAW_COLLATERAL = 'vaults-withdraw-collateral',
  VAULTS_REGISTER_NEW_COLLATERAL = 'vaults-register-new-collateral',
  VAULT_WITHDRAW_REWARDS = 'vault-withdraw-rewards',
  // Loans
  LOANS_CLAIM_REWARDS = 'loans-claim-rewards',
  LOANS_ENABLED_COLLATERAL = 'loans-enabled-collateral',
  LOANS_DISABLED_COLLATERAL = 'loans-disabled-collateral',
  LOANS_LEND = 'loans-lend',
  LOANS_WITHDRAW = 'loans-withdraw',
  LOANS_WITHDRAW_ALL = 'loans-withdraw-all',
  LOANS_BORROW = 'loans-borrow',
  LOANS_REPAY = 'loans-repay',
  LOANS_REPAY_ALL = 'loans-repay-all',
  // AMM
  SWAP = 'swap',
  POOL_ADD_LIQUIDITY = 'pool-add-liquidity',
  POOL_REMOVE_LIQUIDITY = 'pool-remove-liquidity',
  POOL_CLAIM_REWARDS = 'pool-claim-rewards'
}

type TransactionEvents = {
  onSigning?: () => void;
};

interface TransactionAction {
  accountAddress: string;
  events: TransactionEvents;
}

type TransactionActions =
  | EscrowActions
  | IssueActions
  | RedeemActions
  | ReplaceActions
  | TokensActions
  | LoansActions
  | AMMActions
  | VaultsActions;

type TransactionArgs<T extends Transaction> = Extract<TransactionActions, { type: T }>['args'];

export { Transaction };
export type { TransactionAction, TransactionActions, TransactionArgs, TransactionEvents };
