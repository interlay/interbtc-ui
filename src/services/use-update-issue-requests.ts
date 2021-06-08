// ray test touch <
import { useSelector, useDispatch } from 'react-redux';
import * as polkabtcStats from '@interlay/polkabtc-stats';
import { IssueColumns, BtcNetworkName } from '@interlay/polkabtc-stats';

import useInterval from 'utils/hooks/use-interval';
import { updateAllIssueRequestsAction } from 'common/actions/issue.actions';
import { StoreType } from 'common/types/util.types';
import * as constants from '../constants';
import { Issue } from '@interlay/polkabtc';

const useUpdateIssueRequests = (page = 0, limit = 15, delay = 10000): void => {
  const { address, polkaBtcLoaded } = useSelector((state: StoreType) => state.general);
  const dispatch = useDispatch();

  const isRunning = address && polkaBtcLoaded;

  useInterval(
    async () => {
      try {
        // Temporary declaration pending refactor decision
        const stats = new polkabtcStats.StatsApi(new polkabtcStats.Configuration({ basePath: constants.STATS_URL }));

        const databaseRequests: Issue[] = (await stats.getFilteredIssues(
          page, // Page 0 (first page)
          limit, // 15 per page
          undefined, // Default sorting (= chronological)
          undefined, // Default sorting order
          constants.BITCOIN_NETWORK as BtcNetworkName,
          [{ column: IssueColumns.Requester, value: address }] // Filter by requester == address
        )).data;

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
