import { LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

interface LoanAssetsData {
  data: TickerToData<LoanAsset> | undefined;
  refetch: () => void;
}

const getLoanAssets = (): Promise<TickerToData<LoanAsset>> => window.bridge.loans.getLoanAssets();

const useGetLoanAssets = (): LoanAssetsData => {
  const queryKey = ['loan-assets'];

  const { data, error, refetch } = useQuery({
    queryKey,
    queryFn: getLoanAssets,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });
  useErrorHandler(error);

  return { data, refetch };
};

export { useGetLoanAssets };
