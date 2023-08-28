import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';
import { add } from 'date-fns';
import { useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { BLOCK_TIME } from '@/config/parachain';
import { REFETCH_INTERVAL } from '@/utils/constants/api';
import { convertWeeksToBlockNumbers } from '@/utils/helpers/staking';

import useAccountId from '../../use-account-id';

type AccountUnlockStakingData = {
  date: Date;
  block: number;
};

type AccountStakingData = {
  unlock: AccountUnlockStakingData;
  balance: MonetaryAmount<CurrencyExt>;
  endBlock: number;
  votingBalance: MonetaryAmount<CurrencyExt>;
  claimableRewards: MonetaryAmount<CurrencyExt>;
  projected: {
    amount: MonetaryAmount<CurrencyExt>;
    apy: Big;
  };
};

const getUnlockData = (stakeEndBlock: number, currentBlockNumber: number): AccountUnlockStakingData => {
  const blocksUntilUnlockDate = stakeEndBlock - currentBlockNumber;

  const unlockDate = add(new Date(), { seconds: blocksUntilUnlockDate * BLOCK_TIME });

  return {
    date: unlockDate,
    block: stakeEndBlock
  };
};

const getAccountStakingData = async (accountId: AccountId): Promise<AccountStakingData | null> => {
  const stakedBalance = await window.bridge.escrow.getStakedBalance(accountId);

  if (stakedBalance.amount.isZero()) {
    return null;
  }

  const currentBlockNumberPromise = window.bridge.system.getCurrentBlockNumber();
  const claimableRewardsPromise = window.bridge.escrow.getRewards(accountId);
  const projectedPromise = window.bridge.escrow.getRewardEstimate(accountId);
  const votingBalancePromise = window.bridge.escrow.votingBalance(accountId);

  const [currentBlockNumber, claimableRewards, projected, votingBalance] = await Promise.all([
    currentBlockNumberPromise,
    claimableRewardsPromise,
    projectedPromise,
    votingBalancePromise
  ]);

  const unlock = getUnlockData(stakedBalance.endBlock, currentBlockNumber);

  return {
    unlock,
    balance: stakedBalance.amount,
    endBlock: stakedBalance.endBlock,
    votingBalance,
    claimableRewards,
    projected
  };
};

interface UseGetAccountStakingDataResult {
  data: AccountStakingData | null | undefined;
  getUnlockHeight: (lockTime: number) => Promise<number>;
  refetch: () => void;
}

const useGetAccountStakingData = (): UseGetAccountStakingDataResult => {
  const accountId = useAccountId();

  const queryKey = ['staking', accountId];

  const { data, error, refetch } = useQuery({
    queryKey,
    queryFn: () => accountId && getAccountStakingData(accountId),
    refetchInterval: REFETCH_INTERVAL.BLOCK,
    enabled: !!accountId
  });

  const getUnlockHeight = useCallback(
    async (lockTime: number) => {
      const newLockBlockNumber = convertWeeksToBlockNumbers(lockTime);

      if (data) {
        return data.endBlock + newLockBlockNumber;
      }

      const currentBlockNumber = await window.bridge.system.getCurrentBlockNumber();

      return currentBlockNumber + newLockBlockNumber;
    },
    [data]
  );

  useErrorHandler(error);

  return { data, refetch, getUnlockHeight };
};

export { useGetAccountStakingData };
export type { AccountStakingData, AccountUnlockStakingData, UseGetAccountStakingDataResult };
