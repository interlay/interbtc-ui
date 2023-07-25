import { useErrorHandler } from 'react-error-boundary';
import { useQuery, UseQueryResult } from 'react-query';

import { BLOCKS_BEHIND_LIMIT } from '@/config/parachain';
import { REFETCH_INTERVAL } from '@/utils/constants/api';

type BtcBlockHeightData = {
  relay: number;
  bitcoin: number;
  isOutdated: boolean;
};

type UseGetBTCBlockHeightResult = UseQueryResult<BtcBlockHeightData, unknown>;

const getBtcBlockHeight = async (): Promise<BtcBlockHeightData> => {
  const [relay, bitcoin] = await Promise.all([
    window.bridge.btcRelay.getLatestBlockHeight(),
    window.bridge.electrsAPI.getLatestBlockHeight()
  ]);

  const isOutdated = bitcoin - relay > BLOCKS_BEHIND_LIMIT;

  return { relay, bitcoin, isOutdated };
};

const useGetBtcBlockHeight = (): UseGetBTCBlockHeightResult => {
  const queryResult = useQuery({
    queryKey: 'btc-block-height',
    queryFn: getBtcBlockHeight,
    refetchInterval: REFETCH_INTERVAL.MINUTE
  });

  useErrorHandler(queryResult.error);

  return queryResult;
};

export { useGetBtcBlockHeight };
export type { BtcBlockHeightData, UseGetBTCBlockHeightResult };
