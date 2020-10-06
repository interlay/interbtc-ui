import React, { useState, MouseEvent } from 'react';

import { IssueRequest } from "../../../common/types/issue.types";
import { Table } from "react-bootstrap";
import { dateToShortString, shortAddress, shortTxId } from "../../../common/utils/utils";
import { FaCheck, FaHourglass } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { useEffect } from "react";
import ButtonMaybePending from '../../../common/components/pending-button';
import { toast } from 'react-toastify';
import { startTransactionProofWatcherIssue, startTransactionWatcherIssue } from '../../../common/utils/transaction-watcher';
import { 
    updateIssueRequestAction, 
    changeIssueStepAction, 
    changeBtcTxIdAction, 
    changeIssueIdAction } from '../../../common/actions/issue.actions';

type IssueRequestProps = {
    handleShow: ()=>void;
}

export default function IssueRequests(props: IssueRequestProps) {
    const issueRequests = useSelector((state: StoreType) => state.issue.issueRequests);
    const transactionListeners = useSelector((state: StoreType) => state.issue.transactionListeners);
    const proofListeners = useSelector((state: StoreType) => state.issue.proofListeners);

    const [isExecutePending, setExecutePending] = useState(false);
    const polkaBTC = useSelector((state: StoreType) => state.api);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            issueRequests.map(async (request: IssueRequest) => {
                if(transactionListeners.indexOf(request.id) === -1){
                    startTransactionWatcherIssue(request, polkaBTC, dispatch);
                }
            });
            issueRequests.map(async (request: IssueRequest) => {
                if(proofListeners.indexOf(request.id) === -1){
                    startTransactionProofWatcherIssue(request, polkaBTC, dispatch);                    
                }
            });
        }
        fetchData();
    }, [polkaBTC, issueRequests, proofListeners, transactionListeners, dispatch]);

    const execute = async (request: IssueRequest) => {
        setExecutePending(true);
        try {
            const parsedIssuedId = polkaBTC.api.createType("H256", request.id);
            const parsedTxId = polkaBTC.api.createType("H256", request.btcTxId);
            const parsedTxBlockHeight = polkaBTC.api.createType("u32", request.transactionBlockHeight);
            const parsedMerkleProof = polkaBTC.api.createType("Bytes", request.merkleProof);
            const parsedRawTx = polkaBTC.api.createType("Bytes", request.rawTransaction);

            await polkaBTC.issue.execute(parsedIssuedId, parsedTxId, parsedTxBlockHeight, parsedMerkleProof, parsedRawTx);

            const req = issueRequests.find((issueRequest: IssueRequest) => issueRequest.id === request.id);
            if (req) {
                let updatedReq = req;
                updatedReq.completed = true;
                dispatch(updateIssueRequestAction(updatedReq));
            }

            toast.success("Succesfully executed redeem request: " + request.id);
        } catch (error) {
            toast.error(error.toString());
        }
        setExecutePending(false);
    };

    const handleCompleted = (request: IssueRequest) => {
        if (request.confirmations < 6) {
            return (<FaHourglass></FaHourglass>);
        } else if (request.completed) {
            return (<FaCheck></FaCheck>);
        } else {
            return (
                <ButtonMaybePending
                    variant="outline-dark"
                    isPending={isExecutePending}
                    size="lg"
                    block
                    onClick={(event: MouseEvent<HTMLElement>) => {event.stopPropagation(); execute(request);}}>
                    Execute
                </ButtonMaybePending>

            );
        }
    };

    const requestClicked = (request: IssueRequest): void => {
        if(request.completed) return;

        dispatch(changeBtcTxIdAction(request.btcTxId));
        dispatch(changeIssueIdAction(request.id));
        dispatch(changeIssueStepAction("BTC_PAYMENT_CONFIRMATION"));
        props.handleShow();
    }

    return (
        <div>
            <Table hover responsive size={"md"}>
                <thead>
                    <tr>
                        <th>Issue ID</th>
                        <th>Amount</th>
                        <th>Creation</th>
                        <th>Vault BTC Address</th>
                        <th>BTC Transaction</th>
                        <th>Confirmations</th>
                        <th>Completed</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        issueRequests && issueRequests.map((request: IssueRequest) => {
                            return (
                                <tr onClick={()=>requestClicked(request)}>
                                    <td>{shortAddress(request.id)}</td>
                                    <td>{request.amountBTC} PolkaBTC</td>
                                    <td>{dateToShortString(request.creation)}</td>
                                    <td>{shortAddress(request.vaultBTCAddress)}</td>
                                    <td>{shortTxId(request.btcTxId)}</td>
                                    <td>{request.confirmations}</td>
                                    <td>{handleCompleted(request)}</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
        </div >
    );
}
