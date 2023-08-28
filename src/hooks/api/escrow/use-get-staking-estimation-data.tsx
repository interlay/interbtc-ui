import { CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';
import { useRef } from 'react';
import { MutationFunction, useMutation, UseMutationOptions, UseMutationResult } from 'react-query';

import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { convertWeeksToBlockNumbers } from '@/utils/helpers/staking';

import useAccountId from '../../use-account-id';
import { AccountStakingData, useGetAccountStakingData } from './use-get-account-staking-data';

type AccountStakingEstimationData = {
  amount: MonetaryAmount<CurrencyExt>;
  apy: Big;
};

const getRewardEstimate = async (
  accountId?: AccountId,
  accountData?: AccountStakingData | null,
  amount: MonetaryAmount<CurrencyExt> = newMonetaryAmount(0, GOVERNANCE_TOKEN),
  lockTime = 0
): Promise<AccountStakingEstimationData | undefined> => {
  if (!accountId) return;

  const baseBlockNumber = accountData?.endBlock || (await window.bridge.system.getCurrentBlockNumber());

  const newBlockNumber = baseBlockNumber + convertWeeksToBlockNumbers(lockTime);

  return window.bridge.escrow.getRewardEstimate(accountId, amount, newBlockNumber);
};

type StakingEstimationVariables = {
  amount?: MonetaryAmount<CurrencyExt>;
  lockTime?: number;
};

type UseGetStakingEstimationOptions = UseMutationOptions<
  AccountStakingEstimationData | undefined,
  Error,
  StakingEstimationVariables,
  unknown
>;

type UseGetAccountStakingEstimationDataResult = UseMutationResult<
  AccountStakingEstimationData | undefined,
  Error,
  StakingEstimationVariables,
  unknown
>;

const useGetStakingEstimationData = (
  options?: UseGetStakingEstimationOptions
): UseGetAccountStakingEstimationDataResult => {
  const accountId = useAccountId();
  const resultRef = useRef<AccountStakingEstimationData>();

  const accountData = useGetAccountStakingData();

  const fn: MutationFunction<AccountStakingEstimationData | undefined, StakingEstimationVariables> = ({
    amount,
    lockTime
  }) => getRewardEstimate(accountId, accountData.data, amount, lockTime);

  const mutation = useMutation<AccountStakingEstimationData | undefined, Error, StakingEstimationVariables, unknown>(
    fn,
    {
      ...options,
      onSuccess: (data) => {
        resultRef.current = data;
      }
    }
  );

  return { ...mutation, data: resultRef.current } as UseGetAccountStakingEstimationDataResult;
};

export { useGetStakingEstimationData };
export type { AccountStakingEstimationData, UseGetAccountStakingEstimationDataResult };
