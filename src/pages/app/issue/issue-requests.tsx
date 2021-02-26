import React, { Dispatch, useState, ReactElement } from "react";

import Big from "big.js";
import { IssueRequest, IssueRequestStatus } from "../../../common/types/issue.types";
import { Table, Badge } from "react-bootstrap";
import { FaCheck, FaHourglass } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { toast } from "react-toastify";
import { updateIssueRequestAction, changeSelectedIssueAction } from "../../../common/actions/issue.actions";
import BitcoinTransaction from "../../../common/components/bitcoin-links/transaction";
import { updateBalancePolkaBTCAction, showAccountModalAction } from "../../../common/actions/general.actions";
import { useTranslation } from "react-i18next";
import { ParachainStatus } from "../../../common/types/util.types";
import IssueModal from "./modal/issue-modal";
import { TFunction } from "i18next";
import { formatDateTimePrecise } from "../../../common/utils/utils";

export default function IssueRequests(): ReactElement {
    const { address, extensions, stateOfBTCParachain } = useSelector((state: StoreType) => state.general);
    const issueRequests = useSelector((state: StoreType) => state.issue.issueRequests).get(address);
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const closeModal = () => setShowModal(false);

    const openWizard = () => {
        if (stateOfBTCParachain === ParachainStatus.Error) {
            toast.error(t("issue_page.error_in_parachain"));
            return;
        }
        if (extensions.length && address) {
            setShowModal(true);
        } else {
            dispatch(showAccountModalAction(true));
        }
    };

    const handleCompleted = (request: IssueRequest) => {
        switch (request.status) {
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
        dispatch(changeSelectedIssueAction(request));
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
                                    <tr key={index} onClick={() => requestClicked(request)}>
                                        <td>
                                            {!request.timestamp
                                                ? t("pending")
                                                : formatDateTimePrecise(new Date(request.timestamp))}
                                        </td>
                                        <td>
                                            {request.amountPolkaBTC} <span className="grey-text">PolkaBTC</span>
                                        </td>
                                        <td>
                                            <BitcoinTransaction txId={request.btcTxId} shorten />
                                        </td>
                                        <td>{request.btcTxId === "" ? t("not_applicable") : request.confirmations}</td>
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

// leaving execute here for now, in case it will be called some other way in

// the future
export async function execute(
    request: IssueRequest,
    polkaBtcLoaded: boolean,
    dispatch: Dispatch<any>,
    balancePolkaBTC: string,
    t: TFunction
) {
    if (!polkaBtcLoaded) return;

    let [merkleProof, rawTx] = [request.merkleProof, request.rawTransaction];
    let transactionData = false;
    let txId = request.btcTxId;
    try {
        // get proof data from bitcoin
        if (txId === "") {
            txId = await window.polkaBTC.btcCore.getTxIdByRecipientAddress(
                request.vaultBTCAddress,
                request.amountPolkaBTC
            );
        }
        [merkleProof, rawTx] = await Promise.all([
            window.polkaBTC.btcCore.getMerkleProof(txId),
            window.polkaBTC.btcCore.getRawTransaction(txId),
        ]);
        transactionData = true;
    } catch (err) {
        toast.error(t("issue_page.transaction_not_included"));
    }

    if (!transactionData) return;
    try {
        const provenReq = request;
        provenReq.merkleProof = merkleProof;
        provenReq.rawTransaction = rawTx;
        dispatch(updateIssueRequestAction(provenReq));

        const txIdBuffer = Buffer.from(txId, "hex").reverse();

        // prepare types for polkadot
        const parsedIssuedId = window.polkaBTC.api.createType("H256", "0x" + provenReq.id);
        const parsedTxId = window.polkaBTC.api.createType("H256", txIdBuffer);
        const parsedMerkleProof = window.polkaBTC.api.createType("Bytes", "0x" + merkleProof);
        const parsedRawTx = window.polkaBTC.api.createType("Bytes", rawTx);

        // execute issue
        const success = await window.polkaBTC.issue.execute(parsedIssuedId, parsedTxId, parsedMerkleProof, parsedRawTx);

        if (!success) {
            throw new Error(t("issue_page.execute_failed"));
        }

        const completedReq = provenReq;
        completedReq.status = IssueRequestStatus.Completed;

        dispatch(
            updateBalancePolkaBTCAction(new Big(balancePolkaBTC).add(new Big(provenReq.amountPolkaBTC)).toString())
        );
        dispatch(updateIssueRequestAction(completedReq));

        toast.success(t("issue_page.succesfully_executed", { id: request.id }));
    } catch (error) {
        toast.error(error.toString());
    }
}
