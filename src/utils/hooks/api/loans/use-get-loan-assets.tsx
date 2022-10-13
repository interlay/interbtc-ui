import { LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

interface LoanAssetsData {
  assets: TickerToData<LoanAsset> | undefined;
}

const getLoanAssets = (): Promise<TickerToData<LoanAsset>> => window.bridge.loans.getLoanAssets();

const useGetLoanAssets = (): LoanAssetsData => {
  const { data: assets, error } = useQuery({
    queryKey: ['loan-assets'],
    queryFn: getLoanAssets
  });

  useErrorHandler(error);

  return { assets };
};

export { useGetLoanAssets };
