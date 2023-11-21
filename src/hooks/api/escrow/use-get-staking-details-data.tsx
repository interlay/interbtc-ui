import { CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';
import { add } from 'date-fns';
import { useRef } from 'react';
import { MutationFunction, useMutation, UseMutationOptions, UseMutationResult } from 'react-query';

import { GOVERNANCE_TOKEN, STAKE_LOCK_TIME } from '@/config/relay-chains';
import { convertBlockNumbersToWeeks, convertWeeksToBlockNumbers } from '@/utils/helpers/staking';

import useAccountId from '../../use-account-id';
import { AccountStakingData, useGetAccountStakingData } from './use-get-account-staking-data';

type AccountStakingDetailsData = {
  apy?: Big;
  totalStaked: MonetaryAmount<CurrencyExt>;
  votingBalanceGained: MonetaryAmount<CurrencyExt>;
  governanceBalanceReward?: MonetaryAmount<CurrencyExt>;
  date: Date;
};

const getDetailsData = async (
  accountId?: AccountId,
  accountData?: AccountStakingData | null,
  amount: MonetaryAmount<CurrencyExt> = newMonetaryAmount(0, GOVERNANCE_TOKEN),
  weeksLocked = 0
): Promise<AccountStakingDetailsData> => {
  const baseBlockNumber = accountData?.unlock.block || (await window.bridge.system.getCurrentBlockNumber());

  const newBlockNumber = baseBlockNumber + convertWeeksToBlockNumbers(weeksLocked);

  const existingWeeksLocked = accountData ? convertBlockNumbersToWeeks(accountData.unlock.remainingBlocks) : 0;

  const totalWeeksLocked = existingWeeksLocked + weeksLocked;

  const totalStakedAmount = accountData ? accountData.balance.add(amount) : amount;

  const totalStaked = totalStakedAmount.mul(totalWeeksLocked).div(STAKE_LOCK_TIME.MAX);

  const votingBalanceGained = accountData ? totalStaked.sub(accountData?.votingBalance) : totalStaked;

  const { amount: governanceBalanceReward, apy } = accountId
    ? await window.bridge.escrow.getRewardEstimate(accountId, amount, newBlockNumber)
    : { amount: undefined, apy: undefined };

  const date = add(accountData?.unlock.date || new Date(), {
    weeks: weeksLocked
  });

  return {
    apy,
    totalStaked,
    votingBalanceGained,
    governanceBalanceReward,
    date
  };
};

type StakingEstimationVariables = {
  amount?: MonetaryAmount<CurrencyExt>;
  weeksLocked?: number;
};

type UseGetStakingEstimationOptions = UseMutationOptions<
  AccountStakingDetailsData,
  Error,
  StakingEstimationVariables,
  unknown
>;

type UseGetAccountStakingDetailsDataResult = UseMutationResult<
  AccountStakingDetailsData,
  Error,
  StakingEstimationVariables,
  unknown
>;

const useGetStakingDetailsData = (options?: UseGetStakingEstimationOptions): UseGetAccountStakingDetailsDataResult => {
  const accountId = useAccountId();
  const resultRef = useRef<AccountStakingDetailsData>();

  const accountData = useGetAccountStakingData();

  const fn: MutationFunction<AccountStakingDetailsData | undefined, StakingEstimationVariables> = ({
    amount,
    weeksLocked
  }) => getDetailsData(accountId, accountData.data, amount, weeksLocked);

  const mutation = useMutation<AccountStakingDetailsData | undefined, Error, StakingEstimationVariables, unknown>(fn, {
    ...options,
    onSuccess: (data) => {
      resultRef.current = data;
    }
  });

  return { ...mutation, data: resultRef.current } as UseGetAccountStakingDetailsDataResult;
};

export { useGetStakingDetailsData };
export type { AccountStakingDetailsData, UseGetAccountStakingDetailsDataResult };
