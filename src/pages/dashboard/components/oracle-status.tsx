import React, { useState, useEffect } from "react";
import ButtonComponent from "./button-component";
import { getAccents } from "../dashboard-colors";

const OracleStatus = () => {
    const [status, setStatus] = useState("online");
    const [textColour, setTextColour] = useState("d_grey");

    useEffect(() => {
        let oracleTextElement = document.getElementById("oracle-text") as HTMLElement;
        let oracleCircleTextElement = document.getElementById("oracle-circle-text") as HTMLElement;

        if (status === "online") {
            oracleTextElement.innerHTML = " Online";
            oracleCircleTextElement.innerHTML = "Online";
            setTextColour("d_green");
        } else if (status === "offline") {
            oracleTextElement.innerHTML = " Offline";
            oracleCircleTextElement.innerHTML = "Offline";
            setTextColour("d_red");
        } else {
            oracleTextElement.innerHTML = " Unavailable";
            oracleCircleTextElement.innerHTML = "Unavailable";
            setTextColour("d_grey");
        }
    }, [status]);
    return (
        <div className="card">
            <div className="card-top-content">
                <div className="values-container">
                    <h1 style={{ fontFamily: "airbnb-cereal-bold" }}>
                        Oracles are
                        <span
                            style={{ color: `${getAccents(`${textColour}`).colour}`, fontFamily: "airbnb-cereal-bold" }}
                            id="oracle-text"
                        >
                            Loading
                        </span>
                    </h1>
                </div>
                <div className="button-container">
                    <ButtonComponent buttonName="view oracles" propsButtonColor="d_green" />
                </div>
            </div>
            <div className="circle-container">
                <div
                    className="status-circle"
                    style={{ borderColor: `${getAccents(`${textColour}`).colour}` }}
                    id="oracle-circle"
                >
                    <h1
                        className="h1-xl-text"
                        style={{ color: `${getAccents(`${textColour}`).colour}` }}
                        id="oracle-circle-text"
                    >
                        Loading
                    </h1>
                    <h2>32,000 DOT/BTC</h2>
                </div>
            </div>
        </div>
    );
};

export default OracleStatus;
