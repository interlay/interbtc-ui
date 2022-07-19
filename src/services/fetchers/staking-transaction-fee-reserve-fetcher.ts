import { newMonetaryAmount } from '@interlay/interbtc-api';
import { AddressOrPair } from '@polkadot/api/types';

import { GOVERNANCE_TOKEN, GovernanceTokenMonetaryAmount } from '@/config/relay-chains';

const STAKING_TRANSACTION_FEE_RESERVE_FETCHER = 'stakingTransactionFeeReserve';

const stakingTransactionFeeReserveFetcher = (
  account: AddressOrPair
) => async (): Promise<GovernanceTokenMonetaryAmount> => {
  const transactions = [window.bridge.api.tx.escrow.withdraw(), window.bridge.api.tx.escrowAnnuity.withdrawRewards()];
  const transactionsPaymentInfo = await window.bridge.api.tx.utility.batchAll(transactions).paymentInfo(account);

  return newMonetaryAmount(transactionsPaymentInfo.partialFee.toString(), GOVERNANCE_TOKEN);
};

export { STAKING_TRANSACTION_FEE_RESERVE_FETCHER, stakingTransactionFeeReserveFetcher };
