import React, { useState, useEffect } from "react";
import ButtonComponent from "./buttoncomponent";
import { getAccents } from "../dashboardcolors";
const ParachainSecurity = (): React.ReactElement => {
    const [status, setStatus] = useState("online");
    const [textColour, setTextColour] = useState("d_grey");

    useEffect(() => {
        let parachainTextElement = document.getElementById("parachain-text") as HTMLElement;

        if (status === "online") {
            parachainTextElement.innerHTML = "completely secure";
            setTextColour("d_green");
        } else if (status === "offline") {
            parachainTextElement.innerHTML = "not secure";
            setTextColour("d_red");
        } else {
            parachainTextElement.innerHTML = "is unavailable";
            setTextColour("d_grey");
        }
    }, [status]);
    return (
        <div className="card">
            <div className="parachain-content-container">
                <div>
                    <h1 className="h1-xl-text">The BTC parachain is</h1>
                    <h1
                        className="h1-xl-text"
                        style={{ color: `${getAccents(`${textColour}`).colour}` }}
                        id="parachain-text"
                    >
                        Loading
                    </h1>
                </div>
                <div className="parachain-button-container">
                    <ButtonComponent buttonName="Status Updates" propsButtonColor="d_green" />
                </div>
            </div>
        </div>
    );
};

export default ParachainSecurity;
