import React from "react";
import { FormGroup, FormControl } from "react-bootstrap";
import { IssueWizardProps } from "./issue-wizard";

interface EnterBTCAmountProps {
    step: number;
    amountBTC: string,
    feeBTC: string
    handleChange: () => void,
}

export default function EnterBTCAmount(props: IssueWizardProps | EnterBTCAmountProps) {
    if (props.step !== 1) {
        return null
    }
    
    return (
        <FormGroup>
            <p>Please enter the amount of BTC you want to receive in PolkaBTC.</p>
            <FormControl
                id="amountBTC"
                name="amountBTC"
                type="string"
                value={props.amountBTC}
                onChange={props.handleChange}
            />
            <p>Fee: {props.feeBTC} BTC</p>
        </FormGroup>
    )
}