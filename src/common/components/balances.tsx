import React, { ReactElement } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

type BalancesProps = {
    balancePolkaBTC?: string;
    balanceDOT?: string;
};

export default function Balances(props: BalancesProps): ReactElement {
    const { t } = useTranslation();

    return (
        <div>
            <span className="btc-balance-wrapper">
                <span className="">
                    <b>{props.balancePolkaBTC || "0"}</b>
                </span>{" "}
                PolkaBTC
            </span>
            <span className="dot-balance-wrapper">
                <span className="">
                    <b>{props.balanceDOT || "0"}</b>
                </span>{" "}
                DOT
            </span>
        </div>
    );
}

/*
return (
    <div>
        <div className="row mt-2">
            <div className="col-lg-4 offset-lg-8">
                <div className="row justify-content-center balances-title">
                    {t("balances")}
                </div>
                <div className="row">
                    <div className="col-lg-6 btc-balance-wrapper">
                        <span className=""><b>{props.balancePolkaBTC || "0"}</b></span> PolkaBTC
                    </div>
                    <div className="col-lg-6 dot-balance-wrapper">
                        <span className=""><b>{props.balanceDOT || "0"}</b></span> DOT
                    </div>
                </div>
            </div>
            <div className="col-lg-4 offset-lg-8">{t("balances")}</div>
        </div>
        <div className="row justify-content-center">
            <div className="col-xl-3 btc-balance-wrapper">
                <span className=""><b>{props.balancePolkaBTC || "0"}</b></span> PolkaBTC
            </div>
            <div className="col-xl-3 dot-balance-wrapper">
                <span className=""><b>{props.balanceDOT || "0"}</b></span> DOT
            </div>
        </div>
    </div>
);
*/
