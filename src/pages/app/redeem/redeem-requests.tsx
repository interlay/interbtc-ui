import React, { useState, ReactElement } from "react";
import { RedeemRequest, RedeemRequestStatus } from "../../../common/types/redeem.types";
import { Table } from "react-bootstrap";
import { FaCheck, FaHourglass } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { changeRedeemIdAction } from "../../../common/actions/redeem.actions";
import BitcoinTransaction from "../../../common/components/bitcoin-links/transaction";
import { useTranslation } from "react-i18next";
import RedeemModal from "./modal/redeem-modal";
import { formatDateTimePrecise } from "../../../common/utils/utils";

export default function RedeemRequests(): ReactElement {
    const { address } = useSelector((state: StoreType) => state.general);
    const redeemRequests = useSelector((state: StoreType) => state.redeem.redeemRequests).get(address);
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const closeModal = () => setShowModal(false);

    const handleStatusColumn = (request: RedeemRequest) => {
        switch (request.status) {
            case RedeemRequestStatus.Reimbursed: {
                return <div>{t("redeem_page.reimbursed")}</div>;
            }
            case RedeemRequestStatus.Expired: {
                return <div>{t("redeem_page.recover")}</div>;
            }
            case RedeemRequestStatus.Retried: {
                return <div>{t("redeem_page.retried")}</div>;
            }
            case RedeemRequestStatus.Completed: {
                return <FaCheck></FaCheck>;
            }
            default: {
                return <FaHourglass></FaHourglass>;
            }
        }
    };

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
                                            <td>
                                                {!request.timestamp
                                                    ? t("pending")
                                                    : formatDateTimePrecise(new Date(request.timestamp))}
                                            </td>
                                            <td>{request.amountPolkaBTC} BTC</td>
                                            <td>
                                                {request.status === RedeemRequestStatus.Expired ? (
                                                    <div>{t("redeem_page.failed")}</div>
                                                ) : (
                                                    <BitcoinTransaction txId={request.btcTxId} shorten />
                                                )}
                                            </td>
                                            <td>
                                                {request.btcTxId === ""
                                                    ? t("not_applicable")
                                                    : Math.max(request.confirmations, 0)}
                                            </td>
                                            <td>{handleStatusColumn(request)}</td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </Table>
                </React.Fragment>
            )}
            <RedeemModal show={showModal} onClose={closeModal} />
        </div>
    );
}
