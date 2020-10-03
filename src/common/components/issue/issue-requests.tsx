import React from 'react';

import { IssueProps, IssueRequest } from "../../types/IssueState";
import { Button, Table } from "react-bootstrap";
import { shortAddress, shortTxId } from "../../utils/utils";
import { FaCheck, FaHourglass } from "react-icons/fa";
import { useSelector } from "react-redux";
import { StoreType } from "../../types/util.types";
import { useEffect } from "react";
import { TxStatus } from "@interlay/polkabtc/build/apis/btc-core";

interface IssueRequestsProps {
    step: number;
    amountBTC: string,
    feeBTC: string,
    vaultBTCAddress: string,
    vaultId: string,
    lastIssueRequestHash: string,
    issueRequests: Array<IssueRequest>,
    lastissueRequestsUpdate: Date,
    handleUpdatedIssueRequests: () => void,
}



export default function IssueRequests(props: IssueProps | IssueRequestsProps) {
    const polkaBTC = useSelector((state: StoreType) => state.api);
    // const[startedUpdatingIssueRequests, setUpdatingIssueRequests] = useState({});
    useEffect(() => {
        // eslint-disable-next-line
        const fetchData = async () => {
            console.log("updating requests");
            const pendingUpdatedIssueRequests = props.issueRequests.map(async (request) => {
                let txStatus: TxStatus = { confirmed: false, confirmations: 0 };
                try {
                    txStatus = await polkaBTC.btcCore.getTransactionStatus(request.btcTxId);
                } catch (e) {
                    console.log(`Error retrieving tx status`);
                }

                if (txStatus.confirmations < 6) {
                    return {
                        id: request.id,
                        amountBTC: request.amountBTC,
                        vaultBTCAddress: request.vaultBTCAddress,
                        btcTxId: request.btcTxId,
                        confirmations: txStatus.confirmations,
                        completed: txStatus.confirmed,
                        creation: request.creation,
                        merkleProof: "",
                        transactionBlockHeight: 0,
                        rawTransaction: new Uint8Array(),
                        issueRequestHash: request.issueRequestHash,
                    } as IssueRequest;
                } else if (txStatus.confirmations >= 6) {
                    let blockHeight = 0;
                    let rawTx = new Uint8Array();
                    let merkleProof = "";
                    try {
                        const txBlockHeight = await polkaBTC.btcCore.getTransactionBlockHeight(request.btcTxId);
                        if (txBlockHeight) {
                            blockHeight = txBlockHeight;
                        }
                        const rawTxBuffer = new Uint8Array(await polkaBTC.btcCore.getRawTransaction(request.btcTxId));
                        rawTx = rawTxBuffer;
                        merkleProof = await polkaBTC.btcCore.getMerkleProof(request.btcTxId);
                    } catch (e) {
                        console.log(`Error retrieving blockHeight, rawTx, merkleProof \n ${e}`);
                    }

                    return {
                        id: request.id,
                        amountBTC: request.amountBTC,
                        vaultBTCAddress: request.vaultBTCAddress,
                        btcTxId: request.btcTxId,
                        confirmations: txStatus.confirmations,
                        completed: txStatus.confirmed,
                        creation: request.creation,
                        merkleProof: merkleProof,
                        transactionBlockHeight: blockHeight,
                        rawTransaction: rawTx,
                        issueRequestHash: request.issueRequestHash,
                    } as IssueRequest;
                }
                return {} as IssueRequest;
            });
            const updatedIssueRequests: Array<IssueRequest> = await Promise.all(pendingUpdatedIssueRequests);
            console.log("props.issueRequests");
            console.log(props.issueRequests);


            props.handleUpdatedIssueRequests(updatedIssueRequests);
        };
        // FIXME: update issue requests
        // if (!startedUpdatingIssueRequests) {
        //     setInterval(fetchData, 15000);
        //     setUpdatingIssueRequests({ startedUpdatingIssueRequests: true})
        // }
    });

    async function execute(
        issueId: string,
        txId: string,
        txBlockHeight: number,
        merkleProof: string,
        rawTx: Uint8Array
    ) {
        console.log("clicked Execute");
        const parsedIssuedId = polkaBTC.api.createType("H256", issueId);
        const parsedTxId = polkaBTC.api.createType("H256", txId);
        const parsedTxBlockHeight = polkaBTC.api.createType("u32", txBlockHeight);
        const parsedMerkleProof = polkaBTC.api.createType("Bytes", merkleProof);
        const parsedRawTx = polkaBTC.api.createType("Bytes", rawTx);

        await polkaBTC.issue.execute(parsedIssuedId, parsedTxId, parsedTxBlockHeight, parsedMerkleProof, parsedRawTx);
        console.log("Sent executeIssue tx");
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
                        <th>Complete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.issueRequests.map((request) => {
                            if (request.confirmations < 6) {
                                return (
                                    <tr>
                                        <td>{request.id}</td>
                                        <td>{request.amountBTC} PolkaBTC</td>
                                        <td>{request.creation}</td>
                                        <td>{shortAddress(request.vaultBTCAddress)}</td>
                                        <td>{shortTxId(request.btcTxId)}</td>
                                        <td>{request.confirmations}</td>
                                        <td>{request.completed ? <FaCheck></FaCheck> : <FaHourglass></FaHourglass>}</td>
                                    </tr>
                                );
                            } else {
                                return (
                                    <tr>
                                        <td>{request.id}</td>
                                        <td>{request.amountBTC} PolkaBTC</td>
                                        <td>{request.creation}</td>
                                        <td>{shortAddress(request.vaultBTCAddress)}</td>
                                        <td>{shortTxId(request.btcTxId)}</td>
                                        <td>{request.confirmations}</td>
                                        <td>
                                            <Button
                                                variant="outline-dark"
                                                size="lg"
                                                block
                                                onClick={
                                                    () => execute(
                                                        request.issueRequestHash,
                                                        request.btcTxId,
                                                        request.transactionBlockHeight,
                                                        request.merkleProof,
                                                        request.rawTransaction
                                                    )}>
                                                Execute
                                            </Button>
                                        </td>
                                    </tr>
                                );

                            }
                        })
                    }
                </tbody>
            </Table>
        </div >
    );
}
