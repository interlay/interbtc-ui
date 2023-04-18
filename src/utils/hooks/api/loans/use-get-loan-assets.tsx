import { LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

interface UseGetLoansAssets {
  data: TickerToData<LoanAsset> | undefined;
  refetch: () => void;
}

const useGetLoanAssets = (): UseGetLoansAssets => {
  const { data, error, refetch } = useQuery({
    queryKey: ['loan-assets'],
    queryFn: (): Promise<TickerToData<LoanAsset>> => window.bridge.loans.getLoanAssets(),
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });

  useErrorHandler(error);

  return { data, refetch };
};

export { useGetLoanAssets };
