import { ExtrinsicData } from '@interlay/interbtc-api';

import { DEFAULT_PROXY_ACCOUNT_AMOUNT, PROXY_ACCOUNT_RESERVE_AMOUNT } from '@/utils/constants/account';
import { proxifyExtrinsic } from '@/utils/helpers/extrinsic';

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
    case Transaction.LOANS_REPAY_ALL: {
      const [underlyingCurrency] = params.args;
      return window.bridge.loans.repayAll(underlyingCurrency);
    }
    case Transaction.LOANS_WITHDRAW:
      return window.bridge.loans.withdraw(...params.args);
    case Transaction.LOANS_WITHDRAW_ALL: {
      const [underlyingCurrency] = params.args;
      return window.bridge.loans.withdrawAll(underlyingCurrency);
    }
    case Transaction.LOANS_DISABLE_COLLATERAL:
      return window.bridge.loans.disableAsCollateral(...params.args);
    case Transaction.LOANS_ENABLE_COLLATERAL:
      return window.bridge.loans.enableAsCollateral(...params.args);
    /* END - LOANS */

    /* START - STRATEGIES */
    case Transaction.STRATEGIES_INITIALIZE_PROXY: {
      // Initialize 10 proxy accounts and then if we deposit for the first time, the proxy
      // account will be assigned and stored in identity pallet.
      const createProxiesExtrinsics = [...Array(DEFAULT_PROXY_ACCOUNT_AMOUNT).keys()].map((index) =>
        window.bridge.api.tx.proxy.createPure('Any', 0, index)
      );
      const batchedExtrinsics = window.bridge.transaction.buildBatchExtrinsic(createProxiesExtrinsics);

      return { extrinsic: batchedExtrinsics };
    }
    // Since we use proxy accounts for strategies, first argument is always proxy account for which
    // the action should be performed - this account must be passed.
    // Second argument is always boolean denoting if the proxy account identity was set or not.
    case Transaction.STRATEGIES_DEPOSIT: {
      const [strategyType, proxyAccount, isIdentitySet, ...args] = params.args;
      const [, depositAmount] = args;

      const transferExtrinsic = window.bridge.tokens.transfer(proxyAccount.toString(), depositAmount);

      const strategyDepositExtrinsic = (await window.bridge.loans.lend(...args)).extrinsic;
      const proxiedStrategyDepositExtrinsic = proxifyExtrinsic(proxyAccount, strategyDepositExtrinsic);

      if (isIdentitySet) {
        const batchedExtrinsics = window.bridge.transaction.buildBatchExtrinsic([
          transferExtrinsic.extrinsic,
          proxiedStrategyDepositExtrinsic
        ]);

        return { extrinsic: batchedExtrinsics };
      } else {
        const identityLockAmountTransferExtrinsic = window.bridge.tokens.transfer(
          proxyAccount.toString(),
          PROXY_ACCOUNT_RESERVE_AMOUNT
        );
        const strategyAccountIdentity = {
          additional: [[{ Raw: 'strategyType' }, { Raw: strategyType }]]
        };
        const setIdentityExtrinsic = window.bridge.api.tx.identity.setIdentity(strategyAccountIdentity);
        const proxiedSetIdentityExtrinsic = proxifyExtrinsic(proxyAccount, setIdentityExtrinsic);

        const batchedExtrinsicsWithIdentity = window.bridge.transaction.buildBatchExtrinsic([
          identityLockAmountTransferExtrinsic.extrinsic,
          proxiedSetIdentityExtrinsic,
          transferExtrinsic.extrinsic,
          proxiedStrategyDepositExtrinsic
        ]);

        return { extrinsic: batchedExtrinsicsWithIdentity };
      }
    }

    case Transaction.STRATEGIES_WITHDRAW: {
      const primaryAccount = window.bridge.account;
      if (!primaryAccount) {
        throw new Error('Strategy primary account not found.');
      }

      const [, proxyAccount, ...args] = params.args;
      const [, withdrawalAmount] = args;

      const strategyWithdrawalExtrinsic = (await window.bridge.loans.withdraw(...args)).extrinsic;
      const proxiedStrategyWithdrawExtrinsic = proxifyExtrinsic(proxyAccount, strategyWithdrawalExtrinsic);

      const transferExtrinsic = window.bridge.tokens.transfer(primaryAccount.toString(), withdrawalAmount).extrinsic;
      const proxiedTransferExtrinsic = proxifyExtrinsic(proxyAccount, transferExtrinsic);

      const batchExtrinsic = window.bridge.transaction.buildBatchExtrinsic([
        proxiedStrategyWithdrawExtrinsic,
        proxiedTransferExtrinsic
      ]);

      return { extrinsic: batchExtrinsic };
    }

    case Transaction.STRATEGIES_ALL_WITHDRAW: {
      const primaryAccount = window.bridge.account;
      if (!primaryAccount) {
        throw new Error('Primary account not found.');
      }

      const [, proxyAccount, underlyingCurrency, withdrawalAmount] = params.args;

      const clearIdentityExtrinsic = window.bridge.api.tx.identity.clearIdentity();

      const transferIdentityReserveAmount = window.bridge.tokens.transfer(
        primaryAccount.toString(),
        PROXY_ACCOUNT_RESERVE_AMOUNT
      ).extrinsic;

      const strategyWithdrawalExtrinsic = (await window.bridge.loans.withdrawAll(underlyingCurrency)).extrinsic;

      const transferExtrinsic = window.bridge.tokens.transfer(primaryAccount.toString(), withdrawalAmount).extrinsic;

      const batchExtrinsic = window.bridge.transaction.buildBatchExtrinsic([
        clearIdentityExtrinsic,
        transferIdentityReserveAmount,
        strategyWithdrawalExtrinsic,
        transferExtrinsic
      ]);

      const proxiedBatchExtrinsic = proxifyExtrinsic(proxyAccount, batchExtrinsic);

      return { extrinsic: proxiedBatchExtrinsic };
    }
    /* END - STRATEGIES */

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
        window.bridge.api.tx.escrow.increaseAmount(amount.toString(true)),
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
