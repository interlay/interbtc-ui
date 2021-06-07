
// ray test touch <
import {
  useSelector,
  useDispatch
} from 'react-redux';
import * as interbtcStats from '@interlay/interbtc-stats';
import {
  IssueColumns,
  BtcNetworkName
} from '@interlay/interbtc-stats';

import useInterval from 'utils/hooks/use-interval';
import { updateAllIssueRequestsAction } from 'common/actions/issue.actions';
import { statsToUIIssueRequest } from 'common/utils/requests';
import { IssueRequest } from 'common/types/issue.types';
import { StoreType } from 'common/types/util.types';
import * as constants from '../constants';

const useUpdateIssueRequests = (
  page = 0,
  limit = 15,
  delay = 10000
): void => {
  const {
    address,
    bitcoinHeight,
    interBtcLoaded
  } = useSelector((state: StoreType) => state.general);
  const dispatch = useDispatch();

  const isRunning = address && interBtcLoaded;

  useInterval(async () => {
    try {
      // Temporary declaration pending refactor decision
      const stats = new interbtcStats.StatsApi(new interbtcStats.Configuration({ basePath: constants.STATS_URL }));

      const [
        parachainHeight,
        issuePeriod,
        requiredBtcConfirmations,
        requiredParachainConfirmations
      ] = await Promise.all([
        window.interBTC.system.getCurrentBlockNumber(),
        window.interBTC.issue.getIssuePeriod(),
        window.interBTC.btcRelay.getStableBitcoinConfirmations(),
        window.interBTC.btcRelay.getStableParachainConfirmations()
      ]);

      const databaseRequests: IssueRequest[] = await Promise.all((
        await stats.getFilteredIssues(
          page, // Page 0 (first page)
          limit, // 15 per page
          undefined, // Default sorting (= chronological)
          undefined, // Default sorting order
          constants.BITCOIN_NETWORK as BtcNetworkName,
          [{ column: IssueColumns.Requester, value: address }] // Filter by requester == address
        )
      ).data.map(
        async statsIssue =>
          await statsToUIIssueRequest(
            statsIssue,
            bitcoinHeight,
            parachainHeight,
            issuePeriod,
            requiredBtcConfirmations,
            requiredParachainConfirmations
          )
      ));

      dispatch(updateAllIssueRequestsAction(address, databaseRequests));
    } catch (error) {
      console.log('[useUpdateIssueRequests useInterval] error.message => ', error.message);
    }
  }, isRunning ? delay : null, true);
};

export default useUpdateIssueRequests;
// ray test touch >
