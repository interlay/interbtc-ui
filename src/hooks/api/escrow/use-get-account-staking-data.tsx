import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';
import { add } from 'date-fns';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { BLOCK_TIME } from '@/config/parachain';
import { REFETCH_INTERVAL } from '@/utils/constants/api';

import useAccountId from '../../use-account-id';

type AccountUnlockStakingData = {
  date: Date;
  block: number;
};

type AccountStakingData = {
  isStaking: boolean;
  unlock: AccountUnlockStakingData;

  balance: MonetaryAmount<CurrencyExt>;
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

const getAccountStakingData = async (accountId: AccountId): Promise<AccountStakingData> => {
  const stakedBalancePromise = window.bridge.escrow.getStakedBalance(accountId);
  const currentBlockNumberPromise = window.bridge.system.getCurrentBlockNumber();
  const claimableRewardsPromise = window.bridge.escrow.getRewards(accountId);
  const projectedPromise = window.bridge.escrow.getRewardEstimate(accountId);

  const [stakedBalance, currentBlockNumber, claimableRewards, projected] = await Promise.all([
    stakedBalancePromise,
    currentBlockNumberPromise,
    claimableRewardsPromise,
    projectedPromise
  ]);

  const unlock = getUnlockData(stakedBalance.endBlock, currentBlockNumber);

  return {
    isStaking: !stakedBalance.amount.isZero(),
    unlock,
    balance: stakedBalance.amount,
    claimableRewards,
    projected
  };
};

interface UseGetAccountStakingDataResult {
  data: AccountStakingData | undefined;
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

  useErrorHandler(error);

  return { data, refetch };
};

export { useGetAccountStakingData };
export type { AccountStakingData, AccountUnlockStakingData, UseGetAccountStakingDataResult };
