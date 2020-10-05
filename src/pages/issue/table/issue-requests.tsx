import React, { useState } from 'react';

import { IssueRequest } from "../../../common/types/issue.types";
import { Table } from "react-bootstrap";
import { dateToShortString, shortAddress, shortTxId } from "../../../common/utils/utils";
import { FaCheck, FaHourglass } from "react-icons/fa";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { useEffect } from "react";
import ButtonMaybePending from '../../../common/components/pending-button';
import { toast } from 'react-toastify';
import { startTransactionProofWatcherIssue, startTransactionWatcherIssue } from '../../../common/utils/transaction-watcher';

export default function IssueRequests() {
    const [issueRequests, setIssueRequests] = useState<Array<IssueRequest>>([]);
    // const [startedUpdatingIssueRequests, setUpdatingIssueRequests] = useState({});
    const [isExecutePending, setExecutePending] = useState(false);
    const storage = useSelector((state: StoreType) => state.storage);
    const polkaBTC = useSelector((state: StoreType) => state.api);

    useEffect(() => {
        const fetchData = async () => {
            if (!storage) return;
            // Load issue requests
            const issueRequests = storage.getIssueRequests();
            setIssueRequests(issueRequests);
            issueRequests.map(async (request: IssueRequest) => {
                startTransactionWatcherIssue(request.id, polkaBTC, storage);
            });
            issueRequests.map(async (request: IssueRequest) => {
                startTransactionProofWatcherIssue (request.id, polkaBTC, storage);
            });
        }
        fetchData();
    }, [polkaBTC, storage]);

    const execute = async (request: IssueRequest) => {
        setExecutePending(true);
        try {
            const parsedIssuedId = polkaBTC.api.createType("H256", request.id);
            const parsedTxId = polkaBTC.api.createType("H256", request.btcTxId);
            const parsedTxBlockHeight = polkaBTC.api.createType("u32", request.transactionBlockHeight);
            const parsedMerkleProof = polkaBTC.api.createType("Bytes", request.merkleProof);
            const parsedRawTx = polkaBTC.api.createType("Bytes", request.rawTransaction);

            await polkaBTC.issue.execute(parsedIssuedId, parsedTxId, parsedTxBlockHeight, parsedMerkleProof, parsedRawTx);

            const req = storage.getIssueRequest(request.id);
            if (req) {
                let updatedReq = req;
                updatedReq.completed = true;
                storage.modifyIssueRequest(updatedReq);
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
                    onClick={() => execute(request)}>
                    Execute
                </ButtonMaybePending>

            );
        }
    };

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
                        issueRequests.map((request) => {
                            return (
                                <tr>
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
