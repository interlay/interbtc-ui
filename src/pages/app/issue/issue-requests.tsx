import React, { useState, ReactElement } from "react";

import { IssueRequest, IssueRequestStatus } from "../../../common/types/issue.types";
import { Table, Badge } from "react-bootstrap";
import { FaCheck, FaHourglass } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { changeIssueIdAction } from "../../../common/actions/issue.actions";
import BitcoinTransaction from "../../../common/components/bitcoin-links/transaction";
import { showAccountModalAction } from "../../../common/actions/general.actions";
import { useTranslation } from "react-i18next";
import IssueModal from "./modal/issue-modal";
import { formatDateTimePrecise } from "../../../common/utils/utils";

export default function IssueRequests(): ReactElement {
    const { address, extensions } = useSelector((state: StoreType) => state.general);
    const issueRequests = useSelector((state: StoreType) => state.issue.issueRequests).get(address) || [];
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const closeModal = () => setShowModal(false);

    const openWizard = () => {
        if (extensions.length && address) {
            setShowModal(true);
        } else {
            dispatch(showAccountModalAction(true));
        }
    };

    const handleCompleted = (request: IssueRequest) => {
        switch (request.status) {
            case IssueRequestStatus.RequestedRefund:
            case IssueRequestStatus.Completed: {
                return <FaCheck></FaCheck>;
            }
            case IssueRequestStatus.Cancelled: {
                return (
                    <Badge className="badge-style" variant="secondary">
                        {t("cancelled")}
                    </Badge>
                );
            }
            case IssueRequestStatus.Expired: {
                return (
                    <h5>
                        <Badge variant="secondary">{t("issue_page.expired")}</Badge>
                    </h5>
                );
            }
            default: {
                return <FaHourglass></FaHourglass>;
            }
        }
    };

    const requestClicked = (request: IssueRequest): void => {
        dispatch(changeIssueIdAction(request.id));
        openWizard();
    };

    return (
        <div className="container mt-5">
            {issueRequests && issueRequests.length > 0 && (
                <React.Fragment>
                    <h5>{t("issue_requests")}</h5>
                    <p>{t("issue_page.click_on_issue_request")}</p>
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
                            {issueRequests.map((request: IssueRequest, index: number) => {
                                return (
                                    <tr
                                        key={index}
                                        onClick={() => requestClicked(request)}
                                        className="table-row-opens-modal"
                                    >
                                        <td>
                                            {!request.timestamp
                                                ? t("pending")
                                                : formatDateTimePrecise(new Date(request.timestamp))}
                                        </td>
                                        <td>
                                            {request.issuedAmountBtc || request.requestedAmountPolkaBTC}{" "}
                                            <span className="grey-text">PolkaBTC</span>
                                        </td>
                                        <td>
                                            <BitcoinTransaction txId={request.btcTxId} shorten />
                                        </td>
                                        <td>
                                            {request.btcTxId === ""
                                                ? t("not_applicable")
                                                : Math.max(request.confirmations, 0)}
                                        </td>
                                        <td>{handleCompleted(request)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                    <IssueModal show={showModal} onClose={closeModal} />
                </React.Fragment>
            )}
        </div>
    );
}
