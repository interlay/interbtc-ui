import React from "react";
import { FormGroup, FormControl } from "react-bootstrap";
import { IssueWizardProps } from "./issue-wizard";

interface BTCTransactionProps {
    btcTxId: string,
    step: number;
    handleChange: () => void
}

export default function BTCTransaction(props: IssueWizardProps | BTCTransactionProps) {
    // const [amountBTC,setAmountBTC] = useState(props.amountBTC);

    // const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    //   // FIXME: this should also update the amountPolkaBTC in the parent
    //   let { name, value } = event.target;
    //   setAmountBTC(value);
    //   props.handleChange(event);
    // }

    if (props.step !== 4) {
        return null;
    }

    return (
        <FormGroup>
            <p>Please enter your BTC transaction id. We will monitor it for you and notify you when you can complete the process.</p>
            <FormControl
                id="btcTxId"
                name="btcTxId"
                type="string"
                value={props.btcTxId}
                onChange={props.handleChange}
            />
        </FormGroup>
    );

}