import { useMemo } from 'react';
import * as interbtcIndex from '@interlay/interbtc-index-client';
import { STATS_URL } from '../../constants';

export default function useInterbtcIndex(): interbtcIndex.IndexApi {
  const indexApi = useMemo(
    () => new interbtcIndex.IndexApi(new interbtcIndex.Configuration({ basePath: STATS_URL })),
    []
  );

  return indexApi;
}
