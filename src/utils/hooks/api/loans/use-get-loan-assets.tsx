import { LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, useQueryClient } from 'react-query';

import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

interface LoanAssetsData {
  data: TickerToData<LoanAsset> | undefined;
  refetch: () => void;
}

const getLoanAssets = (): Promise<TickerToData<LoanAsset>> => window.bridge.loans.getLoanAssets();

const useGetLoanAssets = (): LoanAssetsData => {
  const queryKey = ['loan-assets'];

  const { data, error } = useQuery({
    queryKey,
    queryFn: getLoanAssets,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });
  useErrorHandler(error);

  const queryClient = useQueryClient();

  const refetch = () => queryClient.invalidateQueries(queryKey);

  return { data, refetch };
};

export { useGetLoanAssets };
