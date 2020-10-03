import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../types/util.types";
import { useForm } from "react-hook-form";
import { changeRedeemStepAction, changeAmountPolkaBTCAction } from "../../actions/redeem.actions";

interface EnterPolkaBTCAmountProps {
    handleChange?: (props: any) => void,
}

type EnterPolkaBTCForm = {
    amountPolkaBTC: number;
};

export default function EnterPolkaBTCAmount(props: EnterPolkaBTCAmountProps) {
    const polkaBTC = useSelector((state: StoreType) => state.api);
    const amount = useSelector((state: StoreType) => state.redeem.amountPolkaBTC);
    const defaultValues = amount ? {defaultValues: {amountPolkaBTC: amount}} : undefined;
    const { register, handleSubmit, errors } = useForm<EnterPolkaBTCForm>(defaultValues);
    // TODO: get from storage
    const balancePolkaBTC = "12";
    const dispatch = useDispatch();

    useEffect(()=>{
        const fetchData = async () => {
            if(!polkaBTC) return;
        };
        fetchData();
    },[polkaBTC])
        

    const onSubmit = handleSubmit(async ({amountPolkaBTC})=>{
        dispatch(changeAmountPolkaBTCAction(amountPolkaBTC));
        const amount = polkaBTC.api.createType("Balance",amountPolkaBTC);
        // const vaultId = await polkaBTC.vaults.selectRandomVaultRedeem(amount); // TO DO Dom - this request takes forever
        // const vault = await polkaBTC.vaults.get(vaultId);
        dispatch(changeRedeemStepAction("ENTER_BTC_ADDRESS"));
    })

    return <form onSubmit={onSubmit}>
        <Modal.Body>
                <p>Please enter the amount of BTC you want to receive in PolkaBTC.</p>
                <p>You have {balancePolkaBTC} PolkaBTC</p>
                <input
                    name="amountPolkaBTC"
                    type="number"
                    className={"custom-input" + (errors.amountPolkaBTC ? " error-borders" : "")}
                    ref={register({required: true, max: {
                        value: balancePolkaBTC,
                        message: "Please enter amount less then " + balancePolkaBTC
                    }})}
                />
            {errors.amountPolkaBTC && (<div className="input-error">
                {errors.amountPolkaBTC.type === "required" ? "Please enter the amount"
                : errors.amountPolkaBTC.message}
                </div>
            )}
        </Modal.Body>
        <Modal.Footer>
            <button className="btn btn-primary float-right" type="submit">
                Next
            </button>
        </Modal.Footer>
    </form>
}