import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';
import { useMutation, UseMutationOptions, UseMutationResult } from 'react-query';

import useAccountId from '../../use-account-id';

type GetAccountStakingEstimationData = {
  amount: MonetaryAmount<CurrencyExt>;
  apy: Big;
};

const getRewardEstimate = async (accountId?: AccountId, amount?: MonetaryAmount<CurrencyExt>, lockTime?: number) => {
  if (!accountId || !(amount && lockTime)) return;

  return window.bridge.escrow.getRewardEstimate(accountId, amount, lockTime);
};

type StakingEstimationVariables = {
  amount?: MonetaryAmount<CurrencyExt>;
  lockTime?: number;
};

type UseGetStakingEstimationOptions = UseMutationOptions<
  GetAccountStakingEstimationData | undefined,
  Error,
  StakingEstimationVariables,
  unknown
>;

type GetAccountStakingEstimationDataResult = UseMutationResult<
  GetAccountStakingEstimationData | undefined,
  Error,
  StakingEstimationVariables,
  unknown
>;

const useGetStakingEstimationData = (
  options?: UseGetStakingEstimationOptions
): GetAccountStakingEstimationDataResult => {
  const accountId = useAccountId();

  const mutation = useMutation(
    ({ amount, lockTime }) => getRewardEstimate(accountId, amount, lockTime) as any,
    options
  );

  return mutation;
};

export { useGetStakingEstimationData };
export type { GetAccountStakingEstimationData, GetAccountStakingEstimationDataResult };
