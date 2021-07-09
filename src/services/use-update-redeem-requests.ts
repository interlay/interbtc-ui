import {
  useSelector,
  useDispatch
} from 'react-redux';
import * as interbtcIndex from '@interlay/interbtc-index-client';
import {
  BitcoinNetwork,
  RedeemColumns
} from '@interlay/interbtc-index-client';

import useInterval from 'utils/hooks/use-interval';
import { updateAllRedeemRequestsAction } from 'common/actions/redeem.actions';
import { StoreType } from 'common/types/util.types';
import * as constants from '../constants';
import { Redeem } from '@interlay/interbtc';

const useUpdateRedeemRequests = (
  page = 0,
  limit = 15,
  delay = 10000
): void => {
  const { address, polkaBtcLoaded } = useSelector((state: StoreType) => state.general);
  const dispatch = useDispatch();

  const isRunning = address && polkaBtcLoaded;

  useInterval(async () => {
    try {
      // Temporary declaration pending refactor decision
      const stats = new interbtcIndex.IndexApi(new interbtcIndex.Configuration({ basePath: constants.STATS_URL }));

      const databaseRequests: Redeem[] = await stats.getFilteredRedeems({
        page,
        perPage: limit,
        network: constants.BITCOIN_NETWORK as BitcoinNetwork,
        filterRedeemColumns: [{ column: RedeemColumns.Requester, value: address }] // Filter by requester == address
      });

      dispatch(updateAllRedeemRequestsAction(address, databaseRequests));
    } catch (error) {
      console.log('[useUpdateRedeemRequests useInterval] error.message => ', error.message);
    }
  }, isRunning ? delay : null, true);
};

export default useUpdateRedeemRequests;
