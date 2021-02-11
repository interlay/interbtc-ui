import React, { useState, useEffect, ReactElement } from "react";
import ButtonComponent from "./button-component";
import { getAccents } from "../dashboardcolors";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { useTranslation } from "react-i18next";

enum Status {
    Loading,
    Online,
    Offline,
    NoData,
}

type OracleStatusProps = {
    linkButton?: boolean;
};

const OracleStatus = ({ linkButton }: OracleStatusProps): ReactElement => {
    const { t } = useTranslation();
    //TODO: use translations for status
    const [oracleStatus, setOracleStatus] = useState(Status.Loading);
    const [exchangeRate, setExchangeRate] = useState("0");
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);

    useEffect(() => {
        const fetchOracleData = async () => {
            if (!polkaBtcLoaded) return;
            try {
                const oracle = await window.polkaBTC.oracle.getInfo();
                setExchangeRate(oracle.exchangeRate.toFixed(2));

                if (oracle) {
                    setOracleStatus(Status.Online);
                } else {
                    setOracleStatus(Status.Offline);
                }
            } catch (e) {
                console.log(e);
                setOracleStatus(Status.NoData);
            }
        };
        fetchOracleData();
    }, [polkaBtcLoaded]);

    return (
        <div className="card">
            <div className="card-top-content">
                <div className="values-container">
                    <h1 className="bold-font">
                        {t("dashboard.oracles.oracles_are")}&nbsp;
                        {oracleStatus === Status.Online ? (
                            <span style={{ color: getAccents("d_green").color }} id="oracle-text" className="bold-font">
                                {t("dashboard.oracles.online")}
                            </span>
                        ) : oracleStatus === Status.Offline ? (
                            <span style={{ color: getAccents("d_red").color }} id="oracle-text" className="bold-font">
                                {t("dashboard.oracles.offline")}
                            </span>
                        ) : (
                            <span style={{ color: getAccents("d_grey").color }} id="oracle-text" className="bold-font">
                                {t("dashboard.oracles.loading")}
                            </span>
                        )}
                    </h1>
                </div>
                {linkButton && (
                    <div className="button-container">
                        <ButtonComponent
                            buttonName="view oracles"
                            propsButtonColor="d_green"
                            buttonId="oracle-status"
                            buttonLink="/dashboard/oracles"
                        />
                    </div>
                )}
            </div>
            <div className="circle-container">
                {oracleStatus === Status.Online ? (
                    <div
                        className="status-circle"
                        style={{ borderColor: getAccents("d_green").color }}
                        id="oracle-circle"
                    >
                        <h1
                            className="h1-xl-text"
                            style={{ color: getAccents("d_green").color }}
                            id="oracle-circle-text"
                        >
                            {t("online")}
                        </h1>
                        <h2>{exchangeRate} DOT/BTC</h2>
                    </div>
                ) : oracleStatus === Status.Offline ? (
                    <div
                        className="status-circle"
                        style={{ borderColor: getAccents("d_red").color }}
                        id="oracle-circle"
                    >
                        <h1 className="h1-xl-text" style={{ color: getAccents("d_red").color }} id="oracle-circle-text">
                            {t("offline")}
                        </h1>
                        <h2>{exchangeRate} DOT/BTC</h2>
                    </div>
                ) : oracleStatus === Status.NoData ? (
                    <div
                        className="status-circle"
                        style={{ borderColor: getAccents("d_grey").color }}
                        id="oracle-circle"
                    >
                        <h1
                            className="h1-xl-text"
                            style={{ color: getAccents("d_grey").color }}
                            id="oracle-circle-text"
                        >
                            {t("no_data")}
                        </h1>
                        <h2>{exchangeRate} DOT/BTC</h2>
                    </div>
                ) : (
                    <div
                        className="status-circle"
                        style={{ borderColor: getAccents("d_grey").color }}
                        id="oracle-circle"
                    >
                        <h1
                            className="h1-xl-text"
                            style={{ color: getAccents("d_grey").color }}
                            id="oracle-circle-text"
                        >
                            {t("loading")}
                        </h1>
                        <h2>{exchangeRate} DOT/BTC</h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OracleStatus;
