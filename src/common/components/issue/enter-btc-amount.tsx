import React, { ChangeEvent } from "react";
import { FormGroup, FormControl } from "react-bootstrap";
import { IssueWizardProps } from "./issue-wizard";
import { useSelector } from "react-redux";
import { StoreType } from "../../types/util.types";

interface EnterBTCAmountProps {
    step: number;
    amountBTC: string;
    feeBTC: string;
    vaultBTCAddress: string;
    handleChange: () => void;
}

export default function EnterBTCAmount(props: IssueWizardProps | EnterBTCAmountProps) {
    const polkaBTC = useSelector((state: StoreType) => state.api);
    if (props.step !== 1) {
        return null;
    } else if (props.vaultBTCAddress === "") {
        const fetchData = async () => {
            const polkaBTCObject = polkaBTC.api.createType("Balance", props.amountBTC);
            const vaultBTCAddress = await polkaBTC.vaults.selectRandomVaultIssue(polkaBTCObject);
            const vault = await polkaBTC.vaults.get(vaultBTCAddress);
            props.handleChange({
                target: {
                    name: "vaultBTCAddress",
                    value: vault.btc_address.toHuman(),
                } as EventTarget & HTMLInputElement,
            } as ChangeEvent<HTMLInputElement>);
        };
        fetchData();
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
    );
}
