import { CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import useAccountId from '@/hooks/use-account-id';
import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

interface GetAccountStakableLimitResult {
  data: MonetaryAmount<CurrencyExt> | undefined;
  refetch: () => void;
}

const getAccountStakableLimit = async (account: AccountId) => {
  const { amount } = await window.bridge.api.rpc.escrow.totalSupply(account);
  return newMonetaryAmount(amount, GOVERNANCE_TOKEN);
};

const useGetAccountStakableLimit = (): GetAccountStakableLimitResult => {
  const account = useAccountId();

  const queryKey = ['staking', account];

  const { data, error, refetch } = useQuery({
    queryKey,
    queryFn: () => account && getAccountStakableLimit(account),
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL,
    enabled: !!account
  });

  useErrorHandler(error);

  return { data, refetch };
};

export { useGetAccountStakableLimit };
