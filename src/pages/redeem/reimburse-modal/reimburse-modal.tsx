import React, { useState, ReactElement, useEffect } from "react";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import ButtonMaybePending from "../../../common/components/pending-button";
import { useTranslation } from "react-i18next";
import { RedeemRequest } from "../../../common/types/redeem.types";
import { retryRedeemRequestAction, reimburseRedeemRequestAction } from "../../../common/actions/redeem.actions";
import Big from "big.js";


type ReimburseModalProps = {
    onClose: () => void;
    request: RedeemRequest | undefined;
    show: boolean;
};

export default function ReimburseModal(props: ReimburseModalProps): ReactElement {
    const [isReimbursePending, setReimbursePending] = useState(false);
    const [isRetryPending, setRetryPending] = useState(false);
    const { polkaBtcLoaded } = useSelector((state: StoreType) => state.general);
    const [punishmentDOT, setPunishmentDOT] = useState(new Big(0));
    const [rate, setRate] = useState(0);
    const [amountDOT, setAmountDOT] = useState(new Big(0));
    const dispatch = useDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded) return;
            try {
                const punishment = await window.polkaBTC.vaults.getPunishmentFee();
                const BtcDotRate = await window.polkaBTC.oracle.getExchangeRate();
                const amountPolkaBTC = props.request ? new Big(props.request.amountPolkaBTC) : new Big(0);
                setRate(BtcDotRate);
                setAmountDOT(amountPolkaBTC.mul(BtcDotRate));
                setPunishmentDOT(amountPolkaBTC.mul(BtcDotRate).mul(new Big(punishment)));
            } catch(error) {
                console.log(error);
            }
        }

        fetchData();
    },[props.request, polkaBtcLoaded])

    const onRetry = async () => {
        if (!polkaBtcLoaded) return;
        setRetryPending(true);
        try{
            if (!props.request) return;
            const redeemId = window.polkaBTC.api.createType("H256", "0x" + props.request.id);
            await window.polkaBTC.redeem.cancel(redeemId,false);
            dispatch(retryRedeemRequestAction(props.request.id));
            props.onClose();
            toast.success(t("redeem_page.successfully_cancelled_redeem"));
        }catch(error) {
            console.log(error);
            toast.error(t("redeem_page.error_cancelling_redeem"));
        }
        setRetryPending(false);
    }

    const onReimburse = async () => {
        if (!polkaBtcLoaded) return;
        setReimbursePending(true);
        try{
            if (!props.request) return;
            const redeemId = window.polkaBTC.api.createType("H256", "0x" + props.request.id);
            await window.polkaBTC.redeem.cancel(redeemId,true);
            dispatch(reimburseRedeemRequestAction(props.request.id));
            props.onClose();
        }catch(error) {
            console.log(error);
            toast.error(t("redeem_page.error_cancelling_redeem"));
        }
        setReimbursePending(false);
    };

    return (
        <Modal show={props.show} onHide={props.onClose} size={"xl"}>
            <Modal.Header closeButton>
                <Modal.Title>{t("redeem_page.redeem_request_failed")}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="reimburse-modal ml-2">
                <div className="row mt-3">
                    <div className="col-12">
                        <p>
                            <b>{t("redeem_page.funds_safe")}</b>
                        </p>
                        <p>
                            {t("redeem_page.not_send_on_time")}
                        </p>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-9">
                        <p><strong>{t("redeem_page.retry_again_and_get_compes",{amountDOT: punishmentDOT.toFixed(2)})}</strong></p>
                        <p>{t("redeem_page.you_will_receive_dot",{amountDOT: amountDOT.toFixed(2)})}</p>
                    </div>
                    <div className="col-3 text-center m-auto">
                        <ButtonMaybePending 
                            className={"retry-button"}
                            disabled={isRetryPending || isReimbursePending} 
                            isPending={isRetryPending} 
                            onClick={onRetry}>
                            {t("retry")}
                        </ButtonMaybePending>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-9">
                        <p>
                            <strong>
                                {t("redeem_page.reimburse_total",{total: amountDOT.add(punishmentDOT)})}
                            </strong>
                        </p>
                        <ul>
                            <li>
                                <p>
                                <b>{t("redeem_page.num_reimbursment",{amountDOT: amountDOT.toFixed(2)})}</b>
                                    {t("redeem_page.exchange_rate",{amountPolkaBTC: props.request ? props.request.amountPolkaBTC : 0, rate: rate.toFixed(8)})}
                                </p>
                            </li>
                            <li>
                                <p><b>{t("redeem_page.compensation",{punishment: punishmentDOT})}</b>{t("redeem_page.inconvenience")}</p>
                            </li>
                        </ul>
                        
                    </div>
                    <div className="col-3 text-center m-auto">
                        <ButtonMaybePending 
                            isPending={isReimbursePending} 
                            onClick={onReimburse}
                            disabled={isRetryPending || isReimbursePending}>
                            {t("redeem_page.reimburse")}
                        </ButtonMaybePending>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-12">
                        <p><b>{t("redeem_page.please_note")}</b></p>
                    </div>
                </div>
            </Modal.Body>
            <div className="container-fluid modal-footer-border">
                <div className="row min-height-5">
                    <div className="col-9">
                    </div>
                    <div className="col-3 text-center m-auto">
                        <Button variant="secondary" onClick={props.onClose}>
                            {t("redeem_page.decide_later")}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
