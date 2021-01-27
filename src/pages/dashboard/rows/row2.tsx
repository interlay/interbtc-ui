import React from "react";
import ParachainSecurity from "../components/parachainsecurity";
import BtcRelay from "../components/btcrelay";
import OracleStatus from "../components/oraclestatus";
const Row2 = (): React.ReactElement => {
    return (
        <div className="row-grid section-gap">
            <ParachainSecurity />
            <BtcRelay />
            <OracleStatus />
        </div>
    );
};

export default Row2;
