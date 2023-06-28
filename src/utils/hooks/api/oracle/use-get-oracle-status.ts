import { useQuery } from 'react-query';

import { REFETCH_INTERVAL } from '@/utils/constants/api';

interface UseGetOracleStatusResult {
  data: OracleStatus | undefined;
  isLoading: boolean;
}

enum OracleStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE'
}

const getOracleStatus = async (): Promise<OracleStatus> => {
  const isOracleOnline = await window.bridge.oracle.isOnline();
  return isOracleOnline ? OracleStatus.ONLINE : OracleStatus.OFFLINE;
};

const useGetOracleStatus = (): UseGetOracleStatusResult => {
  const { data, isLoading } = useQuery({
    queryKey: 'oracle-status',
    queryFn: getOracleStatus,
    enabled: window.bridge !== undefined,
    refetchInterval: REFETCH_INTERVAL.MINUTE
  });

  return { data, isLoading };
};

export { OracleStatus, useGetOracleStatus };
