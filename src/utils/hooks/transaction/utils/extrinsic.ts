import { FixedPointNumber } from '@acala-network/sdk-core';
import { CrossChainTransferParams } from '@interlay/bridge';
import { ExtrinsicData } from '@interlay/interbtc-api';
import { ExtrinsicStatus } from '@polkadot/types/interfaces';

import { Transaction, TransactionActions } from '../types';

/**
 * SUMMARY: Maps each transaction to the correct lib call,
 * while maintaining a safe-type check.
 * HOW TO ADD NEW TRANSACTION: find the correct module to add the transaction
 * in the types folder. In case you are adding a new type to the loans modules, go
 * to types/loans and add your new transaction as an action. This actions needs to also be added to the
 * types/index TransactionActions type. After that, you should be able to add it to the function.
 * @param {TransactionActions} params contains the type of transaction and
 * the related args to call the mapped lib call
 * @return {Promise<ExtrinsicData>} every transaction return an extrinsic
 */
const getExtrinsic = async (params: TransactionActions): Promise<ExtrinsicData> => {
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

    /* START - XCM */
    case Transaction.XCM_TRANSFER: {
      const [adapter, , toChain, address, transferAmount] = params.args;

      const transferAmountString = transferAmount.toString(true);
      const transferAmountDecimals = transferAmount.currency.decimals;
      const tx = adapter.createTx({
        amount: FixedPointNumber.fromInner(transferAmountString, transferAmountDecimals),
        to: toChain,
        token: transferAmount.currency.ticker,
        address
      } as CrossChainTransferParams);

      return { extrinsic: tx };
    }
    /* END - XCM */

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

/**
 * The status where we want to be notified on the transaction completion
 * @param {Transaction} type type of transaction
 * @return {ExtrinsicStatus.type} transaction status
 */
const getStatus = (type: Transaction): ExtrinsicStatus['type'] => {
  switch (type) {
    // When requesting a replace, wait for the finalized event because we cannot revert BTC transactions.
    // For more details see: https://github.com/interlay/interbtc-api/pull/373#issuecomment-1058949000
    case Transaction.ISSUE_REQUEST:
    case Transaction.REDEEM_REQUEST:
    case Transaction.REPLACE_REQUEST:
      return 'Finalized';
    default:
      return 'InBlock';
  }
};

export { getExtrinsic, getStatus };
