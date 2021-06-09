
// ray test touch <
import {
  useSelector,
  useDispatch
} from 'react-redux';
import * as polkabtcStats from '@interlay/interbtc-stats-client';
import {
  IssueColumns,
  BtcNetworkName
} from '@interlay/interbtc-stats-client';

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
    polkaBtcLoaded
  } = useSelector((state: StoreType) => state.general);
  const dispatch = useDispatch();

  const isRunning = address && polkaBtcLoaded;

  useInterval(async () => {
    try {
      // Temporary declaration pending refactor decision
      const stats = new polkabtcStats.StatsApi(new polkabtcStats.Configuration({ basePath: constants.STATS_URL }));

      const [
        parachainHeight,
        issuePeriod,
        requiredBtcConfirmations,
        requiredParachainConfirmations
      ] = await Promise.all([
        window.polkaBTC.system.getCurrentBlockNumber(),
        window.polkaBTC.issue.getIssuePeriod(),
        window.polkaBTC.btcRelay.getStableBitcoinConfirmations(),
        window.polkaBTC.btcRelay.getStableParachainConfirmations()
      ]);

      const databaseRequests: IssueRequest[] = await Promise.all((
        await stats.getFilteredIssues({
          page,
          perPage: limit,
          network: constants.BITCOIN_NETWORK as BtcNetworkName,
          filterIssueColumns: [{ column: IssueColumns.Requester, value: address }] // Filter by requester == address
        })
      ).map(
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
