import { Currency, MonetaryAmount } from '@interlay/monetary-js';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

const getDustValue = async (): Promise<MonetaryAmount<Currency>> => window.bridge.issue.getDustValue();

type UseGetDustValueResult = {
  data: MonetaryAmount<Currency> | undefined;
  refetch: () => void;
};

const useGetDustValue = (): UseGetDustValueResult => {
  const { data, error, refetch } = useQuery({
    queryKey: 'dust-value',
    queryFn: getDustValue,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });

  useErrorHandler(error);

  return {
    data,
    refetch
  };
};

export { useGetDustValue };
export type { UseGetDustValueResult };
