import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../types/util.types";
import { useForm } from "react-hook-form";
import { changeRedeemStepAction, changeAmountPolkaBTCAction } from "../../actions/redeem.actions";
import { KVStorageInterface } from "../../types/Storage";

interface EnterPolkaBTCAmountProps {
    handleChange?: (props: any) => void,
    kvstorage: KVStorageInterface;
}

type EnterPolkaBTCForm = {
    amountPolkaBTC: number;
};

export default function EnterPolkaBTCAmount(props: EnterPolkaBTCAmountProps) {
    const polkaBTC = useSelector((state: StoreType) => state.api);
    const amount = useSelector((state: StoreType) => state.redeem.amountPolkaBTC);
    const defaultValues = amount ? {defaultValues: {amountPolkaBTC: amount}} : undefined;
    const { register, handleSubmit, errors } = useForm<EnterPolkaBTCForm>(defaultValues);
    const balancePolkaBTC = props.kvstorage.getValue("balancePolkaBTC");
    const dispatch = useDispatch();

    useEffect(()=>{
        const fetchData = async () => {
            if(!polkaBTC) return;
            // const polkaBTCObject = polkaBTC.api.createType("Balance", amountPolkaBTC);
            // const vaultBTCAddress = await polkaBTC.vaults.selectRandomVault(polkaBTCObject);
        };
        fetchData();
    },[polkaBTC])
        

    const onSubmit = handleSubmit(async ({amountPolkaBTC})=>{
        dispatch(changeAmountPolkaBTCAction(amountPolkaBTC));
        // const amount = polkaBTC.api.createType("Balance",amountPolkaBTC);
        // await polkaBTC.vaults.selectRandomVaultRedeem(amount); // TO DO Dom - this request takes forever
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