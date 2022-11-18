import { LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, UseQueryResult } from 'react-query';

import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

const getLoanAssets = (): Promise<TickerToData<LoanAsset>> => window.bridge.loans.getLoanAssets();

const useGetLoanAssets = (): UseQueryResult<TickerToData<LoanAsset>, unknown> => {
  const query = useQuery({
    queryKey: ['loan-assets'],
    queryFn: getLoanAssets,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });

  useErrorHandler(query.error);

  return query;
};

export { useGetLoanAssets };
