import React, { useState, ReactElement, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { toast } from "react-toastify";
import ButtonMaybePending from "../../../common/components/pending-button";
import { useTranslation } from "react-i18next";
import { RedeemRequest } from "../../../common/types/redeem.types";
import { PRICE_BASE_URL, PRICE_PARAMS, PRICE_API_KEY } from "../../../constants";


type ReimburseModalProps = {
    onClose: () => void;
    request: RedeemRequest | undefined;
    show: boolean;
};

export default function ReimburseModal(props: ReimburseModalProps): ReactElement {
    const [isRegisterPending, setReimbursePending] = useState(false);
    const { polkaBtcLoaded } = useSelector((state: StoreType) => state.general);
    const [punishmentFee, setPunishmentFee] = useState(0);
    const [rate, setRate] = useState(0);
    const [amountDOT, setAmountDOT] = useState(0);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = () => {
            //FILIP const punishment = window.polkaBTC.redeem.fetchPunishmentFee();
            setPunishmentFee(10);
            fetch(PRICE_BASE_URL + PRICE_PARAMS + PRICE_API_KEY)
                .then(response => response.json())
                .then(result => {
                    const amount = props.request ? Number(props.request.amountPolkaBTC) : 0;
                    setAmountDOT(result.BTC.DOT*amount);
                    setRate(1/result.BTC.DOT);
            });
        }

        fetchData();
    })

    const onReimburse = async () => {
        if (!polkaBtcLoaded) return;
        setReimbursePending(true);
        try{
            if (!props.request) return;
            const redeemId = window.polkaBTC.api.createType("H256", props.request.id);
            await window.polkaBTC.redeem.cancel(redeemId,true);
        }catch(error) {
            console.log(error);
        }
        setReimbursePending(false);
    };

    return (
        <Modal show={props.show} onHide={props.onClose} size={"lg"}>
            <Modal.Header closeButton>
                <Modal.Title>{t("redeem_page.reimburse")}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="reimburse-modal">
                <div className="row mb-2">
                    <div className="col-12">
                        <p>
                            {t("redeem_page.request_to_reimburse", {
                                btc: props.request ? props.request.amountPolkaBTC : 0
                            })}
                        </p>
                        <p>
                            {t("redeem_page.you_will_receive", {
                                dots: amountDOT.toString(), 
                            })}
                        </p>
                        <p>
                            {t("redeem_page.financial_value", {
                                btc: props.request ? props.request.amountPolkaBTC : 0,
                                rate: rate.toFixed(8),
                                punishment: punishmentFee
                            })}
                        </p>
                        <p>
                            {t("redeem_page.please_note")}
                        </p>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onClose}>
                    {t("cancel")}
                </Button>
                <ButtonMaybePending type="submit" isPending={isRegisterPending} onClick={onReimburse}>
                    {t("redeem_page.reimburse")}
                </ButtonMaybePending>
            </Modal.Footer>
        </Modal>
    );
}
