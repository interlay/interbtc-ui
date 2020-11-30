import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import ButtonMaybePending from "../../../common/components/pending-button";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { addReplaceRequestsAction } from "../../../common/actions/vault.actions";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { btcToSat, satToBTC } from "@interlay/polkabtc";
import { requestsToVaultReplaceRequests } from "../../../common/utils/utils";

type RequestReplacementForm = {
    amount: number;
};

type RequestReplacementProps = {
    onClose: () => void;
    show: boolean;
};

export default function RequestReplacementModal(props: RequestReplacementProps) {
    const { register, handleSubmit, errors } = useForm<RequestReplacementForm>();
    const dispatch = useDispatch();
    const lockedDot = useSelector((state: StoreType) => state.vault.collateral);
    const lockedBtc = useSelector((state: StoreType) => state.vault.lockedBTC);
    const [isRequestPending, setRequestPending] = useState(false);

    const onSubmit = handleSubmit(async ({ amount }) => {
        setRequestPending(true);
        try {
            const amountAsSatoshisString = btcToSat(amount.toString());
            if (amountAsSatoshisString === undefined) {
                throw new Error("Amount to convert is less than 1 satoshi.");
            }
            const dustValueAsSatoshi = await window.polkaBTC.redeem.getDustValue();
            const amountAsSatoshi = window.polkaBTC.api.createType("Balance", amountAsSatoshisString);
            if (amountAsSatoshi.lte(dustValueAsSatoshi)) {
                const dustValue = satToBTC(dustValueAsSatoshi.toString());
                throw new Error(`Please enter an amount greater than Bitcoin dust (${dustValue} BTC)`);
            }
            await window.vaultClient.requestReplace(amountAsSatoshisString, "100");

            const accountId = await window.vaultClient.getAccountId();
            const vaultId = window.polkaBTC.api.createType("AccountId", accountId);
            const requests = await window.polkaBTC.vaults.mapReplaceRequests(vaultId);
            if (!requests) return;

            dispatch(addReplaceRequestsAction(requestsToVaultReplaceRequests(requests)));
            toast.success("Replacment request is submitted");
            props.onClose();
        } catch (error) {
            toast.error(error.toString());
        }
        setRequestPending(false);
    });

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <form onSubmit={onSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Request Replacement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-12 request-header">
                            You are requesting that your vault is replaced by other vaults in the system. If this is
                            successful, you can withdraw your collateral.
                        </div>
                        <div className="col-12">Your currently have:</div>
                        <div className="col-12">Locked: {lockedDot} DOT</div>
                        <div className="col-12 vault-empty-space">Locked: {lockedBtc} BTC</div>
                        <div className="col-12 vault-empty-space">Replace amount</div>
                        <div className="col-12">
                            <div className="input-group">
                                <input
                                    name="amount"
                                    type="float"
                                    className={"form-control custom-input" + (errors.amount ? " error-borders" : "")}
                                    aria-describedby="basic-addon2"
                                    ref={register({
                                        required: true,
                                    })}
                                ></input>
                                <div className="input-group-append">
                                    <span className="input-group-text" id="basic-addon2">
                                        PolkaBTC
                                    </span>
                                </div>
                                {errors.amount && (
                                    <div className="input-error">
                                        {errors.amount.type === "required"
                                            ? "Amount is required"
                                            : errors.amount.message}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onClose}>
                        Cancel
                    </Button>
                    <ButtonMaybePending variant="outline-danger" type="submit" isPending={isRequestPending}>
                        Request
                    </ButtonMaybePending>
                </Modal.Footer>
            </form>
        </Modal>
    );
}
