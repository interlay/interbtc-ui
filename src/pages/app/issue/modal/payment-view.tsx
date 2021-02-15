import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IssueRequest } from "../../../../common/types/issue.types";
import { useSelector } from "react-redux";
import { StoreType } from "../../../../common/types/util.types";
import { BLOCK_TIME } from "../../../../constants";
import QRCode from "qrcode.react";
import Big from "big.js";
import Timer from "../../../../common/components/timer";

type PaymentViewProps = {
    request: IssueRequest;
};

export default function PaymentView(props: PaymentViewProps): ReactElement {
    const { t } = useTranslation();
    const { polkaBtcLoaded } = useSelector((state: StoreType) => state.general);
    const amount = new Big(props.request.amountBTC).add(new Big(props.request.fee)).toString();
    const [leftSeconds, setLeftSeconds] = useState(-1);

    useEffect(() => {
        if (!polkaBtcLoaded) return;

        const fetchData = async () => {
            try {
                const issuePeriod = await window.polkaBTC.issue.getIssuePeriod();
                const parachainBlockNumber = await window.polkaBTC.api.query.system.number();

                const blocks = new Big(parachainBlockNumber.toString()).sub(new Big(props.request.creation));
                const leftInBlocks = new Big(issuePeriod.toString()).sub(new Big(blocks));
                const timeLeft = leftInBlocks.mul(new Big(BLOCK_TIME));
                const timeLeftNumber = Number(timeLeft.toString()) > 0 ? Number(timeLeft.toString()) : 0;
                setLeftSeconds(timeLeftNumber);
            } catch (e) {
                console.log(e);
            }
        };

        fetchData();
    }, [polkaBtcLoaded, props.request.creation]);

    return (
        <div className="payment-view">
            <div className="payment-title">
                <div className="row">
                    <div className="col">
                        {t("deposit")} &nbsp; {props.request.totalAmount} &nbsp; BTC
                    </div>
                </div>
                <div className="row">
                    <div className="col payment-description">{t("issue_page.single_transaction")}</div>
                </div>
                <div className="row ">
                    <div className="col payment-address">
                        <span>{props.request.vaultBTCAddress}</span>
                    </div>
                </div>
                <div className="row payment-timer-with">
                    <div className="col">{t("issue_page.within")}</div>
                </div>
                <div className="row payment-timer">
                    <div className="col">{leftSeconds !== -1 && <Timer seconds={leftSeconds}></Timer>}</div>
                </div>
                <div className="row">
                    <div className="col qr-code-item">
                        <QRCode value={"bitcoin:" + props.request.vaultBTCAddress + "?amount=" + amount} />
                    </div>
                </div>
            </div>
        </div>
    );
}
