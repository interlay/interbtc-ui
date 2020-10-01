import React, { Component } from "react";
import { FormGroup, ListGroup, ListGroupItem, Row, Col } from "react-bootstrap";
import { IssueWizardProps } from "./issue-wizard";
import { useSelector } from "react-redux";
import { StoreType } from "../../types/util.types";
import { ChangeEvent } from "react";
import { useEffect } from "react";

interface BTCPaymentProps {
    step: number;
    amountBTC: string,
    feeBTC: string,
    loaded: boolean,
    vaultBTCAddress: string,
    handleChange: () => void,
}

export default function BTCPayment(props: IssueWizardProps | BTCPaymentProps) {
    const polkaBTC = useSelector((state: StoreType) => state.api)

    useEffect(() => {
        const fetchData = async () => {
            props.handleChange(
                {
                    target:
                        {
                            name: "loaded",
                            value: "true"
                        } as EventTarget & HTMLInputElement
                } as ChangeEvent<HTMLInputElement>
            );
        };
        fetchData();
    });

    const amountBTCwithFee = (Number.parseFloat(props.amountBTC) + Number.parseFloat(props.feeBTC)).toString();
    if (props.step !== 3) {
        return null;
    }

    return (
        <FormGroup>
            <h5>Confirmation and Payment</h5>
            <p>You have requested to mint {props.amountBTC} PolkaBTC, incurring a fee of {props.feeBTC} BTC.</p>
            <p>Please make the following Bitcoin payment.</p>
            <h5>Bitcoin Payment Details</h5>
            <p>Create a Bitcoin transaction with two outputs.</p>
            <FormGroup>
                <ListGroup>
                    <ListGroupItem>Output 1</ListGroupItem>
                    <ListGroupItem>OP_RETURN: <strong> 0xloremipsum </strong></ListGroupItem>
                    <ListGroupItem>Amount: <strong>0 BTC</strong></ListGroupItem>
                </ListGroup>
                <ListGroup>
                    <ListGroupItem>Output 2</ListGroupItem>
                    <ListGroupItem>Recipient: <strong>{props.vaultBTCAddress}</strong></ListGroupItem>
                    <ListGroupItem>Amount: <strong>{amountBTCwithFee} BTC</strong></ListGroupItem>
                </ListGroup>
            </FormGroup>
        </FormGroup>
    )
}