import React from "react";
import { FormGroup, FormControl } from "react-bootstrap";
import { IssueWizardProps } from "./issue-wizard";

interface EnterBTCAmountProps {
    step: number;
    amountBTC: string,
    handleChange: () => void
}

export default function EnterBTCAmount(props: IssueWizardProps | EnterBTCAmountProps){
    // const [amountBTC,setAmountBTC] = useState(props.amountBTC);
  
    // const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    //   // FIXME: this should also update the amountPolkaBTC in the parent
    //   let { name, value } = event.target;
    //   setAmountBTC(value);
    //   props.handleChange(event);
    // }

    if (props.step !== 1) {
        return null
    }

    return(
    <FormGroup>
        <p>How much BTC to you want to receive in PolkaBTC?</p>
        <FormControl
        id="amountBTC"
        name="amountBTC"
        type="string"
        value={props.amountBTC}
        onChange={props.handleChange}
        />
    </FormGroup>
    )
    
  }