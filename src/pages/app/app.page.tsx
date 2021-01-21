import React, { ReactElement } from "react";

import { useDispatch, useSelector } from "react-redux";
import { ActiveTab, StoreType } from "../../common/types/util.types";
import { useTranslation } from "react-i18next";
import IssueSteps from "./issue/issue-steps";
import IssueRequests from "./issue/issue-requests";
import RedeemSteps from "./redeem/redeem-steps";
import RedeemRequests from "./redeem/redeem-requests";
import { setActiveTabAction } from "../../common/actions/general.actions";
import { FaArrowLeft } from "react-icons/fa";
import "./app.page.scss";
import { changeIssueStepAction } from "../../common/actions/issue.actions";
import { changeRedeemStepAction } from "../../common/actions/redeem.actions";


export default function AppPage(): ReactElement {
    const dispatch = useDispatch();
    const activeTab = useSelector((state: StoreType) => state.general.activeTab);
    const issueStep = useSelector((state: StoreType) => state.issue.step);
    const redeemStep = useSelector((state: StoreType) => state.redeem.step);
    const { t } = useTranslation();

    const changeTab = (tab: ActiveTab) => {
        dispatch(setActiveTabAction(tab));
    }

    const showTabs = () => {
        return (issueStep === "ENTER_BTC_AMOUNT" && activeTab === ActiveTab.Issue) || 
            (redeemStep === "ENTER_POLKABTC" && activeTab === ActiveTab.Redeem);
    }

    const goBack = () => {
        if (activeTab === ActiveTab.Issue) {
            if (issueStep === "REQUEST_CONFIRMATION") {
                dispatch(changeIssueStepAction("ENTER_BTC_AMOUNT"));
            }
            if (issueStep === "BTC_PAYMENT") {
                dispatch(changeIssueStepAction("REQUEST_CONFIRMATION"));
            }
        } else {
            if (redeemStep === "ENTER_BTC_ADDRESS") {
                dispatch(changeRedeemStepAction("ENTER_POLKABTC"))
            }
            if (redeemStep === "CONFIRMATION") {
                dispatch(changeRedeemStepAction("ENTER_BTC_ADDRESS"))
            }
            if (redeemStep === "VAULT_INFO") {
                dispatch(changeRedeemStepAction("CONFIRMATION"))
            }
        }
    }

    return <section className="jumbotron text-center white-background min-vh-100 app-page">
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-xl-6 col-lg-6 col-md-8 col-sm-12 col-xs-12 tab-content-wrapper">
                    {showTabs() ? 
                    <div id="main-tabs" className="row app-tabs">
                        <div className={"col-6 app-tab" + (activeTab === ActiveTab.Issue ? " active-tab" : " not-active")}
                            onClick={() => changeTab(ActiveTab.Issue)}>
                            {t("issue")}
                        </div>
                        <div className={"col-6 app-tab" + (activeTab === ActiveTab.Redeem ? " active-tab" : " not-active")}
                            onClick={() => changeTab(ActiveTab.Redeem)}>
                            {t("redeem")}
                        </div>
                    </div> :
                    <React.Fragment>
                        <div className="step-back">
                            <FaArrowLeft className="custom-icon-size" onClick={goBack}></FaArrowLeft>
                        </div>
                        <div className="step-title">
                            {activeTab === ActiveTab.Issue ? t("issue_page.issuing_title") : ""}
                        </div>
                    </React.Fragment>
                    }
                    <div className="content">
                        {activeTab === ActiveTab.Issue ? <IssueSteps/> : <RedeemSteps/>}
                    </div>
                </div>
            </div>
        </div>
        {activeTab === ActiveTab.Issue ? <IssueRequests /> : <RedeemRequests />}
    </section>;
}
