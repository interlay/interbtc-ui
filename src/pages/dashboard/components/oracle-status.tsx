import React, { useState, useEffect, ReactElement } from "react";
import ButtonComponent from "./button-component";
import { getAccents } from "../dashboardcolors";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";

const OracleStatus = (): ReactElement => {
    const [textcolor, setTextcolor] = useState("d_grey");
    const [exchangeRate, setExchangeRate] = useState("0");
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);

    useEffect(() => {
        const fetchOracleData = async () => {
            if (!polkaBtcLoaded) return;
            const oracle = await window.polkaBTC.oracle.getInfo();
            setExchangeRate(oracle.exchangeRate.toFixed(2));
            const oracleTextElement = document.getElementById("oracle-text") as HTMLElement;
            const oracleCircleTextElement = document.getElementById("oracle-circle-text") as HTMLElement;

            if (oracle) {
                oracleTextElement.innerHTML = " online";
                oracleCircleTextElement.innerHTML = "Online";
                setTextcolor("d_green");
            } else {
                oracleTextElement.innerHTML = " offline";
                oracleCircleTextElement.innerHTML = "Offline";
                setTextcolor("d_red");
            }
        };
        fetchOracleData();
    }, [textcolor, polkaBtcLoaded]);

    return (
        <div className="card">
            <div className="card-top-content">
                <div className="values-container">
                    <h1 style={{ fontFamily: "airbnb-cereal-bold" }}>
                        Oracles are
                        <span
                            style={{ color: `${getAccents(`${textcolor}`).color}`, fontFamily: "airbnb-cereal-bold" }}
                            id="oracle-text"
                        >
                            Loading
                        </span>
                    </h1>
                </div>
                <div className="button-container">
                    <ButtonComponent
                        buttonName="view oracles"
                        propsButtonColor="d_green"
                        buttonId="oracle-status"
                        buttonLink="/dashboard/oracles"
                    />
                </div>
            </div>
            <div className="circle-container">
                <div
                    className="status-circle"
                    style={{ borderColor: `${getAccents(`${textcolor}`).color}` }}
                    id="oracle-circle"
                >
                    <h1
                        className="h1-xl-text"
                        style={{ color: `${getAccents(`${textcolor}`).color}` }}
                        id="oracle-circle-text"
                    >
                        Loading
                    </h1>
                    <h2>{exchangeRate} DOT/BTC</h2>
                </div>
            </div>
        </div>
    );
};

export default OracleStatus;
