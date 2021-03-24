
import {
  useSelector,
  useDispatch
} from 'react-redux';
import * as polkabtcStats from '@interlay/polkabtc-stats';
import {
  IssueColumns,
  BtcNetworkName
} from '@interlay/polkabtc-stats';

import useInterval from 'utils/hooks/use-interval';
import { updateAllIssueRequestsAction } from 'common/actions/issue.actions';
import { statsToUIIssueRequest } from 'common/utils/utils';
import { IssueRequest } from 'common/types/issue.types';
import { StoreType } from 'common/types/util.types';
import * as constants from '../constants';

const useUpdateIssueRequests = (
  page: number = 0,
  limit: number = 15,
  delay: number = 10000
) => {
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
        requiredBtcConfirmations
      ] = await Promise.all([
        window.polkaBTC.system.getCurrentBlockNumber(),
        window.polkaBTC.issue.getIssuePeriod(),
        window.polkaBTC.btcRelay.getStableBitcoinConfirmations()
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
            requiredBtcConfirmations
          )
      ));

      dispatch(updateAllIssueRequestsAction(address, databaseRequests));
    } catch (error) {
      console.log('[useUpdateIssueRequests useInterval] error.message => ', error.message);
    }
  }, isRunning ? delay : null, true);
};

export default useUpdateIssueRequests;
