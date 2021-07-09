// ray test touch <
import {
  useSelector,
  useDispatch
} from 'react-redux';
import * as interbtcIndex from '@interlay/interbtc-index-client';
import {
  BitcoinNetwork,
  IssueColumns
} from '@interlay/interbtc-index-client';

import useInterval from 'utils/hooks/use-interval';
import { updateAllIssueRequestsAction } from 'common/actions/issue.actions';
import { StoreType } from 'common/types/util.types';
import * as constants from '../constants';
import { Issue } from '@interlay/interbtc';

const useUpdateIssueRequests = (page = 0, limit = 15, delay = 10000): void => {
  const { address, polkaBtcLoaded } = useSelector((state: StoreType) => state.general);
  const dispatch = useDispatch();

  const isRunning = address && polkaBtcLoaded;

  useInterval(
    async () => {
      try {
        // Temporary declaration pending refactor decision
        const index = new interbtcIndex.IndexApi(new interbtcIndex.Configuration({ basePath: constants.STATS_URL }));

        const databaseRequests: Issue[] = await index.getFilteredIssues({
          page,
          perPage: limit,
          network: constants.BITCOIN_NETWORK as BitcoinNetwork | undefined,
          filterIssueColumns: [{ column: IssueColumns.Requester, value: address }] // Filter by requester == address
        });

        dispatch(updateAllIssueRequestsAction(address, databaseRequests));
      } catch (error) {
        console.log('[useUpdateIssueRequests useInterval] error.message => ', error.message);
      }
    },
    isRunning ? delay : null,
    true
  );
};

export default useUpdateIssueRequests;
// ray test touch >
