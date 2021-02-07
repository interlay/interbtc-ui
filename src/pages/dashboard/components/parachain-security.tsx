import React, { useState, useEffect } from "react";
import ButtonComponent from "./button-component";
import { getAccents } from "../dashboardcolors";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
const ParachainSecurity = (): React.ReactElement => {
    const [textcolor, setTextcolor] = useState("d_grey");
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);

    useEffect(() => {
        const fetchOracleData = async () => {
            if (!polkaBtcLoaded) return;
            const parachainStatus = await window.polkaBTC.stakedRelayer.getCurrentStateOfBTCParachain();
            const parachainTextElement = document.getElementById("parachain-text") as HTMLElement;

            if (parachainStatus.isRunning) {
                parachainTextElement.innerHTML = "secure";
                setTextcolor("d_green");
            } else if (parachainStatus.isError) {
                parachainTextElement.innerHTML = "not secure";
                setTextcolor("d_red");
            } else {
                parachainTextElement.innerHTML = "unavailable";
                setTextcolor("d_grey");
            }
        };
        fetchOracleData();
    }, [textcolor, polkaBtcLoaded]);
    return (
        <div className="card">
            <div className="values-container"></div>
            {/* TODO: move this to the right */}

            <div className="parachain-content-container">
                <div>
                    <h1 className="h1-xl-text">
                        The BTC parachain is{" "}
                        <span
                            className="h1-xl-text"
                            style={{ color: `${getAccents(`${textcolor}`).color}` }}
                            id="parachain-text"
                        >
                            Loading
                        </span>
                    </h1>
                    <div className="button-container" style={{ marginTop: "20px" }}>
                        <ButtonComponent
                            buttonName="Status Updates"
                            propsButtonColor="d_green"
                            buttonId="parachain-security"
                            buttonLink="/dashboard/parachain"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParachainSecurity;
