
import {
  useSelector,
  useDispatch
} from 'react-redux';
import * as polkabtcStats from '@interlay/polkabtc-stats';
import {
  RedeemColumns,
  BtcNetworkName
} from '@interlay/polkabtc-stats';

import useInterval from 'utils/hooks/use-interval';
import { updateAllRedeemRequestsAction } from 'common/actions/redeem.actions';
import { statsToUIRedeemRequest } from 'common/utils/requests';
import { RedeemRequest } from 'common/types/redeem.types';
import { StoreType } from 'common/types/util.types';
import * as constants from '../constants';

const useUpdateRedeemRequests = (
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
        redeemPeriod,
        requiredBtcConfirmations,
        requiredParachainConfirmations
      ] = await Promise.all([
        window.polkaBTC.system.getCurrentActiveBlockNumber(), // TODO: should avoid as it's called for issue
        window.polkaBTC.redeem.getRedeemPeriod(),
        window.polkaBTC.btcRelay.getStableBitcoinConfirmations(), // TODO: should avoid as it's called for issue
        window.polkaBTC.btcRelay.getStableParachainConfirmations()
      ]);

      const databaseRequests: RedeemRequest[] = (
        await stats.getFilteredRedeems(
          page, // Page 0 (i.e. first page)
          limit, // 15 per page (i.e. fetch 15 latest requests)
          undefined, // Default sorting
          undefined, // Default sort order
          constants.BITCOIN_NETWORK as BtcNetworkName,
          [{ column: RedeemColumns.Requester, value: address }] // Filter by requester == address
        )
      ).data.map(statsRedeem =>
        statsToUIRedeemRequest(
          statsRedeem,
          bitcoinHeight,
          parachainHeight,
          redeemPeriod,
          requiredBtcConfirmations,
          requiredParachainConfirmations
        )
      );

      dispatch(updateAllRedeemRequestsAction(address, databaseRequests));
    } catch (error) {
      console.log('[useUpdateRedeemRequests useInterval] error.message => ', error.message);
    }
  }, isRunning ? delay : null, true);
};

export default useUpdateRedeemRequests;
