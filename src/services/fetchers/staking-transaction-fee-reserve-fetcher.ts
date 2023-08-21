import { newMonetaryAmount } from '@interlay/interbtc-api';
import { AddressOrPair } from '@polkadot/api/types';

import { GOVERNANCE_TOKEN, GovernanceTokenMonetaryAmount } from '@/config/relay-chains';

const STAKING_TRANSACTION_FEE_RESERVE_FETCHER = 'stakingTransactionFeeReserve';

const stakingTransactionFeeReserveFetcher = (
  account: AddressOrPair
) => async (): Promise<GovernanceTokenMonetaryAmount> => {
  try {
    const transactions = [window.bridge.api.tx.escrow.withdraw(), window.bridge.api.tx.escrowAnnuity.withdrawRewards()];
    const transactionsPaymentInfo = await window.bridge.api.tx.utility.batchAll(transactions).paymentInfo(account);
    return newMonetaryAmount(transactionsPaymentInfo.partialFee.toString(), GOVERNANCE_TOKEN);
  } catch {
    // If the paymentInfo call is not enabled in current environment, return constant 0.1 tx fee amount.
    return newMonetaryAmount(0.1, GOVERNANCE_TOKEN, true);
  }
};

export { STAKING_TRANSACTION_FEE_RESERVE_FETCHER, stakingTransactionFeeReserveFetcher };
