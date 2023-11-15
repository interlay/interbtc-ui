import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { REFETCH_INTERVAL } from '@/utils/constants/api';

type NetworkStakingData = {
  totalVotingSupply: MonetaryAmount<CurrencyExt>;
  totalStakedBalance: MonetaryAmount<CurrencyExt>;
};

const getNetworkStakingData = async (): Promise<NetworkStakingData> => {
  const totalVotingSupplyPromise = window.bridge.escrow.totalVotingSupply();
  const totalStakedBalancePromise = window.bridge.escrow.getTotalStakedBalance();

  const [totalVotingSupply, totalStakedBalance] = await Promise.all([
    totalVotingSupplyPromise,
    totalStakedBalancePromise
  ]);

  return {
    totalVotingSupply,
    totalStakedBalance
  };
};

interface GetNetworkStakingDataResult {
  data: NetworkStakingData | undefined;
  refetch: () => void;
}

const useGetNetworkStakingData = (): GetNetworkStakingDataResult => {
  const { data, error, refetch } = useQuery({
    queryKey: 'network-staking-data',
    queryFn: getNetworkStakingData,
    refetchInterval: REFETCH_INTERVAL.BLOCK
  });

  useErrorHandler(error);

  return { data, refetch };
};

export { useGetNetworkStakingData };
export type { GetNetworkStakingDataResult, NetworkStakingData };
