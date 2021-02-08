import React, { useState, useEffect, ReactElement } from "react";
import ButtonComponent from "./button-component";
import { getAccents } from "../dashboardcolors";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";

type OracleStatusProps = {
    linkButton?: boolean;
};

const OracleStatus = ({ linkButton }: OracleStatusProps): ReactElement => {
    const [oracleStatus, setOracleStatus] = useState("Loading");
    const [exchangeRate, setExchangeRate] = useState("0");
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);

    useEffect(() => {
        const fetchOracleData = async () => {
            if (!polkaBtcLoaded) return;
            const oracle = await window.polkaBTC.oracle.getInfo();
            setExchangeRate(oracle.exchangeRate.toFixed(2));

            if (oracle) {
                setOracleStatus("Online");
            } else {
                setOracleStatus("Offline");
            }
        };
        fetchOracleData();
    }, [polkaBtcLoaded]);

    return (
        <div className="card">
            <div className="card-top-content">
                <div className="values-container">
                    <h1 className="bold-font">
                        Oracles are &nbsp;
                        {oracleStatus === "Online" ? (
                            <span style={{ color: getAccents("d_green").color }} id="oracle-text" className="bold-font">
                                Online
                            </span>
                        ) : oracleStatus === "Offline" ? (
                            <span style={{ color: getAccents("d_red").color }} id="oracle-text" className="bold-font">
                                Offline
                            </span>
                        ) : (
                            <span style={{ color: getAccents("d_grey").color }} id="oracle-text" className="bold-font">
                                Loading
                            </span>
                        )}
                    </h1>
                </div>
                {linkButton ? (
                    <div className="button-container">
                        <ButtonComponent
                            buttonName="view oracles"
                            propsButtonColor="d_green"
                            buttonId="oracle-status"
                            buttonLink="/dashboard/oracles"
                        />
                    </div>
                ) : (
                    ""
                )}
            </div>
            <div className="circle-container">
                {oracleStatus === "Online" ? (
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
                            {oracleStatus}
                        </h1>
                        <h2>{exchangeRate} DOT/BTC</h2>
                    </div>
                ) : oracleStatus === "Offline" ? (
                    <div
                        className="status-circle"
                        style={{ borderColor: getAccents("d_red").color }}
                        id="oracle-circle"
                    >
                        <h1 className="h1-xl-text" style={{ color: getAccents("d_red").color }} id="oracle-circle-text">
                            {oracleStatus}
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
                            {oracleStatus}
                        </h1>
                        <h2>{exchangeRate} DOT/BTC</h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OracleStatus;
