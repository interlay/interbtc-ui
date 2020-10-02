import React from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { changeRedeemStepAction, changeBTCAddressAction } from "../../actions/redeem.actions";
import { BTC_ADDRESS_TESTNET_REGEX } from "../../../constants";
import { StoreType } from "../../types/util.types";

type BTCaddressForm = {
    btcAddress: string;
}

export default function EnterBTCAddress() {
    const { register, handleSubmit, errors } = useForm<BTCaddressForm>();
    const polkaBTC = useSelector((state: StoreType) => state.api);
    const amountPolkaBTC = useSelector((state: StoreType)=> state.redeem.amountPolkaBTC)
    const dispatch = useDispatch();

    const onSubmit = handleSubmit(async ({btcAddress})=>{
        dispatch(changeBTCAddressAction(btcAddress));
        const amount = polkaBTC.api.createType("Balance",amountPolkaBTC);
        //await polkaBTC.redeem.request(amount,btcAddress); // TO DO Dom - this request takes forever 
        dispatch(changeRedeemStepAction("CONFIRMATION"));
    })

    const goToPreviousStep = () => {
        dispatch(changeRedeemStepAction("ENTER_POLKABTC"));
    }

    return <form onSubmit={onSubmit}>
    <Modal.Body>
        <p>Please enter your Bitcoin address</p>    
            <input
                name="btcAddress"
                type="string"
                className={"custom-input" + (errors.btcAddress ? " error-borders" : "")}
                ref={register({required: true, pattern: {
                    value: BTC_ADDRESS_TESTNET_REGEX, // TO DO Dom we are using testnet regex here
                    message: "Please enter valid BTC address"}})}
            />
            {errors.btcAddress && (<div className="input-error">
            {errors.btcAddress.type === "required" ? "Please enter the your btc address"
            : errors.btcAddress.message}
            </div>
        )}
    </Modal.Body>
    <Modal.Footer>
        <button className="btn btn-secondary float-left" onClick={goToPreviousStep}>
            Previous
        </button>
        <button className="btn btn-primary float-right" type="submit">
            Next
        </button>
    </Modal.Footer>
</form>
}