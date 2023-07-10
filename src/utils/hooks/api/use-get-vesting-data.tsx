import { AccountId } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

import useAccountId from '../use-account-id';

type VestingData = {
  schedules: Codec;
  isClaimable: boolean;
};

interface UseGetVestingResult {
  data: VestingData | undefined;
  refetch: () => void;
}

const getVestingData = async (accountId: AccountId): Promise<VestingData> => {
  const currentBlockNumber = await window.bridge.system.getCurrentBlockNumber();

  const schedules = await window.bridge.api.query.vesting.vestingSchedules(accountId);

  const schedule = schedules[0];
  const isClaimable = !!schedule && currentBlockNumber > schedule.start.toNumber() + schedule.period.toNumber();

  console.log(schedule, currentBlockNumber);

  return {
    schedules,
    isClaimable
  };
};

const useGetVestingData = (): UseGetVestingResult => {
  const accountId = useAccountId();

  const queryKey = ['vesting-schedule', accountId];
  const { data, error, refetch } = useQuery({
    queryKey,
    queryFn: () => accountId && getVestingData(accountId),
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });

  useErrorHandler(error);

  return { data, refetch };
};

export { useGetVestingData };
export type { UseGetVestingResult };
