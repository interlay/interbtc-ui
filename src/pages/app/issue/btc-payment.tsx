import React from "react";
import { FormGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { resetIssueWizardAction, changeIssueStepAction } from "../../../common/actions/issue.actions";
import { useTranslation } from "react-i18next";
import PaymentView from "./modal/payment-view";

export default function BTCPayment() {
    const { address } = useSelector((state: StoreType) => state.general);
    const { id } = useSelector((state: StoreType) => state.issue);
    const requests = useSelector((state: StoreType) => state.issue.issueRequests).get(address) || [];
    const request = requests.filter((req) => req.id === id)[0];
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const submit = () => {
        dispatch(changeIssueStepAction("ENTER_BTC_AMOUNT"));
        dispatch(resetIssueWizardAction());
    };

    return (
        <React.Fragment>
            <FormGroup>{request && <PaymentView request={request}></PaymentView>}</FormGroup>
            <button className="btn btn-primary app-btn" onClick={submit}>
                {t("issue_page.made_payment")}
            </button>
        </React.Fragment>
    );
}
