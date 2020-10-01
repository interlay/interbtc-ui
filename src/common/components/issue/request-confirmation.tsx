import React from "react";
import { FormGroup, ListGroup, ListGroupItem } from "react-bootstrap";
import { IssueWizardProps } from "./issue-wizard";

export default function RequestConfirmation(props: IssueWizardProps){
    const polkaBTC = useSelector((state: StoreType)=>state.api);

    useEffect(()=>{
        const fetchData = async () => {
        }
        fetchData();
    },[polkaBTC])

    if (props.step !== 2) {
        return null;
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
