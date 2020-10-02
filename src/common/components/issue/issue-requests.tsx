import React, { Component } from 'react';

import { IssueProps, IssueRequest } from "../../types/IssueState";
import { Table } from "react-bootstrap";
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
    issueRequestHash: string,
    issueRequests: Array<IssueRequest>,
    handleUpdatedIssueRequests: () => void,
}

export default function IssueRequests(props: IssueProps | IssueRequestsProps) {
    const polkaBTC = useSelector((state: StoreType) => state.api);

    useEffect(() => {
        const fetchData = async () => {
            const updatedIssueRequests = props.issueRequests.map(async (request) => {
                const { confirmed, confirmations } = await polkaBTC.btcCore.getTransactionStatus(request.btcTxId);
                return {
                    id: request.id,
                    amountBTC: request.amountBTC,
                    vaultBTCAddress: request.vaultBTCAddress,
                    btcTxId: request.vaultBTCAddress,
                    confirmations: confirmations,
                    completed: confirmed,
                    creation: request.creation
                } as IssueRequest;
            });
            props.handleUpdatedIssueRequests(await Promise.all(updatedIssueRequests));
        };
        fetchData();
    });

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
                        })
                    }
                </tbody>
            </Table>
        </div>
    );
}
