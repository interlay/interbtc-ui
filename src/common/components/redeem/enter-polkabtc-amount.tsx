import React, { ChangeEvent } from "react";
import { FormGroup, FormControl } from "react-bootstrap";
import { RedeemWizardProps } from "./redeem-wizard";
import { useSelector } from "react-redux";
import { StoreType } from "../../types/util.types";

interface EnterPolkaBTCAmountProps {
    step: number;
    amountPolkaBTC: string,
    feePolkaBTC: string,
    vaultBTCAddress: string,
    handleChange: () => void,
}

export default function EnterPolkaBTCAmount(props: RedeemWizardProps | EnterPolkaBTCAmountProps) {
    const polkaBTC = useSelector((state: StoreType) => state.api);
    if (props.step !== 1) {
        return null;
    } else if (props.vaultBTCAddress == "") {
        const fetchData = async () => {
            const polkaBTCObject = polkaBTC.api.createType("Balance", props.amountPolkaBTC);
            const vaultBTCAddress = await polkaBTC.vaults.selectRandomVault(polkaBTCObject);
            props.handleChange(
                {
                    target:
                        {
                            name: "vaultBTCAddress",
                            value: vaultBTCAddress.btc_address.toHuman()
                        } as EventTarget & HTMLInputElement
                } as ChangeEvent<HTMLInputElement>
            );
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
                value={props.amountPolkaBTC}
                onChange={props.handleChange}
            />
            <p>Fee: {props.feePolkaBTC} PolkaBTC</p>
        </FormGroup>
    );
}