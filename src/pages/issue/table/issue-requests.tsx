import React, { useState } from 'react';

import { IssueRequest } from "../../../common/types/issue.types";
import { Table } from "react-bootstrap";
import { dateToShortString, remove0x, shortAddress, shortTxId } from "../../../common/utils/utils";
import { FaCheck, FaHourglass } from "react-icons/fa";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { useEffect } from "react";
// import { TxStatus } from "@interlay/polkabtc/build/apis/btc-core";
import ButtonMaybePending from '../../../common/components/pending-button';
import { toast } from 'react-toastify';

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
            // eslint-disable-next-line
            // const pendingUpdatedIssueRequests = props.issueRequests.map(async (request) => {
            //     let txStatus: TxStatus = { confirmed: false, confirmations: 0 };
            //     try {
            //         txStatus = await polkaBTC.btcCore.getTransactionStatus(request.btcTxId);
            //     } catch (e) {
            //         console.log(`Error retrieving tx status`);
            //     }

            //     if (txStatus.confirmations < 6) {
            //         return {
            //             id: request.id,
            //             amountBTC: request.amountBTC,
            //             vaultBTCAddress: request.vaultBTCAddress,
            //             btcTxId: request.btcTxId,
            //             confirmations: txStatus.confirmations,
            //             completed: txStatus.confirmed,
            //             creation: request.creation,
            //             merkleProof: "",
            //             transactionBlockHeight: 0,
            //             rawTransaction: new Uint8Array(),
            //             issueRequestHash: request.issueRequestHash,
            //         } as IssueRequest;
            //     } else if (txStatus.confirmations >= 6) {
            //         let blockHeight = 0;
            //         let rawTx = new Uint8Array();
            //         let merkleProof = "";
            //         try {
            //             const txBlockHeight = await polkaBTC.btcCore.getTransactionBlockHeight(request.btcTxId);
            //             if (txBlockHeight) {
            //                 blockHeight = txBlockHeight;
            //             }
            //             const rawTxBuffer = new Uint8Array(await polkaBTC.btcCore.getRawTransaction(request.btcTxId));
            //             rawTx = rawTxBuffer;
            //             merkleProof = await polkaBTC.btcCore.getMerkleProof(request.btcTxId);
            //         } catch (e) {
            //             console.log(`Error retrieving blockHeight, rawTx, merkleProof \n ${e}`);
            //         }

            //         return {
            //             id: request.id,
            //             amountBTC: request.amountBTC,
            //             vaultBTCAddress: request.vaultBTCAddress,
            //             btcTxId: request.btcTxId,
            //             confirmations: txStatus.confirmations,
            //             completed: txStatus.confirmed,
            //             creation: request.creation,
            //             merkleProof: merkleProof,
            //             transactionBlockHeight: blockHeight,
            //             rawTransaction: rawTx,
            //             issueRequestHash: request.issueRequestHash,
            //         } as IssueRequest;
            //     }
            //     return {} as IssueRequest;
            // });
            // // const updatedIssueRequests: Array<IssueRequest> = await Promise.all(pendingUpdatedIssueRequests);
            // console.log("props.issueRequests");
            // console.log(props.issueRequests);

            // TODO: update issue requests in storage
        };
        // FIXME: update issue requests
        // if (!startedUpdatingIssueRequests) {
        //     setInterval(fetchData, 15000);
        //     setUpdatingIssueRequests({ startedUpdatingIssueRequests: true})
        // }
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
                                    <td>{shortAddress(remove0x(request.vaultBTCAddress))}</td>
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
