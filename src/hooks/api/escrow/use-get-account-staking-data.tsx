import { CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';
import { add } from 'date-fns';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { BLOCK_TIME } from '@/config/parachain';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { REFETCH_INTERVAL } from '@/utils/constants/api';

import useAccountId from '../../use-account-id';

type AccountUnlockStakingData = {
  date: Date;
  block: number;
  remainingBlocks: number;
  isAvailable: boolean;
};

type AccountStakingData = {
  unlock: AccountUnlockStakingData;
  balance: MonetaryAmount<CurrencyExt>;
  votingBalance: MonetaryAmount<CurrencyExt>;
  projected: {
    amount: MonetaryAmount<CurrencyExt>;
    apy: Big;
  };
  limit: MonetaryAmount<CurrencyExt>;
};

const getUnlockData = (stakeEndBlock: number, currentBlockNumber: number): AccountUnlockStakingData => {
  const remainingBlocks = stakeEndBlock - currentBlockNumber;

  const unlockDate = add(new Date(), { seconds: remainingBlocks * BLOCK_TIME });

  return {
    date: unlockDate,
    block: stakeEndBlock,
    remainingBlocks,
    isAvailable: remainingBlocks <= 0
  };
};

const getAccountStakingData = async (accountId: AccountId): Promise<AccountStakingData | null> => {
  const stakedBalance = await window.bridge.escrow.getStakedBalance(accountId);

  if (stakedBalance.amount.isZero()) {
    return null;
  }

  const limitPromise = window.bridge.api.rpc.escrow.freeStakable(accountId);
  const currentBlockNumberPromise = window.bridge.system.getCurrentBlockNumber();
  const projectedPromise = window.bridge.escrow.getRewardEstimate(accountId);
  const votingBalancePromise = window.bridge.escrow.votingBalance(accountId);

  const [limit, currentBlockNumber, projected, votingBalance] = await Promise.all([
    limitPromise,
    currentBlockNumberPromise,
    projectedPromise,
    votingBalancePromise
  ]);

  const unparsedLimit = limit?.values().next().value?.toString() as string;
  const parsedLimit = newMonetaryAmount(unparsedLimit || 0, GOVERNANCE_TOKEN);

  const unlock = getUnlockData(stakedBalance.endBlock, currentBlockNumber);

  return {
    unlock,
    balance: stakedBalance.amount,
    votingBalance,
    projected,
    limit: parsedLimit
  };
};

interface UseGetAccountStakingDataResult {
  data: AccountStakingData | null | undefined;
  isLoading: boolean;
  refetch: () => void;
}

const useGetAccountStakingData = (): UseGetAccountStakingDataResult => {
  const accountId = useAccountId();

  const queryKey = ['staking', accountId];

  const { data, error, isLoading, refetch } = useQuery({
    queryKey,
    queryFn: () => accountId && getAccountStakingData(accountId),
    refetchInterval: REFETCH_INTERVAL.BLOCK,
    enabled: !!accountId
  });

  useErrorHandler(error);

  return { data, isLoading, refetch };
};

export { useGetAccountStakingData };
export type { AccountStakingData, AccountUnlockStakingData, UseGetAccountStakingDataResult };
