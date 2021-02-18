import React from "react";
import RequestConfirmation from "./request-confirmation";
import EnterBTCAmount from "./enter-btc-amount";
import BTCPayment from "./btc-payment";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";

export default function IssueSteps() {
    const step = useSelector((state: StoreType) => state.issue.step);

    return (
        <div className="issue-steps">
            {step === "ENTER_BTC_AMOUNT" && <EnterBTCAmount />}
            {step === "BTC_PAYMENT" && <BTCPayment />}
        </div>
    );
}
