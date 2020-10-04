import React from "react";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { changeRedeemStepAction, changeBTCAddressAction } from "../../../common/actions/redeem.actions";
import { BTC_ADDRESS_TESTNET_REGEX } from "../../../constants";

type BTCaddressForm = {
    btcAddress: string;
}

export default function EnterBTCAddress() {
    const { register, handleSubmit, errors } = useForm<BTCaddressForm>();
    const dispatch = useDispatch();

    const onSubmit = handleSubmit(async ({btcAddress})=>{
        dispatch(changeBTCAddressAction(btcAddress));
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
                    // FIXME: regex need to depend on global mainnet | testnet parameter
                    value: BTC_ADDRESS_TESTNET_REGEX, 
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