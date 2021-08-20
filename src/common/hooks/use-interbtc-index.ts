import { useMemo } from 'react';
import {
  IndexApi,
  Configuration
} from '@interlay/interbtc-index-client';

import { STATS_URL } from '../../constants';

// ray test touch <
export default function useInterbtcIndex(): IndexApi {
  const indexApi = useMemo(
    () => new IndexApi(new Configuration({ basePath: STATS_URL })),
    []
  );

  return indexApi;
}
// ray test touch >
