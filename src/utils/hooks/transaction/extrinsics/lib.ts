import { ExtrinsicData } from '@interlay/interbtc-api';

import { LibActions, Transaction } from '../types';

const getLibExtrinsic = async (params: LibActions): Promise<ExtrinsicData> => {
  switch (params.type) {
    /* START - AMM */
    case Transaction.AMM_SWAP:
      return window.bridge.amm.swap(...params.args);
    case Transaction.AMM_ADD_LIQUIDITY:
      return window.bridge.amm.addLiquidity(...params.args);
    case Transaction.AMM_REMOVE_LIQUIDITY:
      return window.bridge.amm.removeLiquidity(...params.args);
    case Transaction.AMM_CLAIM_REWARDS:
      return window.bridge.amm.claimFarmingRewards(...params.args);
    /* END - AMM */

    /* START - ISSUE */
    case Transaction.ISSUE_REQUEST:
      return window.bridge.issue.request(...params.args);
    case Transaction.ISSUE_EXECUTE:
      return window.bridge.issue.execute(...params.args);
    /* END - ISSUE */

    /* START - REDEEM */
    case Transaction.REDEEM_CANCEL:
      return window.bridge.redeem.cancel(...params.args);
    case Transaction.REDEEM_BURN:
      return window.bridge.redeem.burn(...params.args);
    case Transaction.REDEEM_REQUEST:
      return window.bridge.redeem.request(...params.args);
    /* END - REDEEM */

    /* START - REPLACE */
    case Transaction.REPLACE_REQUEST:
      return window.bridge.replace.request(...params.args);
    /* END - REPLACE */

    /* START - TOKENS */
    case Transaction.TOKENS_TRANSFER:
      return window.bridge.tokens.transfer(...params.args);
    /* END - TOKENS */

    /* START - LOANS */
    case Transaction.LOANS_CLAIM_REWARDS:
      return window.bridge.loans.claimAllSubsidyRewards();
    case Transaction.LOANS_BORROW:
      return window.bridge.loans.borrow(...params.args);
    case Transaction.LOANS_LEND:
      return window.bridge.loans.lend(...params.args);
    case Transaction.LOANS_REPAY:
      return window.bridge.loans.repay(...params.args);
    case Transaction.LOANS_REPAY_ALL:
      return window.bridge.loans.repayAll(...params.args);
    case Transaction.LOANS_WITHDRAW:
      return window.bridge.loans.withdraw(...params.args);
    case Transaction.LOANS_WITHDRAW_ALL:
      return window.bridge.loans.withdrawAll(...params.args);
    case Transaction.LOANS_DISABLE_COLLATERAL:
      return window.bridge.loans.disableAsCollateral(...params.args);
    case Transaction.LOANS_ENABLE_COLLATERAL:
      return window.bridge.loans.enableAsCollateral(...params.args);
    /* END - LOANS */

    /* START - VAULTS */
    case Transaction.VAULTS_DEPOSIT_COLLATERAL:
      return window.bridge.vaults.depositCollateral(...params.args);
    case Transaction.VAULTS_WITHDRAW_COLLATERAL:
      return window.bridge.vaults.withdrawCollateral(...params.args);
    case Transaction.VAULTS_REGISTER_NEW_COLLATERAL:
      return window.bridge.vaults.registerNewCollateralVault(...params.args);
    /* END - VAULTS */

    /* START - REWARDS */
    case Transaction.REWARDS_WITHDRAW:
      return window.bridge.rewards.withdrawRewards(...params.args);
    /* START - REWARDS */

    /* START - ESCROW */
    case Transaction.ESCROW_CREATE_LOCK:
      return window.bridge.escrow.createLock(...params.args);
    case Transaction.ESCROW_INCREASE_LOCKED_AMOUNT:
      return window.bridge.escrow.increaseAmount(...params.args);
    case Transaction.ESCROW_INCREASE_LOCKED_TIME:
      return window.bridge.escrow.increaseUnlockHeight(...params.args);
    case Transaction.ESCROW_WITHDRAW:
      return window.bridge.escrow.withdraw(...params.args);
    case Transaction.ESCROW_WITHDRAW_REWARDS:
      return window.bridge.escrow.withdrawRewards(...params.args);
    case Transaction.ESCROW_INCREASE_LOOKED_TIME_AND_AMOUNT: {
      const [amount, unlockHeight] = params.args;
      const txs = [
        window.bridge.api.tx.escrow.increaseAmount(amount),
        window.bridge.api.tx.escrow.increaseUnlockHeight(unlockHeight)
      ];
      const batch = window.bridge.api.tx.utility.batchAll(txs);

      return { extrinsic: batch };
    }
    /* END - ESCROW */

    /* START - VESTING */
    case Transaction.VESTING_CLAIM:
      return { extrinsic: window.bridge.api.tx.vesting.claim() };
    /* END - VESTING */
  }
};

export { getLibExtrinsic };
