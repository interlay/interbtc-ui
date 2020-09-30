import React from "react";
import { FormGroup, FormControl } from "react-bootstrap";
import { IssueWizardProps } from "./issue-wizard";

interface EnterBTCAmountProps {
    step: number;
    amountPolkaBTC: string,
    handleChange: () => void,
    feeBTC: string
}

export default function EnterBTCAmount(props: IssueWizardProps | EnterBTCAmountProps){
    // const [amountPolkaBTC,setamountPolkaBTC] = useState(props.amountPolkaBTC);
  
    // const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    //   // FIXME: this should also update the amountPolkaBTC in the parent
    //   let { name, value } = event.target;
    //   setamountPolkaBTC(value);
    //   props.handleChange(event);
    // }

    if (props.step !== 1) {
        return null
    }
    

    return(
    <FormGroup>
        <p>Please enter the amount of PolkaBTC you would like to mint:</p>
        <FormControl
        id="amountPolkaBTC"
        name="amountPolkaBTC"
        type="string"
        value={props.amountPolkaBTC}
        onChange={props.handleChange}
        />

        <p>Fee: {props.feeBTC} BTC</p>
    </FormGroup>
    )
    
  }