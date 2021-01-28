import React from "react";
import ParachainSecurity from "../components/parachain-security";
import BtcRelay from "../components/btc-relay";
import OracleStatus from "../components/oracle-status";
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
