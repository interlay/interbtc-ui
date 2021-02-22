import React from "react";
import { FormGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { useTranslation } from "react-i18next";
import BitcoinLogo from "../../../assets/img/small-bitcoin-logo.png";
import { changeRedeemStepAction, resetRedeemWizardAction } from "../../../common/actions/redeem.actions";

export default function RedeemInfo() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const address = useSelector((state: StoreType) => state.general.address);
    const { id, vaultDotAddress } = useSelector((state: StoreType) => state.redeem);
    const requests = useSelector((state: StoreType) => state.redeem.redeemRequests).get(address);
    let request;
    if (requests) request = requests.filter((request) => request.id === id)[0];

    const onClose = () => {
        dispatch(resetRedeemWizardAction());
        dispatch(changeRedeemStepAction("AMOUNT_AND_ADDRESS"));
    };

    return (
        <React.Fragment>
            <FormGroup>
                <div className="wizard-redeem-title">{t("redeem_page.redeem_processed")}</div>
                <div className="row">
                    <div className="col-12">
                        <div className="wizard-item  mt-5">
                            <div className="row">
                                <div className="col-6 text-left">{t("redeem_page.will_receive_BTC")}</div>
                                <div className="col-6">
                                    <img src={BitcoinLogo} width="23px" height="23px" alt="bitcoin logo"></img>
                                    {request && request.amountPolkaBTC} BTC
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col m-3">{t("redeem_page.from_vault")}</div>
                </div>
                <div className="row ">
                    <div className="col payment-address">
                        <span>{vaultDotAddress}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col inform-you">{t("redeem_page.we_will_inform_you_btc")}</div>
                </div>
                <div className="row">
                    <div className="col">{t("redeem_page.typically_takes")}</div>
                </div>
            </FormGroup>
            <button className="btn btn-primary app-btn" onClick={onClose}>
                {t("close")}
            </button>
        </React.Fragment>
    );
}
