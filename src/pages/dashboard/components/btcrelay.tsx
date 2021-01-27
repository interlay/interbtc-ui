import React, { useState, useEffect } from "react";
import ButtonComponent from "./buttoncomponent";
import { getAccents } from "../dashboardcolors";

const BtcRelay = () => {
    const [status, setStatus] = useState("online");
    const [textColour, setTextColour] = useState("d_grey");

    useEffect(() => {
        let relayTextElement = document.getElementById("relay-text") as HTMLElement;
        let relayCircleTextElement = document.getElementById("relay-circle-text") as HTMLElement;

        if (status === "online") {
            relayTextElement.innerHTML = " Online";
            relayCircleTextElement.innerHTML = "Online";
            setTextColour("d_green");
        } else if (status === "offline") {
            relayTextElement.innerHTML = " Offline";
            relayCircleTextElement.innerHTML = "Offline";
            setTextColour("d_red");
        } else {
            relayTextElement.innerHTML = " Unavailable";
            relayCircleTextElement.innerHTML = "Unavailable";
            setTextColour("d_grey");
        }
    }, [status]);
    return (
        <div className="card">
            <div className="card-top-content">
                <div className="values-container">
                    <h1 style={{ fontFamily: "airbnb-cereal-bold" }}>
                        BTC Relay is
                        <span
                            style={{ color: `${getAccents(`${textColour}`).colour}`, fontFamily: "airbnb-cereal-bold" }}
                            id="relay-text"
                        >
                            Loading
                        </span>
                    </h1>
                </div>
                <div className="button-container">
                    <ButtonComponent buttonName="view BTC Relay" propsButtonColor="d_green" />
                </div>
            </div>
            <div className="circle-container">
                <div
                    className="status-circle"
                    style={{ borderColor: `${getAccents(`${textColour}`).colour}` }}
                    id="relay-circle"
                >
                    <h1
                        className="h1-xl-text"
                        style={{ color: `${getAccents(`${textColour}`).colour}` }}
                        id="relay-circle-text"
                    >
                        Loading
                    </h1>
                    <p className="latest-block-text">Block</p>
                </div>
            </div>
        </div>
    );
};

export default BtcRelay;
