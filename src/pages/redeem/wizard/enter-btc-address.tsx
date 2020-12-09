import React from "react";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { changeRedeemStepAction, changeBTCAddressAction } from "../../../common/actions/redeem.actions";
import { BTC_ADDRESS_REGEX } from "../../../constants";
import { useTranslation } from 'react-i18next';


type BTCaddressForm = {
    btcAddress: string;
};

export default function EnterBTCAddress() {
    const { t } = useTranslation();
    const { register, handleSubmit, errors } = useForm<BTCaddressForm>();
    const dispatch = useDispatch();

    const onSubmit = handleSubmit(async ({ btcAddress }) => {
        dispatch(changeBTCAddressAction(btcAddress));
        dispatch(changeRedeemStepAction("CONFIRMATION"));
    });

    const goToPreviousStep = () => {
        dispatch(changeRedeemStepAction("ENTER_POLKABTC"));
    };

    return (
        <form onSubmit={onSubmit}>
            <Modal.Body>
                <p>{t("redeem_page.enter_btc_address")}</p>
                <input
                    name="btcAddress"
                    type="string"
                    className={"custom-input" + (errors.btcAddress ? " error-borders" : "")}
                    ref={register({
                        required: true,
                        pattern: {
                            // FIXME: regex need to depend on global mainnet | testnet parameter
                            value: BTC_ADDRESS_REGEX,
                            message: t("redeem_page.valid_btc_address"),
                        },
                    })}
                />
                {errors.btcAddress && (
                    <div className="input-error">
                        {errors.btcAddress.type === "required"
                            ? t("redeem_page.enter_btc")
                            : errors.btcAddress.message}
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary float-left" onClick={goToPreviousStep}>
                    {t("previous")}
                </button>
                <button className="btn btn-primary float-right" type="submit">
                    {t("next")}
                </button>
            </Modal.Footer>
        </form>
    );
}
