import React, { useEffect, useState, useCallback } from "react";
import { RedeemRequest } from "../../../common/types/redeem.types";
import { Table, Button } from "react-bootstrap";
import { shortAddress, parachainToUIRedeemRequest } from "../../../common/utils/utils";
import { FaCheck, FaHourglass } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { startTransactionWatcherRedeem } from "../../../common/utils/transaction-watcher";
import {
    updateAllRedeemRequestsAction,
    cancelRedeemRequestAction,
    redeemExpiredAction,
} from "../../../common/actions/redeem.actions";
import { toast } from "react-toastify";
import BitcoinTransaction from "../../../common/components/bitcoin-links/transaction";
import BitcoinAddress from "../../../common/components/bitcoin-links/address";
import { FEEDBACK_MODAL_DISPLAY_DELAY_MS } from "../../../constants";
import { useTranslation } from 'react-i18next';


export interface RedeemRequestsProps {
    handleShowFeedbackModal: () => void;
}

export default function RedeemRequests(props: RedeemRequestsProps) {
    const { t } = useTranslation();
    const { polkaBtcLoaded, address } = useSelector((state: StoreType) => state.general);
    const redeemRequests = useSelector((state: StoreType) => state.redeem.redeemRequests).get(address);
    const { transactionListeners, fee }= useSelector((state: StoreType) => state.redeem);
    const [isRedeemExpirationSubscribed, setIsRedeemExpirationSubscribed] = useState(false);
    const [cancelPending, setCancelPending] = useState([""]);
    const dispatch = useDispatch();

    const cancelRedeemRequest = async (redeemId: string): Promise<void> => {
        if (!polkaBtcLoaded) return;
        setCancelPending([...cancelPending, redeemId]);
        try {
            const id = window.polkaBTC.api.createType("H256", redeemId);
            await window.polkaBTC.redeem.cancel(id);
            dispatch(cancelRedeemRequestAction(redeemId));
            toast.success(t("redeem_page.successfully_cancelled_redeem"));
        } catch (err) {
            console.log(err);
            toast.error(t("redeem_page.error_cancelling_redeem"));
        }
        setCancelPending(cancelPending.splice(cancelPending.indexOf(redeemId), 1));
    };

    const redeemExpired = useCallback(
        (redeemId: string) => {
            if (!redeemRequests || !redeemRequests.length) return;
            const requestToBeUpdated = redeemRequests.filter((request) => request.id === redeemId)[0];

            if (requestToBeUpdated && !requestToBeUpdated.isExpired) {
                dispatch(redeemExpiredAction({ ...requestToBeUpdated, isExpired: true }));
            }
        },
        [redeemRequests, dispatch]
    );

    const handleCompleted = (request: RedeemRequest) => {
        if (!request.completed && request.isExpired) {
            return (
                <Button
                    variant="outline-dark"
                    onClick={() => {
                        cancelRedeemRequest(request.id);
                    }}
                >
                    {t("cancel")}
                </Button>
            );
        } else if (request.completed) {
            setTimeout(props.handleShowFeedbackModal, FEEDBACK_MODAL_DISPLAY_DELAY_MS);
            return <FaCheck></FaCheck>;
        } else {
            return <FaHourglass></FaHourglass>;
        }
    };

    useEffect(() => {
        if (!redeemRequests || !polkaBtcLoaded) return;

        const accountId = window.polkaBTC.api.createType("AccountId", address);

        // if there are redeem requests, check their btc confirmations and if they are expired
        redeemRequests.forEach(async (request: RedeemRequest) => {
            // start watcher for new redeem requests
            if (transactionListeners.indexOf(request.id) === -1 && polkaBtcLoaded) {
                // the tx watcher updates the storage cache every 10s
                startTransactionWatcherRedeem(request, dispatch);
            }

            if (!isRedeemExpirationSubscribed) {
                setIsRedeemExpirationSubscribed(true);
                window.polkaBTC.redeem.subscribeToRedeemExpiry(accountId, redeemExpired);
            }
        });
    }, [
        redeemRequests,
        transactionListeners,
        address,
        dispatch,
        isRedeemExpirationSubscribed,
        redeemExpired,
        polkaBtcLoaded,
    ]);

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded) return;

            try {
                const accountId = window.polkaBTC.api.createType("AccountId", address);
                // get all redeem request from parachain
                const redeemRequestMap = await window.polkaBTC.redeem.mapForUser(accountId);
                const allRequests = [];

                for (const [key, value] of redeemRequestMap) {
                    allRequests.push(parachainToUIRedeemRequest(key, value));
                }


                // get btc data for each redeem request
                await Promise.all(
                    allRequests.map(async (request) => {
                        try {
                            request.btcTxId = await window.polkaBTC.btcCore.getTxIdByOpReturn(
                                request.id,
                                request.btcAddress,
                                request.amountPolkaBTC
                            );
                        } catch (err) {
                            console.log("Redeem Id: " + request.id + " " + err);
                        }
                    })
                );
                await Promise.all(
                    allRequests.map(async (request) => {
                        try {
                            if (request.btcTxId) {
                                request.confirmations = (
                                    await window.polkaBTC.btcCore.getTransactionStatus(request.btcTxId)
                                ).confirmations;
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    })
                );

                dispatch(updateAllRedeemRequestsAction(allRequests));
            } catch (error) {
                toast.error(error.toString());
            }
        };
        fetchData();
    }, [polkaBtcLoaded, dispatch, address]);

    return (
        <div>
            {redeemRequests && redeemRequests.length > 0 && (
                <React.Fragment>
                    <h5>{t("redeem_page.redeem_requests")}</h5>
                    <Table hover responsive size={"md"}>
                        <thead>
                            <tr>
                                <th>{t("redeem_page.redeem_id")}</th>
                                <th>{t("redeem_page.amount")}</th>
                                <th>{t("fee")}</th>
                                <th>{t("redeem_page.parachainblock")}</th>
                                <th>{t("redeem_page.output_BTC_address")}</th>
                                <th>{t("redeem_page.BTC_transaction")}</th>
                                <th>{t("redeem_page.confirmations")}</th>
                                <th>{t("redeem_page.completed")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {redeemRequests &&
                                redeemRequests.map((request) => {
                                    return (
                                        <tr key={request.id}>
                                            <td>{shortAddress(request.id)}</td>
                                            <td>{request.amountPolkaBTC} BTC</td>
                                            <td>{(Number(request.amountPolkaBTC)/100)*fee} PolkaBTC</td>
                                            <td>{request.creation}</td>
                                            <td>
                                                <BitcoinAddress btcAddress={request.btcAddress} shorten />
                                            </td>
                                            <td>
                                                <BitcoinTransaction txId={request.btcTxId} shorten />
                                            </td>
                                            <td>{request.confirmations}</td>
                                            <td>{handleCompleted(request)}</td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </Table>
                </React.Fragment>
            )}
        </div>
    );
}
