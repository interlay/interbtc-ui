import { useMemo } from 'react';
import * as interbtcStats from '@interlay/interbtc-stats';
import { STATS_URL } from '../../constants';

export default function useInterbtcStats(): interbtcStats.StatsApi {
  const statsApi = useMemo(
    () => new interbtcStats.StatsApi(new interbtcStats.Configuration({ basePath: STATS_URL })),
    []
  );

  return statsApi;
}
