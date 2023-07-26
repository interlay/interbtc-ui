import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, UseQueryResult } from 'react-query';

import { GOVERNANCE_TOKEN, RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';
import { REFETCH_INTERVAL } from '@/utils/constants/api';

type TotalLockedTokensData = {
  wrapped: MonetaryAmount<CurrencyExt>;
  relay: MonetaryAmount<CurrencyExt>;
  governance: MonetaryAmount<CurrencyExt>;
};

type UseGetTotalTokensResult = UseQueryResult<TotalLockedTokensData, unknown>;

const getTotalLocked = async (): Promise<TotalLockedTokensData> => {
  const [wrapped, relay, governance] = await Promise.all([
    window.bridge.tokens.total(WRAPPED_TOKEN),
    window.bridge.tokens.total(RELAY_CHAIN_NATIVE_TOKEN),
    window.bridge.tokens.total(GOVERNANCE_TOKEN)
  ]);

  return { wrapped, relay, governance };
};

const useGetTotalLockedTokens = (): UseGetTotalTokensResult => {
  const queryResult = useQuery({
    queryKey: 'total-locked',
    queryFn: getTotalLocked,
    refetchInterval: REFETCH_INTERVAL.BLOCK
  });

  useErrorHandler(queryResult.error);

  return queryResult;
};

export { useGetTotalLockedTokens };
export type { TotalLockedTokensData, UseGetTotalTokensResult };
