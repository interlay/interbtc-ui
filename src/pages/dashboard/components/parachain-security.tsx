import React, { useState, useEffect } from "react";
import ButtonComponent from "./button-component";
import { getAccents } from "../dashboardcolors";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";

type ParachainSecurityProps = {
    linkButton?: boolean;
};

const ParachainSecurity = ({ linkButton }: ParachainSecurityProps): React.ReactElement => {
    const [parachainStatus, setParachainStatus] = useState("Loading");
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);

    useEffect(() => {
        const fetchOracleData = async () => {
            if (!polkaBtcLoaded) return;
            const parachainStatus = await window.polkaBTC.stakedRelayer.getCurrentStateOfBTCParachain();

            if (parachainStatus.isRunning) {
                setParachainStatus("secure");
            } else if (parachainStatus.isError) {
                setParachainStatus("not secure");
            } else {
                setParachainStatus("unavailable");
            }
        };
        fetchOracleData();
    }, [polkaBtcLoaded]);
    return (
        <div className="card">
            <div className="values-container"></div>
            {/* TODO: move this to the right */}
            <div className="parachain-content-container">
                <div>
                    <h1 className="h1-xl-text">
                        The BTC parachain is &nbsp;
                        {parachainStatus === "secure" ? (
                            <span
                                style={{ color: getAccents("d_green").color }}
                                id="parachain-text"
                                className="bold-font"
                            >
                                secure
                            </span>
                        ) : parachainStatus === "not secure" ? (
                            <span
                                style={{ color: getAccents("d_red").color }}
                                id="parachain-text"
                                className="bold-font"
                            >
                                not secure
                            </span>
                        ) : (
                            <span
                                style={{ color: getAccents("d_grey").color }}
                                id="parachain-text"
                                className="bold-font"
                            >
                                Loading
                            </span>
                        )}
                    </h1>
                    {linkButton ? (
                        <div className="button-container" style={{ marginTop: "20px" }}>
                            <ButtonComponent
                                buttonName="Status Updates"
                                propsButtonColor="d_green"
                                buttonId="parachain-security"
                                buttonLink="/dashboard/parachain"
                            />
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParachainSecurity;
