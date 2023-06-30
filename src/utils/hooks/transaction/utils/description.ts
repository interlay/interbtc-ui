import { StringMap, TOptions } from 'i18next';
import { TFunction } from 'react-i18next';

import { shortAddress } from '@/common/utils/utils';

import { Transaction, TransactionActions, TransactionStatus } from '../types';

const getTranslationArgs = (
  params: TransactionActions,
  status: TransactionStatus
): { key: string; args?: TOptions<StringMap> } | undefined => {
  const isPast = status === TransactionStatus.SUCCESS;

  switch (params.type) {
    /* START - AMM */
    case Transaction.AMM_SWAP: {
      const [trade] = params.args;

      return {
        key: isPast ? 'transaction.swapped_to' : 'transaction.swapping_to',
        args: {
          fromAmount: trade.inputAmount.toHuman(),
          fromCurrency: trade.inputAmount.currency.ticker,
          toAmount: trade.outputAmount.toHuman(),
          toCurrency: trade.outputAmount.currency.ticker
        }
      };
    }
    case Transaction.AMM_ADD_LIQUIDITY: {
      const [, pool] = params.args;

      return {
        key: isPast ? 'transaction.added_liquidity_to_pool' : 'transaction.adding_liquidity_to_pool',
        args: {
          poolName: pool.lpToken.ticker
        }
      };
    }
    case Transaction.AMM_REMOVE_LIQUIDITY: {
      const [, pool] = params.args;

      return {
        key: isPast ? 'transaction.removed_liquidity_from_pool' : 'transaction.removing_liquidity_from_pool',
        args: {
          poolName: pool.lpToken.ticker
        }
      };
    }
    case Transaction.AMM_CLAIM_REWARDS: {
      return {
        key: isPast ? 'transaction.claimed_pool_rewards' : 'transaction.claiming_pool_rewards'
      };
    }
    /* END - AMM */

    /* START - ISSUE */
    case Transaction.ISSUE_REQUEST: {
      const [amount] = params.args;

      return {
        key: isPast ? 'transaction.issued_amount' : 'transaction.issuing_amount',
        args: {
          amount: amount.toHuman(),
          currency: amount.currency.ticker
        }
      };
    }
    case Transaction.ISSUE_EXECUTE: {
      return {
        key: isPast ? 'transaction.executed_issue' : 'transaction.executing_issue'
      };
    }
    /* END - ISSUE */

    /* START - REDEEM */
    case Transaction.REDEEM_CANCEL: {
      const [redeemId, isReimburse] = params.args;

      const args = {
        requestId: shortAddress(redeemId)
      };

      if (isReimburse) {
        return {
          key: isPast ? 'transaction.reimbersed_redeem_id' : 'transaction.reimbursing_redeem_id',
          args
        };
      }

      return {
        key: isPast ? 'transaction.retried_redeem_id' : 'transaction.retrying_redeem_id',
        args
      };
    }
    case Transaction.REDEEM_BURN: {
      const [amount] = params.args;

      return {
        key: isPast ? 'transaction.burned_amount' : 'transaction.burning_amount',
        args: {
          amount: amount.toHuman(),
          currency: amount.currency.ticker
        }
      };
    }
    case Transaction.REDEEM_REQUEST: {
      const [amount] = params.args;

      return {
        key: isPast ? 'transaction.redeemed_amount' : 'transaction.redeeming_amount',
        args: {
          amount: amount.toHuman(),
          currency: amount.currency.ticker
        }
      };
    }
    /* END - REDEEM */

    /* START - REPLACE */
    case Transaction.REPLACE_REQUEST: {
      return {
        key: isPast ? 'transaction.requested_vault_replacement' : 'transaction.requesting_vault_replacement'
      };
    }
    /* END - REPLACE */

    /* START - TOKENS */
    case Transaction.TOKENS_TRANSFER: {
      const [destination, amount] = params.args;

      return {
        key: isPast ? 'transaction.transferred_amount_to_address' : 'transaction.transferring_amount_to_address',
        args: {
          amount: amount.toHuman(),
          currency: amount.currency.ticker,
          address: shortAddress(destination)
        }
      };
    }
    /* END - TOKENS */

    /* START - XCM */
    case Transaction.XCM_TRANSFER: {
      const [, fromChain, toChain, , transferAmount] = params.args;

      return {
        key: isPast
          ? 'transaction.transferred_amount_from_chain_to_chain'
          : 'transaction.transferring_amount_from_chain_to_chain',
        args: {
          amount: transferAmount.toHuman(),
          currency: transferAmount.currency.ticker,
          fromChain: fromChain.toUpperCase(),
          toChain: toChain.toUpperCase()
        }
      };
    }
    /* END - XCM */

    /* START - LOANS */
    case Transaction.LOANS_CLAIM_REWARDS: {
      return {
        key: isPast ? 'transaction.claimed_lending_rewards' : 'transaction.claiming_lending_rewards'
      };
    }
    case Transaction.LOANS_BORROW: {
      const [currency, amount] = params.args;

      return {
        key: isPast ? 'transaction.borrowed_amount' : 'transaction.borrowing_amount',
        args: {
          amount: amount.toHuman(),
          currency: currency.ticker
        }
      };
    }
    case Transaction.LOANS_LEND: {
      const [currency, amount] = params.args;

      return {
        key: isPast ? 'transaction.lent_amount' : 'transaction.lending_amount',
        args: {
          amount: amount.toHuman(),
          currency: currency.ticker
        }
      };
    }
    case Transaction.LOANS_REPAY: {
      const [currency, amount] = params.args;

      return {
        key: isPast ? 'transaction.repaid_amount' : 'transaction.repaying_amount',
        args: {
          amount: amount.toHuman(),
          currency: currency.ticker
        }
      };
    }
    case Transaction.LOANS_REPAY_ALL: {
      const [currency] = params.args;

      return {
        key: isPast ? 'transaction.repaid' : 'transaction.repaying',
        args: {
          currency: currency.ticker
        }
      };
    }
    case Transaction.LOANS_WITHDRAW: {
      const [currency, amount] = params.args;

      return {
        key: isPast ? 'transaction.withdrew_amount' : 'transaction.withdrawing_amount',
        args: {
          amount: amount.toHuman(),
          currency: currency.ticker
        }
      };
    }
    case Transaction.LOANS_WITHDRAW_ALL: {
      const [currency] = params.args;

      return {
        key: isPast ? 'transaction.withdrew' : 'transaction.withdrawing',
        args: {
          currency: currency.ticker
        }
      };
    }
    case Transaction.LOANS_DISABLE_COLLATERAL: {
      const [currency] = params.args;

      return {
        key: isPast ? 'transaction.disabled_loan_as_collateral' : 'transaction.disabling_loan_as_collateral',
        args: {
          currency: currency.ticker
        }
      };
    }
    case Transaction.LOANS_ENABLE_COLLATERAL: {
      const [currency] = params.args;

      return {
        key: isPast ? 'transaction.enabled_loan_as_collateral' : 'transaction.enabling_loan_as_collateral',
        args: {
          currency: currency.ticker
        }
      };
    }
    /* END - LOANS */

    /* START - VAULTS */
    case Transaction.VAULTS_DEPOSIT_COLLATERAL: {
      const [amount] = params.args;

      return {
        key: isPast ? 'transaction.deposited_amount_to_vault' : 'transaction.depositing_amount_to_vault',
        args: {
          amount: amount.toHuman(),
          currency: amount.currency.ticker
        }
      };
    }
    case Transaction.VAULTS_WITHDRAW_COLLATERAL: {
      const [amount] = params.args;

      return {
        key: isPast ? 'transaction.withdrew_amount_from_vault' : 'transaction.withdrawing_amount_from_vault',
        args: {
          amount: amount.toHuman(),
          currency: amount.currency.ticker
        }
      };
    }
    case Transaction.VAULTS_REGISTER_NEW_COLLATERAL: {
      const [collateralAmount] = params.args;

      return {
        key: isPast ? 'transaction.created_currency_vault' : 'transaction.creating_currency_vault',
        args: {
          currency: collateralAmount.currency.ticker
        }
      };
    }
    /* END - VAULTS */

    /* START - REWARDS */
    case Transaction.REWARDS_WITHDRAW: {
      return {
        key: isPast ? 'transaction.claimed_vault_rewards' : 'transaction.claiming_vault_rewards'
      };
    }
    /* START - REWARDS */

    /* START - ESCROW */
    case Transaction.ESCROW_CREATE_LOCK: {
      const [amount] = params.args;

      return {
        key: isPast ? 'transaction.staked_amount' : 'transaction.staking_amount',
        args: {
          amount: amount.toHuman(),
          currency: amount.currency.ticker
        }
      };
    }
    case Transaction.ESCROW_INCREASE_LOCKED_AMOUNT: {
      const [amount] = params.args;

      return {
        key: isPast ? 'transaction.added_amount_to_staked_amount' : 'transaction.adding_amount_to_staked_amount',
        args: {
          amount: amount.toHuman(),
          currency: amount.currency.ticker
        }
      };
    }
    case Transaction.ESCROW_INCREASE_LOCKED_TIME: {
      return {
        key: isPast ? 'transaction.increased_stake_lock_time' : 'transaction.increasing_stake_lock_time'
      };
    }
    case Transaction.ESCROW_WITHDRAW: {
      return {
        key: isPast ? 'transaction.withdrew_stake' : 'transaction.withdrawing_stake'
      };
    }
    case Transaction.ESCROW_WITHDRAW_REWARDS: {
      return {
        key: isPast ? 'transaction.claimed_staking_rewards' : 'transaction.claiming_staking_rewards'
      };
    }
    case Transaction.ESCROW_INCREASE_LOOKED_TIME_AND_AMOUNT: {
      return {
        key: isPast
          ? 'transaction.increased_stake_locked_time_amount'
          : 'transaction.increasing_stake_locked_time_amount'
      };
    }
    /* END - ESCROW */
    /* START - VESTING */
    case Transaction.VESTING_CLAIM: {
      return {
        key: isPast ? 'transaction.claimed_vesting' : 'transaction.claiming_vesting'
      };
    }
    /* END - VESTING */
  }
};

const getTransactionDescription = (
  params: TransactionActions,
  status: TransactionStatus,
  t: TFunction
): string | undefined => {
  const translation = getTranslationArgs(params, status);

  if (!translation) return;

  return t(translation.key, translation.args);
};

export { getTransactionDescription };
