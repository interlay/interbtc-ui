
import { Dispatch } from 'redux';
import * as polkabtcStats from '@interlay/polkabtc-stats';
import {
  IssueColumns,
  BtcNetworkName
} from '@interlay/polkabtc-stats';

import { updateAllIssueRequestsAction } from 'common/actions/issue.actions';
import { statsToUIIssueRequest } from 'common/utils/utils';
import { IssueRequest } from 'common/types/issue.types';
import { StoreState } from 'common/types/util.types';
import * as constants from '../../constants';

async function fetchIssueTransactions(dispatch: Dispatch, store: StoreState): Promise<void> {
  try {
    // Temporary declaration pending refactor decision
    const stats = new polkabtcStats.StatsApi(new polkabtcStats.Configuration({ basePath: constants.STATS_URL }));

    const {
      address,
      bitcoinHeight,
      polkaBtcLoaded
    } = store.getState().general;
    // TODO: should throw errors with proper messages
    if (!address || !polkaBtcLoaded) return;

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
        0, // Page 0 (first page)
        15, // 15 per page
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
    console.log('[fetchIssueTransactions] error.message => ', error.message);
  }
}

export default fetchIssueTransactions;
