import React, { ReactElement } from "react";

import { useDispatch, useSelector } from "react-redux";
import { ActiveTab, StoreType } from "../../common/types/util.types";
import { useTranslation } from "react-i18next";
import IssueSteps from "./issue/issue-steps";
import IssueRequests from "./issue/issue-requests";
import RedeemSteps from "./redeem/redeem-steps";
import RedeemRequests from "./redeem/redeem-requests";
import { setActiveTabAction } from "../../common/actions/general.actions";

import "./app.page.scss";


export default function AppPage(): ReactElement {
    const dispatch = useDispatch();
    const activeTab = useSelector((state: StoreType) => state.general.activeTab);
    const { t } = useTranslation();

    const changeTab = (tab: ActiveTab) => {
        console.log(">>>>>>>> here <<<<<<<<<",tab);
        dispatch(setActiveTabAction(tab));
    }

    return <section className="jumbotron text-center white-background min-vh-100 app-page">
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-xl-6 col-lg-6 col-md-8 col-sm-12 col-xs-12">
                    <div id="main-tabs" className="row app-tabs">
                        <div className={"col-6 app-tab" + (activeTab === ActiveTab.Issue ? " active-tab" : " not-active")}
                            onClick={() => changeTab(ActiveTab.Issue)}>
                            {t("issue")}
                        </div>
                        <div className={"col-6 app-tab" + (activeTab === ActiveTab.Redeem ? " active-tab" : " not-active")}
                            onClick={() => changeTab(ActiveTab.Redeem)}>
                            {t("redeem")}
                        </div>
                    </div>
                    <div className="content">
                        {activeTab === ActiveTab.Issue ? <IssueSteps/> : <RedeemSteps/>}
                    </div>
                </div>
            </div>
        </div>
        {activeTab === ActiveTab.Issue ? <IssueRequests /> : <RedeemRequests />}
    </section>;
}
