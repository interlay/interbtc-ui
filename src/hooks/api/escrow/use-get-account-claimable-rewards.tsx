import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { useWallet } from '@/hooks/use-wallet';
import { REFETCH_INTERVAL } from '@/utils/constants/api';

const getAccountStakingData = async (accountId: AccountId) => window.bridge.escrow.getRewards(accountId);

interface UseGetAccountStakingClaimableRewardsResult {
  data: MonetaryAmount<CurrencyExt> | undefined;
  refetch: () => void;
}

const useGetAccountStakingClaimableRewards = (): UseGetAccountStakingClaimableRewardsResult => {
  const { account } = useWallet();

  const queryKey = ['staking-claimable-rewards', account];

  const { data, error, refetch } = useQuery({
    queryKey,
    queryFn: () => account && getAccountStakingData(account),
    refetchInterval: REFETCH_INTERVAL.BLOCK,
    enabled: !!account
  });

  useErrorHandler(error);

  return { data, refetch };
};

export { useGetAccountStakingClaimableRewards };
export type { UseGetAccountStakingClaimableRewardsResult };
