import React, { useEffect, useState, useCallback } from "react";
import { RedeemRequest } from "../../../common/types/redeem.types";
import { Table, Button } from "react-bootstrap";
import { parachainToUIRedeemRequest } from "../../../common/utils/utils";
import { FaCheck, FaHourglass } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { startTransactionWatcherRedeem } from "../../../common/utils/redeem-transaction.watcher";
import {
    updateAllRedeemRequestsAction,
    redeemExpiredAction,
    changeRedeemIdAction
} from "../../../common/actions/redeem.actions";
import { toast } from "react-toastify";
import BitcoinTransaction from "../../../common/components/bitcoin-links/transaction";
import { useTranslation } from 'react-i18next';
import ReimburseModal from "./reimburse-modal";
import RedeemModal from "./modal/redeem-modal";


export default function RedeemRequests() {
    const { polkaBtcLoaded, address } = useSelector((state: StoreType) => state.general);
    const redeemRequests = useSelector((state: StoreType) => state.redeem.redeemRequests).get(address);
    const { transactionListeners } = useSelector((state: StoreType) => state.redeem);
    const [isRedeemExpirationSubscribed, setIsRedeemExpirationSubscribed] = useState(false);
    const [showReimburseModal, setShowReimburseModal] = useState(false);
    const [reimburseRequest, setReimburseRequest] = useState<RedeemRequest>();
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();
    const { t } = useTranslation();

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

    const closeReimburseModal = () => {
        setShowReimburseModal(false);
    };

    const openReimburseModal = (request: RedeemRequest) => {
        setReimburseRequest(request);
        setShowReimburseModal(true);
    };

    const closeModal = () => setShowModal(false);

    const handleCompleted = (request: RedeemRequest) => {
        if (!request.completed && request.isExpired) {
            if (request.reimbursed && request.cancelled) {
                return <div>{t("redeem_page.reimbursed")}</div>;
            }
            if (!request.cancelled && !request.reimbursed) {
                return <Button
                    onClick={(event) => {event.stopPropagation(); openReimburseModal(request);}}
                    className="ml-3"
                    variant="outline-dark">
                    {t("redeem_page.recover")}
                </Button>
            }
            return <div>{t("redeem_page.retried")}</div>;
            // TODO: do we need the cancelled state?
            // if (request.cancelled) {
            //     return <Badge className="badge-style" variant="secondary">{t("cancelled")}</Badge>;
            // }
        }
        if (request.completed) {
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

    const requestClicked = (request: RedeemRequest): void => {
        dispatch(changeRedeemIdAction(request.id));
        setShowModal(true);
    };

    return (
        <div className="container mt-5">
            {redeemRequests && redeemRequests.length > 0 && (
                <React.Fragment>
                    <h5>{t("redeem_requests")}</h5>
                    <Table hover responsive size={"md"}>
                        <thead>
                            <tr>
                                <th>{t("issue_page.updated")}</th>
                                <th>{t("issue_page.amount")}</th>
                                <th>{t("issue_page.btc_transaction")}</th>
                                <th>{t("issue_page.confirmations")}</th>
                                <th>{t("status")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {redeemRequests &&
                                redeemRequests.map((request) => {
                                    return (
                                        <tr key={request.id} onClick={() => requestClicked(request)}>
                                            <td>{request.creation === "0" ? "Pending..." : request.creation}</td>
                                            <td>{request.amountPolkaBTC} BTC</td>
                                            <td>
                                                {!request.completed && request.isExpired ? (
                                                    <div>{t("redeem_page.failed")}</div>
                                                ) : (
                                                    <BitcoinTransaction txId={request.btcTxId} shorten />
                                                )}
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
            <RedeemModal show={showModal} onClose={closeModal}/>
            <ReimburseModal show={showReimburseModal} request={reimburseRequest} onClose={closeReimburseModal} />
        </div>
    );
}
