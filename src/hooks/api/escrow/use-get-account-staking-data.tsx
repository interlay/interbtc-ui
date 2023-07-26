import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import { add } from 'date-fns';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { BLOCK_TIME } from '@/config/parachain';
import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

import useAccountId from '../../use-account-id';

type AccountUnlockStakingData = {
  date: Date;
  block: number;
};

type GetAccountStakingData = {
  unlock: AccountUnlockStakingData;
  balance: MonetaryAmount<CurrencyExt>;
};

const getUnlockData = (stakeEndBlock: number, currentBlockNumber: number): AccountUnlockStakingData => {
  const blocksUntilUnlockDate = stakeEndBlock - currentBlockNumber;

  const unlockDate = add(new Date(), { seconds: blocksUntilUnlockDate * BLOCK_TIME });

  return {
    date: unlockDate,
    block: stakeEndBlock
  };
};

const getAccountStakingData = async (accountId: AccountId): Promise<GetAccountStakingData> => {
  const stakedBalancePromise = window.bridge.escrow.getStakedBalance(accountId);
  const currentBlockNumberPromise = window.bridge.system.getCurrentBlockNumber();

  const [stakedBalance, currentBlockNumber] = await Promise.all([stakedBalancePromise, currentBlockNumberPromise]);

  const unlock = getUnlockData(stakedBalance.endBlock, currentBlockNumber);

  return {
    unlock,
    balance: stakedBalance.amount
  };
};

interface GetAccountStakingDataResult {
  data: GetAccountStakingData | undefined;
  refetch: () => void;
}

const useGetAccountStakingData = (): GetAccountStakingDataResult => {
  const accountId = useAccountId();

  const queryKey = ['staking', accountId];

  const { data, error, refetch } = useQuery({
    queryKey,
    queryFn: () => accountId && getAccountStakingData(accountId),
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL,
    enabled: !!accountId
  });

  useErrorHandler(error);

  return { data, refetch };
};

export { useGetAccountStakingData };
export type { AccountUnlockStakingData, GetAccountStakingData, GetAccountStakingDataResult };
