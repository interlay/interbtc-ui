import React, { ChangeEvent, useEffect } from "react";
import { useSelector } from "react-redux";
import { StoreType } from "../../types/util.types";
import { FormGroup, ListGroup, ListGroupItem } from "react-bootstrap";
import { IssueWizardProps } from "./issue-wizard";

export default function RequestConfirmation(props: IssueWizardProps) {
    const polkaBTC = useSelector((state: StoreType) => state.api);
    if (props.step !== 2) {
        return null;
    } else {
        if (props.vaultBTCAddress == "") {
            const fetchData = async () => {
                const polkaBTCObject = polkaBTC.api.createType("Balance", props.amountBTC);
                // TODO: move this call to the enter-btc-amount part 
                const vaultBTCAddress = await polkaBTC.vaults.selectRandomVault(polkaBTCObject);
                console.log(vaultBTCAddress);
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
    }

    return <FormGroup>
        <h5>Summary</h5>
        <FormGroup>
            <ListGroup>
                <ListGroupItem>
                    Fees: <strong>{props.feeBTC} BTC</strong>
                </ListGroupItem>
                <ListGroupItem>Vault address: <strong>{props.vaultBTCAddress}</strong></ListGroupItem>
                <ListGroupItem>Receiving: <strong>{props.amountBTC} PolkaBTC</strong></ListGroupItem>
            </ListGroup>
        </FormGroup>
    </FormGroup>;
}