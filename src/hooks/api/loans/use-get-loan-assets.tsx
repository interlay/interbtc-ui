import { LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

interface UseGetLoansAssets {
  isLoading: boolean;
  data: TickerToData<LoanAsset> | undefined;
  refetch: () => void;
}

const useGetLoanAssets = (): UseGetLoansAssets => {
  const { data, error, refetch, isLoading } = useQuery({
    queryKey: ['loan-assets'],
    queryFn: (): Promise<TickerToData<LoanAsset>> => window.bridge.loans.getLoanAssets(),
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });

  useErrorHandler(error);

  return { isLoading, data, refetch };
};

export { useGetLoanAssets };
