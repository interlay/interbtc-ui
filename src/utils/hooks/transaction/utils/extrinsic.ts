import { ExtrinsicData } from '@interlay/interbtc-api';
import { ExtrinsicStatus } from '@polkadot/types/interfaces';

import { Transaction, TransactionActions } from '../types';

/**
 * Maps each transaction to the correct lib call,
 * while maintaining a safe-type check just like in redux
 * @param {TransactionActions} params contains the type of transaction and
 * the related args to call the mapped lib call
 * @return {Promise<ExtrinsicData>} every transaction return an extrinsic
 */
const getExtrinsic = async ({ type, args }: TransactionActions): Promise<ExtrinsicData> => {
  switch (type) {
    /* START - AMM */
    case Transaction.SWAP:
      return window.bridge.amm.swap(...args);
    case Transaction.POOL_ADD_LIQUIDITY:
      return window.bridge.amm.addLiquidity(...args);
    case Transaction.POOL_REMOVE_LIQUIDITY:
      return window.bridge.amm.removeLiquidity(...args);
    case Transaction.POOL_CLAIM_REWARDS:
      return window.bridge.amm.claimFarmingRewards(...args);
    /* END - AMM */

    /* START - ISSUE */
    case Transaction.ISSUE_REQUEST:
      return window.bridge.issue.request(...args);
    case Transaction.ISSUE_EXECUTE:
      return window.bridge.issue.execute(...args);
    /* END - ISSUE */

    /* START - REDEEM */
    case Transaction.REDEEM_CANCEL:
      return window.bridge.redeem.cancel(...args);
    case Transaction.REDEEM_BURN:
      return window.bridge.redeem.burn(...args);
    case Transaction.REDEEM_REQUEST:
      return window.bridge.redeem.request(...args);
    /* END - REDEEM */

    /* START - REPLACE */
    case Transaction.REPLACE_REQUEST:
      return window.bridge.replace.request(...args);
    /* END - REPLACE */

    /* START - TOKENS */
    case Transaction.TRANSFER:
      return window.bridge.tokens.transfer(...args);
    /* END - TOKENS */

    /* START - LOANS */
    case Transaction.LOANS_CLAIM_REWARDS:
      return window.bridge.loans.claimAllSubsidyRewards();
    case Transaction.LOANS_BORROW:
      return window.bridge.loans.borrow(...args);
    case Transaction.LOANS_LEND:
      return window.bridge.loans.lend(...args);
    case Transaction.LOANS_REPAY:
      return window.bridge.loans.repay(...args);
    case Transaction.LOANS_REPAY_ALL:
      return window.bridge.loans.repayAll(...args);
    case Transaction.LOANS_WITHDRAW:
      return window.bridge.loans.withdraw(...args);
    case Transaction.LOANS_WITHDRAW_ALL:
      return window.bridge.loans.withdrawAll(...args);
    case Transaction.LOANS_DISABLED_COLLATERAL:
      return window.bridge.loans.disableAsCollateral(...args);
    case Transaction.LOANS_ENABLED_COLLATERAL:
      return window.bridge.loans.enableAsCollateral(...args);
    /* END - LOANS */

    /* START - LOANS */
    case Transaction.VAULTS_DEPOSIT_COLLATERAL:
      return window.bridge.vaults.depositCollateral(...args);
    case Transaction.VAULTS_WITHDRAW_COLLATERAL:
      return window.bridge.vaults.withdrawCollateral(...args);
    case Transaction.VAULTS_REGISTER_NEW_COLLATERAL:
      return window.bridge.vaults.registerNewCollateralVault(...args);
    case Transaction.VAULT_WITHDRAW_REWARDS:
      return window.bridge.rewards.withdrawRewards(...args);
    /* END - LOANS */

    /* START - ESCROW */
    case Transaction.ESCROW_CREATE_LOCK:
      return window.bridge.escrow.createLock(...args);
    case Transaction.ESCROW_INCREASE_LOCKED_AMOUNT:
      return window.bridge.escrow.increaseAmount(...args);
    case Transaction.ESCROW_INCREASE_LOCKED_TIME:
      return window.bridge.escrow.increaseUnlockHeight(...args);
    case Transaction.ESCROW_WITHDRAW:
      return window.bridge.escrow.withdraw(...args);
    case Transaction.ESCROW_WITHDRAW_REWARDS:
      return window.bridge.escrow.withdrawRewards(...args);
    case Transaction.ESCROW_INCREASE_LOOKED_TIME_AND_AMOUNT: {
      const [amount, unlockHeight] = args;
      const txs = [
        window.bridge.api.tx.escrow.increaseAmount(amount),
        window.bridge.api.tx.escrow.increaseUnlockHeight(unlockHeight)
      ];
      const batch = window.bridge.api.tx.utility.batchAll(txs);

      return { extrinsic: batch };
    }
    /* END - ESCROW */
  }
};

/**
 * The status where we want to be notified on the transaction completion
 * @param {Transaction} type type of transaction
 * @return {ExtrinsicStatus.type} transaction status
 */
const getExpectedStatus = (type: Transaction): ExtrinsicStatus['type'] => {
  switch (type) {
    case Transaction.ISSUE_REQUEST:
    case Transaction.REDEEM_REQUEST:
    case Transaction.REPLACE_REQUEST:
      return 'Finalized';
    default:
      return 'InBlock';
  }
};

export { getExpectedStatus, getExtrinsic };
