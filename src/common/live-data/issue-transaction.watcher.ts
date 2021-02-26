import { Dispatch } from "redux";
import { updateAllIssueRequestsAction } from "../actions/issue.actions";
import * as constants from "../../constants";
import * as polkabtcStats from "@interlay/polkabtc-stats";
import { IssueColumns, BtcNetworkName } from "@interlay/polkabtc-stats";
import { statsToUIIssueRequest } from "../utils/utils";
import { StoreState } from "../types/util.types";
import { IssueRequest } from "../types/issue.types";

export default async function fetchIssueTransactions(dispatch: Dispatch, store: StoreState): Promise<void> {
    try {
        // temp declaration pending refactor decision
        const stats = new polkabtcStats.StatsApi(new polkabtcStats.Configuration({ basePath: constants.STATS_URL }));

        const { address, bitcoinHeight, polkaBtcLoaded } = store.getState().general;
        if (!address || !polkaBtcLoaded) return;

        const parachainHeight = await window.polkaBTC.system.getCurrentBlockNumber();
        const issuePeriod = await window.polkaBTC.issue.getIssuePeriod();
        const requiredBtcConfirmations = await window.polkaBTC.btcRelay.getStableBitcoinConfirmations();
        const databaseRequests: IssueRequest[] = await Promise.all(
            (
                await stats.getFilteredIssues(
                    0, // page 0 (first page)
                    15, // 15 per page
                    undefined, // default sorting ( = chronological)
                    undefined, // default sorting order
                    constants.BITCOIN_NETWORK as BtcNetworkName,
                    [{ column: IssueColumns.Requester, value: address }] // filter by requester==address
                )
            ).data.map(
                async (statsIssue) =>
                    await statsToUIIssueRequest(
                        statsIssue,
                        bitcoinHeight,
                        parachainHeight,
                        issuePeriod,
                        requiredBtcConfirmations
                    )
            )
        );

        dispatch(updateAllIssueRequestsAction(address, databaseRequests));
    } catch (error) {
        console.log(error);
    }
}
