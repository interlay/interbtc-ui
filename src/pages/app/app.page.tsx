import React, { ReactElement } from "react";

import { useDispatch, useSelector } from "react-redux";
import { ActiveTab, StoreType } from "../../common/types/util.types";
import { useTranslation } from "react-i18next";
import IssueSteps from "./issue/issue-steps";
import IssueRequests from "./issue/issue-requests";
import RedeemSteps from "./redeem/redeem-steps";
import RedeemRequests from "./redeem/redeem-requests";
import Transfer from "./transfer/transfer";
import { setActiveTabAction } from "../../common/actions/general.actions";
import { FaArrowLeft } from "react-icons/fa";
import "./app.page.scss";
import { changeIssueStepAction } from "../../common/actions/issue.actions";

export default function AppPage(): ReactElement {
    const dispatch = useDispatch();
    const { activeTab, balancePolkaBTC, balanceDOT } = useSelector((state: StoreType) => state.general);
    const issueStep = useSelector((state: StoreType) => state.issue.step);
    const { t } = useTranslation();

    const changeTab = (tab: ActiveTab) => {
        dispatch(setActiveTabAction(tab));
    };

    const hideTabs = () => {
        return issueStep !== "ENTER_BTC_AMOUNT" && activeTab === ActiveTab.Issue;
    };

    const goBack = () => {
        if (activeTab === ActiveTab.Issue) {
            if (issueStep === "REQUEST_CONFIRMATION") {
                dispatch(changeIssueStepAction("ENTER_BTC_AMOUNT"));
            }
            if (issueStep === "BTC_PAYMENT") {
                dispatch(changeIssueStepAction("REQUEST_CONFIRMATION"));
            }
        }
    };

    return (
        <section className="jumbotron text-center white-background min-vh-100 app-page">
            <div className="row balances-title">
                <div className="col">{t("balances")}</div>
            </div>
            <div className="row mt-2 justify-content-center">
                <div className="col-xl-3 btc-balance-wrapper">
                    <span className="heavy">{balancePolkaBTC || "0"}</span> PolkaBTC
                </div>
                <div className="col-xl-3 dot-balance-wrapper">
                    <span className="heavy">{balanceDOT || "0"}</span> DOT
                </div>
            </div>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-xl-6 col-lg-6 col-md-8 col-sm-12 col-xs-12 tab-content-wrapper">
                        {!hideTabs() ? (
                            <React.Fragment>
                                <div id="main-tabs" className="row app-tabs">
                                    <div className={"col-4 app-tab"} onClick={() => changeTab(ActiveTab.Issue)}>
                                        <div
                                            className={
                                                activeTab === ActiveTab.Issue
                                                    ? " active-tab active-tab-issue"
                                                    : " not-active"
                                            }
                                        >
                                            {t("issue")}
                                        </div>
                                    </div>
                                    <div className={"col-4 app-tab"} onClick={() => changeTab(ActiveTab.Redeem)}>
                                        <div
                                            className={
                                                activeTab === ActiveTab.Redeem
                                                    ? " active-tab active-tab-redeem"
                                                    : " not-active"
                                            }
                                        >
                                            {t("redeem")}
                                        </div>
                                    </div>
                                    <div className={"col-4 app-tab"} onClick={() => changeTab(ActiveTab.Transfer)}>
                                        <div
                                            className={activeTab === ActiveTab.Transfer ? " active-tab" : " not-active"}
                                        >
                                            {t("transfer")}
                                        </div>
                                    </div>
                                </div>
                                <div className="horizontal-line"></div>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <div className="step-back">
                                    <FaArrowLeft className="custom-icon-size" onClick={goBack}></FaArrowLeft>
                                </div>
                                <div className="step-title">
                                    {activeTab === ActiveTab.Issue ? t("issue_page.issuing_title") : ""}
                                </div>
                            </React.Fragment>
                        )}
                        <div className="content">
                            {activeTab === ActiveTab.Issue && <IssueSteps />}
                            {activeTab === ActiveTab.Redeem && <RedeemSteps />}
                            {activeTab === ActiveTab.Transfer && <Transfer />}
                        </div>
                    </div>
                </div>
            </div>
            {activeTab === ActiveTab.Issue && <IssueRequests />}
            {activeTab === ActiveTab.Redeem && <RedeemRequests />}
        </section>
    );
}
